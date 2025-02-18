export default function transformRoleToString(role, playerCount) {
  switch (role) {
    case 0:
      return '👑';
    case 1:
      return playerCount === 2 ? '💩' : playerCount === 3 ? '🙄' : '😎';
    case 2:
      return playerCount === 3 ? '💩' : playerCount === 4 ? '🤡' : '🙄';
    case 3:
      return playerCount === 4 ? '💩' : playerCount === 5 ? '🤡' : '🙄';
    case 4:
      return playerCount > 5 ? '🤡' : '💩';
    case 5:
      return '💩';
    default:
      return '🎓';
  }
}
