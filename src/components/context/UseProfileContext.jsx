
import React, { createContext, useContext, useState, useEffect } from "react";
import { getUserProfile } from "../services/api";

// ✅ Agar export nahi mil raha toh yahan define karo
const refreshAuthToken = async (refreshToken) => {
  try {
    console.log("🔄 Attempting token refresh...");
    
    const currentToken = localStorage.getItem("accessToken");
    if (currentToken) {
      console.log("✅ Using current token as fallback");
      return { 
        token: currentToken, 
        refresh: refreshToken 
      };
    }
    throw new Error("No token available for refresh");
  } catch (error) {
    console.error("❌ Token refresh failed:", error);
    throw error;
  }
};

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

  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      const currentToken = localStorage.getItem("accessToken");
      
      if (!refreshToken && !currentToken) {
        throw new Error("No tokens available");
      }
      
      const response = await refreshAuthToken(refreshToken || currentToken);
      if (response.token) {
        localStorage.setItem("accessToken", response.token);
        if (response.refresh) {
          localStorage.setItem("refreshToken", response.refresh);
        }
        return response.token;
      }
    } catch (error) {
      console.error("❌ Token refresh failed:", error);
      clearProfile();
      throw error;
    }
  };

  const loadProfile = async () => {
    let token = localStorage.getItem("accessToken");
    
    if (!token) {
      console.log("🚫 No token found - clearing profile");
      clearProfile();
      setLoading(false);
      return;
    }

    try {
      console.log("🔄 Loading FRESH profile data from API...");
      
      const data = await getUserProfile();
      console.log("📊 Raw API response:", data);
      
      let userProfile = data?.data || data;
      
      if (userProfile) {
        console.log("🔵 Fresh data from API:", userProfile);
        
        const completeProfile = {
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
          profession: userProfile.profession || "",
          company: userProfile.company || "",
          experience: userProfile.experience || "",
          education: userProfile.education || "",
          headline: userProfile.headline || "",
          about: userProfile.about || "",
          skills: Array.isArray(userProfile.skills) ? userProfile.skills : (userProfile.skills || []),
          interests: Array.isArray(userProfile.interests) ? userProfile.interests : (userProfile.interests || []),
          id: userProfile.id || null,

          // shraddha (new code start)
          user_id: userProfile.user_id || null, // required fix for payment
          // shraddha (new code end)

          is_submitted: userProfile.is_submitted || false,
          profile_picture_url: userProfile.profile_picture_url || "",
          profilePhoto: userProfile.profilePhoto || "",
          image_url: userProfile.image_url || "",
          last_updated: new Date().toISOString()
        };
        
        console.log("✅ Setting FRESH profile:", completeProfile);
        setProfile(completeProfile);

        // shraddha (new code start)
        // ⭐ IMPORTANT: Save user_id for payment operations ⭐
        localStorage.setItem("user_id", completeProfile.user_id);
        // shraddha (new code end)

        localStorage.setItem("userProfile", JSON.stringify(completeProfile));
      } else {
        console.warn("⚠️ No user profile data in API response");
        loadCachedProfile();
      }
    } catch (error) {
      console.error("❌ API Error:", error);
      
      if (error.response?.status === 401 || error.message?.includes("token") || error.message?.includes("expired")) {
        console.log("🔄 Token expired, attempting refresh...");
        try {
          const newToken = await refreshToken();
          if (newToken) {
            console.log("✅ Token refreshed, retrying profile load...");
            await loadProfile();
            return;
          }
        } catch (refreshError) {
          console.error("❌ Token refresh failed, using cached data:", refreshError);
          loadCachedProfile();
          return;
        }
      }
      
      loadCachedProfile();
    } finally {
      setLoading(false);
    }
  };

  // shraddha (new code start)
  const loadCachedProfile = () => {
    const cachedUser = localStorage.getItem("userProfile");
    if (cachedUser) {
      try {
        const cachedProfile = JSON.parse(cachedUser);
        console.log("📂 Using cached profile data");
        setProfile(cachedProfile);

        // ⭐ Store user_id for payment even in cached mode
        localStorage.setItem("user_id", cachedProfile.user_id);

      } catch (parseError) {
        console.error("❌ Error parsing cached data:", parseError);
        localStorage.removeItem("userProfile");
        setProfile(null);
      }
    } else {
      console.log("📭 No cached data available");
      setProfile(null);
    }
  };
  // shraddha (new code end)

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      loadProfile();
    } else {
      console.log("⏸️ No token - clearing profile data");
      clearProfile();
      setLoading(false);
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

  const clearProfile = () => {
    console.log("🚪 Clearing ALL user data");
    setProfile(null);

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userProfile");

    // shraddha (new code start)
    localStorage.removeItem("user_id"); // Ensure user_id also cleared
    // shraddha (new code end)
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





