package main

type Pile []GroupCard

func (p *Pile) ClearPile() {
	*p = Pile{}
}

func (p *Pile) AddCards(g GroupCard) {
	*p = append(*p, g)
}

func (p *Pile) IsMoveLegal(g GroupCard, lastPlayerHasNothing bool) bool {
	groupSize := len(g)

	// Si plus d'une carte jouée, on vérifie qu'elles sont toutes identiques en value
	if groupSize > 1 {
		firstValue := g[0].value
		for _, c := range g {
			if c.value != firstValue {
				return false
			}
		}
	}

	pileSize := len(*p)

	// Si la pile est vide, le move est légal
	if pileSize == 0 {
		return true
	}

	lastMove := (*p)[pileSize-1]
	lastMoveSize := len(lastMove)

	// Si le nombre de cartes jouées est différent de celui de la pile, le move est illégal
	if lastMoveSize != groupSize {
		return false
	}

	// Vérifie si le joueur peut sauter le tour d'un autre en ayant la même carte
	if !lastPlayerHasNothing && pileSize >= 2 && lastMoveSize == 1 {
		lastMoveValue := lastMove[0].value
		beforeLastMoveValue := (*p)[pileSize-2][0].value
		if lastMoveValue == beforeLastMoveValue && g[0].value != lastMoveValue {
			return false
		}
	}

	// Si le total des valeurs des cartes est supérieur ou égal au total des valeurs des cartes du dernier coup, le move est légal
	if g.Reduce() >= lastMove.Reduce() {
		return true
	}

	return false
}

func (p *Pile) IsPileCompleted() bool {
	pileSize := len(*p)

	// Pas de cartes dans la pile, le jeu continue
	if pileSize == 0 {
		return false
	}

	// La dernière carte jouée est un 2, le tour se termine
	firstCardValue := (*p)[pileSize-1][0].value
	if firstCardValue == CardMaxValue {
		return true
	}

	pileCardSize := len((*p)[0])

	// Le joueur a joué 4 cartes d'un coup, le tour se termine
	if pileCardSize == 4 {
		return true
	}

	// Carré magique 1x1x1x1
	if pileSize >= 4 && pileCardSize == 1 {
		secondCardValue := (*p)[pileSize-2][0].value
		thirdCardValue := (*p)[pileSize-3][0].value
		fourthCardValue := (*p)[pileSize-4][0].value

		return firstCardValue == secondCardValue && secondCardValue == thirdCardValue && thirdCardValue == fourthCardValue
	}

	// Carré magique 2x2
	if pileSize >= 2 && pileCardSize == 2 {
		secondCardValue := (*p)[pileSize-2][0].value

		return firstCardValue == secondCardValue
	}

	return false
}
