import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import UsernameForm from './UsernameForm';
import GameSettings from './GameSettings';
import Game from './Game';
import { connect } from '../actions/socket';
import { setGameData } from '../actions/game';
import { setPlayerConnected } from '../actions/player';
import { CLIENT_CONNECT, CLIENT_DISCONNECT, GAME_DATA } from '../../shared/messages';

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
		});

		socket.on(GAME_DATA, (data) => {
			dispatch(setGameData(data));
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
		</div>
	)
};

export default App;