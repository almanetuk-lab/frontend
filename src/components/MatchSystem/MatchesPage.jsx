
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSuggestedMatches } from '../services/chatApi'; 
export default function MatchesPage() {
  const navigate = useNavigate();
  
  // State for matches data
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: 'All Matches',
    sortBy: 'Newest',
    ageRange: 'Any',
    gender: 'All'
  });

  // Fetch matches using your existing function
  const fetchMatches = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching matches using getSuggestedMatches...');
      
      // Use your existing API function
      const data = await getSuggestedMatches();
      
      console.log('Matches API Response:', data);
      
      // Ensure we have an array
      if (Array.isArray(data)) {
        setMatches(data);
        console.log(`Loaded ${data.length} matches`);
      } else {
        console.error('API response is not an array:', data);
        setMatches([]);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching matches:', err);
      setError(`Failed to load matches: ${err.message || 'Please try again.'}`);
      setLoading(false);
      
      // Fallback data
      const fallbackData = [
        {
          id: 122,
          user_id: 125,
          gender: "Male",
          marital_status: "Single",
          profession: "Backend developer",
          city: "ujjain",
          age: 22,
          first_name: "Aman",
          last_name: "sharma",
          image_url: "https://res.cloudinary.com/ddzkw1vme/image/upload/v1763206949/user_uploads/jxkmbjygn2x1hg84nd3b.jpg",
          is_active: true,
          is_submitted: true,
          company: "TCS",
          match_score: 4
        },
        {
          id: 130,
          user_id: 133,
          gender: "Male",
          marital_status: "Single",
          profession: "frontend developer",
          city: "ujjain",
          age: 25,
          first_name: "Mukul",
          last_name: "Soni",
          image_url: "https://res.cloudinary.com/ddzkw1vme/image/upload/v1763441581/user_uploads/eq6qlk7migbxdt6nqg8z.jpg",
          is_active: true,
          is_submitted: true,
          company: "TCS",
          match_score: 4
        },
        {
          id: 71,
          user_id: 75,
          gender: "Male",
          marital_status: "Married",
          profession: "software engineer",
          city: "jaipur",
          age: 25,
          first_name: null,
          last_name: null,
          image_url: null,
          is_active: true,
          is_submitted: true,
          company: "Almanet Professional Services",
          match_score: 3
        },
        {
          id: 66,
          user_id: 74,
          gender: "Female",
          marital_status: "Single",
          profession: "Backend developer",
          city: "jaipur",
          age: 30,
          first_name: null,
          last_name: null,
          image_url: null,
          is_active: true,
          is_submitted: true,
          company: "Almanet",
          match_score: 3
        }
      ];
      setMatches(fallbackData);
    }
  };

  // Fetch matches on component mount
  useEffect(() => {
    console.log('MatchesPage mounted, fetching data...');
    fetchMatches();
  }, []);

  // Helper function to get full name
  const getFullName = (user) => {
    if (!user) return "User";
    
    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`;
    } else if (user.first_name) {
      return user.first_name;
    } else if (user.last_name) {
      return user.last_name;
    } else if (user.name) {
      return user.name;
    } else {
      return `User ${user.user_id || user.id}`;
    }
  };

  // Helper function to get location
  const getLocation = (user) => {
    if (!user) return "Location not set";
    
    if (user.city && user.state) {
      return `${user.city}, ${user.state}`;
    } else if (user.city) {
      return user.city;
    } else if (user.state) {
      return user.state;
    } else if (user.country) {
      return user.country;
    } else if (user.address) {
      return user.address.split(',')[0];
    } else {
      return "Location not set";
    }
  };

  // Helper function to get last active time
  const getLastActive = (user) => {
    if (!user.updated_at) {
      return user.is_active ? "Online now" : "Recently";
    }
    
    const updatedTime = new Date(user.updated_at);
    const now = new Date();
    const diffHours = Math.floor((now - updatedTime) / (1000 * 60 * 60));
    
    if (diffHours < 1 && user.is_active) {
      return "Online now";
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    }
  };

  // Helper function to get profile image or placeholder
  const getProfileImage = (user) => {
    if (user.image_url) {
      return user.image_url;
    }
    
    // Return placeholder based on gender
    if (user.gender === 'Female') {
      return 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400';
    } else {
      return 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400';
    }
  };

  // Filter and sort matches
  const getFilteredMatches = () => {
    let filtered = [...matches];

    // Apply status filter
    if (filters.status === 'Online Now') {
      filtered = filtered.filter(match => match.is_active);
    } else if (filters.status === 'Verified Only') {
      filtered = filtered.filter(match => match.is_submitted);
    }

    // Apply gender filter
    if (filters.gender !== 'All') {
      filtered = filtered.filter(match => match.gender === filters.gender);
    }

    // Apply age range filter
    if (filters.ageRange === '18-25') {
      filtered = filtered.filter(match => match.age >= 18 && match.age <= 25);
    } else if (filters.ageRange === '26-35') {
      filtered = filtered.filter(match => match.age >= 26 && match.age <= 35);
    } else if (filters.ageRange === '36+') {
      filtered = filtered.filter(match => match.age >= 36);
    }

    // Apply sorting
    if (filters.sortBy === 'Match Score') {
      filtered.sort((a, b) => (b.match_score || 0) - (a.match_score || 0));
    } else if (filters.sortBy === 'Newest') {
      filtered.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    } else if (filters.sortBy === 'Recently Active') {
      filtered.sort((a, b) => new Date(b.updated_at || 0) - new Date(a.updated_at || 0));
    }

    return filtered;
  };

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // Handle reset filters
  const handleResetFilters = () => {
    setFilters({
      status: 'All Matches',
      sortBy: 'Newest',
      ageRange: 'Any',
      gender: 'All'
    });
  };

  const handleViewProfile = (userId) => {
    navigate(`/profile/${userId}`);
  };

  const handleSendMessage = (userId) => {
    navigate(`/chat/${userId}`);
  };

  const filteredMatches = getFilteredMatches();

  // Calculate stats
  const totalMatches = matches.length;
  const onlineNow = matches.filter(match => match.is_active).length;
  const verifiedProfiles = matches.filter(match => match.is_submitted).length;
  const averageMatchScore = matches.length > 0 
    ? Math.round(matches.reduce((sum, match) => sum + (match.match_score || 0), 0) / matches.length)
    : 0;

  // Debug: Check if data is loading
  useEffect(() => {
    console.log('Current matches state:', matches);
    console.log('Filtered matches:', filteredMatches);
    console.log('Loading:', loading);
    console.log('Error:', error);
  }, [matches, filteredMatches, loading, error]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Your Matches</h1>
            <p className="text-gray-600">Loading matches...</p>
          </div>
          
          {/* Loading skeletons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
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
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Your Matches</h1>
          <p className="text-gray-600">Discover people who match your preferences</p>
          
          {/* Debug Info - Remove in production */}
          <div className="mt-4 p-3 bg-blue-50 text-blue-700 rounded-lg border border-blue-200 text-xs">
            <p><strong>Debug Info:</strong> Showing {filteredMatches.length} of {totalMatches} matches</p>
            <p>First user: {matches[0] ? getFullName(matches[0]) : 'No data'}</p>
            <p>Average match score: {averageMatchScore}/10</p>
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

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <select 
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option>All Matches</option>
              <option>Online Now</option>
              <option>Verified Only</option>
              <option>High Match Score</option>
            </select>
            
            <select 
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            >
              <option>Sort by: Newest</option>
              <option>Sort by: Match Score</option>
              <option>Sort by: Recently Active</option>
            </select>

            <select 
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={filters.ageRange}
              onChange={(e) => handleFilterChange('ageRange', e.target.value)}
            >
              <option>Age: Any</option>
              <option>18-25</option>
              <option>26-35</option>
              <option>36+</option>
            </select>

            <select 
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={filters.gender}
              onChange={(e) => handleFilterChange('gender', e.target.value)}
            >
              <option>Gender: All</option>
              <option>Male</option>
              <option>Female</option>
            </select>

            <button 
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
              onClick={handleResetFilters}
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-700">{error}</p>
          </div>
        )}

        {/* Matches Grid */}
        {filteredMatches.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
            <div className="text-gray-400 text-5xl mb-4">👥</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No matches found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your filters or check back later</p>
            <button
              onClick={handleResetFilters}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredMatches.map((match, index) => {
                const fullName = getFullName(match);
                const location = getLocation(match);
                const lastActive = getLastActive(match);
                const isOnline = lastActive === 'Online now';
                const profileImage = getProfileImage(match);
                
                return (
                  <div key={match.id || match.user_id || index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    {/* Profile Image */}
                    <div className="relative">
                      <img
                        src={profileImage}
                        alt={fullName}
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = match.gender === 'Female' 
                            ? 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400'
                            : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400';
                        }}
                      />
                      
                      {/* Online Status */}
                      {isOnline && (
                        <div className="absolute top-3 right-3">
                          <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">Online</span>
                        </div>
                      )}
                      
                      {/* Verified Badge */}
                      {match.is_submitted && (
                        <div className="absolute top-3 left-3">
                          <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">✓ Verified</span>
                        </div>
                      )}
                      
                      {/* Match Score Badge */}
                      {match.match_score && (
                        <div className="absolute top-3 right-3">
                          <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                            {match.match_score}/10
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Profile Info */}
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-bold text-lg text-gray-800">{fullName}</h3>
                          <p className="text-gray-600 text-sm">
                            {match.age ? `${match.age} years` : 'Age not specified'}
                            {match.gender && ` • ${match.gender}`}
                            {match.marital_status && ` • ${match.marital_status}`}
                          </p>
                        </div>
                        <button className="text-gray-400 hover:text-red-500 transition">
                          ♡
                        </button>
                      </div>

                      <p className="text-gray-700 mb-1">
                        {match.profession || match.headline || 'Profession not specified'}
                      </p>
                      <p className="text-gray-500 text-sm mb-3 flex items-center">
                        📍 {location}
                      </p>

                      <div className="flex items-center justify-between mb-4">
                        <p className={`text-xs ${isOnline ? 'text-green-500' : 'text-gray-400'}`}>
                          {isOnline ? '🟢 Online now' : `Last active: ${lastActive}`}
                        </p>
                        {match.company && (
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {match.company}
                          </span>
                        )}
                      </div>

                      {/* Skills/Interests */}
                      {(match.skills || match.interests) && (
                        <div className="mb-3">
                          <div className="flex flex-wrap gap-1">
                            {match.skills && Array.isArray(match.skills) && 
                              match.skills.slice(0, 2).map((skill, index) => (
                                <span key={index} className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded">
                                  {skill}
                                </span>
                              ))
                            }
                            {match.interests && Array.isArray(match.interests) && 
                              match.interests.slice(0, 2).map((interest, index) => (
                                <span key={index} className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded">
                                  {interest}
                                </span>
                              ))
                            }
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

            {/* Load More Button */}
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