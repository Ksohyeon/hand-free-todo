import { configureStore } from "@reduxjs/toolkit";
import themeSlice from "./features/themeSlice";
import authSlice from "./features/authSlice";

export const store = configureStore({
  reducer: { theme: themeSlice, auth: authSlice },
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
