export function transformRoleToString(role, playerCount) {
	switch (role) {
		case 0:
			return 'Président';
		case 1:
			return playerCount === 2 ? 'Trou duc' : playerCount === 3 ? 'Neutre' : 'Vice-Président';
		case 2:
			return playerCount === 3 ? 'Trou duc' : playerCount === 4 ? 'Vice trou' : 'Neutre';
		case 3:
			return playerCount === 4 ? 'Trou duc' : playerCount === 5 ? 'Vice trou' : 'Neutre';
		case 4:
			return playerCount > 5 ? 'Vice trou duc' : 'Trou duc';
		case 5:
			return 'Trou duc';
		default:
			return 'Candidate';
	}
}