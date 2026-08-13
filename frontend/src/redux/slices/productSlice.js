import { createSlice } from "@reduxjs/toolkit";

const initialState = { data: [], loading: false, error: null };

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setproductData: (state, action) => {
      state.data = action.payload;
    },
    setproductLoading: (state, action) => {
      state.loading = action.payload;
    },
    setproductError: (state, action) => {
      state.error = action.payload;
    }
  }
});

export const { setproductData, setproductLoading, setproductError } = productSlice.actions;
export default productSlice.reducer;