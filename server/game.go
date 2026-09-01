package main

import (
	"sync"
)

const MAX_PLAYERS = 6

// GameError is returned by Game methods when an action can't be performed;
// its Code is sent back to the requesting client so the UI can react to it.
type GameError struct {
	Code string
}

func (e *GameError) Error() string {
	return e.Code
}

var (
	errGameFull       = &GameError{ErrCodeGameFull}
	errGameStarted    = &GameError{ErrCodeGameStarted}
	errMinimumPlayers = &GameError{ErrCodeMinimumPlayers}
	errNotYourTurn    = &GameError{ErrCodeNotYourTurn}
	errInvalidMove    = &GameError{ErrCodeInvalidMove}
	errGameNotStarted = &GameError{ErrCodeGameNotStarted}
)

// pendingGiveBack tracks a still-owed voluntary exchange: the président (or
// vice-président) chooses `count` cards of their own to hand to recipientID.
type pendingGiveBack struct {
	count       int
	recipientID string
}

type Game struct {
	mu                   sync.Mutex
	id                   string
	started              bool
	players              map[string]*Player
	playerOrder          []string // player ids in join order, stable across Go's randomized map iteration
	pile                 Pile
	roundEnded           bool
	lastPlayerHasNothing bool

	// End-of-round card exchange: the previous trou du cul/vice trou du cul
	// are forced to give their best cards away as soon as the new hand is
	// dealt, but the président/vice-président choose what they give back -
	// the round can't start until they have.
	exchanging         bool
	pendingGiveBacks   map[string]pendingGiveBack
	nextRoundStarterID string // previous round's trou du cul, who opens the next round
}

func NewGame() *Game {
	return &Game{
		id:      generateID(),
		players: make(map[string]*Player),
		pile:    make(Pile, 0),
	}
}

// GameView is the JSON representation of a game sent to a specific client.
type GameView struct {
	ID                   string                         `json:"id"`
	Started              bool                           `json:"started"`
	Players              map[string]PlayerView          `json:"players"`
	Pile                 Pile                           `json:"pile"`
	RoundEnded           bool                           `json:"roundEnded"`
	LastPlayerHasNothing bool                           `json:"lastPlayerHasNothing"`
	Exchanging           bool                           `json:"exchanging"`
	PendingGiveBacks     map[string]PendingGiveBackView `json:"pendingGiveBacks"`
}

// PendingGiveBackView tells a client that the given player still owes Count
// cards to RecipientID as part of the end-of-round exchange.
type PendingGiveBackView struct {
	Count       int    `json:"count"`
	RecipientID string `json:"recipientId"`
}

// mutateAndBroadcast runs fn while holding the game lock, then - if fn
// succeeds - sends every connected player their view of the resulting state.
// The actual network I/O happens after the lock is released.
func (g *Game) mutateAndBroadcast(fn func() error) error {
	g.mu.Lock()
	err := fn()

	var recipients []*Player
	var views map[string]GameView
	if err == nil {
		recipients, views = g.snapshotLocked()
	}
	g.mu.Unlock()

	if err != nil {
		return err
	}

	for _, p := range recipients {
		p.Send(OutgoingMessage{Type: TypeGameData, Payload: views[p.ID]})
	}

	return nil
}

func (g *Game) snapshotLocked() ([]*Player, map[string]GameView) {
	recipients := make([]*Player, 0, len(g.players))
	playerViews := make(map[string]PlayerView, len(g.players))

	for id, p := range g.players {
		recipients = append(recipients, p)
		playerViews[id] = p.Serialize(false)
	}

	pendingGiveBacks := make(map[string]PendingGiveBackView, len(g.pendingGiveBacks))
	for id, pending := range g.pendingGiveBacks {
		pendingGiveBacks[id] = PendingGiveBackView{Count: pending.count, RecipientID: pending.recipientID}
	}

	views := make(map[string]GameView, len(g.players))
	for _, p := range recipients {
		views[p.ID] = GameView{
			ID:                   g.id,
			Started:              g.started,
			Players:              withOwnCardsRevealed(playerViews, p),
			Pile:                 g.pile,
			RoundEnded:           g.roundEnded,
			LastPlayerHasNothing: g.lastPlayerHasNothing,
			Exchanging:           g.exchanging,
			PendingGiveBacks:     pendingGiveBacks,
		}
	}

	return recipients, views
}

// withOwnCardsRevealed returns a copy of views where the given player's own
// hand is shown in full instead of just its count.
func withOwnCardsRevealed(views map[string]PlayerView, self *Player) map[string]PlayerView {
	result := make(map[string]PlayerView, len(views))
	for id, v := range views {
		if id == self.ID {
			v.Cards = self.cards
		}
		result[id] = v
	}

	return result
}

func (g *Game) AddPlayer(p *Player) error {
	return g.mutateAndBroadcast(func() error {
		if g.started {
			return errGameStarted
		}

		if len(g.players) >= MAX_PLAYERS {
			return errGameFull
		}

		g.players[p.ID] = p
		g.playerOrder = append(g.playerOrder, p.ID)

		return nil
	})
}

func (g *Game) RemovePlayer(p *Player) {
	_ = g.mutateAndBroadcast(func() error {
		if _, exists := g.players[p.ID]; !exists {
			return nil
		}

		if g.started && g.countPlayersLocked() > 2 && p.IsPlaying() {
			g.computeNextTurnLocked()
		}

		delete(g.players, p.ID)
		for i, id := range g.playerOrder {
			if id == p.ID {
				g.playerOrder = append(g.playerOrder[:i], g.playerOrder[i+1:]...)
				break
			}
		}

		if g.started && g.countPlayersLocked() < 2 {
			g.endGameLocked()
		}

		if g.started && g.exchanging {
			delete(g.pendingGiveBacks, p.ID)
			for giver, pending := range g.pendingGiveBacks {
				if pending.recipientID == p.ID {
					delete(g.pendingGiveBacks, giver)
				}
			}

			if len(g.pendingGiveBacks) == 0 {
				g.exchanging = false
				g.computeNextTurnLocked()
			}
		}

		return nil
	})
}

func (g *Game) Start() error {
	return g.mutateAndBroadcast(func() error {
		if g.started {
			return errGameStarted
		}

		if g.countPlayersLocked() < 2 {
			return errMinimumPlayers
		}

		previousRoles := g.previousRolesLocked()

		g.started = true
		g.pile.ClearPile()

		if g.hasPlayerWithNullOrderLocked() {
			g.assignPlayersOrderLocked()
		}

		for _, p := range g.players {
			p.ClearRole()
			p.SetSkipped(false)
			p.SetPlaying(false)
		}

		deck := GroupCard{}
		deck.Generate()
		deck.Shuffle()

		hands := deck.Split(g.countPlayersLocked())
		for i, id := range g.playerOrder {
			g.players[id].SetCards((*hands)[i])
		}

		if previousRoles != nil {
			g.beginExchangeLocked(previousRoles)
		} else {
			g.nextRoundStarterID = ""
			g.computeNextTurnLocked()
		}

		return nil
	})
}

// previousRolesLocked returns the role -> player mapping from the round that
// just ended, or nil if there isn't one (first round, or the player lineup
// changed since the last round ended).
func (g *Game) previousRolesLocked() map[int]*Player {
	n := g.countPlayersLocked()
	roles := make(map[int]*Player, n)

	for _, p := range g.players {
		if p.HasRole() {
			roles[p.GetRole()] = p
		}
	}

	if len(roles) != n {
		return nil
	}

	return roles
}

// beginExchangeLocked applies the forced part of the end-of-round exchange
// (the previous trou du cul/vice trou du cul immediately lose their best
// cards) and records what the président/vice-président still owe back,
// which they choose themselves via Exchange.
func (g *Game) beginExchangeLocked(previousRoles map[int]*Player) {
	n := len(previousRoles)

	president := previousRoles[0]
	asshole := previousRoles[n-1]
	g.nextRoundStarterID = asshole.ID

	g.pendingGiveBacks = make(map[string]pendingGiveBack, 2)

	g.transferBestCardsLocked(asshole, president, 2)
	g.pendingGiveBacks[president.ID] = pendingGiveBack{count: 2, recipientID: asshole.ID}

	if n >= 4 {
		vicePresident := previousRoles[1]
		viceAsshole := previousRoles[n-2]
		g.transferBestCardsLocked(viceAsshole, vicePresident, 1)
		g.pendingGiveBacks[vicePresident.ID] = pendingGiveBack{count: 1, recipientID: viceAsshole.ID}
	}

	g.exchanging = true
}

func (g *Game) transferBestCardsLocked(from *Player, to *Player, count int) {
	to.AddCards(from.TakeBestCards(count))
}

// Exchange is how the président/vice-président hand back the cards they owe
// as part of the end-of-round exchange, once they've received (but not
// necessarily chosen) their own windfall. The round only truly starts once
// every pending give-back has been settled.
func (g *Game) Exchange(p *Player, cards GroupCard) error {
	return g.mutateAndBroadcast(func() error {
		if !g.exchanging {
			return errGameNotStarted
		}

		pending, isPending := g.pendingGiveBacks[p.ID]
		if !isPending {
			return errNotYourTurn
		}

		if len(cards) != pending.count || !p.OwnsCards(cards) {
			return errInvalidMove
		}

		recipient, exists := g.players[pending.recipientID]
		if !exists {
			delete(g.pendingGiveBacks, p.ID)
			return nil
		}

		recipient.AddCards(p.RemoveCards(cards))
		delete(g.pendingGiveBacks, p.ID)

		if len(g.pendingGiveBacks) == 0 {
			g.exchanging = false
			g.computeNextTurnLocked()
		}

		return nil
	})
}

func (g *Game) Play(p *Player, cards GroupCard) error {
	return g.mutateAndBroadcast(func() error {
		if !g.started {
			return errGameNotStarted
		}

		if p.IsSkipped() || !p.IsPlaying() {
			return errNotYourTurn
		}

		if len(cards) < 1 || !p.OwnsCards(cards) {
			return errInvalidMove
		}

		if g.roundEnded {
			g.pile.ClearPile()
			g.roundEnded = false
		}

		if !g.pile.IsMoveLegal(cards, g.lastPlayerHasNothing) {
			return errInvalidMove
		}

		removed := p.RemoveCards(cards)
		g.pile.AddCards(removed)
		g.lastPlayerHasNothing = false

		if !p.HasCardsLeft() {
			p.SetRole(g.countPlayersWithRoleLocked())
		}

		if g.countPlayersWithRoleLocked() == g.countPlayersLocked()-1 {
			g.endGameLocked()
			return nil
		}

		g.computeNextTurnLocked()

		return nil
	})
}

func (g *Game) Skip(p *Player) error {
	return g.mutateAndBroadcast(func() error {
		if !g.started {
			return errGameNotStarted
		}

		if p.IsSkipped() || !p.IsPlaying() {
			return errNotYourTurn
		}

		if g.roundEnded {
			g.pile.ClearPile()
			g.roundEnded = false
		}

		p.SetSkipped(true)
		g.computeNextTurnLocked()

		return nil
	})
}

// Nothing signals that the player has nothing matching the pair that just
// skipped everyone else's turn, which lifts the "same value" restriction on
// the next move (the "X ou rien" rule).
func (g *Game) Nothing(p *Player) error {
	return g.mutateAndBroadcast(func() error {
		if !g.started {
			return errGameNotStarted
		}

		if p.IsSkipped() || !p.IsPlaying() {
			return errNotYourTurn
		}

		g.lastPlayerHasNothing = true
		g.computeNextTurnLocked()

		return nil
	})
}

func (g *Game) computeNextTurnLocked() {
	if g.pile.IsPileCompleted() {
		g.endRoundLocked()
		return
	}

	if !g.canSomeoneStillPlayOnRoundLocked() {
		g.endRoundLocked()
		return
	}

	currentPlayer := g.findPlayerIsPlayingLocked(true)
	if currentPlayer == nil {
		first := g.startingPlayerLocked()
		if first != nil {
			first.SetPlaying(true)
		}
		return
	}

	total := g.countPlayersLocked()
	currentOrder := currentPlayer.GetOrder()

	var nextPlayer *Player
	for {
		if currentOrder+1 > total {
			nextPlayer = g.findPlayerWithOrderLocked(1)
			currentOrder = 1
		} else {
			nextPlayer = g.findPlayerWithOrderLocked(currentOrder + 1)
			if nextPlayer != nil {
				currentOrder = nextPlayer.GetOrder()
			}
		}

		if !g.canSomeoneStillPlayOnRoundLocked() {
			g.endRoundLocked()
			return
		}

		if nextPlayer != nil && !nextPlayer.IsSkipped() && !nextPlayer.HasRole() {
			break
		}
	}

	currentPlayer.SetPlaying(false)
	nextPlayer.SetPlaying(true)

	if g.hasAllOtherPlayersSkippedLocked(nextPlayer.ID) {
		g.endRoundLocked()
	}
}

func (g *Game) endRoundLocked() {
	g.roundEnded = true
	g.lastPlayerHasNothing = false

	for _, p := range g.players {
		p.SetSkipped(false)
	}
}

func (g *Game) endGameLocked() {
	g.started = false
	g.lastPlayerHasNothing = false
	g.exchanging = false
	g.pendingGiveBacks = nil

	for _, p := range g.players {
		p.SetSkipped(false)
		p.SetPlaying(false)
		if !p.HasRole() {
			p.SetRole(g.countPlayersWithRoleLocked())
		}
	}
}

func (g *Game) assignPlayersOrderLocked() {
	for i, id := range g.playerOrder {
		g.players[id].SetOrder(i + 1)
	}
}

func (g *Game) hasPlayerWithNullOrderLocked() bool {
	for _, p := range g.players {
		if !p.HasOrder() {
			return true
		}
	}

	return false
}

func (g *Game) hasAllOtherPlayersSkippedLocked(currentPlayerID string) bool {
	for id, p := range g.players {
		if id != currentPlayerID && !p.IsSkipped() {
			return false
		}
	}

	return true
}

func (g *Game) findPlayerIsPlayingLocked(playing bool) *Player {
	for _, p := range g.players {
		if p.IsPlaying() == playing {
			return p
		}
	}

	return nil
}

func (g *Game) canSomeoneStillPlayOnRoundLocked() bool {
	for _, p := range g.players {
		if !p.IsSkipped() && !p.HasRole() {
			return true
		}
	}

	return false
}

// startingPlayerLocked returns who opens a fresh round: the previous round's
// trou du cul once one has been recorded, otherwise the player in seat 1.
func (g *Game) startingPlayerLocked() *Player {
	if g.nextRoundStarterID != "" {
		if p, exists := g.players[g.nextRoundStarterID]; exists {
			return p
		}
	}

	return g.findPlayerWithOrderLocked(1)
}

func (g *Game) findPlayerWithOrderLocked(order int) *Player {
	for _, p := range g.players {
		if p.HasOrder() && p.GetOrder() == order {
			return p
		}
	}

	return nil
}

func (g *Game) countPlayersWithRoleLocked() int {
	count := 0
	for _, p := range g.players {
		if p.HasRole() {
			count++
		}
	}

	return count
}

func (g *Game) countPlayersLocked() int {
	return len(g.players)
}

func (g *Game) CountPlayers() int {
	g.mu.Lock()
	defer g.mu.Unlock()

	return g.countPlayersLocked()
}

func (g *Game) HasStarted() bool {
	g.mu.Lock()
	defer g.mu.Unlock()

	return g.started
}

func (g *Game) HasPlayer(id string) bool {
	g.mu.Lock()
	defer g.mu.Unlock()

	_, exists := g.players[id]
	return exists
}

func (g *Game) IsEmpty() bool {
	g.mu.Lock()
	defer g.mu.Unlock()

	return len(g.players) == 0
}
