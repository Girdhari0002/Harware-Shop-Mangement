import { createSlice } from "@reduxjs/toolkit";

const initialState = { data: [], loading: false, error: null };

const saleSlice = createSlice({
  name: "sale",
  initialState,
  reducers: {
    setsaleData: (state, action) => {
      state.data = action.payload;
    },
    setsaleLoading: (state, action) => {
      state.loading = action.payload;
    },
    setsaleError: (state, action) => {
      state.error = action.payload;
    }
  }
});

export const { setsaleData, setsaleLoading, setsaleError } = saleSlice.actions;
export default saleSlice.reducer;