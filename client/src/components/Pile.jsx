import React, { useEffect, useState } from 'react';
import Card from './Card';
import { randomInt, xFromStack, yFromStack } from '../utils/pile';

export default function Pile({ pile, stack }) {
  const [rotate, setRotate] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);

  useEffect(() => {
    setRotate(randomInt());
    setTranslateX(xFromStack(stack) + randomInt());
    setTranslateY(yFromStack(stack) + randomInt());
  }, [stack]);

  return (
    <div className="absolute top-0 left-0 right-0 mx-auto flex justify-center items-center gap-1" style={{ zIndex: stack, transform: `translate(${translateX}px, ${translateY}px) rotate(${rotate}deg)` }}>
      {pile.map((c) => <Card key={`${c.family}-${c.value}`} value={c.value} family={c.family} />)}
    </div>
  );
}
