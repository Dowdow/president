import React, { useState } from 'react';

const GameHeader = ({ gameId, gameStarted, handleStartGame, handleLeaveGame }) => {
	const [showGameId, setShowGameId] = useState(false);

	const handleShowGameId = () => {
		setShowGameId(!showGameId);
	}

	const handleCopyGameIdToClipboard = () => {
		if (navigator.clipboard && window.isSecureContext) {
			navigator.clipboard.writeText(gameId);
		} else {
			const textArea = document.createElement("textarea");
			textArea.value = gameId;
			textArea.style.position = "fixed";
			textArea.style.left = "-999999px";
			textArea.style.top = "-999999px";
			document.body.appendChild(textArea);
			textArea.focus();
			textArea.select();
			document.execCommand('copy');
			textArea.remove();
		}
	}

	return (
		<div className="game-header">
			<div className="game-id">
				<div>
					<span>Game ID: {showGameId ? gameId : '*********'}</span>
					<button onClick={handleShowGameId}>{showGameId ? '🙈' : '👁️'}</button>
					<button onClick={handleCopyGameIdToClipboard}>📋</button>
				</div>
				<span>Send this ID to your friends for them to join your game</span>
			</div>
			<div className="buttons">
				{!gameStarted ? <button className="game-button" onClick={handleStartGame}>Start Game</button> : ''}
				<button className="game-button" onClick={handleLeaveGame}>Leave Game</button>
			</div>
		</div>
	);
}

export default GameHeader;