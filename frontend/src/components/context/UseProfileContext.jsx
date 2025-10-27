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

