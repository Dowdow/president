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
	START_GAME: 'start_game',
	PLAY: 'play',
	SKIP: 'skip',

	// From Server to Client
	GAME_DATA: 'game_data',

	ERROR_GAME_ID: 'error_game_id',
	ERROR_GAME_FULL: 'error_game_full',
	ERROR_GAME_STARTED: 'error_game_started',
	ERROR_MINIMUM_PLAYER: 'error_minimum_player',
});