package main

import (
	"fmt"
	"math/rand"
	"time"
)

type Game struct {
	id         string
	players    []*Player
	register   chan int
	unregister chan int
	messages   chan Message
}

func NewGame() *Game {
	r := rand.New(rand.NewSource(time.Now().UnixNano()))

	return &Game{
		id:         fmt.Sprintf("%08x-%04x-%04x-%04x-%012x", r.Uint32(), r.Uint32()&0xFFFF, (r.Uint32()&0x0FFF)|0x4000, (r.Uint32()&0x3FFF)|0x8000, r.Uint64()&0xFFFFFFFFFFFF),
		players:    make([]*Player, 0),
		register:   make(chan int),
		unregister: make(chan int),
		messages:   make(chan Message),
	}
}

func (g *Game) AddPlayer(p *Player) {
	g.players = append(g.players, p)
}

func (g *Game) Run() {
	for {
		select {
		case <-g.register:
			// Envoyer le state à tous les joueurs ?
		case <-g.unregister:
			// Envoyer le state à tous les joueurs ?
			// Vérifier si la game n'est pas vide et s'auto couper ?
		case message := <-g.messages:
			switch message.Action {
			case ActionMove:
			case ActionPass:
			case ActionPlay:
			default:
				continue
			}
			// On determine l'action que le joueur veut effectuer
			// On vérifie si cette action est possible
			// On change le state

			// On notifie les joueurs que le state a changé
			for _, player := range g.players {
				player.Send(make(map[string]string))
			}
		}
	}
}
