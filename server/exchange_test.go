package main

import "testing"

// setupRolesFromPreviousRound wires up a game whose players already carry
// roles from a round that "just ended", so that the next Start() call goes
// through the end-of-round exchange instead of a fresh first deal.
func setupRolesFromPreviousRound(t *testing.T, playerCount int) *Game {
	t.Helper()

	g := NewGame()
	for i := 0; i < playerCount; i++ {
		p, _ := newTestPlayer("player", g)
		mustAddPlayer(t, g, p)
		p.SetOrder(i + 1)
		p.SetRole(i)
	}

	return g
}

func playerWithRole(g *Game, role int) *Player {
	for _, p := range g.players {
		if p.HasRole() && p.GetRole() == role {
			return p
		}
	}
	return nil
}

func TestFirstRoundHasNoExchange(t *testing.T) {
	g := NewGame()
	p1, _ := newTestPlayer("Alice", g)
	p2, _ := newTestPlayer("Bob", g)
	mustAddPlayer(t, g, p1)
	mustAddPlayer(t, g, p2)

	if err := g.Start(); err != nil {
		t.Fatalf("expected the game to start, got error %v", err)
	}

	if g.exchanging {
		t.Fatal("expected no exchange on the very first round")
	}

	playing := 0
	for _, p := range []*Player{p1, p2} {
		if p.IsPlaying() {
			playing++
		}
	}
	if playing != 1 {
		t.Fatalf("expected exactly one player to be playing, got %d", playing)
	}
}

func TestExchangeForcesAsssholeToGiveBestCardsToPresident(t *testing.T) {
	g := setupRolesFromPreviousRound(t, 2)
	president := playerWithRole(g, 0)
	asshole := playerWithRole(g, 1)

	if err := g.Start(); err != nil {
		t.Fatalf("expected the game to start, got error %v", err)
	}

	if !g.exchanging {
		t.Fatal("expected the game to be waiting on the exchange")
	}

	if g.started == false {
		t.Fatal("expected the game to be marked started while the exchange resolves")
	}

	if len(president.cards) != 28 {
		t.Fatalf("expected the président to have received 2 extra cards (28 total), got %d", len(president.cards))
	}
	if len(asshole.cards) != 24 {
		t.Fatalf("expected the trou du cul to have lost 2 cards (24 total), got %d", len(asshole.cards))
	}

	pending, isPending := g.pendingGiveBacks[president.ID]
	if !isPending || pending.count != 2 || pending.recipientID != asshole.ID {
		t.Fatalf("expected the président to owe 2 cards to the trou du cul, got %+v (pending=%v)", pending, isPending)
	}

	if president.IsPlaying() || asshole.IsPlaying() {
		t.Fatal("expected nobody to be playing yet while the exchange is pending")
	}
}

func TestExchangeGiveBackStartsTheRoundWithPreviousAsshole(t *testing.T) {
	g := setupRolesFromPreviousRound(t, 2)
	president := playerWithRole(g, 0)
	asshole := playerWithRole(g, 1)

	if err := g.Start(); err != nil {
		t.Fatalf("expected the game to start, got error %v", err)
	}

	chosen := president.cards[:2]
	if err := g.Exchange(president, chosen); err != nil {
		t.Fatalf("expected the exchange to succeed, got error %v", err)
	}

	if g.exchanging {
		t.Fatal("expected the exchange to be over")
	}

	if len(president.cards) != 26 || len(asshole.cards) != 26 {
		t.Fatalf("expected both hands back to 26 cards, got president=%d asshole=%d", len(president.cards), len(asshole.cards))
	}

	if !asshole.IsPlaying() {
		t.Fatal("expected the previous trou du cul to open the new round")
	}
}

func TestExchangeRejectsWrongCardCount(t *testing.T) {
	g := setupRolesFromPreviousRound(t, 2)
	president := playerWithRole(g, 0)

	if err := g.Start(); err != nil {
		t.Fatalf("expected the game to start, got error %v", err)
	}

	if err := g.Exchange(president, president.cards[:1]); err != errInvalidMove {
		t.Fatalf("expected errInvalidMove for the wrong card count, got %v", err)
	}
}

func TestExchangeRejectsPlayerWhoOwesNothing(t *testing.T) {
	g := setupRolesFromPreviousRound(t, 2)
	asshole := playerWithRole(g, 1)

	if err := g.Start(); err != nil {
		t.Fatalf("expected the game to start, got error %v", err)
	}

	if err := g.Exchange(asshole, asshole.cards[:2]); err != errNotYourTurn {
		t.Fatalf("expected errNotYourTurn, got %v", err)
	}
}

func TestExchangeWithFourPlayersIncludesViceRoles(t *testing.T) {
	g := setupRolesFromPreviousRound(t, 4)
	president := playerWithRole(g, 0)
	vicePresident := playerWithRole(g, 1)
	viceAsshole := playerWithRole(g, 2)
	asshole := playerWithRole(g, 3)

	if err := g.Start(); err != nil {
		t.Fatalf("expected the game to start, got error %v", err)
	}

	if len(g.pendingGiveBacks) != 2 {
		t.Fatalf("expected 2 pending give-backs (président + vice-président), got %d", len(g.pendingGiveBacks))
	}

	if len(president.cards) != 15 {
		t.Fatalf("expected the président to hold 15 cards (13 + 2), got %d", len(president.cards))
	}
	if len(vicePresident.cards) != 14 {
		t.Fatalf("expected the vice-président to hold 14 cards (13 + 1), got %d", len(vicePresident.cards))
	}
	if len(asshole.cards) != 11 {
		t.Fatalf("expected the trou du cul to hold 11 cards (13 - 2), got %d", len(asshole.cards))
	}
	if len(viceAsshole.cards) != 12 {
		t.Fatalf("expected the vice-trou du cul to hold 12 cards (13 - 1), got %d", len(viceAsshole.cards))
	}

	if err := g.Exchange(president, president.cards[:2]); err != nil {
		t.Fatalf("expected the président's exchange to succeed, got %v", err)
	}
	if g.exchanging == false {
		t.Fatal("expected the exchange to still be pending after only one of two give-backs")
	}

	if err := g.Exchange(vicePresident, vicePresident.cards[:1]); err != nil {
		t.Fatalf("expected the vice-président's exchange to succeed, got %v", err)
	}

	if g.exchanging {
		t.Fatal("expected the exchange to be over once both give-backs are done")
	}

	if !asshole.IsPlaying() {
		t.Fatal("expected the previous trou du cul to open the new round")
	}
}

func TestExchangeWithThreePlayersHasNoViceRoles(t *testing.T) {
	g := setupRolesFromPreviousRound(t, 3)

	if err := g.Start(); err != nil {
		t.Fatalf("expected the game to start, got error %v", err)
	}

	if len(g.pendingGiveBacks) != 1 {
		t.Fatalf("expected only the président to owe cards with 3 players, got %d pending", len(g.pendingGiveBacks))
	}
}
