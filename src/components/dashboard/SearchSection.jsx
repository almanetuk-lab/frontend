// src/components/chatsystem/AdvancedSearch.jsx
import React, { useState } from "react";
import { adminAPI } from "../services/adminApi";

export default function AdvancedSearch() {
  const [activeTab, setActiveTab] = useState("basic");
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [filters, setFilters] = useState({
    basicSearch: "",
    first_name: '',
    last_name: '',
    gender: '',
    marital_status: '',
    profession: '',
    skills: '',
    interests: '',
    city: '',
    state: '',
    min_age: '',
    max_age: '',
    radius: '',
    distance: '10'
  });

  const handleInputChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const performSearch = async () => {
    setLoading(true);
    setSearchResults([]);
    
    try {
      let searchParams = {};
      
      if (activeTab === "basic") {
        if (filters.basicSearch) {
          searchParams = {
            first_name: filters.basicSearch,
            profession: filters.basicSearch,
            skills: filters.basicSearch,
            interests: filters.basicSearch,
            city: filters.basicSearch
          };
        }
      } else if (activeTab === "advanced") {
        // ✅ Backend ke exact fields use karo
        searchParams = {
          first_name: filters.first_name,
          last_name: filters.last_name,
          gender: filters.gender,
          marital_status: filters.marital_status,
          profession: filters.profession,
          skills: filters.skills,
          interests: filters.interests,
          city: filters.city,
          state: filters.state,
          min_age: filters.min_age,
          max_age: filters.max_age,
          radius: filters.radius
        };
      } else if (activeTab === "nearme") {
        searchParams = {
          radius: filters.distance,
          city: filters.city
        };
      }

      console.log("Sending search params:", searchParams);

      // ✅ Empty parameters filter karo
      const cleanParams = Object.fromEntries(
        Object.entries(searchParams).filter(([_, value]) => 
          value !== '' && value !== null && value !== undefined && value !== '10'
        )
      );

      console.log("Clean params:", cleanParams);

      // ✅ API call
      const response = await adminAPI.searchProfiles(cleanParams);
      setSearchResults(response.data);
      
    } catch (error) {
      console.error("Search API error:", error);
      alert("Search failed: " + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    performSearch();
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Find Your Match</h2>
          
          {/* Tabs Navigation */}
          <div className="flex border-b border-gray-200 mb-6">
            {[
              { id: "basic", label: "🔍 Basic Search" },
              { id: "advanced", label: "⚡ Advanced Search" },
              { id: "nearme", label: "📍 Near Me" }
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 px-4 text-center font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="min-h-[400px]">
            {/* Basic Search Tab */}
            {activeTab === "basic" && (
              <form onSubmit={handleSearch} className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Quick Search</h3>
                  <p className="text-gray-600">Find matches with simple keywords</p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Search by name, profession, skills, or interests
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Doctor, JavaScript, Traveling, Mumbai..."
                      value={filters.basicSearch}
                      onChange={(e) => handleInputChange('basicSearch', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Profession</label>
                      <input
                        type="text"
                        placeholder="e.g. Developer, Doctor"
                        value={filters.profession}
                        onChange={(e) => handleInputChange('profession', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                      <input
                        type="text"
                        placeholder="Enter city"
                        value={filters.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </form>
            )}

            {/* Advanced Search Tab */}
            {activeTab === "advanced" && (
              <form onSubmit={handleSearch} className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Advanced Search</h3>
                  <p className="text-gray-600">Filter matches with detailed criteria</p>
                </div>
                
                {/* Personal Information Section */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h4>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                      <input
                        type="text"
                        placeholder="First name"
                        value={filters.first_name}
                        onChange={(e) => handleInputChange('first_name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                      <input
                        type="text"
                        placeholder="Last name"
                        value={filters.last_name}
                        onChange={(e) => handleInputChange('last_name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => handleInputChange('gender', 'Male')}
                        className={`px-6 py-2 border rounded-md transition-colors ${
                          filters.gender === 'Male' 
                            ? 'bg-blue-500 text-white border-blue-500' 
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        Male
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInputChange('gender', 'Female')}
                        className={`px-6 py-2 border rounded-md transition-colors ${
                          filters.gender === 'Female' 
                            ? 'bg-blue-500 text-white border-blue-500' 
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        Female
                      </button>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Marital Status</label>
                    <select
                      value={filters.marital_status}
                      onChange={(e) => handleInputChange('marital_status', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Any Status</option>
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                      <option value="Divorced">Divorced</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Min Age</label>
                      <input
                        type="number"
                        placeholder="18"
                        value={filters.min_age}
                        onChange={(e) => handleInputChange('min_age', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Max Age</label>
                      <input
                        type="number"
                        placeholder="60"
                        value={filters.max_age}
                        onChange={(e) => handleInputChange('max_age', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Professional Information</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Profession</label>
                      <input
                        type="text"
                        placeholder="e.g. Software Developer"
                        value={filters.profession}
                        onChange={(e) => handleInputChange('profession', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
                      <input
                        type="text"
                        placeholder="e.g. JavaScript, React, Node.js"
                        value={filters.skills}
                        onChange={(e) => handleInputChange('skills', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Interests</label>
                      <input
                        type="text"
                        placeholder="e.g. Traveling, Music, Sports"
                        value={filters.interests}
                        onChange={(e) => handleInputChange('interests', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Location Information */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Location</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                      <input
                        type="text"
                        placeholder="City"
                        value={filters.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                      <input
                        type="text"
                        placeholder="State"
                        value={filters.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </form>
            )}

            {/* Near Me Tab */}
            {activeTab === "nearme" && (
              <form onSubmit={handleSearch} className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Find Nearby Matches</h3>
                  <p className="text-gray-600">Connect with people in your area</p>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Distance: Within {filters.distance} km
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="50"
                        value={filters.distance}
                        onChange={(e) => handleInputChange('distance', e.target.value)}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>1 km</span>
                        <span>25 km</span>
                        <span>50 km</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                        <input
                          type="text"
                          placeholder="Enter city"
                          value={filters.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Radius (km)</label>
                        <input
                          type="number"
                          placeholder="Search radius"
                          value={filters.radius}
                          onChange={(e) => handleInputChange('radius', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            )}
          </div>

          {/* Search Button */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleSearch}
              disabled={loading}
              className={`w-full py-3 bg-blue-600 text-white rounded-lg font-medium text-lg transition-colors ${
                loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
              }`}
            >
              {loading ? '🔍 Searching...' : `🔍 Search ${activeTab === "basic" ? "Matches" : activeTab === "advanced" ? "Advanced" : "Nearby"}`}
            </button>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="mt-6 border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Search Results ({searchResults.length})
              </h3>
              
              <div className="grid gap-4">
                {searchResults.map((profile) => (
                  <div key={profile.id} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-800">
                          {profile.first_name} {profile.last_name}
                        </h4>
                        <p className="text-gray-600 text-sm">{profile.profession} • {profile.city}</p>
                        <p className="text-gray-500 text-sm mt-1">{profile.about}</p>
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        <p>{profile.age} years</p>
                        <p>{profile.experience} yrs exp</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!loading && searchResults.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No results found. Try adjusting your search criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
