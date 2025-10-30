// src/components/chatsystem/AdvancedSearch.jsx
import React, { useState, useRef, useEffect } from "react";
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

  // Input fields ke refs banaye
  const inputRefs = useRef({});

  // Simple function without complex logic
  const handleInputChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Tab change pe focus reset na ho
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
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
      }

      const cleanParams = Object.fromEntries(
        Object.entries(searchParams).filter(([_, value]) => value !== '' && value !== null && value !== undefined)
      );

      const response = await adminAPI.searchProfiles(cleanParams);
      setSearchResults(response.data);
      
    } catch (error) {
      console.error("Search API error:", error);
      alert("Search failed: " + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    performSearch();
  };

  // Basic Search Tab - FIXED
  const BasicSearchTab = () => (
    <div className="space-y-6">
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
    </div>
  );

  // Advanced Search Tab - FIXED
  const AdvancedSearchTab = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Advanced Search</h3>
        <p className="text-gray-600">Filter matches with detailed criteria</p>
      </div>
      
      {/* Personal Information Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h4>
        
        {/* First Name & Last Name Row */}
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

        {/* Gender Row */}
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

        {/* Marital Status */}
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

        {/* Age Range */}
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
        
        <div className="grid grid-cols-2 gap-4">
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
            <input
              type="text"
              placeholder="e.g. Backend Developer"
              value={filters.position}
              onChange={(e) => handleInputChange('position', e.target.value)}
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
    </div>
  );

  // Search Results Component
  const SearchResults = () => (
    <div className="mt-6 border-t pt-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Search Results ({searchResults.length})
      </h3>
      
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Searching...</p>
        </div>
      ) : searchResults.length > 0 ? (
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
      ) : (
        <div className="text-center py-8 text-gray-500">
          No results found. Try adjusting your search criteria.
        </div>
      )}
    </div>
  );

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
                onClick={() => handleTabChange(tab.id)}
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
            {activeTab === "basic" && <BasicSearchTab />}
            {activeTab === "advanced" && <AdvancedSearchTab />}
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
              {loading ? '🔍 Searching...' : `🔍 Search ${activeTab === "basic" ? "Matches" : "Advanced"}`}
            </button>
          </div>

          {/* Search Results */}
          <SearchResults />
        </div>
      </div>
    </div>
  );
}


// // src/components/chatsystem/AdvancedSearch.jsx
// import React, { useState } from "react";
// import axios from "axios";
// import { adminAPI} from "../services/adminApi";

// export default function AdvancedSearch() {
//   const [activeTab, setActiveTab] = useState("basic");
//   const [loading, setLoading] = useState(false);
//   const [searchResults, setSearchResults] = useState([]);
//   const [filters, setFilters] = useState({
//     // Basic Search
//     basicSearch: "",
    
//     // Advanced Search - All backend fields
//     about: '',
//     first_name: '',
//     last_name: '',
//     gender: '',
//     marital_status: '',
//     address: '',
//     profession: '',
//     skills: '',
//     interests: '',
//     city: '',
//     state: '',
//     headline: '',
//     education: '',
//     company: '',
//     experience: '',
//     position: '',
//     company_type: '',
//     hobby: '',
//     min_age: '',
//     max_age: '',
//     radius: '',
    
//     // Near Me
//     distance: '10',
//     showOnline: true
//   });

//   const handleFilterChange = (field, value) => {
//     setFilters(prev => ({ ...prev, [field]: value }));
//   };

//   // API Search Function
//   const performSearch = async () => {
//     setLoading(true);
//     setSearchResults([]);
    
//     try {
//       // Prepare parameters based on active tab
//       let searchParams = {};
      
//       if (activeTab === "basic") {
//         // For basic search, use basicSearch field for multiple purposes
//         if (filters.basicSearch) {
//           searchParams = {
//             first_name: filters.basicSearch,
//             profession: filters.basicSearch,
//             skills: filters.basicSearch,
//             interests: filters.basicSearch,
//             city: filters.basicSearch
//           };
//         }
//       } else if (activeTab === "advanced") {
//         // For advanced search, use all specific filters
//         searchParams = {
//           about: filters.about,
//           first_name: filters.first_name,
//           last_name: filters.last_name,
//           gender: filters.gender,
//           marital_status: filters.marital_status,
//           profession: filters.profession,
//           skills: filters.skills,
//           interests: filters.interests,
//           city: filters.city,
//           state: filters.state,
//           headline: filters.headline,
//           education: filters.education,
//           company: filters.company,
//           position: filters.position,
//           company_type: filters.company_type,
//           hobby: filters.hobby,
//           min_age: filters.min_age,
//           max_age: filters.max_age,
//           radius: filters.radius
//         };
//       } else if (activeTab === "nearme") {
//         // For near me search
//         searchParams = {
//           radius: filters.distance,
//           city: filters.city
//           // Note: You'll need to add lat/lon from user's location
//         };
//       }

//       // Remove empty parameters
//       const cleanParams = Object.fromEntries(
//         Object.entries(searchParams).filter(([_, value]) => value !== '' && value !== null && value !== undefined)
//       );

//       console.log("Searching with params:", cleanParams);
//       const response = await adminAPI.searchProfiles(cleanParams);

      
//       // API Call to your backend
//       // const response = await axios.get('/search', {
//       //   params: cleanParams
//       // });
      
//       setSearchResults(response.data);
//       console.log("Search results:", response.data);
      
//     } catch (error) {
//       console.error("Search API error:", error);
//       alert("Search failed: " + (error.response?.data?.error || error.message));
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSearch = () => {
//     performSearch();
//   };

//   // Rest of your tab components remain exactly the same...
//   const BasicSearchTab = () => (
//     <div className="space-y-6 animate-fade-in">
//       <div className="text-center mb-6">
//         <h3 className="text-xl font-semibold text-gray-800 mb-2">Quick Search</h3>
//         <p className="text-gray-600">Find matches with simple keywords</p>
//       </div>
      
//       <div className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Search by name, profession, skills, or interests
//           </label>
//           <input
//             type="text"
//             placeholder="e.g. Doctor, JavaScript, Traveling, Mumbai..."
//             value={filters.basicSearch}
//             onChange={(e) => handleFilterChange('basicSearch', e.target.value)}
//             className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
//           />
//         </div>
        
//         <div className="grid grid-cols-2 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Profession</label>
//             <input
//               type="text"
//               placeholder="e.g. Developer, Doctor"
//               value={filters.profession}
//               onChange={(e) => handleFilterChange('profession', e.target.value)}
//               className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//             />
//           </div>
          
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
//             <input
//               type="text"
//               placeholder="Enter city"
//               value={filters.city}
//               onChange={(e) => handleFilterChange('city', e.target.value)}
//               className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   const AdvancedSearchTab = () => (
//     <div className="space-y-6 animate-fade-in">
//       <div className="text-center mb-6">
//         <h3 className="text-xl font-semibold text-gray-800 mb-2">Advanced Search</h3>
//         <p className="text-gray-600">Filter matches with detailed criteria</p>
//       </div>
      
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div className="space-y-4">
//           {/* Personal Information */}
//           <div className="bg-gray-50 p-4 rounded-xl">
//             <h4 className="font-medium text-gray-800 mb-3">Personal Information</h4>
            
//             <div className="grid grid-cols-2 gap-3 mb-3">
//               <div>
//                 <label className="block text-sm text-gray-700 mb-1">First Name</label>
//                 <input
//                   type="text"
//                   placeholder="First name"
//                   value={filters.first_name}
//                   onChange={(e) => handleFilterChange('first_name', e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-indigo-500"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm text-gray-700 mb-1">Last Name</label>
//                 <input
//                   type="text"
//                   placeholder="Last name"
//                   value={filters.last_name}
//                   onChange={(e) => handleFilterChange('last_name', e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-indigo-500"
//                 />
//               </div>
//             </div>

//             <div className="mb-3">
//               <label className="block text-sm text-gray-700 mb-1">Gender</label>
//               <div className="flex gap-2">
//                 {['Male', 'Female'].map(gender => (
//                   <button
//                     key={gender}
//                     onClick={() => handleFilterChange('gender', gender)}
//                     className={`flex-1 py-2 rounded-lg border transition-all duration-200 text-sm ${
//                       filters.gender === gender 
//                         ? 'bg-indigo-50 border-indigo-500 text-indigo-700' 
//                         : 'bg-white border-gray-300 text-gray-700'
//                     }`}
//                   >
//                     {gender}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             <div className="mb-3">
//               <label className="block text-sm text-gray-700 mb-1">Marital Status</label>
//               <select
//                 value={filters.marital_status}
//                 onChange={(e) => handleFilterChange('marital_status', e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-indigo-500"
//               >
//                 <option value="">Any Status</option>
//                 <option value="Single">Single</option>
//                 <option value="Married">Married</option>
//                 <option value="Divorced">Divorced</option>
//               </select>
//             </div>

//             <div className="grid grid-cols-2 gap-3">
//               <div>
//                 <label className="block text-sm text-gray-700 mb-1">Min Age</label>
//                 <input
//                   type="number"
//                   placeholder="18"
//                   value={filters.min_age}
//                   onChange={(e) => handleFilterChange('min_age', e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-indigo-500"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm text-gray-700 mb-1">Max Age</label>
//                 <input
//                   type="number"
//                   placeholder="60"
//                   value={filters.max_age}
//                   onChange={(e) => handleFilterChange('max_age', e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-indigo-500"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Professional Information */}
//           <div className="bg-gray-50 p-4 rounded-xl">
//             <h4 className="font-medium text-gray-800 mb-3">Professional Information</h4>
            
//             <div className="space-y-3">
//               <div>
//                 <label className="block text-sm text-gray-700 mb-1">Profession</label>
//                 <input
//                   type="text"
//                   placeholder="e.g. Software Developer"
//                   value={filters.profession}
//                   onChange={(e) => handleFilterChange('profession', e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-indigo-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm text-gray-700 mb-1">Position</label>
//                 <input
//                   type="text"
//                   placeholder="e.g. Backend Developer"
//                   value={filters.position}
//                   onChange={(e) => handleFilterChange('position', e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-indigo-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm text-gray-700 mb-1">Company</label>
//                 <input
//                   type="text"
//                   placeholder="Company name"
//                   value={filters.company}
//                   onChange={(e) => handleFilterChange('company', e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-indigo-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm text-gray-700 mb-1">Experience</label>
//                 <input
//                   type="number"
//                   placeholder="Years of experience"
//                   value={filters.experience}
//                   onChange={(e) => handleFilterChange('experience', e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-indigo-500"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="space-y-4">
//           {/* Location Information */}
//           <div className="bg-gray-50 p-4 rounded-xl">
//             <h4 className="font-medium text-gray-800 mb-3">Location</h4>
            
//             <div className="space-y-3">
//               <div>
//                 <label className="block text-sm text-gray-700 mb-1">City</label>
//                 <input
//                   type="text"
//                   placeholder="City"
//                   value={filters.city}
//                   onChange={(e) => handleFilterChange('city', e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-indigo-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm text-gray-700 mb-1">State</label>
//                 <input
//                   type="text"
//                   placeholder="State"
//                   value={filters.state}
//                   onChange={(e) => handleFilterChange('state', e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-indigo-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm text-gray-700 mb-1">Radius (km)</label>
//                 <input
//                   type="number"
//                   placeholder="Search radius"
//                   value={filters.radius}
//                   onChange={(e) => handleFilterChange('radius', e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-indigo-500"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Skills & Interests */}
//           <div className="bg-gray-50 p-4 rounded-xl">
//             <h4 className="font-medium text-gray-800 mb-3">Skills & Interests</h4>
            
//             <div className="space-y-3">
//               <div>
//                 <label className="block text-sm text-gray-700 mb-1">Skills</label>
//                 <input
//                   type="text"
//                   placeholder="e.g. JavaScript, React, Node.js"
//                   value={filters.skills}
//                   onChange={(e) => handleFilterChange('skills', e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-indigo-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm text-gray-700 mb-1">Interests</label>
//                 <input
//                   type="text"
//                   placeholder="e.g. Traveling, Music, Sports"
//                   value={filters.interests}
//                   onChange={(e) => handleFilterChange('interests', e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-indigo-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm text-gray-700 mb-1">Hobby</label>
//                 <input
//                   type="text"
//                   placeholder="e.g. Photography, Cooking"
//                   value={filters.hobby}
//                   onChange={(e) => handleFilterChange('hobby', e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-indigo-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm text-gray-700 mb-1">About</label>
//                 <textarea
//                   placeholder="About description"
//                   value={filters.about}
//                   onChange={(e) => handleFilterChange('about', e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-indigo-500"
//                   rows="2"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   const NearMeTab = () => (
//     <div className="space-y-6 animate-fade-in">
//       <div className="text-center mb-6">
//         <h3 className="text-xl font-semibold text-gray-800 mb-2">Find Nearby Matches</h3>
//         <p className="text-gray-600">Connect with people in your area</p>
//       </div>
      
//       <div className="space-y-6">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-3">
//             Distance: Within {filters.distance} km
//           </label>
//           <input
//             type="range"
//             min="1"
//             max="50"
//             value={filters.distance}
//             onChange={(e) => handleFilterChange('distance', e.target.value)}
//             className="w-full"
//           />
//           <div className="flex justify-between text-xs text-gray-500 mt-1">
//             <span>1 km</span>
//             <span>25 km</span>
//             <span>50 km</span>
//           </div>
//         </div>

//         <div className="grid grid-cols-2 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
//             <input
//               type="text"
//               placeholder="Enter city"
//               value={filters.city}
//               onChange={(e) => handleFilterChange('city', e.target.value)}
//               className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Radius (km)</label>
//             <input
//               type="number"
//               placeholder="Search radius"
//               value={filters.radius}
//               onChange={(e) => handleFilterChange('radius', e.target.value)}
//               className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//             />
//           </div>
//         </div>

//         <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
//           <div>
//             <p className="font-medium text-gray-800">Show Online Users Only</p>
//             <p className="text-sm text-gray-600">Filter users who are currently active</p>
//           </div>
//           <label className="relative inline-flex items-center cursor-pointer">
//             <input
//               type="checkbox"
//               checked={filters.showOnline}
//               onChange={(e) => handleFilterChange('showOnline', e.target.checked)}
//               className="sr-only peer"
//             />
//             <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
//           </label>
//         </div>

//         <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
//               <span className="text-blue-600">📍</span>
//             </div>
//             <div>
//               <p className="font-medium text-blue-800">Location Access</p>
//               <p className="text-sm text-blue-600">Allow location access to find matches near you</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   // Results Display Component
//   const SearchResults = () => (
//     <div className="mt-6 border-t pt-6">
//       <h3 className="text-lg font-semibold text-gray-800 mb-4">
//         Search Results ({searchResults.length})
//       </h3>
      
//       {loading ? (
//         <div className="text-center py-8">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
//           <p className="text-gray-600 mt-2">Searching...</p>
//         </div>
//       ) : searchResults.length > 0 ? (
//         <div className="grid gap-4">
//           {searchResults.map((profile) => (
//             <div key={profile.id} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
//               <div className="flex items-start justify-between">
//                 <div>
//                   <h4 className="font-semibold text-gray-800">
//                     {profile.first_name} {profile.last_name}
//                   </h4>
//                   <p className="text-gray-600 text-sm">{profile.profession} • {profile.city}</p>
//                   <p className="text-gray-500 text-sm mt-1">{profile.about}</p>
                  
//                   <div className="flex flex-wrap gap-1 mt-2">
//                     {profile.skills && profile.skills.map((skill, index) => (
//                       <span key={index} className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded">
//                         {skill}
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//                 <div className="text-right text-sm text-gray-500">
//                   <p>{profile.age} years</p>
//                   <p>{profile.experience} yrs exp</p>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <div className="text-center py-8 text-gray-500">
//           No results found. Try adjusting your search criteria.
//         </div>
//       )}
//     </div>
//   );

//   return (
//     <div className="bg-white rounded-2xl shadow-lg p-6 max-w-4xl mx-auto">
//       <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Find Your Match</h2>
      
//       {/* Tabs Navigation */}
//       <div className="flex border-b border-gray-200 mb-6">
//         {[
//           { id: "basic", label: "🔍 Basic Search" },
//           { id: "advanced", label: "⚡ Advanced Search" },
//           { id: "nearme", label: "📍 Near Me" }
//         ].map(tab => (
//           <button
//             key={tab.id}
//             onClick={() => setActiveTab(tab.id)}
//             className={`flex-1 py-4 px-6 text-center font-medium transition-all duration-200 border-b-2 ${
//               activeTab === tab.id
//                 ? 'border-indigo-600 text-indigo-600 bg-indigo-50'
//                 : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
//             }`}
//           >
//             {tab.label}
//           </button>
//         ))}
//       </div>

//       {/* Tab Content */}
//       <div className="min-h-[300px]">
//         {activeTab === "basic" && <BasicSearchTab />}
//         {activeTab === "advanced" && <AdvancedSearchTab />}
//         {activeTab === "nearme" && <NearMeTab />}
//       </div>

//       {/* Search Button */}
//       <div className="mt-8 pt-6 border-t border-gray-200">
//         <button type="submit"
//           onClick={handleSearch}
//           disabled={loading}
//           className={`w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium text-lg shadow-lg transition-all duration-200 transform hover:-translate-y-1 ${
//             loading ? 'opacity-50 cursor-not-allowed' : 'hover:from-indigo-700 hover:to-purple-700'
//           }`}
//         >
//           {loading ? '🔍 Searching...' : `🔍 Search ${activeTab === "basic" ? "Matches" : activeTab === "advanced" ? "Advanced" : "Nearby"}`}
//         </button>
//       </div>

//       {/* Search Results */}
//       <SearchResults />
//     </div>
//   );
// }













// // // src/components/chatsystem/AdvancedSearch.jsx
// // import React, { useState } from "react";

// // export default function AdvancedSearch() {
// //   const [activeTab, setActiveTab] = useState("basic");
// //   const [filters, setFilters] = useState({
// //     // Basic Search
// //     basicSearch: "",
    
// //     // Advanced Search
// //     gender: '',
// //     seeking: '',
// //     ageFrom: '',
// //     ageTo: '',
// //     country: '',
// //     state: '',
// //     city: '',
    
// //     // Near Me
// //     distance: '10',
// //     showOnline: true
// //   });

// //   const handleFilterChange = (field, value) => {
// //     setFilters(prev => ({ ...prev, [field]: value }));
// //   };

// //   // Tab Content Components
// //   const BasicSearchTab = () => (
// //     <div className="space-y-6 animate-fade-in">
// //       <div className="text-center mb-6">
// //         <h3 className="text-xl font-semibold text-gray-800 mb-2">Quick Search</h3>
// //         <p className="text-gray-600">Find matches with simple keywords</p>
// //       </div>
      
// //       <div className="space-y-4">
// //         <div>
// //           <label className="block text-sm font-medium text-gray-700 mb-2">
// //             Search by name, profession, or interests
// //           </label>
// //           <input
// //             type="text"
// //             placeholder="e.g. Doctor, Mumbai, Traveling..."
// //             value={filters.basicSearch}
// //             onChange={(e) => handleFilterChange('basicSearch', e.target.value)}
// //             className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
// //           />
// //         </div>
        
// //         <div className="grid grid-cols-2 gap-4">
// //           <div>
// //             <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
// //             <select
// //               value={filters.ageFrom}
// //               onChange={(e) => handleFilterChange('ageFrom', e.target.value)}
// //               className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
// //             >
// //               <option value="">Any Age</option>
// //               <option value="18">18-25</option>
// //               <option value="26">26-30</option>
// //               <option value="31">31-35</option>
// //               <option value="36">36+</option>
// //             </select>
// //           </div>
          
// //           <div>
// //             <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
// //             <input
// //               type="text"
// //               placeholder="Enter city"
// //               value={filters.city}
// //               onChange={(e) => handleFilterChange('city', e.target.value)}
// //               className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
// //             />
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );

// //   const AdvancedSearchTab = () => (
// //     <div className="space-y-6 animate-fade-in">
// //       <div className="text-center mb-6">
// //         <h3 className="text-xl font-semibold text-gray-800 mb-2">Advanced Search</h3>
// //         <p className="text-gray-600">Filter matches with detailed criteria</p>
// //       </div>
      
// //       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //         <div className="space-y-6">
// //           <div>
// //             <label className="block text-sm font-medium text-gray-700 mb-3">I Am</label>
// //             <div className="flex gap-3">
// //               {['Man', 'Woman'].map(gender => (
// //                 <button
// //                   key={gender}
// //                   onClick={() => handleFilterChange('gender', gender)}
// //                   className={`flex-1 py-3 rounded-xl border-2 transition-all duration-200 font-medium ${
// //                     filters.gender === gender 
// //                       ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-md' 
// //                       : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
// //                   }`}
// //                 >
// //                   {gender}
// //                 </button>
// //               ))}
// //             </div>
// //           </div>

// //           <div>
// //             <label className="block text-sm font-medium text-gray-700 mb-3">Seeking a</label>
// //             <div className="flex gap-3">
// //               {['Woman', 'Man'].map(seeking => (
// //                 <button
// //                   key={seeking}
// //                   onClick={() => handleFilterChange('seeking', seeking)}
// //                   className={`flex-1 py-3 rounded-xl border-2 transition-all duration-200 font-medium ${
// //                     filters.seeking === seeking 
// //                       ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-md' 
// //                       : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
// //                   }`}
// //                 >
// //                   {seeking}
// //                 </button>
// //               ))}
// //             </div>
// //           </div>

// //           <div>
// //             <label className="block text-sm font-medium text-gray-700 mb-3">
// //               Age Range: {filters.ageFrom || '18'} - {filters.ageTo || '60'}
// //             </label>
// //             <div className="space-y-4">
// //               <div className="flex gap-3">
// //                 <input
// //                   type="number"
// //                   placeholder="From"
// //                   value={filters.ageFrom}
// //                   onChange={(e) => handleFilterChange('ageFrom', e.target.value)}
// //                   className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
// //                 />
// //                 <input
// //                   type="number"
// //                   placeholder="To"
// //                   value={filters.ageTo}
// //                   onChange={(e) => handleFilterChange('ageTo', e.target.value)}
// //                   className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
// //                 />
// //               </div>
// //             </div>
// //           </div>
// //         </div>

// //         <div className="space-y-6">
// //           <div>
// //             <label className="block text-sm font-medium text-gray-700 mb-3">Country</label>
// //             <select
// //               value={filters.country}
// //               onChange={(e) => handleFilterChange('country', e.target.value)}
// //               className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
// //             >
// //               <option value="">Select Country</option>
// //               <option value="India">India</option>
// //               <option value="USA">USA</option>
// //               <option value="UK">UK</option>
// //             </select>
// //           </div>

// //           <div className="grid grid-cols-2 gap-3">
// //             <div>
// //               <label className="block text-sm font-medium text-gray-700 mb-3">State</label>
// //               <select
// //                 value={filters.state}
// //                 onChange={(e) => handleFilterChange('state', e.target.value)}
// //                 className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
// //               >
// //                 <option value="">Select State</option>
// //                 <option value="Delhi">Delhi</option>
// //                 <option value="Maharashtra">Maharashtra</option>
// //               </select>
// //             </div>
// //             <div>
// //               <label className="block text-sm font-medium text-gray-700 mb-3">City</label>
// //               <input
// //                 type="text"
// //                 placeholder="Enter city"
// //                 value={filters.city}
// //                 onChange={(e) => handleFilterChange('city', e.target.value)}
// //                 className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
// //               />
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );

// //   const NearMeTab = () => (
// //     <div className="space-y-6 animate-fade-in">
// //       <div className="text-center mb-6">
// //         <h3 className="text-xl font-semibold text-gray-800 mb-2">Find Nearby Matches</h3>
// //         <p className="text-gray-600">Connect with people in your area</p>
// //       </div>
      
// //       <div className="space-y-6">
// //         <div>
// //           <label className="block text-sm font-medium text-gray-700 mb-3">
// //             Distance: Within {filters.distance} km
// //           </label>
// //           <input
// //             type="range"
// //             min="1"
// //             max="50"
// //             value={filters.distance}
// //             onChange={(e) => handleFilterChange('distance', e.target.value)}
// //             className="w-full"
// //           />
// //           <div className="flex justify-between text-xs text-gray-500 mt-1">
// //             <span>1 km</span>
// //             <span>25 km</span>
// //             <span>50 km</span>
// //           </div>
// //         </div>

// //         <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
// //           <div>
// //             <p className="font-medium text-gray-800">Show Online Users Only</p>
// //             <p className="text-sm text-gray-600">Filter users who are currently active</p>
// //           </div>
// //           <label className="relative inline-flex items-center cursor-pointer">
// //             <input
// //               type="checkbox"
// //               checked={filters.showOnline}
// //               onChange={(e) => handleFilterChange('showOnline', e.target.checked)}
// //               className="sr-only peer"
// //             />
// //             <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
// //           </label>
// //         </div>

// //         <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
// //           <div className="flex items-center gap-3">
// //             <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
// //               <span className="text-blue-600">📍</span>
// //             </div>
// //             <div>
// //               <p className="font-medium text-blue-800">Location Access</p>
// //               <p className="text-sm text-blue-600">Allow location access to find matches near you</p>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );

// //   const handleSearch = () => {
// //     // Search logic based on active tab
// //     console.log("Searching with:", filters, "Active Tab:", activeTab);
// //     alert(`Searching with ${activeTab} filters!`);
// //   };

// //   return (
// //     <div className="bg-white rounded-2xl shadow-lg p-6 max-w-4xl mx-auto">
// //       <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Find Your Match</h2>
      
// //       {/* Tabs Navigation */}
// //       <div className="flex border-b border-gray-200 mb-6">
// //         {[
// //           { id: "basic", label: "🔍 Basic Search" },
// //           { id: "advanced", label: "⚡ Advanced Search" },
// //           { id: "nearme", label: "📍 Near Me" }
// //         ].map(tab => (
// //           <button
// //             key={tab.id}
// //             onClick={() => setActiveTab(tab.id)}
// //             className={`flex-1 py-4 px-6 text-center font-medium transition-all duration-200 border-b-2 ${
// //               activeTab === tab.id
// //                 ? 'border-indigo-600 text-indigo-600 bg-indigo-50'
// //                 : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
// //             }`}
// //           >
// //             {tab.label}
// //           </button>
// //         ))}
// //       </div>

// //       {/* Tab Content */}
// //       <div className="min-h-[300px]">
// //         {activeTab === "basic" && <BasicSearchTab />}
// //         {activeTab === "advanced" && <AdvancedSearchTab />}
// //         {activeTab === "nearme" && <NearMeTab />}
// //       </div>

// //       {/* Search Button */}
// //       <div className="mt-8 pt-6 border-t border-gray-200">
// //         <button
// //           onClick={handleSearch}
// //           className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 font-medium text-lg shadow-lg transition-all duration-200 transform hover:-translate-y-1"
// //         >
// //           🔍 Search {activeTab === "basic" ? "Matches" : activeTab === "advanced" ? "Advanced" : "Nearby"} 
// //         </button>
// //       </div>
// //     </div>
// //   );
// // }