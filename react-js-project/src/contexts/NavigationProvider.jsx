import React, { createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";

const NavigationContext = createContext();

export const NavigationProvider = ({ children }) => {
  const navigate = useNavigate();
  return (
    <NavigationContext.Provider value={{ navigate }}>
      {children}
    </NavigationContext.Provider>
  );
};

export function useGlobalNavigate() {
    const context = useContext(NavigationContext);
    if (!context) {
        throw new Error('useGlobalNavigate must be used within a NavigationProvider');
    }
    return context;
};