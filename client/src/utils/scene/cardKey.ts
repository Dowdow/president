import type { Card } from "@/utils/connection/protocol";

export function cardKey(card: Card): string {
  return `${card.family}-${card.value}`;
}
