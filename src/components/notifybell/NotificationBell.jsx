import React, { useState, useEffect, useRef } from "react";
import { chatApi } from '../services/chatApi'; // ChatApi import karo
import { useUserProfile } from "../context/UseProfileContext";
import io from 'socket.io-client';

// Notification Bell Component
const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);
  const { profile } = useUserProfile();

  // Get user ID from profile
  const getUserId = () => {
    try {
      if (profile?.id) return profile.id;
      if (profile?.user_id) return profile.user_id;
      
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      if (userData.id) return userData.id;
      if (userData.user_id) return userData.user_id;
      
      return null;
    } catch (error) {
      console.error('Error getting user ID:', error);
      return null;
    }
  };
  // ✅ FILE UPLOAD - Using updated endpoint
const handleFileUpload = async (file) => {
  if (!selectedUser || !currentUserId) return;
  
  setFileUploading(true);
  const tempId = `file-${Date.now()}`;
  const tempMsg = { 
    id: tempId, 
    sender_id: currentUserId, 
    receiver_id: selectedUser.id, 
    content: `Sending: ${file.name}`, 
    isTemporary: true, 
    isUploading: true 
  };
  
  setMessages(prev => [...prev, tempMsg]);

  try {
    const uploadResponse = await chatApi.uploadFile(file); // ✅ This will now use /api/chat/upload
    if (uploadResponse.data?.url) {
      await chatApi.sendMessage({
        sender_id: currentUserId,
        receiver_id: selectedUser.id,
        content: `File: ${file.name}`,
        attachment_url: uploadResponse.data.url
      });
      
      setTimeout(() => {
        setMessages(prev => prev.filter(msg => msg.id !== tempId));
      }, 1000);
    }
  } catch (err) {
    console.error('Upload failed:', err);
    setMessages(prev => prev.filter(msg => msg.id !== tempId));
  } finally {
    setFileUploading(false);
  }
};

  // Socket.IO connection
  useEffect(() => {
    const userId = getUserId();
    if (!userId) {
      console.log('No user ID found for notifications');
      return;
    }

    const socket = io('https://backend-q0wc.onrender.com');
    
    // Register user for real-time notifications
    socket.emit('register_user', userId);
    console.log('Registered user for notifications:', userId);

    // Listen for new notifications
    socket.on('new_notification', (notification) => {
      console.log('New notification received:', notification);
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
    });

    return () => {
      socket.disconnect();
    };
  }, [profile]);

  // ✅ FIXED: Fetch notifications using chatApi (axios)
  const fetchNotifications = async () => {
    const userId = getUserId();
    
    if (!userId) {
      console.error('User ID not found');
      return;
    }

    try {
      setLoading(true);
      console.log('Fetching notifications for user:', userId);
      
      // ✅ Use chatApi instead of fetch
      const response = await chatApi.getUserNotifications(userId);
      console.log('Notifications data:', response.data);
      
      setNotifications(response.data || []);
      
      // Calculate unread count
      const unread = (response.data || []).filter(notif => !notif.is_read).length;
      setUnreadCount(unread);
      
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIXED: Mark notification as read using chatApi
  const markAsRead = async (notificationId) => {
    try {
      // ✅ Use chatApi instead of fetch
      const response = await chatApi.markChatAsRead(notificationId);
      
      if (response.data) {
        // Update local state
        setNotifications(prev => 
          prev.map(notif => 
            notif.id === notificationId ? { ...notif, is_read: true } : notif
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // ✅ FIXED: Mark all as read using chatApi
  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(notif => !notif.is_read);
      
      // Mark each unread notification as read
      for (const notif of unreadNotifications) {
        await chatApi.markChatAsRead(notif.id);
      }
      
      // Update local state
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, is_read: true }))
      );
      setUnreadCount(0);
      
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  // ✅ FIXED: Get unread chat notifications count
  // const fetchUnreadCount = async () => {
  //   const userId = getUserId();
  //   if (!userId) return;

  //   try {
  //     const response = await chatApi.getUnreadChatCount(userId);
  //     console.log('Unread count:', response.data);
  //     setUnreadCount(response.data?.count || 0);
  //   } catch (error) {
  //     console.error('Error fetching unread count:', error);
  //   }
  // };

  // ✅ FIXED: Get unread chat notifications
  const fetchUnreadChats = async () => {
    const userId = getUserId();
    if (!userId) return;

    try {
      const response = await chatApi.getUnreadChats(userId);
      console.log('Unread chats:', response.data);
      // You can use this for chat-specific notifications
    } catch (error) {
      console.error('Error fetching unread chats:', error);
    }
  };

  async function markAllNotificationsAsRead(userId) {
  try {
    const response = await chatAPI.markNotificationsAsRead(userId);
    
    if (response.data.success) {
      console.log('Notifications marked as read:', response.data.message);
      return {
        success: true,
        message: response.data.message,
        updatedCount: response.data.updated
      };
    }
    
    return {
      success: false,
      message: 'Failed to mark notifications as read'
    };
    
  } catch (error) {
    console.error('Error marking notifications as read:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Network error'
    };
  }
}


  // Toggle dropdown
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

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // ✅ Load initial unread count when component mounts
  useEffect(() => {
    // fetchUnreadCount();
  }, [profile]);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell Icon */}
      <button
        onClick={toggleDropdown}
        className="relative p-2 text-gray-600 hover:text-amber-600 transition-colors"
      >
        {/* Bell Icon */}
        <svg 
          className="w-6 h-6" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M15 17h5l-5 5v-5zM10.24 8.56a5.97 5.97 0 01-3.79 1.44 5.97 5.97 0 01-3.79-1.44M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
          />
        </svg>

        {/* Notification Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-amber-600 hover:text-amber-800 font-medium"
                >
                  Mark all as read
                </button>
              )}
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-500 mx-auto"></div>
                <p className="text-gray-500 mt-2">Loading notifications...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-6 text-center">
                <svg 
                  className="w-12 h-12 text-gray-300 mx-auto mb-3" 
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
                <p className="text-gray-500">No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                      !notification.is_read ? 'bg-amber-50' : ''
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 text-sm">
                          {notification.title || 'New Message'}
                        </h4>
                        <p className="text-gray-600 text-sm mt-1">
                          {notification.content || notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          {formatDate(notification.created_at)}
                        </p>
                      </div>
                      
                      {/* Unread indicator */}
                      {!notification.is_read && (
                        <div className="w-2 h-2 bg-amber-500 rounded-full ml-2 mt-1"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-gray-200 bg-gray-50 rounded-b-lg">
            <button
              onClick={fetchNotifications}
              className="w-full text-center text-sm text-amber-600 hover:text-amber-800 font-medium py-2"
            >
              Refresh Notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;














// import React, { useState, useEffect, useRef } from "react";
// // import { Link, useNavigate } from "react-router-dom";
// import { useUserProfile} from "../context/UseProfileContext";
// // import NotificationBell from "../notifybell/NotificationBell"
// import io from 'socket.io-client';
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
      
//       const userData = JSON.parse(localStorage.getItem('user') || '{}');
//       if (userData.id) return userData.id;
//       if (userData.user_id) return userData.user_id;
      
//       return null;
//     } catch (error) {
//       console.error('Error getting user ID:', error);
//       return null;
//     }
//   };

//   // Socket.IO connection
//   useEffect(() => {
//     const userId = getUserId();
//     if (!userId) {
//       console.log('No user ID found for notifications');
//       return;
//     }

//     const socket = io('https://backend-q0wc.onrender.com');
    
//     // Register user for real-time notifications
//     socket.emit('register_user', userId);
//     console.log('Registered user for notifications:', userId);

//     // Listen for new notifications
//     socket.on('new_notification', (notification) => {
//       console.log('New notification received:', notification);
//       setNotifications(prev => [notification, ...prev]);
//       setUnreadCount(prev => prev + 1);
//     });

//     return () => {
//       socket.disconnect();
//     };
//   }, [profile]);

//   // Fetch notifications from API
//   const fetchNotifications = async () => {
//     const userId = getUserId();
//     const token = localStorage.getItem('accessToken');
    
//     if (!userId || !token) {
//       console.error('User ID or token not found');
//       return;
//     }

//     try {
//       setLoading(true);
//       console.log('Fetching notifications for user:', userId);
      
//       const response = await fetch(`https://backend-q0wc.onrender.com/api/notifications/${userId}`, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });
      
//       console.log('Notifications response status:', response.status);
      
//       if (response.ok) {
//         const data = await response.json();
//         console.log('Notifications data:', data);
//         setNotifications(data);
        
//         // Calculate unread count
//         const unread = data.filter(notif => !notif.is_read).length;
//         setUnreadCount(unread);
//       } else {
//         console.error('Failed to fetch notifications:', response.status);
//       }
//     } catch (error) {
//       console.error('Error fetching notifications:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Mark notification as read
//   const markAsRead = async (notificationId) => {
//     const token = localStorage.getItem('accessToken');
    
//     if (!token) {
//       console.error('Token not found');
//       return;
//     }

//     try {
//       const response = await fetch(`https://backend-q0wc.onrender.com/api/notifications/read/${notificationId}`, {
//         method: 'PUT',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });
      
//       if (response.ok) {
//         // Update local state
//         setNotifications(prev => 
//           prev.map(notif => 
//             notif.id === notificationId ? { ...notif, is_read: true } : notif
//           )
//         );
//         setUnreadCount(prev => Math.max(0, prev - 1));
//       } else {
//         console.error('Failed to mark as read:', response.status);
//       }
//     } catch (error) {
//       console.error('Error marking notification as read:', error);
//     }
//   };

//   // Mark all as read
//   const markAllAsRead = async () => {
//     const token = localStorage.getItem('accessToken');
    
//     if (!token) {
//       console.error('Token not found');
//       return;
//     }

//     try {
//       const unreadNotifications = notifications.filter(notif => !notif.is_read);
      
//       for (const notif of unreadNotifications) {
//         await fetch(`https://backend-q0wc.onrender.com/api/notifications/read/${notif.id}`, {
//           method: 'PUT',
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         });
//       }
      
//       setNotifications(prev => 
//         prev.map(notif => ({ ...notif, is_read: true }))
//       );
//       setUnreadCount(0);
//     } catch (error) {
//       console.error('Error marking all as read:', error);
//     }
//   };

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

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   // Format date
//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-IN', {
//       day: 'numeric',
//       month: 'short',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   return (
//     <div className="relative" ref={dropdownRef}>
//       {/* Notification Bell Icon */}
//       <button
//         onClick={toggleDropdown}
//         className="relative p-2 text-gray-600 hover:text-amber-600 transition-colors"
//       >
//         {/* Bell Icon */}
//         <svg 
//           className="w-6 h-6" 
//           fill="none" 
//           stroke="currentColor" 
//           viewBox="0 0 24 24"
//         >
//           <path 
//             strokeLinecap="round" 
//             strokeLinejoin="round" 
//             strokeWidth={2} 
//             d="M15 17h5l-5 5v-5zM10.24 8.56a5.97 5.97 0 01-3.79 1.44 5.97 5.97 0 01-3.79-1.44M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
//           />
//         </svg>

//         {/* Notification Badge */}
//         {unreadCount > 0 && (
//           <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
//             {unreadCount > 9 ? '9+' : unreadCount}
//           </span>
//         )}
//       </button>

//       {/* Notification Dropdown */}
//       {showDropdown && (
//         <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
//           {/* Header */}
//           <div className="p-4 border-b border-gray-200">
//             <div className="flex justify-between items-center">
//               <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
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
//                       !notification.is_read ? 'bg-amber-50' : ''
//                     }`}
//                     onClick={() => markAsRead(notification.id)}
//                   >
//                     <div className="flex justify-between items-start">
//                       <div className="flex-1">
//                         <h4 className="font-semibold text-gray-800 text-sm">
//                           {notification.title}
//                         </h4>
//                         <p className="text-gray-600 text-sm mt-1">
//                           {notification.message}
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
