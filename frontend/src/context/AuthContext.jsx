/*explicar en memoria proceso que se hace al guardar el token en DevTools → Application → Local Storage:*/

import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem("token") || "";
    const savedIsAdmin = localStorage.getItem("isAdmin") === "true";
    setToken(savedToken);
    setIsAdmin(savedIsAdmin);
  }, []);

  const login = ({ token: newToken, isAdmin: newIsAdmin }) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("isAdmin", String(newIsAdmin));
    setToken(newToken);
    setIsAdmin(Boolean(newIsAdmin));
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isAdmin");
    setToken("");
    setIsAdmin(false);
  };

  const isAuthenticated = Boolean(token);

  const value = {
    token,
    isAdmin,
    isAuthenticated,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
