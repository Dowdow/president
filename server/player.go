package main

import (
	"log"
	"sort"
	"sync"
)

// Conn is the subset of *websocket.Conn that Player depends on. Depending on
// this narrow interface (instead of the concrete gorilla type) lets tests
// exercise the game logic with a fake, in-memory connection.
type Conn interface {
	ReadJSON(v any) error
	WriteJSON(v any) error
	Close() error
}

type Player struct {
	ID       string
	username string
	conn     Conn
	sendMu   sync.Mutex // serializes writes to conn: two overlapping broadcasts can otherwise write concurrently
	game     *Game
	director *Director
	cards    GroupCard
	playing  bool
	skipped  bool
	role     *int
	order    *int
	x        float32
	y        float32
}

func NewPlayer(id string, username string, conn Conn, game *Game, director *Director) *Player {
	return &Player{
		ID:       id,
		username: username,
		conn:     conn,
		game:     game,
		director: director,
		cards:    make(GroupCard, 0),
		x:        0,
		y:        0,
	}
}

func (p *Player) HasCardsLeft() bool {
	return len(p.cards) > 0
}

func (p *Player) OwnsCards(g GroupCard) bool {
	cardsOwned := 0

	for _, c := range g {
		for _, c2 := range p.cards {
			if c.IsEqualTo(c2) {
				cardsOwned++
			}
		}
	}

	return cardsOwned == len(g)
}

// RemoveCards removes the given cards from the player's hand and returns the
// removed cards. It assumes OwnsCards(g) has already been checked by the caller.
func (p *Player) RemoveCards(g GroupCard) GroupCard {
	removed := make(GroupCard, 0, len(g))

	for _, c := range g {
		for i, owned := range p.cards {
			if owned.IsEqualTo(c) {
				removed = append(removed, owned)
				p.cards = append(p.cards[:i], p.cards[i+1:]...)
				break
			}
		}
	}

	return removed
}

func (p *Player) IsPlaying() bool {
	return p.playing
}

func (p *Player) SetPlaying(playing bool) {
	p.playing = playing
}

func (p *Player) IsSkipped() bool {
	return p.skipped
}

func (p *Player) SetSkipped(skipped bool) {
	p.skipped = skipped
}

func (p *Player) HasRole() bool {
	return p.role != nil
}

func (p *Player) GetRole() int {
	if p.role == nil {
		return -1
	}

	return *p.role
}

func (p *Player) SetRole(role int) {
	p.role = &role
}

func (p *Player) ClearRole() {
	p.role = nil
}

func (p *Player) GetOrder() int {
	if p.order == nil {
		return 0
	}

	return *p.order
}

func (p *Player) HasOrder() bool {
	return p.order != nil
}

func (p *Player) SetOrder(order int) {
	p.order = &order
}

func (p *Player) SetCards(cards GroupCard) {
	p.cards = cards
}

// AddCards adds cards to the player's hand, e.g. cards received in the
// end-of-round exchange.
func (p *Player) AddCards(cards GroupCard) {
	p.cards = append(p.cards, cards...)
}

// TakeBestCards removes and returns up to count of the player's highest value
// cards. It's used for the forced end-of-round exchange, where the "trou du
// cul"/"vice trou du cul" have no choice over which cards they give up.
func (p *Player) TakeBestCards(count int) GroupCard {
	if count > len(p.cards) {
		count = len(p.cards)
	}

	sorted := make(GroupCard, len(p.cards))
	copy(sorted, p.cards)
	sort.Slice(sorted, func(i, j int) bool {
		return sorted[i].Value > sorted[j].Value
	})

	taken := sorted[:count]
	for _, c := range taken {
		for i, owned := range p.cards {
			if owned == c {
				p.cards = append(p.cards[:i], p.cards[i+1:]...)
				break
			}
		}
	}

	return taken
}

func (p *Player) SetPosition(x, y float32) {
	p.x = x
	p.y = y
}

func (p *Player) Listen() {
	defer func() {
		p.game.RemovePlayer(p)
		p.director.RemoveGameIfEmpty(p.game.id)
		p.conn.Close()
	}()

	for {
		var message IncomingMessage
		err := p.conn.ReadJSON(&message)
		if err != nil {
			return
		}

		if message.Action == ActionLeave {
			return
		}

		p.handleMessage(message)
	}
}

func (p *Player) Send(message OutgoingMessage) {
	p.sendMu.Lock()
	defer p.sendMu.Unlock()

	if err := p.conn.WriteJSON(message); err != nil {
		log.Println("Error while sending JSON :", err)
	}
}

// PlayerView is the JSON representation of a player sent to clients.
// Cards is either the full hand (for the player themselves) or just the count
// (for opponents), matching what the old server did to avoid leaking hands.
type PlayerView struct {
	ID       string `json:"id"`
	Username string `json:"username"`
	Playing  bool   `json:"playing"`
	Skipped  bool   `json:"skipped"`
	Role     *int   `json:"role"`
	Order    *int   `json:"order"`
	Cards    any    `json:"cards"`
}

func (p *Player) Serialize(showCards bool) PlayerView {
	var cards any
	if showCards {
		cards = p.cards
	} else {
		cards = len(p.cards)
	}

	return PlayerView{
		ID:       p.ID,
		Username: p.username,
		Playing:  p.playing,
		Skipped:  p.skipped,
		Role:     p.role,
		Order:    p.order,
		Cards:    cards,
	}
}
