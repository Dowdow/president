import React from 'react';
import PlayableCard from './PlayableCard';

const GameContentCards = ({ cards }) =>
	<div className="game-content-cards">
		{cards
			.sort((a, b) => a.value - b.value)
			.map((card, index) => <PlayableCard key={'playble-card-' + index} value={card.value} family={card.family} />)}
	</div>
	;

export default GameContentCards;