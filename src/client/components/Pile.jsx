import React, { useEffect, useState } from 'react';
import Card from './Card';

const Pile = ({ pile, stack }) => {
	const [rotate, setRotate] = useState(0);
	const [translateX, setTranslateX] = useState(0);
	const [translateY, setTranslateY] = useState(0);

	useEffect(() => {
		setRotate(randomInt());
		setTranslateX(xFromStack(stack) + randomInt());
		setTranslateY(yFromStack(stack) + randomInt());
	}, [stack]);

	return (
		<div style={{ zIndex: stack, transform: `translate(${translateX}px, ${translateY}px) rotate(${rotate}deg)` }}>
			{pile.map((c, index) => <Card key={'pile-card-' + index} value={c.value} family={c.family} />)}
		</div>
	);
}

function randomInt() {
	const min = -10;
	const max = 10;
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function xFromStack(stack) {
	switch (stack % 4) {
		case 0:
			return 0;
		case 1:
			return -40;
		case 2:
			return 30;
		case 3:
			return 75;
		default:
			return 0;
	}
}

function yFromStack(stack) {
	switch (stack % 4) {
		case 0:
			return 0;
		case 1:
			return 50;
		case 2:
			return 40;
		case 3:
			return -30;
		default:
			return 0;
	}
}

export default Pile;