// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')) || null);
  const navigate = useNavigate();

  const login = (token, user) => {
    setToken(token);
    setUser(user);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  };
  
  const logout = async () => {
    try {
      await logoutUser(); // Call the API to invalidate token on the backend
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      // Clear state and storage regardless of API success
      setToken('');
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/'); // redirect to guest page after logout
    }
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
