import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import GameHeader from "./GameHeader";
import GameContentAnnouncers from "./GameContentAnnouncers";
import GameContentPlayers from "./GameContentPlayers";
import GameContentPile from "./GameContentPile";
import GameContentCards from "./GameContentCards";
import GameContentButtons from "./GameContentButtons";
import ExchangePanel from "./ExchangePanel";
import { emptySelectedCards } from "../selectedCardsSlice";
import { currentMaxCardValue, isXOrNothing } from "../rules";
import { ClientAction, type Card, type GameView } from "../../connection/protocol";

interface GameProps {
  game: GameView;
  myId: string;
  sendAction: (action: ClientAction, cards?: Card[]) => void;
  onLeave: () => void;
}

export default function Game({ game, myId, sendAction, onLeave }: GameProps) {
  const dispatch = useAppDispatch();
  const selectedCards = useAppSelector((state) => state.selectedCards);

  const me = game.players[myId];
  const maxCardValue = currentMaxCardValue(game.pile, game.roundEnded);
  const xOrNothing = isXOrNothing(game.pile, game.roundEnded, game.lastPlayerHasNothing);

  if (!me) {
    return "Refresh the page";
  }

  const handleStartGame = () => sendAction(ClientAction.Start);

  const handlePlay = () => {
    sendAction(ClientAction.Play, selectedCards);
    dispatch(emptySelectedCards());
  };

  const handleSkip = () => sendAction(ClientAction.Skip);

  const handleNothing = () => sendAction(ClientAction.Nothing);

  const handleExchange = (cards: Card[]) => {
    sendAction(ClientAction.Exchange, cards);
    dispatch(emptySelectedCards());
  };

  const handleLeaveGame = () => {
    sendAction(ClientAction.Leave);
    onLeave();
  };

  const pending = game.pendingGiveBacks[myId];
  if (game.exchanging && pending) {
    const recipient = game.players[pending.recipientId];
    return (
      <ExchangePanel
        myCards={Array.isArray(me.cards) ? me.cards : []}
        pending={pending}
        recipientUsername={recipient?.username ?? "?"}
        onConfirm={handleExchange}
      />
    );
  }

  if (game.exchanging) {
    return <div className="mt-12 text-center text-2xl">En attente de l&apos;échange de cartes...</div>;
  }

  return (
    <div>
      <GameHeader
        gameId={game.id}
        gameStarted={game.started}
        handleStartGame={handleStartGame}
        handleLeaveGame={handleLeaveGame}
      />
      <div className="flex flex-col">
        <GameContentAnnouncers
          gameStarted={game.started}
          pileSize={game.pile.length}
          playing={me.playing}
          roundEnded={game.roundEnded}
        />
        <GameContentPlayers players={game.players} />
        <GameContentPile pile={game.pile} />
        <GameContentCards
          cards={Array.isArray(me.cards) ? me.cards : []}
          maxValue={maxCardValue}
          xOrNothing={xOrNothing && me.playing}
        />
        <GameContentButtons
          handlePlay={handlePlay}
          handleSkip={handleSkip}
          handleNothing={handleNothing}
          playDisabled={!me.playing}
          xOrNothing={xOrNothing && me.playing}
        />
      </div>
    </div>
  );
}
