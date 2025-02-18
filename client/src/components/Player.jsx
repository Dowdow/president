import React from 'react';
import transformRoleToString from '../utils/players';

export default function Player({ player, totalPlayers }) {
  const cardsLeft = Array.isArray(player.cards) ? player.cards.length : player.cards;
  return (
    <div className={`flex items-center mb-5 ${player.playing ? 'ml-5' : ''}`} style={{ order: player.order }}>
      <div className={`flex flex-col w-32 p-2 border-4 border-black rounded-lg shadow transition-[margin-left] duration-100 ease-in-out ${player.playing && 'bg-skin-red'} ${player.skipped && 'bg-white'} ${!player.playing && !player.skipped && 'bg-skin-blue'}`}>
        <span className="text-2xl mb-1">{player.username}</span>
        <span>{[...Array(cardsLeft)].map((c, i) => <span key={i} className="inline-block w-2 h-3 m-0.5 bg-white border-2 border-black rounded shadow" />)}</span>
      </div>
      <div className="flex flex-col gap-0.5 ml-3 text-2xl">
        <span>
          🃏
          {cardsLeft}
        </span>
        <span>{transformRoleToString(player.role, totalPlayers)}</span>
        {player.playing ? <span>🤔</span> : ''}
        {player.skipped ? <span>😴</span> : ''}
      </div>
    </div>
  );
}
