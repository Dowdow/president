// Small cosmetic helpers that scatter each move on the pile so it doesn't
// look like a single neat stack. Purely presentational, not game logic.

export function randomJitter(): number {
  const min = -10;
  const max = 10;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function xFromStack(stack: number): number {
  switch (stack % 4) {
    case 1:
      return -40;
    case 2:
      return 30;
    case 3:
      return 75;
    default:
      return 0;
  }
}

export function yFromStack(stack: number): number {
  switch (stack % 4) {
    case 1:
      return 50;
    case 2:
      return 40;
    case 3:
      return -30;
    default:
      return 0;
  }
}
