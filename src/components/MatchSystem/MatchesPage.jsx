import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getSuggestedMatches } from "../services/chatApi";
// import { chatApi } from "../services/chatApi";
import ProfileViews from "../pages/ProfileViews";


export default function MatchesPage() {
  const navigate = useNavigate();

  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //  1. FIRST - Define handleSendMessage function HERE
  const handleSendMessage = async (memberId, memberName = "") => {
    try {
      console.log("💬 CHAT CLICKED for:", memberName, "ID:", memberId);

      // Navigate to messages page with user info
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
      // Fallback navigation
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

  // API se data fetch karne ke liye function hai yeh
  const fetchMatches = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("🔄 Fetching matches from API...");
      const apiData = await getSuggestedMatches();
      console.log("📦 API Response:", apiData);

      // API response format check karne k liye
      if (apiData && Array.isArray(apiData)) {
        console.log(` Found ${apiData.length} matches`);

        // Log first match details for debugging
        if (apiData.length > 0) {
          console.log("First match details:", {
            id: apiData[0].id,
            user_id: apiData[0].user_id,
            full_name: apiData[0].full_name,
            city: apiData[0].city,
            profession: apiData[0].profession,
            first_name: apiData[0].first_name,
            last_name: apiData[0].last_name,
            image_url: apiData[0].image_url,
            match_score: apiData[0].match_score,
          });
        }

        setMatches(apiData);
      } else if (apiData && apiData.matches) {
        // If response has { matches: [...] } format
        console.log(
          ` Found ${apiData.matches.length} matches in matches property`
        );
        setMatches(apiData.matches);
      } else {
        console.warn("⚠️ Unexpected API response format:", apiData);
        setError("Invalid data format from server");
        setMatches([]);
      }

      setLoading(false);
    } catch (err) {
      console.error("❌ API Error:", err);
      setError(`Failed to load matches: ${err.message || "Network error"}`);
      setMatches([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  //  **API DATA से नाम बनाओ - FIXED**
  const getDisplayName = (user) => {
    if (!user) return "User";

    console.log("Getting name for user:", user);

    // API में ये fields आ रही हैं:
    // full_name, first_name, last_name
    if (user.full_name && user.full_name.trim()) {
      console.log("Using full_name:", user.full_name);
      return user.full_name;
    }

    if (user.first_name || user.last_name) {
      const name = `${user.first_name || ""} ${user.last_name || ""}`.trim();
      console.log("Using first_name + last_name:", name);
      return name;
    }

    if (user.profession && user.profession.trim()) {
      console.log("Using profession as name:", user.profession);
      return user.profession;
    }

    if (user.company && user.company.trim()) {
      console.log("Using company as name:", user.company);
      return user.company;
    }

    console.log("Using default name");
    return `User ${user.user_id || user.id || ""}`;
  };

  //  **API DATA से profile image - FIXED**
  const getProfileImage = (user) => {
    if (!user) {
      return "https://ui-avatars.com/api/?name=User&background=random&color=fff&size=150";
    }

    // API में image_url field है
    if (user.image_url && user.image_url.trim()) {
      console.log("Using image_url from API:", user.image_url);
      return user.image_url;
    }

    // Fallback: Generate avatar from name
    const displayName = getDisplayName(user);
    const nameForAvatar = displayName.replace(/[^a-zA-Z0-9 ]/g, "");
    const encodedName = encodeURIComponent(nameForAvatar || "User");

    const avatarUrl = `https://ui-avatars.com/api/?name=${encodedName}&background=random&color=fff&bold=true&size=150`;
    console.log("Generated avatar URL:", avatarUrl);

    return avatarUrl;
  };

  //  **API DATA से location - FIXED**
  const getLocation = (user) => {
    if (!user) return "Location not set";

    // API में city, state, country fields हैं
    const locations = [];

    if (user.city && user.city.trim()) {
      locations.push(user.city);
    }

    if (user.state && user.state.trim()) {
      if (!locations.includes(user.state)) {
        locations.push(user.state);
      }
    }

    if (user.country && user.country.trim()) {
      if (!locations.includes(user.country)) {
        locations.push(user.country);
      }
    }

    if (locations.length > 0) {
      console.log("Location found:", locations.join(", "));
      return locations.join(", ");
    }

    console.log("No location found");
    return "Location not set";
  };

  //  **API DATA से skills - FIXED**
  const getSkills = (user) => {
    if (!user) return [];

    console.log("Getting skills for user:", user.skills);

    // API में skills array आ रहा है
    if (user.skills && Array.isArray(user.skills)) {
      const validSkills = user.skills.filter(
        (skill) => skill && typeof skill === "string" && skill.trim()
      );
      console.log("Skills array found:", validSkills);
      return validSkills.slice(0, 5); // Max 5 skills
    }

    return [];
  };

  //  **API DATA से interests - FIXED**
  const getInterests = (user) => {
    if (!user) return [];

    console.log("Getting interests for user:", user.interests);

    // API में interests array आ रहा है
    if (user.interests && Array.isArray(user.interests)) {
      const validInterests = user.interests.filter(
        (interest) =>
          interest && typeof interest === "string" && interest.trim()
      );
      console.log("Interests array found:", validInterests);
      return validInterests.slice(0, 5); // Max 5 interests
    }

    return [];
  };

  //  **API DATA से hobbies - FIXED**
  const getHobbies = (user) => {
    if (!user) return [];

    console.log("Getting hobbies for user:", user.hobbies);

    // API में hobbies array आ रहा है
    if (user.hobbies && Array.isArray(user.hobbies)) {
      const validHobbies = user.hobbies.filter(
        (hobby) => hobby && typeof hobby === "string" && hobby.trim()
      );
      console.log("Hobbies array found:", validHobbies);
      return validHobbies.slice(0, 5); // Max 5 hobbies
    }

    return [];
  };

  //  FIXED: View Profile Function with proper data passing
  const handleViewProfile = async (user) => {  // ✅ async add kiya
    console.log("🎯 View Profile clicked for user:", user);

    try {
      // Ensure user data exists
      if (!user) {
        console.error("❌ No user data available");
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

      // // ✅ 1. FIRST: Track profile view API call - ADDED
      // console.log('🚀 Calling profile view API for user ID:', userId);
      // try {
      //   // Import recentApi karna hoga agar nahi hai to top mein
      //   // import { recentApi } from '../services/api'; 
      //   const apiResponse = await ProfileViews.trackProfileView(userId);
      //   console.log('✅ Profile view API success:', apiResponse);
      // } catch (apiError) {
      //   console.warn('⚠️ Profile view API failed, but continuing navigation:', apiError);
      //   // API fail hone par bhi navigation continue rahega
      // }

      // ✅ 2. Navigate with COMPLETE user data
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

      console.log("Navigation successful with data");
    } catch (error) {
      console.error("❌ Navigation error:", error);
      // Fallback navigation without data
      navigate(`/dashboard/profile/${user?.user_id || user?.id}`);
    }
  };




  //  FIXED: View Profile Function with proper data passing
  // const handleViewProfile = (user) => {
  //   console.log("🎯 View Profile clicked for user:", user);

  //   try {
  //     // Ensure user data exists
  //     if (!user) {
  //       console.error("❌ No user data available");
  //       navigate(`/dashboard/profile/${user?.user_id || user?.id}`);
  //       return;
  //     }

  //     const userId = user.user_id || user.id;
  //     const userName =
  //       user.full_name ||
  //       `${user.first_name || ""} ${user.last_name || ""}`.trim();

  //     console.log("📤 Sending user data to profile page:", {
  //       userId,
  //       userName,
  //       userData: user,
  //     });

  

  //     //  Navigate with COMPLETE user data
  //     navigate(`/dashboard/profile/${userId}`, {
  //       state: {
  //         // Complete user object
  //         userProfile: user,
  //         // Individual fields for easy access
  //         profileData: {
  //           id: user.id,
  //           user_id: user.user_id,
  //           full_name: user.full_name,
  //           first_name: user.first_name,
  //           last_name: user.last_name,
  //           gender: user.gender,
  //           age: user.age,
  //           dob: user.dob,
  //           marital_status: user.marital_status,
  //           profession: user.profession,
  //           company: user.company,
  //           education: user.education,
  //           city: user.city,
  //           state: user.state,
  //           country: user.country,
  //           address: user.address,
  //           image_url: user.image_url,
  //           about: user.about,
  //           headline: user.headline,
  //           hobbies: user.hobbies || [],
  //           interests: user.interests || [],
  //           skills: user.skills || [],
  //           experience: user.experience,
  //           match_score: user.match_score,
  //           phone: user.phone,
  //           email: user.email,
  //           is_active: user.is_active,
  //           is_submitted: user.is_submitted,
  //           created_at: user.created_at,
  //           updated_at: user.updated_at,
  //         },
  //         // Metadata
  //         from: "suggested_matches",
  //         timestamp: new Date().toISOString(),
  //         memberId: userId,
  //         name: userName,
  //       },
  //     });

  //     console.log("Navigation successful with data");
  //   } catch (error) {
  //     console.error("❌ Navigation error:", error);
  //     // Fallback navigation without data
  //     navigate(`/dashboard/profile/${user?.user_id || user?.id}`);
  //   }
  // };


  //  **API DATA से Stats calculation - FIXED**
  const totalMatches = matches.length;
  const onlineNow = matches.filter((match) => match.is_active === true).length;
  const verifiedProfiles = matches.filter(
    (match) => match.is_submitted === true
  ).length;
  const averageMatchScore =
    matches.length > 0
      ? Math.round(
          matches.reduce((sum, match) => sum + (match.match_score || 0), 0) /
            matches.length
        )
      : 0;

  // Debug function
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              My Matches
            </h1>
            <p className="text-gray-600">Loading real matches from API...</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse"
              >
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

          {/* API Data Info */}
          {/* <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-lg border border-green-200 text-sm">
            <div className="font-semibold mb-1"> Real API Data Loaded</div>
            <p><strong>Backend:</strong> https://backend-q0wc.onrender.com</p>
            <p><strong>Total Matches:</strong> {totalMatches} real profiles</p>
            <p><strong>Data Format:</strong> Using API response directly</p>
          </div>*/}
        </div>

        {/*  Stats from REAL API DATA - FIXED */}
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
            <p className="text-2xl font-bold text-blue-600">
              {verifiedProfiles}
            </p>
            <p className="text-gray-600 text-sm">Verified Profiles</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <p className="text-2xl font-bold text-purple-600">
              {averageMatchScore * 10}%
            </p>
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

        {/*  REAL MATCHES GRID - FIXED */}
        {matches.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
            <div className="text-gray-400 text-5xl mb-4">👥</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No matches found
            </h3>
            <p className="text-gray-500 mb-6">The API returned 0 matches</p>
            <button
              onClick={fetchMatches}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Refresh API Call
            </button>
          </div>
        ) : (
          <>
            {/* Debug Button */}
            <div className="mb-4 text-center">
              <button
                onClick={() => debugUserData(matches[0])}
                className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300"
              >
                Debug First User Data
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {matches.map((match, index) => {
                const displayName = getDisplayName(match);
                const location = getLocation(match);
                const profileImage = getProfileImage(match);
                const skills = getSkills(match);
                const interests = getInterests(match);
                const hobbies = getHobbies(match);
                const isOnline = match.is_active === true;
                const isVerified = match.is_submitted === true;

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
                          const nameForAvatar = displayName.replace(
                            /[^a-zA-Z0-9 ]/g,
                            ""
                          );
                          const encodedName = encodeURIComponent(
                            nameForAvatar || "User"
                          );
                          e.target.src = `https://ui-avatars.com/api/?name=${encodedName}&background=random&color=fff&size=150`;
                        }}
                      />

                      {/* Online Status Badge */}
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

                      {/* Match Score Badge */}
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
                          <h3 className="font-bold text-lg text-gray-800">
                            {displayName}
                          </h3>

                          {/* Profession */}
                          {match.profession && (
                            <p className="text-gray-600 font-medium text-sm mt-1">
                              {match.profession}
                            </p>
                          )}

                          {/* Age, Gender, Marital Status */}
                          <div className="text-gray-500 text-sm mt-1 flex flex-wrap gap-2">
                            {match.age && match.age > 0 && (
                              <span>{match.age} yrs</span>
                            )}
                            {match.gender && <span>• {match.gender}</span>}
                            {match.marital_status && (
                              <span>• {match.marital_status}</span>
                            )}
                          </div>
                        </div>

                        {/* Like Button */}
                        <button className="text-gray-400 hover:text-red-500 transition text-xl ml-2">
                          ♡
                        </button>
                      </div>

                      {/* Location */}
                      {location !== "Location not set" && (
                        <p className="text-gray-500 text-sm mb-3 flex items-center">
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
                          {location}
                        </p>
                      )}

                      {/* Company */}
                      {match.company && (
                        <p className="text-gray-500 text-sm mb-3 flex items-center">
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
                              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            />
                          </svg>
                          {match.company}
                        </p>
                      )}

                      {/* Skills/Interests/Hobbies Tags */}
                      {(skills.length > 0 ||
                        interests.length > 0 ||
                        hobbies.length > 0) && (
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-1 mb-2">
                            {skills.slice(0, 3).map((skill, idx) => (
                              <span
                                key={idx}
                                className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded"
                              >
                                {skill}
                              </span>
                            ))}
                            {interests.slice(0, 2).map((interest, idx) => (
                              <span
                                key={idx}
                                className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded"
                              >
                                {interest}
                              </span>
                            ))}
                            {hobbies.slice(0, 2).map((hobby, idx) => (
                              <span
                                key={idx}
                                className="text-xs bg-yellow-50 text-yellow-600 px-2 py-1 rounded"
                              >
                                {hobby}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* About (shortened) */}
                      {/* {match.about && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {match.about.length > 60 ? match.about.substring(0, 60) + '...' : match.about}
                        </p>
                      )} */}

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewProfile(match)}
                          className="flex-1 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition text-sm font-medium"
                        >
                          View Profile
                        </button>

                        {/*                         
                         <button
                          onClick={() =>
                            handleSendMessage(memberId, memberName)
                          }
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
                        >
                          Message
                        </button>  */}

                        <button
                          onClick={() =>
                            handleSendMessage(
                              match.user_id || match.id,
                              getDisplayName(match)
                            )
                          }
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

            {/* Refresh Button */}
            <div className="text-center mt-8">
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
