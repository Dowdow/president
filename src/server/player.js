class Player {
	constructor(id, username) {
		this.id = id;
		this.username = username;
		this.playing = false;
		this.skipped = false;
		this.role = null;
		this.order = null;
		this.cards = [];
	}

	getId() {
		return this.id;
	}

	isPlaying() {
		return this.playing;
	}

	setPlaying(playing) {
		this.playing = playing;
	}

	isSkipped() {
		return this.skipped;
	}

	setSkipped(skipped) {
		this.skipped = skipped;
	}

	hasRole() {
		return this.role !== null;
	}

	getRole() {
		return this.role;
	}

	setRole(role) {
		this.role = role;
	}

	getOrder() {
		return this.order;
	}

	setOrder(order) {
		this.order = order;
	}

	hasCardsLeft() {
		return this.cards.length > 0 ? true : false;
	}

	hasCards(cards) {
		let cardsOwned = 0;

		for (const c of cards) {
			const result = this.cards.filter(card => card.isEqualTo(c));
			cardsOwned += result.length;
		}

		return cards.length === cardsOwned;
	}

	removeCards(cards) {
		const removedCards = [];

		for (const c of cards) {
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
			skipped: this.skipped,
			role: this.role,
			order: this.order,
			cards: showCards ? this.cards.map(c => c.serialize()) : this.cards.length,
		};
	}
}

module.exports = Player;