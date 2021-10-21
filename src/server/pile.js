class Pile {
	constructor() {
		this.pile = {};
	}

	isMoveLegal(cards) {
		if (cards.length > 1) {
			const firstValue = cards[0].getValue();
			for (const c of cards) {
				if (c.getValue() !== firstValue) {
					return false;
				}
			}
		}

		const lastMoveIndex = Object.keys(this.pile).length;
		if (lastMoveIndex === 0) {
			return true;
		}

		const lastMove = this.pile[lastMoveIndex - 1];
		if (lastMove.length !== cards.length) {
			return false;
		}

		const lastMoveTotal = lastMove.reduce((p, c) => p + c.getValue(), 0);
		const currentTotal = cards.reduce((p, c) => p + c.getValue(), 0);
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
			for (const card of move) {
				serializedMove.push(card.serialize());
			}

			pile[p] = serializedMove;
		}

		return pile;
	}
}

module.exports = Pile;