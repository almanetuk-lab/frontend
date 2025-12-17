import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getSuggestedMatches } from "../services/chatApi";

const SuggestedMatches = () => {
  const navigate = useNavigate();

  // State
  const [suggestedMatches, setSuggestedMatches] = useState([]);
  const [loading, setLoading] = useState(false); // Start with false
  const [error, setError] = useState(null);

  // Fetch matches on component mount
  useEffect(() => {
    console.log(" Component mounted");
    fetchMatches();
  }, []);

  // Fetch matches function
  const fetchMatches = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("🔄 Fetching matches...");

      // API call
      const matches = await getSuggestedMatches();
      console.log("📦 Matches received from API:", matches);
      console.log("📊 Type of matches:", typeof matches);
      console.log("🔢 Is array?", Array.isArray(matches));
      console.log("🔢 Length:", matches?.length || 0);

      if (matches && Array.isArray(matches)) {
        console.log(" Setting matches to state:", matches.length);
        setSuggestedMatches(matches);
      } else {
        console.warn(" Matches is not an array:", matches);
        setSuggestedMatches([]);
      }
    } catch (err) {
      console.error(" Error in fetchMatches:", err);
      setError(err.message || "Failed to load matches.");
    } finally {
      setLoading(false);
    }
  };

  //  FIXED: View Profile Function with proper data passing
  const handleViewProfile = (user) => {
    console.log(" View Profile clicked for user:", user);

    try {
      // Ensure user data exists
      if (!user) {
        console.error(" No user data available");
        navigate(`/dashboard/profile/${user?.user_id || user?.id}`);
        return;
      }

      const userId = user.user_id || user.id;
      const userName =
        user.full_name ||
        `${user.first_name || ""} ${user.last_name || ""}`.trim();

      console.log("📤 Sending user data to profile page:", {
        userId,
        userName,
        userData: user,
      });

      //  Navigate with COMPLETE user data
      navigate(`/dashboard/profile/${userId}`, {
        state: {
          // Complete user object
          userProfile: user,
          // Individual fields for easy access
          profileData: {
            id: user.id,
            user_id: user.user_id,
            full_name: user.full_name,
            first_name: user.first_name,
            last_name: user.last_name,
            gender: user.gender,
            age: user.age,
            dob: user.dob,
            marital_status: user.marital_status,
            profession: user.profession,
            company: user.company,
            education: user.education,
            city: user.city,
            state: user.state,
            country: user.country,
            address: user.address,
            image_url: user.image_url,
            about: user.about,
            headline: user.headline,
            hobbies: user.hobbies || [],
            interests: user.interests || [],
            skills: user.skills || [],
            experience: user.experience,
            match_score: user.match_score,
            phone: user.phone,
            email: user.email,
            is_active: user.is_active,
            is_submitted: user.is_submitted,
            created_at: user.created_at,
            updated_at: user.updated_at,
          },
          // Metadata
          from: "suggested_matches",
          timestamp: new Date().toISOString(),
          memberId: userId,
          name: userName,
        },
      });

      console.log(" Navigation successful with data");
    } catch (error) {
      console.error("❌ Navigation error:", error);
      // Fallback navigation without data
      navigate(`/dashboard/profile/${user?.user_id || user?.id}`);
    }
  };

  // Helper function to get full name
  const getFullName = (user) => {
    if (!user) return "User";

    // API se yeh fields aa rahi hain: first_name, last_name, full_name
    if (user.full_name) return user.full_name;
    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    if (user.first_name) return user.first_name;
    if (user.last_name) return user.last_name;

    return `User ${user.user_id || user.id || ""}`;
  };

  // Helper function to get location (SIRF CITY)
  const getLocation = (user) => {
    if (!user) return "Location not set";

    // SIRF CITY return karna hai
    if (user.city) return user.city;

    return "Location not set";
  };

  // Helper function to get profession
  const getProfession = (user) => {
    if (!user) return "Profession not set";

    if (user.profession) return user.profession;

    return "Profession not set";
  };

  // Handle connect button click
  // const handleConnect = async (user) => {
  //   try {
  //     console.log("Connecting with:", user.full_name);
  //     // Your connection logic here
  //     alert(`Connected with ${getFullName(user)}`);
  //   } catch (err) {
  //     console.error("Connection failed:", err);
  //   }
  // };

  // Handle view all
  const handleViewAll = () => {
    navigate("/dashboard/matches");
  };

  // Handle user card click
  const handleUserClick = (user) => {
    const userId = user.user_id || user.id;
    if (userId) {
      navigate(`/profile/${userId}`);
    }
  };

  // Debug: Log when state changes
  useEffect(() => {
    console.log(" State updated - suggestedMatches:", suggestedMatches);
  }, [suggestedMatches]);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
        {/* Debug Info */}
        {/* <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-lg border border-blue-200 text-xs">
          <div className="font-semibold mb-1">Debug Info: ik</div>
          <div>Loading: {loading ? "Yes" : "No"}</div>
          <div>Error: {error || "None"}</div>
          <div>Matches in state: {suggestedMatches.length}</div>
          <div>First match: {suggestedMatches[0] ? getFullName(suggestedMatches[0]) : "None"}</div>
        </div> */}

        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-800">
              Suggested Matches
            </h3>
            <p className="text-sm text-gray-500 mt-1">People you might like</p>
          </div>
          <div className="px-3 py-1 bg-indigo-100 text-indigo-600 rounded-full text-sm font-medium">
            {suggestedMatches.length} matches
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center p-4 animate-pulse">
                <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
                <div className="w-16 h-8 bg-gray-200 rounded-full"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          // Error State
          <div className="text-center py-6">
            <div className="text-red-500 mb-3">
              <div className="text-lg mb-1">⚠️</div>
              {error}
            </div>
            <button
              onClick={fetchMatches}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Try Again
            </button>
          </div>
        ) : suggestedMatches.length === 0 ? (
          // No Matches State
          <div className="text-center py-8">
            <div className="text-gray-400 mb-4 text-4xl">👥</div>
            <p className="text-gray-600 mb-2">No suggested matches found</p>
            <button
              onClick={fetchMatches}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm"
            >
              Refresh
            </button>
          </div>
        ) : (
          //  SHOW MATCHES (SIRF 3 FIELDS)
          <div className="space-y-3">
            {suggestedMatches.slice(0, 5).map((user, index) => {
              const fullName = getFullName(user);
              const city = getLocation(user); // SIRF CITY
              const profession = getProfession(user);

              console.log(`User ${index}:`, {
                fullName,
                city,
                profession,
                userData: user,
              });

              return (
                <div
                  key={user.id || index}
                  className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200 border border-gray-100"
                >
                  {/* Profile Image */}
                  <div
                    className="relative mr-4 cursor-pointer"
                    onClick={() => handleUserClick(user)}
                  >
                    {user.image_url ? (
                      <img
                        src={user.image_url}
                        alt={fullName}
                        className="w-12 h-12 rounded-full object-cover border-2 border-white"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                        {fullName.charAt(0)}
                      </div>
                    )}
                  </div>
                  {/* User Info - SIRF 3 FIELDS */}
                  <div
                    className="flex-1 cursor-pointer"
                    onClick={() => handleUserClick(user)}
                  >
                    <h4 className="font-semibold text-gray-800 text-lg">
                      {fullName}
                    </h4>

                    <p className="text-gray-600 font-medium">{profession}</p>

                    <div className="flex items-center text-gray-500 text-sm mt-1">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span>{city}</span>
                    </div>
                  </div>

                  {/* Connect Button */}

                  <button
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition"
                    onClick={() => handleViewProfile(user)}
                  >
                    View Profile
                  </button>

                  {/* <button 
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition"
                    onClick={() => handleViewProfile(user)}
                  >
                  View Profile
                  </button> */}
                </div>
              );
            })}
          </div>
        )}

        {/* View All Button */}
        {!loading && !error && suggestedMatches.length > 0 && (
          <button
            onClick={handleViewAll}
            className="w-full mt-6 py-3 text-center text-blue-600 font-medium border-t border-gray-200 hover:text-blue-700 transition"
          >
            View All Matches ({suggestedMatches.length})
          </button>
        )}

        {/* Refresh Button */}
        <div className="text-center mt-4">
          <button
            onClick={fetchMatches}
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center justify-center mx-auto"
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuggestedMatches;


