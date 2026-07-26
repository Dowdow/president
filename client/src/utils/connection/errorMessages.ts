// Maps the error codes sent by the Go backend (server/message.go) to a
// user-facing message.
const messages: Record<string, string> = {
  minimum_players: "Il faut au moins 2 joueurs pour démarrer la partie",
  game_full: "Cette partie est complète",
  game_started: "Cette partie a déjà commencé",
  game_not_started: "La partie n'a pas encore commencé",
  game_not_found: "Cette partie n'existe pas",
  invalid_username: "Pseudo invalide",
  invalid_move: "Ce coup n'est pas valide",
  not_your_turn: "Ce n'est pas ton tour",
  invalid_message: "Message invalide",
};

export function describeErrorCode(code: string): string {
  return messages[code] ?? `Erreur (${code})`;
}
