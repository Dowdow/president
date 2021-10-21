export const SET_ERROR = 'SET_ERROR';

export function setError(error) {
	return dispatch => {
		return dispatch({ type: SET_ERROR, error });
	}
}