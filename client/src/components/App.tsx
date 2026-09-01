import { useCallback, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/stores";
import UsernameForm from "@/components/lobby/UsernameForm";
import GameSettings from "@/components/lobby/GameSettings";
import Game from "@/components/game/Game";
import Error from "@/components/shared/Error";
import { createGame, joinGame } from "@/utils/connection/api";
import { GameSocket } from "@/utils/connection/gameSocket";
import { ServerMessageType, type Card, type ClientAction } from "@/utils/connection/protocol";
import { describeErrorCode } from "@/utils/connection/errorMessages";
import { setConnected, setError } from "@/stores/connectionSlice";
import { setPlayerId } from "@/stores/sessionSlice";
import { setGameData } from "@/stores/gameSlice";

export default function App() {
  const dispatch = useAppDispatch();

  const username = useAppSelector((state) => state.session.username);
  const playerId = useAppSelector((state) => state.session.playerId);
  const connected = useAppSelector((state) => state.connection.connected);
  const error = useAppSelector((state) => state.connection.error);
  const game = useAppSelector((state) => state.game);

  const socketRef = useRef<GameSocket | null>(null);

  const openSocket = useCallback(
    (newPlayerId: string, token: string) => {
      const socket = new GameSocket();

      socket.onOpen = () => dispatch(setConnected(true));
      socket.onMessage = (message) => {
        if (message.type === ServerMessageType.GameData) {
          dispatch(setGameData(message.payload));
        } else {
          dispatch(setError(describeErrorCode(message.payload.code)));
        }
      };
      socket.onClose = () => {
        dispatch(setConnected(false));
        dispatch(setGameData(null));
        dispatch(setPlayerId(null));
      };

      socketRef.current = socket;
      dispatch(setPlayerId(newPlayerId));
      socket.connect(token);
    },
    [dispatch],
  );

  const handleCreateGame = useCallback(async () => {
    if (!username) return;
    try {
      const { playerId: newPlayerId, token } = await createGame(username);
      openSocket(newPlayerId, token);
    } catch (err) {
      dispatch(setError(describeErrorCode((err as { code?: string }).code ?? "unknown")));
    }
  }, [username, openSocket, dispatch]);

  const handleJoinGame = useCallback(
    async (gameId: string) => {
      if (!username) return;
      try {
        const { playerId: newPlayerId, token } = await joinGame(gameId, username);
        openSocket(newPlayerId, token);
      } catch (err) {
        dispatch(setError(describeErrorCode((err as { code?: string }).code ?? "unknown")));
      }
    },
    [username, openSocket, dispatch],
  );

  const handleSendAction = useCallback((action: ClientAction, cards?: Card[]) => {
    socketRef.current?.send(action, cards);
  }, []);

  const handleLeave = useCallback(() => {
    socketRef.current?.close();
    socketRef.current = null;
    dispatch(setConnected(false));
    dispatch(setGameData(null));
    dispatch(setPlayerId(null));
  }, [dispatch]);

  return (
    <div className="w-full">
      <header className="flex flex-row justify-between items-center">
        <h1 className="m-2 text-3xl font-bold">Président</h1>
        <span className="mr-2">{connected ? "Connected" : "Disconnected"}</span>
      </header>
      <div className="w-full">
        {username === null && <UsernameForm />}
        {username !== null && game === null && (
          <GameSettings onCreateGame={handleCreateGame} onJoinGame={handleJoinGame} />
        )}
        {username !== null && game !== null && playerId !== null && (
          <Game game={game} myId={playerId} sendAction={handleSendAction} onLeave={handleLeave} />
        )}
      </div>
      {error ? <Error message={error} /> : ""}
    </div>
  );
}
