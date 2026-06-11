import { createSlice } from "@reduxjs/toolkit";
import { clearAuthStorage, getStoredUser, persistUser } from "utils/authStorage";

const initialState = {
  user: getStoredUser(),
};

const localSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      if (action.payload) {
        persistUser(action.payload, true);
      }
    },
    clearUser: (state) => {
      state.user = null;
      clearAuthStorage();
    },
  },
});

export const { setUser, clearUser } = localSlice.actions;

export default localSlice.reducer;
