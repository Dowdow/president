import React from 'react';
import Player from './Player';

const GameContentPlayers = ({ players }) => {
	const totalPlayers = Object.keys(players).length;
	return (
		<div className="game-content-players">
			{Object.keys(players).map((p, index) => <Player key={'player-' + index} player={players[p]} totalPlayers={totalPlayers} />)}
		</div>
	);
}

export default GameContentPlayers;