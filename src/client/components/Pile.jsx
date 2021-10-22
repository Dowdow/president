import React, { useEffect, useState } from 'react';
import Card from './Card';

const Pile = ({ pile, stack }) => {
	const [rotate, setRotate] = useState(0);
	const [translateX, setTranslateX] = useState(0);
	const [translateY, setTranslateY] = useState(0);

	useEffect(() => {
		setRotate(randomIntTenMinusTen());
		setTranslateX(randomIntTenMinusTen());
		setTranslateY(randomIntTenMinusTen());
	}, [stack]);

	return (
		<div style={{ zIndex: stack, transform: `translate(${translateX}px, ${translateY}px) rotate(${rotate}deg)` }}>
			{pile.map((c, index) => <Card key={'pile-card-' + index} value={c.value} family={c.family} />)}
		</div>
	);
}

function randomIntTenMinusTen() {
	const min = -20;
	const max = 20;
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default Pile;