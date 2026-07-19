import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { GameView } from "../connection/protocol";

const gameSlice = createSlice({
  name: "game",
  initialState: null as GameView | null,
  reducers: {
    setGameData(_state, action: PayloadAction<GameView | null>) {
      return action.payload;
    },
  },
});

export const { setGameData } = gameSlice.actions;
export default gameSlice.reducer;
