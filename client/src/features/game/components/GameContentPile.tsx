import Pile from "./Pile";
import type { Card } from "../../connection/protocol";

interface GameContentPileProps {
  pile: Card[][];
}

export default function GameContentPile({ pile }: GameContentPileProps) {
  return (
    <div className="absolute top-[20rem] left-0 right-0 w-3/4 mx-auto">
      {pile.map((move, index) => (
        <Pile key={index} pile={move} stack={index} />
      ))}
    </div>
  );
}
