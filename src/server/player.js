class Player {
	constructor(id, username) {
		this.id = id;
		this.username = username;
		this.cards = [];
	}

	setCards(cards) {
		this.cards = cards;
	}

	serialize(showCards) {
		return {
			id: this.id,
			username: this.username,
			cards: showCards ? this.cards.map(c => c.serialize()) : this.cards.length,
		};
	}
}

module.exports = Player;