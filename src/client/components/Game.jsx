import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Card from './Card';
import Player from './Player';
import { leaveGame, startGame } from '../actions/game';
import { ERROR_MINIMUM_PLAYER } from '../../shared/messages';

const Game = ({ socket, game }) => {
	const dispatch = useDispatch()

	const [error, setError] = useState(null);

	useEffect(() => {
		if (socket === null) {
			return;
		}

		socket.on(ERROR_MINIMUM_PLAYER, () => {
			setError('Error - Minimum player number is 2');
		});
	}, [socket]);

	const handleStartGame = () => {
		dispatch(startGame(socket, game.id));
	}

	const handleLeaveGame = () => {
		dispatch(leaveGame(socket, game.id));
	}

	if (socket === null) {
		return 'Refresh the page';
	}

	return (
		<div className="game">
			<div className="game-header">
				<div className="game-id">
					<span>Game ID: {game.id}</span>
					<span>Send this ID to your friends for them to join your game</span>
				</div>
				<div className="buttons">
					{!game.started ? <button onClick={handleStartGame}>Start Game</button> : ''}
					<button onClick={handleLeaveGame}>Leave Game</button>
				</div>
			</div>
			{error !== null ? <div className="error">{error}</div> : ''}
			<div className="game-content">
				<div className="game-content-players">
					{Object.keys(game.players).map((p, index) => <Player key={index} player={game.players[p]} />)}
				</div>
				<div className="game-content-pile">

				</div>
				<div className="game-content-cards">
					{game.players !== undefined ?
						game.players[socket.id].cards
							.sort((a, b) => a.value - b.value)
							.map((card, index) => <Card key={index} value={card.value} family={card.family} />)
						: ''}
				</div>
			</div>
		</div>
	);
}

export default Game;