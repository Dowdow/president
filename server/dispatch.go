package main

import "encoding/json"

var errInvalidMessage = &GameError{ErrCodeInvalidMessage}

// handleMessage routes an incoming WebSocket message to the matching Game
// action and reports any failure back to the sender only (not broadcast).
func (p *Player) handleMessage(msg IncomingMessage) {
	var err error

	switch msg.Action {
	case ActionStart:
		err = p.game.Start()
	case ActionPlay:
		err = p.handlePlay(msg.Payload)
	case ActionSkip:
		err = p.game.Skip(p)
	case ActionNothing:
		err = p.game.Nothing(p)
	case ActionExchange:
		err = p.handleExchange(msg.Payload)
	default:
		err = errInvalidMessage
	}

	if err != nil {
		p.Send(OutgoingMessage{Type: TypeError, Payload: ErrorPayload{Code: err.Error()}})
	}
}

// parseCards decodes and validates the {cards: [...]} shape shared by the
// play and exchange actions.
func parseCards(raw json.RawMessage) (GroupCard, error) {
	var payload PlayPayload
	if err := json.Unmarshal(raw, &payload); err != nil {
		return nil, errInvalidMessage
	}

	cards := make(GroupCard, 0, len(payload.Cards))
	for _, c := range payload.Cards {
		card := c
		if !IsValidCardValue(card.Value) || !IsValidCardFamily(card.Family) {
			return nil, errInvalidMessage
		}
		cards = append(cards, &card)
	}

	return cards, nil
}

func (p *Player) handlePlay(raw json.RawMessage) error {
	cards, err := parseCards(raw)
	if err != nil {
		return err
	}

	if len(cards) < 1 {
		return errInvalidMove
	}

	return p.game.Play(p, cards)
}

func (p *Player) handleExchange(raw json.RawMessage) error {
	cards, err := parseCards(raw)
	if err != nil {
		return err
	}

	return p.game.Exchange(p, cards)
}
