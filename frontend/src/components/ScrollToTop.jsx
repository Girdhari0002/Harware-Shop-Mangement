import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Resets scroll position on every route change so navigating (e.g. dashboard -> products)
// never leaves the new page scrolled to wherever the previous page happened to be.
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
