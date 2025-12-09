

// src/components/dashboard/SuggestedMatches.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const SuggestedMatches = ({ 
  suggestedMatches = [], 
  loading = false, 
  error = null, 
  onRetry = () => {}, 
  onViewAll = () => {} 
}) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4 sm:space-y-6">
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
              onClick={onRetry}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
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
                className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                  {user.name?.[0] || user.city?.[0] || "U"}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800">
                    {user.name || user.full_name || `User ${user.user_id || user.id}`}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {user.profession || user.gender || user.city || "Profession not set"}
                  </p>
                </div>
                <button className="px-3 py-1 bg-blue-500 text-white text-sm rounded-full hover:bg-blue-600 transition">
                  +
                </button>
              </div>
            ))}
          </div>
        )}
        
        {/* View All Button - Only if we have users */}
        {!loading && !error && suggestedMatches.length > 0 && (
          <button
            onClick={() => onViewAll() || navigate("/dashboard/matches")}
            className="w-full mt-4 p-3 text-center text-blue-600 font-medium border-t border-gray-100 pt-4 hover:bg-gray-50 rounded-b-lg transition"
          >
            View All Matches
          </button>
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