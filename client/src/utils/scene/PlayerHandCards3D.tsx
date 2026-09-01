import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/stores";
import PlayingCard3D from "./PlayingCard3D";
import { cardKey } from "./cardKey";
import { addSelectedCard, removeSelectedCard } from "../../stores/selectedCardsSlice";
import { isCardDisabled, isSameCard, sortCardsByValue } from "../game/rules";
import { HAND_CARD_SPACING, HAND_Z } from "./sceneConstants";
import { handCardX } from "./handLayout";
import type { Card } from "../connection/protocol";

interface PlayerHandCards3DProps {
  cards: Card[];
  maxValue: number;
  xOrNothing: boolean;
}

export default function PlayerHandCards3D({ cards, maxValue, xOrNothing }: PlayerHandCards3DProps) {
  const dispatch = useAppDispatch();
  const selectedCards = useAppSelector((state) => state.selectedCards);
  const sorted = sortCardsByValue(cards);

  useEffect(() => {
    // A card that becomes ineligible (e.g. the pile's required value changed
    // under it) can't stay selected.
    for (const card of selectedCards) {
      if (isCardDisabled(card.value, maxValue, xOrNothing)) {
        dispatch(removeSelectedCard(card));
      }
    }
  }, [selectedCards, maxValue, xOrNothing, dispatch]);

  return (
    <>
      {sorted.map((card, index) => {
        const disabled = isCardDisabled(card.value, maxValue, xOrNothing);
        const selected = selectedCards.some((c) => isSameCard(c, card));

        const handleClick = () => {
          if (disabled) return;
          if (selected) {
            dispatch(removeSelectedCard(card));
          } else {
            dispatch(addSelectedCard(card));
          }
        };

        return (
          <PlayingCard3D
            key={cardKey(card)}
            value={card.value}
            family={card.family}
            position={[handCardX(index, sorted.length, HAND_CARD_SPACING), 0, HAND_Z]}
            disabled={disabled}
            selected={selected}
            onClick={handleClick}
          />
        );
      })}
    </>
  );
}
