import { createSlice } from "@reduxjs/toolkit";

const initialState = { data: [], loading: false, error: null };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setauthData: (state, action) => {
      state.data = action.payload;
    },
    setauthLoading: (state, action) => {
      state.loading = action.payload;
    },
    setauthError: (state, action) => {
      state.error = action.payload;
    }
  }
});

export const { setauthData, setauthLoading, setauthError } = authSlice.actions;
export default authSlice.reducer;