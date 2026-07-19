import { useEffect, useState } from "react";
import { playEndAudio, playNothingAudio, playPlayingAudio } from "../../../shared/sounds";

interface GameContentAnnouncersProps {
  gameStarted: boolean;
  pileSize: number;
  playing: boolean;
  roundEnded: boolean;
}

export default function GameContentAnnouncers({ gameStarted, pileSize, playing, roundEnded }: GameContentAnnouncersProps) {
  const [message] = useState("");

  useEffect(() => {
    if (!gameStarted && pileSize > 0) {
      playEndAudio();
    }
    // Only react to the game actually ending, not every pile change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameStarted]);

  useEffect(() => {
    if (playing) {
      playPlayingAudio();
    }
  }, [playing]);

  useEffect(() => {
    if (roundEnded) {
      playNothingAudio();
    }
  }, [roundEnded]);

  return (
    <div>
      <span>{message}</span>
    </div>
  );
}
