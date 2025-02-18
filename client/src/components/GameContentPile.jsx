import React from 'react';
import Pile from './Pile';

export default function GameContentPile({ pile }) {
  return (
    <div className="absolute top-[20rem] left-0 right-0 w-3/4 mx-auto">
      {Object.keys(pile).map((p, index) => <Pile key={pile[p]} pile={pile[p]} stack={index} />)}
    </div>
  );
}
