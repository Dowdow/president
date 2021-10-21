import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Card from './Card';
import { addSelectedCard, removeSelectedCard } from '../actions/selectedCards';

const PlayableCard = ({ value, family }) => {
	const dispatch = useDispatch();

	const [select, setSelect] = useState(false);

	useEffect(() => {
		setSelect(false);
	}, [value, family]);

	const handleSelect = () => {
		if (select) {
			dispatch(removeSelectedCard({ value, family }));
		} else {
			dispatch(addSelectedCard({ value, family }));
		}
		setSelect(!select);
	}

	return (
		<div className={'playable-card' + (select ? ' select' : '')} onClick={handleSelect}>
			<Card value={value} family={family} />
		</div>
	);
}

export default PlayableCard;