import React, { createContext, useState, useEffect } from "react";
import { loginUser, logoutUser } from "../api/authApi";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const stored = localStorage.getItem("user");
    if (token && stored) setUser(JSON.parse(stored));
    setLoading(false);
  }, []);

const login = async (email, password) => {
    const { data } = await loginUser({ email, password })
    localStorage.setItem('accessToken', data.accessToken)
    localStorage.setItem('refreshToken', data.refreshToken)
    localStorage.setItem('user', JSON.stringify({
        email: data.email,
        role: data.role    // make sure role is 'ROLE_ADMIN'
    }))
    setUser({ email: data.email, role: data.role })
    return data
}

  const logout = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    try {
      await logoutUser(refreshToken);
    } catch {}
    localStorage.clear();
    setUser(null);
  };


// if backend returns 'ADMIN' use this:
const isAdmin = () => user?.role === 'ADMIN' || user?.role === 'ROLE_ADMIN'

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
