import React from 'react';
import { transformFamily, transformValue } from '../utils/cards';

export default function Card({ value, family, disabled }) {
  return (
    <div className={`flex h-40 w-24 bg-white border-2 border-black rounded-lg shadow ${family === 'S' || family === 'C' ? 'text-black' : 'text-skin-red'} ${disabled && 'text-gray-400'}`}>
      <span className="text-4xl ml-3">{transformValue(value)}</span>
      <span className="text-4xl">{transformFamily(family)}</span>
    </div>
  );
}
