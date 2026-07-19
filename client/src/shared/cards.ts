import { CardFamily, type CardFamily as CardFamilyType } from "../features/connection/protocol";

export function transformValue(value: number): string {
  switch (value) {
    case 11:
      return "J";
    case 12:
      return "Q";
    case 13:
      return "K";
    case 14:
      return "A";
    case 15:
      return "2";
    default:
      return String(value);
  }
}

export function transformFamily(family: CardFamilyType): string {
  switch (family) {
    case CardFamily.Spade:
      return "♠️";
    case CardFamily.Heart:
      return "♥️";
    case CardFamily.Diamond:
      return "♦️";
    case CardFamily.Club:
      return "♣️";
    default:
      return "?";
  }
}

export function isRedFamily(family: CardFamilyType): boolean {
  return family === CardFamily.Heart || family === CardFamily.Diamond;
}

// transformRoleToString maps a finishing position to its emoji, e.g. 👑 for
// the président (role 0) and 💩 for the trou du cul (last role). See
// server/game.go's role assignment for how these indices are handed out.
export function transformRoleToString(role: number | null, playerCount: number): string {
  if (role === null) {
    return "🎓";
  }

  if (role === 0) {
    return "👑";
  }

  if (role === playerCount - 1) {
    return "💩";
  }

  if (role === 1 && playerCount >= 4) {
    return "😎";
  }

  if (role === playerCount - 2 && playerCount >= 4) {
    return "🙄";
  }

  return "🤡";
}
