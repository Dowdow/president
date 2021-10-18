import { SET_SOCKET } from '../actions/socket';

export default function (state = null, action = {}) {
	switch (action.type) {
		case SET_SOCKET:
			return action.socket;
		default:
			return state;
	}
}