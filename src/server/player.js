class Player {
	constructor(id, username) {
		this.id = id;
		this.username = username;
		this.playing = false;
		this.order = null;
		this.cards = [];
	}

	isPlaying() {
		return this.playing;
	}

	setPlaying(playing) {
		this.playing = playing;
	}

	getOrder() {
		return this.order;
	}

	setOrder(order) {
		this.order = order;
	}

	hasCards(cards) {
		let cardsOwned = 0;

		for (const c in cards) {
			const result = this.cards.filter(card => card.isEqualTo(c));
			cardsOwned += result.length;
		}

		return cards.length === cardsOwned;
	}

	removeCards(cards) {
		const removedCards = [];

		for (c in cards) {
			const index = this.cards.findIndex(card => card.isEqualTo(c));
			if (index > -1) {
				removedCards.push(this.cards.splice(index, 1)[0]);
			}
		}

		return removedCards;
	}

	setCards(cards) {
		this.cards = cards;
	}

	serialize(showCards) {
		return {
			id: this.id,
			username: this.username,
			playing: this.playing,
			order: this.order,
			cards: showCards ? this.cards.map(c => c.serialize()) : this.cards.length,
		};
	}
}

module.exports = Player;