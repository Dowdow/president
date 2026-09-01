// Wire types mirroring the Go backend (server/message.go, server/game.go,
// server/player.go). Keep these in sync with the server by hand: there is no
// shared schema between the two, they're just two ends of the same protocol.

export const CardFamily = {
  Spade: 0,
  Heart: 1,
  Diamond: 2,
  Club: 3,
} as const;

export type CardFamily = (typeof CardFamily)[keyof typeof CardFamily];

export interface Card {
  value: number;
  family: CardFamily;
}

export interface PlayerView {
  id: string;
  username: string;
  playing: boolean;
  skipped: boolean;
  role: number | null;
  order: number | null;
  // The player's own hand is a Card[], anyone else's is just a count.
  cards: Card[] | number;
}

export interface PendingGiveBack {
  count: number;
  recipientId: string;
}

export interface GameView {
  id: string;
  started: boolean;
  players: Record<string, PlayerView>;
  pile: Card[][];
  roundEnded: boolean;
  lastPlayerHasNothing: boolean;
  exchanging: boolean;
  pendingGiveBacks: Record<string, PendingGiveBack>;
}

export const ClientAction = {
  Start: "start",
  Play: "play",
  Skip: "skip",
  Nothing: "nothing",
  Exchange: "exchange",
  Leave: "leave",
} as const;

export type ClientAction = (typeof ClientAction)[keyof typeof ClientAction];

export interface ClientMessage {
  action: ClientAction;
  payload?: { cards: Card[] };
}

export const ServerMessageType = {
  GameData: "game_data",
  Error: "error",
} as const;

export type ServerMessageType = (typeof ServerMessageType)[keyof typeof ServerMessageType];

export interface ErrorPayload {
  code: string;
}

export type ServerMessage =
  | { type: typeof ServerMessageType.GameData; payload: GameView }
  | { type: typeof ServerMessageType.Error; payload: ErrorPayload };
