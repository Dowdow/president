import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface SessionState {
  username: string | null;
  playerId: string | null;
}

const initialState: SessionState = {
  username: null,
  playerId: null,
};

const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    setUsername(state, action: PayloadAction<string>) {
      state.username = action.payload;
    },
    setPlayerId(state, action: PayloadAction<string | null>) {
      state.playerId = action.payload;
    },
  },
});

export const { setUsername, setPlayerId } = sessionSlice.actions;
export default sessionSlice.reducer;
