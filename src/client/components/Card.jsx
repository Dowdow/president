import React from 'react';
import { transformFamily, transformValue } from '../utils/cards';

const Card = ({ value, family, disabled }) =>
	<div className={'card' + (family === 'S' || family === 'C' ? ' black' : ' red') + (disabled ? ' disabled' : '')}>
		<span>{transformValue(value)}</span>
		<span>{transformFamily(family)}</span>
	</div>
	;

export default Card;