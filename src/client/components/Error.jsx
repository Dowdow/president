import React from 'react';
import { useDispatch } from 'react-redux';
import { setError } from '../actions/error';

const Error = ({ message }) => {
	const dispatch = useDispatch();

	handleClose = () => {
		dispatch(setError(null));
	}

	return (
		<div className="error">
			<span>{message}</span>
			<button onClick={handleClose}>Close</button>
		</div>
	);
}

export default Error;