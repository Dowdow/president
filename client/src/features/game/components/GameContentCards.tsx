import PlayableCard from "./PlayableCard";
import { isCardDisabled, sortCardsByValue } from "../rules";
import type { Card } from "../../connection/protocol";

interface GameContentCardsProps {
  cards: Card[];
  maxValue: number;
  xOrNothing: boolean;
}

export default function GameContentCards({ cards, maxValue, xOrNothing }: GameContentCardsProps) {
  return (
    <div className="absolute bottom-40 left-0 right-0 w-3/4 flex justify-center mx-auto mt-12">
      {sortCardsByValue(cards).map((card) => (
        <PlayableCard
          key={`${card.family}-${card.value}`}
          value={card.value}
          family={card.family}
          disabled={isCardDisabled(card.value, maxValue, xOrNothing)}
        />
      ))}
    </div>
  );
}
