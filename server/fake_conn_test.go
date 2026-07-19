package main

import "sync"

// fakeConn is an in-memory stand-in for a *websocket.Conn, letting tests
// drive Player/Game without a real network connection.
type fakeConn struct {
	mu       sync.Mutex
	sent     []OutgoingMessage
	incoming chan IncomingMessage
	closed   bool
}

func newFakeConn() *fakeConn {
	return &fakeConn{
		incoming: make(chan IncomingMessage, 16),
	}
}

func (c *fakeConn) WriteJSON(v any) error {
	msg, ok := v.(OutgoingMessage)
	if !ok {
		panic("fakeConn.WriteJSON expects an OutgoingMessage")
	}

	c.mu.Lock()
	c.sent = append(c.sent, msg)
	c.mu.Unlock()

	return nil
}

func (c *fakeConn) ReadJSON(v any) error {
	msg, ok := <-c.incoming
	if !ok {
		return errConnClosed
	}

	target, ok := v.(*IncomingMessage)
	if !ok {
		panic("fakeConn.ReadJSON expects a *IncomingMessage")
	}
	*target = msg

	return nil
}

func (c *fakeConn) Close() error {
	c.mu.Lock()
	defer c.mu.Unlock()

	if !c.closed {
		c.closed = true
		close(c.incoming)
	}

	return nil
}

func (c *fakeConn) lastMessage() (OutgoingMessage, bool) {
	c.mu.Lock()
	defer c.mu.Unlock()

	if len(c.sent) == 0 {
		return OutgoingMessage{}, false
	}

	return c.sent[len(c.sent)-1], true
}

func (c *fakeConn) messages() []OutgoingMessage {
	c.mu.Lock()
	defer c.mu.Unlock()

	out := make([]OutgoingMessage, len(c.sent))
	copy(out, c.sent)

	return out
}

type fakeConnError string

func (e fakeConnError) Error() string { return string(e) }

const errConnClosed = fakeConnError("connection closed")

// newTestPlayer creates a player wired to a fakeConn and attaches it to the
// given game, returning both the player and its connection for assertions.
func newTestPlayer(username string, game *Game) (*Player, *fakeConn) {
	conn := newFakeConn()
	player := NewPlayer(generateID(), username, conn, game, NewDirector())

	return player, conn
}
