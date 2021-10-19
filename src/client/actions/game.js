import { CREATE_GAME, JOIN_GAME, LEAVE_GAME, START_GAME } from "../../shared/messages"

export const SET_GAME_DATA = 'SET_GAME_DATA';

function setGame(data) {
	return {
		type: SET_GAME_DATA,
		data,
	};
}

export function createGame(socket, username) {
	return dispatch => {
		socket.emit(CREATE_GAME, { username });
	}
}

export function joinGame(socket, id, username) {
	return dispatch => {
		socket.emit(JOIN_GAME, { id, username });
	}
}

export function leaveGame(socket, id) {
	return dispatch => {
		socket.emit(LEAVE_GAME, { id });
		dispatch(setGame(null));
	}
}

export function startGame(socket, id) {
	return dispatch => {
		socket.emit(START_GAME, { id });
	}
}

export function setGameData(data) {
	return dispatch => dispatch(setGame(data));
}