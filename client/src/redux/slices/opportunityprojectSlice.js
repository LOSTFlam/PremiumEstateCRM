import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getApi } from "../../services/api";
import { extractCollection } from "../../utils/normalizeResponse";

export const fetchOpportunityProjectData = createAsyncThunk(
  "fetchOpportunityProjectData",
  async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const response = await getApi(
      user.role === "superAdmin"
        ? "api/opportunityproject"
        : `api/opportunityproject/?createBy=${user._id}`,
      { silent: true }
    );
    return extractCollection(response);
  }
);

const opportunityProjectSlice = createSlice({
  name: "opportunityProjectData",
  initialState: {
    data: [],
    isLoading: false,
    error: "",
    hasFetched: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOpportunityProjectData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchOpportunityProjectData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.hasFetched = true;
        state.data = action.payload;
        state.error = "";
      })
      .addCase(fetchOpportunityProjectData.rejected, (state, action) => {
        state.isLoading = false;
        state.hasFetched = true;
        state.data = [];
        state.error = action.error.message;
      });
  },
});

export default opportunityProjectSlice.reducer;
