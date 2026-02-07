// // components/NotificationBell.jsx
// import React, { useState, useEffect, useRef } from "react";
// import { adminAPI } from "../services/adminApi";
// import { chatApi } from "../services/chatApi"; // ✅ चैट एपीआई
// import io from "socket.io-client";
// import { FaBell } from "react-icons/fa";

// const NotificationBell = () => {
//   const [notifications, setNotifications] = useState([]);
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const dropdownRef = useRef(null);

//   // Get current user ID
//   const getUserId = () => {
//     try {
//       // Try to get from localStorage
//       const userData = JSON.parse(localStorage.getItem("user") || "{}");
//       if (userData.id) return userData.id;
//       if (userData.user_id) return userData.user_id;
      
//       // Try admin data
//       const adminData = JSON.parse(localStorage.getItem("adminData") || "{}");
//       if (adminData.id) return adminData.id;
      
//       return null;
//     } catch (error) {
//       console.error("Error getting user ID:", error);
//       return null;
//     }
//   };

//   // Socket.IO connection
//   useEffect(() => {
//     const userId = getUserId();
    
//     if (!userId) {
//       console.log("No user ID found for socket connection");
//       return;
//     }

//     const socket = io("https://backend-q0wc.onrender.com", {
//       transports: ['websocket', 'polling']
//     });

//     // Register user for real-time notifications
//     socket.emit("register_user", userId);
//     console.log("Socket registered for user:", userId);

//     // Listen for new notifications
//     socket.on("new_notification", (notification) => {
//       console.log("🔔 New notification via socket:", notification);
//       setNotifications(prev => [notification, ...prev]);
//       setUnreadCount(prev => prev + 1);
//     });

//     // Connection events for debugging
//     socket.on("connect", () => {
//       console.log("✅ Socket connected:", socket.id);
//     });

//     socket.on("connect_error", (error) => {
//       console.error("🔌 Socket connection error:", error);
//     });

//     return () => {
//       socket.disconnect();
//       console.log("🔌 Socket disconnected");
//     };
//   }, []);

//   // ✅ FETCH FROM BOTH APIS
//   const fetchNotifications = async () => {
//     try {
//       setLoading(true);
//       const userId = getUserId();
      
//       if (!userId) {
//         console.error("❌ No user ID found");
//         return;
//       }

//       console.log("📡 Fetching notifications for user:", userId);

//       // 1️⃣ Fetch from admin API (admin notifications)
//       let adminNotifications = [];
//       try {
//         const adminResponse = await adminAPI.getUserNotifications(userId);
//         console.log("👨‍💼 Admin API response:", adminResponse.data);
        
//         // Transform admin notifications
//         if (adminResponse.data && Array.isArray(adminResponse.data)) {
//           adminNotifications = adminResponse.data.map(notif => ({
//             ...notif,
//             source: 'admin', // Mark as from admin
//             type: notif.type || 'admin_notification'
//           }));
//         }
//       } catch (adminError) {
//         console.warn("⚠️ Admin API error (may be normal for non-admin users):", adminError.message);
//       }

//       // 2️⃣ Fetch from chat API (user messages/reactions)
//       let chatNotifications = [];
//       try {
//         const chatResponse = await chatApi.getUserNotifications(userId);
//         console.log("💬 Chat API response:", chatResponse.data);
        
//         // Transform chat notifications
//         if (chatResponse.data && Array.isArray(chatResponse.data)) {
//           chatNotifications = chatResponse.data.map(notif => ({
//             ...notif,
//             source: 'chat', // Mark as from chat
//             type: notif.type || 'message'
//           }));
//         } else if (chatResponse.data && chatResponse.data.messages) {
//           // If response has messages array
//           chatNotifications = chatResponse.data.messages.map(notif => ({
//             ...notif,
//             source: 'chat',
//             type: 'message'
//           }));
//         }
//       } catch (chatError) {
//         console.error("❌ Chat API error:", chatError);
//       }

//       // Combine all notifications
//       const allNotifications = [...adminNotifications, ...chatNotifications];
      
//       // Sort by date (newest first)
//       const sortedNotifications = allNotifications.sort((a, b) => 
//         new Date(b.created_at) - new Date(a.created_at)
//       );

//       console.log("✅ Combined notifications:", sortedNotifications);
//       setNotifications(sortedNotifications);

//       // Calculate unread count
//       const unread = sortedNotifications.filter(notif => !notif.is_read).length;
//       console.log("📊 Unread count:", unread);
//       setUnreadCount(unread);

//     } catch (error) {
//       console.error("❌ Error fetching notifications:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ MARK AS READ - USE CORRECT API BASED ON SOURCE
//   const markAsRead = async (notification) => {
//     try {
//       console.log("📝 Marking as read:", notification);
      
//       if (notification.source === 'admin') {
//         // Use admin API
//         await adminAPI.markNotificationAsRead(notification.id);
//       } else {
//         // Use chat API (default)
//         await chatApi.markNotificationAsRead(notification.id);
//       }

//       // Update local state
//       setNotifications(prev =>
//         prev.map(notif =>
//           notif.id === notification.id ? { ...notif, is_read: true } : notif
//         )
//       );
//       setUnreadCount(prev => Math.max(0, prev - 1));

//     } catch (error) {
//       console.error("❌ Error marking notification as read:", error);
//     }
//   };

//   // ✅ MARK ALL AS READ
//   const markAllAsRead = async () => {
//     try {
//       const unreadNotifications = notifications.filter(notif => !notif.is_read);
      
//       for (const notif of unreadNotifications) {
//         if (notif.source === 'admin') {
//           await adminAPI.markNotificationAsRead(notif.id);
//         } else {
//           await chatApi.markNotificationAsRead(notif.id);
//         }
//       }

//       // Update all to read
//       setNotifications(prev =>
//         prev.map(notif => ({ ...notif, is_read: true }))
//       );
//       setUnreadCount(0);
      
//       console.log("✅ All notifications marked as read");
      
//     } catch (error) {
//       console.error("❌ Error marking all as read:", error);
//     }
//   };

//   // ✅ TOGGLE DROPDOWN
//   const toggleDropdown = () => {
//     if (!showDropdown) {
//       fetchNotifications();
//     }
//     setShowDropdown(!showDropdown);
//   };

//   // ✅ CLOSE ON CLICK OUTSIDE
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

//   // ✅ FORMAT DATE
//   const formatDate = (dateString) => {
//     if (!dateString) return "Just now";
    
//     try {
//       const date = new Date(dateString);
//       const now = new Date();
//       const diffMs = now - date;
//       const diffMins = Math.floor(diffMs / 60000);

//       if (diffMins < 1) return "Just now";
//       if (diffMins < 60) return `${diffMins}m ago`;
//       if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
      
//       return date.toLocaleDateString("en-IN", {
//         day: "numeric",
//         month: "short"
//       });
//     } catch (error) {
//       return dateString;
//     }
//   };

//   // ✅ GET ICON BY TYPE
//   const getNotificationIcon = (type, source) => {
//     if (source === 'admin') {
//       return (
//         <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
//           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
//           </svg>
//         </div>
//       );
//     }
    
//     switch(type) {
//       case 'message':
//         return (
//           <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
//             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
//             </svg>
//           </div>
//         );
//       case 'reaction':
//         return (
//           <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
//             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
//             </svg>
//           </div>
//         );
//       default:
//         return (
//           <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center">
//             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//             </svg>
//           </div>
//         );
//     }
//   };

//   return (
//     <div className="relative" ref={dropdownRef}>
//       {/* 🔔 NOTIFICATION BELL */}
//       <button
//         onClick={toggleDropdown}
//         className="relative p-2 text-gray-600 hover:text-amber-600 transition-colors"
//         aria-label="Notifications"
//       >
//         <FaBell className="w-6 h-6" />
        
//         {/* UNREAD BADGE */}
//         {unreadCount > 0 && (
//           <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
//             {unreadCount > 9 ? "9+" : unreadCount}
//           </span>
//         )}
//       </button>

//       {/* 📋 DROPDOWN */}
//       {showDropdown && (
//         <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
//           {/* HEADER */}
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

//           {/* NOTIFICATIONS LIST */}
//           <div className="max-h-96 overflow-y-auto">
//             {loading ? (
//               <div className="p-8 text-center">
//                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto"></div>
//                 <p className="text-gray-500 mt-2">Loading notifications...</p>
//               </div>
//             ) : notifications.length === 0 ? (
//               <div className="p-8 text-center">
//                 <div className="text-gray-300 text-4xl mb-3">🔔</div>
//                 <p className="text-gray-500">No notifications yet</p>
//                 <p className="text-gray-400 text-sm mt-1">When you get notifications, they'll appear here</p>
//               </div>
//             ) : (
//               <div className="divide-y divide-gray-100">
//                 {notifications.map((notification) => (
//                   <div
//                     key={notification.id}
//                     className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
//                       !notification.is_read ? "bg-blue-50" : ""
//                     }`}
//                     onClick={() => markAsRead(notification)}
//                   >
//                     <div className="flex items-start gap-3">
//                       {/* ICON */}
//                       {getNotificationIcon(notification.type, notification.source)}
                      
//                       {/* CONTENT */}
//                       <div className="flex-1">
//                         <div className="flex justify-between">
//                           <h4 className="font-semibold text-gray-800 text-sm">
//                             {notification.title || 
//                               (notification.source === 'admin' ? 'Admin Notification' : 'New Message')}
//                           </h4>
//                           {!notification.is_read && (
//                             <span className="w-2 h-2 bg-blue-500 rounded-full mt-1"></span>
//                           )}
//                         </div>
                        
//                         <p className="text-gray-600 text-sm mt-1">
//                           {notification.message || notification.content}
//                         </p>
                        
//                         {/* SOURCE BADGE */}
//                         <div className="flex items-center justify-between mt-2">
//                           <span className={`text-xs px-2 py-0.5 rounded-full ${
//                             notification.source === 'admin' 
//                               ? 'bg-purple-100 text-purple-600' 
//                               : 'bg-blue-100 text-blue-600'
//                           }`}>
//                             {notification.source === 'admin' ? 'Admin' : 'Chat'}
//                           </span>
                          
//                           <p className="text-xs text-gray-400">
//                             {formatDate(notification.created_at)}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* FOOTER */}
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














// // // components/NotificationBell.jsx
// // import React, { useState, useEffect, useRef } from "react";
// // import { adminAPI } from "../services/adminApi";
// // import { chatApi} from  "../services/chatApi"
// // // import io from "socket.io-client";

// // //this file is not working right now
// // const Notification = () => {
// //   const [notifications, setNotifications] = useState([]);
// //   const [showDropdown, setShowDropdown] = useState(false);
// //   const [loading, setLoading] = useState(false);
// //   const [unreadCount, setUnreadCount] = useState(0);
// //   const dropdownRef = useRef(null);

// //   // Socket.IO connection
// //   useEffect(() => {
// //     const socket = io("https://backend-q0wc.onrender.com");

// //     // Register user for real-time notifications
// //     const userId = localStorage.getItem("userId"); // Adjust based on your auth
// //     if (userId) {
// //       socket.emit("register_user", userId);
// //     }

// //     // Listen for new notifications
// //     socket.on("new_notification", (notification) => {
// //       setNotifications((prev) => [notification, ...prev]);
// //       setUnreadCount((prev) => prev + 1);
// //     });

// //     return () => {
// //       socket.disconnect();
// //     };
// //   }, []);

// //   // Fetch notifications from API
// //   const fetchNotifications = async () => {
// //     try {
// //       setLoading(true);
// //       const userId = localStorage.getItem("userId"); // Adjust based on your auth
// //       const response = await adminAPI.getUserNotifications(userId);
// //       setNotifications(response.data);

// //       // Calculate unread count
// //       const unread = response.data.filter((notif) => !notif.is_read).length;
// //       setUnreadCount(unread);
// //     } catch (error) {
// //       console.error("Error fetching notifications:", error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // Mark notification as read
// //   const markAsRead = async (notificationId) => {
// //     try {
// //       await adminAPI.markNotificationAsRead(notificationId);

// //       // Update local state
// //       setNotifications((prev) =>
// //         prev.map((notif) =>
// //           notif.id === notificationId ? { ...notif, is_read: true } : notif
// //         )
// //       );
// //       setUnreadCount((prev) => Math.max(0, prev - 1));
// //     } catch (error) {
// //       console.error("Error marking notification as read:", error);
// //     }
// //   };

// //   // Mark all as read
// //   const markAllAsRead = async () => {
// //     try {
// //       const unreadNotifications = notifications.filter(
// //         (notif) => !notif.is_read
// //       );

// //       for (const notif of unreadNotifications) {
// //         await adminAPI.markNotificationAsRead(notif.id);
// //       }

// //       setNotifications((prev) =>
// //         prev.map((notif) => ({ ...notif, is_read: true }))
// //       );
// //       setUnreadCount(0);
// //     } catch (error) {
// //       console.error("Error marking all as read:", error);
// //     }
// //   };

// //   // Toggle dropdown
// //   const toggleDropdown = () => {
// //     if (!showDropdown) {
// //       fetchNotifications();
// //     }
// //     setShowDropdown(!showDropdown);
// //   };

// //   // Close dropdown when clicking outside
// //   useEffect(() => {
// //     const handleClickOutside = (event) => {
// //       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
// //         setShowDropdown(false);
// //       }
// //     };

// //     document.addEventListener("mousedown", handleClickOutside);
// //     return () => {
// //       document.removeEventListener("mousedown", handleClickOutside);
// //     };
// //   }, []);

// //   // Format date
// //   const formatDate = (dateString) => {
// //     return new Date(dateString).toLocaleDateString("en-IN", {
// //       day: "numeric",
// //       month: "short",
// //       hour: "2-digit",
// //       minute: "2-digit",
// //     });
// //   };

// //   return (
// //     <div className="relative" ref={dropdownRef}>
// //       {/* Notification Bell Icon */}
// //       <button
// //         onClick={toggleDropdown}
// //         className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors"
// //       >
// //         {/* Bell Icon */}
// //         <svg
// //           className="w-6 h-6"
// //           fill="none"
// //           stroke="currentColor"
// //           viewBox="0 0 24 24"
// //         >
// //           <path
// //             strokeLinecap="round"
// //             strokeLinejoin="round"
// //             strokeWidth={2}
// //             d="M15 17h5l-5 5v-5zM10.24 8.56a5.97 5.97 0 01-3.79 1.44 5.97 5.97 0 01-3.79-1.44M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
// //           />
// //         </svg>

// //         {/* Notification Badge */}
// //         {unreadCount > 0 && (
// //           <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
// //             {unreadCount > 9 ? "9+" : unreadCount}
// //           </span>
// //         )}
// //       </button>

// //       {/* Notification Dropdown */}
// //       {showDropdown && (
// //         <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
// //           {/* Header */}
// //           <div className="p-4 border-b border-gray-200">
// //             <div className="flex justify-between items-center">
// //               <h3 className="text-lg font-semibold text-gray-800">
// //                 Notifications
// //               </h3>
// //               {unreadCount > 0 && (
// //                 <button
// //                   onClick={markAllAsRead}
// //                   className="text-sm text-blue-600 hover:text-blue-800 font-medium"
// //                 >
// //                   Mark all as read
// //                 </button>
// //               )}
// //             </div>
// //           </div>

// //           {/* Notifications List */}
// //           <div className="max-h-96 overflow-y-auto">
// //             {loading ? (
// //               <div className="p-4 text-center">
// //                 <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
// //                 <p className="text-gray-500 mt-2">Loading notifications...</p>
// //               </div>
// //             ) : notifications.length === 0 ? (
// //               <div className="p-6 text-center">
// //                 <svg
// //                   className="w-12 h-12 text-gray-300 mx-auto mb-3"
// //                   fill="none"
// //                   stroke="currentColor"
// //                   viewBox="0 0 24 24"
// //                 >
// //                   <path
// //                     strokeLinecap="round"
// //                     strokeLinejoin="round"
// //                     strokeWidth={1}
// //                     d="M15 17h5l-5 5v-5zM10.24 8.56a5.97 5.97 0 01-3.79 1.44 5.97 5.97 0 01-3.79-1.44M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
// //                   />
// //                 </svg>
// //                 <p className="text-gray-500">No notifications yet</p>
// //               </div>
// //             ) : (
// //               <div className="divide-y divide-gray-100">
// //                 {notifications.map((notification) => (
// //                   <div
// //                     key={notification.id}
// //                     className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
// //                       !notification.is_read ? "bg-blue-50" : ""
// //                     }`}
// //                     onClick={() => markAsRead(notification.id)}
// //                   >
// //                     <div className="flex justify-between items-start">
// //                       <div className="flex-1">
// //                         <h4 className="font-semibold text-gray-800 text-sm">
// //                           {notification.title}
// //                         </h4>
// //                         <p className="text-gray-600 text-sm mt-1">
// //                           {notification.message}
// //                         </p>
// //                         <p className="text-xs text-gray-400 mt-2">
// //                           {formatDate(notification.created_at)}
// //                         </p>
// //                       </div>

// //                       {/* Unread indicator */}
// //                       {!notification.is_read && (
// //                         <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 mt-1"></div>
// //                       )}
// //                     </div>
// //                   </div>
// //                 ))}
// //               </div>
// //             )}
// //           </div>

// //           {/* Footer */}
// //           <div className="p-3 border-t border-gray-200 bg-gray-50 rounded-b-lg">
// //             <button
// //               onClick={fetchNotifications}
// //               className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium py-2"
// //             >
// //               View All messages
// //             </button>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default Notification;
