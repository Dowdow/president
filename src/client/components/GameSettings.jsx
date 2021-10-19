import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { createGame, joinGame } from '../actions/game';
import { ERROR_GAME_FULL, ERROR_GAME_ID, ERROR_GAME_STARTED } from '../../shared/messages';

const GameSettings = ({ socket, username }) => {
	const dispatch = useDispatch();

	const [gameId, setGameId] = useState('');
	const [error, setError] = useState(null);

	useEffect(() => {
		if (socket === null) {
			return;
		}

		socket.on(ERROR_GAME_ID, () => {
			setError('Error - The game id is incorrect');
		});

		socket.on(ERROR_GAME_FULL, () => {
			setError('Error - The game is full');
		});

		socket.on(ERROR_GAME_STARTED, () => {
			setError('Error - The game has already started');
		});
	}, [socket]);

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
			{error !== null ? <div className="error">{error}</div> : ''}
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