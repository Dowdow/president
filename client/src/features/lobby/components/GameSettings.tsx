import { useState } from "react";

interface GameSettingsProps {
  onCreateGame: () => void;
  onJoinGame: (gameId: string) => void;
}

export default function GameSettings({ onCreateGame, onJoinGame }: GameSettingsProps) {
  const [gameId, setGameId] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onJoinGame(gameId);
  };

  return (
    <div className="flex flex-col items-center mt-12">
      <div className="flex flex-col items-center w-2/5 pt-5 pb-10 mb-12 box">
        <h3 className="text-3xl mb-5">Create a new game</h3>
        <button type="button" className="game-button" onClick={onCreateGame}>
          Create
        </button>
      </div>
      <div className="flex flex-col items-center w-2/5 pt-5 pb-10 mb-12 box">
        <h3 className="text-3xl mb-5">Join a game</h3>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col mb-5">
            <label>Game ID</label>
            <input
              name="id"
              type="password"
              value={gameId}
              placeholder="********"
              onChange={(event) => setGameId(event.target.value)}
            />
          </div>
          <div className="flex flex-col items-center">
            <button className="game-button" type="submit">
              Join
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
