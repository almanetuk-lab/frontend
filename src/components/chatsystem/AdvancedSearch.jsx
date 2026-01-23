// import React, { useState, useEffect } from 'react';

// export default function SearchSystem() {
//   const [activeTab, setActiveTab] = useState('basic');
//   const [savedSearches, setSavedSearches] = useState([]);
  
//   // Search states for different tabs
//   const [basicSearch, setBasicSearch] = useState({
//     iAm: 'Man',
//     seeking: 'Woman',
//     ageFrom: 18,
//     ageTo: 90,
//     country: 'India',
//     state: '',
//     city: 'Delhi'
//   });

//   const [advancedSearch, setAdvancedSearch] = useState({
//     education: '',
//     profession: '',
//     religion: '',
//     income: '',
//     maritalStatus: ''
//   });

//   // Load saved searches
//   useEffect(() => {
//     const saved = localStorage.getItem('savedSearches');
//     if (saved) {
//       setSavedSearches(JSON.parse(saved));
//     }
//   }, []);

//   // Handle basic search changes
//   const handleBasicSearchChange = (field, value) => {
//     setBasicSearch(prev => ({ ...prev, [field]: value }));
//   };

//   // Handle advanced search changes
//   const handleAdvancedSearchChange = (field, value) => {
//     setAdvancedSearch(prev => ({ ...prev, [field]: value }));
//   };

//   // Execute search
//   const executeSearch = () => {
//     const searchCriteria = activeTab === 'basic' ? basicSearch : advancedSearch;
//     console.log('Searching with:', searchCriteria);
//   };

//   return (
//     <div className="bg-white rounded-lg shadow-lg p-6">
//       {/* Tabs */}
//       <div className="flex border-b border-gray-300 mb-6 pb-2">
//         {['basic', 'advanced', 'saved', 'nearme'].map(tab => (
//           <button
//             key={tab}
//             onClick={() => setActiveTab(tab)}
//             className={`px-4 py-2 font-medium capitalize ${
//               activeTab === tab ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'
//             }`}
//           >
//             {tab === 'basic' && 'Basic Search'}
//             {tab === 'advanced' && 'Advanced Search'}
//             {tab === 'saved' && 'Saved Searches'}
//             {tab === 'nearme' && 'Near Me'}
//           </button>
//         ))}
//       </div>

//       {/* Tab Content */}
//       <div>
//         {/* Basic Search Tab */}
//         {activeTab === 'basic' && (
//           <div className="space-y-6">
//             <div className="grid grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-3">I am:</label>
//                 <div className="flex gap-2">
//                   {['Man', 'Woman'].map(gender => (
//                     <button
//                       key={gender}
//                       type="button"
//                       onClick={() => handleBasicSearchChange('iAm', gender)}
//                       className={`flex-1 py-2 px-4 border rounded text-sm font-medium ${
//                         basicSearch.iAm === gender
//                           ? 'bg-blue-100 border-blue-500 text-blue-700'
//                           : 'bg-white border-gray-300 text-gray-700'
//                       }`}
//                     >
//                       {gender}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-3">Seeking a:</label>
//                 <div className="flex gap-2">
//                   {['Woman', 'Man'].map(seeking => (
//                     <button
//                       key={seeking}
//                       type="button"
//                       onClick={() => handleBasicSearchChange('seeking', seeking)}
//                       className={`flex-1 py-2 px-4 border rounded text-sm font-medium ${
//                         basicSearch.seeking === seeking
//                           ? 'bg-blue-100 border-blue-500 text-blue-700'
//                           : 'bg-white border-gray-300 text-gray-700'
//                       }`}
//                     >
//                       {seeking}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-3">Age:</label>
//               <div className="flex items-center gap-4">
//                 <input
//                   type="number"
//                   value={basicSearch.ageFrom}
//                   onChange={(e) => handleBasicSearchChange('ageFrom', e.target.value)}
//                   className="w-20 px-3 py-2 border border-gray-300 rounded"
//                   min="18"
//                   max="90"
//                 />
//                 <span className="text-gray-500">to</span>
//                 <input
//                   type="number"
//                   value={basicSearch.ageTo}
//                   onChange={(e) => handleBasicSearchChange('ageTo', e.target.value)}
//                   className="w-20 px-3 py-2 border border-gray-300 rounded"
//                   min="18"
//                   max="90"
//                 />
//               </div>
//             </div>

//             <div className="grid grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Country:</label>
//                 <select
//                   value={basicSearch.country}
//                   onChange={(e) => handleBasicSearchChange('country', e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded"
//                 >
//                   <option value="India">India</option>
//                   <option value="USA">USA</option>
//                   <option value="UK">UK</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">State:</label>
//                 <select
//                   value={basicSearch.state}
//                   onChange={(e) => handleBasicSearchChange('state', e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded"
//                 >
//                   <option value="">Select State</option>
//                   <option value="Delhi">Delhi</option>
//                   <option value="Maharashtra">Maharashtra</option>
//                 </select>
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">City:</label>
//               <input
//                 type="text"
//                 value={basicSearch.city}
//                 onChange={(e) => handleBasicSearchChange('city', e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded"
//                 placeholder="Enter city"
//               />
//             </div>

//             <button
//               onClick={executeSearch}
//               className="w-full py-3 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
//             >
//               Search
//             </button>
//           </div>
//         )}

//         {/* Advanced Search Tab */}
//         {activeTab === 'advanced' && (
//           <div className="space-y-6">
//             <div className="grid grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Education</label>
//                 <select
//                   value={advancedSearch.education}
//                   onChange={(e) => handleAdvancedSearchChange('education', e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded"
//                 >
//                   <option value="">Any Education</option>
//                   <option value="graduate">Graduate</option>
//                   <option value="post-graduate">Post Graduate</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Profession</label>
//                 <input
//                   type="text"
//                   value={advancedSearch.profession}
//                   onChange={(e) => handleAdvancedSearchChange('profession', e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded"
//                   placeholder="Enter profession"
//                 />
//               </div>
//             </div>

//             <div className="grid grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Religion</label>
//                 <select
//                   value={advancedSearch.religion}
//                   onChange={(e) => handleAdvancedSearchChange('religion', e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded"
//                 >
//                   <option value="">Any Religion</option>
//                   <option value="hindu">Hindu</option>
//                   <option value="muslim">Muslim</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Marital Status</label>
//                 <select
//                   value={advancedSearch.maritalStatus}
//                   onChange={(e) => handleAdvancedSearchChange('maritalStatus', e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded"
//                 >
//                   <option value="">Any Status</option>
//                   <option value="single">Single</option>
//                   <option value="divorced">Divorced</option>
//                 </select>
//               </div>
//             </div>

//             <button
//               onClick={executeSearch}
//               className="w-full py-3 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
//             >
//               Advanced Search
//             </button>
//           </div>
//         )}

//         {/* Other tabs can be added similarly */}
//       </div>
//     </div>
//   );
// }