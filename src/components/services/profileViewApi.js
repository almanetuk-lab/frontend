import api from "./axiosConfig";

const profileViewApi = {
  //  TRACK PROFILE VIEW
  trackProfileView: async (viewedId) => {
    try {
      const response = await api.post(`/api/view/viewers/${viewedId}`);
      return response.data;
    } catch (error) {
      console.error("❌ Error tracking profile view:", error);
      throw error;
    }
  },

  // GET RECENT VIEWERS

  getRecentViewers: async (userId) => {
    try {
      const response = await api.get(
        `/api/view/${userId}/recentViewers`
      );

      return {
        newViewersCount: response.data?.newViewersCount || 0,
        newViewers: response.data?.newViewers || [],
      };
    } catch (error) {
      console.error("❌ Error fetching recent viewers:", error);
      return {
        newViewersCount: 0,
        newViewers: [],
      };
    }
  },

  //  GET USER PROFILE
  getUserProfile: async (userId) => {
    try {
      const response = await api.get(`/api/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching user profile:", error);
      return {};
    }
  },

  // profileViewApi.js me yeh function add/update karein:

// // CORRECT unread messages API
// getUnreadMessagesCount: async (userId, profileId = null) => {
//   try {
//     // Agar profileId nahi hai toh default lelo
//     const actualProfileId = profileId || userId; // Ya logic ke hisaab se
    
//     const response = await api.get(
//       `/api/view/${userId}/${actualProfileId}/unreadMessages`
//     );
    
//     console.log("📩 Unread messages API response:", response.data);
//     return response.data?.unreadCount || 0;
//   } catch (error) {
//     console.error("❌ Error fetching unread messages count:", error);
//     return 0;
//   }
// },

// getUnreadMessagesCount: async (userId) => {
//   try {
//     const response = await api.get(`/api/view/${userId}/unreadMessages`); // Single parameter
//     return response.data?.unreadCount || 0;
//   } catch (error) {
//     console.error("❌ Error:", error);
//     return 0;
//   }
// },

//   //  GET UNREAD MESSAGES COUNT
// getUnreadMessagesCount: async (userId) => {
//   try {
//     const response = await api.get(
//       `/api/view/${userId}/unreadMessages`
//     );
//     return response.data?.unreadCount || 0;
//   } catch (error) {
//     console.error("❌ Error fetching unread messages count:", error);
//     return 0;
//   }
// },

  //  DASHBOARD SUMMARY
  getDashboardSummary: async (userId) => {
    try {
      const [viewersData, profileData] = await Promise.all([
        profileViewApi.getRecentViewers(userId),
        profileViewApi.getUserProfile(userId),
      // profileViewApi.getUnreadMessagesCount(userId, userId)
      ]);

      const today = new Date().toDateString();

      const todaysViewers =
        viewersData.newViewers?.filter((viewer) => {
          const date = viewer.viewed_at || viewer.created_at;
          if (!date) return false;
          return new Date(date).toDateString() === today;
        }) || [];

      return {
        profile_views:
          viewersData.newViewersCount ||
          viewersData.newViewers.length,

        recent_viewers: viewersData.newViewers,
        today_viewers: todaysViewers.length,
        user_profile: profileData,

        matches_count: 10,
        connections_count: 0,
        messages_count:0,
      };
    } catch (error) {
      console.error("❌ Dashboard summary error:", error);
      return {
        profile_views: 0,
        recent_viewers: [],
        today_viewers: 0,
        user_profile: {},
      //  messages_count: 0,
      };
    }
  },
};




export default profileViewApi;
