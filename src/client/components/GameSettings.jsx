import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createGame, joinGame } from '../actions/game';

const GameSettings = ({ socket, username }) => {
	const dispatch = useDispatch();

	const [gameId, setGameId] = useState('');

	const handleCreateGame = () => {
		dispatch(createGame(socket, username));
	}

	const handleGameIdChange = (event) => {
		setGameId(event.target.value);
	}

	const handleSubmit = (event) => {
		event.preventDefault();
		dispatch(joinGame(socket, gameId, username));
	}

	if (socket === null) {
		return 'Refresh the page';
	}

	return (
		<div className="game-settings">
			<div className="create">
				<h3>Create a new game</h3>
				<button onClick={handleCreateGame}>Create</button>
			</div>
			<div className="join">
				<h3>Join a game</h3>
				<form onSubmit={handleSubmit}>
					<div>
						<label>Game ID</label>
						<input name="id" type="password" value={gameId} onChange={handleGameIdChange} />
					</div>
					<div>
						<button type="submit">Join</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default GameSettings;