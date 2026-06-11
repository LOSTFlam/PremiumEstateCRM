import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getApi } from "../../services/api";
import { extractCollection } from "../../utils/normalizeResponse";

export const fetchAccountData = createAsyncThunk("fetchAccountData", async () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const response = await getApi(
    user.role === "superAdmin" ? "api/account/" : `api/account/?createBy=${user._id}`,
    { silent: true }
  );
  return extractCollection(response);
});

const accountSlice = createSlice({
  name: "accountData",
  initialState: {
    data: [],
    isLoading: false,
    error: "",
    hasFetched: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccountData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAccountData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.hasFetched = true;
        state.data = action.payload;
        state.error = "";
      })
      .addCase(fetchAccountData.rejected, (state, action) => {
        state.isLoading = false;
        state.hasFetched = true;
        state.data = [];
        state.error = action.error.message;
      });
  },
});

export default accountSlice.reducer;
