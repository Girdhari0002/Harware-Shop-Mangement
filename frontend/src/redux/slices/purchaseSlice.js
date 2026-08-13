import { createSlice } from "@reduxjs/toolkit";

const initialState = { data: [], loading: false, error: null };

const purchaseSlice = createSlice({
  name: "purchase",
  initialState,
  reducers: {
    setpurchaseData: (state, action) => {
      state.data = action.payload;
    },
    setpurchaseLoading: (state, action) => {
      state.loading = action.payload;
    },
    setpurchaseError: (state, action) => {
      state.error = action.payload;
    }
  }
});

export const { setpurchaseData, setpurchaseLoading, setpurchaseError } = purchaseSlice.actions;
export default purchaseSlice.reducer;