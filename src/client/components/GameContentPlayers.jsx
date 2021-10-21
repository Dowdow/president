import React from 'react';
import Player from './Player';

const GameContentPlayers = ({ players }) => {
	return (
		<div className="game-content-players">
			{Object.keys(players).map((p, index) => <Player key={'player-' + index} player={players[p]} />)}
		</div>
	);
}

export default GameContentPlayers;