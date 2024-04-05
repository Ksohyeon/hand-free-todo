import { PayloadAction, createSlice, current } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    uid: "",
    userName: "",
    isLoggedIn: false,
    photoUrl: "",
    email: "",
  },
  reducers: {
    setUserInfo: (state, action) => {
      state.uid = action.payload.uid;
      state.userName = action.payload.userName;
      state.photoUrl = action.payload.photoUrl;
      state.email = action.payload.email;
    },
    setIsLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
    },
  },
});

export const { setUserInfo, setIsLoggedIn } = authSlice.actions;

export default authSlice.reducer;
