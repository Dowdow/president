import React, { useState } from 'react';

export default function GameHeader({ gameId, gameStarted, handleStartGame, handleLeaveGame }) {
  const [showGameId, setShowGameId] = useState(false);

  const handleShowGameId = () => {
    setShowGameId(!showGameId);
  };

  const handleCopyGameIdToClipboard = () => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(gameId);
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = gameId;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      textArea.remove();
    }
  };

  return (
    <div className="flex justify-between items-center p-5 bg-skin-gradient">
      <div className="flex flex-col">
        <div className="flex items-center mb-3">
          <span className="text-2xl">
            Game ID:
            {showGameId ? gameId : '*********'}
          </span>
          <button type="button" onClick={handleShowGameId}>{showGameId ? '🙈' : '👁️'}</button>
          <button type="button" onClick={handleCopyGameIdToClipboard}>📋</button>
        </div>
        <span>Send this ID to your friends for them to join your game</span>
      </div>
      <div className="flex gap-5">
        {!gameStarted ? <button type="button" className="game-button" onClick={handleStartGame}>Start Game</button> : ''}
        <button type="button" className="game-button" onClick={handleLeaveGame}>Leave Game</button>
      </div>
    </div>
  );
}
