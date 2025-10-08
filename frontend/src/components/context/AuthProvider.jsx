import React, { createContext, useContext, useState, useEffect } from 'react'
import storageApi from '../Lib/storageApi';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const email = storageApi.getSession();
    if (email) setUser({ email });
  }, []);

  const login = (email, password) => {
    if (storageApi.login(email, password)) {
      setUser({ email });
      return true;
    }
    return false;
  };

  const register = (email, password) => {
    if (storageApi.register(email, password)) {
      storageApi.login(email, password);
      setUser({ email });
      return true;
    }
    return false;
  };

  const logout = () => {
    storageApi.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}








































































