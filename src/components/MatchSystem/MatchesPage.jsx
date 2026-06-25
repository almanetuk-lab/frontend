import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getSuggestedMatches } from "../services/chatApi";
import api from "../services/api"; // Your axios instance

export default function MatchesPage() {
  const navigate = useNavigate();

  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingProfileId, setLoadingProfileId] = useState(null); // Track which profile is loading

  // SIMPLE LOAD MORE STATE
  const [visibleCount, setVisibleCount] = useState(20);
  const [loadingMore, setLoadingMore] = useState(false);

  // ==============================
  // CLIENT-SIDE FILTER STATE
  // ==============================
  const [filterGender, setFilterGender] = useState("");
  const [filterCity, setFilterCity] = useState("");
  const [filterAgeMin, setFilterAgeMin] = useState("");
  const [filterAgeMax, setFilterAgeMax] = useState("");

  // ==============================
  // API FUNCTIONS
  // ==============================

  const fetchMatches = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("🔄 Fetching matches...");

      const apiData = await getSuggestedMatches();
      console.log("📦 getSuggestedMatches Response:", apiData);

      // Check response format
      let matchesData = [];

      if (apiData && Array.isArray(apiData)) {
        matchesData = apiData;
      } else if (apiData && apiData.data && Array.isArray(apiData.data)) {
        matchesData = apiData.data;
      } else if (apiData && apiData.matches && Array.isArray(apiData.matches)) {
        matchesData = apiData.matches;
      }

      console.log(`✅ Found ${matchesData.length} matches`);

      // DEBUG: Check what fields are coming
      if (matchesData.length > 0) {
        const firstUser = matchesData[0];
        console.log("🔍 First user fields:", Object.keys(firstUser));
      }

      setMatches(matchesData);
    } catch (err) {
      console.error("❌ Error fetching matches:", err);
      setError(`Failed to load matches: ${err.message || "Network error"}`);
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIXED: fetchCompleteProfile function
const fetchCompleteProfile = async (userId, currentUserId) => {
  try {
    console.log(`🔍 Fetching profile for user ${userId}, current user: ${currentUserId}`);
    
    // CASE 1: अगर user खुद का profile देख रहा है
    if (userId == currentUserId) {
      console.log("✅ User viewing own profile, using /api/me");
      const response = await api.get("/api/me");
      
      if (response.data) {
        const completeProfile = {
          ...response.data.data,
          prompts: response.data.prompts || {}
        };
        
        // Process prompts (clean question-key)
        if (completeProfile.prompts && completeProfile.prompts["question-key"]) {
          try {
            const parsed = JSON.parse(completeProfile.prompts["question-key"]);
            completeProfile.prompts = {
              ...completeProfile.prompts,
              ...parsed
            };
            delete completeProfile.prompts["question-key"];
          } catch (error) {
            console.error("Error parsing question-key:", error);
          }
        }
        
        return completeProfile;
      }
    }
    
    // CASE 2: दूसरे user का profile देख रहा है
    console.log("🔄 User viewing other's profile");
    
    // Step 1: Get basic profile
    const profileResponse = await api.get(`/api/users/${userId}`);
    const basicProfile = profileResponse.data.data || profileResponse.data;
    
    // Step 2: Try to get prompts (ये tricky है क्योंकि दूसरे users के prompts नहीं मिलते)
    let promptsData = {};
    
    // Option A: शायद कोई public endpoint है
    try {
      const promptsResponse = await api.get(`/api/users/${userId}/public-prompts`);
      if (promptsResponse.data) {
        promptsData = promptsResponse.data;
      }
    } catch (error) {
      console.log("⚠️ Public prompts API not available");
    }
    
    // Option B: अगर नहीं मिलता, तो empty रहने दें
    const completeProfile = {
      ...basicProfile,
      prompts: promptsData
    };
    
    console.log("✅ Other user profile fetched (may not have prompts):", {
      userId: completeProfile.user_id || completeProfile.id,
      hasPrompts: Object.keys(completeProfile.prompts || {}).length > 0
    });
    
    return completeProfile;
    
  } catch (error) {
    console.error("❌ Error fetching profile:", error);
    return null;
  }
};

  // //  CORRECT: Fetch COMPLETE user profile using /api/users/{userId}
  // const fetchCompleteProfile = async (userId) => {
  //   try {
  //     console.log(`🔍 Fetching COMPLETE profile for user ${userId} via /api/users/${userId}...`);
      
  //     // Method 1: Use the CORRECT endpoint /api/users/{userId}
  //     const response = await api.get(`/api/users/${userId}`);
      
  //     console.log(`/api/users/${userId} response:`, response.data);
      
  //     if (response.data) {
  //       // Check response format
  //       let completeProfile = {};
        
  //       // Format 1: Data in response.data.data
  //       if (response.data.data) {
  //         completeProfile = {
  //           ...response.data.data,
  //           prompts: response.data.prompts || {}
  //         };
  //       } 
  //       // Format 2: Direct data in response.data
  //       else {
  //         completeProfile = response.data;
          
  //         // If prompts are separate, combine them
  //         if (response.data.prompts && !completeProfile.prompts) {
  //           completeProfile.prompts = response.data.prompts;
  //         }
  //       }
        
  //       console.log("✅ Complete profile fetched:", completeProfile);
  //       console.log("Has prompts?", completeProfile.prompts);
  //       console.log("Has profile_questions?", completeProfile.profile_questions);
  //       console.log("Has life_rhythms?", completeProfile.life_rhythms);
  //       console.log("User ID in profile:", completeProfile.user_id || completeProfile.id);
        
  //       // Verify this is the correct user
  //       const profileUserId = completeProfile.user_id || completeProfile.id;
  //       if (profileUserId == userId) {
  //         console.log("✅ CORRECT user profile verified");
  //         return completeProfile;
  //       } else {
  //         console.log(`❌ WRONG user: Expected ${userId}, got ${profileUserId}`);
  //         return null;
  //       }
  //     }
      
  //     return null;
      
  //   } catch (error) {
  //     console.error("❌ Error fetching complete profile:", error);
  //     return null;
  //   }
  // };

  // ==============================
  // EVENT HANDLERS
  // ==============================

  const handleSendMessage = async (memberId, memberName = "") => {
    try {
      console.log("💬 CHAT CLICKED for:", memberName, "ID:", memberId);

      navigate(`/dashboard/messages`, {
        state: {
          selectedUser: {
            id: memberId,
            name: memberName,
            receiverId: memberId,
          },
        },
      });
    } catch (error) {
      console.error("Error starting chat:", error);
      navigate(`/dashboard/messages`, {
        state: {
          selectedUser: {
            id: memberId,
            name: memberName,
          },
        },
      });
    }
  };

  // ✅ FIXED: View Profile with COMPLETE data fetch
  const handleViewProfile = async (match) => {
    const memberId = match.user_id || match.id;
    const memberName = getDisplayName(match);

    console.log("🎯 VIEW PROFILE CLICKED for user:", memberName, "ID:", memberId);
    console.log("Current match data (partial):", match);

    try {
      // Show loading for this specific profile
      setLoadingProfileId(memberId);

      // 1. Fetch COMPLETE profile data using /api/users/{userId}
      const completeProfile = await fetchCompleteProfile(memberId);
      
      if (completeProfile) {
        console.log("✅ SUCCESS: Complete profile data fetched");
        console.log("Complete data keys:", Object.keys(completeProfile));
        
        // 2. Navigate with COMPLETE data
        navigate(`/dashboard/profile/${memberId}`, {
          state: {
            userProfile: completeProfile, // COMPLETE data with prompts, questions, etc.
            memberId: memberId,
            name: memberName,
            from: "matches_page_complete"
          }
        });
      } else {
        console.log("⚠️ Complete profile not found, using partial data");
        
        // Fallback: Use partial match data
        navigate(`/dashboard/profile/${memberId}`, {
          state: {
            userProfile: match, // Only basic data
            memberId: memberId,
            name: memberName,
            from: "matches_page_partial"
          }
        });
      }
    } catch (error) {
      console.error("❌ Error in handleViewProfile:", error);
      
      // Final fallback: Navigate without state
      navigate(`/dashboard/profile/${memberId}`);
    } finally {
      // Hide loading
      setLoadingProfileId(null);
    }
  };

  // ==============================
  // HELPER FUNCTIONS
  // ==============================

  const getDisplayName = (user) => {
    if (!user) return "User";

    if (user.full_name && user.full_name.trim()) {
      return user.full_name;
    }

    if (user.first_name || user.last_name) {
      const name = `${user.first_name || ""} ${user.last_name || ""}`.trim();
      return name;
    }

    if (user.profession && user.profession.trim()) {
      return user.profession;
    }

    if (user.company && user.company.trim()) {
      return user.company;
    }

    return `User ${user.user_id || user.id || ""}`;
  };

  const getProfileImage = (user) => {
    if (!user) {
      return "https://ui-avatars.com/api/?name=User&background=random&color=fff&size=150";
    }

    if (user.image_url && user.image_url.trim()) {
      return user.image_url;
    }

    const displayName = getDisplayName(user);
    const nameForAvatar = displayName.replace(/[^a-zA-Z0-9 ]/g, "");
    const encodedName = encodeURIComponent(nameForAvatar || "User");

    return `https://ui-avatars.com/api/?name=${encodedName}&background=random&color=fff&bold=true&size=150`;
  };

  const getLocation = (user) => {
    if (!user) return "Location not set";

    const locations = [];
    if (user.city && user.city.trim()) locations.push(user.city);
    if (user.state && user.state.trim() && !locations.includes(user.state)) {
      locations.push(user.state);
    }
    if (user.country && user.country.trim() && !locations.includes(user.country)) {
      locations.push(user.country);
    }

    return locations.length > 0 ? locations.join(", ") : "Location not set";
  };

  const getSkills = (user) => {
    if (!user) return [];
    if (user.skills && Array.isArray(user.skills)) {
      return user.skills.filter(skill => skill && typeof skill === "string" && skill.trim()).slice(0, 5);
    }
    return [];
  };

  const getInterests = (user) => {
    if (!user) return [];
    if (user.interests && Array.isArray(user.interests)) {
      return user.interests.filter(interest => interest && typeof interest === "string" && interest.trim()).slice(0, 5);
    }
    return [];
  };

  const getHobbies = (user) => {
    if (!user) return [];
    if (user.hobbies && Array.isArray(user.hobbies)) {
      return user.hobbies.filter(hobby => hobby && typeof hobby === "string" && hobby.trim()).slice(0, 5);
    }
    return [];
  };

  const loadMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + 20);
      setLoadingMore(false);
    }, 500);
  };

  const resetTo20 = () => {
    setVisibleCount(20);
  };

  // ==============================
  // CLIENT-SIDE FILTER LOGIC
  // ==============================

  const applyFilters = (data) => {
    return data.filter((user) => {
      // Gender filter
      if (filterGender) {
        const userGender = (user.gender || "").toLowerCase();
        const selected = filterGender.toLowerCase();
        const match =
          userGender === selected ||
          (selected === "male" && userGender === "man") ||
          (selected === "female" && userGender === "woman") ||
          (selected === "man" && userGender === "male") ||
          (selected === "woman" && userGender === "female");
        if (!match) return false;
      }

      // City filter
      if (filterCity.trim()) {
        const userCity = (user.city || "").toLowerCase();
        if (!userCity.includes(filterCity.trim().toLowerCase())) return false;
      }

      // Age filter
      if (filterAgeMin !== "") {
        const age = parseInt(user.age, 10);
        if (isNaN(age) || age < parseInt(filterAgeMin, 10)) return false;
      }
      if (filterAgeMax !== "") {
        const age = parseInt(user.age, 10);
        if (isNaN(age) || age > parseInt(filterAgeMax, 10)) return false;
      }

      return true;
    });
  };

  const resetFilters = () => {
    setFilterGender("");
    setFilterCity("");
    setFilterAgeMin("");
    setFilterAgeMax("");
    setVisibleCount(20);
  };

  const isAnyFilterActive =
    filterGender || filterCity.trim() || filterAgeMin !== "" || filterAgeMax !== "";

  const debugUserData = (user) => {
    console.log("=== USER DATA DEBUG ===");
    console.log("ID:", user.id);
    console.log("User ID:", user.user_id);
    console.log("Full Name:", user.full_name);
    console.log("First Name:", user.first_name);
    console.log("Last Name:", user.last_name);
    console.log("City:", user.city);
    console.log("Profession:", user.profession);
    console.log("Image URL:", user.image_url);
    console.log("Match Score:", user.match_score);
    console.log("Skills:", user.skills);
    console.log("Interests:", user.interests);
    console.log("Hobbies:", user.hobbies);
    console.log("Is Active:", user.is_active);
    console.log("Is Submitted:", user.is_submitted);
    console.log("======================");
  };

  // ==============================
  // USE EFFECTS
  // ==============================

  useEffect(() => {
    fetchMatches();
  }, []);

  // ==============================
  // CALCULATIONS
  // ==============================

  // Apply client-side filters to the full matches array
  const filteredMatches = applyFilters(matches);

  const visibleMatches = filteredMatches.slice(0, visibleCount);
  const hasMore = visibleCount < filteredMatches.length;
  const remaining = filteredMatches.length - visibleCount;
  const totalMatches = filteredMatches.length;
  const allTotal = matches.length;
  const onlineNow = filteredMatches.filter((match) => match.is_active === true).length;
  const verifiedProfiles = filteredMatches.filter((match) => match.is_submitted === true).length;
  const averageMatchScore = filteredMatches.length > 0
    ? Math.round(filteredMatches.reduce((sum, match) => sum + (match.match_score || 0), 0) / filteredMatches.length)
    : 0;

  // (uniqueCities dropdown removed — city filter is now a free-text input)

  // Unique gender list
  const uniqueGenders = [...new Set(
    matches.map((m) => m.gender).filter((g) => g && g.trim())
  )].sort();

  // ==============================
  // RENDER
  // ==============================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">My Matches</h1>
            <p className="text-gray-600">Loading matches...</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
                <div className="w-full h-48 bg-gray-300"></div>
                <div className="p-4">
                  <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
                  <div className="flex gap-2">
                    <div className="h-10 bg-gray-300 rounded flex-1"></div>
                    <div className="w-10 h-10 bg-gray-300 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">My Matches</h1>
          <p className="text-gray-600">Find Your Perfect Match</p>

          {/* ── CLIENT-SIDE FILTER PANEL ── */}
          <div className="mt-4 p-4 bg-white rounded-lg border shadow-sm">
            <div className="flex flex-wrap gap-3 items-end">
              {/* Gender Filter */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500">Gender</label>
                <select
                  value={filterGender}
                  onChange={(e) => { setFilterGender(e.target.value); setVisibleCount(20); }}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
                >
                  <option value="">All Genders</option>
                  {uniqueGenders.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              {/* City Filter */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500">City</label>
                <input
                  type="text"
                  placeholder="e.g. London, Mumbai"
                  value={filterCity}
                  onChange={(e) => { setFilterCity(e.target.value); setVisibleCount(20); }}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
                />
              </div>

              {/* Age Min */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500">Age (Min)</label>
                <input
                  type="number"
                  min="18"
                  max="99"
                  placeholder="Min"
                  value={filterAgeMin}
                  onChange={(e) => { setFilterAgeMin(e.target.value); setVisibleCount(20); }}
                  className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
                />
              </div>

              {/* Age Max */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500">Age (Max)</label>
                <input
                  type="number"
                  min="18"
                  max="99"
                  placeholder="Max"
                  value={filterAgeMax}
                  onChange={(e) => { setFilterAgeMax(e.target.value); setVisibleCount(20); }}
                  className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
                />
              </div>

              {/* Reset Button */}
              {isAnyFilterActive && (
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition font-medium"
                >
                  Reset Filters
                </button>
              )}
            </div>

            {/* Results count row */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-3 pt-3 border-t border-gray-100">
              <div className="text-sm">
                <span className="text-gray-600">Showing </span>
                <span className="font-bold text-indigo-600">{Math.min(visibleCount, totalMatches)}</span>
                <span className="text-gray-600"> of </span>
                <span className="font-bold">{totalMatches}</span>
                <span className="text-gray-600"> matches</span>
                {isAnyFilterActive && (
                  <span className="ml-2 text-indigo-500 text-xs">(filtered from {allTotal} total)</span>
                )}
                {hasMore && (
                  <span className="ml-2 text-green-600">({remaining} more available)</span>
                )}
              </div>

              {visibleCount > 20 && (
                <button
                  onClick={resetTo20}
                  className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200 transition"
                >
                  Show Only 20
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <p className="text-2xl font-bold text-indigo-600">{totalMatches}</p>
            <p className="text-gray-600 text-sm">Total Matches</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <p className="text-2xl font-bold text-green-600">{onlineNow}</p>
            <p className="text-gray-600 text-sm">Online Now</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <p className="text-2xl font-bold text-blue-600">{verifiedProfiles}</p>
            <p className="text-gray-600 text-sm">Verified Profiles</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <p className="text-2xl font-bold text-purple-600">{averageMatchScore * 10}%</p>
            <p className="text-gray-600 text-sm">Avg Match Score</p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-700">{error}</p>
            <button
              onClick={fetchMatches}
              className="mt-2 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition text-sm"
            >
              Retry API Call
            </button>
          </div>
        )}

        {/* Matches Grid */}
        {visibleMatches.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
            <div className="text-gray-400 text-5xl mb-4">👥</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {isAnyFilterActive ? "No matches found for selected filters" : "No matches found"}
            </h3>
            <p className="text-gray-500 mb-6">
              {isAnyFilterActive ? "Try adjusting or resetting your filters" : "The API returned 0 matches"}
            </p>
            {isAnyFilterActive ? (
              <button
                onClick={resetFilters}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                Reset Filters
              </button>
            ) : (
              <button
                onClick={fetchMatches}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                Refresh API Call
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Debug Button */}
            <div className="mb-4 text-center">
              <button
                onClick={() => debugUserData(visibleMatches[0])}
                className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300"
              >
                Debug First User Data
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {visibleMatches.map((match, index) => {
                const displayName = getDisplayName(match);
                const location = getLocation(match);
                const profileImage = getProfileImage(match);
                const skills = getSkills(match);
                const interests = getInterests(match);
                const hobbies = getHobbies(match);
                const isOnline = match.is_active === true;
                const isVerified = match.is_submitted === true;
                const memberId = match.user_id || match.id;
                const isLoading = loadingProfileId === memberId;

                return (
                  <div
                    key={match.id || match.user_id || index}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100"
                  >
                    {/* Profile Image */}
                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                      <img
                        src={profileImage}
                        alt={displayName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          const nameForAvatar = displayName.replace(/[^a-zA-Z0-9 ]/g, "");
                          const encodedName = encodeURIComponent(nameForAvatar || "User");
                          e.target.src = `https://ui-avatars.com/api/?name=${encodedName}&background=random&color=fff&size=150`;
                        }}
                      />

                      {/* Online Status */}
                      {isOnline && (
                        <div className="absolute top-3 right-3">
                          <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                            <span className="w-2 h-2 bg-white rounded-full mr-1"></span>
                            Online
                          </span>
                        </div>
                      )}

                      {/* Verified Badge */}
                      {isVerified && (
                        <div className="absolute top-3 left-3">
                          <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                            <span className="mr-1">✓</span>
                            Verified
                          </span>
                        </div>
                      )}

                      {/* Match Score */}
                      {match.match_score > 0 && (
                        <div className="absolute bottom-3 right-3">
                          <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs px-3 py-1 rounded-full font-bold">
                            {match.match_score}/10
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Profile Info */}
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-gray-800">{displayName}</h3>

                          {match.profession && (
                            <p className="text-gray-600 font-medium text-sm mt-1">{match.profession}</p>
                          )}

                          <div className="text-gray-500 text-sm mt-1 flex flex-wrap gap-2">
                            {match.age && match.age > 0 && <span>{match.age} yrs</span>}
                            {match.gender && <span>• {match.gender}</span>}
                            {match.marital_status && <span>• {match.marital_status}</span>}
                          </div>
                        </div>

                        <button className="text-gray-400 hover:text-red-500 transition text-xl ml-2">
                          ♡
                        </button>
                      </div>

                      {/* Location */}
                      {location !== "Location not set" && (
                        <p className="text-gray-500 text-sm mb-3 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {location}
                        </p>
                      )}

                      {/* Company */}
                      {match.company && (
                        <p className="text-gray-500 text-sm mb-3 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          {match.company}
                        </p>
                      )}

                      {/* Tags */}
                      {(skills.length > 0 || interests.length > 0 || hobbies.length > 0) && (
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-1 mb-2">
                            {skills.slice(0, 3).map((skill, idx) => (
                              <span key={idx} className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded">
                                {skill}
                              </span>
                            ))}
                            {interests.slice(0, 2).map((interest, idx) => (
                              <span key={idx} className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded">
                                {interest}
                              </span>
                            ))}
                            {hobbies.slice(0, 2).map((hobby, idx) => (
                              <span key={idx} className="text-xs bg-yellow-50 text-yellow-600 px-2 py-1 rounded">
                                {hobby}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewProfile(match)}
                          disabled={isLoading}
                          className={`flex-1 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition text-sm font-medium ${
                            isLoading ? "opacity-70 cursor-wait" : ""
                          }`}
                        >
                          {isLoading ? (
                            <>
                              <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Loading...
                            </>
                          ) : (
                            "View Profile"
                          )}
                        </button>

                        <button
                          onClick={() => handleSendMessage(memberId, displayName)}
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
                        >
                          Message
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Load More */}
            {hasMore && (
              <div className="text-center mt-8 mb-8">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className={`px-8 py-3 rounded-lg font-medium transition ${
                    loadingMore
                      ? "bg-indigo-400 text-white cursor-wait"
                      : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg"
                  }`}
                >
                  {loadingMore ? (
                    <>
                      <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Loading...
                    </>
                  ) : (
                    <>
                      Load More (+{Math.min(20, remaining)})
                      <svg className="w-4 h-4 inline ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    </>
                  )}
                </button>

                <p className="text-gray-500 text-sm mt-3">
                  Showing {Math.min(visibleCount, totalMatches)} of {totalMatches} matches
                </p>
              </div>
            )}

            {/* All Loaded */}
            {!hasMore && totalMatches > 0 && (
              <div className="text-center mt-8 mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-700 font-medium">🎉 All {totalMatches} matches loaded!</p>
                {visibleCount > 20 && (
                  <button
                    onClick={resetTo20}
                    className="mt-3 px-4 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200 text-sm"
                  >
                    Show Only 20
                  </button>
                )}
              </div>
            )}

            {/* Refresh */}
            <div className="text-center mt-4">
              <button
                className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                onClick={fetchMatches}
              >
                Refresh API Data
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}











































































































// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { getSuggestedMatches } from "../services/chatApi";
// import { adminAPI } from "../services/adminApi";

// export default function MatchesPage() {
//   const navigate = useNavigate();

//   const [matches, setMatches] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   //  SIMPLE LOAD MORE STATE
//   const [visibleCount, setVisibleCount] = useState(20);
//   const [loadingMore, setLoadingMore] = useState(false);

//   //  1. FIRST - Define handleSendMessage function HERE
//   const handleSendMessage = async (memberId, memberName = "") => {
//     try {
//       console.log("💬 CHAT CLICKED for:", memberName, "ID:", memberId);

//       // Navigate to messages page with user info
//       navigate(`/dashboard/messages`, {
//         state: {
//           selectedUser: {
//             id: memberId,
//             name: memberName,
//             receiverId: memberId,
//           },
//         },
//       });
//     } catch (error) {
//       console.error("Error starting chat:", error);
//       // Fallback navigation
//       navigate(`/dashboard/messages`, {
//         state: {
//           selectedUser: {
//             id: memberId,
//             name: memberName,
//           },
//         },
//       });
//     }
//   };

//   const fetchMatches = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       console.log("🔄 Fetching matches...");

//       //  OPTION 1: Use getSuggestedMatches (jo dashboard pe use kar rahe ho)
//       const apiData = await getSuggestedMatches();
//       console.log("📦 getSuggestedMatches Response:", apiData);

//       //  Check response format
//       let matchesData = [];

//       if (apiData && Array.isArray(apiData)) {
//         matchesData = apiData;
//       } else if (apiData && apiData.data && Array.isArray(apiData.data)) {
//         matchesData = apiData.data;
//       } else if (apiData && apiData.matches && Array.isArray(apiData.matches)) {
//         matchesData = apiData.matches;
//       }

//       console.log(` Found ${matchesData.length} matches`);

//       //  DEBUG: Check what fields are coming
//       if (matchesData.length > 0) {
//         const firstUser = matchesData[0];
//         console.log("🔍 First user fields:", Object.keys(firstUser));
//         console.log("📍 Location fields:", {
//           city: firstUser.city,
//           state: firstUser.state,
//           country: firstUser.country,
//         });
//       }

//       setMatches(matchesData);
//     } catch (err) {
//       console.error("❌ Error fetching matches:", err);
//       setError(`Failed to load matches: ${err.message || "Network error"}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchMatches();
//   }, []);

//   //  LOAD MORE FUNCTION - SIMPLE
//   const loadMore = () => {
//     setLoadingMore(true);
//     setTimeout(() => {
//       setVisibleCount((prev) => prev + 20);
//       setLoadingMore(false);
//     }, 500);
//   };

//   //  RESET TO 20
//   const resetTo20 = () => {
//     setVisibleCount(20);
//   };

//   //  Get only visible matches
//   const visibleMatches = matches.slice(0, visibleCount);
//   const hasMore = visibleCount < matches.length;
//   const remaining = matches.length - visibleCount;

//   //  **API DATA से नाम बनाओ - FIXED**
//   const getDisplayName = (user) => {
//     if (!user) return "User";

//     // API में ये fields आ रही हैं:
//     // full_name, first_name, last_name
//     if (user.full_name && user.full_name.trim()) {
//       return user.full_name;
//     }

//     if (user.first_name || user.last_name) {
//       const name = `${user.first_name || ""} ${user.last_name || ""}`.trim();
//       return name;
//     }

//     if (user.profession && user.profession.trim()) {
//       return user.profession;
//     }

//     if (user.company && user.company.trim()) {
//       return user.company;
//     }

//     return `User ${user.user_id || user.id || ""}`;
//   };

//   //  **API DATA से profile image - FIXED**
//   const getProfileImage = (user) => {
//     if (!user) {
//       return "https://ui-avatars.com/api/?name=User&background=random&color=fff&size=150";
//     }

//     // API में image_url field है
//     if (user.image_url && user.image_url.trim()) {
//       return user.image_url;
//     }

//     // Fallback: Generate avatar from name
//     const displayName = getDisplayName(user);
//     const nameForAvatar = displayName.replace(/[^a-zA-Z0-9 ]/g, "");
//     const encodedName = encodeURIComponent(nameForAvatar || "User");

//     const avatarUrl = `https://ui-avatars.com/api/?name=${encodedName}&background=random&color=fff&bold=true&size=150`;
//     return avatarUrl;
//   };

//   //  **API DATA से location - FIXED**
//   const getLocation = (user) => {
//     if (!user) return "Location not set";

//     // API में city, state, country fields हैं
//     const locations = [];

//     if (user.city && user.city.trim()) {
//       locations.push(user.city);
//     }

//     if (user.state && user.state.trim()) {
//       if (!locations.includes(user.state)) {
//         locations.push(user.state);
//       }
//     }

//     if (user.country && user.country.trim()) {
//       if (!locations.includes(user.country)) {
//         locations.push(user.country);
//       }
//     }

//     if (locations.length > 0) {
//       return locations.join(", ");
//     }

//     return "Location not set";
//   };

//   //  **API DATA से skills - FIXED**
//   const getSkills = (user) => {
//     if (!user) return [];

//     // API में skills array आ रहा है
//     if (user.skills && Array.isArray(user.skills)) {
//       const validSkills = user.skills.filter(
//         (skill) => skill && typeof skill === "string" && skill.trim(),
//       );
//       return validSkills.slice(0, 5);
//     }

//     return [];
//   };

//   //  **API DATA से interests - FIXED**
//   const getInterests = (user) => {
//     if (!user) return [];

//     // API में interests array आ रहा है
//     if (user.interests && Array.isArray(user.interests)) {
//       const validInterests = user.interests.filter(
//         (interest) =>
//           interest && typeof interest === "string" && interest.trim(),
//       );
//       return validInterests.slice(0, 5);
//     }

//     return [];
//   };

//   //  **API DATA से hobbies - FIXED**
//   const getHobbies = (user) => {
//     if (!user) return [];

//     // API में hobbies array आ रहा है
//     if (user.hobbies && Array.isArray(user.hobbies)) {
//       const validHobbies = user.hobbies.filter(
//         (hobby) => hobby && typeof hobby === "string" && hobby.trim(),
//       );
//       return validHobbies.slice(0, 5);
//     }

//     return [];
//   };

//   // //  FIXED: View Profile Function - MemberPage jaisa
//   // const handleViewProfile = async (memberId, memberName = "") => {
//   //   try {
//   //     console.log("🎯 VIEW PROFILE FUNCTION CALLED");
//   //     console.log("Member Name:", memberName);
//   //     console.log("Member ID (user_id):", memberId);

//   //     // Find member from current list using user_id
//   //     const currentMember = matches.find((m) => m.user_id == memberId);

//   //     console.log("Found member data:", currentMember);

//   //     if (currentMember) {
//   //       //  Navigate with member data
//   //       navigate(`/dashboard/profile/${memberId}`, {
//   //         state: {
//   //           userProfile: currentMember,
//   //           memberId: memberId,
//   //           name: memberName,
//   //           from: "matches_page",
//   //         },
//   //       });
//   //       console.log(" Navigation successful");
//   //     } else {
//   //       console.log("❌ Member not found by user_id");
//   //       navigate(`/dashboard/profile/${memberId}`);
//   //     }
//   //   } catch (error) {
//   //     console.error("❌ Navigation error:", error);
//   //     navigate(`/dashboard/profile/${memberId}`);
//   //   }
//   // };

//   // const handleViewProfile = async (match) => {
//   //   try {
//   //     console.log("🎯 Getting complete profile data...");

//   //     const memberId = match.user_id || match.id;
//   //     const memberName = getDisplayName(match);

//   //     // Option A: Use existing match data (fast but incomplete)
//   //     navigate(`/dashboard/profile/${memberId}`, {
//   //       state: {
//   //         userProfile: match,  // Only has basic data
//   //         memberId: memberId,
//   //         name: memberName,
//   //         from: "matches_page"
//   //       }
//   //     });

//   const handleViewProfile = (match) => {
//     const memberId = match.user_id || match.id;
//     const memberName = getDisplayName(match);

//     console.log("🎯 Navigating to Profile with ID:", memberId);

//     navigate(`/dashboard/profile/${memberId}`, {
//       state: {
//         userProfile: match, // Summary data pass ho raha hai
//         memberId: memberId,
//         name: memberName,
//         from: "matches_page",
//       },
//     });
//   };

//   // Add this function to fetch complete profile
//   const fetchCompleteProfile = async (userId) => {
//     try {
//       const response = await adminAPI.getUserDetails(userId);
//       return response.data;
//     } catch (error) {
//       console.error("Error fetching complete profile:", error);
//       return null;
//     }
//   };

//   //  **API DATA से Stats calculation - FIXED**
//   const totalMatches = matches.length;
//   const onlineNow = matches.filter((match) => match.is_active === true).length;
//   const verifiedProfiles = matches.filter(
//     (match) => match.is_submitted === true,
//   ).length;
//   const averageMatchScore =
//     matches.length > 0
//       ? Math.round(
//           matches.reduce((sum, match) => sum + (match.match_score || 0), 0) /
//             matches.length,
//         )
//       : 0;

//   // Debug function
//   const debugUserData = (user) => {
//     console.log("=== USER DATA DEBUG ===");
//     console.log("ID:", user.id);
//     console.log("User ID:", user.user_id);
//     console.log("Full Name:", user.full_name);
//     console.log("First Name:", user.first_name);
//     console.log("Last Name:", user.last_name);
//     console.log("City:", user.city);
//     console.log("Profession:", user.profession);
//     console.log("Image URL:", user.image_url);
//     console.log("Match Score:", user.match_score);
//     console.log("Skills:", user.skills);
//     console.log("Interests:", user.interests);
//     console.log("Hobbies:", user.hobbies);
//     console.log("Is Active:", user.is_active);
//     console.log("Is Submitted:", user.is_submitted);
//     console.log("======================");
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 p-6">
//         <div className="max-w-7xl mx-auto">
//           <div className="mb-8">
//             <h1 className="text-3xl font-bold text-gray-800 mb-2">
//               My Matches
//             </h1>
//             <p className="text-gray-600">Loading real matches from API...</p>
//           </div>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//             {[1, 2, 3, 4].map((i) => (
//               <div
//                 key={i}
//                 className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse"
//               >
//                 <div className="w-full h-48 bg-gray-300"></div>
//                 <div className="p-4">
//                   <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
//                   <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
//                   <div className="flex gap-2">
//                     <div className="h-10 bg-gray-300 rounded flex-1"></div>
//                     <div className="w-10 h-10 bg-gray-300 rounded"></div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-800 mb-2">My Matches</h1>
//           <p className="text-gray-600">Find Your Perfect Match</p>

//           {/*  SHOWING INFO */}
//           <div className="mt-4 p-3 bg-white rounded-lg border shadow-sm">
//             <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
//               <div className="text-sm">
//                 <span className="text-gray-600">Showing </span>
//                 <span className="font-bold text-indigo-600">
//                   {Math.min(visibleCount, totalMatches)}
//                 </span>
//                 <span className="text-gray-600"> of </span>
//                 <span className="font-bold">{totalMatches}</span>
//                 <span className="text-gray-600"> matches</span>
//                 {hasMore && (
//                   <span className="ml-2 text-green-600">
//                     ({remaining} more available)
//                   </span>
//                 )}
//               </div>

//               {visibleCount > 20 && (
//                 <button
//                   onClick={resetTo20}
//                   className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200 transition"
//                 >
//                   Show Only 20
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>

//         {/*  Stats from REAL API DATA - FIXED */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
//           <div className="bg-white p-4 rounded-lg shadow-sm border">
//             <p className="text-2xl font-bold text-indigo-600">{totalMatches}</p>
//             <p className="text-gray-600 text-sm">Total Matches</p>
//           </div>
//           <div className="bg-white p-4 rounded-lg shadow-sm border">
//             <p className="text-2xl font-bold text-green-600">{onlineNow}</p>
//             <p className="text-gray-600 text-sm">Online Now</p>
//           </div>
//           <div className="bg-white p-4 rounded-lg shadow-sm border">
//             <p className="text-2xl font-bold text-blue-600">
//               {verifiedProfiles}
//             </p>
//             <p className="text-gray-600 text-sm">Verified Profiles</p>
//           </div>
//           <div className="bg-white p-4 rounded-lg shadow-sm border">
//             <p className="text-2xl font-bold text-purple-600">
//               {averageMatchScore * 10}%
//             </p>
//             <p className="text-gray-600 text-sm">Avg Match Score</p>
//           </div>
//         </div>

//         {/* Error Message */}
//         {error && (
//           <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
//             <p className="text-yellow-700">{error}</p>
//             <button
//               onClick={fetchMatches}
//               className="mt-2 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition text-sm"
//             >
//               Retry API Call
//             </button>
//           </div>
//         )}

//         {/*  REAL MATCHES GRID - FIXED */}
//         {visibleMatches.length === 0 ? (
//           <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
//             <div className="text-gray-400 text-5xl mb-4">👥</div>
//             <h3 className="text-xl font-semibold text-gray-700 mb-2">
//               No matches found
//             </h3>
//             <p className="text-gray-500 mb-6">The API returned 0 matches</p>
//             <button
//               onClick={fetchMatches}
//               className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
//             >
//               Refresh API Call
//             </button>
//           </div>
//         ) : (
//           <>
//             {/* Debug Button */}
//             <div className="mb-4 text-center">
//               <button
//                 onClick={() => debugUserData(visibleMatches[0])}
//                 className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300"
//               >
//                 Debug First User Data
//               </button>
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//               {visibleMatches.map((match, index) => {
//                 const displayName = getDisplayName(match);
//                 const location = getLocation(match);
//                 const profileImage = getProfileImage(match);
//                 const skills = getSkills(match);
//                 const interests = getInterests(match);
//                 const hobbies = getHobbies(match);
//                 const isOnline = match.is_active === true;
//                 const isVerified = match.is_submitted === true;

//                 return (
//                   <div
//                     key={match.id || match.user_id || index}
//                     className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100"
//                   >
//                     {/* Profile Image */}
//                     <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
//                       <img
//                         src={profileImage}
//                         alt={displayName}
//                         className="w-full h-full object-cover"
//                         onError={(e) => {
//                           e.target.onerror = null;
//                           const nameForAvatar = displayName.replace(
//                             /[^a-zA-Z0-9 ]/g,
//                             "",
//                           );
//                           const encodedName = encodeURIComponent(
//                             nameForAvatar || "User",
//                           );
//                           e.target.src = `https://ui-avatars.com/api/?name=${encodedName}&background=random&color=fff&size=150`;
//                         }}
//                       />

//                       {/* Online Status Badge */}
//                       {isOnline && (
//                         <div className="absolute top-3 right-3">
//                           <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
//                             <span className="w-2 h-2 bg-white rounded-full mr-1"></span>
//                             Online
//                           </span>
//                         </div>
//                       )}

//                       {/* Verified Badge */}
//                       {isVerified && (
//                         <div className="absolute top-3 left-3">
//                           <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
//                             <span className="mr-1">✓</span>
//                             Verified
//                           </span>
//                         </div>
//                       )}

//                       {/* Match Score Badge */}
//                       {match.match_score > 0 && (
//                         <div className="absolute bottom-3 right-3">
//                           <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs px-3 py-1 rounded-full font-bold">
//                             {match.match_score}/10
//                           </span>
//                         </div>
//                       )}
//                     </div>

//                     {/* Profile Info */}
//                     <div className="p-4">
//                       <div className="flex items-start justify-between mb-3">
//                         <div className="flex-1">
//                           <h3 className="font-bold text-lg text-gray-800">
//                             {displayName}
//                           </h3>

//                           {/* Profession */}
//                           {match.profession && (
//                             <p className="text-gray-600 font-medium text-sm mt-1">
//                               {match.profession}
//                             </p>
//                           )}

//                           {/* Age, Gender, Marital Status */}
//                           <div className="text-gray-500 text-sm mt-1 flex flex-wrap gap-2">
//                             {match.age && match.age > 0 && (
//                               <span>{match.age} yrs</span>
//                             )}
//                             {match.gender && <span>• {match.gender}</span>}
//                             {match.marital_status && (
//                               <span>• {match.marital_status}</span>
//                             )}
//                           </div>
//                         </div>

//                         {/* Like Button */}
//                         <button className="text-gray-400 hover:text-red-500 transition text-xl ml-2">
//                           ♡
//                         </button>
//                       </div>

//                       {/* Location */}
//                       {location !== "Location not set" && (
//                         <p className="text-gray-500 text-sm mb-3 flex items-center">
//                           <svg
//                             className="w-4 h-4 mr-1"
//                             fill="none"
//                             stroke="currentColor"
//                             viewBox="0 0 24 24"
//                           >
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth={1.5}
//                               d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
//                             />
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth={1.5}
//                               d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
//                             />
//                           </svg>
//                           {location}
//                         </p>
//                       )}

//                       {/* Company */}
//                       {match.company && (
//                         <p className="text-gray-500 text-sm mb-3 flex items-center">
//                           <svg
//                             className="w-4 h-4 mr-1"
//                             fill="none"
//                             stroke="currentColor"
//                             viewBox="0 0 24 24"
//                           >
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth={1.5}
//                               d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
//                             />
//                           </svg>
//                           {match.company}
//                         </p>
//                       )}

//                       {/* Skills/Interests/Hobbies Tags */}
//                       {(skills.length > 0 ||
//                         interests.length > 0 ||
//                         hobbies.length > 0) && (
//                         <div className="mb-4">
//                           <div className="flex flex-wrap gap-1 mb-2">
//                             {skills.slice(0, 3).map((skill, idx) => (
//                               <span
//                                 key={idx}
//                                 className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded"
//                               >
//                                 {skill}
//                               </span>
//                             ))}
//                             {interests.slice(0, 2).map((interest, idx) => (
//                               <span
//                                 key={idx}
//                                 className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded"
//                               >
//                                 {interest}
//                               </span>
//                             ))}
//                             {hobbies.slice(0, 2).map((hobby, idx) => (
//                               <span
//                                 key={idx}
//                                 className="text-xs bg-yellow-50 text-yellow-600 px-2 py-1 rounded"
//                               >
//                                 {hobby}
//                               </span>
//                             ))}
//                           </div>
//                         </div>
//                       )}

//                       <button
//                         onClick={() => handleViewProfile(match)}
//                         className="flex-1 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition text-sm font-medium"
//                       >
//                         View Profile
//                       </button>

//                       {/* 
//                        <button
//                         onClick={() => {
//                           console.log("🟢 MATCHES VIEW PROFILE CLICKED");
//                           console.log("match.user_id:", match.user_id);
//                           console.log("match:", match);

//                           // ✅ CORRECT: Pass user_id and name separately
//                           handleViewProfile(
//                             match.user_id,
//                             getDisplayName(match),
//                           );
//                         }}
//                         className="flex-1 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition text-sm font-medium"
//                       >
//                         View Profile
//                       </button>  */}

//                       <button
//                         onClick={() =>
//                           handleSendMessage(
//                             match.user_id || match.id,
//                             getDisplayName(match),
//                           )
//                         }
//                         className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
//                       >
//                         Message
//                       </button>
//                     </div>
//                   </div>
//                   // </div>
//                 );
//               })}
//             </div>

//             {/* ✅ LOAD MORE BUTTON */}
//             {hasMore && (
//               <div className="text-center mt-8 mb-8">
//                 <button
//                   onClick={loadMore}
//                   disabled={loadingMore}
//                   className={`px-8 py-3 rounded-lg font-medium transition ${
//                     loadingMore
//                       ? "bg-indigo-400 text-white cursor-wait"
//                       : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg"
//                   }`}
//                 >
//                   {loadingMore ? (
//                     <>
//                       <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
//                       Loading...
//                     </>
//                   ) : (
//                     <>
//                       Load More (+{Math.min(20, remaining)})
//                       <svg
//                         className="w-4 h-4 inline ml-2"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M19 14l-7 7m0 0l-7-7m7 7V3"
//                         />
//                       </svg>
//                     </>
//                   )}
//                 </button>

//                 <p className="text-gray-500 text-sm mt-3">
//                   Showing {Math.min(visibleCount, totalMatches)} of{" "}
//                   {totalMatches} matches
//                 </p>
//               </div>
//             )}

//             {/* ✅ ALL LOADED MESSAGE */}
//             {!hasMore && totalMatches > 0 && (
//               <div className="text-center mt-8 mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
//                 <p className="text-green-700 font-medium">
//                   🎉 All {totalMatches} matches loaded!
//                 </p>
//                 {visibleCount > 20 && (
//                   <button
//                     onClick={resetTo20}
//                     className="mt-3 px-4 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200 text-sm"
//                   >
//                     Show Only 20
//                   </button>
//                 )}
//               </div>
//             )}

//             {/* Refresh Button */}
//             <div className="text-center mt-4">
//               <button
//                 className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
//                 onClick={fetchMatches}
//               >
//                 Refresh API Data
//               </button>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

