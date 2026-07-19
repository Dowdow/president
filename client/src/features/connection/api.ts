// HTTP handshake: create/join a game and get back a one-time token to
// exchange for a WebSocket connection (see server/director.go).

export interface ApiError {
  code: string;
}

async function post<T>(url: string, body: unknown): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    throw data as ApiError;
  }

  return data as T;
}

export interface CreateGameResponse {
  gameId: string;
  playerId: string;
  token: string;
}

export function createGame(username: string): Promise<CreateGameResponse> {
  return post<CreateGameResponse>("/api/games", { username });
}

export interface JoinGameResponse {
  playerId: string;
  token: string;
}

export function joinGame(gameId: string, username: string): Promise<JoinGameResponse> {
  return post<JoinGameResponse>(`/api/games/${encodeURIComponent(gameId)}/join`, { username });
}
