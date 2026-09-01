package main

import "testing"

func TestGroupCardGenerate(t *testing.T) {
	g := GroupCard{}
	g.Generate()

	if len(g) != len(CardFamilies)*len(CardValues) {
		t.Fatalf("expected %d cards, got %d", len(CardFamilies)*len(CardValues), len(g))
	}

	seen := make(map[Card]bool)
	for _, c := range g {
		key := Card{Value: c.Value, Family: c.Family}
		if seen[key] {
			t.Fatalf("duplicate card generated: %+v", key)
		}
		seen[key] = true
	}
}

func TestGroupCardShuffleKeepsSameCards(t *testing.T) {
	g := GroupCard{}
	g.Generate()

	before := make(map[Card]int)
	for _, c := range g {
		before[Card{Value: c.Value, Family: c.Family}]++
	}

	g.Shuffle()

	after := make(map[Card]int)
	for _, c := range g {
		after[Card{Value: c.Value, Family: c.Family}]++
	}

	if len(before) != len(after) {
		t.Fatalf("shuffle changed the number of distinct cards")
	}

	for card, count := range before {
		if after[card] != count {
			t.Fatalf("shuffle changed the multiset of cards, missing %+v", card)
		}
	}
}

func TestGroupCardSplitDealsAllCardsEvenly(t *testing.T) {
	g := GroupCard{}
	g.Generate()

	playerTotal := 4
	hands := g.Split(playerTotal)

	if len(*hands) != playerTotal {
		t.Fatalf("expected %d hands, got %d", playerTotal, len(*hands))
	}

	total := 0
	for _, hand := range *hands {
		total += len(hand)
		if len(hand) < len(g)/playerTotal {
			t.Fatalf("hand is smaller than expected: %d cards", len(hand))
		}
	}

	if total != len(g) {
		t.Fatalf("expected all %d cards to be dealt, got %d", len(g), total)
	}
}

func TestGroupCardReduce(t *testing.T) {
	g := GroupCard{
		&Card{Value: CardValueThree, Family: CardFamilySpade},
		&Card{Value: CardValueFour, Family: CardFamilyHeart},
	}

	if got := g.Reduce(); got != CardValueThree+CardValueFour {
		t.Fatalf("expected reduce to sum values, got %d", got)
	}
}
