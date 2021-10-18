import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import UsernameForm from './UsernameForm';
import GameSettings from './GameSettings';
import Game from './Game';
import { connect } from '../actions/socket';
import { setPlayerConnected } from '../actions/player';
import { CLIENT_CONNECT, CLIENT_DISCONNECT, SERVER_DISCONNECT } from '../../shared/messages';

const App = () => {
	const dispatch = useDispatch();

	const socket = useSelector(state => state.socket);
	const player = useSelector(state => state.player);
	const game = useSelector(state => state.game);

	useEffect(() => {
		if (socket === null) {
			dispatch(connect());
		}
	}, []);

	useEffect(() => {
		if (socket === null) {
			return;
		}

		socket.on(CLIENT_CONNECT, () => {
			dispatch(setPlayerConnected(true));
		});

		socket.on(CLIENT_DISCONNECT, () => {
			dispatch(setPlayerConnected(false));
			socket.emit(SERVER_DISCONNECT, { coucou: 'coucou' });
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
				{player.username !== null && game === null ? <GameSettings socket={socket} username={username} /> : ''}
				{player.username !== null && game !== null ? <Game /> : ''}
			</div>
		</div>
	)
};

export default App;