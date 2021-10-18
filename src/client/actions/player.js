export const SET_PLAYER_CONNECTED = 'SET_PLAYER_CONNECTED';
export const SET_PLAYER_USERNAME = 'SET_PLAYER_USERNAME';

export function setPlayerConnected(connected) {
	return dispatch => dispatch({ type: SET_PLAYER_CONNECTED, connected });
}

export function setPlayerUsername(username) {
	return dispatch => dispatch({ type: SET_PLAYER_USERNAME, username });
}

