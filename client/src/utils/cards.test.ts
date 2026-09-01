import { describe, expect, it } from "vitest";
import { transformFamily, transformFamilySymbol, transformRoleToString, transformValue } from "./cards";
import { CardFamily } from "./connection/protocol";

describe("transformValue", () => {
  it("spells out face cards", () => {
    expect(transformValue(11)).toBe("J");
    expect(transformValue(12)).toBe("Q");
    expect(transformValue(13)).toBe("K");
    expect(transformValue(14)).toBe("A");
  });

  it("spells out the max-value two", () => {
    expect(transformValue(15)).toBe("2");
  });

  it("prints plain numbers as-is", () => {
    expect(transformValue(7)).toBe("7");
  });
});

describe("transformFamily", () => {
  it("maps every family to its suit symbol", () => {
    expect(transformFamily(CardFamily.Spade)).toBe("♠️");
    expect(transformFamily(CardFamily.Heart)).toBe("♥️");
    expect(transformFamily(CardFamily.Diamond)).toBe("♦️");
    expect(transformFamily(CardFamily.Club)).toBe("♣️");
  });
});

describe("transformFamilySymbol", () => {
  it("maps every family to its plain suit character, without variation selectors", () => {
    expect(transformFamilySymbol(CardFamily.Spade)).toBe("♠");
    expect(transformFamilySymbol(CardFamily.Heart)).toBe("♥");
    expect(transformFamilySymbol(CardFamily.Diamond)).toBe("♦");
    expect(transformFamilySymbol(CardFamily.Club)).toBe("♣");
  });
});

describe("transformRoleToString", () => {
  it("has no role while still in the round", () => {
    expect(transformRoleToString(null, 4)).toBe("🎓");
  });

  it("crowns the président", () => {
    expect(transformRoleToString(0, 4)).toBe("👑");
  });

  it("marks the trou du cul regardless of table size", () => {
    expect(transformRoleToString(1, 2)).toBe("💩");
    expect(transformRoleToString(2, 3)).toBe("💩");
    expect(transformRoleToString(3, 4)).toBe("💩");
  });

  it("has no vice roles with only 3 players", () => {
    expect(transformRoleToString(1, 3)).toBe("🤡");
  });

  it("marks vice-président and vice-trou-du-cul from 4 players up", () => {
    expect(transformRoleToString(1, 4)).toBe("😎");
    expect(transformRoleToString(2, 4)).toBe("🙄");
  });
});
