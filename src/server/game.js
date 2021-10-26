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
		this.roundEnded = false;
		this.lastPlayerHasNothing = false;
	}

	addPlayer(socket, username) {
		const player = new Player(socket.id, username);
		this.sockets[socket.id] = socket;
		this.players[socket.id] = player;
	}

	removePlayer(socket) {
		const player = this.players[socket.id];
		if (this.hasStarted() && this.countPlayers() > 2 && player.isPlaying()) {
			this.computeNextTurn();
		}

		delete this.sockets[socket.id];
		delete this.players[socket.id];

		if (this.hasStarted() && this.countPlayers() < 2) {
			this.endGame(); // Check if valid after finishing method
		}
	}

	start() {
		this.started = true;
		this.pile.cleanPile();

		if (this.hasPlayerWithNullOrder()) {
			this.assignPlayersOrder();
		}

		const cardMixer = new CardMixer();
		cardMixer.generate();
		cardMixer.shuffle();

		const cards = cardMixer.splitCards(this.countPlayers());
		let c = 0;
		for (const i in this.players) {
			this.players[i].setCards(cards[c]);
			c++;
		}

		this.computeNextTurn();
	}

	play(socket, cards) {
		const player = this.players[socket.id];
		if (player === undefined) {
			return;
		}

		console.log('PLAY', cards);

		if (player.isSkipped()) {
			return;
		}

		if (!player.isPlaying()) { // Ou alors carré magique
			return;
		}

		if (!player.hasCards(cards)) {
			return;
		}

		if (this.roundEnded) {
			this.pile.cleanPile();
			this.roundEnded = false;
		}

		if (!this.pile.isMoveLegal(cards, this.lastPlayerHasNothing)) {
			return;
		}

		const removedCards = player.removeCards(cards);
		this.pile.addCards(removedCards);

		this.lastPlayerHasNothing = false;

		if (!player.hasCardsLeft()) {
			player.setRole(this.countPlayersWithRole());
		}

		if (this.countPlayersWithRole() === this.countPlayers() - 1) {
			this.endGame();
			return;
		}

		this.computeNextTurn();
	}

	skip(socket) {
		const player = this.players[socket.id];
		if (player === undefined) {
			return;
		}

		console.log('SKIP');

		if (player.isSkipped()) {
			return;
		}

		if (!player.isPlaying()) {
			return;
		}

		if (this.roundEnded) {
			this.pile.cleanPile();
			this.roundEnded = false;
		}

		player.setSkipped(true);

		this.computeNextTurn();
	}

	nothing(socket) {
		const player = this.players[socket.id];
		if (player === undefined) {
			return;
		}

		console.log('NOTHING');

		if (player.isSkipped()) {
			return;
		}

		if (!player.isPlaying()) {
			return;
		}

		this.lastPlayerHasNothing = true;

		this.computeNextTurn();
	}

	computeNextTurn() {
		if (this.pile.isPileCompleted()) {
			this.endRound();
			return;
		}

		if (!this.canSomeoneStillPlayOnRound()) {
			this.endRound();
			return;
		}

		let currentPlayer = this.findPlayerIsPlaying(true);
		if (currentPlayer === null) {
			currentPlayer = this.findPlayerWithOrder(1);
			currentPlayer.setPlaying(true);
			return;
		}

		let nextPlayer = null;
		let currentOrder = currentPlayer.getOrder();
		do {
			if (currentOrder + 1 > this.countPlayers()) {
				nextPlayer = this.findPlayerWithOrder(1);
				currentOrder = 1;
			} else {
				nextPlayer = this.findPlayerWithOrder(currentOrder + 1);
				currentOrder = nextPlayer.getOrder();
			}

			if (!this.canSomeoneStillPlayOnRound()) {
				this.endRound();
				return;
			}
		} while (nextPlayer === null || (nextPlayer !== null && (nextPlayer.isSkipped() || nextPlayer.hasRole())));

		currentPlayer.setPlaying(false);
		nextPlayer.setPlaying(true);

		if (this.hasAllOtherPlayersSkipped(nextPlayer.getId())) {
			this.endRound();
		}
	}

	endRound() {
		this.roundEnded = true;
		this.lastPlayerHasNothing = false;

		for (const p in this.players) {
			this.players[p].setSkipped(false);
		}
	}

	endGame() {
		this.started = false;
		this.lastPlayerHasNothing = false;

		for (const p in this.players) {
			const player = this.players[p];
			player.setSkipped(false);
			player.setPlaying(false);
			if (!player.hasRole()) {
				player.setRole(this.countPlayersWithRole());
			}
		}
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
			roundEnded: this.roundEnded,
			lastPlayerHasNothing: this.lastPlayerHasNothing,
		};
	}

	assignPlayersOrder() {
		// Prendre en compte les roles plus tard + possibilité réorder
		let i = 1;
		for (const p in this.players) {
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

	hasAllOtherPlayersSkipped(currentPlayerId) {
		for (const p in this.players) {
			if (p !== currentPlayerId && !this.players[p].isSkipped()) {
				return false;
			}
		}

		return true;
	}

	findPlayerIsPlaying(playing) {
		for (const p in this.players) {
			if (this.players[p].isPlaying() === playing) {
				return this.players[p];
			}
		}

		return null;
	}

	canSomeoneStillPlayOnRound() {
		for (const p in this.players) {
			const player = this.players[p];
			if (player.isSkipped() === false && player.hasRole() === false) {
				return true;
			}
		}

		return false;
	}

	findPlayerWithOrder(order) {
		for (const p in this.players) {
			if (this.players[p].getOrder() === order) {
				return this.players[p];
			}
		}

		return null;
	}

	countPlayersWithRole() {
		let count = 0;
		for (const p in this.players) {
			if (this.players[p].hasRole()) {
				count++;
			}
		}
		return count;
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