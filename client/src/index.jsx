import { createRoot } from "react-dom/client";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { thunk } from "redux-thunk";
import App from "./components/App";
import reducers from "./reducers";
import "./index.css";

const store = configureStore({
  reducer: reducers,
  middleware: [thunk],
});

const root = createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <App />
  </Provider>,
);
