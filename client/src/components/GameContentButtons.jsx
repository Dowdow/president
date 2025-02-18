import React from 'react';

export default function GameContentButtons({ handlePlay, handleSkip, handleNothing, playDisabled, xOrNothing }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center gap-5 p-5 bg-skin-gradient">
      <button type="button" className="game-button" disabled={playDisabled} onClick={handlePlay}>Play</button>
      {xOrNothing
        ? <button type="button" className="game-button" disabled={playDisabled} onClick={handleNothing}>Nothing</button>
        : <button type="button" className="game-button" disabled={playDisabled} onClick={handleSkip}>Skip</button>}
    </div>
  );
}
