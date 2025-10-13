// src/context/UserProfileContext.js
import React, { createContext, useContext, useState, useEffect } from "react";

const UserProfileContext = createContext();

export const useUserProfile = () => useContext(UserProfileContext);

export const UserProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("userProfile");
    if (stored) {
      try {
        setProfile(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse user profile from localStorage", e);
        localStorage.removeItem("userProfile"); // Clear bad data
      }
    }
  }, []);

  const updateProfile = (data) => {
    setProfile(data);
    localStorage.setItem("userProfile", JSON.stringify(data));
  };

  const clearProfile = () => {
    setProfile(null);
    localStorage.removeItem("userProfile");
  };

  return (
    <UserProfileContext.Provider value={{ profile, updateProfile, clearProfile }}>
      {children}
    </UserProfileContext.Provider>
  );
};











// import React, { createContext, useContext, useState, useEffect } from "react";

// const UserProfileContext = createContext();

// export const useUserProfile = () => useContext(UserProfileContext);

// export const UserProfileProvider = ({ children }) => {
//   const [profile, setProfile] = useState(null);

//   // Load from localStorage on mount
//   useEffect(() => {
//     const stored = localStorage.getItem("userProfile");
//     if (stored) setProfile(JSON.parse(stored));
//   }, []);

//   const updateProfile = (data) => {
//     setProfile(data);
//     localStorage.setItem("userProfile", JSON.stringify(data));
//   };

//   return (
//     <UserProfileContext.Provider value={{ profile, updateProfile }}>
//       {children}
//     </UserProfileContext.Provider>
//   );
// };



