import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

const routerFuture = {
  v7_startTransition: true,
  v7_relativeSplatPath: true
};
import { Provider } from "react-redux";
import App from "./App.jsx";
import { store } from "./redux/store";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import { CompanyProvider } from "./context/CompanyContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <CompanyProvider>
        <AuthProvider>
          <BrowserRouter future={routerFuture}>
            <App />
          </BrowserRouter>
        </AuthProvider>
      </CompanyProvider>
    </Provider>
  </React.StrictMode>
);