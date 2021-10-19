import React, { useState } from 'react';

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

function transformValue(v) {
	switch (v) {
		case 11:
			return 'J';
		case 12:
			return 'Q';
		case 13:
			return 'K';
		case 14:
			return '1';
		case 20:
			return '2';
		default:
			return v;
	}
}

function transformFamily(f) {
	switch (f) {
		case 'S':
			return '♠️';
		case 'H':
			return '♥️';
		case 'D':
			return '♦️';
		case 'C':
			return '♣️';
		default:
			return '?';
	}
}