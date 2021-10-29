import React from 'react';
import { transformRoleToString } from '../utils/players';

const Player = ({ player, totalPlayers }) => {
	const cardsLeft = Array.isArray(player.cards) ? player.cards.length : player.cards;
	const className = 'player' + (player.playing ? ' playing' : '') + (player.skipped ? ' skipped' : '');
	return (
		<div className={className} style={{ order: player.order }}>
			<div className="player-content">
				<span>{player.username}</span>
				<span>{Array.apply(null, Array(cardsLeft)).map((c, i) => <span key={i} className="mini-card"></span>)}</span>
			</div>
			<div className="player-aside">
				<span>🃏{cardsLeft}</span>
				<span>{transformRoleToString(player.role, totalPlayers)}</span>
				{player.playing ? <span>🤔</span> : ''}
				{player.skipped ? <span>😴</span> : ''}
			</div>
		</div>
	);
}

export default Player;