import React, { useEffect, useState } from "react";
import { useUserProfile } from "../context/UseProfileContext";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { adminAPI } from "../services/adminApi";

export default function ProfilePage() {
  const { profile: currentUserProfile } = useUserProfile();
  const [displayProfile, setDisplayProfile] = useState(null);
  const { userId } = useParams(); //  Will be undefined for current user
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isCurrentUser, setIsCurrentUser] = useState(false);

  useEffect(() => {
    console.log("=== PROFILE PAGE LOADING ===");
    console.log("URL userId parameter:", userId);
    console.log("Current User Profile:", currentUserProfile?.email);
    
    // Check if this is current user's profile
    const checkCurrentUser = () => {
      if (!userId) {
        // No userId in URL = current user profile
        return true;
      }
      
      const currentUserId = currentUserProfile?.id || currentUserProfile?.user_id;
      return currentUserId == userId;
    };
    
    const isOwnProfile = checkCurrentUser();
    setIsCurrentUser(isOwnProfile);
    console.log("Is current user?", isOwnProfile);
    
    // ✅ CASE 1: Current user profile (no userId in URL)
    if (!userId) {
      console.log("✅ LOADING CURRENT USER PROFILE");
      if (currentUserProfile) {
        setDisplayProfile(currentUserProfile);
        setLoading(false);
      } else {
        // Fetch current user data
        fetchCurrentUserData();
      }
    }
    // ✅ CASE 2: Other user profile from MemberPage
    else if (location.state?.userProfile) {
      console.log("✅ LOADING OTHER USER PROFILE FROM MEMBER PAGE");
      setDisplayProfile(location.state.userProfile);
      setLoading(false);
    }
    // ✅ CASE 3: Other user profile (direct URL)
    else {
      console.log("✅ LOADING OTHER USER PROFILE FROM API");
      fetchUserData(userId);
    }
  }, [userId, location.state, currentUserProfile]);

  const fetchCurrentUserData = async () => {
    try {
      setLoading(true);
      // Fetch current user data from API
      const currentUserId = currentUserProfile?.id || currentUserProfile?.user_id;
      if (currentUserId) {
        const response = await adminAPI.getUserDetails(currentUserId);
        if (response.data) {
          setDisplayProfile(response.data);
        } else {
          setDisplayProfile(currentUserProfile);
        }
      } else {
        setDisplayProfile(currentUserProfile);
      }
    } catch (error) {
      console.error("Error fetching current user:", error);
      setDisplayProfile(currentUserProfile);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserData = async (id) => {
    try {
      setLoading(true);
      const response = await adminAPI.getUserDetails(id);
      
      if (response.data) {
        setDisplayProfile(response.data);
      } else {
        // Create minimal profile object
        setDisplayProfile({
          user_id: id,
          name: `User ${id}`,
        });
      }
    } catch (error) {
      console.error("API Error:", error);
      setDisplayProfile({
        user_id: id,
        name: `User ${id}`,
        error: "Could not load profile"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!displayProfile) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg mb-4">Profile not found</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  console.log("Display Profile Email:", displayProfile?.email);

  // ✅ FIXED: Format date
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-IN", {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch (error) {
      return dateString || "";
    }
  };

  // ✅ FIXED: Check if value exists
  const hasValue = (value) => {
    if (value === null || value === undefined) return false;
    if (typeof value === "string" && value.trim() === "") return false;
    if (typeof value === "number" && isNaN(value)) return false;
    if (Array.isArray(value) && value.length === 0) return false;
    return true;
  };

  // ✅ FIXED: Get display value
  const getDisplayValue = (value) => {
    if (!hasValue(value)) return null;
    
    if (Array.isArray(value)) {
      return value.join(", ");
    }
    
    if (typeof value === "object") {
      return JSON.stringify(value);
    }
    
    return value;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {isCurrentUser ? "My Profile" : "User Profile"}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                User ID: {displayProfile.user_id || displayProfile.id || "N/A"}
              </span>
              {location.state?.from === "member_page" && (
                <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2 py-1 rounded">
                  From Member Page
                </span>
              )}
              {isCurrentUser && (
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                  Your Profile
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition text-sm"
            >
              Go Back
            </button>
            
            {isCurrentUser && (
              <button
                onClick={() => navigate("/edit-profile")}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm"
              >
                Edit Profile
              </button>
            )}
            
            <button
              onClick={() => navigate("/dashboard")}
              className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition text-sm"
            >
              Dashboard
            </button>
          </div>
        </div>

        {/* Profile Header */}
        <div className="flex flex-col items-center md:flex-row md:items-start gap-6 mb-8 p-6 bg-gray-50 rounded-lg">
          {displayProfile.image_url ? (
            <img
              src={displayProfile.image_url}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center border-4 border-white shadow-lg">
              <span className="text-4xl font-bold text-gray-400">
                {(
                  displayProfile.first_name?.[0] ||
                  displayProfile.name?.[0] ||
                  "U"
                ).toUpperCase()}
              </span>
            </div>
          )}

          <div className="text-center md:text-left flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              {getDisplayValue(displayProfile.first_name) || getDisplayValue(displayProfile.last_name)
                ? `${displayProfile.first_name || ""} ${displayProfile.last_name || ""}`.trim()
                : displayProfile.name || "User"}
            </h1>

            <p className="text-lg md:text-xl text-gray-600 mt-2">
              {displayProfile.headline || displayProfile.profession || "No Profession"}
            </p>

            <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
              {displayProfile.city && (
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                  📍 {displayProfile.city}
                </span>
              )}
              
              {displayProfile.age && (
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                  🎂 {displayProfile.age} years
                </span>
              )}
              
              {displayProfile.gender && (
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                  {displayProfile.gender}
                </span>
              )}
              
              {displayProfile.marital_status && (
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                  {displayProfile.marital_status}
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
              <InfoItem label="First Name" value={displayProfile.first_name} />
              <InfoItem label="Last Name" value={displayProfile.last_name} />
              
              {/* ✅ FIXED: Email Field */}
              <InfoItem 
                label="Email" 
                value={displayProfile.email} 
                type="email"
              />
              
              <InfoItem label="Phone" value={displayProfile.phone} />
              <InfoItem
                label="Date of Birth"
                value={formatDateForDisplay(displayProfile.dob)}
              />
              <InfoItem label="Age" value={displayProfile.age} />
              <InfoItem label="Gender" value={displayProfile.gender} />
              <InfoItem
                label="Marital Status"
                value={displayProfile.marital_status}
              />
              <InfoItem label="City" value={displayProfile.city} />
              <InfoItem label="Country" value={displayProfile.country} />
              <InfoItem label="Pincode" value={displayProfile.pincode} />
              <InfoItem label="State" value={displayProfile.state} />
              <InfoItem label="Address" value={displayProfile.address} full />
            </Section>
          </div>

          {/* Professional Information */}
          <div className="space-y-6">
            <Section title="Professional Information">
              <InfoItem label="Headline" value={displayProfile.headline} />
              <InfoItem label="Profession" value={displayProfile.profession} />
              <InfoItem label="Company" value={displayProfile.company} />
              <InfoItem
                label="Experience"
                value={
                  hasValue(displayProfile.experience)
                    ? `${displayProfile.experience} years`
                    : ""
                }
              />
              <InfoItem label="Education" value={displayProfile.education} />
            </Section>

            {/* About & Skills */}
            <Section title="About Me">
              <InfoItem label="About" value={displayProfile.about} full />
            </Section>

            <Section title="Skills & Interests">
              <InfoItem
                label="Skills"
                value={
                  Array.isArray(displayProfile.skills)
                    ? displayProfile.skills.join(", ")
                    : typeof displayProfile.skills === 'object'
                    ? Object.keys(displayProfile.skills || {}).join(", ")
                    : displayProfile.skills
                }
                full
              />
              <InfoItem
                label="Interests"
                value={
                  Array.isArray(displayProfile.interests)
                    ? displayProfile.interests.join(", ")
                    : displayProfile.interests
                }
                full
              />
            </Section>
          </div>
        </div>
      </div>
    </div>
  );
}

// ✅ FIXED: InfoItem Component with email support
function InfoItem({ label, value, full = false, type = "text" }) {
  const hasValue = (val) => {
    if (val === null || val === undefined) return false;
    if (typeof val === "string" && val.trim() === "") return false;
    if (typeof val === "number" && isNaN(val)) return false;
    if (Array.isArray(val) && val.length === 0) return false;
    return true;
  };

  const displayValue = hasValue(value) ? value : null;

  if (!displayValue) {
    return (
      <div className={full ? "col-span-2" : ""}>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-gray-400 italic">Not provided</p>
      </div>
    );
  }

  return (
    <div className={full ? "col-span-2" : ""}>
      <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
      {type === "email" ? (
        <a 
          href={`mailto:${displayValue}`}
          className="text-blue-600 hover:text-blue-800 hover:underline"
        >
          {displayValue}
        </a>
      ) : (
        <p className="text-gray-700">
          {Array.isArray(displayValue) ? displayValue.join(", ") : displayValue}
        </p>
      )}
    </div>
  );
}

// Section Component
function Section({ title, children }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">
        {title}
      </h3>
      <div className="space-y-3 md:space-y-4">{children}</div>
    </div>
  );
}






















// import React, { useEffect, useState } from "react";
// import { useUserProfile } from "../context/UseProfileContext";
// import { useParams, useLocation, useNavigate } from "react-router-dom";
// import { adminAPI } from "../services/adminApi";

// export default function ProfilePage() {
//   const { profile: currentUserProfile } = useUserProfile();
//   const [displayProfile, setDisplayProfile] = useState(null);
//   const { userId } = useParams();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Check if this is current user's own profile
//     const currentUserId = currentUserProfile?.id || currentUserProfile?.user_id;
//     const isCurrentUserProfile = currentUserId == userId;

//     // Priority 1: Data from MemberPage navigation
//     if (location.state?.userProfile) {
//       console.log("✅ Using data from MemberPage");
//       setDisplayProfile(location.state.userProfile);
//       setLoading(false);
//     }
//     // Priority 2: Current user viewing own profile
//     else if (isCurrentUserProfile && currentUserProfile) {
//       console.log("✅ Showing current user's own profile");
//       setDisplayProfile(currentUserProfile);
//       setLoading(false);
//     }
//     // Priority 3: Fetch user data from API
//     else {
//       console.log("🔄 Fetching user data from API");
//       fetchUserData(userId);
//     }
//   }, [userId, location.state, currentUserProfile]);

//   const fetchUserData = async (id) => {
//     try {
//       setLoading(true);
//       const response = await adminAPI.getUserDetails(id);
      
//       if (response.data) {
//         setDisplayProfile(response.data);
//       } else {
//         // Create minimal profile object
//         setDisplayProfile({
//           user_id: id,
//           name: `User ${id}`,
//         });
//       }
//     } catch (error) {
//       console.error("API Error:", error);
//       // Fallback profile
//       setDisplayProfile({
//         user_id: id,
//         name: `User ${id}`,
//         error: "Could not load profile"
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-100 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading profile...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!displayProfile) {
//     return (
//       <div className="min-h-screen bg-gray-100 flex items-center justify-center">
//         <div className="text-center">
//           <p className="text-gray-500 text-lg mb-4">Profile not found</p>
//           <button
//             onClick={() => navigate(-1)}
//             className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
//           >
//             Go Back
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // Check if this is current user
//   const currentUserId = currentUserProfile?.id || currentUserProfile?.user_id;
//   const isCurrentUser = currentUserId == userId;

//   // Format date for display
//   const formatDateForDisplay = (dateString) => {
//     if (!dateString) return "";
//     try {
//       const date = new Date(dateString);
//       return date.toLocaleDateString("en-IN");
//     } catch (error) {
//       return dateString || "";
//     }
//   };

//   // Check if value exists
//   const hasValue = (value) => {
//     if (value === null || value === undefined || value === "") return false;
//     if (typeof value === "string" && value.trim() !== "") return true;
//     if (typeof value === "number" && !isNaN(value)) return true;
//     if (Array.isArray(value) && value.length > 0) return true;
//     return false;
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-4 md:p-6">
//       <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-4 md:p-6">
//         {/* Header */}
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-800">
//               {isCurrentUser ? "My Profile" : "User Profile"}
//             </h1>
//             <div className="flex items-center gap-2 mt-1">
//               <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
//                 User ID: {displayProfile.user_id || displayProfile.id}
//               </span>
//               {location.state?.from === "member_page" && (
//                 <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2 py-1 rounded">
//                   From Member Page
//                 </span>
//               )}
//             </div>
//           </div>

//           <div className="flex gap-2">
//             <button
//               onClick={() => navigate(-1)}
//               className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition text-sm"
//             >
//               Go Back
//             </button>
            
//             {isCurrentUser && (
//               <button
//                 onClick={() => navigate("/edit-profile")}
//                 className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm"
//               >
//                 Edit Profile
//               </button>
//             )}
            
//             <button
//               onClick={() => navigate("/dashboard")}
//               className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition text-sm"
//             >
//               Dashboard
//             </button>
//           </div>
//         </div>

//         {/* Profile Header */}
//         <div className="flex flex-col items-center md:flex-row md:items-start gap-6 mb-8 p-6 bg-gray-50 rounded-lg">
//           {displayProfile.image_url ? (
//             <img
//               src={displayProfile.image_url}
//               alt="Profile"
//               className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
//             />
//           ) : (
//             <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center border-4 border-white shadow-lg">
//               <span className="text-4xl font-bold text-gray-400">
//                 {(
//                   displayProfile.first_name?.[0] ||
//                   displayProfile.name?.[0] ||
//                   "U"
//                 ).toUpperCase()}
//               </span>
//             </div>
//           )}

//           <div className="text-center md:text-left flex-1">
//             <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
//               {hasValue(displayProfile.first_name) || hasValue(displayProfile.last_name)
//                 ? `${displayProfile.first_name || ""} ${displayProfile.last_name || ""}`.trim()
//                 : displayProfile.name || "User"}
//             </h1>

//             <p className="text-lg md:text-xl text-gray-600 mt-2">
//               {displayProfile.headline || displayProfile.profession || "No Profession"}
//             </p>

//             <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
//               {displayProfile.city && (
//                 <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
//                   📍 {displayProfile.city}
//                 </span>
//               )}
              
//               {displayProfile.age && (
//                 <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
//                   🎂 {displayProfile.age} years
//                 </span>
//               )}
              
//               {displayProfile.gender && (
//                 <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
//                   {displayProfile.gender}
//                 </span>
//               )}
              
//               {displayProfile.marital_status && (
//                 <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
//                   {displayProfile.marital_status}
//                 </span>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Profile Details */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {/* Personal Information */}
//           <div className="space-y-6">
//             <Section title="Personal Information">
//               <InfoItem label="First Name" value={displayProfile.first_name} />
//               <InfoItem label="Last Name" value={displayProfile.last_name} />
//               <InfoItem label="Email" value={displayProfile.email} />
//               <InfoItem label="Phone" value={displayProfile.phone} />
//               <InfoItem
//                 label="Date of Birth"
//                 value={formatDateForDisplay(displayProfile.dob)}
//               />
//               <InfoItem label="Age" value={displayProfile.age} />
//               <InfoItem label="Gender" value={displayProfile.gender} />
//               <InfoItem
//                 label="Marital Status"
//                 value={displayProfile.marital_status}
//               />
//               <InfoItem label="City" value={displayProfile.city} />
//               <InfoItem label="Country" value={displayProfile.country} />
//               <InfoItem label="Pincode" value={displayProfile.pincode} />
//               <InfoItem label="State" value={displayProfile.state} />
//               <InfoItem label="Address" value={displayProfile.address} full />
//             </Section>
//           </div>

//           {/* Professional Information */}
//           <div className="space-y-6">
//             <Section title="Professional Information">
//               <InfoItem label="Headline" value={displayProfile.headline} />
//               <InfoItem label="Profession" value={displayProfile.profession} />
//               <InfoItem label="Company" value={displayProfile.company} />
//               <InfoItem
//                 label="Experience"
//                 value={
//                   hasValue(displayProfile.experience)
//                     ? `${displayProfile.experience} years`
//                     : ""
//                 }
//               />
//               <InfoItem label="Education" value={displayProfile.education} />
//             </Section>

//             {/* About & Skills */}
//             <Section title="About Me">
//               <InfoItem label="About" value={displayProfile.about} full />
//             </Section>

//             <Section title="Skills & Interests">
//               <InfoItem
//                 label="Skills"
//                 value={
//                   Array.isArray(displayProfile.skills)
//                     ? displayProfile.skills.join(", ")
//                     : typeof displayProfile.skills === 'object'
//                     ? Object.keys(displayProfile.skills || {}).join(", ")
//                     : displayProfile.skills
//                 }
//                 full
//               />
//               <InfoItem
//                 label="Interests"
//                 value={
//                   Array.isArray(displayProfile.interests)
//                     ? displayProfile.interests.join(", ")
//                     : displayProfile.interests
//                 }
//                 full
//               />
//             </Section>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // Section Component
// function Section({ title, children }) {
//   return (
//     <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6">
//       <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">
//         {title}
//       </h3>
//       <div className="space-y-3 md:space-y-4">{children}</div>
//     </div>
//   );
// }

// // Info Item Component
// function InfoItem({ label, value, full = false }) {
//   const hasValue = (val) => {
//     if (val === null || val === undefined || val === "") return false;
//     if (typeof val === "string" && val.trim() !== "") return true;
//     if (typeof val === "number" && !isNaN(val)) return true;
//     if (Array.isArray(val) && val.length > 0) return true;
//     return false;
//   };

//   if (!hasValue(value)) {
//     return (
//       <div className={full ? "col-span-2" : ""}>
//         <p className="text-sm font-medium text-gray-500">{label}</p>
//         <p className="text-gray-400 italic">Not provided</p>
//       </div>
//     );
//   }

//   return (
//     <div className={full ? "col-span-2" : ""}>
//       <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
//       <p className="text-gray-700">
//         {Array.isArray(value) ? value.join(", ") : value}
//       </p>
//     </div>
//   );
// }































































































































// //  working code with member attech code 
// import React, { useEffect, useState } from "react";
// import { useUserProfile } from "../context/UseProfileContext";
// import { useParams, useLocation, useNavigate } from "react-router-dom";
// import { adminAPI } from "../services/adminApi";

// export default function ProfilePage() {
//   const { profile: currentUserProfile } = useUserProfile();
//   const [displayProfile, setDisplayProfile] = useState(null);
//   const { userId } = useParams();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);
//   const [isCurrentUser, setIsCurrentUser] = useState(false);

//   useEffect(() => {
//     console.log("=== PROFILE PAGE DEBUG ===");
//     console.log("URL userId:", userId); // Should be 18
//     console.log("Location State:", location.state);

//     if (location.state?.userProfile) {
//       console.log("✅ Using data from MemberPage");

//       // ✅ Check if this is the correct user
//       const receivedProfile = location.state.userProfile;
//       console.log("Received Profile:", {
//         name: receivedProfile.first_name + " " + receivedProfile.last_name,
//         user_id: receivedProfile.user_id,
//         id: receivedProfile.id,
//         actualUserId: location.state.actualUserId,
//         actualMemberId: location.state.actualMemberId,
//       });

//       setDisplayProfile(receivedProfile);
//       setLoading(false);
//     } else {
//       // ... rest of code
//     }
//   }, [userId, location.state]);

//   // useEffect(() => {
//   //   console.log("🎯 PROFILE PAGE DEBUG START ===");
//   //   console.log("URL Parameter userId:", userId);
//   //   console.log("Location State:", location.state);
//   //   console.log("Current User Profile:", currentUserProfile);

//   //   // Check if this is current user's own profile
//   //   const checkIfCurrentUser = () => {
//   //     if (!currentUserProfile) return false;

//   //     // Check multiple ID fields
//   //     const currentUserId = currentUserProfile.id || currentUserProfile.user_id;
//   //     const targetUserId = userId;

//   //     return currentUserId == targetUserId;
//   //   };

//   //   const isOwnProfile = checkIfCurrentUser();
//   //   setIsCurrentUser(isOwnProfile);
//   //   console.log("Is current user's profile?", isOwnProfile);

//   //   // ✅ PRIORITY 1: Data from MemberPage navigation
//   //   if (location.state?.userProfile) {
//   //     console.log("✅ USING DATA FROM MEMBER PAGE");
//   //     console.log("Member Page Data:", location.state.userProfile);
//   //     setDisplayProfile(location.state.userProfile);
//   //     setLoading(false);
//   //   }
//   //   // ✅ PRIORITY 2: Current user viewing own profile
//   //   else if (isOwnProfile && currentUserProfile) {
//   //     console.log("✅ SHOWING CURRENT USER'S OWN PROFILE");
//   //     setDisplayProfile(currentUserProfile);
//   //     setLoading(false);
//   //   }
//   //   // ✅ PRIORITY 3: Fetch user data from API
//   //   else {
//   //     console.log("🔄 FETCHING USER DATA FROM API");
//   //     fetchUserData(userId);
//   //   }

//   //   console.log("🎯 PROFILE PAGE DEBUG END ===");
//   // }, [userId, location.state, currentUserProfile]);

//   const fetchUserData = async (id) => {
//     try {
//       setLoading(true);
//       console.log("🔍 Calling API for user ID:", id);

//       const response = await adminAPI.getUserDetails(id);
//       console.log("API Response:", response.data);

//       if (response.data) {
//         setDisplayProfile(response.data);
//       } else {
//         console.error("No data in API response");
//         // Create minimal profile object
//         setDisplayProfile({
//           id: id,
//           user_id: id,
//           first_name: "User",
//           last_name: id,
//           name: `User ${id}`,
//           message: "Profile data not available",
//         });
//       }
//     } catch (error) {
//       console.error("API Error:", error);
//       // Fallback profile
//       setDisplayProfile({
//         id: id,
//         user_id: id,
//         name: `User ${id}`,
//         error: "Could not load profile",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-100 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading profile...</p>
//           <p className="text-sm text-gray-500">User ID: {userId}</p>
//         </div>
//       </div>
//     );
//   }

//   if (!displayProfile) {
//     return (
//       <div className="min-h-screen bg-gray-100 flex items-center justify-center">
//         <div className="text-center">
//           <p className="text-gray-500 text-lg mb-4">Profile not found</p>
//           <p className="text-gray-400 text-sm mb-6">User ID: {userId}</p>
//           <button
//             onClick={() => navigate(-1)}
//             className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
//           >
//             Go Back
//           </button>
//         </div>
//       </div>
//     );
//   }

//   console.log("🎯 FINAL DISPLAY PROFILE:", displayProfile);

//   // Determine which profile to display
//   const profileToDisplay = displayProfile;

//   // Format date for display
//   const formatDateForDisplay = (dateString) => {
//     if (!dateString) return "";
//     try {
//       const date = new Date(dateString);
//       return date.toLocaleDateString("en-IN");
//     } catch (error) {
//       return dateString || "";
//     }
//   };

//   // Check if value exists
//   const hasValue = (value) => {
//     if (value === null || value === undefined || value === "") return false;
//     if (typeof value === "number" && !isNaN(value)) return true;
//     if (typeof value === "string" && value.trim() !== "") return true;
//     if (Array.isArray(value) && value.length > 0) return true;
//     return false;
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
//         {/* Header with source indicator */}
//         <div className="flex justify-between items-center mb-6">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-800">
//               {isCurrentUser ? "My Profile" : "User Profile"}
//             </h1>
//             <div className="flex items-center gap-2 mt-1">
//               <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
//                 User ID: {profileToDisplay.user_id || profileToDisplay.id}
//               </span>
//               {location.state?.from === "member_page" && (
//                 <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2 py-1 rounded">
//                   From Member Page
//                 </span>
//               )}
//             </div>
//           </div>

//           {isCurrentUser && (
//             <button
//               onClick={() => navigate("/edit-profile")}
//               className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
//             >
//               Edit Profile
//             </button>
//           )}
//         </div>

//         {/* Profile Header */}
//         <div className="flex flex-col items-center md:flex-row md:items-start gap-6 mb-8 p-6 bg-gray-50 rounded-lg">
//           {profileToDisplay.image_url ||
//           profileToDisplay.profile_picture_url ||
//           profileToDisplay.profilePhoto ? (
//             <img
//               src={
//                 profileToDisplay.image_url ||
//                 profileToDisplay.profile_picture_url ||
//                 profileToDisplay.profilePhoto
//               }
//               alt="Profile"
//               className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
//             />
//           ) : (
//             <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center border-4 border-white shadow-lg">
//               <span className="text-4xl font-bold text-gray-400">
//                 {(
//                   profileToDisplay.first_name?.[0] ||
//                   profileToDisplay.name?.[0] ||
//                   "U"
//                 ).toUpperCase()}
//               </span>
//             </div>
//           )}

//           <div className="text-center md:text-left flex-1">
//             <h1 className="text-3xl font-bold text-gray-800">
//               {hasValue(profileToDisplay.first_name) ||
//               hasValue(profileToDisplay.last_name)
//                 ? `${profileToDisplay.first_name || ""} ${
//                     profileToDisplay.last_name || ""
//                   }`.trim()
//                 : profileToDisplay.name || "User"}
//             </h1>

//             <p className="text-xl text-gray-600 mt-2">
//               {hasValue(profileToDisplay.headline)
//                 ? profileToDisplay.headline
//                 : hasValue(profileToDisplay.profession)
//                 ? profileToDisplay.profession
//                 : "No Profession"}
//             </p>

//             <div className="flex flex-wrap gap-2 mt-3">
//               {profileToDisplay.city && (
//                 <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
//                   📍 {profileToDisplay.city}
//                 </span>
//               )}

//               {profileToDisplay.age && (
//                 <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
//                   🎂 {profileToDisplay.age} years
//                 </span>
//               )}

//               {profileToDisplay.gender && (
//                 <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
//                   {profileToDisplay.gender}
//                 </span>
//               )}

//               {profileToDisplay.marital_status && (
//                 <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
//                   {profileToDisplay.marital_status}
//                 </span>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Profile Details */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {/* Personal Information */}
//           <div className="space-y-6">
//             <Section title="Personal Information">
//               <InfoItem
//                 label="First Name"
//                 value={profileToDisplay.first_name}
//               />
//               <InfoItem label="Last Name" value={profileToDisplay.last_name} />
//               <InfoItem label="Email" value={profileToDisplay.email} />
//               <InfoItem label="Phone" value={profileToDisplay.phone} />
//               <InfoItem
//                 label="Date of Birth"
//                 value={formatDateForDisplay(profileToDisplay.dob)}
//               />
//               <InfoItem label="Age" value={profileToDisplay.age} />
//               <InfoItem label="Gender" value={profileToDisplay.gender} />
//               <InfoItem
//                 label="Marital Status"
//                 value={profileToDisplay.marital_status}
//               />
//               <InfoItem label="City" value={profileToDisplay.city} />
//               <InfoItem label="Country" value={profileToDisplay.country} />
//               <InfoItem label="Pincode" value={profileToDisplay.pincode} />
//               <InfoItem label="State" value={profileToDisplay.state} />
//               <InfoItem label="Address" value={profileToDisplay.address} full />
//             </Section>
//           </div>

//           {/* Professional Information */}
//           <div className="space-y-6">
//             <Section title="Professional Information">
//               <InfoItem label="Headline" value={profileToDisplay.headline} />
//               <InfoItem
//                 label="Profession"
//                 value={profileToDisplay.profession}
//               />
//               <InfoItem label="Company" value={profileToDisplay.company} />
//               <InfoItem
//                 label="Experience"
//                 value={
//                   hasValue(profileToDisplay.experience)
//                     ? `${profileToDisplay.experience} years`
//                     : ""
//                 }
//               />
//               <InfoItem label="Education" value={profileToDisplay.education} />
//             </Section>

//             {/* About & Skills */}
//             <Section title="About Me">
//               <InfoItem label="About" value={profileToDisplay.about} full />
//             </Section>

//             <Section title="Skills & Interests">
//               <InfoItem
//                 label="Skills"
//                 value={
//                   Array.isArray(profileToDisplay.skills)
//                     ? profileToDisplay.skills.join(", ")
//                     : profileToDisplay.skills
//                 }
//                 full
//               />
//               <InfoItem
//                 label="Interests"
//                 value={
//                   Array.isArray(profileToDisplay.interests)
//                     ? profileToDisplay.interests.join(", ")
//                     : profileToDisplay.interests
//                 }
//                 full
//               />
//             </Section>
//           </div>
//         </div>

//         {/* Action Buttons */}
//         <div className="flex justify-center gap-4 mt-8 pt-6 border-t">
//           <button
//             onClick={() => navigate(-1)}
//             className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
//           >
//             Go Back
//           </button>

//           {isCurrentUser && (
//             <button
//               onClick={() => navigate("/edit-profile")}
//               className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
//             >
//               Edit Profile
//             </button>
//           )}

//           <button
//             onClick={() => navigate("/dashboard")}
//             className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition"
//           >
//             Dashboard
//           </button>
//         </div>

//         {/* Debug Info (Optional - remove in production) */}
//         {process.env.NODE_ENV === "development" && (
//           <div className="mt-8 p-4 bg-gray-100 rounded-lg border border-gray-300">
//             <details>
//               <summary className="cursor-pointer text-sm font-medium text-gray-700">
//                 Debug Information
//               </summary>
//               <div className="mt-2 text-xs">
//                 <p>
//                   <strong>Source:</strong>{" "}
//                   {location.state?.from || "Direct Access"}
//                 </p>
//                 <p>
//                   <strong>Profile Source:</strong>{" "}
//                   {isCurrentUser ? "Current User" : "External User"}
//                 </p>
//                 <pre className="mt-2 p-2 bg-gray-800 text-gray-100 rounded overflow-auto max-h-60">
//                   {JSON.stringify(profileToDisplay, null, 2)}
//                 </pre>
//               </div>
//             </details>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// // Section Component
// function Section({ title, children }) {
//   return (
//     <div className="bg-white border border-gray-200 rounded-lg p-6">
//       <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">
//         {title}
//       </h3>
//       <div className="space-y-4">{children}</div>
//     </div>
//   );
// }

// // Info Item Component
// function InfoItem({ label, value, full = false }) {
//   const hasValue = (val) => {
//     if (val === null || val === undefined || val === "") return false;
//     if (typeof val === "number" && !isNaN(val)) return true;
//     if (typeof val === "string" && val.trim() !== "") return true;
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



















































// working code with no profile view bt member page 


// import React, { useEffect, useState } from "react";
// import { useUserProfile } from "../context/UseProfileContext";
// import { useParams, useLocation, useNavigate } from "react-router-dom";
// import { adminAPI } from "../services/adminApi";

// export default function ProfilePage() {
//   const { profile } = useUserProfile();
//     const [userProfile, setUserProfile] = useState(null);
//      const [userData, setUserData] = useState(null);
//     const { userId } = useParams();
//   const location = useLocation();
//     const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     console.log("=== PROFILE PAGE DEBUG ===");
//     console.log("URL userId:", userId);
//     console.log("Location state received:", location.state);
//     console.log("Location state userProfile:", location.state?.userProfile);

//     if (location.state?.userProfile) {
//       console.log("✅ Data received from MemberPage!");
//       setUserData(location.state.userProfile);
//       setLoading(false);
//     } else {
//       console.log("❌ No data from MemberPage");

//       // Fetch data from API using userId
//       fetchUserData(userId);
//     }
//   }, [userId, location.state]);

//   const fetchUserData = async (id) => {
//     try {
//       setLoading(true);
//       // API call to fetch user details
//       const response = await adminAPI.getUserDetails(id);
//       setUserData(response.data);
//     } catch (error) {
//       console.error("Error fetching user data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

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
//       return date.toLocaleDateString("en-IN");
//     } catch (error) {
//       return dateString || "";
//     }
//   };

//   // Check if value exists
//   const hasValue = (value) => {
//     if (value === null || value === undefined || value === "") return false;
//     if (typeof value === "number" && !isNaN(value)) return true;
//     if (typeof value === "string" && value.trim() !== "") return true;
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
//           {profile.image_url ||
//           profile.profile_picture_url ||
//           profile.profilePhoto ? (
//             <img
//               src={
//                 profile.image_url ||
//                 profile.profile_picture_url ||
//                 profile.profilePhoto
//               }
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
//                 ? `${profile.first_name || ""} ${
//                     profile.last_name || ""
//                   }`.trim()
//                 : "No Name"}
//             </h1>
//             <p className="text-xl text-gray-600 mt-2">
//               {hasValue(profile.headline)
//                 ? profile.headline
//                 : hasValue(profile.profession)
//                 ? profile.profession
//                 : "No Profession"}
//             </p>
//             <p className="text-gray-500 mt-1">
//               {hasValue(profile.city) ? profile.city : "No Location"} •
//               {hasValue(profile.age)
//                 ? ` ${profile.age} years`
//                 : " Age not specified"}
//             </p>
//             <p className="text-gray-500">
//               {hasValue(profile.gender)
//                 ? profile.gender
//                 : "Gender not specified"}{" "}
//               •
//               {hasValue(profile.marital_status)
//                 ? profile.marital_status
//                 : "Marital status not specified"}
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
//               <InfoItem
//                 label="Date of Birth"
//                 value={formatDateForDisplay(profile.dob)}
//               />
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
//               <InfoItem
//                 label="Experience"
//                 value={
//                   hasValue(profile.experience)
//                     ? `${profile.experience} years`
//                     : ""
//                 }
//               />
//               <InfoItem label="Education" value={profile.education} />
//             </Section>

//             {/* About & Skills */}
//             <Section title="About Me">
//               <InfoItem label="About" value={profile.about} full />
//             </Section>

//             <Section title="Skills & Interests">
//               <InfoItem
//                 label="Skills"
//                 value={
//                   Array.isArray(profile.skills)
//                     ? profile.skills.join(", ")
//                     : profile.skills
//                 }
//                 full
//               />
//               <InfoItem
//                 label="Interests"
//                 value={
//                   Array.isArray(profile.interests)
//                     ? profile.interests.join(", ")
//                     : profile.interests
//                 }
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
//       <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">
//         {title}
//       </h3>
//       <div className="space-y-4">{children}</div>
//     </div>
//   );
// }

// // Info Item Component
// function InfoItem({ label, value, full = false }) {
//   const hasValue = (val) => {
//     if (val === null || val === undefined || val === "") return false;
//     if (typeof val === "number" && !isNaN(val)) return true;
//     if (typeof val === "string" && val.trim() !== "") return true;
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
