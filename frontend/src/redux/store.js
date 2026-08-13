import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import productReducer from "./slices/productSlice";
import saleReducer from "./slices/saleSlice";
import purchaseReducer from "./slices/purchaseSlice";
import uiReducer from "./slices/uiSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
    sale: saleReducer,
    purchase: purchaseReducer,
    ui: uiReducer
  }
});