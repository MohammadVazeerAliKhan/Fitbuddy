import { configureStore } from '@reduxjs/toolkit';
import authReducer from "./slices/authSlice";
import groupsReducer from "./slices/groupsSlice";
import goalsReducer from "./slices/goalsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    groups: groupsReducer,
    goals: goalsReducer,
  },

});
