import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import GameContentPlayers from './GameContentPlayers';
import GameContentPile from './GameContentPile';
import GameContentCards from './GameContentCards';
import GameContentButtons from './GameContentButtons';
import { leaveGame, play, startGame } from '../actions/game';

const Game = ({ socket, game }) => {
	const dispatch = useDispatch();

	const selectedCards = useSelector(state => state.selectedCards);

	const handleStartGame = () => {
		dispatch(startGame(socket, game.id));
	}

	const handleLeaveGame = () => {
		dispatch(leaveGame(socket, game.id));
	}

	const handlePlay = () => {
		dispatch(play(socket, game.id, selectedCards));
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
			<div className="game-content">
				<GameContentPlayers players={game.players} />
				<GameContentPile pile={game.pile} />
				<GameContentCards cards={game.players[socket.id].cards} />
				<GameContentButtons handlePlay={handlePlay} playDisabled={!game.players[socket.id].playing} />
			</div>
		</div>
	);
}

export default Game;