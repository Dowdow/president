const Player = require('./player');
const { generateUniqueId } = require('./common');
const { ADD_PLAYER, REMOVE_PLAYER } = require('../shared/messages');

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
		this.notifyAddPlayer(player.serialize());
	}

	removePlayer(socket) {
		delete this.sockets[socket.id];
		const player = this.players[socket.id];
		this.notifyRemovePlayer(player.serialize());
		delete this.players[socket.id];
	}

	countPlayers() {
		return Object.keys(this.players).length;
	}

	hasPlayer(socket) {
		return this.socket[socket.id] !== undefined;
	}

	notifyAddPlayer(player) {
		for (const i in this.sockets) {
			const socket = this.sockets[i];
			socket.emit(ADD_PLAYER, player);
		}
	}

	notifyRemovePlayer(player) {
		for (const i in this.sockets) {
			const socket = this.sockets[i];
			socket.emit(REMOVE_PLAYER, player);
		}
	}
}

module.exports = Game;