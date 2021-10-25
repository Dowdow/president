import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Card from './Card';
import { addSelectedCard, removeSelectedCard } from '../actions/selectedCards';

const PlayableCard = ({ value, family, disabled }) => {
	const dispatch = useDispatch();

	const [select, setSelect] = useState(false);

	useEffect(() => {
		setSelect(false);
		dispatch(removeSelectedCard({ value, family }));
	}, [value, family, disabled]);

	const handleSelect = () => {
		if (disabled) {
			return;
		}

		if (select) {
			dispatch(removeSelectedCard({ value, family }));
		} else {
			dispatch(addSelectedCard({ value, family }));
		}

		setSelect(!select);
	}

	return (
		<div className={'playable-card' + (select ? ' select' : '') + (disabled ? ' disabled' : '')} onClick={handleSelect}>
			<Card value={value} family={family} disabled={disabled} />
		</div>
	);
}

export default PlayableCard;