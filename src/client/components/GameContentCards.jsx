import React from 'react';
import PlayableCard from './PlayableCard';

export default function GameContentCards({ cards, maxValue, xOrNothing }) {
  return (
    <div className="absolute bottom-40 left-0 right-0 w-3/4 flex justify-center mx-auto mt-12">
      {cards
        .sort((a, b) => a.value - b.value)
        .map((card) => (
          <PlayableCard
            key={`${card.family}-${card.value}`}
            value={card.value}
            family={card.family}
            disabled={xOrNothing ? card.value !== maxValue : card.value < maxValue}
          />
        ))}
    </div>
  );
}
