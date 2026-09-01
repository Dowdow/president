import { Text } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import {
  BUTTON_COLOR,
  BUTTON_DEPTH,
  BUTTON_DISABLED_COLOR,
  BUTTON_GAP,
  BUTTON_HEIGHT,
  BUTTON_WIDTH,
  BUTTON_Z,
} from "./sceneConstants";

interface Button3DProps {
  label: string;
  x: number;
  disabled: boolean;
  onClick: () => void;
}

function Button3D({ label, x, disabled, onClick }: Button3DProps) {
  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (!disabled) document.body.style.cursor = "pointer";
  };

  const handlePointerOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    document.body.style.cursor = "auto";
  };

  return (
    <group
      position={[x, 0, BUTTON_Z]}
      onClick={disabled ? undefined : onClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <mesh>
        <boxGeometry args={[BUTTON_WIDTH, BUTTON_HEIGHT, BUTTON_DEPTH]} />
        <meshBasicMaterial color={disabled ? BUTTON_DISABLED_COLOR : BUTTON_COLOR} />
      </mesh>
      <Text
        position={[0, BUTTON_HEIGHT / 2 + 0.001, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.4}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
    </group>
  );
}

interface ActionButtons3DProps {
  handlePlay: () => void;
  handleSkip: () => void;
  handleNothing: () => void;
  playDisabled: boolean;
  xOrNothing: boolean;
}

export default function ActionButtons3D({
  handlePlay,
  handleSkip,
  handleNothing,
  playDisabled,
  xOrNothing,
}: ActionButtons3DProps) {
  return (
    <>
      <Button3D label="Play" x={-BUTTON_GAP / 2} disabled={playDisabled} onClick={handlePlay} />
      {xOrNothing ? (
        <Button3D label="Nothing" x={BUTTON_GAP / 2} disabled={playDisabled} onClick={handleNothing} />
      ) : (
        <Button3D label="Skip" x={BUTTON_GAP / 2} disabled={playDisabled} onClick={handleSkip} />
      )}
    </>
  );
}
