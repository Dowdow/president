import { combineReducers } from 'redux';
import error from './error';
import game from './game';
import player from './player';
import selectedCards from './selectedCards';
import socket from './socket';

const appReducer = combineReducers({
	error,
	game,
	player,
	selectedCards,
	socket,
});

export default appReducer;