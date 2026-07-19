package main

import "testing"

func TestCardIsEqualTo(t *testing.T) {
	a := &Card{Value: CardValueKing, Family: CardFamilyHeart}
	b := &Card{Value: CardValueKing, Family: CardFamilyHeart}
	c := &Card{Value: CardValueKing, Family: CardFamilySpade}
	d := &Card{Value: CardValueQueen, Family: CardFamilyHeart}

	if !a.IsEqualTo(b) {
		t.Error("expected cards with the same value and family to be equal")
	}

	if a.IsEqualTo(c) {
		t.Error("expected cards with different families to be different")
	}

	if a.IsEqualTo(d) {
		t.Error("expected cards with different values to be different")
	}
}

func TestIsValidCardValue(t *testing.T) {
	if !IsValidCardValue(CardValueTwo) {
		t.Error("expected the two (max value) to be a valid card value")
	}

	if IsValidCardValue(1) {
		t.Error("expected 1 not to be a valid card value")
	}

	if IsValidCardValue(16) {
		t.Error("expected 16 not to be a valid card value")
	}
}

func TestIsValidCardFamily(t *testing.T) {
	if !IsValidCardFamily(CardFamilyClub) {
		t.Error("expected club to be a valid family")
	}

	if IsValidCardFamily(4) {
		t.Error("expected 4 not to be a valid family")
	}

	if IsValidCardFamily(-1) {
		t.Error("expected -1 not to be a valid family")
	}
}
