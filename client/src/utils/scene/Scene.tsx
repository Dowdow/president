import { useLayoutEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import Table from "./Table";
import PileCards3D from "./PileCards3D";
import PlayerHandCards3D from "./PlayerHandCards3D";
import ActionButtons3D from "./ActionButtons3D";
import { CAMERA_FOV, CAMERA_POSITION } from "./sceneConstants";
import type { Card } from "../connection/protocol";

// The camera is fixed (no orbit/movement), but still needs to be pointed at
// the board once on mount.
function FixedCameraLookAt() {
  const camera = useThree((state) => state.camera);

  useLayoutEffect(() => {
    camera.lookAt(0, 0, 0);
  }, [camera]);

  return null;
}

interface SceneProps {
  pile: Card[][];
  cards: Card[];
  maxValue: number;
  xOrNothing: boolean;
  playDisabled: boolean;
  handlePlay: () => void;
  handleSkip: () => void;
  handleNothing: () => void;
}

export default function Scene({
  pile,
  cards,
  maxValue,
  xOrNothing,
  playDisabled,
  handlePlay,
  handleSkip,
  handleNothing,
}: SceneProps) {
  return (
    <div className="h-[36rem] w-full">
      <Canvas camera={{ position: CAMERA_POSITION, fov: CAMERA_FOV }}>
        <FixedCameraLookAt />
        <ambientLight intensity={1} />
        <Table />
        <PileCards3D pile={pile} />
        <PlayerHandCards3D cards={cards} maxValue={maxValue} xOrNothing={xOrNothing} />
        <ActionButtons3D
          handlePlay={handlePlay}
          handleSkip={handleSkip}
          handleNothing={handleNothing}
          playDisabled={playDisabled}
          xOrNothing={xOrNothing}
        />
      </Canvas>
    </div>
  );
}
