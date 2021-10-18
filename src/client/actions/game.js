import { CREATE_GAME, JOIN_GAME } from "../../shared/messages"

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