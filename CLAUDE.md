# Président

Online multiplayer card game ("Président" / "Trou du cul"): a Go WebSocket server
and a React/TypeScript client with a three.js table. French rule names (président,
trou du cul, carré magique, "X ou rien") are used throughout code and comments.

## Commands

```bash
./dev.sh                      # run Go server (:8080) + Vite dev server together; open several
                              # browser tabs at the Vite URL to simulate multiple players

cd server && go test -race ./...   # backend tests (fakeConn-based unit + httptest end-to-end)
cd client && npm run test          # vitest (pure logic only: rules, cards, layout)
cd client && npm run lint          # eslint
cd client && npm run build         # tsc -b && vite build  -> client/dist served by the Go server
```

Env vars read by the server: `ALLOWED_ORIGINS` (comma-separated WS origins; permissive
when unset — dev only), `CLIENT_DIR` (path to built client, defaults to `../client/dist`).

## Architecture

**Handshake**: `POST /api/games` (create) or `POST /api/games/{id}/join` return
`{gameId?, playerId, token}`; the one-time token (30s TTL, minted by `Director`) is then
exchanged at `GET /ws?token=...` for a JSON-over-WebSocket connection. The `playerId` is
minted at HTTP time so the client knows which player is "them" before the socket opens.

**Server** (`server/*.go`, flat `package main`):
- `game.go` — all game state + rules orchestration. Every mutation goes through
  `mutateAndBroadcast`: run the change under `g.mu`, snapshot per-player views, release
  the lock, then send. Network I/O never happens while holding the lock.
- `player.go` — player state (cards, role, order, playing, skipped) **and** the
  connection (read loop `Listen`, write-serialized `Send`). `Conn` is an interface so
  tests substitute `fakeConn`.
- `pile.go`, `card.go`, `group_card.go` — pure rules: move legality, round-ending
  combos (a 2, four-of-a-kind, carré magique), deck generate/shuffle/split.
- `dispatch.go` — routes incoming WS actions to `Game` methods; errors go back to the
  sender only, as `{type:"error", payload:{code}}`.
- `director.go` — game registry + pending one-time sessions.
- `server.go` — HTTP handlers, routes, static file serving, `main`.

**Concurrency conventions**: methods with a `Locked` suffix require `g.mu` (or `d.mu`)
to already be held; public `Game` methods take the lock themselves. `Player` fields are
protected by the owning game's mutex, not their own.

**Views**: clients never see opponents' hands — `PlayerView.Cards` is the full `Card[]`
for the recipient and just a count (number) for everyone else (`withOwnCardsRevealed`).
Never add a field to `GameView`/`PlayerView` that leaks hidden state to all players.

**Wire protocol is duplicated by hand** between `server/message.go` (+ `GameView` /
`PlayerView` structs) and `client/src/utils/connection/protocol.ts`. Error codes must
also stay in sync with `client/src/utils/connection/errorMessages.ts`. Any protocol
change touches both sides.

**Client** (`client/src/`) — **do not reorganize this folder structure**:
- `components/` — React components (game/, lobby/, shared/), plain DOM + Tailwind.
- `stores/` — Redux Toolkit slices (game, connection, session, selectedCards).
- `hooks/` — typed store hooks.
- `utils/connection/` — typed native-WebSocket wrapper (`gameSocket.ts`), REST calls
  (`api.ts`), wire types (`protocol.ts`), error-code → message map.
- `utils/game/` — pure client-side rules helpers (unit-tested).
- `utils/scene/` — the `@react-three/fiber` canvas: table, pile, own hand, action
  buttons. Fixed camera; everything else (header, player list, exchange panel, errors)
  deliberately stays DOM/Tailwind.
- `assets/sounds/` — mp3 effects.

## Game-rules invariants worth knowing

- Roles are ints: 0 = président, highest = trou du cul; `role == nil` means still playing.
  A player's role is assigned the moment their hand empties.
- End-of-round exchange: on the next `Start`, trou du cul is forcibly stripped of their
  2 best cards (1 for vice with ≥4 players); président/vice choose what to give back via
  the `exchange` action. The round is frozen (`exchanging`) until all give-backs settle.
  The previous trou du cul opens the next round.
- "X ou rien": after two identical single cards in a row, only that value may be played,
  unless the trapped player declared `nothing`, which lifts the restriction.
- Seat `order` is assigned once from join order and reused across rounds while the
  lineup is unchanged.

## Testing conventions

- Backend logic tests build deterministic games by hand (set `started`, orders, hands
  directly) instead of going through `Start()`'s shuffle — see `twoPlayerGameInProgress`.
- `fake_conn_test.go` provides the in-memory `Conn`; `server_test.go` covers the real
  HTTP+WS path with httptest and a real gorilla dialer.
- Client tests cover pure logic only (`utils/game`, `utils/scene/handLayout`); components
  are intentionally untested.
