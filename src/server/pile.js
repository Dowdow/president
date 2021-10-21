class Pile {
	constructor() {
		this.pile = {};
	}

	isMoveLegal(cards) {
		const lastMoveIndex = Object.keys(this.pile).length;
		if (lastMoveIndex === 0) {
			return true;
		}

		const lastMove = this.pile[lastMoveIndex - 1];
		if (lastMove.length !== cards.length) {
			return false;
		}

		if (cards.length > 1) {
			const total = cards.reduce((p, c) => p.getValue() + c.getValue());
			if ((total / cards.length) !== cards[0].getValue()) {
				return false;
			}
		}

		const lastMoveTotal = lastMove.reduce((p, c) => p.getValue() + c.getValue());
		const currentTotal = cards.reduce((p, c) => p.getValue() + c.getValue());
		if (currentTotal >= lastMoveTotal) {
			return true;
		}

		return false;
	}

	addCards(cards) {
		this.pile[Object.keys(this.pile).length] = cards;
	}

	cleanPile() {
		this.pile = {};
	}

	serialize() {
		const pile = {};

		for (const p in this.pile) {
			const move = this.pile[p];
			const serializedMove = [];
			for (const card in move) {
				serializedMove.push(card.serialize());
			}

			pile[p] = serializedMove;
		}

		return pile;
	}
}

module.exports = Pile;