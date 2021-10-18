import { CREATE_GAME, JOIN_GAME } from "../../shared/messages"

export const SET_GAME_DATA = 'SET_GAME_DATA';

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

export function setGameData(data) {
	return dispatch => dispatch({ type: SET_GAME_DATA, data })
}