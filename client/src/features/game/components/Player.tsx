import { transformRoleToString } from "../../../shared/cards";
import { cardsLeftCount } from "../rules";
import type { PlayerView } from "../../connection/protocol";

interface PlayerProps {
  player: PlayerView;
  totalPlayers: number;
}

export default function Player({ player, totalPlayers }: PlayerProps) {
  const cardsLeft = cardsLeftCount(player.cards);

  return (
    <div
      className={`flex items-center mb-5 ${player.playing ? "ml-5" : ""}`}
      style={{ order: player.order ?? 0 }}
    >
      <div
        className={`flex flex-col w-32 p-2 border-4 border-black rounded-lg shadow transition-[margin-left] duration-100 ease-in-out ${player.playing ? "bg-skin-red" : ""} ${player.skipped ? "bg-white" : ""} ${!player.playing && !player.skipped ? "bg-skin-blue" : ""}`}
      >
        <span className="text-2xl mb-1">{player.username}</span>
        <span>
          {[...Array(cardsLeft)].map((_, i) => (
            <span key={i} className="inline-block w-2 h-3 m-0.5 bg-white border-2 border-black rounded shadow" />
          ))}
        </span>
      </div>
      <div className="flex flex-col gap-0.5 ml-3 text-2xl">
        <span>
          🃏
          {cardsLeft}
        </span>
        <span>{transformRoleToString(player.role, totalPlayers)}</span>
        {player.playing ? <span>🤔</span> : ""}
        {player.skipped ? <span>😴</span> : ""}
      </div>
    </div>
  );
}
