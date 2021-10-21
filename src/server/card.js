class Card {
	constructor(value, family) {
		this.value = value;
		this.family = family;
	}

	isEqualTo(card) {
		return this.value === card.getValue() && this.family === card.getFamily();
	}

	getValue() {
		return this.value;
	}

	getFamily() {
		return this.family;
	}

	serialize() {
		return {
			value: this.value,
			family: this.family,
		}
	}
}

module.exports = Card;