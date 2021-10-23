import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import UsernameForm from './UsernameForm';
import GameSettings from './GameSettings';
import Game from './Game';
import Error from './Error';
import { connect } from '../actions/socket';
import { setError } from '../actions/error';
import { setGameData } from '../actions/game';
import { setPlayerConnected, setPlayerUsername } from '../actions/player';
import messages from '../../shared/messages';

const App = () => {
	const dispatch = useDispatch();

	const socket = useSelector(state => state.socket);
	const player = useSelector(state => state.player);
	const game = useSelector(state => state.game);
	const error = useSelector(state => state.error);

	useEffect(() => {
		if (socket === null) {
			dispatch(connect());
		}

		dispatch(setPlayerUsername('Test'));
	}, []);

	useEffect(() => {
		if (socket === null) {
			return;
		}

		socket.on(messages.CLIENT_CONNECT, () => {
			dispatch(setPlayerConnected(true));
		});
		socket.on(messages.CLIENT_DISCONNECT, () => {
			dispatch(setPlayerConnected(false));
			dispatch(setGameData(null));
		});
		socket.on(messages.GAME_DATA, (data) => {
			dispatch(setGameData(data));
		});
		socket.on(messages.ERROR_MINIMUM_PLAYER, () => {
			dispatch(setError('Error - Minimum player number is 2'));
		});
		socket.on(messages.ERROR_GAME_ID, () => {
			dispatch(setError('Error - The game id is incorrect'));
		});
		socket.on(messages.ERROR_GAME_FULL, () => {
			dispatch(setError('Error - The game is full'));
		});
		socket.on(messages.ERROR_GAME_STARTED, () => {
			dispatch(setError('Error - The game has already started'));
		});
	}, [socket]);

	if (socket === null) {
		return 'Loading...';
	}

	return (
		<div>
			<header>
				<h1>Président</h1>
				<span>{player.connected ? 'Connected' : 'Disconnected'}</span>
			</header>
			<div className="container">
				{player.username === null ? <UsernameForm /> : ''}
				{player.username !== null && game === null ? <GameSettings socket={socket} username={player.username} /> : ''}
				{player.username !== null && game !== null ? <Game socket={socket} game={game} /> : ''}
			</div>
			{error ? <Error message={error} /> : ''}
		</div>
	)
};

export default App;