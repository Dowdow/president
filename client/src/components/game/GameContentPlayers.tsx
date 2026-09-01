import Player from "@/components/game/Player";
import type { PlayerView } from "@/utils/connection/protocol";

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
