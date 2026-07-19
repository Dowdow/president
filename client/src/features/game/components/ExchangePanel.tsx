import { useAppSelector } from "../../../app/hooks";
import GameContentCards from "./GameContentCards";
import type { Card, PendingGiveBack } from "../../connection/protocol";

interface ExchangePanelProps {
  myCards: Card[];
  pending: PendingGiveBack;
  recipientUsername: string;
  onConfirm: (cards: Card[]) => void;
}

// Shown during the end-of-round exchange (server/game.go's beginExchangeLocked):
// the président/vice-président pick which cards to hand back to the trou du
// cul/vice trou du cul. The recipient's forced cards have already moved
// silently; this only covers the voluntary give-back.
export default function ExchangePanel({ myCards, pending, recipientUsername, onConfirm }: ExchangePanelProps) {
  const selectedCards = useAppSelector((state) => state.selectedCards);

  const canConfirm = selectedCards.length === pending.count;

  return (
    <div>
      <div className="fixed top-0 left-0 right-0 flex justify-center p-3 bg-skin-gradient">
        <span className="text-2xl">
          Choisis {pending.count} carte{pending.count > 1 ? "s" : ""} à donner à {recipientUsername} (
          {selectedCards.length}/{pending.count})
        </span>
      </div>
      <GameContentCards cards={myCards} maxValue={0} xOrNothing={false} />
      <div className="fixed bottom-0 left-0 right-0 flex justify-center p-5 bg-skin-gradient">
        <button
          type="button"
          className="game-button"
          disabled={!canConfirm}
          onClick={() => onConfirm(selectedCards)}
        >
          Donner ces cartes
        </button>
      </div>
    </div>
  );
}
