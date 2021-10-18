import { combineReducers } from 'redux';
import game from './game';
import player from './player';
import socket from './socket';

const appReducer = combineReducers({
	game,
	player,
	socket,
});

export default appReducer;