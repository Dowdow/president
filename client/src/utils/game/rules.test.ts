import { describe, expect, it } from "vitest";
import {
  cardsLeftCount,
  currentMaxCardValue,
  isCardDisabled,
  isSameCard,
  isXOrNothing,
  sortCardsByValue,
} from "./rules";
import { CardFamily, type CardFamily as CardFamilyType } from "../connection/protocol";

function card(value: number, family: CardFamilyType = CardFamily.Spade) {
  return { value, family };
}

describe("isSameCard", () => {
  it("matches on value and family", () => {
    expect(isSameCard(card(7, CardFamily.Heart), card(7, CardFamily.Heart))).toBe(true);
  });

  it("rejects a different family", () => {
    expect(isSameCard(card(7, CardFamily.Heart), card(7, CardFamily.Spade))).toBe(false);
  });

  it("rejects a different value", () => {
    expect(isSameCard(card(7, CardFamily.Heart), card(8, CardFamily.Heart))).toBe(false);
  });
});

describe("sortCardsByValue", () => {
  it("sorts ascending without mutating the input", () => {
    const hand = [card(10), card(3), card(15)];
    const sorted = sortCardsByValue(hand);

    expect(sorted.map((c) => c.value)).toEqual([3, 10, 15]);
    expect(hand.map((c) => c.value)).toEqual([10, 3, 15]);
  });
});

describe("cardsLeftCount", () => {
  it("counts a revealed hand", () => {
    expect(cardsLeftCount([card(3), card(4)])).toBe(2);
  });

  it("passes through an opponent's hidden count", () => {
    expect(cardsLeftCount(5)).toBe(5);
  });
});

describe("currentMaxCardValue", () => {
  it("is 0 on an empty pile", () => {
    expect(currentMaxCardValue([], false)).toBe(0);
  });

  it("is 0 once the round has ended", () => {
    expect(currentMaxCardValue([[card(9)]], true)).toBe(0);
  });

  it("is the last move's value otherwise", () => {
    expect(currentMaxCardValue([[card(5)], [card(9)]], false)).toBe(9);
  });
});

describe("isXOrNothing", () => {
  it("is false with fewer than 2 moves", () => {
    expect(isXOrNothing([[card(9)]], false, false)).toBe(false);
  });

  it("is true when the last two moves share the same value", () => {
    expect(isXOrNothing([[card(9)], [card(9)]], false, false)).toBe(true);
  });

  it("is false once the player has declared having nothing", () => {
    expect(isXOrNothing([[card(9)], [card(9)]], false, true)).toBe(false);
  });

  it("is false once the round has ended", () => {
    expect(isXOrNothing([[card(9)], [card(9)]], true, false)).toBe(false);
  });
});

describe("isCardDisabled", () => {
  it("requires an equal or higher value outside the X-or-nothing rule", () => {
    expect(isCardDisabled(5, 7, false)).toBe(true);
    expect(isCardDisabled(7, 7, false)).toBe(false);
    expect(isCardDisabled(9, 7, false)).toBe(false);
  });

  it("requires an exact match under the X-or-nothing rule", () => {
    expect(isCardDisabled(9, 7, true)).toBe(true);
    expect(isCardDisabled(7, 7, true)).toBe(false);
  });
});
