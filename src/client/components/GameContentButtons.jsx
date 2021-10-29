import React from 'react';

const GameContentButtons = ({ handlePlay, handleSkip, handleNothing, playDisabled, xOrNothing }) =>
	<div className="game-content-buttons">
		<button className="game-button" disabled={playDisabled} onClick={handlePlay}>Play</button>
		{xOrNothing ?
			<button className="game-button" disabled={playDisabled} onClick={handleNothing}>Nothing</button>
			:
			<button className="game-button" disabled={playDisabled} onClick={handleSkip}>Skip</button>
		}
	</div>
	;

export default GameContentButtons;