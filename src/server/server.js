require('dotenv').config()
const express = require('express');
const socketio = require('socket.io');
const messages = require('../shared/messages');
const Creator = require('./creator');

const app = express();
app.use(express.static('public'));

const port = process.env.PORT || 8080;
const server = app.listen(port);
console.log(`Server listening on port ${port}`);

const io = socketio(server);

io.on(messages.SERVER_CONNECT, socket => {
	console.log('Player connected', socket.id);

	socket.on(messages.CREATE_GAME, createGame)
	socket.on(messages.JOIN_GAME, joinGame);
	socket.on(messages.LEAVE_GAME, leaveGame);
	socket.on(messages.START_GAME, startGame);
	socket.on(messages.PLAY, play);
	socket.on(messages.SERVER_DISCONNECT, disconnect);
});

const creator = new Creator();

function createGame(data) {
	creator.createGame(this, data);
}

function joinGame(data) {
	creator.joinGame(this, data)
}

function leaveGame(data) {
	creator.leaveGame(this, data);
}

function startGame(data) {
	creator.startGame(this, data);
}

function play(data) {
	creator.play(this, data);
}

function disconnect() {
	creator.searchDisconnectPlayer(this);
	console.log('Player disconnected', this.id);
}