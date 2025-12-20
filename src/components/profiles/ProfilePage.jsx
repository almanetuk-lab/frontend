import React, { useEffect, useRef, useState } from "react";
import { useUserProfile } from "../context/UseProfileContext";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { adminAPI } from "../services/adminApi";
import profileViewApi from "../services/profileViewApi";





export default function ProfilePage() {
  const { profile: currentUserProfile } = useUserProfile();
  const [displayProfile, setDisplayProfile] = useState(null);
  const { userId } = useParams(); 
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const hasTrackedRef = useRef(false);

  useEffect(() => {
  if (!currentUserProfile) return;

  const myId = currentUserProfile?.id || currentUserProfile?.user_id;
  const viewedId = userId; // URL se aa raha hai

  // ---------- SELF PROFILE CHECK ----------
  const isOwnProfile = !viewedId || myId == viewedId;
  setIsCurrentUser(isOwnProfile);

  // ---------- TRACK PROFILE VIEW (ONLY ONCE) ----------
  if (
    !isOwnProfile &&
    viewedId &&
    !hasTrackedRef.current
  ) {
    hasTrackedRef.current = true; // 🔒 LOCK

    (async () => {
      try {
        console.log("🚀 Tracking profile view:", viewedId);
        await profileViewApi.trackProfileView(viewedId);
        console.log("✅ Profile view tracked");
      } catch (err) {
        console.error("❌ Profile view tracking failed:", err);
      }
    })();
  }

  // ---------- DATA LOADING LOGIC (UNCHANGED) ----------

  // CASE 1: Data already passed via state (Member / Matches / Profile list)
  if (location.state?.userProfile) {
    setDisplayProfile(location.state.userProfile);
    setLoading(false);
    return;
  }

  // CASE 2: Own profile
  if (!viewedId) {
    if (currentUserProfile) {
      setDisplayProfile(currentUserProfile);
      setLoading(false);
    } else {
      fetchCurrentUserData();
    }
    return;
  }

  // CASE 3: Other user (direct URL)
  fetchUserData(viewedId);

}, [userId, location.state, currentUserProfile]);

  
// useEffect(() => {
//   console.log("=== PROFILE PAGE DEBUG ===");
  
//   const checkCurrentUser = () => {
//     if (!userId) return true;
//     const myId = currentUserProfile?.id || currentUserProfile?.user_id;
//     // loose equality (==) use karein kyunki ek string ho sakta hai aur ek number
//     return myId == userId;
//   };
  
//   const isOwnProfile = checkCurrentUser();
//   setIsCurrentUser(isOwnProfile);

//   // --- TRACKING LOGIC ---
//   // Agar ye meri profile nahi hai, toh view record karo
//   if (!isOwnProfile && userId) {
//     const trackView = async () => {
//       try {
//         console.log("🚀 Recording NEW view for User:", userId);
//         const res = await recentApi.trackProfileView(userId);
//         console.log("✅ Tracking Response:", res); // Check karein message "Data inserted" aa raha hai?
//       } catch (err) {
//         console.error("❌ Tracking failed:", err);
//       }
//     };
//     trackView();
//   }
//   // ----------------------

//   // Case 1: State se data load karna
//   if (location.state?.userProfile) {
//     setDisplayProfile(location.state.userProfile);
//     setLoading(false);
//     return;
//   }
  
//   // Case 2: Apni profile (No ID in URL)
//   if (!userId) {
//     if (currentUserProfile) {
//       setDisplayProfile(currentUserProfile);
//       setLoading(false);
//     } else {
//       fetchCurrentUserData();
//     }
//     return;
//   }

//   // Case 3: Other user (Fetch from API)
//   fetchUserData(userId);
  
// }, [userId, location.state, currentUserProfile]);


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





























































































































