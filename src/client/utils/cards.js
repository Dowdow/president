export function transformValue(v) {
	switch (v) {
		case 11:
			return 'J';
		case 12:
			return 'Q';
		case 13:
			return 'K';
		case 14:
			return '1';
		case 20:
			return '2';
		default:
			return v;
	}
}

export function transformFamily(f) {
	switch (f) {
		case 'S':
			return '♠️';
		case 'H':
			return '♥️';
		case 'D':
			return '♦️';
		case 'C':
			return '♣️';
		default:
			return '?';
	}
}