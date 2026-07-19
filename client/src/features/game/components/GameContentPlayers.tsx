import Player from "./Player";
import type { PlayerView } from "../../connection/protocol";

interface GameContentPlayersProps {
  players: Record<string, PlayerView>;
}

export default function GameContentPlayers({ players }: GameContentPlayersProps) {
  const entries = Object.entries(players);

  return (
    <div className="absolute top-48 left-4 flex flex-col mt-3">
      {entries.map(([id, player]) => (
        <Player key={id} player={player} totalPlayers={entries.length} />
      ))}
    </div>
  );
}
