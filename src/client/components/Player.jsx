import React from 'react';

const Player = ({ player }) => {
	const cardsLeft = Array.isArray(player.cards) ? player.cards.length : player.cards;
	return (
		<div className="player">
			<span>{player.username}</span>
			<span>{cardsLeft} {Array.apply(null, Array(cardsLeft)).map((c, i) => <span key={i}>🃏</span>)}</span>
		</div>
	);
}

export default Player;