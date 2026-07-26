import { describe, expect, it } from "vitest";
import { handCardX } from "./handLayout";

describe("handCardX", () => {
  it("centers a single card on 0", () => {
    expect(handCardX(0, 1, 2)).toBe(0);
  });

  it("spreads two cards symmetrically around 0", () => {
    expect(handCardX(0, 2, 2)).toBe(-1);
    expect(handCardX(1, 2, 2)).toBe(1);
  });

  it("keeps the middle card of an odd hand at 0", () => {
    expect(handCardX(0, 3, 2)).toBe(-2);
    expect(handCardX(1, 3, 2)).toBe(0);
    expect(handCardX(2, 3, 2)).toBe(2);
  });

  it("scales with the spacing parameter", () => {
    expect(handCardX(1, 2, 5)).toBe(2.5);
  });
});
