import { useState } from "react";
import Card from "@/components/shared/Card";
import { randomJitter, xFromStack, yFromStack } from "@/utils/game/pileLayout";
import type { Card as CardType } from "@/utils/connection/protocol";

interface PileProps {
  pile: CardType[];
  stack: number;
}

export default function Pile({ pile, stack }: PileProps) {
  // Randomized once per mount (a given `stack` index always maps to the same
  // move, since it's also used as the React key by GameContentPile) so the
  // cards don't look like a single neat, aligned stack.
  const [rotate] = useState(() => randomJitter());
  const [translateX] = useState(() => xFromStack(stack) + randomJitter());
  const [translateY] = useState(() => yFromStack(stack) + randomJitter());

  return (
    <div
      className="absolute top-0 left-0 right-0 mx-auto flex justify-center items-center gap-1"
      style={{
        zIndex: stack,
        transform: `translate(${translateX}px, ${translateY}px) rotate(${rotate}deg)`,
      }}
    >
      {pile.map((c) => (
        <Card key={`${c.family}-${c.value}`} value={c.value} family={c.family} />
      ))}
    </div>
  );
}
