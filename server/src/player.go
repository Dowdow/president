package main

import (
	"log"

	"github.com/gorilla/websocket"
)

type Player struct {
	username string
	conn     *websocket.Conn
	game     *Game
	cards    GroupCard
	x        float32
	y        float32
}

func NewPlayer(username string, conn *websocket.Conn, game *Game) *Player {
	return &Player{
		username: username,
		conn:     conn,
		game:     game,
		cards:    make(GroupCard, 0),
		x:        0,
		y:        0,
	}
}

func (p *Player) HasCardsLeft() bool {
	return len(p.cards) > 0
}

func (p *Player) OwnsCards(g *GroupCard) bool {
	cardsOwned := 0

	for _, c := range *g {
		for _, c2 := range p.cards {
			if c.IsEqualTo(c2) {
				cardsOwned++
			}
		}
	}

	return cardsOwned == len(*g)
}

func (p *Player) Listen() {
	for {
		var message Message
		err := p.conn.ReadJSON(message)
		if err != nil {
			log.Println("Error while reading JSON :", err)
			return
		}

		message.player = p
		p.game.messages <- message
	}
}

func (p *Player) Send(json map[string]string) {
	err := p.conn.WriteJSON(json)
	if err != nil {
		log.Println("Error while sending JSON :", err)
	}
}
