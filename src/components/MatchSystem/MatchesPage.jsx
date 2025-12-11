

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSuggestedMatches } from '../services/chatApi'; 

export default function MatchesPage() {
  const navigate = useNavigate();
  
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // API से REAL DATA FETCH करो
  const fetchMatches = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // ये तुम्हारा API function है
      const apiData = await getSuggestedMatches();
      
      // API response format: [{ data }]
      // Check if response is valid array
      if (Array.isArray(apiData)) {
        // Filter out any null/undefined items
        const validMatches = apiData.filter(item => item && (item.user_id || item.id));
        
        if (validMatches.length === 0) {
          setError('No matches found in the database');
          setMatches([]);
        } else {
          setMatches(validMatches);
          console.log('Real matches loaded:', validMatches.length);
          console.log('First match data:', validMatches[5]);
        }
      } else {
        setError('Invalid data format from server');
        setMatches([]);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('API Error:', err);
      setError(`Failed to load matches: ${err.message || 'Network error'}`);
      setMatches([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  // REAL API DATA से नाम बनाओ
  const getDisplayName = (user) => {
    if (!user) return "User";
    
    // API में first_name, last_name null हैं, इसलिए profession use करो
    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`;
    } else if (user.first_name) {
      return user.first_name;
    } else if (user.last_name) {
      return user.last_name;
    } else if (user.profession) {
      return user.profession; // Profession को name की तरह show करो
    } else if (user.company) {
      return user.company;
    } else if (user.about) {
      return user.about.substring(0, 20) + '...';
    } else {
      return `User ${user.user_id || user.id || ''}`;
    }
  };

  // REAL API DATA से profile image लो
  const getProfileImage = (user) => {
    if (!user) {
      return 'https://ui-avatars.com/api/?name=User&background=random&color=fff';
    }
    
    // तुम्हारे API में image_url है (अगर है तो)
    if (user.image_url) {
      if (user.image_url.startsWith('http')) {
        return user.image_url;
      } else {
        // Relative path हो तो तुम्हारे backend URL के साथ join करो
        return `https://backend-q0wc.onrender.com${user.image_url}`;
      }
    }
    
    // Avatar generate करो
    const displayName = getDisplayName(user);
    const nameForAvatar = displayName.replace(/[^a-zA-Z0-9 ]/g, '');
    const encodedName = encodeURIComponent(nameForAvatar || 'User');
    
    return `https://ui-avatars.com/api/?name=${encodedName}&background=random&color=fff&bold=true`;
  };

  // REAL API DATA से location लो
  const getLocation = (user) => {
    if (!user) return "Location not set";
    
    const locations = [];
    if (user.city) locations.push(user.city);
    if (user.state) locations.push(user.state);
    if (user.country) locations.push(user.country);
    
    if (locations.length > 0) {
      return locations.join(', ');
    } else if (user.address) {
      return user.address.split(',')[0];
    }
    
    return "Location not set";
  };

  // REAL API DATA से skills लो
  const getSkills = (user) => {
    if (!user) return [];
    
    if (user.skills && Array.isArray(user.skills)) {
      return user.skills.filter(skill => skill && skill.trim());
    }
    
    if (user.skills && typeof user.skills === 'string') {
      return user.skills.split(',').map(s => s.trim()).filter(s => s);
    }
    
    return [];
  };

  // REAL API DATA से interests लो
  const getInterests = (user) => {
    if (!user) return [];
    
    if (user.interests && Array.isArray(user.interests)) {
      return user.interests.filter(interest => interest && interest.trim());
    }
    
    if (user.interests && typeof user.interests === 'string') {
      return user.interests.split(',').map(i => i.trim()).filter(i => i);
    }
    
    return [];
  };

  const handleViewProfile = (userId) => {
    navigate(`/profile/${userId}`);
  };

  const handleSendMessage = (userId) => {
    navigate(`/chat/${userId}`);
  };

  // Stats calculation
  const totalMatches = matches.length;
  const onlineNow = matches.filter(match => match.is_active === true).length;
  const verifiedProfiles = matches.filter(match => match.is_submitted === true).length;
  const averageMatchScore = matches.length > 0 
    ? Math.round(matches.reduce((sum, match) => sum + (match.match_score || 0), 0) / matches.length)
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">My Matches</h1>
            <p className="text-gray-600">Loading matches from API...</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
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
          
          {/* API Data Info */}
          <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-lg border border-green-200 text-xs">
            <p><strong>✅ Real API Data Loaded:</strong> Showing {totalMatches} matches from your backend</p>
            <p><strong>Backend URL:</strong> https://backend-q0wc.onrender.com</p>
            <p><strong>Note:</strong> Using profession/company as display name</p>
          </div>
        </div>

        {/* Stats from REAL API DATA */}
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
              Retry
            </button>
          </div>
        )}

        {/* REAL MATCHES GRID */}
        {matches.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
            <div className="text-gray-400 text-5xl mb-4">👥</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No matches found</h3>
            <p className="text-gray-500 mb-6">Try refreshing or check back later</p>
            <button
              onClick={fetchMatches}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Refresh
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {matches.map((match) => {
                const displayName = getDisplayName(match);
                const location = getLocation(match);
                const profileImage = getProfileImage(match);
                const skills = getSkills(match);
                const interests = getInterests(match);
                const isOnline = match.is_active === true;
                const isVerified = match.is_submitted === true;
                
                return (
                  <div key={match.id || match.user_id} 
                       className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    
                    {/* Profile Image */}
                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                      <img
                        src={profileImage}
                        alt={displayName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          const nameForAvatar = displayName.replace(/[^a-zA-Z0-9 ]/g, '');
                          const encodedName = encodeURIComponent(nameForAvatar || 'User');
                          e.target.src = `https://ui-avatars.com/api/?name=${encodedName}&background=random&color=fff`;
                        }}
                      />
                      
                      {/* Online Status Badge */}
                      {isOnline && (
                        <div className="absolute top-3 right-3">
                          <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">Online</span>
                        </div>
                      )}
                      
                      {/* Verified Badge */}
                      {isVerified && (
                        <div className="absolute top-3 left-3">
                          <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">✓ Verified</span>
                        </div>
                      )}
                      
                      {/* Match Score Badge */}
                      {match.match_score > 0 && (
                        <div className="absolute bottom-3 right-3">
                          <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                            {match.match_score}/10
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Profile Info */}
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-gray-800 truncate">{displayName}</h3>
                          <div className="text-gray-600 text-sm mt-1">
                            {match.age && match.age > 0 && <span>{match.age} yrs</span>}
                            {match.gender && <span> • {match.gender}</span>}
                            {match.marital_status && <span> • {match.marital_status}</span>}
                          </div>
                        </div>
                        <button className="text-gray-400 hover:text-red-500 transition text-xl ml-2">
                          ♡
                        </button>
                      </div>

                      {/* Location */}
                      {location !== "Location not set" && (
                        <p className="text-gray-500 text-sm mb-3 flex items-center">
                          📍 {location}
                        </p>
                      )}

                      {/* Company */}
                      {match.company && match.company !== displayName && (
                        <p className="text-gray-500 text-sm mb-3">
                          🏢 {match.company}
                        </p>
                      )}

                      {/* Status */}
                      <div className="mb-4">
                        <p className={`text-xs ${isOnline ? 'text-green-500' : 'text-gray-400'}`}>
                          {isOnline ? '🟢 Online now' : '⚫ Offline'}
                        </p>
                      </div>

                      {/* Skills/Interests */}
                      {(skills.length > 0 || interests.length > 0) && (
                        <div className="mb-3">
                          <div className="flex flex-wrap gap-1">
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
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewProfile(match.user_id || match.id)}
                          className="flex-1 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-medium"
                        >
                          View Profile
                        </button>
                        <button
                          onClick={() => handleSendMessage(match.user_id || match.id)}
                          className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                        >
                          💬
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
                Refresh Matches
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// import React from 'react';
// import { useNavigate } from 'react-router-dom';

// export default function MatchesPage() {
//   const navigate = useNavigate();

//   // Dummy matches data - aap replace kar sakte hain
//   const matches = [
//     {
//       id: 1,
//       name: "Ishaan Kumar",
//       age: 38,
//       location: "Panaji, India",
//       photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
//       profession: "Software Engineer",
//       lastActive: "2 hours ago",
//       verified: true
//     },
//     {
//       id: 2,
//       name: "Priya Sharma",
//       age: 29,
//       location: "Mumbai, India",
//       photo: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400",
//       profession: "Doctor",
//       lastActive: "Online now",
//       verified: true
//     },
//     {
//       id: 3,
//       name: "Krish Ghosh",
//       age: 32,
//       location: "Kolkata, India",
//       photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
//       profession: "Business Owner",
//       lastActive: "1 day ago",
//       verified: false
//     },
//     {
//       id: 4,
//       name: "Pihu Malik",
//       age: 26,
//       location: "Delhi, India",
//       photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
//       profession: "Fashion Designer",
//       lastActive: "5 hours ago",
//       verified: true
//     },
//     {
//       id: 5,
//       name: "Rahul Verma",
//       age: 35,
//       location: "Bangalore, India",
//       photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
//       profession: "Data Scientist",
//       lastActive: "3 hours ago",
//       verified: true
//     },
//     {
//       id: 6,
//       name: "Anjali Singh",
//       age: 28,
//       location: "Pune, India",
//       photo: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=400",
//       profession: "Marketing Manager",
//       lastActive: "Online now",
//       verified: false
//     },
//     {
//       id: 7,
//       name: "Aarav Patel",
//       age: 31,
//       location: "Ahmedabad, India",
//       photo: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400",
//       profession: "Architect",
//       lastActive: "2 days ago",
//       verified: true
//     },
//     {
//       id: 8,
//       name: "Neha Gupta",
//       age: 27,
//       location: "Chennai, India",
//       photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
//       profession: "Teacher",
//       lastActive: "1 hour ago",
//       verified: true
//     }
//   ];

//   const handleViewProfile = (userId) => {
//     navigate(`/profile/${userId}`);
//   };

//   const handleSendMessage = (userId) => {
//     navigate(`/chat/${userId}`);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-800 mb-2">Your Matches</h1>
//           <p className="text-gray-600">Discover people who match your preferences</p>
//         </div>

//         {/* Stats */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
//           <div className="bg-white p-4 rounded-lg shadow-sm border">
//             <p className="text-2xl font-bold text-indigo-600">{matches.length}</p>
//             <p className="text-gray-600 text-sm">Total Matches</p>
//           </div>
//           <div className="bg-white p-4 rounded-lg shadow-sm border">
//             <p className="text-2xl font-bold text-green-600">{matches.filter(m => m.lastActive === 'Online now').length}</p>
//             <p className="text-gray-600 text-sm">Online Now</p>
//           </div>
//           <div className="bg-white p-4 rounded-lg shadow-sm border">
//             <p className="text-2xl font-bold text-blue-600">{matches.filter(m => m.verified).length}</p>
//             <p className="text-gray-600 text-sm">Verified Profiles</p>
//           </div>
//           <div className="bg-white p-4 rounded-lg shadow-sm border">
//             <p className="text-2xl font-bold text-purple-600">89%</p>
//             <p className="text-gray-600 text-sm">Match Score</p>
//           </div>
//         </div>

//         {/* Filters */}
//         <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
//           <div className="flex flex-wrap gap-4 items-center">
//             <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
//               <option>All Matches</option>
//               <option>Online Now</option>
//               <option>Verified Only</option>
//               <option>New Matches</option>
//             </select>
            
//             <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
//               <option>Sort by: Newest</option>
//               <option>Sort by: Match Score</option>
//               <option>Sort by: Recently Active</option>
//             </select>

//             <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
//               <option>Age: Any</option>
//               <option>18-25</option>
//               <option>26-35</option>
//               <option>36+</option>
//             </select>

//             <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
//               Reset Filters
//             </button>
//           </div>
//         </div>

//         {/* Matches Grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//           {matches.map(match => (
//             <div key={match.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
//               {/* Profile Image */}
//               <div className="relative">
//                 <img
//                   src={match.photo}
//                   alt={match.name}
//                   className="w-full h-48 object-cover"
//                 />
                
//                 {/* Online Status */}
//                 {match.lastActive === 'Online now' && (
//                   <div className="absolute top-3 right-3">
//                     <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">Online</span>
//                   </div>
//                 )}
                
//                 {/* Verified Badge */}
//                 {match.verified && (
//                   <div className="absolute top-3 left-3">
//                     <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">✓ Verified</span>
//                   </div>
//                 )}
//               </div>

//               {/* Profile Info */}
//               <div className="p-4">
//                 <div className="flex items-start justify-between mb-2">
//                   <div>
//                     <h3 className="font-bold text-lg text-gray-800">{match.name}</h3>
//                     <p className="text-gray-600 text-sm">{match.age} years</p>
//                   </div>
//                   <button className="text-gray-400 hover:text-red-500 transition">
//                     ♡
//                   </button>
//                 </div>

//                 <p className="text-gray-700 mb-1">{match.profession}</p>
//                 <p className="text-gray-500 text-sm mb-3 flex items-center">
//                   📍 {match.location}
//                 </p>

//                 <p className={`text-xs mb-4 ${
//                   match.lastActive === 'Online now' ? 'text-green-500' : 'text-gray-400'
//                 }`}>
//                   {match.lastActive === 'Online now' ? '🟢 Online now' : `Last active: ${match.lastActive}`}
//                 </p>

//                 {/* Action Buttons */}
//                 <div className="flex gap-2">
//                   <button
//                     onClick={() => handleViewProfile(match.id)}
//                     className="flex-1 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-medium"
//                   >
//                     View Profile
//                   </button>
//                   <button
//                     onClick={() => handleSendMessage(match.id)}
//                     className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
//                   >
//                     💬
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Load More Button */}
//         <div className="text-center mt-8">
//           <button className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium">
//             Load More Matches
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }