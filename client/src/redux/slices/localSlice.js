import { createSlice } from "@reduxjs/toolkit";

const getStoredUser = () => {
  const value = localStorage.getItem("user") || sessionStorage.getItem("user");

  if (!value) return null;

  try {
    return JSON.parse(value);
  } catch (error) {
    console.error("Failed to parse stored user", error);
    return null;
  }
};

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
        localStorage.setItem("user", JSON.stringify(action.payload));
        sessionStorage.setItem("user", JSON.stringify(action.payload));
      }
    },
    clearUser: (state) => {
      state.user = null;
      localStorage.removeItem("user");
      sessionStorage.removeItem("user");
    },
  },
});

export const { setUser, clearUser } = localSlice.actions;

export default localSlice.reducer;
