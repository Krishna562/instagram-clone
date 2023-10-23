import { configureStore } from "@reduxjs/toolkit";
import { logger } from "redux-logger";
import rootReducer from "./reducers/rootReducer";

const middlewares = [logger];

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({ serializableCheck: true });
  },
});

export default store;
