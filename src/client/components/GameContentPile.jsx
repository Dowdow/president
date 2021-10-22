import React from 'react';
import Pile from './Pile';

const GameContentPile = ({ pile }) =>
	<div className="game-content-pile">
		{Object.keys(pile).map((p, index) => <Pile key={'pile-' + index} pile={pile[p]} stack={index} />)}
	</div>
	;

export default GameContentPile;