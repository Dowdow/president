package main

const (
	// Values
	CardValueThree = 3
	CardValueFour  = 4
	CardValueFive  = 5
	CardValueSix   = 6
	CardValueSeven = 7
	CardValueEight = 8
	CardValueNine  = 9
	CardValueTen   = 10
	CardValueJack  = 11
	CardValueQueen = 12
	CardValueKing  = 13
	CardValueAs    = 14
	CardValueTwo   = 15
	// Families
	CardFamilySpade   = 0
	CardFamilyHeart   = 1
	CardFamilyDiamond = 2
	CardFamilyClub    = 3
	// Other
	CardMaxValue = 15
)

var CardValues = [...]int{
	CardValueThree,
	CardValueFour,
	CardValueFive,
	CardValueSix,
	CardValueSeven,
	CardValueEight,
	CardValueNine,
	CardValueTen,
	CardValueJack,
	CardValueQueen,
	CardValueKing,
	CardValueAs,
	CardValueTwo,
}

var CardFamilies = [...]int{
	CardFamilySpade,
	CardFamilyHeart,
	CardFamilyDiamond,
	CardFamilyClub,
}

type Card struct {
	Value  int `json:"value"`
	Family int `json:"family"`
}

func (c *Card) IsEqualTo(c2 *Card) bool {
	if c.Value == c2.Value && c.Family == c2.Family {
		return true
	}

	return false
}

func IsValidCardValue(value int) bool {
	for _, v := range CardValues {
		if v == value {
			return true
		}
	}

	return false
}

func IsValidCardFamily(family int) bool {
	for _, f := range CardFamilies {
		if f == family {
			return true
		}
	}

	return false
}
