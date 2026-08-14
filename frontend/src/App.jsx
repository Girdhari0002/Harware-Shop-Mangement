import AppRoutes from "./routes/AppRoutes";
import ErrorBoundary from "./components/ErrorBoundary";
import ScrollToTop from "./components/ScrollToTop";

const App = () => (
  <ErrorBoundary>
    <ScrollToTop />
    <AppRoutes />
  </ErrorBoundary>
);

export default App;