const { MAX_VALUE } = require("../shared/cards");

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

		// Si on est sur du une carte par une carte et que les deux dernière sont identiques alors la carte doit avoir la même valeur

		const lastMoveTotal = lastMove.reduce((p, c) => p + c.getValue(), 0);
		const currentTotal = cards.reduce((p, c) => p + c.getValue(), 0);
		if (currentTotal >= lastMoveTotal) {
			return true;
		}

		return false;
	}

	isPileCompleted() {
		const pileSize = Object.keys(this.pile).length;
		if (pileSize === 0) {
			return false;
		}

		if (this.pile[pileSize - 1][0].getValue() === MAX_VALUE) {
			return true;
		}

		const pileCardSize = this.pile[0].length;

		if (pileCardSize === 4) {
			return true;
		}

		if (pileSize >= 4 && pileCardSize === 1) {
			const firstCard = this.pile[pileSize - 1][0].getValue();
			const secondCard = this.pile[pileSize - 2][0].getValue();
			const thirdCard = this.pile[pileSize - 3][0].getValue();
			const fourthCard = this.pile[pileSize - 4][0].getValue();

			return firstCard === secondCard && secondCard === thirdCard && thirdCard === fourthCard;
		}

		if (pileSize >= 2 && pileCardSize === 2) {
			const firstCard = this.pile[pileSize - 1][0].getValue();
			const secondCard = this.pile[pileSize - 2][0].getValue();

			return firstCard === secondCard;
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