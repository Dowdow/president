import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface ConnectionState {
  connected: boolean;
  error: string | null;
}

const initialState: ConnectionState = {
  connected: false,
  error: null,
};

const connectionSlice = createSlice({
  name: "connection",
  initialState,
  reducers: {
    setConnected(state, action: PayloadAction<boolean>) {
      state.connected = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const { setConnected, setError } = connectionSlice.actions;
export default connectionSlice.reducer;
