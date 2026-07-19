package main

import (
	"encoding/json"
	"testing"
)

func TestHandlePlayRejectsInvalidJSON(t *testing.T) {
	g := twoPlayerGameInProgress()
	p1 := g.players[g.playerOrder[0]]
	conn := p1.conn.(*fakeConn)

	p1.handleMessage(IncomingMessage{Action: ActionPlay, Payload: json.RawMessage("not json")})

	assertErrorSent(t, conn, ErrCodeInvalidMessage)
}

func TestHandlePlayRejectsEmptyCards(t *testing.T) {
	g := twoPlayerGameInProgress()
	p1 := g.players[g.playerOrder[0]]
	conn := p1.conn.(*fakeConn)

	p1.handleMessage(IncomingMessage{Action: ActionPlay, Payload: json.RawMessage(`{"cards":[]}`)})

	assertErrorSent(t, conn, ErrCodeInvalidMove)
}

func TestHandlePlayRejectsInvalidCardValue(t *testing.T) {
	g := twoPlayerGameInProgress()
	p1 := g.players[g.playerOrder[0]]
	conn := p1.conn.(*fakeConn)

	p1.handleMessage(IncomingMessage{
		Action:  ActionPlay,
		Payload: json.RawMessage(`{"cards":[{"value":99,"family":0}]}`),
	})

	assertErrorSent(t, conn, ErrCodeInvalidMessage)
}

func TestHandlePlayRejectsInvalidCardFamily(t *testing.T) {
	g := twoPlayerGameInProgress()
	p1 := g.players[g.playerOrder[0]]
	conn := p1.conn.(*fakeConn)

	p1.handleMessage(IncomingMessage{
		Action:  ActionPlay,
		Payload: json.RawMessage(`{"cards":[{"value":3,"family":9}]}`),
	})

	assertErrorSent(t, conn, ErrCodeInvalidMessage)
}

func TestHandlePlayDelegatesValidMoveToGame(t *testing.T) {
	g := twoPlayerGameInProgress()
	p1 := g.players[g.playerOrder[0]]
	conn := p1.conn.(*fakeConn)

	raw, err := json.Marshal(PlayPayload{Cards: []Card{{Value: CardValueThree, Family: CardFamilySpade}}})
	if err != nil {
		t.Fatalf("failed to marshal payload: %v", err)
	}

	p1.handleMessage(IncomingMessage{Action: ActionPlay, Payload: raw})

	if len(g.pile) != 1 {
		t.Fatalf("expected the pile to have received the card, got size %d", len(g.pile))
	}

	msg, ok := conn.lastMessage()
	if !ok || msg.Type != TypeGameData {
		t.Fatalf("expected a successful move to broadcast game data, got %+v (ok=%v)", msg, ok)
	}
}

func TestHandleMessageRejectsUnknownAction(t *testing.T) {
	g := twoPlayerGameInProgress()
	p1 := g.players[g.playerOrder[0]]
	conn := p1.conn.(*fakeConn)

	p1.handleMessage(IncomingMessage{Action: "teleport"})

	assertErrorSent(t, conn, ErrCodeInvalidMessage)
}

func assertErrorSent(t *testing.T, conn *fakeConn, code string) {
	t.Helper()

	msg, ok := conn.lastMessage()
	if !ok {
		t.Fatal("expected an error message to be sent")
	}

	if msg.Type != TypeError {
		t.Fatalf("expected a %s message, got %s", TypeError, msg.Type)
	}

	payload, ok := msg.Payload.(ErrorPayload)
	if !ok {
		t.Fatalf("expected an ErrorPayload, got %T", msg.Payload)
	}

	if payload.Code != code {
		t.Fatalf("expected error code %s, got %s", code, payload.Code)
	}
}
