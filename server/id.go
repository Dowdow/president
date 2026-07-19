package main

import (
	"crypto/rand"
	"fmt"
)

// generateID returns a random UUID-like identifier, used for both game and player ids.
func generateID() string {
	var b [16]byte
	if _, err := rand.Read(b[:]); err != nil {
		panic(err)
	}

	return fmt.Sprintf("%x-%x-%x-%x-%x", b[0:4], b[4:6], b[6:8], b[8:10], b[10:16])
}
