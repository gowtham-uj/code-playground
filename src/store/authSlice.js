import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {},
  loading: false,
  error: false,
  errors: {},
  isLoggedIn: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signIn: (state, action) => {
      if (action.payload.error) {
        state.error = true;
        state.errors.signIn = action.payload.errors;
        return;
      }
      state.user = action.payload.user;
      state.isLoggedIn = action.payload.isLoggedIn;
    },
  },
});
