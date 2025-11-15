import React, { createContext, useContext, useState, useEffect } from "react";
import { getUserProfile, loginUser } from "../services/api";
import { useNavigate } from "react-router-dom";

// UserProfile Context
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
      console.log("🚫 No token found - skipping profile load");
      setLoading(false);
      return;
    }

    try {
      console.log("🔄 Loading profile data...");
      
      // ✅ Pehle cached data check karo
      const cachedUser = localStorage.getItem("userProfile");
      if (cachedUser) {
        try {
          const cachedProfile = JSON.parse(cachedUser);
          console.log("📂 Using cached profile data");
          setProfile(cachedProfile);
        } catch (parseError) {
          console.error("❌ Error parsing cached data:", parseError);
          localStorage.removeItem("userProfile");
        }
      }

      // ✅ Fir API se fresh data lo
      const data = await getUserProfile();
      let userProfile = data?.data;
      
      if (userProfile) {
        console.log("🔵 Fresh data from API:", userProfile);
        
        // ✅ FIXED: first_name aur last_name handle karo
        const completeProfile = {
          // Personal Info - FIXED NAME FIELDS
          first_name: userProfile.first_name || "",
          last_name: userProfile.last_name || "",
          full_name: userProfile.full_name || "",
          email: userProfile.email || "",
          phone: userProfile.phone || "",
          gender: userProfile.gender || "",
          marital_status: userProfile.marital_status || "",
          city: userProfile.city || "",
          country: userProfile.country || "",
          state: userProfile.state || "",
          pincode: userProfile.pincode || "",
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
          skills: Array.isArray(userProfile.skills) ? userProfile.skills : (userProfile.skills || []),
          interests: Array.isArray(userProfile.interests) ? userProfile.interests : (userProfile.interests || []),
          
          // System Fields
          id: userProfile.id || null,
          user_id: userProfile.user_id || null,
          is_submitted: userProfile.is_submitted || false,
          
          // ✅ Profile Picture
          profile_picture_url: userProfile.profile_picture_url || "",
          profilePhoto: userProfile.profilePhoto || "",
          image_url: userProfile.image_url || "",
          
          // Timestamp
          last_updated: new Date().toISOString()
        };
        
        console.log("✅ Setting complete profile:", completeProfile);
        setProfile(completeProfile);
        localStorage.setItem("userProfile", JSON.stringify(completeProfile));
      }
    } catch (error) {
      console.error("❌ API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      loadProfile();
    } else {
      console.log("⏸️ No token - profile loading skipped");
      setLoading(false);
      
      // ✅ Logout par bhi cached data show karo (read-only mode)
      const cachedProfile = localStorage.getItem("userProfile");
      if (cachedProfile) {
        try {
          const profileData = JSON.parse(cachedProfile);
          console.log("👀 Showing cached profile (read-only)");
          setProfile(profileData);
        } catch (error) {
          console.error("Error parsing cached profile:", error);
        }
      }
    }
  }, []);

  const updateProfile = (newProfileData) => {
    console.log("🔄 Updating profile with:", newProfileData);
    
    const updatedProfile = {
      ...profile,
      ...newProfileData,
      last_updated: new Date().toISOString()
    };
    
    console.log("✅ Final updated profile:", updatedProfile);
    setProfile(updatedProfile);
    localStorage.setItem("userProfile", JSON.stringify(updatedProfile));
  };

  // ✅ FIXED: Logout par profile data preserve karo
  const clearProfile = () => {
    console.log("🚪 Clearing authentication tokens only");
    // ❌ setProfile(null) MAT KARO - yeh line COMMENT karo ya remove karo
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    // ✅ userProfile ko preserve rahega - image bhi save rahegi
  };

  const refreshProfile = () => {
    console.log("🔄 Manually refreshing profile");
    setLoading(true);
    loadProfile();
  };

  const hasCompleteProfile = () => {
    return profile && profile.is_submitted && (profile.first_name || profile.full_name) && profile.email;
  };

  const value = {
    profile,
    updateProfile,
    clearProfile,
    refreshProfile,
    loading,
    hasCompleteProfile: hasCompleteProfile()
  };

  return (
    <UserProfileContext.Provider value={value}>
      {children}
    </UserProfileContext.Provider>
  );
};



// import React, { createContext, useContext, useState, useEffect } from "react";
// import { getUserProfile, loginUser } from "../services/api";
// import { useNavigate } from "react-router-dom";

// // UserProfile Context
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

//   const loadProfile = async () => {
//     const token = localStorage.getItem("accessToken");
    
//     if (!token) {
//       console.log("🚫 No token found - skipping profile load");
//       setLoading(false);
//       return;
//     }

//     try {
//       console.log("🔄 Loading profile data...");
      
//       // ✅ Pehle cached data check karo
//       const cachedUser = localStorage.getItem("userProfile");
//       if (cachedUser) {
//         try {
//           const cachedProfile = JSON.parse(cachedUser);
//           console.log("📂 Using cached profile data");
//           setProfile(cachedProfile);
//         } catch (parseError) {
//           console.error("❌ Error parsing cached data:", parseError);
//           localStorage.removeItem("userProfile");
//         }
//       }

//       // ✅ Fir API se fresh data lo
//       const data = await getUserProfile();
//       let userProfile = data?.data;
      
//       if (userProfile) {
//         console.log("🔵 Fresh data from API:", userProfile);
        
//         const completeProfile = {
//           // Personal Info
//           full_name: userProfile.full_name || "",
//           email: userProfile.email || "",
//           phone: userProfile.phone || "",
//           gender: userProfile.gender || "",
//           marital_status: userProfile.marital_status || "",
//           city: userProfile.city || "",
//           address: userProfile.address || "",
//           dob: userProfile.dob || "",
//           age: userProfile.age || "",
          
//           // Professional Info
//           profession: userProfile.profession || "",
//           company: userProfile.company || "",
//           experience: userProfile.experience || "",
//           education: userProfile.education || "",
//           headline: userProfile.headline || "",
          
//           // Additional Info
//           about: userProfile.about || "",
//           skills: Array.isArray(userProfile.skills) ? userProfile.skills : (userProfile.skills || []),
//           interests: Array.isArray(userProfile.interests) ? userProfile.interests : (userProfile.interests || []),
          
//           // System Fields
//           id: userProfile.id || null,
//           user_id: userProfile.user_id || null,
//           is_submitted: userProfile.is_submitted || false,
          
//           // ✅ Profile Picture - IMPORTANT: image_url add karo
//           profile_picture_url: userProfile.profile_picture_url || "",
//           profilePhoto: userProfile.profilePhoto || "",
//           image_url: userProfile.image_url || "", // ✅ Ye line add karo
          
//           // Timestamp
//           last_updated: new Date().toISOString()
//         };
        
//         console.log("✅ Setting complete profile:", completeProfile);
//         setProfile(completeProfile);
//         localStorage.setItem("userProfile", JSON.stringify(completeProfile));
//       }
//     } catch (error) {
//       console.error("❌ API Error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     const token = localStorage.getItem("accessToken");
//     if (token) {
//       loadProfile();
//     } else {
//       console.log("⏸️ No token - profile loading skipped");
//       setLoading(false);
      
//       // ✅ Logout par bhi cached data show karo (read-only mode)
//       const cachedProfile = localStorage.getItem("userProfile");
//       if (cachedProfile) {
//         try {
//           const profileData = JSON.parse(cachedProfile);
//           console.log("👀 Showing cached profile (read-only)");
//           setProfile(profileData);
//         } catch (error) {
//           console.error("Error parsing cached profile:", error);
//         }
//       }
//     }
//   }, []);

//   const updateProfile = (newProfileData) => {
//     console.log("🔄 Updating profile with:", newProfileData);
    
//     const updatedProfile = {
//       ...profile,
//       ...newProfileData,
//       last_updated: new Date().toISOString()
//     };
    
//     console.log("✅ Final updated profile:", updatedProfile);
//     setProfile(updatedProfile);
//     localStorage.setItem("userProfile", JSON.stringify(updatedProfile));
//   };

//   // ✅ FIXED: Logout par profile data preserve karo
//   const clearProfile = () => {
//     console.log("🚪 Clearing authentication tokens only");
//     // ❌ setProfile(null) MAT KARO - yeh line COMMENT karo ya remove karo
//     localStorage.removeItem("accessToken");
//     localStorage.removeItem("refreshToken");
//     // ✅ userProfile ko preserve rahega - image bhi save rahegi
//   };

//   const refreshProfile = () => {
//     console.log("🔄 Manually refreshing profile");
//     setLoading(true);
//     loadProfile();
//   };

//   const hasCompleteProfile = () => {
//     return profile && profile.is_submitted && profile.full_name && profile.email;
//   };

//   const value = {
//     profile,
//     updateProfile,
//     clearProfile,
//     refreshProfile,
//     loading,
//     hasCompleteProfile: hasCompleteProfile()
//   };

//   return (
//     <UserProfileContext.Provider value={value}>
//       {children}
//     </UserProfileContext.Provider>
//   );
// };






