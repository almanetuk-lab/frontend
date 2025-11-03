// src/components/home/Header.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserProfile} from "../context/UseProfileContext";
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

  // Fetch notifications from API
  const fetchNotifications = async () => {
    const userId = getUserId();
    const token = localStorage.getItem('accessToken');
    
    if (!userId || !token) {
      console.error('User ID or token not found');
      return;
    }

    try {
      setLoading(true);
      console.log('Fetching notifications for user:', userId);
      
      const response = await fetch(`https://backend-q0wc.onrender.com/api/notifications/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Notifications response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Notifications data:', data);
        setNotifications(data);
        
        // Calculate unread count
        const unread = data.filter(notif => !notif.is_read).length;
        setUnreadCount(unread);
      } else {
        console.error('Failed to fetch notifications:', response.status);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    const token = localStorage.getItem('accessToken');
    
    if (!token) {
      console.error('Token not found');
      return;
    }

    try {
      const response = await fetch(`https://backend-q0wc.onrender.com/api/notifications/read/${notificationId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        // Update local state
        setNotifications(prev => 
          prev.map(notif => 
            notif.id === notificationId ? { ...notif, is_read: true } : notif
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      } else {
        console.error('Failed to mark as read:', response.status);
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    const token = localStorage.getItem('accessToken');
    
    if (!token) {
      console.error('Token not found');
      return;
    }

    try {
      const unreadNotifications = notifications.filter(notif => !notif.is_read);
      
      for (const notif of unreadNotifications) {
        await fetch(`https://backend-q0wc.onrender.com/api/notifications/read/${notif.id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }
      
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, is_read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

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
                          {notification.title}
                        </h4>
                        <p className="text-gray-600 text-sm mt-1">
                          {notification.message}
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

// Main Header Component
function Header() {
  const navigate = useNavigate();
  const { profile, clearProfile } = useUserProfile();

  // ✅ FIXED: Proper login status check
  const checkLoginStatus = () => {
    const userToken = localStorage.getItem("accessToken");
    const adminToken = localStorage.getItem("adminToken");
    
    // Return true if either user or admin is logged in
    return !!(userToken || adminToken);
  };

  const isLoggedIn = checkLoginStatus();

  // ✅ FIXED: Proper logout function
  const handleLogout = () => {
    // Clear all tokens
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminData");
    localStorage.removeItem("user");
    
    // Clear profile context
    clearProfile();
    
    // ✅ Redirect to HOME page
    window.location.href = '/#/';
  };

  return (
    <header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row justify-between items-center py-4 gap-4">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-amber-600">
               Mingle <span className="text-gray-800">Hub</span>
            </h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1">
            <ul className="flex flex-wrap justify-center gap-6 lg:gap-8">
              <li>
                <Link
                  to="/"
                  className="text-gray-600 hover:text-amber-600 font-medium transition-colors duration-200"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-gray-600 hover:text-amber-600 font-medium transition-colors duration-200"
                >
                  About
                </Link>
              </li>
              
              {/* ✅ FIXED: Show these only when user is logged in */}
              {isLoggedIn ? (
                <>
                  <li>
                    <Link
                      to="/dashboard"
                      className="text-gray-600 hover:text-amber-600 font-medium transition-colors duration-200"
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/members"
                      className="text-amber-600 font-medium border-amber-600 transition-colors duration-200"
                    >
                      Members
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/edit-profile"
                      className="text-gray-600 hover:text-amber-600 font-medium transition-colors duration-200"
                    >
                      Edit Profile
                    </Link>
                  </li>
                </>
              ) : (
                // Show nothing extra when not logged in
                null
              )}
              
              <li>
                <Link
                  to="/contact"
                  className="text-gray-600 hover:text-amber-600 font-medium transition-colors duration-200"
                >
                  Contact Us
                </Link>
              </li>
                  
              <li>
                <Link
                  to="/"
                  className="text-gray-600 hover:text-amber-600 font-medium transition-colors duration-200"
                >
                  Blogs
                </Link>
              </li>
            </ul>
          </nav>

          {/* Auth Section */}
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <>
                {/* Show notification bell only if user token exists (not admin) */}
                {localStorage.getItem("accessToken") && <NotificationBell />}
                
                {/* User Welcome */}
                <div className="hidden md:flex items-center gap-2 text-gray-700">
                  <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                    <span className="text-amber-600 font-semibold text-sm">
                      {profile?.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <span className="text-sm">
                    {localStorage.getItem("adminToken") ? "Welcome, Admin" : `Welcome, ${profile?.name?.split(' ')[0] || 'User'}`}
                  </span>
                </div>
                
                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="bg-amber-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-amber-700 transition-all duration-200 transform hover:-translate-y-0.5 shadow-md hover:shadow-lg"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                {/* Auth Buttons - Show when NOT logged in */}
                <Link
                  to="/admin-login"
                  className="text-gray-700 hover:text-amber-600 font-medium transition-colors duration-200 px-3 py-1"
                >
                 Admin Login
                </Link>

                <Link
                  to="/login"
                  className="text-gray-700 hover:text-amber-600 font-medium transition-colors duration-200 px-3 py-1"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-amber-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-amber-700 transition-all duration-200 transform hover:-translate-y-0.5 shadow-md hover:shadow-lg"
                >
                  Register Free
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Button */}
      <div className="lg:hidden flex justify-center pb-2">
        <div className="flex items-center gap-4 text-sm text-gray-600">
          {isLoggedIn && (
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-pink-100 rounded-full flex items-center justify-center">
                <span className="text-amber-600 font-semibold text-xs">
                  {profile?.name?.charAt(0) || 'U'}
                </span>
              </div>
              <span>
                {localStorage.getItem("adminToken") ? "Hi, Admin" : `Hi, ${profile?.name?.split(' ')[0] || 'User'}`}
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;













// -----------------------------------------------------//
// todays 
// // src/components/home/Header.jsx
// import React, { useState, useEffect, useRef } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useUserProfile} from "../context/UseProfileContext";
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

// // Main Header Component
// function Header() {
//   const navigate = useNavigate();
//   const { profile, clearProfile } = useUserProfile();

//   const isLoggedIn = !!profile?.email;

//   const handleLogout = () => {
//     localStorage.removeItem("accessToken");
//     localStorage.removeItem("refreshToken");
//     localStorage.removeItem("user");
//     clearProfile();
//     navigate("/");
//   };


//   return (
//     <header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
//       <div className="container mx-auto px-6">
//         <div className="flex flex-col lg:flex-row justify-between items-center py-4 gap-4">
//           {/* Logo */}
//           <div className="flex items-center">
//             <h1 className="text-2xl font-bold text-amber-600">
//                Mingle <span className="text-gray-800">Hub</span>
//             </h1>
//           </div>

//           {/* Navigation */}
//           <nav className="flex-1">
//             <ul className="flex flex-wrap justify-center gap-6 lg:gap-8">
//               <li>
//                 <Link
//                   to="/"
//                   className="text-gray-600  hover:text-amber-600 font-medium transition-colors duration-200"
//                 >
//                   Home
//                 </Link>
//               </li>
//                   <li>
//                 <Link
//                   to="/"
//                   className="text-gray-600  hover:text-amber-600 font-medium transition-colors duration-200"
//                 >
//                   About
//                 </Link>
//               </li>
//               {isLoggedIn && (
//                 <>
//                   <li>
//                     <Link
//                       to="/dashboard"
//                       className="text-gray-600 hover:text-amber-600 font-medium transition-colors duration-200"
//                     >
//                       Dashboard
//                     </Link>
//                   </li>
//                   <li>
//                     <Link
//                       to="/members"
//                       className="text-amber-600 font-medium  border-amber-600  transition-colors duration-200"
//                     >
//                       Members
//                     </Link>
//                   </li>
//                   <li>
//                     <Link
//                       to="edit-profile"
//                       className="text-gray-600  hover:text-amber-600 font-medium transition-colors duration-200"
//                     >
//                       Edit Profile
//                     </Link>
//                   </li>
              
//                 </>
//               )}
//               <li>
//                 <Link
//                   to="/Contact"
//                   className="text-gray-600 hover:text-amber-600 font-medium transition-colors duration-200"
//                 >
//                   Contact Us
//                 </Link>
//               </li>
//             </ul>
//           </nav>

//           {/* Auth Section */}
//           <div className="flex items-center gap-4">
//             {isLoggedIn ? (
//               <>
//                 {/* Notification Bell */}
//                 <NotificationBell />
                
//                 {/* User Welcome */}
//                 <div className="hidden md:flex items-center gap-2 text-gray-700">
//                   <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
//                     <span className="text-amber-600 font-semibold text-sm">
//                       {profile?.name?.charAt(0) || 'U'}
//                     </span>
//                   </div>
//                   <span className="text-sm">Welcome, {profile?.name?.split(' ')[0] || 'User'}</span>
//                 </div>
                
//                 {/* Logout Button */}
//                 <button
//                   onClick={handleLogout}
//                   className="bg-amber-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-amber-700 transition-all duration-200 transform hover:-translate-y-0.5 shadow-md hover:shadow-lg"
//                 >
//                   Logout
//                 </button>
//               </>
//             ) : (
//               <div className="flex items-center gap-3">
//                 {/* Auth Buttons */}
//                 <Link
//                   to="/admin-login"
//                   className="text-gray-700  hover:text-amber-600 font-medium transition-colors duration-200 px-3 py-1"
//                 >
//                  Admin Login
//                 </Link>

//                 <Link
//                   to="/login"
//                   className="text-gray-700  hover:text-amber-600 font-medium transition-colors duration-200 px-3 py-1"
//                 >
//                   Login
//                 </Link>
//                 <Link
//                   to="/register"
//                   className="bg-amber-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-amber-700 transition-all duration-200 transform hover:-translate-y-0.5 shadow-md hover:shadow-lg"
//                 >
//                   Register Free
//                 </Link>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Mobile Menu Button (Optional) */}
//       <div className="lg:hidden flex justify-center pb-2">
//         <div className="flex items-center gap-4 text-sm text-gray-600">
//           {isLoggedIn && (
//             <div className="flex items-center gap-2">
//               <div className="w-6 h-6 bg-pink-100 rounded-full flex items-center justify-center">
//                 <span className="text-amber-600 font-semibold text-xs">
//                   {profile?.name?.charAt(0) || 'U'}
//                 </span>
//               </div>
//               <span>Hi, {profile?.name?.split(' ')[0] || 'User'}</span>
//             </div>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// }

// export default Header;









// // src/components/Header.jsx
// import React, { useState, useEffect, useRef } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useUserProfile } from "../context/UseProfileContext";
// import io from 'socket.io-client';

// // Notification Bell Component
// const NotificationBell = () => {
//   const [notifications, setNotifications] = useState([]);
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const dropdownRef = useRef(null);

//   // Socket.IO connection
//   useEffect(() => {
//     const socket = io('https://backend-q0wc.onrender.com');
    
//     // Register user for real-time notifications
//     const userId = localStorage.getItem('userId') || JSON.parse(localStorage.getItem('user'))?.id;
//     if (userId) {
//       socket.emit('register_user', userId);
//     }

//     // Listen for new notifications
//     socket.on('new_notification', (notification) => {
//       setNotifications(prev => [notification, ...prev]);
//       setUnreadCount(prev => prev + 1);
//     });

//     return () => {
//       socket.disconnect();
//     };
//   }, []);

//   // Fetch notifications from API
//   const fetchNotifications = async () => {
//     try {
//       setLoading(true);
//       const userId = localStorage.getItem('userId') || JSON.parse(localStorage.getItem('user'))?.id;
//       const response = await fetch(`https://backend-q0wc.onrender.com/api/notifications/${userId}`, {
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
//         }
//       });
      
//       if (response.ok) {
//         const data = await response.json();
//         setNotifications(data);
        
//         // Calculate unread count
//         const unread = data.filter(notif => !notif.is_read).length;
//         setUnreadCount(unread);
//       }
//     } catch (error) {
//       console.error('Error fetching notifications:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Mark notification as read
//   const markAsRead = async (notificationId) => {
//     try {
//       await fetch(`https://backend-q0wc.onrender.com/api/notifications/read/${notificationId}`, {
//         method: 'PUT',
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
//         }
//       });
      
//       // Update local state
//       setNotifications(prev => 
//         prev.map(notif => 
//           notif.id === notificationId ? { ...notif, is_read: true } : notif
//         )
//       );
//       setUnreadCount(prev => Math.max(0, prev - 1));
//     } catch (error) {
//       console.error('Error marking notification as read:', error);
//     }
//   };

//   // Mark all as read
//   const markAllAsRead = async () => {
//     try {
//       const unreadNotifications = notifications.filter(notif => !notif.is_read);
      
//       for (const notif of unreadNotifications) {
//         await fetch(`https://backend-q0wc.onrender.com/api/notifications/read/${notif.id}`, {
//           method: 'PUT',
//           headers: {
//             'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
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
//               View All Notifications
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// // Main Header Component
// export default function Header() {
//   const navigate = useNavigate();
//   const { profile, clearProfile } = useUserProfile();

//   const isLoggedIn = !!profile?.email;

//   const handleLogout = () => {
//     localStorage.removeItem("accessToken");
//     localStorage.removeItem("refreshToken");
//     localStorage.removeItem("user");
//     clearProfile();
//     navigate("/login");
//   };

//   return (
//     <header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
//       <div className="container mx-auto px-6">
//         <div className="flex flex-col lg:flex-row justify-between items-center py-4 gap-4">
//           {/* Logo */}
//           <div className="flex items-center">
//             <h1 className="text-2xl font-bold text-amber-600">
//                Mingle <span className="text-gray-800">Hub</span>
//             </h1>
//           </div>

//           {/* Navigation */}
//           <nav className="flex-1">
//             <ul className="flex flex-wrap justify-center gap-6 lg:gap-8">
//               <li>
//                 <Link
//                   to="/"
//                   className="text-gray-600  hover:text-amber-600 font-medium transition-colors duration-200"
//                 >
//                   Home
//                 </Link>
//               </li>
//                   <li>
//                 <Link
//                   to="/"
//                   className="text-gray-600  hover:text-amber-600 font-medium transition-colors duration-200"
//                 >
//                   About
//                 </Link>
//               </li>
//               {isLoggedIn && (
//                 <>
//                   <li>
//                     <Link
//                       to="/dashboard"
//                       className="text-gray-600 hover:text-amber-600 font-medium transition-colors duration-200"
//                     >
//                       Dashboard
//                     </Link>
//                   </li>
//                   <li>
//                     <Link
//                       to="/members"
//                       className="text-amber-600 font-medium  border-amber-600  transition-colors duration-200"
//                     >
//                       Members
//                     </Link>
//                   </li>
//                   <li>
//                     <Link
//                       to="edit-profile"
//                       className="text-gray-600  hover:text-amber-600 font-medium transition-colors duration-200"
//                     >
//                       Edit Profile
//                     </Link>
//                   </li>
              
//                 </>
//               )}
//               <li>
//                 <Link
//                   to="/Contact"
//                   className="text-gray-600 hover:text-amber-600 font-medium transition-colors duration-200"
//                 >
//                   Contact Us
//                 </Link>
//               </li>
//             </ul>
//           </nav>

//           {/* Auth Section */}
//           <div className="flex items-center gap-4">
//             {isLoggedIn ? (
//               <>
//                 {/* Notification Bell */}
//                 <NotificationBell />
                
//                 {/* User Welcome */}
//                 <div className="hidden md:flex items-center gap-2 text-gray-700">
//                   <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
//                     <span className="text-amber-600 font-semibold text-sm">
//                       {profile?.name?.charAt(0) || 'U'}
//                     </span>
//                   </div>
//                   <span className="text-sm">Welcome, {profile?.name?.split(' ')[0] || 'User'}</span>
//                 </div>
                
//                 {/* Logout Button */}
//                 <button
//                   onClick={handleLogout}
//                   className="bg-amber-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-amber-700 transition-all duration-200 transform hover:-translate-y-0.5 shadow-md hover:shadow-lg"
//                 >
//                   Logout
//                 </button>
//               </>
//             ) : (
//               <div className="flex items-center gap-3">
//                 {/* Auth Buttons */}
//                 <Link
//                   to="/admin-Login"
//                   className="text-gray-700  hover:text-amber-600 font-medium transition-colors duration-200 px-3 py-1"
//                 >
//                  Admin Login
//                 </Link>

//                 <Link
//                   to="/login"
//                   className="text-gray-700  hover:text-amber-600 font-medium transition-colors duration-200 px-3 py-1"
//                 >
//                   Login
//                 </Link>
//                 <Link
//                   to="/register"
//                   className="bg-amber-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-amber-700 transition-all duration-200 transform hover:-translate-y-0.5 shadow-md hover:shadow-lg"
//                 >
//                   Register Free
//                 </Link>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Mobile Menu Button (Optional) */}
//       <div className="lg:hidden flex justify-center pb-2">
//         <div className="flex items-center gap-4 text-sm text-gray-600">
//           {isLoggedIn && (
//             <div className="flex items-center gap-2">
//               <div className="w-6 h-6 bg-pink-100 rounded-full flex items-center justify-center">
//                 <span className="text-amber-600 font-semibold text-xs">
//                   {profile?.name?.charAt(0) || 'U'}
//                 </span>
//               </div>
//               <span>Hi, {profile?.name?.split(' ')[0] || 'User'}</span>
//             </div>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// }


















// // // src/components/Header.jsx
// // import React from "react";
// // import { Link, useNavigate } from "react-router-dom";
// // import { useUserProfile } from "../context/UseProfileContext";

// // export default function Header() {
// //   const navigate = useNavigate();
// //   const { profile, clearProfile } = useUserProfile();

// //   const isLoggedIn = !!profile?.email;

// //   const handleLogout = () => {
// //     localStorage.removeItem("accessToken");
// //     localStorage.removeItem("refreshToken");
// //     localStorage.removeItem("user");
// //     clearProfile();
// //     navigate("/login");
// //   };

// //   return (
// //     <header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
// //       <div className="container mx-auto px-6">
// //         <div className="flex flex-col lg:flex-row justify-between items-center py-4 gap-4">
// //           {/* Logo */}
// //           <div className="flex items-center">
// //             <h1 className="text-2xl font-bold text-amber-600">
// //                Mingle <span className="text-gray-800">Hub</span>
// //             </h1>
// //           </div>

// //           {/* Navigation */}
// //           <nav className="flex-1">
// //             <ul className="flex flex-wrap justify-center gap-6 lg:gap-8">
// //               <li>
// //                 <Link
// //                   to="/"
// //                   className="text-gray-600  hover:text-amber-600 font-medium transition-colors duration-200"
// //                 >
// //                   Home
// //                 </Link>
// //               </li>
// //                   <li>
// //                 <Link
// //                   to="/"
// //                   className="text-gray-600  hover:text-amber-600 font-medium transition-colors duration-200"
// //                 >
// //                   About
// //                 </Link>
// //               </li>
// //               {isLoggedIn && (
// //                 <>
// //                   <li>
// //                     <Link
// //                       to="/dashboard"
// //                       className="text-gray-600 hover:text-amber-600 font-medium transition-colors duration-200"
// //                     >
// //                       Dashboard
// //                     </Link>
// //                   </li>
// //                   <li>
// //                     <Link
// //                       to="/members"
// //                       className="text-amber-600 font-medium  border-amber-600  transition-colors duration-200"
// //                     >
// //                       Members
// //                     </Link>
// //                   </li>
// //                   <li>
// //                     <Link
// //                       to="edit-profile"
// //                       className="text-gray-600  hover:text-amber-600font-medium transition-colors duration-200"
// //                     >
// //                       Edit Profile
// //                     </Link>
// //                   </li>
              
// //                 </>
// //               )}
// //               <li>
// //                 <Link
// //                   to="/Contact"
// //                   className="text-gray-600 hover:text-amber-600 font-medium transition-colors duration-200"
// //                 >
// //                   Contact Us
// //                 </Link>
// //               </li>
// //             </ul>
// //           </nav>

// //           {/* Auth Section */}
// //           <div className="flex items-center gap-4">
// //             {isLoggedIn ? (
// //               <>
// //                 {/* User Welcome */}
// //                 <div className="hidden md:flex items-center gap-2 text-gray-700">
// //                   <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
// //                     <span className="text-amber-600 font-semibold text-sm">
// //                       {profile?.name?.charAt(0) || 'U'}
// //                     </span>
// //                   </div>
// //                   <span className="text-sm">Welcome, {profile?.name?.split(' ')[0] || 'User'}</span>
// //                 </div>
                
// //                 {/* Logout Button */}
// //                 <button
// //                   onClick={handleLogout}
// //                   className="bg-amber-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-amber-700 transition-all duration-200 transform hover:-translate-y-0.5 shadow-md hover:shadow-lg"
// //                 >
// //                   Logout
// //                 </button>
// //               </>
// //             ) : (
// //               <div className="flex items-center gap-3">
            
// //                 {/* Auth Buttons */}

// //                  <Link
// //                   to="/admin-Login"
// //                   className="text-gray-700  hover:text-amber-600 font-medium transition-colors duration-200 px-3 py-1"
// //                 >
// //                  Admin Login
// //                 </Link>

// //                 <Link
// //                   to="/login"
// //                   className="text-gray-700  hover:text-amber-600 font-medium transition-colors duration-200 px-3 py-1"
// //                 >
// //                   Login
// //                 </Link>
// //                 <Link
// //                   to="/register"
// //                   className="bg-amber-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-amber-700 transition-all duration-200 transform hover:-translate-y-0.5 shadow-md hover:shadow-lg"
// //                 >
// //                   Register Free
// //                 </Link>
// //               </div>
// //             )}
// //           </div>
// //         </div>
// //       </div>

// //       {/* Mobile Menu Button (Optional) */}
// //       <div className="lg:hidden flex justify-center pb-2">
// //         <div className="flex items-center gap-4 text-sm text-gray-600">
// //           {isLoggedIn && (
// //             <div className="flex items-center gap-2">
// //               <div className="w-6 h-6 bg-pink-100 rounded-full flex items-center justify-center">
// //                 <span className="text-amber-600 font-semibold text-xs">
// //                   {profile?.name?.charAt(0) || 'U'}
// //                 </span>
// //               </div>
// //               <span>Hi, {profile?.name?.split(' ')[0] || 'User'}</span>
// //             </div>
// //           )}
// //         </div>
// //       </div>
// //     </header>
// //   );
// // }





