import React from 'react';

const GameContentPile = ({ pile }) => {
	return (
		<div className="game-content-pile">
			{Object.keys(pile).map((p, index) => <span key={index}>{pile[p].map(c => `${c.value}-${c.family}`)}</span>)}
		</div>
	);
}

export default GameContentPile;