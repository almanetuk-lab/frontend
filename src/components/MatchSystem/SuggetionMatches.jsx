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
    console.log("✅ Component mounted");
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
        console.log("✅ Setting matches to state:", matches.length);
        setSuggestedMatches(matches);
      } else {
        console.warn("⚠️ Matches is not an array:", matches);
        setSuggestedMatches([]);
      }
      
    } catch (err) {
      console.error("❌ Error in fetchMatches:", err);
      setError(err.message || "Failed to load matches.");
    } finally {
      setLoading(false);
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
    
    return `User ${user.user_id || user.id || ''}`;
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
    console.log("🔄 State updated - suggestedMatches:", suggestedMatches);
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
            <p className="text-sm text-gray-500 mt-1">
              People you might like
            </p>
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
          // ✅ SHOW MATCHES (SIRF 3 FIELDS)
          <div className="space-y-3">
            {suggestedMatches.slice(0, 5).map((user, index) => {
              const fullName = getFullName(user);
              const city = getLocation(user); // SIRF CITY
              const profession = getProfession(user);
              
              console.log(`User ${index}:`, { 
                fullName, 
                city, 
                profession,
                userData: user 
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
                    
                    <p className="text-gray-600 font-medium">
                      {profession}
                    </p>
                    
                    <div className="flex items-center text-gray-500 text-sm mt-1">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{city}</span>
                    </div>
                  </div>
                  
                  {/* Connect Button */}
                  <button 
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition"
                    onClick={() => handleConnect(user)}
                  >
                  Message
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
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
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