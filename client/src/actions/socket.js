import io from 'socket.io-client';

export const SET_SOCKET = 'SET_SOCKET';

export function connect() {
  return (dispath) => {
    const SOCKET_PROTOCOL = (window.location.protocol.includes('https')) ? 'wss' : 'ws';
    const socket = io(`${SOCKET_PROTOCOL}://${window.location.host}`, { reconnection: false });
    dispath({ type: SET_SOCKET, socket });
  };
}
