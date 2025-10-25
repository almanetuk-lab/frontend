// src/components/dashboard/UserDashboard.jsx
import React, { useEffect, useState, useCallback } from "react";
import { Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import { useUserProfile } from "../context/UseProfileContext";
import Sidebar from "./Sidebar";
import DashboardHome from "./DashboardContent";
import MessagesSection from "./MessagesSection";
import ProfilePage from "../profiles/ProfilePage";
import EditProfilePage from "../profiles/EditProfile";
import MatchesPage from "../MatchSystem/MatchesPage";
import MemberPage from "../pages/MemberPage";
import AdvancedSearch from "./SearchSection";

export default function UserDashboard() {
  const { profile, loading } = useUserProfile();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Get active section from URL
  const getActiveSection = useCallback(() => {
    const path = location.pathname;
    if (path === '/dashboard' || path === '/dashboard/') return 'dashboard';
    if (path.includes('profile')) return 'profile';
    if (path.includes('messages')) return 'messages';
    if (path.includes('search')) return 'search';
    if (path.includes('matches')) return 'matches';
    if (path.includes('members')) return 'members';
    return 'dashboard';
  }, [location.pathname]);

  const activeSection = getActiveSection();

  // Redirect if no token
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-3"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // No profile state
  if (!profile) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white p-6 rounded-xl shadow-lg text-center max-w-md">
          <div className="text-gray-400 text-3xl mb-3">👤</div>
          <h3 className="text-gray-800 text-lg mb-2">Create Your Profile</h3>
          <p className="text-gray-600 text-sm mb-4">Let's set up your profile to get started</p>
          <button 
            onClick={() => navigate("/dashboard/edit-profile")}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm"
          >
            Create Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Sidebar */}
      <Sidebar 
        profile={profile}
        activeSection={activeSection}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white shadow-sm p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition"
            >
              <span className="text-xl">☰</span>
            </button>
            <h1 className="text-lg font-semibold text-gray-800 capitalize">
              {activeSection.replace('-', ' ')}
            </h1>
            <div className="w-8"></div>
          </div>
        </header>

        {/* Routes */}
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route index element={<DashboardHome profile={profile} />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="edit-profile" element={<EditProfilePage />} />
            <Route path="messages" element={<MessagesSection />} />
            <Route path="search" element={<AdvancedSearch />} />
            <Route path="matches" element={<MatchesPage />} />
            <Route path="members" element={<MemberPage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}





















// old code hai 

// // src/components/dashboard/UserDashboard.jsx
// import React, { useEffect, useState, useCallback } from "react";
// import { Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
// import { useUserProfile } from "../context/UseProfileContext"; // ✅ Correct import path
// import { getUserProfile } from "../services/api"; // ✅ Correct import path
// import Sidebar from "./Sidebar";

// // Import components directly
// import DashboardHome from "./DashboardContent";
// import MessagesSection from "./MessagesSection";
// import ProfilePage from "../profiles/ProfilePage";
// import EditProfilePage from "../profiles/EditProfile";
// import MatchesPage from "../MatchSystem/MatchesPage";
// import MemberPage from "../pages/MemberPage";
// import AdvancedSearch from "./SearchSection";

// export default function UserDashboard() {
//   const { profile, updateProfile, loading } = useUserProfile(); // ✅ Now this will work
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [dataLoaded, setDataLoaded] = useState(false);
//   const [error, setError] = useState("");
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   console.log("🔍 Dashboard State:", { loading, dataLoaded, profile: !!profile, error });

//   // Get current active section from URL
//   const getActiveSection = useCallback(() => {
//     const path = location.pathname;
//     if (path === '/dashboard' || path === '/dashboard/') return 'dashboard';
//     if (path.includes('profile')) return 'profile';
//     if (path.includes('messages')) return 'messages';
//     if (path.includes('search')) return 'search';
//     if (path.includes('matches')) return 'matches';
//     if (path.includes('members')) return 'members';
//     return 'dashboard';
//   }, [location.pathname]);

//   const activeSection = getActiveSection();

//   // ✅ EMERGENCY FIX: Simple profile initialization
//   useEffect(() => {
//     const initializeDashboard = () => {
//       console.log("🚀 Initializing dashboard...");
      
//       const token = localStorage.getItem("accessToken");
//       if (!token) {
//         console.log("❌ No token, redirecting to login");
//         navigate("/login");
//         return;
//       }

//       // ✅ TRY 1: Check if we already have profile data
//       if (profile && Object.keys(profile).length > 0) {
//         console.log("✅ Using existing profile data");
//         setDataLoaded(true);
//         return;
//       }

//       // ✅ TRY 2: Check localStorage for user data
//       const localUser = localStorage.getItem("user");
//       if (localUser) {
//         try {
//           console.log("✅ Using localStorage data");
//           const userData = JSON.parse(localUser);
//           updateProfile(userData);
//           setDataLoaded(true);
//           return;
//         } catch (e) {
//           console.warn("❌ Invalid localStorage data");
//         }
//       }

//       // ✅ TRY 3: Try API call (but don't block if it fails)
//       console.log("🔄 Trying API call...");
//       getUserProfile()
//         .then(response => {
//           console.log("📦 API Response:", response);
//           if (response && response.data) {
//             updateProfile(response.data);
//             localStorage.setItem("user", JSON.stringify(response.data));
//           } else if (response && response.user) {
//             updateProfile(response.user);
//             localStorage.setItem("user", JSON.stringify(response.user));
//           }
//         })
//         .catch(err => {
//           console.warn("⚠️ API call failed, continuing with available data:", err.message);
//           // Don't set error - just continue
//         })
//         .finally(() => {
//           console.log("🏁 Dashboard initialization completed");
//           setDataLoaded(true);
//         });
//     };

//     initializeDashboard();
//   }, [navigate, updateProfile]); // ✅ Removed profile dependency

//   // ✅ SIMPLE LOADING CHECK
//   if (!dataLoaded) {
//     console.log("⏳ Showing loading screen...");
//     return (
//       <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-3"></div>
//           <p className="text-gray-600">Loading your dashboard...</p>
//           <p className="text-xs text-gray-400 mt-2">Please wait</p>
//         </div>
//       </div>
//     );
//   }

//   // ✅ If we have profile data, render dashboard
//   if (profile && Object.keys(profile).length > 0) {
//     console.log("🎯 Rendering dashboard with profile:", profile);
    
//     return (
//       <div className="flex h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
//         {/* Sidebar */}
//         <Sidebar 
//           profile={profile}
//           activeSection={activeSection}
//           sidebarOpen={sidebarOpen}
//           setSidebarOpen={setSidebarOpen}
//         />

//         {/* Main Content Area */}
//         <div className="flex-1 flex flex-col overflow-hidden">
//           {/* Mobile Header */}
//           <header className="lg:hidden bg-white shadow-sm p-4 border-b border-gray-200">
//             <div className="flex items-center justify-between">
//               <button
//                 onClick={() => setSidebarOpen(!sidebarOpen)}
//                 className="p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition"
//               >
//                 <span className="text-xl">☰</span>
//               </button>
//               <h1 className="text-lg font-semibold text-gray-800 capitalize">
//                 {activeSection.replace('-', ' ')}
//               </h1>
//               <div className="w-8"></div>
//             </div>
//           </header>

//           {/* Nested Routes */}
//           <main className="flex-1 overflow-y-auto">
//             <Routes>
//               <Route index element={<DashboardHome profile={profile} />} />
//               <Route path="profile" element={<ProfilePage />} />
//               <Route path="edit-profile" element={<EditProfilePage />} />
//               <Route path="messages" element={<MessagesSection />} />
//               <Route path="search" element={<AdvancedSearch />} />
//               <Route path="matches" element={<MatchesPage />} />
//               <Route path="members" element={<MemberPage />} />
//               <Route path="*" element={<Navigate to="/dashboard" replace />} />
//             </Routes>
//           </main>
//         </div>

//         {/* Overlay for mobile */}
//         {sidebarOpen && (
//           <div 
//             className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
//             onClick={() => setSidebarOpen(false)}
//           />
//         )}
//       </div>
//     );
//   }

//   // ✅ If no profile data, show create profile option
//   console.log("👤 No profile data, showing create option");
//   return (
//     <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
//       <div className="bg-white p-6 rounded-xl shadow-lg text-center max-w-md">
//         <div className="text-gray-400 text-3xl mb-3">👤</div>
//         <h3 className="text-gray-800 text-lg mb-2">Ready to Get Started?</h3>
//         <p className="text-gray-600 text-sm mb-4">Create your profile to begin your journey</p>
//         <button 
//           onClick={() => navigate("/dashboard/edit-profile")}
//           className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm"
//         >
//           Create Your Profile
//         </button>
//         <button 
//           onClick={() => window.location.reload()}
//           className="ml-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition text-sm"
//         >
//           Retry
//         </button>
//       </div>
//     </div>
//   );
// }
















// import React, { useEffect, useState, useCallback } from "react";
// import { Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
// import { useUserProfile } from "../context/UseProfileContext";
// import Sidebar from "./Sidebar";

// // Import components
// import DashboardHome from "./DashboardContent";
// import MessagesSection from "./MessagesSection";
// import ProfilePage from "../profiles/ProfilePage";
// import EditProfilePage from "../profiles/EditProfile";
// import MatchesPage from "../MatchSystem/MatchesPage";
// import MemberPage from "../pages/MemberPage";
// import AdvancedSearch from "./SearchSection";

// export default function UserDashboard() {
//   const { profile, updateProfile } = useUserProfile();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [dataLoaded, setDataLoaded] = useState(false);
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   console.log("🚀 Dashboard mounted");

//   // ✅ IMMEDIATE AUTH CHECK
//   useEffect(() => {
//     const token = localStorage.getItem("accessToken");
//     console.log("🔐 Token check:", !!token);
    
//     if (!token) {
//       console.log("❌ No token, redirecting to login");
//       navigate("/login");
//       return;
//     }

//     // ✅ QUICK PROFILE SETUP
//     const initializeProfile = () => {
//       console.log("🔄 Initializing profile...");
      
//       // Try localStorage first
//       const localUser = localStorage.getItem("user");
//       if (localUser) {
//         try {
//           const userData = JSON.parse(localUser);
//           console.log("✅ Using localStorage data");
//           updateProfile(userData);
//         } catch (e) {
//           console.warn("❌ Invalid localStorage data");
//         }
//       }
      
//       setDataLoaded(true);
//       console.log("🏁 Dashboard ready");
//     };

//     initializeProfile();
//   }, [navigate, updateProfile]);

//   // Get current active section
//   const getActiveSection = useCallback(() => {
//     const path = location.pathname;
//     if (path === '/dashboard' || path === '/dashboard/') return 'dashboard';
//     if (path.includes('profile')) return 'profile';
//     if (path.includes('messages')) return 'messages';
//     if (path.includes('search')) return 'search';
//     if (path.includes('matches')) return 'matches';
//     if (path.includes('members')) return 'members';
//     return 'dashboard';
//   }, [location.pathname]);

//   const activeSection = getActiveSection();

//   // ✅ SIMPLE LOADING
//   if (!dataLoaded) {
//     return (
//       <div className="flex justify-center items-center h-screen bg-gray-50">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
//           <p className="text-gray-600 text-sm">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   console.log("🎯 Rendering dashboard, profile:", profile);

//   return (
//     <div className="flex h-screen bg-gray-50">
//       {/* Sidebar */}
//       <Sidebar 
//         profile={profile || {}}
//         activeSection={activeSection}
//         sidebarOpen={sidebarOpen}
//         setSidebarOpen={setSidebarOpen}
//       />

//       {/* Main Content */}
//       <div className="flex-1 flex flex-col overflow-hidden">
//         {/* Mobile Header */}
//         <header className="lg:hidden bg-white shadow-sm p-4 border-b">
//           <div className="flex items-center justify-between">
//             <button
//               onClick={() => setSidebarOpen(!sidebarOpen)}
//               className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
//             >
//               <span className="text-xl">☰</span>
//             </button>
//             <h1 className="text-lg font-semibold text-gray-800 capitalize">
//               {activeSection.replace('-', ' ')}
//             </h1>
//             <div className="w-8"></div>
//           </div>
//         </header>

//         {/* Routes */}
//         <main className="flex-1 overflow-y-auto p-4">
//           <Routes>
//             <Route index element={<DashboardHome profile={profile || {}} />} />
//             <Route path="profile" element={<ProfilePage />} />
//             <Route path="edit-profile" element={<EditProfilePage />} />
//             <Route path="messages" element={<MessagesSection />} />
//             <Route path="search" element={<AdvancedSearch />} />
//             <Route path="matches" element={<MatchesPage />} />
//             <Route path="members" element={<MemberPage />} />
//             <Route path="*" element={<Navigate to="/dashboard" replace />} />
//           </Routes>
//         </main>
//       </div>

//       {/* Mobile Overlay */}
//       {sidebarOpen && (
//         <div 
//           className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}
//     </div>
//   );
// }














// // UserDashboard.js mein - COMPLETE EMERGENCY FIX
// import React, { useEffect, useState, useCallback } from "react";
// import { Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
// import { useUserProfile } from "../context/UseProfileContext";
// import { getUserProfile } from "../services/api";
// import Sidebar from "./Sidebar";

// // Import components directly
// import DashboardHome from "./DashboardContent";
// import MessagesSection from "./MessagesSection";
// import ProfilePage from "../profiles/ProfilePage";
// import EditProfilePage from "../profiles/EditProfile";
// import MatchesPage from "../MatchSystem/MatchesPage";
// import MemberPage from "../pages/MemberPage";
// import AdvancedSearch from "./SearchSection";



// export default function UserDashboard() {
//   const { profile, updateProfile, loading } = useUserProfile();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [dataLoaded, setDataLoaded] = useState(false);
//   const [error, setError] = useState("");
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   console.log("🔍 Dashboard State:", { loading, dataLoaded, profile: !!profile, error });

//   // Get current active section from URL
//   const getActiveSection = useCallback(() => {
//     const path = location.pathname;
//     if (path === '/dashboard' || path === '/dashboard/') return 'dashboard';
//     if (path.includes('profile')) return 'profile';
//     if (path.includes('messages')) return 'messages';
//     if (path.includes('search')) return 'search';
//     if (path.includes('matches')) return 'matches';
//     if (path.includes('members')) return 'members';
//     return 'dashboard';
//   }, [location.pathname]);

//   const activeSection = getActiveSection();

//   // ✅ EMERGENCY FIX: Simple profile initialization
//   useEffect(() => {
//     const initializeDashboard = () => {
//       console.log("🚀 Initializing dashboard...");
      
//       const token = localStorage.getItem("accessToken");
//       if (!token) {
//         console.log("❌ No token, redirecting to login");
//         navigate("/login");
//         return;
//       }

//       // ✅ TRY 1: Check if we already have profile data
//       if (profile && Object.keys(profile).length > 0) {
//         console.log("✅ Using existing profile data");
//         setDataLoaded(true);
//         return;
//       }

//       // ✅ TRY 2: Check localStorage for user data
//       const localUser = localStorage.getItem("user");
//       if (localUser) {
//         try {
//           console.log("✅ Using localStorage data");
//           const userData = JSON.parse(localUser);
//           updateProfile(userData);
//           setDataLoaded(true);
//           return;
//         } catch (e) {
//           console.warn("❌ Invalid localStorage data");
//         }
//       }

//       // ✅ TRY 3: Try API call (but don't block if it fails)
//       console.log("🔄 Trying API call...");
//       getUserProfile()
//         .then(response => {
//           console.log("📦 API Response:", response);
//           if (response && response.data) {
//             updateProfile(response.data);
//             localStorage.setItem("user", JSON.stringify(response.data));
//           } else if (response && response.user) {
//             updateProfile(response.user);
//             localStorage.setItem("user", JSON.stringify(response.user));
//           }
//         })
//         .catch(err => {
//           console.warn("⚠️ API call failed, continuing with available data:", err.message);
//           // Don't set error - just continue
//         })
//         .finally(() => {
//           console.log("🏁 Dashboard initialization completed");
//           setDataLoaded(true);
//         });
//     };

//     initializeDashboard();
//   }, [navigate, updateProfile]); // ✅ Removed profile dependency

//   // ✅ SIMPLE LOADING CHECK
//   if (!dataLoaded) {
//     console.log("⏳ Showing loading screen...");
//     return (
//       <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-3"></div>
//           <p className="text-gray-600">Loading your dashboard...</p>
//           <p className="text-xs text-gray-400 mt-2">Please wait</p>
//         </div>
//       </div>
//     );
//   }

//   // ✅ If we have profile data, render dashboard
//   if (profile && Object.keys(profile).length > 0) {
//     console.log("🎯 Rendering dashboard with profile:", profile);
    
//     return (
//       <div className="flex h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
//         {/* Sidebar */}
//         <Sidebar 
//           profile={profile}
//           activeSection={activeSection}
//           sidebarOpen={sidebarOpen}
//           setSidebarOpen={setSidebarOpen}
//         />

//         {/* Main Content Area */}
//         <div className="flex-1 flex flex-col overflow-hidden">
//           {/* Mobile Header */}
//           <header className="lg:hidden bg-white shadow-sm p-4 border-b border-gray-200">
//             <div className="flex items-center justify-between">
//               <button
//                 onClick={() => setSidebarOpen(!sidebarOpen)}
//                 className="p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition"
//               >
//                 <span className="text-xl">☰</span>
//               </button>
//               <h1 className="text-lg font-semibold text-gray-800 capitalize">
//                 {activeSection.replace('-', ' ')}
//               </h1>
//               <div className="w-8"></div>
//             </div>
//           </header>

//           {/* Nested Routes */}
//           <main className="flex-1 overflow-y-auto">
//             <Routes>
//               <Route index element={<DashboardHome profile={profile} />} />
//               <Route path="profile" element={<ProfilePage />} />
//               <Route path="edit-profile" element={<EditProfilePage />} />
//               <Route path="messages" element={<MessagesSection />} />
//               <Route path="search" element={<AdvancedSearch />} />
//               <Route path="matches" element={<MatchesPage />} />
//               <Route path="members" element={<MemberPage />} />
//               <Route path="*" element={<Navigate to="/dashboard" replace />} />
//             </Routes>
//           </main>
//         </div>

//         {/* Overlay for mobile */}
//         {sidebarOpen && (
//           <div 
//             className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
//             onClick={() => setSidebarOpen(false)}
//           />
//         )}
//       </div>
//     );
//   }

//   // ✅ If no profile data, show create profile option
//   console.log("👤 No profile data, showing create option");
//   return (
//     <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
//       <div className="bg-white p-6 rounded-xl shadow-lg text-center max-w-md">
//         <div className="text-gray-400 text-3xl mb-3">👤</div>
//         <h3 className="text-gray-800 text-lg mb-2">Ready to Get Started?</h3>
//         <p className="text-gray-600 text-sm mb-4">Create your profile to begin your journey</p>
//         <button 
//           onClick={() => navigate("/dashboard/edit-profile")}
//           className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm"
//         >
//           Create Your Profile
//         </button>
//         <button 
//           onClick={() => window.location.reload()}
//           className="ml-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition text-sm"
//         >
//           Retry
//         </button>
//       </div>
//     </div>
//   );
// }











































// ---------------------------------------------------------------------------------

// // src/components/dashboard/UserDashboard.jsx
// import React, { useEffect, useState } from "react";
// import { Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom"; // ✅ No BrowserRouter here
// import { useUserProfile } from "../context/UseProfileContext";
// import { getUserProfile } from "../services/api";
// import Sidebar from "./Sidebar";

// // Dashboard Components
// import DashboardHome from "./DashboardContent";
// import MessagesSection from "./MessagesSection";
// // import AdvancedSearch from "./SearchSection";

// // Profile Components
// import EditProfilePage from "../profiles/EditProfile";
// import ProfilePage from "../profiles/ProfilePage";


// // Other Pages
// // import Memberpage from "../pages/MemberPage";
// import MatchesPage from "../MatchSystem/MatchesPage";
// import MemberPage from "../pages/MemberPage";
// import AdvancedSearch from "./SearchSection";
// // import ProfilePage from "./ProfileSection";

// export default function UserDashboard() {
//   const { profile, updateProfile, loading } = useUserProfile();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [dataLoaded, setDataLoaded] = useState(false);
//   const [error, setError] = useState("");
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   // Get current active section from URL
//   const getActiveSection = () => {
//     const path = location.pathname;
//     if (path === '/dashboard' || path === '/dashboard/') return 'dashboard';
//     if (path.includes('profile')) return 'profile';
//     if (path.includes('messages')) return 'messages';
//     if (path.includes('search')) return 'search';
//     if (path.includes('matches')) return 'matches';
//     if (path.includes('members')) return 'members';
//     return 'dashboard';
//   };

//   const activeSection = getActiveSection();

//   // Profile fetch logic
//   useEffect(() => {
//     const fetchUserProfile = async () => {
//       try {
//         const token = localStorage.getItem("accessToken");
//         if (!token) {
//           navigate("/login");
//           return;
//         }

//         const response = await getUserProfile();
        
//         if (response && response.data) {
//           updateProfile(response.data);
//         } else if (response && response.user) {
//           updateProfile(response.user);
//         } else {
//           setError("No profile data received from server");
//         }
        
//       } catch (err) {
//         console.error("❌ Profile fetch error:", err);
//         setError("Failed to load profile data: " + (err.message || "Unknown error"));
//       } finally {
//         setDataLoaded(true);
//       }
//     };

//     if (!profile || Object.keys(profile).length === 0) {
//       fetchUserProfile();
//     } else {
//       setDataLoaded(true);
//     }
//   }, [navigate, updateProfile, profile]);

//   // Loading state
//   if (loading || !dataLoaded) {
//     return (
//       <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
//           <p className="text-gray-600 text-lg">Loading your dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
//         <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md">
//           <div className="text-red-500 text-4xl mb-4">⚠️</div>
//           <p className="text-red-500 text-lg mb-4">{error}</p>
//           <button 
//             onClick={() => window.location.reload()}
//             className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition shadow-md"
//           >
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (!profile || Object.keys(profile).length === 0) {
//     return (
//       <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
//         <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md">
//           <div className="text-gray-400 text-4xl mb-4">👤</div>
//           <p className="text-gray-600 text-lg mb-4">No profile data found</p>
//           <button 
//             onClick={() => navigate("/dashboard/edit-profile")}
//             className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition shadow-md"
//           >
//             Create Your Profile
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
//       {/* Sidebar */}
//       <Sidebar 
//         profile={profile}
//         activeSection={activeSection}
//         sidebarOpen={sidebarOpen}
//         setSidebarOpen={setSidebarOpen}
//       />

//       {/* Main Content Area */}
//       <div className="flex-1 flex flex-col overflow-hidden">
//         {/* Mobile Header */}
//         <header className="lg:hidden bg-white shadow-sm p-4 border-b border-gray-200">
//           <div className="flex items-center justify-between">
//             <button
//               onClick={() => setSidebarOpen(!sidebarOpen)}
//               className="p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition"
//             >
//               <span className="text-xl">☰</span>
//             </button>
//             <h1 className="text-lg font-semibold text-gray-800 capitalize">
//               {activeSection.replace('-', ' ')}
//             </h1>
//             <div className="w-8"></div>
//           </div>
//         </header>

//         {/* Nested Routes */}
//         <main className="flex-1 overflow-y-auto">
//           <Routes>
//             <Route index element={<DashboardHome profile={profile} />} />
//             <Route path="profile" element={<ProfilePage/>} />
//             <Route path="edit-profile" element={<EditProfilePage />} />
//             <Route path="messages" element={<MessagesSection />} />
//             <Route path="search" element={<AdvancedSearch />} />
//             <Route path="matches" element={<MatchesPage />} />
//             <Route path="members" element={<MemberPage />} />
//             <Route path="*" element={<Navigate to="/dashboard" replace />} />
//           </Routes>
//         </main>
//       </div>

//       {/* Overlay for mobile */}
//       {sidebarOpen && (
//         <div 
//           className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
//           onClick={() => setSidebarOpen(false)}
//         ></div>
//       )}
//     </div>
//   );
// }   







// yeh layout hai iska     aut yeh wali file dshbord content ki hai    




// // src/components/dashboard/DashboardHome.jsx
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import StatCard from "../comman/StatCard";
// import MatchCard from "../comman/MatchCard";
// import ActivityItem from "../comman/ActivityItem";
// import QuickAction from "../comman/QuickAction";

// export default function DashboardHome({ profile }) {
//   const navigate = useNavigate();
//   const [searchQuery, setSearchQuery] = useState("");

//   // Generate random matches
//   const generateRandomMatches = () => {
//     return [
//       { 
//         id: 1, 
//         name: "Priya Sharma", 
//         profession: "Software Engineer", 
//         city: "Mumbai",
//         age: 28,
//         photo: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150",
//         online: true
//       },
//       { 
//         id: 2, 
//         name: "Rahul Kumar", 
//         profession: "UI/UX Designer", 
//         city: "Delhi",
//         age: 26,
//         photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
//         online: false
//       },
//       { 
//         id: 3, 
//         name: "Anjali Singh", 
//         profession: "Marketing Manager", 
//         city: "Bangalore",
//         age: 30,
//         photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
//         online: true
//       }
//     ];
//   };

//   const randomMatches = generateRandomMatches();

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 sm:p-6 overflow-hidden">
//       <div className="max-w-7xl mx-auto">
//         {/* Desktop Header */}
//         <header className="hidden lg:block bg-white shadow-sm p-6 border-b border-gray-200 mb-6 rounded-2xl">
//           <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
//             <div className="flex-1 min-w-0">
//               <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2 truncate">
//                 Welcome back, <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
//                   {profile?.full_name?.split(' ')[0] || profile?.name?.split(' ')[0] || 'User'}!
//                 </span>
//               </h1>
//               <p className="text-gray-600 text-sm lg:text-base">Ready to find your perfect match?</p>
//             </div>
            
//             {/* Search Bar */}
//             <div className="w-full lg:w-96 flex-shrink-0">
//               <div className="relative">
//                 <input
//                   type="text"
//                   placeholder="Search users by name, profession, or city..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   className="w-full px-4 lg:px-5 py-3 lg:py-4 pl-10 lg:pl-12 pr-10 border border-gray-300 rounded-xl lg:rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm transition text-sm lg:text-base"
//                 />
//                 <span className="absolute left-3 lg:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-base">🔍</span>
//                 {searchQuery && (
//                   <button 
//                     onClick={() => setSearchQuery("")}
//                     className="absolute right-3 lg:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
//                   >
//                     ✕
//                   </button>
//                 )}
//               </div>
//             </div>
//           </div>
//         </header>

//         {/* Mobile Header */}
//         <header className="lg:hidden bg-white shadow-sm p-4 border-b border-gray-200 mb-4 rounded-xl">
//           <div className="flex items-center justify-between mb-4">
//             <div className="flex-1 min-w-0">
//               <h1 className="text-xl font-bold text-gray-800 mb-1 truncate">
//                 Welcome, <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
//                   {profile?.full_name?.split(' ')[0] || profile?.name?.split(' ')[0] || 'User'}!
//                 </span>
//               </h1>
//               <p className="text-gray-600 text-sm">Find your perfect match</p>
//             </div>
//           </div>
          
//           {/* Mobile Search Bar */}
//           <div className="relative">
//             <input
//               type="text"
//               placeholder="Search users..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="w-full px-4 py-3 pl-10 pr-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm transition text-sm"
//             />
//             <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
//             {searchQuery && (
//               <button 
//                 onClick={() => setSearchQuery("")}
//                 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
//               >
//                 ✕
//               </button>
//             )}
//           </div>
//         </header>



//         {/* Dashboard Content */}



//         {/* Dashboard Content */}
// <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
//   {/* Left Column */}
//   <div className="lg:col-span-2 space-y-4 sm:space-y-6">
//     {/* Profile Card */}
//     <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 overflow-hidden">
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
//         <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Your Profile</h2>
//         <div className="flex gap-2">
//           <span className="px-2 sm:px-3 py-1 bg-green-100 text-green-600 text-xs sm:text-sm rounded-full font-medium">Active</span>
//           <span className="px-2 sm:px-3 py-1 bg-blue-100 text-blue-600 text-xs sm:text-sm rounded-full font-medium">Verified</span>
//         </div>
//       </div>
      
//       {/* Profile Header */}
//       <div className="flex flex-row items-center sm:items-start gap-4 sm:gap-6 mb-6 sm:mb-8">
//         {/* Profile Picture */}
//         <div className="flex-shrink-0">
//           {profile?.profile_picture_url || profile?.profilePhoto || profile?.profile_picture ? (
//             <img
//               src={profile.profile_picture_url || profile.profilePhoto || profile.profile_picture}
//               alt="Profile"
//               className="w-20 h-20 sm:w-28 sm:h-28 rounded-xl sm:rounded-2xl object-cover border-4 border-white shadow-lg"
//             />
//           ) : (
//             <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-xl sm:rounded-2xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xl sm:text-2xl font-bold shadow-lg">
//               {profile?.full_name?.charAt(0) || profile?.name?.charAt(0) || 'U'}
//             </div>
//           )}
//         </div>

//         {/* Profile Info - PHLE JAISA LAYOUT */}
//         <div className="flex-1 w-full min-w-0">
//           <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4 mb-4">
//             {/* Name and Basic Info - Left Side */}
//             <div className="flex-1 min-w-0">
//               <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1 sm:mb-2 truncate">
//                 {profile?.full_name || profile?.name || "imran"}
//               </h1>
//               <p className="text-gray-600 text-base sm:text-lg mb-1 truncate">
//                 {profile?.profession || profile?.occupation || profile?.headline || "Software Engineer"}
//               </p>
//               <p className="text-gray-500 text-sm sm:text-base flex items-center gap-1 truncate">
//                 📍 {profile?.city || profile?.location || "INDORE"} • 
//                 {profile?.age ? ` ${profile.age} years` : " 24 years"}
//               </p>
//             </div>
            
//             {/* Action Buttons - Right Side Opposite Username (PHLE JAISA) */}
//             <div className="flex gap-2 flex-shrink-0">
//               <button
//                 onClick={() => navigate("/dashboard/profile")}
//                 className="px-3 py-1 sm:px-3 sm:py-1 bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-all duration-200 font-medium text-xs sm:text-sm border border-green-300 flex items-center gap-1 hover:shadow-md whitespace-nowrap"
//               >
//                 <span className="text-xs">👁️</span>
//                 <span className="hidden sm:inline">View Profile</span>
//                 <span className="sm:hidden">View</span>
//               </button>
//               <button
//                 onClick={() => navigate("/dashboard/edit-profile")}
//                 className="px-3 py-1 sm:px-3 sm:py-1 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-all duration-200 font-medium text-xs sm:text-sm border border-blue-300 flex items-center gap-1 hover:shadow-md whitespace-nowrap"
//               >
//                 <span className="text-xs">✏️</span>
//                 <span className="hidden sm:inline">Edit Profile</span>
//                 <span className="sm:hidden">Edit</span>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Quick Stats */}
//       <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
//         <StatCard label="Profile Views" value="128" trend="+12%" />
//         <StatCard label="Matches" value="24" trend="+5%" />
//         <StatCard label="Connections" value="56" trend="+8%" />
//         <StatCard label="Messages" value="12" trend="+3%" />
//       </div>
//     </div>

//     {/* Recent Activity */}
//     <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 overflow-hidden">
//       <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">Recent Activity</h3>
//       <div className="space-y-2 sm:space-y-3">
//         <ActivityItem 
//           icon="👀"
//           text="Your profile was viewed by 5 new people"
//           time="2 hours ago"
//         />
//         <ActivityItem 
//           icon="💖"
//           text="You have 3 new matches waiting"
//           time="5 hours ago"
//         />
//         <ActivityItem 
//           icon="💬"
//           text="You received 2 new messages"
//           time="1 day ago"
//         />
//       </div>
//     </div>
//   </div>

//   {/* Right Column */}
//   <div className="space-y-4 sm:space-y-6">
//     {/* Suggested Matches */}
//     <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 overflow-hidden">
//       <div className="flex items-center justify-between mb-3 sm:mb-4">
//         <h3 className="text-base sm:text-lg font-semibold text-gray-800">Suggested Matches</h3>
//         <span className="text-xs sm:text-sm text-indigo-600 font-medium">3+</span>
//       </div>
//       <div className="space-y-3 sm:space-y-4 max-h-96 overflow-y-auto">
//         {randomMatches.map((user) => (
//           <MatchCard key={user.id} user={user} />
//         ))}
//       </div>
//       <button 
//         onClick={() => navigate("/dashboard/matches")}
//         className="w-full mt-3 sm:mt-4 px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 text-gray-700 rounded-lg sm:rounded-xl hover:bg-gray-100 transition font-medium text-sm sm:text-base"
//       >
//         View All Matches
//       </button>
//     </div>

//     {/* Quick Actions */}
//     <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 text-white overflow-hidden">
//       <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Quick Actions</h3>
//       <div className="space-y-2 sm:space-y-3">
//         <QuickAction icon="⚡" label="Boost Profile" />
//         <QuickAction icon="⭐" label="Go Premium" />
//         <QuickAction icon="🔔" label="Notifications" />
//         <QuickAction icon="🛡️" label="Privacy Settings" />
//       </div>
//     </div>
//   </div>
// </div>
// </div>
// </div>

// );
// }




// aurv yeh wali slide ki yeh // src/components/dashboard/Sidebar.jsx































