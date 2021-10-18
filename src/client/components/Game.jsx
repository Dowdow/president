import React from 'react';
import { useDispatch } from 'react-redux';
import { leaveGame } from '../actions/game';

const Game = ({ socket, game }) => {
	const dispatch = useDispatch()

	const handleLeaveGame = () => {
		dispatch(leaveGame(socket, game.id));
	}

	if (game === null) {
		return 'Refresh your page';
	}

	return (
		<div>
			<h3>{game.id}</h3>
			{Object.keys(game.players).map((p, index) => <h4 key={index}>{game.players[p].id} - {game.players[p].username}</h4>)}
			<button onClick={handleLeaveGame}>Leave Game</button>
		</div>
	);
}

export default Game;