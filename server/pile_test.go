package main

import "testing"

func cardsOf(values ...int) GroupCard {
	g := make(GroupCard, 0, len(values))
	for _, v := range values {
		g = append(g, &Card{Value: v, Family: CardFamilySpade})
	}

	return g
}

func TestIsMoveLegalOnEmptyPile(t *testing.T) {
	p := Pile{}

	if !p.IsMoveLegal(cardsOf(CardValueThree), false) {
		t.Error("expected any move to be legal on an empty pile")
	}
}

func TestIsMoveLegalRejectsMixedValues(t *testing.T) {
	p := Pile{}

	if p.IsMoveLegal(cardsOf(CardValueThree, CardValueFour), false) {
		t.Error("expected a group with mixed values to be illegal")
	}
}

func TestIsMoveLegalRejectsDifferentGroupSize(t *testing.T) {
	p := Pile{cardsOf(CardValueFour)}

	if p.IsMoveLegal(cardsOf(CardValueFive, CardValueFive), false) {
		t.Error("expected a move with a different card count than the pile to be illegal")
	}
}

func TestIsMoveLegalRequiresHigherOrEqualValue(t *testing.T) {
	p := Pile{cardsOf(CardValueSeven)}

	if p.IsMoveLegal(cardsOf(CardValueSix), false) {
		t.Error("expected a lower value move to be illegal")
	}

	if !p.IsMoveLegal(cardsOf(CardValueSeven), false) {
		t.Error("expected an equal value move to be legal")
	}

	if !p.IsMoveLegal(cardsOf(CardValueEight), false) {
		t.Error("expected a higher value move to be legal")
	}
}

func TestIsMoveLegalXOrNothingRule(t *testing.T) {
	// Two identical single-card moves in a row lock the next move to that
	// same value, unless the current player has announced "nothing".
	p := Pile{cardsOf(CardValueSeven), cardsOf(CardValueSeven)}

	if p.IsMoveLegal(cardsOf(CardValueEight), false) {
		t.Error("expected only the matching value to be legal after a repeated pair, when the player has something")
	}

	if !p.IsMoveLegal(cardsOf(CardValueSeven), false) {
		t.Error("expected the matching value to remain legal")
	}

	if !p.IsMoveLegal(cardsOf(CardValueEight), true) {
		t.Error("expected any higher value to be legal when the player declared having nothing")
	}
}

func TestIsPileCompletedEmptyPile(t *testing.T) {
	p := Pile{}

	if p.IsPileCompleted() {
		t.Error("expected an empty pile not to be completed")
	}
}

func TestIsPileCompletedOnMaxValue(t *testing.T) {
	p := Pile{cardsOf(CardValueFive), cardsOf(CardValueTwo)}

	if !p.IsPileCompleted() {
		t.Error("expected playing the max value card to complete the pile")
	}
}

func TestIsPileCompletedOnFourOfAKindInOneMove(t *testing.T) {
	p := Pile{cardsOf(CardValueEight, CardValueEight, CardValueEight, CardValueEight)}

	if !p.IsPileCompleted() {
		t.Error("expected playing 4 cards at once to complete the pile")
	}
}

func TestIsPileCompletedOnMagicSquareOfSingles(t *testing.T) {
	p := Pile{
		cardsOf(CardValueNine),
		cardsOf(CardValueNine),
		cardsOf(CardValueNine),
		cardsOf(CardValueNine),
	}

	if !p.IsPileCompleted() {
		t.Error("expected four consecutive single moves of the same value to complete the pile")
	}
}

func TestIsPileCompletedOnMagicSquareOfPairs(t *testing.T) {
	p := Pile{
		cardsOf(CardValueTen, CardValueTen),
		cardsOf(CardValueTen, CardValueTen),
	}

	if !p.IsPileCompleted() {
		t.Error("expected two consecutive pair moves of the same value to complete the pile")
	}
}

func TestIsPileCompletedNotYetCompleted(t *testing.T) {
	p := Pile{cardsOf(CardValueFive), cardsOf(CardValueSix)}

	if p.IsPileCompleted() {
		t.Error("expected an in-progress pile not to be completed")
	}
}
