import { createSlice } from "@reduxjs/toolkit";

const initialState = { data: [], loading: false, error: null };

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setuiData: (state, action) => {
      state.data = action.payload;
    },
    setuiLoading: (state, action) => {
      state.loading = action.payload;
    },
    setuiError: (state, action) => {
      state.error = action.payload;
    }
  }
});

export const { setuiData, setuiLoading, setuiError } = uiSlice.actions;
export default uiSlice.reducer;