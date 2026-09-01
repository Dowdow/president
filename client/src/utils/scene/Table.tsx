import { BOARD_COLOR, BOARD_SIZE } from "./sceneConstants";

export default function Table() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[BOARD_SIZE, BOARD_SIZE]} />
      <meshBasicMaterial color={BOARD_COLOR} />
    </mesh>
  );
}
