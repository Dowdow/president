import React from 'react';
import PlayableCard from './PlayableCard';

const GameContentCards = ({ cards, maxValue, xOrNothing }) =>
	<div className="game-content-cards">
		{cards
			.sort((a, b) => a.value - b.value)
			.map((card, index) =>
				<PlayableCard
					key={'playble-card-' + index}
					value={card.value}
					family={card.family}
					disabled={xOrNothing ? card.value !== maxValue : card.value < maxValue} />)}
	</div>
	;

export default GameContentCards;