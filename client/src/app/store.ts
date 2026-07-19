import { configureStore } from "@reduxjs/toolkit";
import connectionReducer from "../features/connection/connectionSlice";
import sessionReducer from "../features/session/sessionSlice";
import gameReducer from "../features/game/gameSlice";
import selectedCardsReducer from "../features/game/selectedCardsSlice";

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
