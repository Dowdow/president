const Card = require("./card");

class CardMixer {
	constructor() {
		this.cards = [];
	}

	generate() {
		this.cards = [];
		const families = ['S', 'H', 'D', 'C'];
		const values = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 20];

		families.map(f => {
			values.map(v => {
				this.cards.push(new Card(v, f));
			});
		});
	}

	shuffle() {
		let currentIndex = this.cards.length, randomIndex;

		while (currentIndex != 0) {
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex--;
			[this.cards[currentIndex], this.cards[randomIndex]] = [this.cards[randomIndex], this.cards[currentIndex]];
		}
	}

	splitCards(playerTotal) {
		const deck = [];

		for (let i = 0; i < playerTotal; i++) {
			deck[i] = [];
		}

		while (this.cards.length > 0) {
			for (let i = 0; i < playerTotal; i++) {
				const card = this.cards.splice(0, 1)[0];
				if (card === undefined) {
					break;
				}
				deck[i].push(card);
			}
		}

		return deck;
	}

	getCards() {
		return this.cards;
	}
}

module.exports = CardMixer;