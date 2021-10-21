import React from 'react';
import { transformFamily, transformValue } from '../utils/cards';

const Card = ({ value, family }) =>
	<div className={'card' + (family === 'S' || family === 'C' ? ' black' : ' red')}>
		<span>{transformValue(value)}</span>
		<span>{transformFamily(family)}</span>
	</div>
	;

export default Card;