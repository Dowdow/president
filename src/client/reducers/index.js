import { combineReducers } from 'redux';
import error from './error';
import game from './game';
import player from './player';
import socket from './socket';

const appReducer = combineReducers({
	error,
	game,
	player,
	socket,
});

export default appReducer;