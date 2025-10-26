// import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
// import { getUserProfile } from "../services/api";
// import { useAuth } from "./Authprovider";

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
//   const { accessToken, isAuthenticated } =  useAuth(); // <--- Get accessToken and isAuthenticated from AuthContext

//   const loadProfile = useCallback(async () => {
//     // Only attempt to load if authenticated and accessToken is present
//     if (!isAuthenticated || !accessToken) {
//       console.log("🚫 Not authenticated or no token, clearing profile.");
//       setProfile(null);
//       setLoading(false);
//       localStorage.removeItem("user"); // Clear cached user on logout
//       return;
//     }

//     setLoading(true); // Start loading when profile fetch is initiated
//     try {
//       // First check cached data (optional, API call is more reliable)
//       const cachedUser = localStorage.getItem("user");
//       const cachedProfile = cachedUser ? JSON.parse(cachedUser) : null;

//       // If there's cached data and it seems valid, use it initially
//       if (cachedProfile && cachedProfile.id && cachedProfile.email) {
//         console.log("✅ Using cached profile data temporarily");
//         setProfile(cachedProfile);
//       }

//       // Always call API for fresh data to keep profile up-to-date
//       const data = await getUserProfile();
//       // Ensure correct data extraction (your API might return data in 'data' field or directly)
//       let userProfile = data?.data || data; 
      
//       if (userProfile && userProfile.email) { // Basic check for valid user data
//         console.log("🔵 Fresh data from API:", userProfile);
        
//         const completeProfile = {
//           full_name: userProfile.full_name || "",
//           email: userProfile.email || "",
//           phone: userProfile.phone || "",
//           gender: userProfile.gender || "",
//           marital_status: userProfile.marital_status || "",
//           city: userProfile.city || "",
//           address: userProfile.address || "",
//           dob: userProfile.dob || "",
//           age: userProfile.age || "",
          
//           profession: userProfile.profession || "",
//           company: userProfile.company || "",
//           experience: userProfile.experience || "",
//           education: userProfile.education || "",
//           headline: userProfile.headline || "",
          
//           about: userProfile.about || "",
//           skills: Array.isArray(userProfile.skills) ? userProfile.skills : [],
//           interests: Array.isArray(userProfile.interests) ? userProfile.interests : [],
          
//           id: userProfile.id || null, // Important for identifying the profile
//           user_id: userProfile.user_id || null, // Important for identifying the user
//           is_submitted: userProfile.is_submitted || false,
          
//           profile_picture_url: userProfile.profile_picture_url || "",
//           profilePhoto: userProfile.profilePhoto || ""
//         };
        
//         setProfile(completeProfile);
//         localStorage.setItem("user", JSON.stringify(completeProfile));
//       } else {
//           console.log("🤷‍♂️ API returned no valid user profile data.");
//           setProfile(null);
//           localStorage.removeItem("user");
//       }
//     } catch (error) {
//       console.error("❌ Failed to load profile:", error);
//       setProfile(null); // Clear profile on error
//       localStorage.removeItem("user");
//     } finally {
//       setLoading(false);
//     }
//   }, [isAuthenticated, accessToken]); // Dependencies for useCallback

//   useEffect(() => {
//     loadProfile();
//   }, [loadProfile]); // Call loadProfile when it changes (due to its dependencies)

//   const updateProfile = (newProfileData) => {
//     console.log("🔄 Manually updating profile in context:", newProfileData);
//     setProfile(prevProfile => ({ ...prevProfile, ...newProfileData })); // Merge new data
//     localStorage.setItem("user", JSON.stringify({ ...profile, ...newProfileData })); // Update localStorage as well
//   };

//   const clearProfile = () => {
//     console.log("🗑️ Clearing profile and auth data.");
//     setProfile(null);
//     localStorage.removeItem("user");
//     localStorage.removeItem("accessToken");
//     localStorage.removeItem("refreshToken");
//   };

//   const refreshProfile = () => {
//     console.log("🔄 Refreshing profile data from API.");
//     setLoading(true);
//     loadProfile();
//   };

//   return (
//     <UserProfileContext.Provider 
//       value={{ profile, updateProfile, clearProfile, refreshProfile, loading }}
//     >
//       {children}
//     </UserProfileContext.Provider>
//   );
// };









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

  const loadProfile = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      // First check cached data
      const cachedUser = localStorage.getItem("user");
      const cachedProfile = cachedUser ? JSON.parse(cachedUser) : null;

      if (cachedProfile) {
        console.log("✅ Using cached profile data");
        setProfile(cachedProfile);
      }

      // Then call API for fresh data
      const data = await getUserProfile();
      let userProfile = data?.data;
      
      if (userProfile) {
        console.log("🔵 Fresh data from API:", userProfile);
        
        const completeProfile = {
          // Personal Info
          full_name: userProfile.full_name || "",
          email: userProfile.email || "",
          phone: userProfile.phone || "",
          gender: userProfile.gender || "",
          marital_status: userProfile.marital_status || "",
          city: userProfile.city || "",
          address: userProfile.address || "",
          dob: userProfile.dob || "",
          age: userProfile.age || "",
          
          // Professional Info
          profession: userProfile.profession || "",
          company: userProfile.company || "",
          experience: userProfile.experience || "",
          education: userProfile.education || "",
          headline: userProfile.headline || "",
          
          // Additional Info
          about: userProfile.about || "",
          skills: userProfile.skills || [],
          interests: userProfile.interests || [],
          
          // System Fields
          id: userProfile.id || null,
          user_id: userProfile.user_id || null,
          is_submitted: userProfile.is_submitted || false,
          
          // Profile Picture
          profile_picture_url: userProfile.profile_picture_url || "",
          profilePhoto: userProfile.profilePhoto || ""
        };
        
        setProfile(completeProfile);
        localStorage.setItem("user", JSON.stringify(completeProfile));
      }
    } catch (error) {
      console.error("Failed to load profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const updateProfile = (newProfile) => {
    console.log("🔄 Updating profile:", newProfile);
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
      value={{ profile, updateProfile, clearProfile, refreshProfile, loading }}
    >
      {children}
    </UserProfileContext.Provider>
  );
};


// // import React, { createContext, useContext, useState, useEffect } from "react";
// // import { getUserProfile } from "../services/api";

// // const UserProfileContext = createContext();

// // export const useUserProfile = () => {
// //   const context = useContext(UserProfileContext);
// //   if (!context) {
// //     throw new Error("useUserProfile must be used within UserProfileProvider");
// //   }
// //   return context;
// // };

// // export const UserProfileProvider = ({ children }) => {
// //   const [profile, setProfile] = useState(null);
// //   const [loading, setLoading] = useState(true);

// //   const loadProfile = async () => {
// //     const token = localStorage.getItem("accessToken");
// //     if (!token) {
// //       setLoading(false);
// //       return;
// //     }

// //     try {
// //       // ✅ PEHLE CACHED DATA CHECK KARO
// //       const cachedUser = localStorage.getItem("user");
// //       console.log("🔵 Cached User from localStorage:", cachedUser);
      
// //       const cachedProfile = cachedUser ? JSON.parse(cachedUser) : null;
// //       console.log("🔵 Parsed Cached Profile:", cachedProfile);

// //       // ✅ AGAR CACHED DATA HAI TO USE KARO
// //       if (cachedProfile) {
// //         console.log("✅ Using cached profile data");
// //         setProfile(cachedProfile);
        
// //         // ✅ CACHED DATA SET KARNE KE BAAD BHI API CALL KARO FOR FRESH DATA
// //         // But don't wait for it - immediate response mil jayega
// //       }

// //       // ✅ API CALL FOR FRESH DATA
// //       const data = await getUserProfile();
// //       console.log("🔵 API Response:", data); 
      
// //       let userProfile = data?.data;
      
// //       if (userProfile) {
// //         console.log("🔵 Fresh User Profile from API:", userProfile);
        
// //         // ✅ SIMPLE APPROACH: DIRECTLY USE API DATA
// //         // Kyuki API mein saari fields hain, bas values empty hain
// //         const completeProfile = {
// //           // Personal Info
// //           full_name: userProfile.full_name || "",
// //           email: userProfile.email || "",
// //           phone: userProfile.phone || "",
// //           gender: userProfile.gender || "",
// //           marital_status: userProfile.marital_status || "",
// //           city: userProfile.city || "",
// //           address: userProfile.address || "",
// //           dob: userProfile.dob || "",
// //           age: userProfile.age || "",
          
// //           // Professional Info
// //           profession: userProfile.profession || "",
// //           company: userProfile.company || "",
// //           experience: userProfile.experience || "",
// //           education: userProfile.education || "",
// //           headline: userProfile.headline || "",
          
// //           // Additional Info
// //           about: userProfile.about || "",
// //           skills: userProfile.skills || [],
// //           interests: userProfile.interests || [],
          
// //           // System Fields
// //           id: userProfile.id || null,
// //           user_id: userProfile.user_id || null,
// //           is_submitted: userProfile.is_submitted || false,
          
// //           // Profile Picture
// //           profile_picture_url: userProfile.profile_picture_url || "",
// //           profilePhoto: userProfile.profilePhoto || ""
// //         };
        
// //         console.log("✅ Complete Profile from API:", completeProfile);
// //         setProfile(completeProfile);
// //         localStorage.setItem("user", JSON.stringify(completeProfile));
// //       }
// //     } catch (error) {
// //       console.error("Failed to load profile:", error);
// //       // Cached data already set hai upar
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     loadProfile();
// //   }, []);

// //   const updateProfile = (newProfile) => {
// //     console.log("🔄 Updating profile with:", newProfile); 
    
// //     // ✅ SIMPLE UPDATE - Directly use newProfile
// //     console.log("✅ Final Updated Profile:", newProfile);
// //     setProfile(newProfile);
// //     localStorage.setItem("user", JSON.stringify(newProfile));
// //   };

// //   const clearProfile = () => {
// //     setProfile(null);
// //     localStorage.removeItem("user");
// //     localStorage.removeItem("accessToken");
// //     localStorage.removeItem("refreshToken");
// //   };

// //   const refreshProfile = () => {
// //     setLoading(true);
// //     loadProfile();
// //   };

// //   return (
// //     <UserProfileContext.Provider 
// //       value={{ 
// //         profile, 
// //         updateProfile, 
// //         clearProfile, 
// //         refreshProfile,
// //         loading 
// //       }}
// //     >
// //       {children}
// //     </UserProfileContext.Provider>
// //   );
// // };