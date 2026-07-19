package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"runtime"
	"strings"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: checkOrigin,
}

// checkOrigin restricts WebSocket upgrades to the origins listed in the
// ALLOWED_ORIGINS env var (comma separated). Left unset, it falls back to
// same-origin-ish permissive behaviour for local/dev use, but a production
// deployment behind a reverse proxy should always set it.
func checkOrigin(r *http.Request) bool {
	allowed := os.Getenv("ALLOWED_ORIGINS")
	if allowed == "" {
		log.Println("Warning: ALLOWED_ORIGINS is not set, accepting WebSocket connections from any origin")
		return true
	}

	origin := r.Header.Get("Origin")
	for _, o := range strings.Split(allowed, ",") {
		if strings.TrimSpace(o) == origin {
			return true
		}
	}

	return false
}

func getClientDirectory() string {
	clientDirectory := os.Getenv("CLIENT_DIR")
	if clientDirectory == "" {
		_, file, _, ok := runtime.Caller(0)
		if !ok {
			log.Fatalln("Unable to find the current filepath")
		}

		clientDirectory = filepath.Join(filepath.Dir(file), "../client/dist")
	}

	return clientDirectory
}

func writeJSON(w http.ResponseWriter, status int, body any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	if err := json.NewEncoder(w).Encode(body); err != nil {
		log.Println("JSON error :", err)
	}
}

func writeError(w http.ResponseWriter, status int, err error) {
	writeJSON(w, status, ErrorPayload{Code: err.Error()})
}

func statusForError(err error) int {
	switch err {
	case errInvalidUsername, errInvalidMessage:
		return http.StatusBadRequest
	case errGameNotFound:
		return http.StatusNotFound
	case errGameStarted, errGameFull:
		return http.StatusConflict
	default:
		return http.StatusBadRequest
	}
}

// api holds the dependencies shared by the HTTP/WebSocket handlers. Keeping
// the director here instead of a package-level global makes each server
// instance independent, which is what lets tests spin up several isolated
// servers side by side.
type api struct {
	director *Director
}

type createGameRequest struct {
	Username string `json:"username"`
}

type createGameResponse struct {
	GameID   string `json:"gameId"`
	PlayerID string `json:"playerId"`
	Token    string `json:"token"`
}

func (a *api) handleCreateGame(w http.ResponseWriter, r *http.Request) {
	var req createGameRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, errInvalidMessage)
		return
	}

	gameID, playerID, token, err := a.director.CreateGame(req.Username)
	if err != nil {
		writeError(w, statusForError(err), err)
		return
	}

	writeJSON(w, http.StatusCreated, createGameResponse{GameID: gameID, PlayerID: playerID, Token: token})
}

type joinGameRequest struct {
	Username string `json:"username"`
}

type joinGameResponse struct {
	PlayerID string `json:"playerId"`
	Token    string `json:"token"`
}

func (a *api) handleJoinGame(w http.ResponseWriter, r *http.Request) {
	var req joinGameRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, errInvalidMessage)
		return
	}

	playerID, token, err := a.director.JoinGame(r.PathValue("id"), req.Username)
	if err != nil {
		writeError(w, statusForError(err), err)
		return
	}

	writeJSON(w, http.StatusOK, joinGameResponse{PlayerID: playerID, Token: token})
}

func (a *api) handleWebSocket(w http.ResponseWriter, r *http.Request) {
	token := r.URL.Query().Get("token")
	game, username, playerID, err := a.director.ConsumeSession(token)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("Websocket error :", err)
		return
	}

	player := NewPlayer(playerID, username, conn, game, a.director)
	if err := game.AddPlayer(player); err != nil {
		player.Send(OutgoingMessage{Type: TypeError, Payload: ErrorPayload{Code: err.Error()}})
		conn.Close()
		return
	}

	player.Listen()
}

func (a *api) routes(mux *http.ServeMux) {
	mux.HandleFunc("POST /api/games", a.handleCreateGame)
	mux.HandleFunc("POST /api/games/{id}/join", a.handleJoinGame)
	mux.HandleFunc("/ws", a.handleWebSocket)
}

func main() {
	clientDirectory := getClientDirectory()
	a := &api{director: NewDirector()}

	mux := http.NewServeMux()
	mux.Handle("/assets/", http.FileServer(http.Dir(clientDirectory)))
	a.routes(mux)
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, filepath.Join(clientDirectory, "index.html"))
	})

	log.Println("Server starting on port 8080")
	if err := http.ListenAndServe(":8080", mux); err != nil {
		log.Fatalln(err)
	}
}
