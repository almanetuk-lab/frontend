import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://backend-q0wc.onrender.com";

// Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ==================== CHAT APIS ====================

export const chatApi = {
  // 🔍 Search users
  searchUsers: (searchQuery) => {
    return api.get(`/api/users?search=${encodeURIComponent(searchQuery)}`);
  },

  // SEARCH PROFILES
  searchProfiles: (searchParams) =>
    api.get("/search", { params: searchParams }),

  // Get messages between users
  getMessages: (userId, currentUserId) => {
    return api.get(`/api/messages/${userId}?myUserId=${currentUserId}`);
  },

  // Send message
  sendMessage: (messageData) => {
    return api.post("/api/messages", messageData);
  },

  // for recent message
  getRecentChats: (myUserId) => {
    return api.get(`/api/chats/recent/${myUserId}`);
  },

  // Upload file
  uploadFile: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post("/api/chat/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Add reaction to message
  addReaction: (reactionData) => {
    return api.post("/api/reactions", reactionData);
  },

  // Get reactions for conversation
  getReactions: (userA, userB) => {
    return api.get(`/api/reactions?userA=${userA}&userB=${userB}`);
  },

  markChatAsRead: (notificationId) => {
    return api.put(`/api/notifications/read/${notificationId}`);
  },

  // Get user notifications
  getUserNotifications: (userId) => {
    return api.get(`/api/notifications/${userId}`);
  },

  // Mark all notifications as read
  markAllNotificationsAsRead: (userId) => {
    return api.put(`/api/notifications/read/messages/${userId}`);
  },

  // DELETE MESSAGE API
  deleteMessage: async (messageId) => {
    const currentUser = localStorage.getItem("currentUser");
    let userId = "";

    if (currentUser) {
      try {
        const userData = JSON.parse(currentUser);
        userId = userData.user_id || userData.id;
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }

    const response = await api.delete(
      `/api/messages/${messageId}?userId=${userId}`
    );
    return response;
  },
};

// ==================== PROFILE VIEW APIS ====================

export const recentApi = {
  // ✅ Track profile view
  trackProfileView: async (viewedId) => {
    try {
      const response = await api.post(`/api/view/viewers/${viewedId}`);
      return response.data;
    } catch (error) {
      console.error("Error tracking profile view:", error);
      return { success: false };
    }
  },

  // ✅ Get recent viewers - WITH DATA FIX
  getRecentViewers: async (userId) => {
    try {
      const response = await api.get(`/api/view/${userId}/recentViewers`);

      // ✅ FIX: Check and correct the data structure
      let newViewers = response.data.newViewers || [];

      // If user_id is wrong (showing viewed user's ID instead of viewer's ID)
      // We need to fix this - but first let's debug
      console.log("🔍 RAW API RESPONSE:", response.data);

      return {
        newViewersCount: response.data.newViewersCount || 0,
        newViewers: newViewers,
      };
    } catch (error) {
      console.error("Error fetching recent viewers:", error);
      return {
        newViewersCount: 0,
        newViewers: [],
      };
    }
  },

  // // ✅ FIXED Dashboard summary
  // getDashboardSummary: async (userId) => {
  //   try {
  //     const [viewersData, profileData] = await Promise.all([
  //       recentApi.getRecentViewers(userId),
  //       recentApi.getUserProfile(userId),
  //     ]);

  //     const today = new Date().toDateString();

  //     // ✅ CORRECT LOGIC:
  //     // viewersData.newViewers = जिन्होंने आपका profile देखा
  //     const todaysViewers =
  //       viewersData.newViewers?.filter((viewer) => {
  //         if (!viewer.viewed_at) return false;
  //         const viewDate = new Date(viewer.viewed_at).toDateString();
  //         return viewDate === today;
  //       }) || [];

  //     // ✅ DEBUG: Check what we're getting
  //     console.log("=== DASHBOARD SUMMARY DEBUG ===");
  //     console.log("Logged in User ID:", userId);
  //     console.log("Total viewers:", viewersData.newViewersCount);
  //     console.log("First viewer data:", viewersData.newViewers?.[0]);
  //     console.log(
  //       "First viewer user_id:",
  //       viewersData.newViewers?.[0]?.user_id
  //     );
  //     console.log("Today's viewers count:", todaysViewers.length);

  //     return {
  //       // ✅ These are people who viewed YOUR profile
  //       profile_views: viewersData.newViewersCount || 0,
  //       recent_viewers: viewersData.newViewers || [],
  //       today_viewers: todaysViewers.length,

  //       // ✅ Your own profile data
  //       user_profile: profileData,

  //       // Mock data (can be replaced with real APIs)
  //       matches_count: 24,
  //       connections_count: 56,
  //       messages_count: 12,
  //       timestamp: new Date().toISOString(),
  //     };
  //   } catch (error) {
  //     console.error("Error in dashboard summary:", error);
  //     return {
  //       profile_views: 0,
  //       recent_viewers: [],
  //       today_viewers: 0,
  //       user_profile: {},
  //       matches_count: 24,
  //       connections_count: 56,
  //       messages_count: 12,
  //     };
  //   }
  // },
getDashboardSummary: async (userId) => {
  try {
    const [viewersData, profileData] = await Promise.all([
      recentApi.getRecentViewers(userId),
      recentApi.getUserProfile(userId)
    ]);
    
    const allViewers = viewersData.newViewers || [];
    const today = new Date().toDateString();

    // FIXED: created_at check karein kyunki API response mein wahi hai
    const todaysViewers = allViewers.filter(viewer => {
      const dateString = viewer.viewed_at || viewer.created_at; // Fallback to created_at
      if (!dateString) return false;
      return new Date(dateString).toDateString() === today;
    });
    
    return {
      profile_views: viewersData.newViewersCount || allViewers.length, 
      recent_viewers: allViewers, 
      today_viewers: todaysViewers.length, // Ab ye 0 nahi aayega
      user_profile: profileData,
      matches_count: 24,
      connections_count: 56,
      messages_count: 12
    };
  } catch (error) {
    console.error('Error:', error);
    return { profile_views: 0, recent_viewers: [], today_viewers: 0 };
  }
},

  // ✅ Get user profile data
  getUserProfile: async (userId) => {
    try {
      const response = await api.get(`/api/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return {};
    }
  },
};
// ==================== PROFILE VIEW APIS ====================

// export const recentApi = {
//   // ✅ CORRECTED: Track profile view (TOKEN BASED - POST)
//   trackProfileView: async (viewedId) => {
//     try {
//       // ✅ POST request with token (viewerId token से automatically मिलेगा)
//       const response = await api.post(`/api/view/viewers/${viewedId}`);
//       return response.data;
//     } catch (error) {
//       console.error('Error tracking profile view:', error);
//       return { success: false };
//     }
//   },

//   // ✅ Get recent viewers (ID BASED - GET)
//   getRecentViewers: async (userId) => {
//     try {
//       const response = await api.get(`/api/view/${userId}/recentViewers`);
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching recent viewers:', error);
//       return {
//         newViewersCount: 0,
//         newViewers: []
//       };
//     }
//   },

//   // ✅ Get user profile data
//   getUserProfile: async (userId) => {
//     try {
//       const response = await api.get(`/api/users/${userId}`);
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching user profile:', error);
//       return {};
//     }
//   },

//   // ✅ Dashboard summary
//   getDashboardSummary: async (userId) => {
//     try {
//       const [viewersData, profileData] = await Promise.all([
//         recentApi.getRecentViewers(userId),
//         recentApi.getUserProfile(userId)
//       ]);

//       const today = new Date().toDateString();
//       const todaysViewers = viewersData.newViewers?.filter(viewer => {
//         if (!viewer.viewed_at) return false;
//         const viewDate = new Date(viewer.viewed_at).toDateString();
//         return viewDate === today;
//       }) || [];

//       return {
//         profile_views: viewersData.newViewersCount || 0,
//         recent_viewers: viewersData.newViewers || [],
//         today_viewers: todaysViewers.length,
//         user_profile: profileData,
//         matches_count: 24,
//         connections_count: 56,
//         messages_count: 12,
//         timestamp: new Date().toISOString()
//       };
//     } catch (error) {
//       console.error('Error in dashboard summary:', error);
//       return {
//         profile_views: 0,
//         recent_viewers: [],
//         today_viewers: 0,
//         user_profile: {},
//         matches_count: 24,
//         connections_count: 56,
//         messages_count: 12
//       };
//     }
//   }
// };

// ==================== HELPER FUNCTIONS ====================
export const getCurrentUserId = () => {
  let user = localStorage.getItem("currentUser") || '{"user_id": "10"}';
  try {
    const userData = JSON.parse(user);
    return userData.user_id || userData.id || "10";
  } catch {
    return "10";
  }
};

export const getSuggestedMatches = async () => {
  try {
    const userId = getCurrentUserId();
    const response = await api.get(`/api/my_matches/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching suggested matches:", error);
    throw error;
  }
};

// ==================== DEFAULT EXPORT ====================
// ✅ CORRECT - सिर्फ एक default export
export default api;

// import axios from 'axios';

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://backend-q0wc.onrender.com";

// //  Axios instance
// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// //  Chat API s
// export const chatApi = {
//   // 🔍 Search users
//   searchUsers: (searchQuery) => {
//     return api.get(`/api/users?search=${encodeURIComponent(searchQuery)}`);
//   },

//       // SEARCH PROFILES - Add this line only
//   searchProfiles: (searchParams) => api.get('/search', { params: searchParams }),

//   //  Get messages between users
//   getMessages: (userId, currentUserId) => {
//     return api.get(`/api/messages/${userId}?myUserId=${currentUserId}`);
//   },

//   //  Send message
//   sendMessage: (messageData) => {
//     return api.post('/api/messages', messageData);
//   },
// // for resent meaasge
// getRecentChats: (myUserId) => {
//   return api.get(`/api/chats/recent/${myUserId}`);
// },

//   //  Upload file
//   uploadFile: (file) => {
//     const formData = new FormData();
//     formData.append('file', file);
//     return api.post('/api/chat/upload', formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     });
//   },

//   //  Add reaction to message
//   addReaction: (reactionData) => {
//     return api.post('/api/reactions', reactionData);
//   },

//   //  Get reactions for conversation
//   getReactions: (userA, userB) => {
//     return api.get(`/api/reactions?userA=${userA}&userB=${userB}`);
//   },

// markChatAsRead: (notificationId) => {
//   return api.put(`/api/notifications/read/${notificationId}`);
// },

// //  ADD THIS MISSING API
// getUserNotifications: (userId) => {
//   return api.get(`/api/notifications/${userId}`);
// },

//  //  YEH NAYI API ADD KARDI hai mane
//   markAllNotificationsAsRead: (userId) => {
//     return api.put(`/api/notifications/read/messages/${userId}`);
//   },

// //  DELETE MESSAGE API hai yeh
// deleteMessage: async (messageId) => {
//   // Get current user ID from localStorage
//   const currentUser = localStorage.getItem('currentUser');
//   let userId = '';

//   if (currentUser) {
//     try {
//       const userData = JSON.parse(currentUser);
//       userId = userData.user_id || userData.id;
//     } catch (error) {
//       console.error('Error parsing user data:', error);
//     }
//   }

//   const response = await api.delete(`/api/messages/${messageId}?userId=${userId}`);
//   return response;
// },

// };

// export const getCurrentUserId = () => {
//   let user = localStorage.getItem('currentUser') || '10';
//   let userId = JSON.parse(user).user_id;
//   return userId;
// };

// export const getSuggestedMatches = async () => {
//   try {
//     const userId = getCurrentUserId();
//     const response = await api.get(`/api/my_matches/${userId}`);
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching suggested matches:', error);
//     throw error;
//   }
// };

// export const trackProfileView = async (viewerId, viewedId) => {
//   try {
//     const response = await api.get(`/api/view/viewers/${viewerId}`, {
//       params: {
//         viewed_id: viewedId,
//         timestamp: new Date().toISOString()
//       }
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Error tracking profile view:', error);
//     return { success: false };
//   }
// };

// /**
//  * 2. GET who viewed a user's profile
//  * GET /api/view/{userId}/recentViewers
//  * - किसी user की profile को किन लोगों ने देखा
//  * - Response: { newViewersCount: 5, newViewers: [...] }
//  */
// export const getRecentViewers = async (userId) => {
//   try {
//     const response = await api.get(`/api/view/${userId}/recentViewers`);
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching recent viewers:', error);
//     return {
//       newViewersCount: 0,
//       newViewers: []
//     };
//   }
// };

// /**
//  * 3. GET user profile data
//  * GET /api/user/{userId}
//  */
// export const getUserProfile = async (userId) => {
//   try {
//     const response = await api.get(`/api/user/${userId}`);
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching user profile:', error);
//     return {};
//   }
// };

// /**
//  * 4. Dashboard summary (सभी data एक साथ)
//  */
// export const getDashboardSummary = async (userId) => {
//   try {
//     // Parallel calls for recent viewers और user profile
//     const [viewersData, profileData] = await Promise.all([
//       getRecentViewers(userId),
//       getUserProfile(userId)
//     ]);

//     // Calculate today's new viewers
//     const today = new Date().toDateString();
//     const todaysViewers = viewersData.newViewers?.filter(viewer => {
//       if (!viewer.viewed_at) return false;
//       const viewDate = new Date(viewer.viewed_at).toDateString();
//       return viewDate === today;
//     }) || [];

//     return {
//       // Profile views data
//       profile_views: viewersData.newViewersCount || 0,
//       recent_viewers: viewersData.newViewers || [],
//       today_viewers: todaysViewers.length,

//       // User profile
//       user_profile: profileData,

//       // Other stats (hardcoded क्योंकि APIs नहीं हैं)
//       matches_count: 24,
//       connections_count: 56,
//       messages_count: 12,

//       timestamp: new Date().toISOString()
//     };
//   } catch (error) {
//     console.error('Error in dashboard summary:', error);
//     return {
//       profile_views: 0,
//       recent_viewers: [],
//       today_viewers: 0,
//       user_profile: {},
//       matches_count: 24,
//       connections_count: 56,
//       messages_count: 12
//     };
//   }
// };

// // Export all
// export default api
// {
//   trackProfileView,
//   getRecentViewers,
//   getUserProfile,
//   getDashboardSummary
// };

// // export default api;

// // export const getCurrentUserId = () => {
// //   return localStorage.getItem('userId') || '82';
// // };

// // export const getSuggestedMatches = async () => {
// //   try {
// //     const userId = getCurrentUserId();
// //     const response = await api.get(`/api/my_matches/${userId}`);
// //     return response.data;
// //   } catch (error) {
// //     console.error('Error fetching suggested matches:', error);
// //     throw error;
// //   }
// // };
