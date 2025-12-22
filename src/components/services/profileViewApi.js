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
      const response = await api.get(`/api/view/${userId}/recentViewers`);

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

  //  GET UNREAD MESSAGES COUNT
  getUnreadMessagesCount: async (userId) => {
    try {
      const response = await api.get(`/api/view/${userId}/unreadMessages`);
      return response.data?.unreadCount || 0;
    } catch (error) {
      console.error("❌ Error fetching unread messages count:", error);
      return 0;
    }
  },

  //   getSuggestedMatches: async () => {
  //     try {
  //       const userId = getCurrentUserId();
  //       const response = await api.get(`/api/my_matches/${userId}`);
  //       return response.data;
  //     } catch (error) {
  //       console.error("Error fetching suggested matches:", error);
  //       throw error;
  //     }
  //   },

  //   //  DASHBOARD SUMMARY (FIXED VERSION)
  //   getDashboardSummary: async (userId) => {
  //     try {
  //       //  CORRECT: All three API calls with correct variable names
  //       const viewersData = await profileViewApi.getRecentViewers(userId);
  //       const profileData = await profileViewApi.getUserProfile(userId);
  //       const unreadCount = await profileViewApi.getUnreadMessagesCount(userId);
  //       const matches = await profileViewApi.getSuggestedMatches();

  //       const today = new Date().toDateString();

  //       const todaysViewers =
  //         viewersData.newViewers?.filter((viewer) => {
  //           const date = viewer.viewed_at || viewer.created_at;
  //           if (!date) return false;
  //           return new Date(date).toDateString() === today;
  //         }) || [];

  //       return {
  //         profile_views:
  //           viewersData.newViewersCount ||
  //           viewersData.newViewers.length,

  //         recent_viewers: viewersData.newViewers,
  //         today_viewers: todaysViewers.length,
  //         user_profile: profileData,
  //         messages_count: unreadCount,
  //         matches_count: matchesCount, //  Actual API se matches count

  //         // matches_count: getSuggestedMatches.length || 0,
  //         connections_count: 0,
  //       };
  //     } catch (error) {
  //       console.error("❌ Dashboard summary error:", error);
  //       return {
  //         profile_views: 0,
  //         recent_viewers: [],
  //         today_viewers: 0,
  //         user_profile: {},
  //         messages_count: 0,
  //         // matches_count: 152,
  //         matches_count: 0, // ✅ 0 set karein error case mein
  //       };
  //     }
  //   },
  // };

  // //  GET MATCHES COUNT (Suggested matches se hi count nikal lein)
  // getMatchesCount: async (userId) => {
  //   try {
  //     if (!userId) {
  //       return 0;
  //     }
  //     // Suggested matches se hi count nikal lete hain
  //     const matchesData = await profileViewApi.getSuggestedMatches(userId);

  //     // Different response structures handle karein
  //     if (Array.isArray(matchesData)) {
  //       return matchesData.length;
  //     } else if (matchesData && typeof matchesData === 'object') {
  //       // Agar object mein matches array hai
  //       if (matchesData.matches && Array.isArray(matchesData.matches)) {
  //         return matchesData.matches.length;
  //       }
  //       // Agar object mein data array hai
  //       if (matchesData.data && Array.isArray(matchesData.data)) {
  //         return matchesData.data.length;
  //       }
  //       // Agar direct count property hai
  //       if (matchesData.count !== undefined) {
  //         return matchesData.count;
  //       }
  //     }
  //     return 0;
  //   } catch (error) {
  //     console.error("❌ Error fetching matches count:", error);
  //     return 0;
  //   }
  // },

  //  GET SUGGESTED MATCHES (FIXED VERSION)
  getSuggestedMatches: async (userId) => {
    //  userId parameter add karein
    try {
      if (!userId) {
        throw new Error("User ID is required");
      }
      const response = await api.get(`/api/my_matches/${userId}`);
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching suggested matches:", error);
      throw error;
    }
  },

  //  GET MATCHES COUNT (NEW FUNCTION)
  getMatchesCount: async (userId) => {
    try {
      if (!userId) {
        throw new Error("User ID is required");
      }
      const response = await api.get(`/api/matches/count/${userId}`);
      return response.data?.matches_count || 0;
    } catch (error) {
      console.error("❌ Error fetching matches count:", error);
      return 0;
    }
  },

  //  DASHBOARD SUMMARY (FIXED VERSION)
  getDashboardSummary: async (userId) => {
    try {
      // Parallel API calls for better performance
      const [viewersData, profileData, unreadCount, matchesCount] =
        await Promise.all([
          profileViewApi.getRecentViewers(userId),
          profileViewApi.getUserProfile(userId),
          profileViewApi.getUnreadMessagesCount(userId),
          profileViewApi.getMatchesCount(userId), //  Use getMatchesCount instead of getSuggestedMatches
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
          viewersData.newViewersCount || viewersData.newViewers.length,
        recent_viewers: viewersData.newViewers,
        today_viewers: todaysViewers.length,
        user_profile: profileData,
        messages_count: unreadCount,
        matches_count: matchesCount, //  Actual matches count from API
        connections_count: 0,
      };
    } catch (error) {
      console.error("❌ Dashboard summary error:", error);
      return {
        profile_views: 0,
        recent_viewers: [],
        today_viewers: 0,
        user_profile: {},
        messages_count: 0,
        matches_count: 0,
        connections_count: 0,
      };
    }
  },
};

export default profileViewApi;
