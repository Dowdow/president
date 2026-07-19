package main

import "testing"

func newCard(value int) *Card {
	return &Card{Value: value, Family: CardFamilySpade}
}

func TestAddPlayerRejectsWhenFull(t *testing.T) {
	g := NewGame()

	for i := 0; i < maxPlayers; i++ {
		p, _ := newTestPlayer("player", g)
		if err := g.AddPlayer(p); err != nil {
			t.Fatalf("expected player %d to be added, got error %v", i, err)
		}
	}

	extra, _ := newTestPlayer("extra", g)
	if err := g.AddPlayer(extra); err != errGameFull {
		t.Fatalf("expected errGameFull, got %v", err)
	}
}

func TestAddPlayerRejectsWhenStarted(t *testing.T) {
	g := NewGame()
	p1, _ := newTestPlayer("Alice", g)
	p2, _ := newTestPlayer("Bob", g)
	mustAddPlayer(t, g, p1)
	mustAddPlayer(t, g, p2)

	if err := g.Start(); err != nil {
		t.Fatalf("expected game to start, got error %v", err)
	}

	late, _ := newTestPlayer("Carol", g)
	if err := g.AddPlayer(late); err != errGameStarted {
		t.Fatalf("expected errGameStarted, got %v", err)
	}
}

func TestStartRequiresMinimumPlayers(t *testing.T) {
	g := NewGame()
	p1, _ := newTestPlayer("Alice", g)
	mustAddPlayer(t, g, p1)

	if err := g.Start(); err != errMinimumPlayers {
		t.Fatalf("expected errMinimumPlayers, got %v", err)
	}
}

func TestStartDealsAllCardsAndPicksFirstPlayer(t *testing.T) {
	g := NewGame()
	p1, _ := newTestPlayer("Alice", g)
	p2, _ := newTestPlayer("Bob", g)
	p3, _ := newTestPlayer("Carol", g)
	mustAddPlayer(t, g, p1)
	mustAddPlayer(t, g, p2)
	mustAddPlayer(t, g, p3)

	if err := g.Start(); err != nil {
		t.Fatalf("expected game to start, got error %v", err)
	}

	total := len(p1.cards) + len(p2.cards) + len(p3.cards)
	if total != len(CardFamilies)*len(CardValues) {
		t.Fatalf("expected all 52 cards to be dealt, got %d", total)
	}

	playing := 0
	for _, p := range []*Player{p1, p2, p3} {
		if !p.HasOrder() {
			t.Fatalf("expected every player to have an order assigned")
		}
		if p.IsPlaying() {
			playing++
		}
	}

	if playing != 1 {
		t.Fatalf("expected exactly one player to be marked as playing, got %d", playing)
	}
}

func TestPlayRejectsCardsNotOwned(t *testing.T) {
	g := twoPlayerGameInProgress()
	p1 := g.players[g.playerOrder[0]]

	if err := g.Play(p1, cardsOf(CardValueKing)); err != errInvalidMove {
		t.Fatalf("expected errInvalidMove, got %v", err)
	}
}

func TestPlayRejectsWhenNotYourTurn(t *testing.T) {
	g := twoPlayerGameInProgress()
	p2 := g.players[g.playerOrder[1]]

	if err := g.Play(p2, cardsOf(CardValueFour)); err != errNotYourTurn {
		t.Fatalf("expected errNotYourTurn, got %v", err)
	}
}

func TestPlayRejectsLowerValue(t *testing.T) {
	g := twoPlayerGameInProgress()
	p1 := g.players[g.playerOrder[0]]
	p1.SetCards(GroupCard{newCard(CardValueFour)})

	// Put a seven on the pile, played by nobody in particular for this test.
	g.pile.AddCards(cardsOf(CardValueSeven))

	if err := g.Play(p1, cardsOf(CardValueFour)); err != errInvalidMove {
		t.Fatalf("expected errInvalidMove for a lower value, got %v", err)
	}
}

// twoPlayerGameInProgress sets up a two-player game with deterministic hands
// and player 1 already playing, bypassing Start()'s random shuffle so tests
// can assert exact outcomes.
func twoPlayerGameInProgress() *Game {
	g := NewGame()
	p1, _ := newTestPlayer("Alice", g)
	p2, _ := newTestPlayer("Bob", g)
	_ = g.AddPlayer(p1)
	_ = g.AddPlayer(p2)

	g.started = true
	p1.SetOrder(1)
	p2.SetOrder(2)
	p1.SetCards(GroupCard{newCard(CardValueThree)})
	p2.SetCards(GroupCard{newCard(CardValueFive)})
	p1.SetPlaying(true)

	return g
}

func mustAddPlayer(t *testing.T, g *Game, p *Player) {
	t.Helper()
	if err := g.AddPlayer(p); err != nil {
		t.Fatalf("expected player to be added, got error %v", err)
	}
}

func TestPlayingLastCardEndsTwoPlayerGame(t *testing.T) {
	g := twoPlayerGameInProgress()
	p1 := g.players[g.playerOrder[0]]
	p2 := g.players[g.playerOrder[1]]

	if err := g.Play(p1, cardsOf(CardValueThree)); err != nil {
		t.Fatalf("expected the play to succeed, got error %v", err)
	}

	if g.started {
		t.Fatal("expected the game to end once only one player has cards left")
	}

	if p1.GetRole() != 0 {
		t.Fatalf("expected the first player out to get role 0, got %d", p1.GetRole())
	}

	if p2.GetRole() != 1 {
		t.Fatalf("expected the remaining player to get role 1, got %d", p2.GetRole())
	}
}

func TestSkipEndsRoundWhenAllOthersSkipped(t *testing.T) {
	g := twoPlayerGameInProgress()
	p1 := g.players[g.playerOrder[0]]
	p2 := g.players[g.playerOrder[1]]
	p1.SetCards(GroupCard{newCard(CardValueThree), newCard(CardValueFour)})

	if err := g.Play(p1, cardsOf(CardValueFour)); err != nil {
		t.Fatalf("expected the play to succeed, got error %v", err)
	}

	if err := g.Skip(p2); err != nil {
		t.Fatalf("expected the skip to succeed, got error %v", err)
	}

	if !g.roundEnded {
		t.Fatal("expected the round to end once the only other player skipped")
	}

	if !p1.IsPlaying() {
		t.Fatal("expected play to come back to the player everyone else skipped on")
	}
}

func TestNothingLiftsXOrNothingRestriction(t *testing.T) {
	g := NewGame()
	p1, _ := newTestPlayer("Alice", g)
	p2, _ := newTestPlayer("Bob", g)
	p3, _ := newTestPlayer("Carol", g)
	mustAddPlayer(t, g, p1)
	mustAddPlayer(t, g, p2)
	mustAddPlayer(t, g, p3)

	g.started = true
	p1.SetOrder(1)
	p2.SetOrder(2)
	p3.SetOrder(3)
	p1.SetCards(GroupCard{newCard(CardValueSeven)})
	p2.SetCards(GroupCard{newCard(CardValueEight)})
	p3.SetCards(GroupCard{newCard(CardValueNine)})
	g.pile = Pile{cardsOf(CardValueSix), cardsOf(CardValueSix)}
	p3.SetPlaying(true)

	if err := g.Nothing(p3); err != nil {
		t.Fatalf("expected nothing to succeed, got %v", err)
	}

	if !g.lastPlayerHasNothing {
		t.Fatal("expected lastPlayerHasNothing to be recorded")
	}

	if !p1.IsPlaying() {
		t.Fatal("expected the turn to move to the next player in order")
	}

	// After two sixes in a row, only a six would normally be legal; "nothing"
	// should have lifted that restriction so Alice can play her seven.
	if err := g.Play(p1, cardsOf(CardValueSeven)); err != nil {
		t.Fatalf("expected the restriction to be lifted, got error %v", err)
	}
}

func TestRemovePlayerEndsGameWhenOnePlayerRemains(t *testing.T) {
	g := NewGame()
	p1, _ := newTestPlayer("Alice", g)
	p2, _ := newTestPlayer("Bob", g)
	p3, _ := newTestPlayer("Carol", g)
	mustAddPlayer(t, g, p1)
	mustAddPlayer(t, g, p2)
	mustAddPlayer(t, g, p3)

	if err := g.Start(); err != nil {
		t.Fatalf("expected game to start, got error %v", err)
	}

	g.RemovePlayer(p2)
	g.RemovePlayer(p3)

	if g.HasStarted() {
		t.Fatal("expected the game to end once fewer than two players remain")
	}
}

func TestBroadcastHidesOtherPlayersCards(t *testing.T) {
	g := twoPlayerGameInProgress()
	c1 := connOf(g, 0)
	p1 := g.players[g.playerOrder[0]]

	if err := g.Play(p1, cardsOf(CardValueThree)); err != nil {
		t.Fatalf("expected the play to succeed, got error %v", err)
	}

	msg, ok := c1.lastMessage()
	if !ok {
		t.Fatal("expected player 1 to receive a broadcast")
	}

	view, ok := msg.Payload.(GameView)
	if !ok {
		t.Fatalf("expected a GameView payload, got %T", msg.Payload)
	}

	p2 := g.players[g.playerOrder[1]]
	opponentView := view.Players[p2.ID]
	if _, isCount := opponentView.Cards.(int); !isCount {
		t.Fatalf("expected the opponent's cards to be hidden as a count, got %T", opponentView.Cards)
	}
}

func connOf(g *Game, index int) *fakeConn {
	p := g.players[g.playerOrder[index]]
	return p.conn.(*fakeConn)
}
