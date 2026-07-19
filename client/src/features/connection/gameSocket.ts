import type { Card, ClientAction, ServerMessage } from "./protocol";

// Thin typed wrapper around the native WebSocket, talking the JSON protocol
// the Go backend expects on /ws?token=... (see server/server.go). Replaces
// the old socket.io-client, which spoke a different wire protocol entirely
// and was never actually compatible with this backend.
export class GameSocket {
  private socket: WebSocket | null = null;

  onOpen: (() => void) | null = null;
  onMessage: ((message: ServerMessage) => void) | null = null;
  onClose: (() => void) | null = null;

  connect(token: string): void {
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    const socket = new WebSocket(`${protocol}://${window.location.host}/ws?token=${encodeURIComponent(token)}`);

    socket.onopen = () => {
      this.onOpen?.();
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data) as ServerMessage;
      this.onMessage?.(message);
    };

    socket.onclose = () => {
      this.onClose?.();
    };

    this.socket = socket;
  }

  send(action: ClientAction, cards?: Card[]): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      return;
    }

    const message = cards ? { action, payload: { cards } } : { action };
    this.socket.send(JSON.stringify(message));
  }

  close(): void {
    this.socket?.close();
    this.socket = null;
  }
}
