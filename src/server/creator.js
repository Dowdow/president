const { ERROR_GAME_ID, ERROR_GAME_FULL } = require('../shared/messages');

class Creator {
	constructor() {
		this.games = {};
	}

	createGame(socket, { username }) {
		const game = new Game();
		this.games[game.id] = game;
		game.addPlayer(socket, username);

		console.log(game);
	}

	joinGame(socket, { id, username }) {
		if (this.games[id] === undefined) {
			socket.emit(ERROR_GAME_ID, { id });
			return;
		}

		const game = this.games[id];

		const playerCount = game.countPlayers();
		if (playerCount >= 6) {
			socket.emit(ERROR_GAME_FULL, {});
			return;
		}

		game.addPlayer(socket, username);

		console.log(game);
	}

	leaveGame(socket, { id }) {
		if (this.games[id] === undefined) {
			socket.emit(ERROR_GAME_ID, { id });
			return;
		}

		const game = this.games[id];
		game.removePlayer(socket);

		const playerCount = game.countPlayers();
		if (playerCount < 1) {
			delete this.games[id];
		}

		console.log(game);
	}

	searchDisconnectPlayer(socket) {
		for (const i in this.games) {
			const game = this.games[i];
			if (game.hasPlayer(socket)) {
				game.removePlayer(socket);
				break;
			}
		}
	}
}

module.exports = Creator;