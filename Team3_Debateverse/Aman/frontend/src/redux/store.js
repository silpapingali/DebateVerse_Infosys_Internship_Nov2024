import { configureStore } from "@reduxjs/toolkit";
import userDebatesReducer from "./slices/userDebateSlice";

export const store = configureStore({
  reducer: {
    userDebates: userDebatesReducer,
  },
});
