import React from 'react';
import { useSelector } from 'react-redux';

const Game = () => {
	const game = useSelector(state => state.game);

	if (game === null) {
		return 'Refresh your page';
	}

	return (
		<div>
			<h3>{game.id}</h3>
			{Object.keys(game.players).map((p, index) => <h4 key={index}>{game.players[p].id} - {game.players[p].username}</h4>)}
		</div>
	);
}

export default Game;