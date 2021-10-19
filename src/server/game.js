const CardMixer = require('./cardMixer');
const Player = require('./player');
const { generateUniqueId } = require('./common');
const messages = require('../shared/messages');

class Game {
	constructor() {
		this.id = generateUniqueId();
		this.started = false;
		this.sockets = {};
		this.players = {};
		this.cardPile = [];
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

	hasStarted() {
		return this.started;
	}

	startGame(socket) {
		this.started = true;

		// generate player order

		// generate cards
		const cardMixer = new CardMixer();
		cardMixer.generate();
		cardMixer.shuffle();

		// give cards to players
		const cards = cardMixer.splitCards(Object.keys(this.players).length);
		let c = 0;
		for (const i in this.players) {
			this.players[i].setCards(cards[c]);
			c++;
		}

		this.notifyGameData();
	}

	notifyGameData() {
		for (const i in this.sockets) {
			const socket = this.sockets[i];
			socket.emit(messages.GAME_DATA, this.serialize(socket.id));
		}
	}

	serialize(id) {
		const players = {};
		for (const i in this.players) {
			const player = this.players[i];
			players[player.id] = player.serialize(player.id === id);
		}

		return {
			id: this.id,
			started: this.started,
			players: players,
		};
	}
}

module.exports = Game;