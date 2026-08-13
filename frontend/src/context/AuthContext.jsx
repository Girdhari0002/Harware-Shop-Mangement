import { createContext, useMemo, useState, useEffect } from "react";
import api from "../services/api";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("accessToken"));
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("userInfo") || "null");
    } catch {
      return null;
    }
  });

  // Fetch current user when token changes or on mount
  useEffect(() => {
    let mounted = true;
    const fetchMe = async () => {
      const currentToken = localStorage.getItem("accessToken");
      if (!currentToken) {
        setUser(null);
        return;
      }
      try {
        const res = await api.get("/auth/me");
        if (mounted) {
          setUser(res.data.data);
          localStorage.setItem("userInfo", JSON.stringify(res.data.data));
        }
      } catch (err) {
        // token invalid or expired — clear
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userInfo");
        setToken(null);
        setUser(null);
      }
    };
    fetchMe();
    return () => { mounted = false; };
  }, [token]);

  const login = async (nextToken) => {
    localStorage.setItem("accessToken", nextToken);
    setToken(nextToken);
    try {
      const res = await api.get("/auth/me");
      setUser(res.data.data);
      localStorage.setItem("userInfo", JSON.stringify(res.data.data));
    } catch (err) {
      // Ignore — login flow should handle errors upstream
    }
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userInfo");
    setToken(null);
    setUser(null);
    window.location.href = "/";
  };

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token && user),
      login,
      logout
    }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};