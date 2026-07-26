import { Text } from "@react-three/drei";
import { isRedFamily, transformFamilySymbol, transformValue } from "../../utils/cards";
import { CARD_COLOR, CARD_DEPTH, CARD_DISABLED_COLOR, CARD_THICKNESS, CARD_WIDTH } from "./sceneConstants";
import type { CardFamily } from "../connection/protocol";

interface PlayingCard3DProps {
  value: number;
  family: CardFamily;
  position: [number, number, number];
  rotation?: number;
  disabled?: boolean;
  selected?: boolean;
  onClick?: () => void;
}

// A single card lying flat on the table (X/Z plane), face up. Used for the
// pile, the player's own hand, and can be reused later for opponents' face-
// down card backs.
export default function PlayingCard3D({
  value,
  family,
  position,
  rotation = 0,
  disabled = false,
  selected = false,
  onClick,
}: PlayingCard3DProps) {
  const textColor = isRedFamily(family) ? "#b5273c" : "#1a1a1a";
  const liftedY = position[1] + (selected ? 0.4 : 0);
  const textY = CARD_THICKNESS / 2 + 0.001;

  return (
    <group
      position={[position[0], liftedY, position[2]]}
      rotation={[0, rotation, 0]}
      onClick={onClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        if (onClick) document.body.style.cursor = "pointer";
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        document.body.style.cursor = "auto";
      }}
    >
      <mesh>
        <boxGeometry args={[CARD_WIDTH, CARD_THICKNESS, CARD_DEPTH]} />
        <meshBasicMaterial color={disabled ? CARD_DISABLED_COLOR : CARD_COLOR} />
      </mesh>
      <Text
        position={[-CARD_WIDTH * 0.28, textY, -CARD_DEPTH * 0.32]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.45}
        color={textColor}
        anchorX="center"
        anchorY="middle"
      >
        {transformValue(value)}
      </Text>
      <Text
        position={[CARD_WIDTH * 0.28, textY, CARD_DEPTH * 0.32]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.4}
        color={textColor}
        anchorX="center"
        anchorY="middle"
      >
        {transformFamilySymbol(family)}
      </Text>
    </group>
  );
}
