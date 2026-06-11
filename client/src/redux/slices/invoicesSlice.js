import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getApi } from "../../services/api";
import { extractCollection } from "../../utils/normalizeResponse";

export const fetchInvoicesData = createAsyncThunk("fetchInvoicesData", async () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const response = await getApi(
    user.role === "superAdmin" ? "api/invoices/" : `api/invoices/?createBy=${user._id}`,
    { silent: true }
  );
  return extractCollection(response);
});

const invoicesSlice = createSlice({
  name: "invoiceData",
  initialState: {
    data: [],
    isLoading: false,
    error: "",
    hasFetched: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvoicesData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchInvoicesData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.hasFetched = true;
        state.data = action.payload;
        state.error = "";
      })
      .addCase(fetchInvoicesData.rejected, (state, action) => {
        state.isLoading = false;
        state.hasFetched = true;
        state.data = [];
        state.error = action.error.message;
      });
  },
});

export default invoicesSlice.reducer;
