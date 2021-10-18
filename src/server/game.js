const Player = require('./player');
const { generateUniqueId } = require('./common');
const { ADD_PLAYER, REMOVE_PLAYER, GAME_DATA } = require('../shared/messages');

class Game {
	constructor() {
		this.id = generateUniqueId();
		this.sockets = {};
		this.players = {};
	}

	addPlayer(socket, username) {
		const player = new Player(socket.id, username);
		this.sockets[socket.id] = socket;
		this.players[socket.id] = player;
	}

	removePlayer(socket) {
		delete this.sockets[socket.id];
		delete this.players[socket.id];
	}

	countPlayers() {
		return Object.keys(this.players).length;
	}

	hasPlayer(socket) {
		return this.sockets[socket.id] !== undefined;
	}

	notifyGameData() {
		for (const i in this.sockets) {
			const socket = this.sockets[i];
			socket.emit(GAME_DATA, this.serialize());
		}
	}

	serialize() {
		const players = {};
		for (const i in this.players) {
			const player = this.players[i];
			players[player.id] = player.serialize();
		}

		return {
			id: this.id,
			players: players,
		};
	}
}

module.exports = Game;