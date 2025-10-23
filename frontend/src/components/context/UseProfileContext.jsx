
import React, { createContext, useContext, useState, useEffect } from "react";
import { getUserProfile } from "../services/api";

const UserProfileContext = createContext();

export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error("useUserProfile must be used within UserProfileProvider");
  }
  return context;
};

export const UserProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load profile from backend on app start
  const loadProfile = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const data = await getUserProfile();
      console.log("Context API Response:", data); // Debug
      
      // ✅ CORRECT RESPONSE HANDLING
      const userProfile = data?.data || data?.user || data?.user_profile || data;
      
      if (userProfile) {
        console.log("Setting profile:", userProfile); // Debug
        setProfile(userProfile);
        localStorage.setItem("user", JSON.stringify(userProfile));
      }
    } catch (error) {
      console.error("Failed to load profile:", error);
      // Try to use cached data if available
      const cachedUser = localStorage.getItem("user");
      if (cachedUser) {
        setProfile(JSON.parse(cachedUser));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const updateProfile = (newProfile) => {
    console.log("Updating profile with:", newProfile); 
    setProfile(newProfile);
    localStorage.setItem("user", JSON.stringify(newProfile));
  };

  const clearProfile = () => {
    setProfile(null);
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };

  const refreshProfile = () => {
    setLoading(true);
    loadProfile();
  };

  return (
    <UserProfileContext.Provider 
      value={{ 
        profile, 
        updateProfile, 
        clearProfile, 
        refreshProfile,
        loading 
      }}
    >
      {children}
    </UserProfileContext.Provider>
  );
};






// import React, { createContext, useContext, useState, useEffect } from "react";
// import { getUserProfile } from "../services/api";

// const UserProfileContext = createContext();

// export const useUserProfile = () => {
//   const context = useContext(UserProfileContext);
//   if (!context) {
//     throw new Error("useUserProfile must be used within UserProfileProvider");
//   }
//   return context;
// };

// export const UserProfileProvider = ({ children }) => {
//   const [profile, setProfile] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Load profile from backend on app start
//   const loadProfile = async () => {
//     const token = localStorage.getItem("accessToken");
//     if (!token) {
//       setLoading(false);
//       return;
//     }

//     try {
//       const data = await getUserProfile();
//       console.log("Context API Response:", data); // Debug
      
//       // ✅ CORRECT RESPONSE HANDLING
//       const userProfile = data?.data || data?.user || data?.user_profile || data;
      
//       if (userProfile) {
//         console.log("Setting profile:", userProfile); // Debug
//         setProfile(userProfile);
//         localStorage.setItem("user", JSON.stringify(userProfile));
//       }
//     } catch (error) {
//       console.error("Failed to load profile:", error);
//       // Try to use cached data if available
//       const cachedUser = localStorage.getItem("user");
//       if (cachedUser) {
//         setProfile(JSON.parse(cachedUser));
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadProfile();
//   }, []);

//   // ✅ FIXED: updateProfile function - loadProfile() REMOVE kiya
//   const updateProfile = (newProfile) => {
//     console.log("Updating profile with:", newProfile); // Debug
//     setProfile(newProfile);
//     localStorage.setItem("user", JSON.stringify(newProfile));
//   };

//   const clearProfile = () => {
//     setProfile(null);
//     localStorage.removeItem("user");
//     localStorage.removeItem("accessToken");
//     localStorage.removeItem("refreshToken");
//   };

//   const refreshProfile = () => {
//     setLoading(true);
//     loadProfile();
//   };

//   return (
//     <UserProfileContext.Provider 
//       value={{ 
//         profile, 
//         updateProfile, 
//         clearProfile, 
//         refreshProfile,
//         loading 
//       }}
//     >
//       {children}
//     </UserProfileContext.Provider>
//   );
// };




