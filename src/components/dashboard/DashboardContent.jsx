// src/components/dashboard/DashboardHome.jsx
import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StatCard from "../comman/StatCard";
import MatchCard from "../comman/MatchCard";
import ActivityItem from "../comman/ActivityItem";
import QuickAction from "../comman/QuickAction";
import { chatApi } from "../services/chatApi";
import { getSuggestedMatches } from "../services/chatApi";

export default function DashboardHome({ profile }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [suggestedMatches, setSuggestedMatches] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // ----------------------------------------------------------------//
  // ----------------------------------------------------------------//

  // Fetch matches
  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getSuggestedMatches();

      // IMPORTANT: Handle different response structures
      let matchesArray = [];

      if (Array.isArray(data)) {
        matchesArray = data;
      } else if (data && typeof data === "object") {
        // If single object, create array with it
        if (data.id) {
          matchesArray = [data];
        } else if (data.data) {
          // If response has data property
          matchesArray = Array.isArray(data.data) ? data.data : [data.data];
        }
      }

      // Take only first 5 users
      const limitedMatches = matchesArray.slice(0, 5);
      setSuggestedMatches(limitedMatches);
    } catch (err) {
      console.error("Error fetching matches:", err);
      setError("Failed to load matches. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Retry button ke liye
  const handleRetry = () => {
    fetchMatches();
  };

  // Memoized matches data
  const randomMatches = useMemo(
    () => [
      {
        id: 1,
        name: "Priya Sharma",
        profession: "Software Engineer",
        city: "Mumbai",
        age: 28,
        online: true,
      },
      {
        id: 2,
        name: "Rahul Kumar",
        profession: "UI/UX Designer",
        city: "Delhi",
        age: 26,
        online: false,
      },
      {
        id: 3,
        name: "Anjali Singh",
        profession: "Marketing Manager",
        city: "Bangalore",
        age: 30,
        online: true,
      },
    ],
    []
  );

  // ✅ Search users function
  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    setSearchLoading(true);
    try {
      const response = await chatApi.searchUsers(query);
      console.log("Search results:", response.data);

      // Get current user ID from profile or localStorage
      const currentUserId = profile?.id || profile?.user_id;

      // Filter out current user from results
      const filteredResults = (response.data || []).filter(
        (user) => user.id !== currentUserId
      );

      setSearchResults(filteredResults);
      setShowSearchResults(true);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  // ✅ Search effect with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        handleSearch(searchQuery);
      } else {
        setSearchResults([]);
        setShowSearchResults(false);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // ✅ Handle user selection from search
  const handleUserSelectFromSearch = (user) => {
    console.log("Selected user from search:", user);
    // Navigate to messages with this user or start chat
    navigate("/dashboard/messages");
    setSearchQuery("");
    setShowSearchResults(false);
  };

  // ✅ Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".search-container")) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Desktop Header */}
        <header className="hidden lg:block bg-white shadow-sm p-6 border-b border-gray-200 mb-6 rounded-2xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2 truncate">
                Welcome back,{" "}
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {/* {profile?.full_name?.split(' ')[0] || profile?.name?.split(' ')[0] || 'User'}! */}
                  {profile?.first_name ||
                    profile?.last_name?.split(" ")[0] ||
                    profile?.name?.split(" ")[0] ||
                    "User"}
                  !
                </span>
              </h1>
              <p className="text-gray-600 text-sm lg:text-base">
                Ready to find your perfect match?
              </p>
            </div>

            {/* Search Bar */}
            <div className="w-full lg:w-96 flex-shrink-0 search-container">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search users by name, profession, or city..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSearchResults(true);
                  }}
                  onFocus={() => {
                    if (searchQuery.trim() && searchResults.length > 0) {
                      setShowSearchResults(true);
                    }
                  }}
                  className="w-full px-4 lg:px-5 py-3 lg:py-4 pl-10 lg:pl-12 pr-10 border border-gray-300 rounded-xl lg:rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm transition text-sm lg:text-base"
                />
                <span className="absolute left-3 lg:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-base">
                  🔍
                </span>

                {searchLoading && (
                  <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                  </div>
                )}

                {searchQuery && !searchLoading && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSearchResults([]);
                      setShowSearchResults(false);
                    }}
                    className="absolute right-3 lg:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  >
                    ✕
                  </button>
                )}

                {/* ✅ Search Results Dropdown */}
                {showSearchResults && searchQuery.trim() && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto z-50">
                    {searchLoading ? (
                      <div className="p-4 text-center text-gray-500">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mx-auto mb-2"></div>
                        Searching...
                      </div>
                    ) : searchResults.length > 0 ? (
                      <div className="py-2">
                        {searchResults.map((user) => (
                          <div
                            key={user.id}
                            onClick={() => handleUserSelectFromSearch(user)}
                            className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer transition border-b border-gray-100 last:border-b-0"
                          >
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                              {user.name?.charAt(0)?.toUpperCase() ||
                                user.first_name?.charAt(0)?.toUpperCase() ||
                                "U"}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-800 truncate text-sm">
                                {user.name ||
                                  `${user.first_name || ""} ${
                                    user.last_name || ""
                                  }`.trim() ||
                                  "User"}
                              </p>
                              <p className="text-xs text-gray-600 truncate">
                                {user.profession || user.email || "No info"}
                              </p>
                              {user.city && (
                                <p className="text-xs text-gray-500 truncate">
                                  📍 {user.city}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        <p className="text-sm">No users found</p>
                        <p className="text-xs mt-1">
                          Try different search terms
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Header */}
        <header className="lg:hidden bg-white shadow-sm p-4 border-b border-gray-200 mb-4 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-gray-800 mb-1 truncate">
                Welcome,{" "}
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {profile?.full_name?.split(" ")[0] ||
                    profile?.name?.split(" ")[0] ||
                    "User"}
                  !
                </span>
              </h1>
              <p className="text-gray-600 text-sm">Find your perfect match</p>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="relative search-container">
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchResults(true);
              }}
              onFocus={() => {
                if (searchQuery.trim() && searchResults.length > 0) {
                  setShowSearchResults(true);
                }
              }}
              className="w-full px-4 py-3 pl-10 pr-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm transition text-sm"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔍
            </span>

            {searchLoading && (
              <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
              </div>
            )}

            {searchQuery && !searchLoading && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSearchResults([]);
                  setShowSearchResults(false);
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
              >
                ✕
              </button>
            )}

            {/* ✅ Mobile Search Results Dropdown */}
            {showSearchResults && searchQuery.trim() && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto z-50">
                {searchLoading ? (
                  <div className="p-4 text-center text-gray-500">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mx-auto mb-2"></div>
                    Searching...
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="py-2">
                    {searchResults.map((user) => (
                      <div
                        key={user.id}
                        onClick={() => handleUserSelectFromSearch(user)}
                        className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer transition border-b border-gray-100 last:border-b-0"
                      >
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-xs">
                          {user.name?.charAt(0)?.toUpperCase() ||
                            user.first_name?.charAt(0)?.toUpperCase() ||
                            "U"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-800 truncate text-sm">
                            {user.name ||
                              `${user.first_name || ""} ${
                                user.last_name || ""
                              }`.trim() ||
                              "User"}
                          </p>
                          <p className="text-xs text-gray-600 truncate">
                            {user.profession || user.email || "No info"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    <p className="text-sm">No users found</p>
                    <p className="text-xs mt-1">Try different search terms</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                  Your Profile
                </h2>
                <div className="flex gap-2">
                  <span className="px-2 sm:px-3 py-1 bg-green-100 text-green-600 text-xs sm:text-sm rounded-full font-medium">
                    Active
                  </span>
                  <span className="px-2 sm:px-3 py-1 bg-blue-100 text-blue-600 text-xs sm:text-sm rounded-full font-medium">
                    Verified
                  </span>
                </div>
              </div>

              {/* Profile Header */}
              <div className="flex flex-row items-center sm:items-start gap-4 sm:gap-6 mb-6 sm:mb-8">
                {/* Profile Picture */}
                <div className="flex-shrink-0">
                  {profile?.image_url ? (
                    <img
                      src={profile.image_url}
                      alt="Profile"
                      className="w-20 h-20 sm:w-28 sm:h-28 rounded-xl sm:rounded-2xl object-cover border-4 border-white shadow-lg"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-xl sm:rounded-2xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xl sm:text-2xl font-bold shadow-lg flex-col">
                      {profile?.first_name?.charAt(0)}
                      {profile?.last_name?.charAt(0)}
                      <span className="text-xs mt-1 text-white/80">
                        Profile Pic
                      </span>
                    </div>
                  )}
                </div>

                {/* Profile Info */}

                <div className="flex-1 w-full min-w-0">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4 mb-4">
                    <div className="flex-1 min-w-0">
                      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1 sm:mb-2 truncate">
                        {/* {profile?.first_name || profile?.name || ""} */}
                        {profile?.first_name && profile?.last_name
                          ? `${profile.first_name} ${profile.last_name}`
                          : profile?.name || "User"}
                      </h1>
                      <p className="text-gray-600 text-base sm:text-lg mb-1 truncate">
                        {profile?.profession ||
                          profile?.occupation ||
                          profile?.headline ||
                          "Software Engineer"}
                      </p>
                      <p className="text-gray-500 text-sm sm:text-base flex items-center gap-1 truncate">
                        📍 {profile?.city || profile?.location || "INDORE"} •
                        {profile?.age ? ` ${profile.age} years` : " 24 years"}
                      </p>
                    </div>

                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => navigate("/dashboard/profile")}
                        className="px-3 py-1 sm:px-3 sm:py-1 bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-all duration-200 font-medium text-xs sm:text-sm border border-green-300 flex items-center gap-1 hover:shadow-md whitespace-nowrap"
                      >
                        <span className="text-xs">👁️</span>
                        <span className="hidden sm:inline">View Profile</span>
                        <span className="sm:hidden">View</span>
                      </button>
                      <button
                        onClick={() => navigate("/dashboard/edit-profile")}
                        className="px-3 py-1 sm:px-3 sm:py-1 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-all duration-200 font-medium text-xs sm:text-sm border border-blue-300 flex items-center gap-1 hover:shadow-md whitespace-nowrap"
                      >
                        <span className="text-xs">✏️</span>
                        <span className="hidden sm:inline">Edit Profile</span>
                        <span className="sm:hidden">Edit</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <StatCard label="Profile Views" value="128" trend="+12%" />
                <StatCard label="Matches" value="24" trend="+5%" />
                <StatCard label="Connections" value="56" trend="+8%" />
                <StatCard label="Messages" value="12" trend="+3%" />
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">
                Recent Activity
              </h3>
              <div className="space-y-2 sm:space-y-3">
                <ActivityItem
                  icon="👀"
                  text="Your profile was viewed by 5 new people"
                  time="2 hours ago"
                />
                <ActivityItem
                  icon="💖"
                  text="You have 3 new matches waiting"
                  time="5 hours ago"
                />
                <ActivityItem
                  icon="💬"
                  text="You received 2 new messages"
                  time="1 day ago"
                />
              </div>
            </div>
          </div>

          {/* Right Column */}
          {/* <div className="space-y-4 sm:space-y-6"> */}
          {/* <SuggestedMatches/> */}
          {/* </div> */}

          <div className="space-y-4 sm:space-y-6">
            Suggested Matches
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Suggested Matches
                </h3>
                <span className="text-sm text-indigo-600 font-medium">
                  {suggestedMatches.length} matches
                </span>
              </div>
              {loading ? (
                // Loading - Show 5 loading cards
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="flex items-center p-3 bg-gray-50 rounded-lg animate-pulse"
                    >
                      <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
                        <div className="h-3 bg-gray-300 rounded w-32"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-4">
                  <p className="text-red-500 mb-2">{error}</p>
                  <button
                    onClick={fetchMatches}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                // SHOW EXACTLY 5 USERS
                <div className="space-y-4">
                  {suggestedMatches.map((user) => (
                    <div
                      key={user.id || user.user_id}
                      className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                    >
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                        {user.name?.[0] || "U"}
                      </div>
                      User Info
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800">
                          {user.name || `User ${user.id || user.user_id}`}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {user.profession || "Profession not set"}
                        </p>
                      </div>
                      Connect Button
                      <button className="px-3 py-1 bg-blue-500 text-white text-sm rounded-full">
                        +
                      </button>
                    </div>
                  ))}
                </div>
              )}
              View All Button - Only if we have users
              {suggestedMatches.length > 0 && (
                <button
                  onClick={() => navigate("/dashboard/matches")}
                  className="w-full mt-4 p-3 text-center text-blue-600 font-medium border-t pt-4 hover:bg-gray-50 rounded-b-lg"
                >
                  View All Matches
                </button>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 text-white">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
              Quick Actions
            </h3>
            <div className="space-y-2 sm:space-y-3">
              <QuickAction icon="⚡" label="Boost Profile" />
              <QuickAction icon="⭐" label="Go Premium" />
              <QuickAction icon="🔔" label="Notifications" />
              <QuickAction icon="🛡️" label="Privacy Settings" />
            </div>
          </div>
        </div>
      </div>
    </div>
    // </div>
  );
}
