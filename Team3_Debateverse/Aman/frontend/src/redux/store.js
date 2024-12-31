import { configureStore } from "@reduxjs/toolkit";
import userDebatesReducer from "./slices/userDebateSlice";
import allDebatesReducer from "./slices/allDebatesSlice";
import adminDashboardReducer from "./slices/adminDashboardSlice";
import votingReducer from "./slices/votingSlice";

export const store = configureStore({
  reducer: {
    userDebates: userDebatesReducer,
    allDebates: allDebatesReducer,
    adminDashboard: adminDashboardReducer,
    voting: votingReducer,
  },
});
