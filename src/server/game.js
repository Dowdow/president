const CardMixer = require('./cardMixer');
const Pile = require('./pile');
const Player = require('./player');
const { generateUniqueId } = require('./common');
const messages = require('../shared/messages');

class Game {
	constructor() {
		this.id = generateUniqueId();
		this.started = false;
		this.sockets = {};
		this.players = {};
		this.pile = new Pile();
	}

	addPlayer(socket, username) {
		const player = new Player(socket.id, username);
		this.sockets[socket.id] = socket;
		this.players[socket.id] = player;
	}

	removePlayer(socket) {
		delete this.sockets[socket.id];
		delete this.players[socket.id];

		// Si plus que 1 joueur finish la game
	}

	start() {
		this.started = true;

		if (this.hasPlayerWithNullOrder()) {
			this.assignPlayersOrder();
		}

		const cardMixer = new CardMixer();
		cardMixer.generate();
		cardMixer.shuffle();

		const cards = cardMixer.splitCards(Object.keys(this.players).length);
		let c = 0;
		for (const i in this.players) {
			this.players[i].setCards(cards[c]);
			c++;
		}

		// set playing sur le joueur order 1

		this.notifyGameData();
	}

	play(socket, cards) {
		const player = this.players[socket.id];
		if (player === undefined) {
			return;
		}

		if (!player.isPlaying()) { // Ou alors carré magique
			return;
		}

		if (!player.hasCards(cards)) {
			return;
		}

		if (!this.pile.isMoveLegal(cards)) {
			return;
		}

		const removedCards = player.removeCards(cards);
		this.pile.addCards(removedCards);

		// Est ce que le move saute le tour du joueur d'après ?
		// Est ce que c'est un carré magique ?
		// Est ce qu'il finit le pli ?
		// Calcul du joueur suivant
		// Si il n'a plus de cartes finit le tour et assigne le role
		// Est ce qu'il ne reste plus qu'un seul joueur avec des cartes ? => Game fini
		// Fin de partie
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
			pile: this.pile.serialize(),
		};
	}

	assignPlayersOrder() {
		let i = 1;
		for (const p in this.player) {
			this.players[p].setOrder(i);
			i++;
		}
	}

	hasPlayerWithNullOrder() {
		for (const p in this.players) {
			if (this.players[p].getOrder() === null) {
				return true;
			}
		}

		return false;
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
}

module.exports = Game;