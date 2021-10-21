import React, { useState } from 'react';
import { transformFamily, transformValue } from '../utils/cards';

const Card = ({ value, family }) => {
	const [select, setSelect] = useState(false);

	const handleSelect = () => {
		setSelect(!select);
	}

	return (
		<div className={'card' + (family === 'S' || family === 'C' ? ' black' : ' red') + (select ? ' select' : '')} onClick={handleSelect}>
			<span>{transformValue(value)}</span>
			<span>{transformFamily(family)}</span>
		</div>
	);
}

export default Card;