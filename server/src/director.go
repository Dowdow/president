package main

import (
	"sync"
)

type Director struct {
	games map[string]*Game
	mutex sync.Mutex
}

func NewDirector() *Director {
	return &Director{
		games: make(map[string]*Game),
		mutex: sync.Mutex{},
	}
}

func (d *Director) GetOrCreateGame(id string) *Game {
	d.mutex.Lock()
	defer d.mutex.Unlock()

	if game, exists := d.games[id]; exists {
		return game
	}

	game := NewGame()
	d.games[id] = game
	go game.Run()

	return game
}

func (d *Director) RemoveGameIfEmpty(id string) {
	d.mutex.Lock()
	defer d.mutex.Unlock()

	game, exists := d.games[id]
	if !exists {
		return
	}

	if len(game.players) > 0 {
		return
	}

	close(game.register)
	close(game.unregister)
	close(game.messages)
	delete(d.games, id)
}
