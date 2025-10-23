// src/components/dashboard/Sidebar.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SidebarIcons from "./SidebarIcons";

const SidebarItem = ({ 
  icon, 
  label, 
  active = false, 
  onClick, 
  isDropdown = false, 
  isOpen = false, 
  onToggle, 
  children 
}) => {
  if (isDropdown) {
    return (
      <div className="relative">
        <button
          onClick={onToggle}
          className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-xl transition-all duration-200 ${
            active 
              ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border-r-2 border-indigo-600 shadow-sm' 
              : 'text-gray-700 hover:bg-gray-50 hover:translate-x-1'
          }`}
        >
          <span className="text-xl">{icon}</span>
          <span className="flex-1 font-medium text-sm sm:text-base">{label}</span>
          <span className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>
        
        {/* Dropdown Menu */}
        {isOpen && (
          <div className="ml-4 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
            {children}
          </div>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`flex items-center w-full px-4 py-3 text-left rounded-xl transition-all duration-200 ${
        active 
          ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border-r-2 border-indigo-600 shadow-sm' 
          : 'text-gray-700 hover:bg-gray-50 hover:translate-x-1'
      }`}
    >
      <span className="mr-3 text-xl">{icon}</span>
      <span className="font-medium text-sm sm:text-base">{label}</span>
    </button>
  );
};

export default function Sidebar({ profile, activeSection, sidebarOpen, setSidebarOpen }) {
  const navigate = useNavigate();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  return (
    <div 
      className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform 
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        transition-transform duration-300 ease-in-out 
        lg:translate-x-0 lg:static lg:inset-0
        h-screen flex flex-col
      `}
    >
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar Header - Fixed Height */}
      <div className="flex-shrink-0 p-4 sm:p-6 border-b border-gray-200">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          MingleHub
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Find Your Perfect Match
        </p>
        
        {/* Dashboard Icons */}
        <div className="mt-3 sm:mt-4">
          <SidebarIcons />
        </div>
      </div>

      {/* Navigation Menu - Scrollable */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-2 px-3 sm:px-4">
        <nav className="space-y-1">
          <SidebarItem 
            icon="🏠" 
            label="Dashboard" 
            active={activeSection === "dashboard"}
            onClick={() => {
              navigate("/dashboard");
              setSidebarOpen(false);
            }}
          />
          
          {/* Profile Dropdown */}
          <SidebarItem 
            icon="👤" 
            label="Profile" 
            active={activeSection === "profile" || activeSection === "edit-profile"}
            isDropdown={true}
            isOpen={profileDropdownOpen}
            onToggle={() => setProfileDropdownOpen(!profileDropdownOpen)}
          >
            <button
              onClick={() => {
                navigate("/dashboard/profile");
                setProfileDropdownOpen(false);
                setSidebarOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-left text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-200 text-sm"
            >
              <span className="text-base">👤</span>
              <span className="font-medium">View Profile</span>
            </button>
            <button
              onClick={() => {
                navigate("/dashboard/edit-profile");
                setProfileDropdownOpen(false);
                setSidebarOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-left text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-200 text-sm"
            >
              <span className="text-base">✏️</span>
              <span className="font-medium">Edit Profile</span>
            </button>
          </SidebarItem>
          
          <SidebarItem 
            icon="💬" 
            label="Messages" 
            active={activeSection === "messages"}
            onClick={() => {
              navigate("/dashboard/messages");
              setSidebarOpen(false);
            }}
          />
          <SidebarItem 
            icon="🔍" 
            label="Advanced Search" 
            active={activeSection === "search"}
            onClick={() => {
              navigate("/dashboard/search");
              setSidebarOpen(false);
            }}
          />
          <SidebarItem 
            icon="👥" 
            label="My Matches" 
            active={activeSection === "matches"}
            onClick={() => {
              navigate("/dashboard/matches");
              setSidebarOpen(false);
            }}
          />
          <SidebarItem 
            icon="🌐" 
            label="Browse Members" 
            onClick={() => {
              navigate("/dashboard/members");
              setSidebarOpen(false);
            }}
          />
        </nav>
      </div>

      {/* User Profile Section - Fixed Height */}
      <div className="flex-shrink-0 p-3 sm:p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center gap-3 mb-3 p-2 sm:p-3 bg-gray-50 rounded-xl">
          {profile?.profile_picture_url || profile?.profilePhoto ? (
            <img
              src={profile.profile_picture_url || profile.profilePhoto}
              alt="Profile"
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-indigo-500"
            />
          ) : (
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm sm:text-base">
              {profile?.full_name?.charAt(0) || 'U'}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-medium text-gray-800 truncate">
              {profile?.full_name?.split(' ')[0] || 'User'}
            </p>
            <p className="text-xs text-gray-500">Free Member</p>
          </div>
        </div>

        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/login";
          }}
          className="flex items-center justify-center w-full px-3 py-2 sm:px-4 sm:py-3 text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-all duration-200 font-medium text-sm sm:text-base"
        >
          <span className="mr-2">🚪</span>
          Logout
        </button>
      </div>
    </div>
  );
}









// // src/components/dashboard/SidebarIcons.jsx

// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// // Icon Components
// const DashboardIcon = () => (
//   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
//   </svg>
// );

// const ProfileIcon = () => (
//   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//   </svg>
// );

// const MessageIcon = () => (
//   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
//   </svg>
// );

// const SearchIcon = () => (
//   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//   </svg>
// );

// const FriendsIcon = () => (
//   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
//   </svg>
// );

// const SettingsIcon = () => (
//   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//   </svg>
// );

// // Sidebar Icons Component - Compact version for sidebar
// const SidebarIcons = () => {
//   const navigate = useNavigate();
//   const [activeIcon, setActiveIcon] = useState(null);

//   const icons = [
//     { 
//       id: 'dashboard', 
//       icon: <DashboardIcon />, 
//       title: 'Dashboard',
//       navigate: "/dashboard"
//     },
//     { 
//       id: 'profile', 
//       icon: <ProfileIcon />, 
//       title: 'Profile',
//       navigate: "/dashboard/profile"
//     },
//     { 
//       id: 'message', 
//       icon: <MessageIcon />, 
//       title: 'Messages',
//       navigate: "/dashboard/messages"
//     },
//     { 
//       id: 'search', 
//       icon: <SearchIcon />, 
//       title: 'Search',
//       navigate: "/dashboard/search"
//     },
//     { 
//       id: 'friends', 
//       icon: <FriendsIcon />, 
//       title: 'Friends',
//       navigate: "/dashboard/friends"
//     },
//     { 
//       id: 'settings', 
//       icon: <SettingsIcon />, 
//       title: 'Settings',
//       navigate: "/dashboard/settings"
//     }
//   ];

//   const handleIconClick = (icon) => {
//     setActiveIcon(icon.id);
//     navigate(icon.navigate);
//   };

//   return (
//     <div className="relative">
//       {/* Compact Icons Grid for Sidebar */}
//       <div className="grid grid-cols-3 gap-2">
//         {icons.map((icon) => (
//           <button
//             key={icon.id}
//             onClick={() => handleIconClick(icon)}
//             className={`
//               flex flex-col items-center p-2 rounded-lg cursor-pointer transition-all duration-200 border
//               ${activeIcon === icon.id 
//                 ? 'bg-indigo-100 border-indigo-300 text-indigo-600 transform scale-105 shadow-sm' 
//                 : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100 hover:border-gray-300'
//               }
//             `}
//           >
//             <div className="p-1">
//               {icon.icon}
//             </div>
//             <span className="text-xs font-medium mt-1 text-center leading-tight">
//               {icon.title}
//             </span>
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default SidebarIcons;