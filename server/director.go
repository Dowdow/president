package main

import (
	"strings"
	"sync"
	"time"
)

const sessionTTL = 30 * time.Second
const maxUsernameLength = 20

var (
	errGameNotFound    = &GameError{ErrCodeGameNotFound}
	errInvalidUsername = &GameError{ErrCodeInvalidUsername}
)

// pendingSession is created by the HTTP create/join handshake and consumed
// exactly once when the matching WebSocket connection is upgraded. This keeps
// the WebSocket endpoint from having to trust an arbitrary client-supplied
// username/game id pair directly off the query string. The player id is
// minted here (rather than at WebSocket-connect time) so the HTTP response
// can already tell the client which player in the game's state is "them".
type pendingSession struct {
	gameID   string
	username string
	playerID string
	expires  time.Time
}

type Director struct {
	mu       sync.Mutex
	games    map[string]*Game
	sessions map[string]pendingSession
}

func NewDirector() *Director {
	return &Director{
		games:    make(map[string]*Game),
		sessions: make(map[string]pendingSession),
	}
}

func validateUsername(username string) error {
	username = strings.TrimSpace(username)
	if username == "" || len(username) > maxUsernameLength {
		return errInvalidUsername
	}

	return nil
}

// CreateGame creates a new game and returns the new player's id along with a
// one-time session token to exchange for a WebSocket connection.
func (d *Director) CreateGame(username string) (gameID string, playerID string, token string, err error) {
	if err := validateUsername(username); err != nil {
		return "", "", "", err
	}

	game := NewGame()

	d.mu.Lock()
	d.games[game.id] = game
	playerID, token = d.createSessionLocked(game.id, username)
	d.mu.Unlock()

	return game.id, playerID, token, nil
}

// JoinGame validates that a game can be joined and returns the new player's
// id along with a one-time session token to exchange for a WebSocket
// connection. The checks are re-validated atomically when the token is
// consumed, since state may change in between.
func (d *Director) JoinGame(gameID string, username string) (playerID string, token string, err error) {
	if err := validateUsername(username); err != nil {
		return "", "", err
	}

	d.mu.Lock()
	game, exists := d.games[gameID]
	d.mu.Unlock()
	if !exists {
		return "", "", errGameNotFound
	}

	if game.HasStarted() {
		return "", "", errGameStarted
	}

	if game.CountPlayers() >= maxPlayers {
		return "", "", errGameFull
	}

	d.mu.Lock()
	playerID, token = d.createSessionLocked(gameID, username)
	d.mu.Unlock()

	return playerID, token, nil
}

func (d *Director) createSessionLocked(gameID string, username string) (playerID string, token string) {
	playerID = generateID()
	token = generateID()
	d.sessions[token] = pendingSession{
		gameID:   gameID,
		username: username,
		playerID: playerID,
		expires:  time.Now().Add(sessionTTL),
	}

	return playerID, token
}

// ConsumeSession redeems a one-time token minted by CreateGame/JoinGame. It
// re-checks that the game still accepts the player, since time may have
// passed between the HTTP handshake and the WebSocket upgrade.
func (d *Director) ConsumeSession(token string) (game *Game, username string, playerID string, err error) {
	d.mu.Lock()
	session, exists := d.sessions[token]
	if exists {
		delete(d.sessions, token)
	}
	d.mu.Unlock()

	if !exists || time.Now().After(session.expires) {
		return nil, "", "", errInvalidMessage
	}

	d.mu.Lock()
	game, exists = d.games[session.gameID]
	d.mu.Unlock()
	if !exists {
		return nil, "", "", errGameNotFound
	}

	return game, session.username, session.playerID, nil
}

func (d *Director) RemoveGameIfEmpty(id string) {
	d.mu.Lock()
	defer d.mu.Unlock()

	game, exists := d.games[id]
	if !exists {
		return
	}

	if !game.IsEmpty() {
		return
	}

	delete(d.games, id)
}
