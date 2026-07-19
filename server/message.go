package main

import "encoding/json"

// Actions that a client can send once its WebSocket connection is open.
const (
	ActionStart    = "start"
	ActionPlay     = "play"
	ActionSkip     = "skip"
	ActionNothing  = "nothing"
	ActionExchange = "exchange"
	ActionLeave    = "leave"
)

// Message types the server sends back over the WebSocket.
const (
	TypeGameData = "game_data"
	TypeError    = "error"
)

// Error codes sent to the client so it can display a localized/appropriate message.
const (
	ErrCodeMinimumPlayers  = "minimum_players"
	ErrCodeGameFull        = "game_full"
	ErrCodeGameStarted     = "game_started"
	ErrCodeGameNotStarted  = "game_not_started"
	ErrCodeGameNotFound    = "game_not_found"
	ErrCodeInvalidUsername = "invalid_username"
	ErrCodeInvalidMove     = "invalid_move"
	ErrCodeNotYourTurn     = "not_your_turn"
	ErrCodeInvalidMessage  = "invalid_message"
)

// IncomingMessage is what a client sends over the WebSocket once connected.
type IncomingMessage struct {
	Action  string          `json:"action"`
	Payload json.RawMessage `json:"payload"`
}

// PlayPayload is the expected shape of the payload for an ActionPlay message.
type PlayPayload struct {
	Cards []Card `json:"cards"`
}

// OutgoingMessage is what the server sends to clients over the WebSocket.
type OutgoingMessage struct {
	Type    string `json:"type"`
	Payload any    `json:"payload"`
}

// ErrorPayload is the payload of a TypeError outgoing message.
type ErrorPayload struct {
	Code string `json:"code"`
}
