import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setPlayerUsername } from '../actions/player';

const UsernameForm = () => {
	const dispatch = useDispatch();

	const [username, setUsername] = useState('');

	const handleChangeUsername = (event) => {
		setUsername(event.target.value);
	}

	const handleSubmit = (event) => {
		event.preventDefault();
		dispatch(setPlayerUsername(username));
	}

	return (
		<div className="username-form">
			<form onSubmit={handleSubmit}>
				<div>
					<label>Pseudo</label>
					<input type="text" name="username" max="30" placeholder="Pseudo" autoComplete="off" value={username} onChange={handleChangeUsername} />
				</div>
				<div>
					<button type="submit">Valider</button>
				</div>
			</form>
		</div>
	);
}

export default UsernameForm;