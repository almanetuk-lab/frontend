import React, { useState, useEffect, useRef } from "react";
import { chatApi } from "../services/chatApi";
import { useUserProfile } from "../context/UseProfileContext";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { FaBell } from "react-icons/fa";
import profileViewApi from "../services/profileViewApi";

// Notification Bell Component
const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [matchesCount, setMatchesCount] = useState(0);
  const dropdownRef = useRef(null);
  const { profile } = useUserProfile();
  const navigate = useNavigate();

  // Get user ID from profile
  const getUserId = () => {
    try {
      if (profile?.id) return profile.id;
      if (profile?.user_id) return profile.user_id;

      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      if (userData.id) return userData.id;
      if (userData.user_id) return userData.user_id;

      return null;
    } catch (error) {
      console.error("Error getting user ID:", error);
      return null;
    }
  };

  // ✅ FETCH MATCHES COUNT API
  const fetchMatchesCount = async () => {
    const userId = getUserId();
    if (!userId) return;

    try {
      console.log("Fetching matches count for user:", userId);
      const count = await profileViewApi.getMatchesCount(userId);
      setMatchesCount(count);
      console.log("Matches count received:", count);
    } catch (error) {
      console.error("Error fetching matches count:", error);
      setMatchesCount(0);
    }
  };

  // ✅ IMPROVED: NOTIFICATION CLICK HANDLER - EXACTLY LIKE MEMBERPAGE
  const handleNotificationClick = (notification) => {
    console.log("📩 Notification clicked:", notification);
    
    // Mark as read
    markAsRead(notification.id);
    
    // ✅ DEBUG: Show all notification fields
    console.log("📋 Notification object keys:", Object.keys(notification));
    
    // Extract sender information - Try multiple possible fields
    // Method 1: Check metadata field (most likely contains sender info)
    let senderId = null;
    let senderName = "User";
    
    if (notification.metadata) {
      try {
        const metadata = typeof notification.metadata === 'string' 
          ? JSON.parse(notification.metadata) 
          : notification.metadata;
        
        console.log("🔍 Metadata parsed:", metadata);
        
        senderId = metadata.sender_id || metadata.user_id || metadata.from_user_id;
        senderName = metadata.sender_name || metadata.sender_username || 
                    metadata.name || senderName;
                    
        console.log("✅ Extracted from metadata - Sender ID:", senderId, "Name:", senderName);
      } catch (error) {
        console.error("❌ Error parsing metadata:", error);
      }
    }
    
    // Method 2: Try direct fields
    if (!senderId) {
      // Check all possible fields for sender ID
      const possibleIdFields = ['sender_id', 'from_user_id', 'related_user_id', 'user_id'];
      for (const field of possibleIdFields) {
        if (notification[field]) {
          senderId = notification[field];
          console.log(`✅ Found sender ID in ${field}:`, senderId);
          break;
        }
      }
    }
    
    // Method 3: Extract from message content (fallback)
    if (!senderName || senderName === "User") {
      const message = notification.message || notification.content || '';
      if (message.includes('sent you a new message')) {
        const nameMatch = message.match(/^(.*?)\s+sent you a new message/);
        if (nameMatch) {
          senderName = nameMatch[1];
          console.log("✅ Extracted name from message:", senderName);
        }
      }
    }
    
    console.log("🎯 Final extracted - Sender ID:", senderId, "Name:", senderName);
    
    if (senderId) {
      // ✅ EXACTLY LIKE MEMBERPAGE - Use same navigation pattern
      navigate(`/dashboard/messages`, {  // ✅ Same route as MemberPage
        state: {
          selectedUser: {
            id: senderId,           // ✅ Same as MemberPage
            name: senderName,       // ✅ Same as MemberPage
            receiverId: senderId    // ✅ Same as MemberPage
          },
          from: 'notification',
          notification_id: notification.id
        }
      });
    } else {
      console.warn("⚠️ No sender ID found, opening general messages");
      // Open general messages page
      navigate(`/dashboard/messages`);
    }
    
    // Close dropdown
    setShowDropdown(false);
  };

  // Socket.IO connection
  useEffect(() => {
    const userId = getUserId();
    if (!userId) {
      console.log("No user ID found for notifications");
      return;
    }

    const socket = io("https://backend-q0wc.onrender.com");

    // Register user for real-time notifications
    socket.emit("register_user", userId);
    console.log("Registered user for notifications:", userId);

    // Listen for new notifications
    socket.on("new_notification", (notification) => {
      console.log("🔔 New notification received:", notification);
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
      
      // Refresh matches count for new message/match notifications
      if (notification.type === 'message' || notification.type === 'new_match') {
        fetchMatchesCount();
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [profile]);

  // ✅ FETCH NOTIFICATIONS & MATCHES COUNT
  const fetchNotifications = async () => {
    const userId = getUserId();

    if (!userId) {
      console.error("User ID not found");
      return;
    }

    try {
      setLoading(true);
      console.log("Fetching notifications for user:", userId);

      const [notificationsResponse] = await Promise.all([
        chatApi.getUserNotifications(userId),
        fetchMatchesCount()
      ]);

      console.log("Notifications data received:", notificationsResponse.data);

      setNotifications(notificationsResponse.data || []);

      // Calculate unread count
      const unread = (notificationsResponse.data || []).filter(
        (notif) => !notif.is_read
      ).length;
      setUnreadCount(unread);
      
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ MARK AS READ
  const markAsRead = async (notificationId) => {
    try {
      const response = await chatApi.markChatAsRead(notificationId);

      if (response.data) {
        // Update local state
        setNotifications((prev) =>
          prev.map((notif) =>
            notif.id === notificationId ? { ...notif, is_read: true } : notif
          )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // ✅ MARK ALL AS READ
  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(
        (notif) => !notif.is_read
      );

      // Mark each unread notification as read
      for (const notif of unreadNotifications) {
        await chatApi.markChatAsRead(notif.id);
      }

      // Update local state
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, is_read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  // ✅ TOGGLE DROPDOWN
  const toggleDropdown = () => {
    if (!showDropdown) {
      fetchNotifications();
    }
    setShowDropdown(!showDropdown);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Just now";
    
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      
      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
      
      return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short"
      });
    } catch (error) {
      return dateString;
    }
  };

  // ✅ INITIAL LOAD - FETCH MATCHES COUNT
  useEffect(() => {
    fetchMatchesCount();
  }, [profile]);

  // ✅ TOTAL UNREAD COUNT (Messages + Matches)
  const totalUnreadCount = unreadCount + (matchesCount > 0 ? matchesCount : 0);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell Icon */}
      <button
        onClick={toggleDropdown}
        className="relative p-2 text-gray-600 hover:text-amber-600 transition-colors"
        aria-label="Notifications"
      >
        <FaBell className="w-5 h-5 text-gray-600 hover:text-amber-600 transition-colors" />

        {/* ✅ UNREAD BADGE */}
        {totalUnreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
            {totalUnreadCount > 9 ? "9+" : totalUnreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-gray-800">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-amber-600 hover:text-amber-800 font-medium px-3 py-1 hover:bg-amber-50 rounded-lg transition-colors"
                >
                  Mark all as read
                </button>
              )}
            </div>
            
            {/* ✅ MATCHES COUNT BADGE */}
            {matchesCount > 0 && (
              <div className="mb-2 p-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-green-700">
                    <span className="font-semibold">✨ New Matches</span>
                    <span className="ml-2 bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full">
                      {matchesCount}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      navigate('/dashboard/matches');
                      setShowDropdown(false);
                    }}
                    className="text-xs text-green-600 hover:text-green-800 font-medium"
                  >
                    View
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto"></div>
                <p className="text-gray-500 mt-3 text-sm">Loading notifications...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center">
                <svg
                  className="w-16 h-16 text-gray-300 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M15 17h5l-5 5v-5zM10.24 8.56a5.97 5.97 0 01-3.79 1.44 5.97 5.97 0 01-3.79-1.44M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-gray-500 text-sm">No notifications yet</p>
                <p className="text-gray-400 text-xs mt-1">We'll notify you when something arrives</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors group ${
                      !notification.is_read ? "bg-amber-50/50" : ""
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start gap-3">
                      {/* Notification Icon */}
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                        notification.type === 'message' ? 'bg-blue-100 text-blue-600' :
                        notification.type === 'new_match' ? 'bg-green-100 text-green-600' :
                        'bg-amber-100 text-amber-600'
                      }`}>
                        {notification.type === 'message' ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                        ) : notification.type === 'new_match' ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                      </div>
                      
                      {/* Notification Content */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-800 text-sm mb-1 truncate">
                          {notification.title || 
                           (notification.type === 'message' ? 'New Message' : 
                            notification.type === 'new_match' ? 'New Match' : 'Notification')}
                        </h4>
                        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                          {notification.content || notification.message || "No content"}
                        </p>
                        
                        {/* Show sender if available */}
                        {(notification.sender_name || notification.sender_username) && (
                          <div className="flex items-center text-xs text-gray-500 mb-1">
                            <span className="mr-1">From:</span>
                            <span className="font-medium text-amber-600">
                              {notification.sender_name || notification.sender_username}
                            </span>
                          </div>
                        )}
                        
                        {/* Time */}
                        <p className="text-xs text-gray-400">
                          {formatDate(notification.created_at)}
                        </p>
                      </div>

                      {/* Unread Indicator */}
                      {!notification.is_read && (
                        <div className="w-2 h-2 bg-amber-500 rounded-full mt-1 flex-shrink-0 animate-pulse"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-gray-200 bg-gray-50 rounded-b-lg">
            <div className="flex justify-between items-center">
              <button
                onClick={fetchNotifications}
                className="text-sm text-gray-600 hover:text-amber-600 font-medium py-1.5 px-3 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
              
              <button
                onClick={() => {
                  navigate('/dashboard/messages');  // ✅ Same as MemberPage
                  setShowDropdown(false);
                }}
                className="text-sm bg-amber-500 hover:bg-amber-600 text-white font-medium px-4 py-2 rounded-lg transition-all hover:-translate-y-0.5 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                View All Messages
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;





// import React, { useState, useEffect, useRef } from "react";
// import { chatApi } from "../services/chatApi"; // ChatApi import karo
// import { useUserProfile } from "../context/UseProfileContext";
// import io from "socket.io-client";
// import { FaBell } from "react-icons/fa";

// // Notification Bell Component
// const NotificationBell = () => {
//   const [notifications, setNotifications] = useState([]);
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const dropdownRef = useRef(null);
//   const { profile } = useUserProfile();

//   // Get user ID from profile

//   const getUserId = () => {
//     try {
//       if (profile?.id) return profile.id;
//       if (profile?.user_id) return profile.user_id;

//       const userData = JSON.parse(localStorage.getItem("user") || "{}");
//       if (userData.id) return userData.id;
//       if (userData.user_id) return userData.user_id;

//       return null;
//     } catch (error) {
//       console.error("Error getting user ID:", error);
//       return null;
//     }
//   };
//   // ✅ FILE UPLOAD - Using updated endpoint
//   const handleFileUpload = async (file) => {
//     if (!selectedUser || !currentUserId) return;

//     setFileUploading(true);
//     const tempId = `file-${Date.now()}`;
//     const tempMsg = {
//       id: tempId,
//       sender_id: currentUserId,
//       receiver_id: selectedUser.id,
//       content: `Sending: ${file.name}`,
//       isTemporary: true,
//       isUploading: true,
//     };

//     setMessages((prev) => [...prev, tempMsg]);

//     try {
//       const uploadResponse = await chatApi.uploadFile(file); // ✅ This will now use /api/chat/upload
//       if (uploadResponse.data?.url) {
//         await chatApi.sendMessage({
//           sender_id: currentUserId,
//           receiver_id: selectedUser.id,
//           content: `File: ${file.name}`,
//           attachment_url: uploadResponse.data.url,
//         });

//         setTimeout(() => {
//           setMessages((prev) => prev.filter((msg) => msg.id !== tempId));
//         }, 1000);
//       }
//     } catch (err) {
//       console.error("Upload failed:", err);
//       setMessages((prev) => prev.filter((msg) => msg.id !== tempId));
//     } finally {
//       setFileUploading(false);
//     }
//   };

//   // Socket.IO connection
//   useEffect(() => {
//     const userId = getUserId();
//     if (!userId) {
//       console.log("No user ID found for notifications");
//       return;
//     }

//     const socket = io("https://backend-q0wc.onrender.com");

//     // Register user for real-time notifications
//     socket.emit("register_user", userId);
//     console.log("Registered user for notifications:", userId);

//     // Listen for new notifications
//     socket.on("new_notification", (notification) => {
//       console.log("New notification received:", notification);
//       setNotifications((prev) => [notification, ...prev]);
//       setUnreadCount((prev) => prev + 1);
//     });

//     return () => {
//       socket.disconnect();
//     };
//   }, [profile]);

//   // ✅ FIXED: Fetch notifications using chatApi (axios)
//   const fetchNotifications = async () => {
//     const userId = getUserId();

//     if (!userId) {
//       console.error("User ID not found");
//       return;
//     }

//     try {
//       setLoading(true);
//       console.log("Fetching notifications for user:", userId);

//       // ✅ Use chatApi instead of fetch
//       const response = await chatApi.getUserNotifications(userId);
//       console.log("Notifications data:", response.data);

//       setNotifications(response.data || []);

//       // Calculate unread count
//       const unread = (response.data || []).filter(
//         (notif) => !notif.is_read
//       ).length;
//       setUnreadCount(unread);
//     } catch (error) {
//       console.error("Error fetching notifications:", error);
//       setNotifications([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ FIXED: Mark notification as read using chatApi
//   const markAsRead = async (notificationId) => {
//     try {
//       // ✅ Use chatApi instead of fetch
//       const response = await chatApi.markChatAsRead(notificationId);

//       if (response.data) {
//         // Update local state
//         setNotifications((prev) =>
//           prev.map((notif) =>
//             notif.id === notificationId ? { ...notif, is_read: true } : notif
//           )
//         );
//         setUnreadCount((prev) => Math.max(0, prev - 1));
//       }
//     } catch (error) {
//       console.error("Error marking notification as read:", error);
//     }
//   };

//   // ✅ FIXED: Mark all as read using chatApi
//   const markAllAsRead = async () => {
//     try {
//       const unreadNotifications = notifications.filter(
//         (notif) => !notif.is_read
//       );

//       // Mark each unread notification as read
//       for (const notif of unreadNotifications) {
//         await chatApi.markChatAsRead(notif.id);
//       }

//       // Update local state
//       setNotifications((prev) =>
//         prev.map((notif) => ({ ...notif, is_read: true }))
//       );
//       setUnreadCount(0);
//     } catch (error) {
//       console.error("Error marking all as read:", error);
//     }
//   };

//   // ✅ FIXED: Get unread chat notifications
//   const fetchUnreadChats = async () => {
//     const userId = getUserId();
//     if (!userId) return;

//     try {
//       const response = await chatApi.getUnreadChats(userId);
//       console.log("Unread chats:", response.data);
//       // You can use this for chat-specific notifications
//     } catch (error) {
//       console.error("Error fetching unread chats:", error);
//     }
//   };

//   async function markAllNotificationsAsRead(userId) {
//     try {
//       const response = await chatAPI.markNotificationsAsRead(userId);

//       if (response.data.success) {
//         console.log("Notifications marked as read:", response.data.message);
//         return {
//           success: true,
//           message: response.data.message,
//           updatedCount: response.data.updated,
//         };
//       }

//       return {
//         success: false,
//         message: "Failed to mark notifications as read",
//       };
//     } catch (error) {
//       console.error("Error marking notifications as read:", error);
//       return {
//         success: false,
//         message: error.response?.data?.message || "Network error",
//       };
//     }
//   }

//   // Toggle dropdown
//   const toggleDropdown = () => {
//     if (!showDropdown) {
//       fetchNotifications();
//     }
//     setShowDropdown(!showDropdown);
//   };

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setShowDropdown(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   // Format date
//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString("en-IN", {
//       day: "numeric",
//       month: "short",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   // ✅ Load initial unread count when component mounts
//   useEffect(() => {
//     // fetchUnreadCount();
//   }, [profile]);

//   return (
//     <div className="relative" ref={dropdownRef}>
//       {/* Notification Bell Icon */}
//       <button
//         onClick={toggleDropdown}
//         className="relative p-2 text-gray-600 hover:text-amber-600 transition-colors"
//       >
//         {/* ball icons  */}
//         <FaBell className="w-5 h-5 text-gray-600" />

//         {/* Notification Badge */}
//         {unreadCount > 0 && (
//           <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
//             {unreadCount > 9 ? "9+" : unreadCount}
//           </span>
//         )}
//       </button>

//       {/* Notification Dropdown */}
//       {showDropdown && (
//         <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
//           {/* Header */}
//           <div className="p-4 border-b border-gray-200">
//             <div className="flex justify-between items-center">
//               <h3 className="text-lg font-semibold text-gray-800">
//                 Notifications
//               </h3>
//               {unreadCount > 0 && (
//                 <button
//                   onClick={markAllAsRead}
//                   className="text-sm text-amber-600 hover:text-amber-800 font-medium"
//                 >
//                   Mark all as read
//                 </button>
//               )}
//             </div>
//           </div>

//           {/* Notifications List */}
//           <div className="max-h-96 overflow-y-auto">
//             {loading ? (
//               <div className="p-4 text-center">
//                 <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-500 mx-auto"></div>
//                 <p className="text-gray-500 mt-2">Loading notifications...</p>
//               </div>
//             ) : notifications.length === 0 ? (
//               <div className="p-6 text-center">
//                 <svg
//                   className="w-12 h-12 text-gray-300 mx-auto mb-3"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={1}
//                     d="M15 17h5l-5 5v-5zM10.24 8.56a5.97 5.97 0 01-3.79 1.44 5.97 5.97 0 01-3.79-1.44M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                   />
//                 </svg>
//                 <p className="text-gray-500">No notifications yet</p>
//               </div>
//             ) : (
//               <div className="divide-y divide-gray-100">
//                 {notifications.map((notification) => (
//                   <div
//                     key={notification.id}
//                     className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
//                       !notification.is_read ? "bg-amber-50" : ""
//                     }`}
//                     onClick={() => markAsRead(notification.id)}
//                   >
//                     <div className="flex justify-between items-start">
//                       <div className="flex-1">
//                         <h4 className="font-semibold text-gray-800 text-sm">
//                           {notification.title || "New Message"}
//                         </h4>
//                         <p className="text-gray-600 text-sm mt-1">
//                           {notification.content || notification.message}
//                         </p>
//                         <p className="text-xs text-gray-400 mt-2">
//                           {formatDate(notification.created_at)}
//                         </p>
//                       </div>

//                       {/* Unread indicator */}
//                       {!notification.is_read && (
//                         <div className="w-2 h-2 bg-amber-500 rounded-full ml-2 mt-1"></div>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Footer */}
//           <div className="p-3 border-t border-gray-200 bg-gray-50 rounded-b-lg">
//             <button
//               onClick={fetchNotifications}
//               className="w-full text-center text-sm text-amber-600 hover:text-amber-800 font-medium py-2"
//             >
//               Refresh Notifications
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default NotificationBell;
