import React, { useEffect, useState } from 'react';
import { playEndAudio, playNothingAudio, playPlayingAudio } from '../utils/sounds';

export default function GameContentAnnouncers({ gameStarted, pileSize, playing, roundEnded }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!gameStarted && pileSize > 0) {
      playEndAudio();
    }
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
