const Game = require('./game');
const CardChecker = require('./cardChecker');
const Card = require('./card');
const messages = require('../shared/messages');

class Creator {
  constructor() {
    this.games = {};
  }

  createGame(socket, { username }) {
    const game = new Game();
    this.games[game.id] = game;
    game.addPlayer(socket, username);
    game.notifyGameData();
  }

  joinGame(socket, { id, username }) {
    if (this.games[id] === undefined) {
      socket.emit(messages.ERROR_GAME_ID, { id });
      return;
    }

    const game = this.games[id];

    if (game.hasStarted()) {
      socket.emit(messages.ERROR_GAME_STARTED, { id });
      return;
    }

    const playerCount = game.countPlayers();
    if (playerCount >= 6) {
      socket.emit(messages.ERROR_GAME_FULL, {});
      return;
    }

    game.addPlayer(socket, username);
    game.notifyGameData();
  }

  leaveGame(socket, { id }) {
    if (this.games[id] === undefined) {
      socket.emit(messages.ERROR_GAME_ID, { id });
      return;
    }

    const game = this.games[id];
    game.removePlayer(socket);
    this.checkGameEmpty(game);

    if (this.games[id] !== undefined) {
      game.notifyGameData();
    }
  }

  startGame(socket, { id }) {
    if (this.games[id] === undefined) {
      socket.emit(messages.ERROR_GAME_ID);
      return;
    }

    const game = this.games[id];

    if (game.hasStarted()) {
      return;
    }

    const playerCount = game.countPlayers();
    if (playerCount < 2) {
      socket.emit(messages.ERROR_MINIMUM_PLAYER);
      return;
    }

    game.start();
    game.notifyGameData();
  }

  play(socket, { id, cards }) {
    if (this.games[id] === undefined) {
      socket.emit(messages.ERROR_GAME_ID);
      return;
    }

    const game = this.games[id];

    if (!game.hasStarted()) {
      return;
    }

    if (!Array.isArray(cards)) {
      return;
    }

    if (cards.length < 1) {
      return;
    }

    if (!CardChecker.areCardsValid(cards)) {
      return;
    }

    const cardObjects = [];
    for (const c of cards) {
      cardObjects.push(new Card(c.value, c.family));
    }

    game.play(socket, cardObjects);
    game.notifyGameData();
  }

  skip(socket, { id }) {
    if (this.games[id] === undefined) {
      socket.emit(messages.ERROR_GAME_ID);
      return;
    }

    const game = this.games[id];

    if (!game.hasStarted()) {
      return;
    }

    game.skip(socket);
    game.notifyGameData();
  }

  nothing(socket, { id }) {
    if (this.games[id] === undefined) {
      socket.emit(messages.ERROR_GAME_ID);
      return;
    }

    const game = this.games[id];

    if (!game.hasStarted()) {
      return;
    }

    game.nothing(socket);
    game.notifyGameData();
  }

  searchDisconnectPlayer(socket) {
    for (const i in this.games) {
      const game = this.games[i];
      if (game.hasPlayer(socket)) {
        game.removePlayer(socket);
        this.checkGameEmpty(game);
        if (this.games[i] !== undefined) {
          game.notifyGameData();
        }
        break;
      }
    }
  }

  checkGameEmpty(game) {
    const playerCount = game.countPlayers();
    if (playerCount < 1) {
      delete this.games[game.id];
    }
  }
}

module.exports = Creator;