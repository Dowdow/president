import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createGame, joinGame } from '../actions/game';

export default function GameSettings({ socket, username }) {
  const dispatch = useDispatch();

  const [gameId, setGameId] = useState('');

  const handleCreateGame = () => {
    dispatch(createGame(socket, username));
  };

  const handleGameIdChange = (event) => {
    setGameId(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(joinGame(socket, gameId, username));
  };

  if (socket === null) {
    return 'Refresh the page';
  }

  return (
    <div className="flex flex-col items-center mt-12">
      <div className="flex flex-col items-center w-2/5 pt-5 pb-10 mb-12 box">
        <h3 className="text-3xl mb-5">Create a new game</h3>
        <button type="button" className="game-button" onClick={handleCreateGame}>Create</button>
      </div>
      <div className="flex flex-col items-center w-2/5 pt-5 pb-10 mb-12 box">
        <h3 className="text-3xl mb-5">Join a game</h3>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col mb-5">
            <label>Game ID</label>
            <input name="id" type="password" value={gameId} placeholder="********" onChange={handleGameIdChange} />
          </div>
          <div className="flex flex-col items-center">
            <button className="game-button" type="submit">Join</button>
          </div>
        </form>
      </div>
    </div>
  );
}
