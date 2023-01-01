export const ADD_SELECTED_CARD = 'ADD_SELECTED_CARD';
export const REMOVE_SELECTED_CARD = 'REMOVE_SELECTED_CARD';
export const EMPTY_SELECTED_CARDS = 'EMPTY_SELECTED_CARDS';

export function addSelectedCard(card) {
  return (dispatch) => dispatch({ type: ADD_SELECTED_CARD, card });
}

export function removeSelectedCard(card) {
  return (dispatch) => dispatch({ type: REMOVE_SELECTED_CARD, card });
}

export function emptySelectedCards() {
  return (dispatch) => dispatch({ type: EMPTY_SELECTED_CARDS });
}
