import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Card from './Card';
import { addSelectedCard, removeSelectedCard } from '../actions/selectedCards';

export default function PlayableCard({ value, family, disabled }) {
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
  };

  return (
    <div className={`pt-8 pb-2 hover:pt-5 hover:pb-5 -ml-10 cursor-pointer transition-[padding] duration-[50] ${select && 'pt-0 pb-10'} ${disabled && '!pt-10 !pb-0 cursor-not-allowed'}`} onClick={handleSelect} role="figure">
      <Card value={value} family={family} disabled={disabled} />
    </div>
  );
}
