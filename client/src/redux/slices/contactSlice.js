import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getApi } from "services/api";
import { extractCollection } from "../../utils/normalizeResponse";

export const fetchContactData = createAsyncThunk("fetchContactData", async () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const response = await getApi(
    user.role === "superAdmin" ? "api/contact/" : `api/contact/?createBy=${user._id}`,
    { silent: true }
  );
  return extractCollection(response);
});

const getContactSlice = createSlice({
  name: "contactData",
  initialState: {
    data: [],
    isLoading: false,
    error: "",
    hasFetched: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContactData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchContactData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.hasFetched = true;
        state.data = action.payload;
        state.error = "";
      })
      .addCase(fetchContactData.rejected, (state, action) => {
        state.isLoading = false;
        state.hasFetched = true;
        state.data = [];
        state.error = action.error.message;
      });
  },
});

export default getContactSlice.reducer;
