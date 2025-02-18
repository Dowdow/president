import { SET_PLAYER_CONNECTED, SET_PLAYER_USERNAME } from '../actions/player';

export default function player(state = { username: null, connected: false }, action = {}) {
  switch (action.type) {
    case SET_PLAYER_CONNECTED:
      return { ...state, connected: action.connected };
    case SET_PLAYER_USERNAME:
      return { ...state, username: action.username };
    default:
      return state;
  }
}
