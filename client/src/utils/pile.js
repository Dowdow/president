export function randomInt() {
  const min = -10;
  const max = 10;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function xFromStack(stack) {
  switch (stack % 4) {
    case 0:
      return 0;
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

export function yFromStack(stack) {
  switch (stack % 4) {
    case 0:
      return 0;
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
