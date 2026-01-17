
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
        refresh: refreshToken,
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


          // ✅ FIX: Parse ways_i_spend_time
      let parsedWaysISpendTime = {};
      if (userProfile.ways_i_spend_time) {
        if (typeof userProfile.ways_i_spend_time === 'string') {
          try {
            parsedWaysISpendTime = JSON.parse(userProfile.ways_i_spend_time);
            console.log("✅ Parsed ways_i_spend_time:", parsedWaysISpendTime);
          } catch (error) {
            console.error("❌ Error parsing ways_i_spend_time:", error);
            parsedWaysISpendTime = {};
          }
        } else if (typeof userProfile.ways_i_spend_time === 'object') {
          parsedWaysISpendTime = userProfile.ways_i_spend_time;
        }
      }
        
        // ✅ FIX: Handle prompts from ALL possible sources
        let profileQuestionsObject = {};

        // Check all possible prompt locations
        if (userProfile.prompts && userProfile.prompts["question-key"]) {
          profileQuestionsObject = userProfile.prompts["question-key"];
          console.log("✅ Loaded from prompts.question-key:", profileQuestionsObject);
        }
        else if (userProfile.prompts && typeof userProfile.prompts === 'object') {
          profileQuestionsObject = userProfile.prompts;
          console.log("✅ Loaded from prompts directly:", profileQuestionsObject);
        }
        else if (Array.isArray(userProfile.profile_prompts)) {
          userProfile.profile_prompts.forEach(prompt => {
            if (prompt.question_key && prompt.answer) {
              profileQuestionsObject[prompt.question_key] = prompt.answer;
            }
          });
          console.log("✅ Converted from profile_prompts array:", profileQuestionsObject);
        }
        else if (userProfile.profile_prompts && typeof userProfile.profile_prompts === 'object') {
          profileQuestionsObject = userProfile.profile_prompts;
          console.log("✅ Loaded from profile_prompts object:", profileQuestionsObject);
        }
        else {
          console.log("⚠️ No prompts found in API response");
        }
        
        console.log("🎯 Final profileQuestionsObject:", profileQuestionsObject);

        const completeProfile = {
          // Personal Information
          first_name: userProfile.first_name || "",
          last_name: userProfile.last_name || "",
          full_name: userProfile.full_name || "",
          username: userProfile.username || "",
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

          // Personal Details
          height: userProfile.height || "",
          professional_identity: userProfile.professional_identity || "",
          zodiac_sign: userProfile.zodiac_sign || "",
          languages_spoken: Array.isArray(userProfile.languages_spoken)
            ? userProfile.languages_spoken
            : userProfile.languages_spoken || [],

          // Professional Information
          profession: userProfile.profession || "",
          company: userProfile.company || "",
          position: userProfile.position || "",
          company_type: userProfile.company_type || "",
          experience: userProfile.experience || "",
          education: userProfile.education || "",
          headline: userProfile.headline || "",

          // Education Details
          education_institution_name:
            userProfile.education_institution_name || "",

          // ✅ IMPORTANT: Add prompts fields
          profile_questions: profileQuestionsObject,
          prompts: userProfile.prompts || null,
          profile_prompts: userProfile.profile_prompts || [],

          // Work Style
          work_environment: userProfile.work_environment || "",
          interaction_style: userProfile.interaction_style || "",
          work_rhythm: userProfile.work_rhythm || "",
          career_decision_style: userProfile.career_decision_style || "",
          work_demand_response: userProfile.work_demand_response || "",

          // About & Interests
          about_me: userProfile.about_me || "",
          skills: Array.isArray(userProfile.skills)
            ? userProfile.skills
            : userProfile.skills || [],
          hobbies: Array.isArray(userProfile.hobbies)
            ? userProfile.hobbies
            : userProfile.hobbies || [],
          interests: Array.isArray(userProfile.interests)
            ? userProfile.interests
            : userProfile.interests || [],

          // Lifestyle
          self_expression: userProfile.self_expression || "",
          freetime_style: userProfile.freetime_style || "",
          health_activity_level: userProfile.health_activity_level || "",
          pets_preference: userProfile.pets_preference || "",
          religious_belief: userProfile.religious_belief || "",
          smoking: userProfile.smoking || "",
          drinking: userProfile.drinking || "",

          // Relationship Preferences
          interested_in: userProfile.interested_in || "",
          relationship_goal: userProfile.relationship_goal || "",
          children_preference: userProfile.children_preference || "",

          // Relationship Styles
          love_language_affection: Array.isArray(
            userProfile.love_language_affection
          )
            ? userProfile.love_language_affection
            : userProfile.love_language_affection || [],
          preference_of_closeness: userProfile.preference_of_closeness || "",
          approach_to_physical_closeness:
            userProfile.approach_to_physical_closeness || "",
          relationship_values: userProfile.relationship_values || "",
          values_in_others: userProfile.values_in_others || "",
          relationship_pace: userProfile.relationship_pace || "",

          // JSON Fields
          life_rhythms: userProfile.life_rhythms || {},
          // ways_i_spend_time: userProfile.ways_i_spend_time || {},
             ways_i_spend_time: parsedWaysISpendTime,

          // System Fields
          id: userProfile.id || null,
          user_id: userProfile.user_id || null,
          is_submitted: userProfile.is_submitted || false,

          // Image Fields
          profile_picture_url: userProfile.profile_picture_url || "",
          profilePhoto: userProfile.profilePhoto || "",
          image_url: userProfile.image_url || "",
          last_updated: new Date().toISOString(),
        };

        console.log("✅ Setting FRESH profile:", completeProfile);
        setProfile(completeProfile);

        // Save user_id for payment operations
        localStorage.setItem("user_id", completeProfile.user_id);
        localStorage.setItem("userProfile", JSON.stringify(completeProfile));
      } else {
        console.warn("⚠️ No user profile data in API response");
        loadCachedProfile();
      }
    } catch (error) {
      console.error("❌ API Error:", error);

      if (
        error.response?.status === 401 ||
        error.message?.includes("token") ||
        error.message?.includes("expired")
      ) {
        console.log("🔄 Token expired, attempting refresh...");
        try {
          const newToken = await refreshToken();
          if (newToken) {
            console.log("✅ Token refreshed, retrying profile load...");
            await loadProfile();
            return;
          }
        } catch (refreshError) {
          console.error(
            "❌ Token refresh failed, using cached data:",
            refreshError
          );
          loadCachedProfile();
          return;
        }
      }

      loadCachedProfile();
    } finally {
      setLoading(false);
    }
  };

  const loadCachedProfile = () => {
    const cachedUser = localStorage.getItem("userProfile");
    if (cachedUser) {
      try {
        const cachedProfile = JSON.parse(cachedUser);
        console.log("📂 Using cached profile data");
        setProfile(cachedProfile);
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
    
    // Merge profile_questions properly
    const currentQuestions = profile?.profile_questions || {};
    const newQuestions = newProfileData?.profile_questions || {};
    
    const updatedProfile = {
      ...profile,
      ...newProfileData,
      profile_questions: { ...currentQuestions, ...newQuestions },
      last_updated: new Date().toISOString(),
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
    localStorage.removeItem("user_id");
  };

  const refreshProfile = () => {
    console.log("🔄 Manually refreshing profile");
    setLoading(true);
    loadProfile();
  };

  const hasCompleteProfile = () => {
    return (
      profile &&
      profile.is_submitted &&
      (profile.first_name || profile.full_name) &&
      profile.email
    );
  };

  const value = {
    profile,
    updateProfile,
    clearProfile,
    refreshProfile,
    loading,
    hasCompleteProfile: hasCompleteProfile(),
  };

  return (
    <UserProfileContext.Provider value={value}>
      {children}
    </UserProfileContext.Provider>
  );
};









// import React, { createContext, useContext, useState, useEffect } from "react";
// import { getUserProfile } from "../services/api";

// // ✅ Agar export nahi mil raha toh yahan define karo
// const refreshAuthToken = async (refreshToken) => {
//   try {
//     console.log("🔄 Attempting token refresh...");

//     const currentToken = localStorage.getItem("accessToken");
//     if (currentToken) {
//       console.log("✅ Using current token as fallback");
//       return {
//         token: currentToken,
//         refresh: refreshToken,
//       };
//     }
//     throw new Error("No token available for refresh");
//   } catch (error) {
//     console.error("❌ Token refresh failed:", error);
//     throw error;
//   }
// };

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

//   const refreshToken = async () => {
//     try {
//       const refreshToken = localStorage.getItem("refreshToken");
//       const currentToken = localStorage.getItem("accessToken");

//       if (!refreshToken && !currentToken) {
//         throw new Error("No tokens available");
//       }

//       const response = await refreshAuthToken(refreshToken || currentToken);
//       if (response.token) {
//         localStorage.setItem("accessToken", response.token);
//         if (response.refresh) {
//           localStorage.setItem("refreshToken", response.refresh);
//         }
//         return response.token;
//       }
//     } catch (error) {
//       console.error("❌ Token refresh failed:", error);
//       clearProfile();
//       throw error;
//     }
//   };

//   const loadProfile = async () => {
//     let token = localStorage.getItem("accessToken");

//     if (!token) {
//       console.log("🚫 No token found - clearing profile");
//       clearProfile();
//       setLoading(false);
//       return;
//     }

//     try {
//       console.log("🔄 Loading FRESH profile data from API...");

//       const data = await getUserProfile();
//       console.log("📊 Raw API response:", data);

//       let userProfile = data?.data || data;

//       if (userProfile) {
//         console.log("🔵 Fresh data from API:", userProfile);

//           // ✅ FIX: Convert profile_prompts array to object format
//       let profilePromptsObject = {};
      
//       if (userProfile.profile_prompts) {
//         if (Array.isArray(userProfile.profile_prompts)) {
//           // Array format se object format me convert
//           userProfile.profile_prompts.forEach(prompt => {
//             if (prompt.question_key && prompt.answer) {
//               profilePromptsObject[prompt.question_key] = prompt.answer;
//             }
//           });
//         } else if (typeof userProfile.profile_prompts === 'object') {
//           // Already object format hai
//           profilePromptsObject = userProfile.profile_prompts;
//         }
//       }

//         const completeProfile = {
//           // Personal Information
//           first_name: userProfile.first_name || "",
//           last_name: userProfile.last_name || "",
//           full_name: userProfile.full_name || "",
//           username: userProfile.username || "",
//           email: userProfile.email || "",
//           phone: userProfile.phone || "",
//           gender: userProfile.gender || "",
//           marital_status: userProfile.marital_status || "",
//           city: userProfile.city || "",
//           country: userProfile.country || "",
//           state: userProfile.state || "",
//           pincode: userProfile.pincode || "",
//           address: userProfile.address || "",
//           dob: userProfile.dob || "",
//           age: userProfile.age || "",

//           // ✅ NEW: Personal Details
//           height: userProfile.height || "",
//           professional_identity: userProfile.professional_identity || "",
//           zodiac_sign: userProfile.zodiac_sign || "",
//           languages_spoken: Array.isArray(userProfile.languages_spoken)
//             ? userProfile.languages_spoken
//             : userProfile.languages_spoken || [],

//           // Professional Information
//           profession: userProfile.profession || "",
//           company: userProfile.company || "",
//           position: userProfile.position || "",
//           company_type: userProfile.company_type || "",
//           experience: userProfile.experience || "",
//           education: userProfile.education || "",
//           headline: userProfile.headline || "",

//           // ✅ NEW: Education Details
//           education_institution_name:
//             userProfile.education_institution_name || "",


//               // ✅ Add these two lines:
//     profile_questions: profilePromptsObject,

//           // ✅ NEW: Work Style
//           work_environment: userProfile.work_environment || "",
//           interaction_style: userProfile.interaction_style || "",
//           work_rhythm: userProfile.work_rhythm || "",
//           career_decision_style: userProfile.career_decision_style || "",
//           work_demand_response: userProfile.work_demand_response || "",

//           // About & Interests
//           about_me: userProfile.about_me || "",
//           // username: userProfile.username || "",
//           skills: Array.isArray(userProfile.skills)
//             ? userProfile.skills
//             : userProfile.skills || [],
//           hobbies: Array.isArray(userProfile.hobbies)
//             ? userProfile.hobbies
//             : userProfile.hobbies || [],
//           interests: Array.isArray(userProfile.interests)
//             ? userProfile.interests
//             : userProfile.interests || [],

//           // ✅ NEW: Lifestyle
//           self_expression: userProfile.self_expression || "",
//           freetime_style: userProfile.freetime_style || "",
//           health_activity_level: userProfile.health_activity_level || "",
//           pets_preference: userProfile.pets_preference || "",
//           religious_belief: userProfile.religious_belief || "",
//           smoking: userProfile.smoking || "",
//           drinking: userProfile.drinking || "",

//           // ✅ NEW: Relationship Preferences
//           interested_in: userProfile.interested_in || "",
//           relationship_goal: userProfile.relationship_goal || "",
//           children_preference: userProfile.children_preference || "",

//           // ✅ NEW: Relationship Styles
//           love_language_affection: Array.isArray(
//             userProfile.love_language_affection
//           )
//             ? userProfile.love_language_affection
//             : userProfile.love_language_affection || [],
//           preference_of_closeness: userProfile.preference_of_closeness || "",
//           approach_to_physical_closeness:
//             userProfile.approach_to_physical_closeness || "",
//           relationship_values: userProfile.relationship_values || "",
//           values_in_others: userProfile.values_in_others || "",
//           relationship_pace: userProfile.relationship_pace || "",

//           // ✅ NEW: JSON Fields
//           life_rhythms: userProfile.life_rhythms || {},
//           ways_i_spend_time: userProfile.ways_i_spend_time || {},
//           // profile_questions: userProfile.profile_questions || {},

//           // System Fields
//           id: userProfile.id || null,
//           user_id: userProfile.user_id || null,
//           is_submitted: userProfile.is_submitted || false,

//           // Image Fields
//           profile_picture_url: userProfile.profile_picture_url || "",
//           profilePhoto: userProfile.profilePhoto || "",
//           image_url: userProfile.image_url || "",
//           last_updated: new Date().toISOString(),
//         };

      
//         console.log("✅ Setting FRESH profile:", completeProfile);
//         setProfile(completeProfile);

//         // ⭐ IMPORTANT: Save user_id for payment operations ⭐
//         localStorage.setItem("user_id", completeProfile.user_id);

//         localStorage.setItem("userProfile", JSON.stringify(completeProfile));
//       } else {
//         console.warn("⚠️ No user profile data in API response");
//         loadCachedProfile();
//       }
//     } catch (error) {
//       console.error("❌ API Error:", error);

//       if (
//         error.response?.status === 401 ||
//         error.message?.includes("token") ||
//         error.message?.includes("expired")
//       ) {
//         console.log("🔄 Token expired, attempting refresh...");
//         try {
//           const newToken = await refreshToken();
//           if (newToken) {
//             console.log("✅ Token refreshed, retrying profile load...");
//             await loadProfile();
//             return;
//           }
//         } catch (refreshError) {
//           console.error(
//             "❌ Token refresh failed, using cached data:",
//             refreshError
//           );
//           loadCachedProfile();
//           return;
//         }
//       }

//       loadCachedProfile();
//     } finally {
//       setLoading(false);
//     }
//   };

//   // shraddha (new code start)
//   const loadCachedProfile = () => {
//     const cachedUser = localStorage.getItem("userProfile");
//     if (cachedUser) {
//       try {
//         const cachedProfile = JSON.parse(cachedUser);
//         console.log("📂 Using cached profile data");
//         setProfile(cachedProfile);

//         // ⭐ Store user_id for payment even in cached mode
//         localStorage.setItem("user_id", cachedProfile.user_id);
//       } catch (parseError) {
//         console.error("❌ Error parsing cached data:", parseError);
//         localStorage.removeItem("userProfile");
//         setProfile(null);
//       }
//     } else {
//       console.log("📭 No cached data available");
//       setProfile(null);
//     }
//   };
//   // shraddha (new code end)

//   useEffect(() => {
//     const token = localStorage.getItem("accessToken");
//     if (token) {
//       loadProfile();
//     } else {
//       console.log("⏸️ No token - clearing profile data");
//       clearProfile();
//       setLoading(false);
//     }
//   }, []);

//   const updateProfile = (newProfileData) => {
//     console.log("🔄 Updating profile with:", newProfileData);

//     const updatedProfile = {
//       ...profile,
//       ...newProfileData,
//       last_updated: new Date().toISOString(),
//     };

//     console.log("✅ Final updated profile:", updatedProfile);
//     setProfile(updatedProfile);
//     localStorage.setItem("userProfile", JSON.stringify(updatedProfile));
//   };

//   const clearProfile = () => {
//     console.log("🚪 Clearing ALL user data");
//     setProfile(null);

//     localStorage.removeItem("accessToken");
//     localStorage.removeItem("refreshToken");
//     localStorage.removeItem("userProfile");

//     // shraddha (new code start)
//     localStorage.removeItem("user_id"); // Ensure user_id also cleared
//     // shraddha (new code end)
//   };

//   const refreshProfile = () => {
//     console.log("🔄 Manually refreshing profile");
//     setLoading(true);
//     loadProfile();
//   };

//   const hasCompleteProfile = () => {
//     return (
//       profile &&
//       profile.is_submitted &&
//       (profile.first_name || profile.full_name) &&
//       profile.email
//     );
//   };

//   const value = {
//     profile,
//     updateProfile,
//     clearProfile,
//     refreshProfile,
//     loading,
//     hasCompleteProfile: hasCompleteProfile(),
//   };

//   return (
//     <UserProfileContext.Provider value={value}>
//       {children}
//     </UserProfileContext.Provider>
//   );
// };
