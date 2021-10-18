module.exports = Object.freeze({
	// Basics
	CLIENT_CONNECT: 'connect',
	CLIENT_DISCONNECT: 'disconnect',
	SERVER_CONNECT: 'connection',
	SERVER_DISCONNECT: 'disconnect',

	// From Client to Server
	CREATE_GAME: 'create_game',
	JOIN_GAME: 'join_game',
	LEAVE_GAME: 'leave_game',

	// From Server to Client
	ADD_PLAYER: 'add_player',
	REMOVE_PLAYER: 'remove_player',

	ERROR_GAME_ID: 'error_game_id',
	ERROR_GAME_FULL: 'error_game_full',
});