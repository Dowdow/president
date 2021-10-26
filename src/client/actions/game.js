import { emptySelectedCards } from "./selectedCards";
import messages from "../../shared/messages"

export const SET_GAME_DATA = 'SET_GAME_DATA';

function setGame(data) {
	return {
		type: SET_GAME_DATA,
		data,
	};
}

export function createGame(socket, username) {
	return dispatch => {
		socket.emit(messages.CREATE_GAME, { username });
	}
}

export function joinGame(socket, id, username) {
	return dispatch => {
		socket.emit(messages.JOIN_GAME, { id, username });
	}
}

export function leaveGame(socket, id) {
	return dispatch => {
		socket.emit(messages.LEAVE_GAME, { id });
		dispatch(setGame(null));
	}
}

export function startGame(socket, id) {
	return dispatch => {
		socket.emit(messages.START_GAME, { id });
	}
}

export function play(socket, id, cards) {
	return dispatch => {
		socket.emit(messages.PLAY, { id, cards });
		dispatch(emptySelectedCards());
	}
}

export function skip(socket, id) {
	return dispatch => {
		socket.emit(messages.SKIP, { id });
		dispatch(emptySelectedCards());
	}
}

export function nothing(socket, id) {
	return dispatch => {
		socket.emit(messages.NOTHING, { id });
		dispatch(emptySelectedCards());
	}
}

export function setGameData(data) {
	return dispatch => dispatch(setGame(data));
}