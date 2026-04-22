import { createSlice } from "@reduxjs/toolkit";

const languageSlice = createSlice({
  name: "language",
  initialState: {
    currentLanguage: localStorage.getItem("i18nextLng") || "en",
  },
  reducers: {
    setLanguage: (state, action) => {
      state.currentLanguage = action.payload;
      localStorage.setItem("i18nextLng", action.payload);
    },
  },
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;
