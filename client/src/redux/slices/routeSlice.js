import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import _axios from "axios";
import { constant as _constant } from "../../constant";
import { getApi } from "services/api";

export const fetchRouteData = createAsyncThunk("fetchRouteData", async () => {
  const response = await getApi(`api/route/`);
  return response.data;
});

const routeSlice = createSlice({
  name: "routeData",
  initialState: {
    data: [],
    isLoading: false,
    error: "",
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRouteData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchRouteData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
        state.error = "";
      })
      .addCase(fetchRouteData.rejected, (state, action) => {
        state.isLoading = false;
        state.data = [];
        state.error = action.error.message;
      });
  },
});

export default routeSlice.reducer;
