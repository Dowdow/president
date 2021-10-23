import React from 'react';

const Player = ({ player }) => {
	const cardsLeft = Array.isArray(player.cards) ? player.cards.length : player.cards;
	const className = 'player' + (player.playing ? ' playing' : '') + (player.skipped ? ' skipped' : '');
	return (
		<div className={className} style={{ order: player.order }}>
			<span>{player.username} - {cardsLeft}</span>
			<span>{Array.apply(null, Array(cardsLeft)).map((c, i) => <span key={i} className="mini-card"></span>)}</span>
			{player.playing ? <span>Playing</span> : ''}
			{player.skipped ? <span>Skipped</span> : ''}
		</div>
	);
}

export default Player;