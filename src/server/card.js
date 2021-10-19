class Card {
	constructor(value, family) {
		this.value = value;
		this.family = family;
	}

	serialize() {
		return {
			value: this.value,
			family: this.family,
		}
	}
}

module.exports = Card;