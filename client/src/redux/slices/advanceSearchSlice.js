import { createSlice } from "@reduxjs/toolkit";
import { buildSearchResult } from "../search/filterStrategies";

const initialState = {
  searchValue: {},
  getTagValues: [],
  searchResult: [],
};

const advanceSearchSlice = createSlice({
  name: "advanceSearchValue",
  initialState,
  reducers: {
    setSearchValue(state, action) {
      state.searchValue = action.payload;
    },
    setGetTagValues(state, action) {
      state.getTagValues = action.payload;
    },
    getSearchData(state, action) {
      state.searchResult = buildSearchResult(action.payload);
    },
  },
});

export const { setSearchValue, setGetTagValues, getSearchData } =
  advanceSearchSlice.actions;
export default advanceSearchSlice.reducer;
