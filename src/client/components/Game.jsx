import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import GameHeader from './GameHeader';
import GameContentAnnouncers from './GameContentAnnouncers';
import GameContentPlayers from './GameContentPlayers';
import GameContentPile from './GameContentPile';
import GameContentCards from './GameContentCards';
import GameContentButtons from './GameContentButtons';
import { leaveGame, nothing, play, skip, startGame } from '../actions/game';

const Game = ({ socket, game }) => {
	const dispatch = useDispatch();

	const [currentMaxCardValue, setCurrentMaxCardValue] = useState(0);
	const [xOrNothing, setXOrNothing] = useState(false);

	const selectedCards = useSelector(state => state.selectedCards);

	const me = game.players[socket.id];
	const pileSize = Object.keys(game.pile).length;

	useEffect(() => {
		setCurrentMaxCardValue(!game.roundEnded && pileSize > 0 ? game.pile[pileSize - 1][0].value : 0);
		setXOrNothing(!game.roundEnded && !game.lastPlayerHasNothing && pileSize >= 2 && game.pile[pileSize - 1][0].value === game.pile[pileSize - 2][0].value);
	}, [pileSize, game.roundEnded, game.lastPlayerHasNothing]);

	const handleStartGame = () => {
		dispatch(startGame(socket, game.id));
	}

	const handleLeaveGame = () => {
		dispatch(leaveGame(socket, game.id));
	}

	const handlePlay = () => {
		dispatch(play(socket, game.id, selectedCards));
	}

	const handleSkip = () => {
		dispatch(skip(socket, game.id));
	}

	const handleNothing = () => {
		dispatch(nothing(socket, game.id));
	}

	if (socket === null || socket.disconnected || game == undefined) {
		return 'Refresh the page';
	}

	return (
		<div className="game">
			<GameHeader
				gameId={game.id}
				gameStarted={game.started}
				handleStartGame={handleStartGame}
				handleLeaveGame={handleLeaveGame} />
			<div className="game-content">
				<GameContentAnnouncers
					gameStarted={game.started}
					pileSize={pileSize}
					playing={me.playing}
					roundEnded={game.roundEnded} />
				<GameContentPlayers players={game.players} />
				<GameContentPile pile={game.pile} />
				<GameContentCards
					cards={me.cards}
					maxValue={currentMaxCardValue}
					xOrNothing={xOrNothing && me.playing} />
				<GameContentButtons
					handlePlay={handlePlay}
					handleSkip={handleSkip}
					handleNothing={handleNothing}
					playDisabled={!me.playing}
					xOrNothing={xOrNothing && me.playing} />
			</div>
		</div>
	);
}

export default Game;