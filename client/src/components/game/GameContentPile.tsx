import Pile from "@/components/game/Pile";
import type { Card } from "@/utils/connection/protocol";

interface GameContentPileProps {
  pile: Card[][];
}

export default function GameContentPile({ pile }: GameContentPileProps) {
  return (
    <div className="absolute top-80 left-0 right-0 w-3/4 mx-auto">
      {pile.map((move, index) => (
        <Pile key={index} pile={move} stack={index} />
      ))}
    </div>
  );
}
