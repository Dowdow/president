package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"runtime"

	"github.com/gorilla/websocket"
)

var director = NewDirector()

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

func getClientDirectory() string {
	clientDirectory := os.Getenv("CLIENT_DIR")
	if clientDirectory == "" {
		_, file, _, ok := runtime.Caller(0)
		if !ok {
			log.Fatalln("Unable to find the current filepath")
		}

		clientDirectory = filepath.Join(filepath.Dir(file), "../../client/dist")
	}

	return clientDirectory
}

func main() {
	clientDirectory := getClientDirectory()

	http.Handle("/assets/", http.FileServer(http.Dir(clientDirectory)))

	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Println("Websocket error :", err)
			http.Error(w, "Error while creating Web Socket", http.StatusInternalServerError)
		}

		username := r.URL.Query().Get("username")
		if username == "" {
			http.Error(w, "Parameter username empty", http.StatusBadRequest)
		}

		game := director.GetOrCreateGame(r.URL.Query().Get("id"))
		player := NewPlayer(username, conn, game)
		game.AddPlayer(player)
		player.Listen()

		err = json.NewEncoder(w).Encode(map[string]string{"message": "ended"})
		if err != nil {
			log.Println("JSON error :", err)
			http.Error(w, "Error while encoding JSON", http.StatusInternalServerError)
		}
	})

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, filepath.Join(clientDirectory, "index.html"))
	})

	log.Println("Server starting on port 8080")
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		log.Fatalln(err)
	}
}
