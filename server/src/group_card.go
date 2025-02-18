package main

import (
	"math/rand"
	"time"
)

type GroupCard []*Card

func (g *GroupCard) Reduce() int {
	result := 0
	for _, card := range *g {
		result += card.value
	}

	return result
}

func (g *GroupCard) Generate() {
	*g = GroupCard{}

	for _, f := range CardFamilies {
		for _, v := range CardValues {
			*g = append(*g, &Card{familly: f, value: v})
		}
	}
}

func (g *GroupCard) Shuffle() {
	r := rand.New(rand.NewSource(time.Now().UnixNano()))

	r.Shuffle(len(*g), func(i, j int) {
		(*g)[i], (*g)[j] = (*g)[j], (*g)[i]
	})
}

func (g *GroupCard) Split(playerTotal int) *[]GroupCard {
	decks := make([]GroupCard, playerTotal)

	player := 0
	for _, c := range *g {
		if player >= playerTotal {
			player = 0
		}

		decks[player] = append(decks[player], c)

		player++
	}

	return &decks
}
