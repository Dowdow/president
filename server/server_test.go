package main

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	"github.com/gorilla/websocket"
)

// newTestServer spins up the real HTTP mux (create/join/ws) behind an
// httptest server, giving an end-to-end path from HTTP handshake to
// WebSocket gameplay without touching the network beyond localhost.
func newTestServer(t *testing.T) *httptest.Server {
	t.Helper()

	a := &api{director: NewDirector()}
	mux := http.NewServeMux()
	a.routes(mux)

	server := httptest.NewServer(mux)
	t.Cleanup(server.Close)

	return server
}

func postJSON(t *testing.T, url string, body any) *http.Response {
	t.Helper()

	buf, err := json.Marshal(body)
	if err != nil {
		t.Fatalf("failed to marshal request body: %v", err)
	}

	resp, err := http.Post(url, "application/json", bytes.NewReader(buf))
	if err != nil {
		t.Fatalf("failed to POST %s: %v", url, err)
	}

	return resp
}

func dialWS(t *testing.T, server *httptest.Server, token string) *websocket.Conn {
	t.Helper()

	url := "ws" + strings.TrimPrefix(server.URL, "http") + "/ws?token=" + token
	conn, resp, err := websocket.DefaultDialer.Dial(url, nil)
	if err != nil {
		t.Fatalf("failed to dial websocket: %v", err)
	}
	if resp != nil {
		resp.Body.Close()
	}
	t.Cleanup(func() { conn.Close() })

	return conn
}

func readGameData(t *testing.T, conn *websocket.Conn) GameView {
	t.Helper()

	conn.SetReadDeadline(time.Now().Add(2 * time.Second))

	var msg OutgoingMessage
	if err := conn.ReadJSON(&msg); err != nil {
		t.Fatalf("failed to read message: %v", err)
	}

	if msg.Type != TypeGameData {
		t.Fatalf("expected a %s message, got %s", TypeGameData, msg.Type)
	}

	raw, err := json.Marshal(msg.Payload)
	if err != nil {
		t.Fatalf("failed to re-marshal payload: %v", err)
	}

	var view GameView
	if err := json.Unmarshal(raw, &view); err != nil {
		t.Fatalf("failed to unmarshal GameView: %v", err)
	}

	return view
}

func TestEndToEndCreateJoinAndStart(t *testing.T) {
	server := newTestServer(t)

	createResp := postJSON(t, server.URL+"/api/games", createGameRequest{Username: "Alice"})
	if createResp.StatusCode != http.StatusCreated {
		t.Fatalf("expected 201 creating game, got %d", createResp.StatusCode)
	}

	var created createGameResponse
	if err := json.NewDecoder(createResp.Body).Decode(&created); err != nil {
		t.Fatalf("failed to decode create response: %v", err)
	}
	createResp.Body.Close()

	joinResp := postJSON(t, server.URL+"/api/games/"+created.GameID+"/join", joinGameRequest{Username: "Bob"})
	if joinResp.StatusCode != http.StatusOK {
		t.Fatalf("expected 200 joining game, got %d", joinResp.StatusCode)
	}

	var joined joinGameResponse
	if err := json.NewDecoder(joinResp.Body).Decode(&joined); err != nil {
		t.Fatalf("failed to decode join response: %v", err)
	}
	joinResp.Body.Close()

	aliceConn := dialWS(t, server, created.Token)
	view := readGameData(t, aliceConn)
	if len(view.Players) != 1 {
		t.Fatalf("expected 1 player right after Alice connects, got %d", len(view.Players))
	}
	if _, exists := view.Players[created.PlayerID]; !exists {
		t.Fatalf("expected the create response's playerId %q to identify Alice in the game state", created.PlayerID)
	}

	bobConn := dialWS(t, server, joined.Token)

	// Both players should now see a 2-player lobby.
	view = readGameData(t, aliceConn)
	if len(view.Players) != 2 {
		t.Fatalf("expected 2 players after Bob connects, got %d", len(view.Players))
	}
	view = readGameData(t, bobConn)
	if len(view.Players) != 2 {
		t.Fatalf("expected 2 players after Bob connects, got %d", len(view.Players))
	}

	if err := aliceConn.WriteJSON(IncomingMessage{Action: ActionStart}); err != nil {
		t.Fatalf("failed to send start action: %v", err)
	}

	view = readGameData(t, aliceConn)
	if !view.Started {
		t.Fatal("expected the game to be started")
	}

	total := 0
	for _, p := range view.Players {
		switch cards := p.Cards.(type) {
		case float64:
			total += int(cards)
		case []any:
			total += len(cards)
		}
	}
	if total != 52 {
		t.Fatalf("expected 52 cards dealt in total, got %d", total)
	}
}

func TestJoinRejectsUnknownGame(t *testing.T) {
	server := newTestServer(t)

	resp := postJSON(t, server.URL+"/api/games/does-not-exist/join", joinGameRequest{Username: "Bob"})
	if resp.StatusCode != http.StatusNotFound {
		t.Fatalf("expected 404 for an unknown game, got %d", resp.StatusCode)
	}
}

func TestWebSocketRejectsInvalidToken(t *testing.T) {
	server := newTestServer(t)

	url := "ws" + strings.TrimPrefix(server.URL, "http") + "/ws?token=not-a-real-token"
	_, resp, err := websocket.DefaultDialer.Dial(url, nil)
	if err == nil {
		t.Fatal("expected the websocket dial to fail for an invalid token")
	}
	if resp != nil && resp.StatusCode != http.StatusUnauthorized {
		t.Fatalf("expected 401 for an invalid token, got %d", resp.StatusCode)
	}
}
