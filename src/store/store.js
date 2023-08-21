import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./authSlice.js";
export default configureStore({
  reducer: {
    auth: authSlice.reducer,
  },
});
