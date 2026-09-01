import { useEffect } from "react";
import Card from "@/components/shared/Card";
import { useAppDispatch, useAppSelector } from "@/hooks/stores";
import { addSelectedCard, removeSelectedCard } from "@/stores/selectedCardsSlice";
import { isSameCard } from "@/utils/game/rules";
import type { CardFamily } from "@/utils/connection/protocol";

interface PlayableCardProps {
  value: number;
  family: CardFamily;
  disabled: boolean;
}

export default function PlayableCard({ value, family, disabled }: PlayableCardProps) {
  const dispatch = useAppDispatch();
  const selected = useAppSelector((state) => state.selectedCards.some((c) => isSameCard(c, { value, family })));

  useEffect(() => {
    // A card that becomes ineligible (e.g. the pile's required value changed
    // under it) can't stay selected.
    if (disabled && selected) {
      dispatch(removeSelectedCard({ value, family }));
    }
  }, [disabled, selected, value, family, dispatch]);

  const handleSelect = () => {
    if (disabled) {
      return;
    }

    if (selected) {
      dispatch(removeSelectedCard({ value, family }));
    } else {
      dispatch(addSelectedCard({ value, family }));
    }
  };

  return (
    <div
      className={`pt-8 pb-2 hover:pt-5 hover:pb-5 -ml-10 cursor-pointer transition-[padding] duration-[50] ${selected ? "pt-0 pb-10" : ""} ${disabled ? "pt-10! pb-0! cursor-not-allowed" : ""}`}
      onClick={handleSelect}
      role="figure"
    >
      <Card value={value} family={family} disabled={disabled} />
    </div>
  );
}
