import { SET_GAME_DATA } from '../actions/game';

export default function game(state = null, action = {}) {
	switch (action.type) {
		case SET_GAME_DATA:
			return action.data;
		default:
			return state;
	}
}