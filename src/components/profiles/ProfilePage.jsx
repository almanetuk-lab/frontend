

import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useUserProfile } from "../context/UseProfileContext";
import { adminAPI } from "../services/adminApi";
import { getCurrentUserId } from "../services/chatApi";

export default function ProfilePage() {
  const { profile: currentUserProfile } = useUserProfile();
  const { userId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    console.log("🔵 ProfilePage MOUNTED - User ID:", userId);
    console.log("📍 Location State:", location.state);
    
    fetchUserProfile();
  }, [userId, location.state]);
  
  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("🔄 fetchUserProfile STARTED for userId:", userId);
      
      // ✅ 1. First check if data came from location state (MemberPage se)
      if (location.state?.userProfile) {
        console.log("✅ Using userProfile from location state");
        setUserProfile(location.state.userProfile);
        setLoading(false);
        return;
      }
      
      if (location.state?.memberData) {
        console.log("✅ Using memberData from location state");
        setUserProfile(location.state.memberData);
        setLoading(false);
        return;
      }
      
      // ✅ 2. Check if this is current user
      const currentUserId = getCurrentUserId();
      console.log("📌 Current User ID from localStorage:", currentUserId);
      console.log("📌 Profile Page User ID:", userId);
      
      if (userId == currentUserId) {
        console.log("✅ This is current user's profile");
        setIsCurrentUser(true);
        setUserProfile(currentUserProfile);
        setLoading(false);
        return;
      }
      
      // ✅ 3. Fetch from API using getUserDetails (Primary method)
      console.log("🔍 Calling getUserDetails API for userId:", userId);
      
      try {
        const response = await adminAPI.getUserDetails(userId);
        console.log("✅ getUserDetails API Response Status:", response.status);
        console.log("✅ getUserDetails API Response Data:", response.data);
        
        if (response.data) {
          console.log("✅ Successfully got user data from API");
          setUserProfile(response.data);
          setLoading(false);
          return;
        } else {
          console.log("⚠️ API returned empty data");
          setError("User data not found");
        }
        
      } catch (apiError) {
        console.error("❌ getUserDetails API Error:", apiError);
        console.error("❌ Error Response:", apiError.response?.data);
        console.error("❌ Error Status:", apiError.response?.status);
        
        // ✅ 4. Fallback: Try to get from searchProfiles
        console.log("🔄 Trying searchProfiles fallback...");
        try {
          const searchResponse = await adminAPI.searchProfiles({
            search_mode: "basic",
            first_name: ""
          });
          
          console.log("📊 SearchProfiles Response:", searchResponse.data);
          
          let allUsers = [];
          if (Array.isArray(searchResponse.data)) {
            allUsers = searchResponse.data;
          } else if (searchResponse.data && Array.isArray(searchResponse.data.data)) {
            allUsers = searchResponse.data.data;
          } else if (searchResponse.data && Array.isArray(searchResponse.data.users)) {
            allUsers = searchResponse.data.users;
          }
          
          console.log("👥 Total users found:", allUsers.length);
          
          const foundUser = allUsers.find(user => 
            user.id == userId || 
            user.user_id == userId ||
            user._id == userId
          );
          
          if (foundUser) {
            console.log("✅ Found user in search results");
            setUserProfile(foundUser);
          } else {
            console.log("❌ User not found in search results");
            setError("User not found in database");
          }
          
        } catch (searchError) {
          console.error("❌ searchProfiles also failed:", searchError);
          setError("Failed to load user data");
        }
      }
      
    } catch (error) {
      console.error("❌ Unexpected error in fetchUserProfile:", error);
      setError("An unexpected error occurred");
    } finally {
      console.log("🏁 fetchUserProfile COMPLETED");
      setLoading(false);
    }
  };
  
  const handleBackToMembers = () => {
    navigate("/dashboard/members");
  };
  
  const handleStartChat = () => {
    if (!userProfile) return;
    
    const memberName = userProfile.name || 
                      `${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim() || 
                      "User";
    
    console.log("💬 Starting chat with:", memberName, "ID:", userId);
    
    navigate(`/dashboard/messages`, {
      state: {
        selectedUser: {
          id: userId,
          name: memberName,
          receiverId: userId
        }
      }
    });
  };
  
  const handleRefresh = () => {
    console.log("🔃 Refreshing profile data...");
    fetchUserProfile();
  };
  
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN');
    } catch (error) {
      return dateString || "";
    }
  };

  const hasValue = (value) => {
    if (value === null || value === undefined || value === "") return false;
    if (typeof value === 'number' && !isNaN(value)) return true;
    if (typeof value === 'string' && value.trim() !== "") return true;
    if (Array.isArray(value) && value.length > 0) return true;
    return false;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
          <p className="text-sm text-gray-400 mt-1">User ID: {userId}</p>
        </div>
      </div>
    );
  }
  
  if (error || !userProfile) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="bg-white rounded-2xl shadow-lg p-6 max-w-4xl mx-auto">
          <button
            onClick={handleBackToMembers}
            className="mb-6 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 flex items-center gap-2"
          >
            ← Back to Members
          </button>
          
          <div className="text-center py-12">
            <div className="text-6xl mb-4">😕</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {error || "Profile Not Found"}
            </h3>
            <p className="text-gray-500 mb-4">
              User ID: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{userId}</span>
            </p>
            
            <div className="flex justify-center gap-3 mt-6">
              <button
                onClick={handleBackToMembers}
                className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition"
              >
                ← Browse Members
              </button>
              
              <button
                onClick={handleRefresh}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
              >
                🔄 Try Again
              </button>
            </div>
            
            <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-left">
              <p className="text-sm text-yellow-800">
                <strong>Debug Info:</strong>
              </p>
              <p className="text-xs text-yellow-600 mt-1">
                • Check console for detailed logs
                <br />
                • Verify user ID exists in database
                <br />
                • Check network requests in DevTools
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  console.log("✅ Profile Data loaded successfully:", userProfile);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        {/* Header with actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBackToMembers}
              className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 flex items-center gap-2 transition"
              title="Back to Members"
            >
              <span>←</span> 
              <span className="hidden sm:inline">Back</span>
            </button>
            <h1 className="text-2xl font-bold text-gray-800">
              {isCurrentUser ? "My Profile" : "Member Profile"}
              <span className="text-sm text-gray-500 font-normal ml-2">
                (ID: {userId})
              </span>
            </h1>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {!isCurrentUser && (
              <>
                <button
                  onClick={handleStartChat}
                  className="px-4 sm:px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 flex items-center gap-2 transition"
                  title="Send message to this user"
                >
                  <span>💬</span>
                  <span className="hidden sm:inline">Message</span>
                </button>
                
                <button
                  onClick={handleRefresh}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center gap-2 transition"
                  title="Refresh profile data"
                >
                  <span>🔄</span>
                  <span className="hidden sm:inline">Refresh</span>
                </button>
              </>
            )}
            
            {isCurrentUser && (
              <button
                onClick={() => navigate("/edit-profile")}
                className="px-4 sm:px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Profile Header */}
        <div className="flex flex-col items-center md:flex-row md:items-start gap-6 mb-8 p-6 bg-gray-50 rounded-lg">
          {userProfile.image_url || userProfile.profile_picture_url || userProfile.profilePhoto ? (
            <img
              src={userProfile.image_url || userProfile.profile_picture_url || userProfile.profilePhoto}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center border-4 border-white shadow-lg text-white text-3xl">
              {userProfile.first_name?.charAt(0) || userProfile.last_name?.charAt(0) || "U"}
            </div>
          )}
          
          <div className="text-center md:text-left flex-1">
            <h1 className="text-3xl font-bold text-gray-800">
              {hasValue(userProfile.first_name) || hasValue(userProfile.last_name) 
                ? `${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim()
                : "No Name Provided"}
            </h1>
            
            <p className="text-xl text-gray-600 mt-2">
              {hasValue(userProfile.headline) ? userProfile.headline : 
               hasValue(userProfile.profession) ? userProfile.profession : "No Profession"}
            </p>
            
            <div className="flex flex-wrap items-center gap-2 mt-3 text-gray-500">
              {hasValue(userProfile.city) && (
                <span className="flex items-center gap-1">
                  📍 {userProfile.city}
                </span>
              )}
              
              {hasValue(userProfile.age) && (
                <span className="flex items-center gap-1">
                  • 👤 {userProfile.age} years
                </span>
              )}
              
              {hasValue(userProfile.gender) && (
                <span className="flex items-center gap-1">
                  • {userProfile.gender === 'male' || userProfile.gender === 'man' ? '👨' : '👩'} {userProfile.gender}
                </span>
              )}
              
              {hasValue(userProfile.marital_status) && (
                <span className="flex items-center gap-1">
                  • 💍 {userProfile.marital_status}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="space-y-6">
            <Section title="Personal Information">
              <InfoItem label="First Name" value={userProfile.first_name} />
              <InfoItem label="Last Name" value={userProfile.last_name} />
              <InfoItem label="Email" value={userProfile.email} />
              <InfoItem label="Phone" value={userProfile.phone} />
              <InfoItem label="Date of Birth" value={formatDateForDisplay(userProfile.dob)} />
              <InfoItem label="Age" value={userProfile.age} />
              <InfoItem label="Gender" value={userProfile.gender} />
              <InfoItem label="Marital Status" value={userProfile.marital_status} />
              <InfoItem label="City" value={userProfile.city} />
              <InfoItem label="Country" value={userProfile.country} />
              <InfoItem label="Pincode" value={userProfile.pincode} />
              <InfoItem label="State" value={userProfile.state} />
              <InfoItem label="Address" value={userProfile.address} full />
            </Section>
          </div>

          {/* Professional Information */}
          <div className="space-y-6">
            <Section title="Professional Information">
              <InfoItem label="Headline" value={userProfile.headline} />
              <InfoItem label="Profession" value={userProfile.profession} />
              <InfoItem label="Company" value={userProfile.company} />
              <InfoItem label="Experience" value={hasValue(userProfile.experience) ? `${userProfile.experience} years` : ""} />
              <InfoItem label="Education" value={userProfile.education} />
            </Section>

            <Section title="About Me">
              <InfoItem label="About" value={userProfile.about} full />
            </Section>

            <Section title="Skills & Interests">
              <InfoItem 
                label="Skills" 
                value={Array.isArray(userProfile.skills) ? userProfile.skills.join(", ") : userProfile.skills} 
                full 
              />
              <InfoItem 
                label="Interests" 
                value={Array.isArray(userProfile.interests) ? userProfile.interests.join(", ") : userProfile.interests} 
                full 
              />
            </Section>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mt-8 pt-6 border-t">
          <button
            onClick={handleBackToMembers}
            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
          >
            ← Back to Members
          </button>
          
          {!isCurrentUser && (
            <>
              <button
                onClick={handleStartChat}
                className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition flex items-center gap-2"
              >
                <span>💬</span> Start Chat
              </button>
              
              <button
                onClick={handleRefresh}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center gap-2"
              >
                <span>🔄</span> Refresh
              </button>
            </>
          )}
          
          {isCurrentUser && (
            <button
              onClick={() => navigate("/edit-profile")}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Edit Profile
            </button>
          )}
        </div>
        
        {/* Debug Info (visible in development) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-gray-100 border border-gray-300 rounded-lg">
            <p className="text-sm font-semibold text-gray-700 mb-2">Debug Info:</p>
            <p className="text-xs text-gray-600">
              • Data Source: {location.state?.from || 'API'} 
              <br />
              • User ID: {userId}
              <br />
              • Profile Keys: {userProfile ? Object.keys(userProfile).join(', ') : 'None'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">{title}</h3>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}

function InfoItem({ label, value, full = false }) {
  const hasValue = (val) => {
    if (val === null || val === undefined || val === "") return false;
    if (typeof val === 'number' && !isNaN(val)) return true;
    if (typeof val === 'string' && val.trim() !== "") return true;
    if (Array.isArray(val) && val.length > 0) return true;
    return false;
  };

  if (!hasValue(value)) {
    return (
      <div className={full ? "col-span-2" : ""}>
        <p className="text-sm font-semibold text-gray-500">{label}</p>
        <p className="text-gray-400 italic">Not provided</p>
      </div>
    );
  }

  return (
    <div className={full ? "col-span-2" : ""}>
      <p className="text-sm font-semibold text-gray-500 mb-1">{label}</p>
      <p className="text-gray-700 break-words">
        {Array.isArray(value) ? value.join(", ") : value}
      </p>
    </div>
  );
}






















// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { useUserProfile } from "../context/UseProfileContext";

// export default function ProfilePage() {
//   const { profile } = useUserProfile();
//   const navigate = useNavigate();

//   if (!profile) {
//     return (
//       <div className="min-h-screen bg-gray-100 flex items-center justify-center">
//         <div className="text-center">
//           <p className="text-gray-500 text-lg mb-4">No profile data found</p>
//           <button
//             onClick={() => navigate("/edit-profile")}
//             className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
//           >
//             Create Profile
//           </button>
//         </div>
//       </div>
//     );
//   }

//   console.log("🔵 Profile Data in ProfilePage:", profile);

//   // Format date for display
//   const formatDateForDisplay = (dateString) => {
//     if (!dateString) return "";
//     try {
//       const date = new Date(dateString);
//       return date.toLocaleDateString('en-IN');
//     } catch (error) {
//       return dateString || "";
//     }
//   };

//   // Check if value exists
//   const hasValue = (value) => {
//     if (value === null || value === undefined || value === "") return false;
//     if (typeof value === 'number' && !isNaN(value)) return true;
//     if (typeof value === 'string' && value.trim() !== "") return true;
//     if (Array.isArray(value) && value.length > 0) return true;
//     return false;
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-8">
//           <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
//           <button
//             onClick={() => navigate("/edit-profile")}
//             className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
//           >
//             Edit Profile
//           </button>
//         </div>

//         {/* Profile Header */}
//         <div className="flex flex-col items-center md:flex-row md:items-start gap-6 mb-8 p-6 bg-gray-50 rounded-lg">
//           {/* ✅ YAHI CHANGE KIYA HAI - image_url add kiya hai */}
//           {profile.image_url || profile.profile_picture_url || profile.profilePhoto ? (
//             <img
//               src={profile.image_url || profile.profile_picture_url || profile.profilePhoto}
//               alt="Profile"
//               className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
//             />
//           ) : (
//             <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center border-4 border-white shadow-lg text-gray-400">
//               No Photo
//             </div>
//           )}
//           <div className="text-center md:text-left flex-1">
//             <h1 className="text-3xl font-bold text-gray-800">
//               {hasValue(profile.first_name) || hasValue(profile.last_name) 
//                 ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim()
//                 : "No Name"}
//             </h1>
//             <p className="text-xl text-gray-600 mt-2">
//               {hasValue(profile.headline) ? profile.headline : 
//                hasValue(profile.profession) ? profile.profession : "No Profession"}
//             </p>
//             <p className="text-gray-500 mt-1">
//               {hasValue(profile.city) ? profile.city : "No Location"} • 
//               {hasValue(profile.age) ? ` ${profile.age} years` : " Age not specified"}
//             </p>
//             <p className="text-gray-500">
//               {hasValue(profile.gender) ? profile.gender : "Gender not specified"} • 
//               {hasValue(profile.marital_status) ? profile.marital_status : "Marital status not specified"}
//             </p>
//           </div>
//         </div>

//         {/* Profile Details */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {/* Personal Information */}
//           <div className="space-y-6">
//             <Section title="Personal Information">
//               {/* ✅ FIRST NAME ADD KIYA HAI */}
//               <InfoItem label="First Name" value={profile.first_name} />
//               {/* ✅ LAST NAME ADD KIYA HAI */}
//               <InfoItem label="Last Name" value={profile.last_name} />
//               <InfoItem label="Email" value={profile.email} />
//               <InfoItem label="Phone" value={profile.phone} />
//               <InfoItem label="Date of Birth" value={formatDateForDisplay(profile.dob)} />
//               <InfoItem label="Age" value={profile.age} />
//               <InfoItem label="Gender" value={profile.gender} />
//               <InfoItem label="Marital Status" value={profile.marital_status} />
//               <InfoItem label="City" value={profile.city} />
//               <InfoItem label="Country" value={profile.country} />
//               <InfoItem label="Pincode" value={profile.pincode} />
//               <InfoItem label="state" value={profile.state} />
//               <InfoItem label="Address" value={profile.address} full />
            
//             </Section>
//           </div>

//           {/* Professional Information */}
//           <div className="space-y-6">
//             <Section title="Professional Information">
//               <InfoItem label="Headline" value={profile.headline} />
//               <InfoItem label="Profession" value={profile.profession} />
//               <InfoItem label="Company" value={profile.company} />
//               <InfoItem label="Experience" value={hasValue(profile.experience) ? `${profile.experience} years` : ""} />
//               <InfoItem label="Education" value={profile.education} />
//             </Section>

//             {/* About & Skills */}
//             <Section title="About Me">
//               <InfoItem label="About" value={profile.about} full />
//             </Section>

//             <Section title="Skills & Interests">
//               <InfoItem 
//                 label="Skills" 
//                 value={Array.isArray(profile.skills) ? profile.skills.join(", ") : profile.skills} 
//                 full 
//               />
//               <InfoItem 
//                 label="Interests" 
//                 value={Array.isArray(profile.interests) ? profile.interests.join(", ") : profile.interests} 
//                 full 
//               />
//             </Section>
//           </div>
//         </div>

//         {/* Action Buttons */}
//         <div className="flex justify-center gap-4 mt-8 pt-6 border-t">
//           <button
//             onClick={() => navigate("/dashboard")}
//             className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
//           >
//             Back to Dashboard
//           </button>
//           <button
//             onClick={() => navigate("/edit-profile")}
//             className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
//           >
//             Edit Profile
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // Section Component
// function Section({ title, children }) {
//   return (
//     <div className="bg-white border border-gray-200 rounded-lg p-6">
//       <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">{title}</h3>
//       <div className="space-y-4">
//         {children}
//       </div>
//     </div>
//   );
// }

// // Info Item Component
// function InfoItem({ label, value, full = false }) {
//   const hasValue = (val) => {
//     if (val === null || val === undefined || val === "") return false;
//     if (typeof val === 'number' && !isNaN(val)) return true;
//     if (typeof val === 'string' && val.trim() !== "") return true;
//     if (Array.isArray(val) && val.length > 0) return true;
//     return false;
//   };

//   if (!hasValue(value)) {
//     return (
//       <div className={full ? "col-span-2" : ""}>
//         <p className="text-sm font-semibold text-gray-500">{label}</p>
//         <p className="text-gray-400 italic">Not provided</p>
//       </div>
//     );
//   }

//   return (
//     <div className={full ? "col-span-2" : ""}>
//       <p className="text-sm font-semibold text-gray-500 mb-1">{label}</p>
//       <p className="text-gray-700">
//         {Array.isArray(value) ? value.join(", ") : value}
//       </p>
//     </div>
//   );
// }































