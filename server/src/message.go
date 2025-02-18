package main

const (
	ActionMove = "move"
	ActionPass = "pass"
	ActionPlay = "play"
)

var Actions = [...]string{
	ActionMove,
	ActionPass,
	ActionPlay,
}

type Message struct {
	Action  string                 `json:"action"`
	Payload map[string]interface{} `json:"payload"`
	player  *Player
}
