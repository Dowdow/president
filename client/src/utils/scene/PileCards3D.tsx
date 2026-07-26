import { useState } from "react";
import PlayingCard3D from "./PlayingCard3D";
import { cardKey } from "./cardKey";
import { randomJitter, xFromStack, yFromStack } from "../game/pileLayout";
import { PILE_Z } from "./sceneConstants";
import type { Card } from "../connection/protocol";

const JITTER_SCALE = 0.025;
const STACK_HEIGHT = 0.02;

interface PileMove3DProps {
  move: Card[];
  stack: number;
}

// Jitter is randomized once per mounted stack (lazy useState init, no
// effect) so already-placed moves don't reshuffle their position/rotation
// every time a new card is added to the pile — same stability trick used by
// the DOM Pile.tsx before this scene existed.
function PileMove3D({ move, stack }: PileMove3DProps) {
  const [x] = useState(() => xFromStack(stack) * JITTER_SCALE + randomJitter() * JITTER_SCALE);
  const [z] = useState(() => PILE_Z + yFromStack(stack) * JITTER_SCALE + randomJitter() * JITTER_SCALE);
  const [rotation] = useState(() => (randomJitter() / 10) * (Math.PI / 6));

  return (
    <>
      {move.map((card) => (
        <PlayingCard3D
          key={cardKey(card)}
          value={card.value}
          family={card.family}
          position={[x, stack * STACK_HEIGHT, z]}
          rotation={rotation}
        />
      ))}
    </>
  );
}

interface PileCards3DProps {
  pile: Card[][];
}

export default function PileCards3D({ pile }: PileCards3DProps) {
  return (
    <>
      {pile.map((move, stack) => (
        <PileMove3D key={stack} move={move} stack={stack} />
      ))}
    </>
  );
}
