import React from 'react';

const GameContentButtons = ({ handlePlay, handleSkip, playDisabled }) => {
	return (
		<div className="game-content-buttons">
			<button disabled={playDisabled} onClick={handlePlay}>Play</button>
			<button disabled={playDisabled} onClick={handleSkip}>Skip</button>
		</div>
	);
}

export default GameContentButtons;