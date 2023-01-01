export const SET_ERROR = 'SET_ERROR';

export function setError(error) {
  return (dispatch) => dispatch({ type: SET_ERROR, error });
}
