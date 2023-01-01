import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setPlayerUsername } from '../actions/player';

export default function UsernameForm() {
  const dispatch = useDispatch();

  const [username, setUsername] = useState('');

  const handleChangeUsername = (event) => {
    setUsername(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(setPlayerUsername(username));
  };

  return (
    <div className="w-2/5 mx-auto mt-12 py-10 box">
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <div className="flex flex-col mb-2">
          <label>Pseudo</label>
          <input type="text" name="username" max="30" placeholder="Pseudo" autoComplete="off" value={username} onChange={handleChangeUsername} />
        </div>
        <div className="flex flex-col mb-2">
          <button className="game-button" type="submit">Valider</button>
        </div>
      </form>
    </div>
  );
}
