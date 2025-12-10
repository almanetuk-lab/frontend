// src/components/dashboard/SuggestedMatches.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getSuggestedMatches } from "../services/chatApi";

const SuggestedMatches = () => {
  const navigate = useNavigate();
  
  // State
  const [suggestedMatches, setSuggestedMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connectingUserId, setConnectingUserId] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Fetch matches on component mount
  useEffect(() => {
    fetchMatches();
  }, []);

  // Fetch matches function
  const fetchMatches = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);
      
      console.log("Starting to fetch matches...");
      const matches = await getSuggestedMatches();
      console.log("Matches fetched successfully:", matches);
      
      setSuggestedMatches(matches || []);
    } catch (err) {
      console.error("Error in fetchMatches:", err);
      setError(err.message || "Failed to load matches. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get full name
  const getFullName = (user) => {
    if (!user) return "User";
    
    // Check for name in different possible fields
    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    if (user.first_name) return user.first_name;
    if (user.last_name) return user.last_name;
    if (user.name) return user.name;
    if (user.full_name) return user.full_name;
    
    return `User ${user.user_id || user.id}`;
  };

  // Helper function to get location
  const getLocation = (user) => {
    if (!user) return "Location not set";
    
    if (user.city && user.state) {
      return `${user.city}, ${user.state}`;
    }
    if (user.city) return user.city;
    if (user.state) return user.state;
    if (user.country) return user.country;
    
    return "Location not set";
  };

  // Helper function to get profession
  const getProfession = (user) => {
    if (!user) return "Profession not set";
    
    if (user.profession) return user.profession;
    if (user.headline) return user.headline;
    if (user.company) return user.company;
    
    return "Profession not set";
  };

  // Handle connect button click
  const handleConnect = async (user) => {
    try {
      setConnectingUserId(user.user_id || user.id);
      setSuccessMessage(null);
      
      console.log(`Connecting with user: ${user.user_id || user.id}`);
      await connectWithUser(user.user_id || user.id);
      
      setSuccessMessage(`Connected with ${getFullName(user)} successfully!`);
      
      // Remove the user from suggestions after connecting
      setSuggestedMatches(prev => 
        prev.filter(match => 
          (match.user_id || match.id) !== (user.user_id || user.id)
        )
      );
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      
    } catch (err) {
      console.error("Connection failed:", err);
      setError("Failed to connect. Please try again.");
    } finally {
      setConnectingUserId(null);
    }
  };

  // Handle view all
  const handleViewAll = () => {
    navigate("/dashboard/matches");
  };

  // Handle user card click (navigate to profile)
  const handleUserClick = (user) => {
    navigate(`/profile/${user.user_id || user.id}`);
  };

  // Debug: Log data when it changes
  useEffect(() => {
    if (suggestedMatches.length > 0) {
      console.log("Current matches in state:", suggestedMatches);
      console.log("First match details:", {
        id: suggestedMatches[0].id,
        user_id: suggestedMatches[0].user_id,
        first_name: suggestedMatches[0].first_name,
        last_name: suggestedMatches[0].last_name,
        city: suggestedMatches[0].city,
        image_url: suggestedMatches[0].image_url,
        profession: suggestedMatches[0].profession
      });
    }
  }, [suggestedMatches]);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
        {/* Success Message */}
        {successMessage && (
          <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg border border-green-200">
            ✅ {successMessage}
          </div>
        )}
        
        {/* Debug Info (Remove in production) */}
        <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-lg border border-blue-200 text-xs">
          <div className="font-semibold mb-1">Debug Info:</div>
          <div>Total matches: {suggestedMatches.length}</div>
          <div>Loading: {loading ? "Yes" : "No"}</div>
          <div>Error: {error || "None"}</div>
          {suggestedMatches.length > 0 && (
            <div className="mt-2">
              First user: {getFullName(suggestedMatches[0])} | 
              City: {suggestedMatches[0].city || "N/A"} | 
              Image: {suggestedMatches[0].image_url ? "Yes" : "No"}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Suggested Matches
          </h3>
          <span className="text-sm text-indigo-600 font-medium">
            {suggestedMatches.length} matches
          </span>
        </div>
        
        {loading ? (
          // Loading State
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
                <div className="w-8 h-6 bg-gray-300 rounded-full"></div>
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
            <p className="text-sm text-gray-500 mb-4">
              Complete your profile to get better matches
            </p>
            <button
              onClick={fetchMatches}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm"
            >
              Refresh
            </button>
          </div>
        ) : (
          // Matches List (Show max 5)
          <div className="space-y-4">
            {suggestedMatches.slice(0, 5).map((user) => {
              const fullName = getFullName(user);
              const location = getLocation(user);
              const profession = getProfession(user);
              const isConnecting = connectingUserId === (user.user_id || user.id);
              
              return (
                <div
                  key={user.id || user.user_id}
                  className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200 border border-transparent hover:border-gray-200"
                >
                  {/* Profile Image/Initial */}
                  <div 
                    className="relative mr-3 cursor-pointer"
                    onClick={() => handleUserClick(user)}
                  >
                    {user.image_url ? (
                      <img 
                        src={user.image_url} 
                        alt={fullName}
                        className="w-10 h-10 rounded-full object-cover border-2 border-white"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : null}
                    
                    {/* Fallback Avatar */}
                    <div 
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${user.image_url ? 'hidden' : 'flex'} ${user.gender === 'Female' ? 'bg-gradient-to-br from-pink-500 to-rose-600' : 'bg-gradient-to-br from-blue-500 to-indigo-600'}`}
                    >
                      {fullName.charAt(0).toUpperCase()}
                    </div>
                    
                    {/* Online Status */}
                    {user.is_active && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  
                  {/* User Info */}
                  <div 
                    className="flex-1 cursor-pointer"
                    onClick={() => handleUserClick(user)}
                  >
                    <h4 className="font-medium text-gray-800 flex items-center">
                      {fullName}
                      {user.age && (
                        <span className="ml-2 text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                          {user.age} years
                        </span>
                      )}
                      {user.gender && (
                        <span className="ml-2 text-xs text-gray-500">
                          ({user.gender})
                        </span>
                      )}
                    </h4>
                    
                    <p className="text-sm text-gray-600 truncate">
                      {profession}
                      {user.company && ` • ${user.company}`}
                    </p>
                    
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <span className="mr-1">📍</span>
                      <span>{location}</span>
                      
                      {user.match_score !== undefined && user.match_score !== null && (
                        <span className="ml-3 bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">
                          Match: {user.match_score}/10
                        </span>
                      )}
                      
                      {user.skills && user.skills.length > 0 && (
                        <span className="ml-2 text-xs">
                          🛠️ {user.skills[0]}
                          {user.skills.length > 1 && ` +${user.skills.length - 1}`}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Connect Button */}
                  <button 
                    className={`px-3 py-1 text-sm rounded-full transition flex-shrink-0 ${isConnecting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
                    onClick={() => handleConnect(user)}
                    disabled={isConnecting}
                  >
                    {isConnecting ? (
                      <span className="flex items-center">
                        <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></span>
                        ...
                      </span>
                    ) : (
                      '+ Connect'
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
        
        {/* View All Button */}
        {!loading && !error && suggestedMatches.length > 0 && (
          <button
            onClick={handleViewAll}
            className="w-full mt-4 p-3 text-center text-blue-600 font-medium border-t border-gray-100 pt-4 hover:bg-gray-50 rounded-b-lg transition flex items-center justify-center"
          >
            View All Matches ({suggestedMatches.length})
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
        
        {/* Refresh Button */}
        {!loading && !error && suggestedMatches.length > 0 && (
          <div className="text-center mt-4">
            <button
              onClick={fetchMatches}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              ↻ Refresh Suggestions
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuggestedMatches;






// import React, { useState, useEffect } from 'react';
// import { getSuggestedMatches } from '../services/chatApi';
// import { useNavigate } from 'react-router-dom';

// const SuggestedMatches = () => {
//   const [suggestedMatches, setSuggestedMatches] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   // Fetch matches
//   useEffect(() => {
//     fetchMatches();
//   }, []);

//   const fetchMatches = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const response = await getSuggestedMatches();
      
//       console.log("API Response:", response); // Debugging
      
//       // Handle different API response structures
//       let matchesArray = [];
      
//       // Case 1: Direct array
//       if (Array.isArray(response)) {
//         matchesArray = response;
//       }
//       // Case 2: Object with data property
//       else if (response && typeof response === 'object') {
//         if (response.data && Array.isArray(response.data)) {
//           matchesArray = response.data;
//         } else if (response.users && Array.isArray(response.users)) {
//           matchesArray = response.users;
//         } else if (response.matches && Array.isArray(response.matches)) {
//           matchesArray = response.matches;
//         } else if (response.id || response.user_id) {
//           // Single user object
//           matchesArray = [response];
//         }
//       }
      
//       console.log("Matches Array:", matchesArray); // Debugging
      
//       // Process each user to ensure correct data structure
//       const processedMatches = matchesArray.map(user => {
//         // Extract full name
//         let fullName = '';
//         if (user.first_name && user.last_name) {
//           fullName = `${user.first_name} ${user.last_name}`;
//         } else if (user.name) {
//           fullName = user.name;
//         } else if (user.username) {
//           fullName = user.username;
//         } else {
//           fullName = `User ${user.id || user.user_id || 'Unknown'}`;
//         }
        
//         // Extract profession
//         const profession = user.profession || user.job_title || user.designation || user.occupation || 'Profession not set';
        
//         // Extract city
//         const city = user.city || user.location || user.current_city || user.address?.city || 'City not specified';
        
//         // Extract profile photo
//         const profilePhoto = user.profilePhoto || user.profile_pic || user.avatar || user.profile_image || user.image_url || null;
        
//         return {
//           id: user.id || user.user_id || Math.random().toString(),
//           full_name: fullName,
//           profession: profession,
//           city: city,
//           profilePhoto: profilePhoto,
//           // Keep original data
//           ...user
//         };
//       });
      
//       // Take only first 5 users
//       const limitedMatches = processedMatches.slice(0, 5);
//       setSuggestedMatches(limitedMatches);
      
//     } catch (err) {
//       console.error('Error fetching matches:', err);
//       setError('Failed to load matches. Please try again.');
      
//       // Fallback dummy data for testing
//       setSuggestedMatches([
//         {
//           id: 1,
//           full_name: "Aarav Sharma",
//           profession: "Backend Developer",
//           city: "Bangalore",
//           profilePhoto: null
//         },
//         {
//           id: 2,
//           full_name: "Priya Patel",
//           profession: "Frontend Developer",
//           city: "Mumbai",
//           profilePhoto: null
//         },
//         {
//           id: 3,
//           full_name: "Rohan Verma",
//           profession: "DevOps Engineer",
//           city: "Delhi",
//           profilePhoto: null
//         },
//         {
//           id: 4,
//           full_name: "Anjali Singh",
//           profession: "UI/UX Designer",
//           city: "Pune",
//           profilePhoto: null
//         },
//         {
//           id: 5,
//           full_name: "Vikram Joshi",
//           profession: "Full Stack Developer",
//           city: "Hyderabad",
//           profilePhoto: null
//         }
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
//       <div className="flex items-center justify-between mb-4">
//         <h3 className="text-lg font-semibold text-gray-800">Suggested Matches</h3>
//         <span className="text-sm text-indigo-600 font-medium">
//           {suggestedMatches.length} matches
//         </span>
//       </div>

//       {loading ? (
//         // Loading skeleton
//         <div className="space-y-4">
//           {[1, 2, 3, 4, 5].map((i) => (
//             <div key={i} className="flex items-center p-3 bg-gray-50 rounded-lg animate-pulse">
//               <div className="w-12 h-12 bg-gray-300 rounded-full mr-3"></div>
//               <div className="flex-1">
//                 <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
//                 <div className="h-3 bg-gray-300 rounded w-32 mb-1"></div>
//                 <div className="h-3 bg-gray-300 rounded w-20"></div>
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : error ? (
//         <div className="text-center py-4">
//           <p className="text-red-500 mb-2">{error}</p>
//           <button
//             onClick={fetchMatches}
//             className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
//           >
//             Try Again
//           </button>
//         </div>
//       ) : (
//         // User list
//         <div className="space-y-4">
//           {suggestedMatches.map((user) => (
//             <div 
//               key={user.id} 
//               className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
//               onClick={() => navigate(`/profile/${user.id}`)}
//             >
//               {/* Profile Image or Avatar */}
//               <div className="relative flex-shrink-0 mr-3">
//                 {user.profilePhoto ? (
//                   <img 
//                     src={user.profilePhoto} 
//                     alt={user.full_name}
//                     className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
//                     onError={(e) => {
//                       // If image fails to load, show avatar instead
//                       e.target.style.display = 'none';
//                     }}
//                   />
//                 ) : null}
                
//                 {/* Fallback Avatar - Always show but hide if image loads */}
//                 <div 
//                   className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${user.profilePhoto ? 'hidden' : 'block'}`}
//                   style={{ 
//                     backgroundColor: `hsl(${user.id.charCodeAt(0) * 10}, 70%, 50%)` 
//                   }}
//                 >
//                   {user.full_name.charAt(0).toUpperCase()}
//                 </div>
//               </div>
              
//               {/* User Information */}
//               <div className="flex-1 min-w-0">
//                 <h4 className="font-semibold text-gray-800 truncate">
//                   {user.full_name}
//                 </h4>
//                 <p className="text-sm text-gray-600 truncate">
//                   {user.profession}
//                 </p>
//                 <p className="text-xs text-gray-500 flex items-center mt-1">
//                   <svg 
//                     className="w-3 h-3 mr-1" 
//                     fill="currentColor" 
//                     viewBox="0 0 20 20"
//                   >
//                     <path 
//                       fillRule="evenodd" 
//                       d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" 
//                       clipRule="evenodd" 
//                     />
//                   </svg>
//                   {user.city}
//                 </p>
//               </div>
              
//               {/* Connect Button */}
//               <button 
//                 className="flex-shrink-0 ml-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium rounded-full transition-colors shadow-sm"
//                 onClick={(e) => {
//                   e.stopPropagation(); // Prevent navigating to profile
//                   console.log("Connect with:", user.id);
//                   // Add your connect logic here
//                 }}
//               >
//                 Connect
//               </button>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* View All Button */}
//       {suggestedMatches.length > 0 && (
//         <button 
//           onClick={() => navigate("/dashboard/matches")}
//           className="w-full mt-4 p-3 text-center text-blue-600 font-medium border-t border-gray-200 pt-4 hover:bg-gray-50 rounded-b-lg transition-colors"
//         >
//           View All Matches
//         </button>
//       )}
//     </div>
//   );
// };

// export default SuggestedMatches;