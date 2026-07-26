import { configureStore } from "@reduxjs/toolkit";
import connectionReducer from "./connectionSlice";
import sessionReducer from "./sessionSlice";
import gameReducer from "./gameSlice";
import selectedCardsReducer from "./selectedCardsSlice";

export const store = configureStore({
  reducer: {
    connection: connectionReducer,
    session: sessionReducer,
    game: gameReducer,
    selectedCards: selectedCardsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
