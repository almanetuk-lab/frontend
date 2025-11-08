import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function MatchesPage() {
  const navigate = useNavigate();

  // Dummy matches data - aap replace kar sakte hain
  const matches = [
    {
      id: 1,
      name: "Ishaan Kumar",
      age: 38,
      location: "Panaji, India",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
      profession: "Software Engineer",
      lastActive: "2 hours ago",
      verified: true
    },
    {
      id: 2,
      name: "Priya Sharma",
      age: 29,
      location: "Mumbai, India",
      photo: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400",
      profession: "Doctor",
      lastActive: "Online now",
      verified: true
    },
    {
      id: 3,
      name: "Krish Ghosh",
      age: 32,
      location: "Kolkata, India",
      photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
      profession: "Business Owner",
      lastActive: "1 day ago",
      verified: false
    },
    {
      id: 4,
      name: "Pihu Malik",
      age: 26,
      location: "Delhi, India",
      photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
      profession: "Fashion Designer",
      lastActive: "5 hours ago",
      verified: true
    },
    {
      id: 5,
      name: "Rahul Verma",
      age: 35,
      location: "Bangalore, India",
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
      profession: "Data Scientist",
      lastActive: "3 hours ago",
      verified: true
    },
    {
      id: 6,
      name: "Anjali Singh",
      age: 28,
      location: "Pune, India",
      photo: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=400",
      profession: "Marketing Manager",
      lastActive: "Online now",
      verified: false
    },
    {
      id: 7,
      name: "Aarav Patel",
      age: 31,
      location: "Ahmedabad, India",
      photo: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400",
      profession: "Architect",
      lastActive: "2 days ago",
      verified: true
    },
    {
      id: 8,
      name: "Neha Gupta",
      age: 27,
      location: "Chennai, India",
      photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
      profession: "Teacher",
      lastActive: "1 hour ago",
      verified: true
    }
  ];

  const handleViewProfile = (userId) => {
    navigate(`/profile/${userId}`);
  };

  const handleSendMessage = (userId) => {
    navigate(`/chat/${userId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Your Matches</h1>
          <p className="text-gray-600">Discover people who match your preferences</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <p className="text-2xl font-bold text-indigo-600">{matches.length}</p>
            <p className="text-gray-600 text-sm">Total Matches</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <p className="text-2xl font-bold text-green-600">{matches.filter(m => m.lastActive === 'Online now').length}</p>
            <p className="text-gray-600 text-sm">Online Now</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <p className="text-2xl font-bold text-blue-600">{matches.filter(m => m.verified).length}</p>
            <p className="text-gray-600 text-sm">Verified Profiles</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <p className="text-2xl font-bold text-purple-600">89%</p>
            <p className="text-gray-600 text-sm">Match Score</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
              <option>All Matches</option>
              <option>Online Now</option>
              <option>Verified Only</option>
              <option>New Matches</option>
            </select>
            
            <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
              <option>Sort by: Newest</option>
              <option>Sort by: Match Score</option>
              <option>Sort by: Recently Active</option>
            </select>

            <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
              <option>Age: Any</option>
              <option>18-25</option>
              <option>26-35</option>
              <option>36+</option>
            </select>

            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
              Reset Filters
            </button>
          </div>
        </div>

        {/* Matches Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {matches.map(match => (
            <div key={match.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              {/* Profile Image */}
              <div className="relative">
                <img
                  src={match.photo}
                  alt={match.name}
                  className="w-full h-48 object-cover"
                />
                
                {/* Online Status */}
                {match.lastActive === 'Online now' && (
                  <div className="absolute top-3 right-3">
                    <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">Online</span>
                  </div>
                )}
                
                {/* Verified Badge */}
                {match.verified && (
                  <div className="absolute top-3 left-3">
                    <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">✓ Verified</span>
                  </div>
                )}
              </div>

              {/* Profile Info */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">{match.name}</h3>
                    <p className="text-gray-600 text-sm">{match.age} years</p>
                  </div>
                  <button className="text-gray-400 hover:text-red-500 transition">
                    ♡
                  </button>
                </div>

                <p className="text-gray-700 mb-1">{match.profession}</p>
                <p className="text-gray-500 text-sm mb-3 flex items-center">
                  📍 {match.location}
                </p>

                <p className={`text-xs mb-4 ${
                  match.lastActive === 'Online now' ? 'text-green-500' : 'text-gray-400'
                }`}>
                  {match.lastActive === 'Online now' ? '🟢 Online now' : `Last active: ${match.lastActive}`}
                </p>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewProfile(match.id)}
                    className="flex-1 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-medium"
                  >
                    View Profile
                  </button>
                  <button
                    onClick={() => handleSendMessage(match.id)}
                    className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                  >
                    💬
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-8">
          <button className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium">
            Load More Matches
          </button>
        </div>
      </div>
    </div>
  );
}