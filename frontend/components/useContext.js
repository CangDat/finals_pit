import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);

  const logout = () => {
    try {
      // Simulate logout process
      setIsAuthenticated(false); // Update local state
      console.log("User logged out successfully.");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated,userData, setUserData, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
