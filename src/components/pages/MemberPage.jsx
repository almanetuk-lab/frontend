import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { adminAPI } from "../services/adminApi";

const MemberPage = () => {
  const navigate = useNavigate();

  // State for members
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGender, setSelectedGender] = useState("All");
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState(null);
  const [visibleCount, setVisibleCount] = useState(12); // ✅ Show only 12 initially

  // Initial load of members
  useEffect(() => {
    fetchMembers();
  }, []);

  // Search with debounce
  useEffect(() => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    if (searchTerm.trim() === "") {
      // If search is empty, show limited members
      setFilteredMembers(members.slice(0, visibleCount));
      return;
    }

    const timer = setTimeout(() => {
      performSearch();
    }, 500); // 500ms debounce

    setDebounceTimer(timer);

    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [searchTerm]);

  // Filter by gender
  useEffect(() => {
    filterMembersByGender();
  }, [selectedGender, members]);

  // Fetch initial members - LIMITED TO 12
  const fetchMembers = async () => {
    try {
      setLoading(true);
      
      // Use the CORRECT search API with basic mode
      const response = await adminAPI.searchProfiles({
        search_mode: "basic",
        first_name: "" // Empty to get all users
      });
      
      console.log("Initial members response:", response.data);
      
      if (response.data) {
        const membersData = Array.isArray(response.data)
          ? response.data
          : response.data.data || response.data.users || [];
        
        // ✅ Store all members but show only 12 initially
        setMembers(membersData);
        setFilteredMembers(membersData.slice(0, 12));
      }
    } catch (error) {
      console.error("Error fetching members:", error);
      // Fallback to dummy data if API fails
      const dummyMembers = getDummyMembers();
      setMembers(dummyMembers);
      setFilteredMembers(dummyMembers.slice(0, 12));
    } finally {
      setLoading(false);
    }
  };

  // Perform search using API - ALSO LIMITED
  const performSearch = async () => {
    if (!searchTerm.trim()) {
      // If search is cleared, show limited members again
      setFilteredMembers(members.slice(0, 12));
      setVisibleCount(12);
      return;
    }

    try {
      setSearchLoading(true);
      
      // Use the CORRECT search API
      const response = await adminAPI.searchProfiles({
        search_mode: "basic",
        first_name: searchTerm
      });
      
      console.log("Search response:", response.data);
      
      if (response.data) {
        const searchResults = Array.isArray(response.data)
          ? response.data
          : response.data.data || response.data.users || [];
        
        setMembers(searchResults);
        
        // Apply gender filter if selected
        if (selectedGender !== "All") {
          const genderFiltered = searchResults.filter(
            (member) => {
              const memberGender = member.gender?.toLowerCase();
              const selected = selectedGender.toLowerCase();
              return (
                memberGender === selected ||
                (selected === "man" && memberGender === "male") ||
                (selected === "woman" && memberGender === "female")
              );
            }
          );
          // ✅ Show only 12 filtered results
          setFilteredMembers(genderFiltered.slice(0, 12));
        } else {
          // ✅ Show only 12 search results
          setFilteredMembers(searchResults.slice(0, 12));
        }
        setVisibleCount(12); // Reset to 12 for search results
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setSearchLoading(false);
    }
  };

  // Filter members by gender - LIMITED TO 12
  const filterMembersByGender = () => {
    if (selectedGender === "All") {
      // Show only first 12 when showing all
      setFilteredMembers(members.slice(0, 12));
    } else {
      const filtered = members.filter((member) => {
        const memberGender = member.gender?.toLowerCase();
        const selected = selectedGender.toLowerCase();
        return (
          memberGender === selected ||
          (selected === "man" && memberGender === "male") ||
          (selected === "woman" && memberGender === "female")
        );
      });
      // Show only first 12 filtered results
      setFilteredMembers(filtered.slice(0, 12));
    }
    setVisibleCount(12); // Reset to 12 when filter changes
  };

  // Load More function
  const loadMoreMembers = () => {
    const newVisibleCount = visibleCount + 12;
    setVisibleCount(newVisibleCount);
    
    // Update filteredMembers to show more
    if (selectedGender === "All") {
      if (searchTerm.trim()) {
        // For search results
        const searchResults = members;
        setFilteredMembers(searchResults.slice(0, newVisibleCount));
      } else {
        // For all members
        setFilteredMembers(members.slice(0, newVisibleCount));
      }
    } else {
      const filtered = members.filter((member) => {
        const memberGender = member.gender?.toLowerCase();
        const selected = selectedGender.toLowerCase();
        return (
          memberGender === selected ||
          (selected === "man" && memberGender === "male") ||
          (selected === "woman" && memberGender === "female")
        );
      });
      setFilteredMembers(filtered.slice(0, newVisibleCount));
    }
  };

  // Handle search form submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    performSearch();
  };

  // Navigate to profile
  const handleViewProfile = (memberId) => {
    navigate(`/dashboard/profile/${memberId}`);
  };

  // Navigate to messages
  const handleSendMessage = (memberId) => {
    navigate(`/dashboard/messages?user=${memberId}`);
  };

  // Helper function to format name
  const formatName = (member) => {
    if (member.first_name && member.last_name) {
      return `${member.first_name} ${member.last_name}`;
    }
    return member.name || `User ${member.id || member.user_id}`;
  };

  // Helper function to get display city
  const getDisplayCity = (member) => {
    return member.city || member.address || "Location not specified";
  };

  // Dummy data fallback
  const getDummyMembers = () => [
    {
      id: 1,
      name: "Krish Ghosh",
      age: 29,
      gender: "Man",
      location: "Lakhimpur, India",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
      profession: "Software Engineer",
      education: "BTech Computer Science",
    },
    {
      id: 2,
      name: "Pihu Malik",
      age: 26,
      gender: "Woman",
      location: "Delhi, India",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face",
      profession: "Marketing Manager",
      education: "MBA",
    },
    {
      id: 3,
      name: "Rahul Sharma",
      age: 31,
      gender: "Man",
      location: "Mumbai, India",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
      profession: "Business Analyst",
      education: "MTech",
    },
    {
      id: 4,
      name: "Priya Singh",
      age: 27,
      gender: "Woman",
      location: "Bangalore, India",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
      profession: "Doctor",
      education: "MBBS, MD",
    },
    {
      id: 5,
      name: "Amit Patel",
      age: 32,
      gender: "Man",
      location: "Ahmedabad, India",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face",
      profession: "Architect",
      education: "BArch",
    },
    {
      id: 6,
      name: "Neha Gupta",
      age: 28,
      gender: "Woman",
      location: "Kolkata, India",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&crop=face",
      profession: "Fashion Designer",
      education: "BDes",
    },
  ];

  // Calculate if there are more members to load
  const hasMoreMembers = () => {
    if (selectedGender === "All") {
      return members.length > visibleCount;
    } else {
      const filtered = members.filter((member) => {
        const memberGender = member.gender?.toLowerCase();
        const selected = selectedGender.toLowerCase();
        return (
          memberGender === selected ||
          (selected === "man" && memberGender === "male") ||
          (selected === "woman" && memberGender === "female")
        );
      });
      return filtered.length > visibleCount;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Section */}
      <div className="bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSearchSubmit}>
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  {/* Search Input */}
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Search Members by name, profession or city..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                      disabled={searchLoading}
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                      {searchLoading ? (
                        <div className="w-5 h-5 border-2 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                      )}
                    </div>
                  </div>

                  {/* Gender Filter */}
                  <div className="w-full md:w-48">
                    <select
                      value={selectedGender}
                      onChange={(e) => setSelectedGender(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                    >
                      <option value="All">All Genders</option>
                      <option value="Man">Men</option>
                      <option value="Woman">Women</option>
                    </select>
                  </div>

                  {/* Search Button */}
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium rounded-xl hover:from-pink-600 hover:to-purple-700 transition-all"
                  >
                    Search
                  </button>
                </div>

                {/* Results Count */}
                <div className="text-center text-gray-600">
                  {searchLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-pink-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                      Searching...
                    </div>
                  ) : (
                    <div>
                      Showing {filteredMembers.length} of {members.length} members
                      {searchTerm && (
                        <span className="ml-2 text-sm text-pink-600">
                          for "{searchTerm}"
                        </span>
                      )}
                      <div className="text-sm text-gray-500 mt-1">
                        (Showing {visibleCount > filteredMembers.length ? filteredMembers.length : visibleCount} out of {filteredMembers.length} results)
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Members Grid */}
      <div className="container mx-auto px-4 py-12">
        {loading ? (
          // Loading state
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse"
              >
                <div className="h-80 bg-gray-300"></div>
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                  <div className="flex gap-3 mt-6">
                    <div className="flex-1 h-10 bg-gray-300 rounded-xl"></div>
                    <div className="flex-1 h-10 bg-gray-300 rounded-xl"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredMembers.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredMembers.slice(0, visibleCount).map((member) => (
                <div
                  key={member.id || member.user_id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 group"
                >
                  {/* Member Image */}
                  <div className="relative h-80 overflow-hidden">
                    <img
                      src={
                        member.image_url && member.image_url !== "Not provided"
                          ? member.image_url
                          : `https://ui-avatars.com/api/?name=${
                              encodeURIComponent(formatName(member))
                            }&background=random&size=300`
                      }
                      alt={formatName(member)}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${
                          encodeURIComponent(formatName(member))
                        }&background=random`;
                      }}
                    />

                    {/* Age Badge */}
                    <div className="absolute top-4 right-4 bg-white bg-opacity-90 px-3 py-1 rounded-full text-sm font-semibold text-gray-800">
                      {member.age || "N/A"} years
                    </div>
                  </div>

                  {/* Member Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-pink-600 transition-colors">
                      {formatName(member)}
                    </h3>

                    <div className="space-y-2 mb-4">
                      {/* City */}
                      <p className="text-gray-600 flex items-center gap-2">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        {getDisplayCity(member)}
                      </p>

                      {/* Profession */}
                      <p className="text-gray-600 flex items-center gap-2">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        {member.profession || "Profession not specified"}
                      </p>

                      {/* Education (if exists) */}
                      {member.education && member.education !== "Not provided" && (
                        <p className="text-gray-600 flex items-center gap-2">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 14l9-5-9-5-9 5 9 5z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 14l9-5-9-5-9 5 9 5zm0 0l-9 5m9-5v6"
                            />
                          </svg>
                          {member.education}
                        </p>
                      )}

                      {/* About (if exists) */}
                      {member.about && (
                        <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                          {member.about.length > 100 
                            ? `${member.about.substring(0, 100)}...` 
                            : member.about}
                        </p>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleViewProfile(member.id || member.user_id)}
                        className="flex-1 bg-pink-600 text-white py-3 rounded-xl font-semibold hover:bg-pink-700 transform hover:-translate-y-1 transition-all duration-200 shadow-lg hover:shadow-xl"
                      >
                        View Profile
                      </button>
                      <button
                        onClick={() => handleSendMessage(member.id || member.user_id)}
                        className="flex-1 border-2 border-pink-600 text-pink-600 py-3 rounded-xl font-semibold hover:bg-pink-600 hover:text-white transform hover:-translate-y-1 transition-all duration-200"
                      >
                        Message
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Button - Only show if there are more members */}
            {hasMoreMembers() && (
              <div className="text-center mt-12">
                <button
                  onClick={loadMoreMembers}
                  className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium rounded-xl hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
                >
                  Load More Members (Showing {visibleCount} of {members.length})
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <svg
                className="w-24 h-24 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No members found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search criteria or filters
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedGender("All");
                setVisibleCount(12);
                fetchMembers();
              }}
              className="mt-4 px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberPage;












// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { adminAPI } from "../services/adminApi"; 

// const MemberPage = () => {
//   const navigate = useNavigate();

//   // State for members
//   const [members, setMembers] = useState([]);
//   const [filteredMembers, setFilteredMembers] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedGender, setSelectedGender] = useState("All");
//   const [loading, setLoading] = useState(true);
//   const [searchLoading, setSearchLoading] = useState(false);
//   const [debounceTimer, setDebounceTimer] = useState(null);

//   // Initial load of members
//   useEffect(() => {
//     fetchMembers();
//   }, []);

//   // Search with debounce
//   useEffect(() => {
//     if (debounceTimer) {
//       clearTimeout(debounceTimer);
//     }

//     if (searchTerm.trim() === "") {
//       // If search is empty, show all members
//       setFilteredMembers(members);
//       return;
//     }

//     const timer = setTimeout(() => {
//       performSearch();
//     }, 500); // 500ms debounce

//     setDebounceTimer(timer);

//     return () => {
//       if (debounceTimer) {
//         clearTimeout(debounceTimer);
//       }
//     };
//   }, [searchTerm]);

//   // Filter by gender
//   useEffect(() => {
//     filterMembersByGender();
//   }, [selectedGender, members]);

  
//   const fetchMembers = async () => {
//     try {
//       setLoading(true);
      
//       // Use the CORRECT search API with basic mode
//       const response = await adminAPI.searchProfiles({
//         search_mode: "basic",
//         first_name: "" // Empty to get all users
//       });
      
//       console.log("Initial members response:", response.data);
      
//       if (response.data) {
//         const membersData = Array.isArray(response.data)
//           ? response.data
//           : response.data.data || response.data.users || [];
        
//         setMembers(membersData);
//         setFilteredMembers(membersData);
//       }
//     } catch (error) {
//       console.error("Error fetching members:", error);
//       // Fallback to dummy data if API fails
//       setMembers(getDummyMembers());
//       setFilteredMembers(getDummyMembers());
//     } finally {
//       setLoading(false);
//     }
//   };

//   //  MODIFIED: Perform search using the CORRECT search API
//   const performSearch = async () => {
//     if (!searchTerm.trim()) return;

//     try {
//       setSearchLoading(true);
      
//       // Use the CORRECT search API (same as AdvancedSearch)
//       const response = await adminAPI.searchProfiles({
//         search_mode: "basic",
//         first_name: searchTerm
//         // You can add more filters like in AdvancedSearch
//       });
      
//       console.log("Search response:", response.data);
      
//       if (response.data) {
//         const searchResults = Array.isArray(response.data)
//           ? response.data
//           : response.data.data || response.data.users || [];
        
//         setMembers(searchResults);
        
//         // Apply gender filter if selected
//         if (selectedGender !== "All") {
//           const genderFiltered = searchResults.filter(
//             (member) => {
//               const memberGender = member.gender?.toLowerCase();
//               const selected = selectedGender.toLowerCase();
//               return (
//                 memberGender === selected ||
//                 (selected === "man" && memberGender === "male") ||
//                 (selected === "woman" && memberGender === "female")
//               );
//             }
//           );
//           setFilteredMembers(genderFiltered);
//         } else {
//           setFilteredMembers(searchResults);
//         }
//       }
//     } catch (error) {
//       console.error("Search error:", error);
//     } finally {
//       setSearchLoading(false);
//     }
//   };

//   // Filter members by gender
//   const filterMembersByGender = () => {
//     if (selectedGender === "All") {
//       setFilteredMembers(members);
//     } else {
//       const filtered = members.filter((member) => {
//         const memberGender = member.gender?.toLowerCase();
//         const selected = selectedGender.toLowerCase();
//         return (
//           memberGender === selected ||
//           (selected === "man" && memberGender === "male") ||
//           (selected === "woman" && memberGender === "female")
//         );
//       });
//       setFilteredMembers(filtered);
//     }
//   };

//   // Handle search form submit
//   const handleSearchSubmit = (e) => {
//     e.preventDefault();
//     if (debounceTimer) {
//       clearTimeout(debounceTimer);
//     }
//     performSearch();
//   };

//   // Navigate to profile
//   const handleViewProfile = (memberId) => {
//     navigate(`/dashboard/profile/${memberId}`);
//   };

//   // Navigate to messages
//   const handleSendMessage = (memberId) => {
//     navigate(`/dashboard/messages?user=${memberId}`);
//   };

//   // Helper function to format name
//   const formatName = (member) => {
//     if (member.first_name && member.last_name) {
//       return `${member.first_name} ${member.last_name}`;
//     }
//     return member.name || `User ${member.id}`;
//   };

//   // Dummy data fallback
//   const getDummyMembers = () => [
//     {
//       id: 1,
//       name: "Krish Ghosh",
//       age: 29,
//       gender: "Man",
//       location: "Lakhimpur, India",
//       image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
//       profession: "Software Engineer",
//       education: "BTech Computer Science",
//     },
//     // ... other dummy members
//   ];

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Search Section */}
//       <div className="bg-gray-100 py-8">
//         <div className="container mx-auto px-4">
//           <div className="max-w-4xl mx-auto">
//             <form onSubmit={handleSearchSubmit}>
//               <div className="bg-white rounded-2xl shadow-sm p-6">
//                 <div className="flex flex-col md:flex-row gap-4 mb-6">
//                   {/* Search Input */}
//                   <div className="flex-1 relative">
//                     <input
//                       type="text"
//                       placeholder="Search Members by name, profession or city..."
//                       value={searchTerm}
//                       onChange={(e) => setSearchTerm(e.target.value)}
//                       className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
//                       disabled={searchLoading}
//                     />
//                     <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
//                       {searchLoading ? (
//                         <div className="w-5 h-5 border-2 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
//                       ) : (
//                         <svg
//                           className="w-5 h-5"
//                           fill="none"
//                           stroke="currentColor"
//                           viewBox="0 0 24 24"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//                           />
//                         </svg>
//                       )}
//                     </div>
//                   </div>

//                   {/* Gender Filter */}
//                   <div className="w-full md:w-48">
//                     <select
//                       value={selectedGender}
//                       onChange={(e) => setSelectedGender(e.target.value)}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
//                     >
//                       <option value="All">All Genders</option>
//                       <option value="Man">Men</option>
//                       <option value="Woman">Women</option>
//                     </select>
//                   </div>

//                   {/* Search Button */}
//                   <button
//                     type="submit"
//                     className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium rounded-xl hover:from-pink-600 hover:to-purple-700 transition-all"
//                   >
//                     Search
//                   </button>
//                 </div>

//                 {/* Results Count */}
//                 <div className="text-center text-gray-600">
//                   {searchLoading ? (
//                     <div className="flex items-center justify-center">
//                       <div className="w-4 h-4 border-2 border-pink-500 border-t-transparent rounded-full animate-spin mr-2"></div>
//                       Searching...
//                     </div>
//                   ) : (
//                     <div>
//                       Showing {filteredMembers.length} of {members.length}{" "}
//                       members
//                       {searchTerm && (
//                         <span className="ml-2 text-sm text-pink-600">
//                           for "{searchTerm}"
//                         </span>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>

//       {/* Members Grid */}
//       <div className="container mx-auto px-4 py-12">
//         {loading ? (
//           // Loading state
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {[1, 2, 3, 4, 5, 6].map((i) => (
//               <div
//                 key={i}
//                 className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse"
//               >
//                 <div className="h-80 bg-gray-300"></div>
//                 <div className="p-6 space-y-4">
//                   <div className="h-6 bg-gray-300 rounded w-3/4"></div>
//                   <div className="h-4 bg-gray-300 rounded w-1/2"></div>
//                   <div className="h-4 bg-gray-300 rounded w-2/3"></div>
//                   <div className="h-4 bg-gray-300 rounded w-1/3"></div>
//                   <div className="flex gap-3 mt-6">
//                     <div className="flex-1 h-10 bg-gray-300 rounded-xl"></div>
//                     <div className="flex-1 h-10 bg-gray-300 rounded-xl"></div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : filteredMembers.length > 0 ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {filteredMembers.map((member) => (
//               <div
//                 key={member.id || member.user_id}
//                 className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 group"
//               >
//                 {/* Member Image */}
//                 <div className="relative h-80 overflow-hidden">
//                   <img
//                     src={
//                       member.image_url && member.image_url !== "Not provided"
//                         ? member.image_url
//                         : `https://ui-avatars.com/api/?name=${
//                             formatName(member)
//                           }&background=random`
//                     }
//                     alt={formatName(member)}
//                     className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
//                     onError={(e) => {
//                       e.target.src = `https://ui-avatars.com/api/?name=${
//                         formatName(member)
//                       }&background=random`;
//                     }}
//                   />

//                   {/* Age Badge */}
//                   <div className="absolute top-4 right-4 bg-white bg-opacity-90 px-3 py-1 rounded-full text-sm font-semibold text-gray-800">
//                     {member.age || "N/A"} years
//                   </div>
//                 </div>

//                 {/* Member Info - SHOW ALL DATA FROM API */}
//                 <div className="p-6">
//                   <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-pink-600 transition-colors">
//                     {formatName(member)}
//                   </h3>

//                   <div className="space-y-2 mb-4">
                    
//                     {/* Profession */}
//                     <p className="text-gray-600 flex items-center gap-2">
//                       <svg
//                         className="w-4 h-4"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
//                         />
//                       </svg>
//                       {member.profession || "Profession not specified"}
//                     </p>
// {/* 
//                     // {/* Gender & Marital Status /}
//                     <p className="text-gray-600 flex items-center gap-2">
//                       <svg
//                         className="w-4 h-4"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z"
//                         />
//                       </svg>
//                       {member.gender || "Not specified"}
//                       {member.marital_status && ` • ${member.marital_status}`}
//                     </p> */}

//                      {/* Skills }
//                     {member.skills && (
//                       <div className="mt-3">
//                         <p className="text-sm text-gray-500 mb-1">Skills:</p>
//                         <div className="flex flex-wrap gap-2">
//                           {Array.isArray(member.skills) ? (
//                             member.skills.slice(0, 3).map((skill, index) => (
//                               <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
//                                 {skill}
//                               </span>
//                             ))
//                           ) : typeof member.skills === 'object' ? (
//                             Object.keys(member.skills).slice(0, 3).map((skill, index) => (
//                               <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
//                                 {skill}
//                               </span>
//                             ))
//                           ) : null}
//                         </div>
//                       </div>
//                     )} */}

//                     {/* About */}
//                     {member.about && (
//                       <p className="text-gray-600 text-sm mt-2">
//                         {member.about.length > 100 
//                           ? `${member.about.substring(0, 100)}...` 
//                           : member.about}
//                       </p>
//                     )}
//                   </div>

//                   {/* Action Buttons */}
//                   <div className="flex gap-3">
//                     <button
//                       onClick={() => handleViewProfile(member.id || member.user_id)}
//                       className="flex-1 bg-pink-600 text-white py-3 rounded-xl font-semibold hover:bg-pink-700 transform hover:-translate-y-1 transition-all duration-200 shadow-lg hover:shadow-xl"
//                     >
//                       View Profile
//                     </button>
//                     <button
//                       onClick={() => handleSendMessage(member.id || member.user_id)}
//                       className="flex-1 border-2 border-pink-600 text-pink-600 py-3 rounded-xl font-semibold hover:bg-pink-600 hover:text-white transform hover:-translate-y-1 transition-all duration-200"
//                     >
//                       Message
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="text-center py-16">
//             <div className="text-gray-400 mb-4">
//               <svg
//                 className="w-24 h-24 mx-auto"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={1}
//                   d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                 />
//               </svg>
//             </div>
//             <h3 className="text-xl font-semibold text-gray-600 mb-2">
//               No members found
//             </h3>
//             <p className="text-gray-500">
//               Try adjusting your search criteria or filters
//             </p>
//             <button
//               onClick={() => {
//                 setSearchTerm("");
//                 setSelectedGender("All");
//                 fetchMembers();
//               }}
//               className="mt-4 px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition"
//             >
//               Reset Filters
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MemberPage;


