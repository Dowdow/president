// Pure game-presentation logic, kept free of React/Redux so it can be unit
// tested directly. Mirrors the client-side bits the old Game.jsx computed
// inline (current max pile value, the "X or nothing" rule, card sorting).

import type { Card } from "../connection/protocol";

export function isSameCard(a: Card, b: Card): boolean {
  return a.value === b.value && a.family === b.family;
}

export function sortCardsByValue(cards: Card[]): Card[] {
  return [...cards].sort((a, b) => a.value - b.value);
}

export function cardsLeftCount(cards: Card[] | number): number {
  return Array.isArray(cards) ? cards.length : cards;
}

// currentMaxCardValue returns the value a move must beat, or 0 if any card
// can currently be played (empty pile, or the round just ended).
export function currentMaxCardValue(pile: Card[][], roundEnded: boolean): number {
  if (roundEnded || pile.length === 0) {
    return 0;
  }

  return pile[pile.length - 1][0].value;
}

// isXOrNothing reports whether the last two moves on the pile were single
// cards of the same value, which locks the next move to that same value
// unless the current player has declared having nothing to match it with
// (see the "nothing" action, server/game.go).
export function isXOrNothing(pile: Card[][], roundEnded: boolean, lastPlayerHasNothing: boolean): boolean {
  if (roundEnded || lastPlayerHasNothing || pile.length < 2) {
    return false;
  }

  const last = pile[pile.length - 1];
  const beforeLast = pile[pile.length - 2];

  return last[0].value === beforeLast[0].value;
}

// isCardDisabled tells whether a given card in hand can currently be played
// on its own: under the "X or nothing" rule only the matching value is
// selectable, otherwise anything at or above the pile's current value is.
export function isCardDisabled(cardValue: number, maxValue: number, xOrNothing: boolean): boolean {
  return xOrNothing ? cardValue !== maxValue : cardValue < maxValue;
}
