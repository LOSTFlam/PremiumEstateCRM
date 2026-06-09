import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getApi } from "../../services/api";

export const fetchLeadCustomFiled = createAsyncThunk("fetchLeadCustomFiled", async () => {
  const response = await getApi(`api/custom-field/?moduleName=Leads`);
  // response is already result.data from getApi
  return Array.isArray(response) ? response : response?.data || [];
});

const leadCustomFiledSlice = createSlice({
  name: "leadCustomFiledData",
  initialState: {
    data: [],
    isLoading: false,
    error: "",
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeadCustomFiled.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchLeadCustomFiled.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
        state.error = "";
      })
      .addCase(fetchLeadCustomFiled.rejected, (state, action) => {
        state.isLoading = false;
        state.data = [];
        state.error = action.error.message;
      });
  },
});

export default leadCustomFiledSlice.reducer;
