import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getApi } from "../../services/api";
import { toast } from "react-toastify";

export const fetchLeadData = createAsyncThunk("fetchLeadData", async (_, { rejectWithValue }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  try {
    const response = await getApi(
      user?.role === "superAdmin" ? "api/lead/" : `api/lead/?createBy=${user?._id}`
    );

    // Check if response is an error
    if (response?.response) {
      throw new Error(response.response?.data?.error || "Failed to fetch leads");
    }

    return response.data || [];
  } catch (error) {
    // Console statement removed
    toast.error("Failed to fetch leads data. Please try again.");
    return rejectWithValue(error.message);
  }
});

const leadSlice = createSlice({
  name: "leadData",
  initialState: {
    data: [],
    isLoading: false,
    error: "",
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeadData.pending, (state) => {
        state.isLoading = true;
        state.error = "";
      })
      .addCase(fetchLeadData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action?.payload || [];
        state.error = "";
      })
      .addCase(fetchLeadData.rejected, (state, action) => {
        state.isLoading = false;
        state.data = [];
        state.error = action?.payload || action?.error?.message;
      });
  },
});

export default leadSlice.reducer;
