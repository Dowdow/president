import { ADD_SELECTED_CARD, EMPTY_SELECTED_CARDS, REMOVE_SELECTED_CARD } from '../actions/selectedCards';

export default function selectedCards(state = [], action = {}) {
	switch (action.type) {
		case ADD_SELECTED_CARD:
			return [...state, action.card];
		case REMOVE_SELECTED_CARD:
			const index = state.findIndex(c => c.value === action.card.value && c.family === action.card.family);
			if (index !== -1) {
				state.splice(index, 1);
			}
			return [...state];
		case EMPTY_SELECTED_CARDS:
			return [];
		default:
			return state;
	}
}