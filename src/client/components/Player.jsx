import React from 'react';

const Player = ({ player }) => {
	const cardsLeft = Array.isArray(player.cards) ? player.cards.length : player.cards;
	return (
		<div className="player" style={{ order: player.order }}>
			<span>{player.username} - {cardsLeft}</span>
			<span>{Array.apply(null, Array(cardsLeft)).map((c, i) => <span key={i} className="mini-card"></span>)}</span>
		</div>
	);
}

export default Player;