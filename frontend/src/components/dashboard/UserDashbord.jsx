// src/components/dashboard/UserDashboard.jsx
import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom"; // ✅ No BrowserRouter here
import { useUserProfile } from "../context/useProfileContext";
import { getUserProfile } from "../services/api";
import Sidebar from "./Sidebar";

// Dashboard Components
import DashbordHome from "./DashboardContent";
import MessagesSection from "./MessagesSection";

// Profile Components
import EditProfilePage from "../profiles/EditProfile";
import ProfilePage from "../profiles/ProfilePage";


// Other Pages
import MatchesPage from "../MatchSystem/MatchesPage";
import MemberPage from "../pages/MemberPage";
import AdvancedSearch from "./SearchSection";

export default function UserDashboard() {
  const { profile, updateProfile, loading } = useUserProfile();
  const navigate = useNavigate();
  const location = useLocation();
  const [dataLoaded, setDataLoaded] = useState(false);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Get current active section from URL
  const getActiveSection = () => {
    const path = location.pathname;
    if (path === '/dashboard' || path === '/dashboard/') return 'dashboard';
    if (path.includes('profile')) return 'profile';
    if (path.includes('messages')) return 'messages';
    if (path.includes('search')) return 'search';
    if (path.includes('matches')) return 'matches';
    if (path.includes('members')) return 'members';
    return 'dashboard';
  };

  const activeSection = getActiveSection();

  // Profile fetch logic
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await getUserProfile();
        
        if (response && response.data) {
          updateProfile(response.data);
        } else if (response && response.user) {
          updateProfile(response.user);
        } else {
          setError("No profile data received from server");
        }
        
      } catch (err) {
        console.error("❌ Profile fetch error:", err);
        setError("Failed to load profile data: " + (err.message || "Unknown error"));
      } finally {
        setDataLoaded(true);
      }
    };

    if (!profile || Object.keys(profile).length === 0) {
      fetchUserProfile();
    } else {
      setDataLoaded(true);
    }
  }, [navigate, updateProfile, profile]);

  // Loading state
  if (loading || !dataLoaded) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition shadow-md"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!profile || Object.keys(profile).length === 0) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md">
          <div className="text-gray-400 text-4xl mb-4">👤</div>
          <p className="text-gray-600 text-lg mb-4">No profile data found</p>
          <button 
            onClick={() => navigate("/dashboard/edit-profile")}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition shadow-md"
          >
            Create Your Profile
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

      {/* Main Content Area */}
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

        {/* Nested Routes */}
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route index element={<DashboardHome profile={profile} />} />
            <Route path="profile" element={<ProfilePage/>} />
            <Route path="edit-profile" element={<EditProfilePage />} />
            <Route path="messages" element={<MessagesSection />} />
            <Route path="search" element={<AdvancedSearch />} />
            <Route path="matches" element={<MatchesPage />} />
            <Route path="members" element={<MemberPage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}