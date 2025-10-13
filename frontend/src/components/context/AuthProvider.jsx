// src/context/AuthProvider.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"));
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem("refreshToken"));
  const [loading, setLoading] = useState(true);

  // page reload par user fetch
  useEffect(() => {
    const initAuth = async () => {
      if (accessToken) {
        try {
          const res = await api.get("/api/me", {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          setUser(res.data.user);
        } catch {
          logout(); // invalid token
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const res = await api.post("/api/login", { email, password });
      const { accessToken, refreshToken, user } = res.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(user));

      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
      setUser(user);

      setLoading(false);
      return true;
    } catch (err) {
      console.error("Login failed:", err);
      logout();
      setLoading(false);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        refreshToken,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};












// import React, { createContext, useContext, useState, useEffect } from 'react';
// import api from '../services/api'; 
// // import api from '../services/api';

// const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));
//   const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken'));

//   useEffect(() => {
   
//     setLoading(false);
//   }, [accessToken, refreshToken]);

//   const login = async (email, password) => {
//     try {
//       setLoading(true);
//       const response = await api.post('/api/login', { email, password });
//       const { accessToken, refreshToken } = response.data;

//       // to local storage storing
//       localStorage.setItem('accessToken', accessToken);
//       localStorage.setItem('refreshToken', refreshToken);

//       setAccessToken(accessToken);
//       setRefreshToken(refreshToken);
//       setUser({ email }); 
//       setLoading(false);
//       return true; // login succefully
//     } catch (error) {
//       console.error('Login field:', error);
//       localStorage.removeItem('accessToken');
//       localStorage.removeItem('refreshToken');
//       setAccessToken(null);
//       setRefreshToken(null);
//       setUser(null);
//       setLoading(false);
//       throw error;  
//     }
//   };

//   const logout = () => {
//     // local storage se token hatane ke liye use kiya h mane
//     localStorage.removeItem('accessToken');
//     localStorage.removeItem('refreshToken');
//     setAccessToken(null);
//     setRefreshToken(null);
//     setUser(null);
//   };

//   const authContextValue = {
//     user,
//     accessToken,
//     refreshToken,
//     isAuthenticated: !!user, // login sucessfully check karne liye hai 
//     loading,
//     login,
//     logout,
//   };

//   return (
//     <AuthContext.Provider value={authContextValue}>
//       {!loading && children} 
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth ko AuthProvider use of this');
//   }
//   return context;
// };























// imp code hai for production purpose**********************************

// import React, { createContext, useContext, useState } from "react";
// import api from "../services/api";


// const AuthContext = createContext();

// export function useAuth() {
//   return useContext(AuthContext);
// }

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);

//   // 🔹 Backend ke login API ko call karo
//   const login = async (email, password) => {
//     try {
//       const res = await api.post("/api/login", { email, password });

//       // assume backend returns { token, user }
//       if (res.data?.token) {
//         localStorage.setItem("access_token", res.data.token);
//         setUser(res.data.user || { email });
//         return true;
//       } else {
//         console.error("Token not found in response");
//         return false;
//       }
//     } catch (err) {
//       console.error("Login failed:", err);
//       return false;
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem("access_token");
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }











































































