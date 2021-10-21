const Cards = require('../shared/cards');

class CardChecker {
	static areCardsValid(cards) {
		for (const c in cards) {
			if (typeof c !== 'object' || c === null) {
				return false;
			}

			if (c.value === undefined) {
				return false;
			}

			if (!Cards.VALUES.includes(c.value)) {
				return false;
			}

			if (c.family === undefined) {
				return false;
			}

			if (!Cards.FAMILIES.includes(c.family)) {
				return false;
			}
		}

		return true;
	}
}

module.exports = CardChecker;