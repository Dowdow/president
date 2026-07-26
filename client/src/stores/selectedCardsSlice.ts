import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Card } from "../utils/connection/protocol";
import { isSameCard } from "../utils/game/rules";

const selectedCardsSlice = createSlice({
  name: "selectedCards",
  initialState: [] as Card[],
  reducers: {
    addSelectedCard(state, action: PayloadAction<Card>) {
      state.push(action.payload);
    },
    removeSelectedCard(state, action: PayloadAction<Card>) {
      return state.filter((c) => !isSameCard(c, action.payload));
    },
    emptySelectedCards() {
      return [];
    },
  },
});

export const { addSelectedCard, removeSelectedCard, emptySelectedCards } = selectedCardsSlice.actions;
export default selectedCardsSlice.reducer;
