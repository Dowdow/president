import React from 'react';
import { transformRoleToString } from '../utils/players';

const Player = ({ player, totalPlayers }) => {
	const cardsLeft = Array.isArray(player.cards) ? player.cards.length : player.cards;
	const className = 'player' + (player.playing ? ' playing' : '') + (player.skipped ? ' skipped' : '');
	return (
		<div className={className} style={{ order: player.order }}>
			<span>{player.username} - {cardsLeft}</span>
			<span>{Array.apply(null, Array(cardsLeft)).map((c, i) => <span key={i} className="mini-card"></span>)}</span>
			<span>{transformRoleToString(player.role, totalPlayers)}</span>
			{player.playing ? <span>Playing</span> : ''}
			{player.skipped ? <span>Skipped</span> : ''}
		</div>
	);
}

export default Player;