import React from 'react';
import Player from './Player';

export default function GameContentPlayers({ players }) {
  const totalPlayers = Object.keys(players).length;
  return (
    <div className="absolute top-48 left-4 flex flex-col mt-3">
      {Object.keys(players).map((p, index) => <Player key={index} player={players[p]} totalPlayers={totalPlayers} />)}
    </div>
  );
}
