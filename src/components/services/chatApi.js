import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://backend-q0wc.onrender.com";

//  Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

//  Chat API s
export const chatApi = {
  // 🔍 Search users
  searchUsers: (searchQuery) => {
    return api.get(`/api/users?search=${encodeURIComponent(searchQuery)}`);
  },

  //  Get messages between users
  getMessages: (userId, currentUserId) => {
    return api.get(`/api/messages/${userId}?myUserId=${currentUserId}`);
  },

  //  Send message
  sendMessage: (messageData) => {
    return api.post('/api/messages', messageData);
  },


  //  Upload file
  uploadFile: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/api/chat/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  //  Add reaction to message
  addReaction: (reactionData) => {
    return api.post('/api/reactions', reactionData);
  },

  //  Get reactions for conversation
  getReactions: (userA, userB) => {
    return api.get(`/api/reactions?userA=${userA}&userB=${userB}`);
  },

  // CHAT NOTIFICATION APIS
// getUnreadChats: (userId) => {
//   return api.get(`/api/notifications/unread/${userId}`);
// },

// getUnreadChatCount: (userId) => {
//   return api.get(`/api/notifications/count/${userId}`);
// },

markChatAsRead: (notificationId) => {
  return api.put(`/api/notifications/read/${notificationId}`);
},

//  ADD THIS MISSING API
getUserNotifications: (userId) => {
  return api.get(`/api/notifications/${userId}`);
},

 //  YEH NAYI API ADD KARDI
  markAllNotificationsAsRead: (userId) => {
    return api.put(`/api/notifications/read/messages/${userId}`);
  }

};

  
export default api;