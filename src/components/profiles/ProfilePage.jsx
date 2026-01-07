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
  const [activeTab, setActiveTab] = useState(0); // 0 for Basic Info, 1 for Lifestyle & Work

  useEffect(() => {
    if (!currentUserProfile) return;

    const myId = currentUserProfile?.id || currentUserProfile?.user_id;
    const viewedId = userId;

    const isOwnProfile = !viewedId || myId == viewedId;
    setIsCurrentUser(isOwnProfile);

    if (!isOwnProfile && viewedId && !hasTrackedRef.current) {
      hasTrackedRef.current = true;
      (async () => {
        try {
          await profileViewApi.trackProfileView(viewedId);
        } catch (err) {
          console.error("❌ Profile view tracking failed:", err);
        }
      })();
    }

    // Data loading logic
    if (location.state?.userProfile) {
      setDisplayProfile(location.state.userProfile);
      setLoading(false);
      return;
    }

    if (!viewedId) {
      if (currentUserProfile) {
        setDisplayProfile(currentUserProfile);
        setLoading(false);
      } else {
        fetchCurrentUserData();
      }
      return;
    }

    fetchUserData(viewedId);
  }, [userId, location.state, currentUserProfile]);

  const fetchCurrentUserData = async () => {
    try {
      setLoading(true);
      const currentUserId =
        currentUserProfile?.id || currentUserProfile?.user_id;
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
        error: "Could not load profile",
      });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Helper functions
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch (error) {
      return dateString || "";
    }
  };

  const hasValue = (value) => {
    if (value === null || value === undefined) return false;
    if (typeof value === "string" && value.trim() === "") return false;
    if (typeof value === "number" && isNaN(value)) return false;
    if (Array.isArray(value) && value.length === 0) return false;
    return true;
  };

  const getDisplayValue = (value) => {
    if (!hasValue(value)) return null;
    if (Array.isArray(value)) return value.join(", ");
    if (typeof value === "object") return JSON.stringify(value);
    return value;
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

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {isCurrentUser ? "My Profile" : "User Profile"}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              {isCurrentUser && (
                <span className="bg-green-100 text-green-800 text-xs font-medium px-0 py-0 rounded"></span>
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
              {getDisplayValue(displayProfile.first_name) ||
              getDisplayValue(displayProfile.last_name)
                ? `${displayProfile.first_name || ""} ${
                    displayProfile.last_name || ""
                  }`.trim()
                : displayProfile.name || "User"}
            </h1>

            <p className="text-lg md:text-xl text-gray-600 mt-2">
              {displayProfile.headline ||
                displayProfile.profession ||
                "No Profession"}
            </p>

            <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
              {displayProfile.city && (
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                  📍 {displayProfile.city}
                </span>
              )}

              {displayProfile.age && (
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                  {displayProfile.age} Age
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

        {/* ✅ SIMPLE TABS - NO SWIPER */}
        <div className="mb-6">
          <div className="flex border-b border-gray-200">
            <button
              className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                activeTab === 0
                  ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab(0)}
            >
              <span className="flex items-center justify-center gap-2">
                <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm">
                  1
                </span>
                Basic Information
              </span>
            </button>
            <button
              className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                activeTab === 1
                  ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab(1)}
            >
              <span className="flex items-center justify-center gap-2">
                <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm">
                  2
                </span>
                Lifestyle & Work
              </span>
            </button>
          </div>
        </div>

        {/* ✅ TAB CONTENT - PAGE 1: BASIC INFORMATION */}
        {activeTab === 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* LEFT COLUMN - Personal Information */}
            <div className="space-y-6">
              <Section title="Personal Information">
                <InfoItem label="First Name" value={displayProfile.first_name} />
                <InfoItem label="Last Name" value={displayProfile.last_name} />
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
                <InfoItem label="State" value={displayProfile.state} />
                <InfoItem label="Pincode" value={displayProfile.pincode} />
                <InfoItem label="Address" value={displayProfile.address} full />
              </Section>

              {/* Personal Details */}
              <Section title="Personal Details">
                <InfoItem label="Height" value={displayProfile.height} />
                <InfoItem
                  label="Professional Identity"
                  value={displayProfile.professional_identity}
                />
                <InfoItem
                  label="Zodiac Sign"
                  value={displayProfile.zodiac_sign}
                />
                <InfoItem
                  label="Languages Spoken"
                  value={
                    Array.isArray(displayProfile.languages_spoken)
                      ? displayProfile.languages_spoken.join(", ")
                      : displayProfile.languages_spoken
                  }
                />
              </Section>
            </div>

            {/* RIGHT COLUMN - Professional & About */}
            <div className="space-y-6">
              <Section title="Professional Information">
                <InfoItem label="Headline" value={displayProfile.headline} />
                <InfoItem label="Profession" value={displayProfile.profession} />
                <InfoItem label="Company" value={displayProfile.company} />
                <InfoItem label="Position" value={displayProfile.position} />
                <InfoItem
                  label="Company Type"
                  value={displayProfile.company_type}
                />
                <InfoItem
                  label="Experience"
                  value={
                    hasValue(displayProfile.experience)
                      ? `${displayProfile.experience} years`
                      : ""
                  }
                />
                <InfoItem label="Education" value={displayProfile.education} />
                <InfoItem
                  label="Education Institution"
                  value={displayProfile.education_institution_name}
                />
              </Section>

              <Section title="About Me">
                <InfoItem label="About" value={displayProfile.about} full />
                <InfoItem
                  label="Hobbies"
                  value={
                    Array.isArray(displayProfile.hobbies)
                      ? displayProfile.hobbies.join(", ")
                      : displayProfile.hobbies
                  }
                />
              </Section>

              <Section title="Skills & Interests">
                <InfoItem
                  label="Skills"
                  value={
                    Array.isArray(displayProfile.skills)
                      ? displayProfile.skills.join(", ")
                      : typeof displayProfile.skills === "object"
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
        )}

        {/* ✅ TAB CONTENT - PAGE 2: LIFESTYLE & WORK */}
        {activeTab === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* LEFT COLUMN - Lifestyle */}
            <div className="space-y-6">
              <Section title="Lifestyle">
                <InfoItem
                  label="Self Expression"
                  value={displayProfile.self_expression}
                />
                <InfoItem
                  label="Free Time Style"
                  value={displayProfile.freetime_style}
                />
                <InfoItem
                  label="Health Activity Level"
                  value={displayProfile.health_activity_level}
                />
                <InfoItem
                  label="Pets Preference"
                  value={displayProfile.pets_preference}
                />
                <InfoItem
                  label="Religious Belief"
                  value={displayProfile.religious_belief}
                />
                <InfoItem label="Smoking" value={displayProfile.smoking} />
                <InfoItem label="Drinking" value={displayProfile.drinking} />
              </Section>

              <Section title="Relationship Preferences">
                <InfoItem
                  label="Interested In"
                  value={displayProfile.interested_in}
                />
                <InfoItem
                  label="Relationship Goal"
                  value={displayProfile.relationship_goal}
                />
                <InfoItem
                  label="Children Preference"
                  value={displayProfile.children_preference}
                />
              </Section>

              {/* JSON Fields */}
              {hasValue(displayProfile.life_rhythms) && (
                <Section title="Life Rhythms">
                  <InfoItem
                    label="Life Rhythms"
                    value={JSON.stringify(displayProfile.life_rhythms)}
                    full
                  />
                </Section>
              )}
            </div>

            {/* RIGHT COLUMN - Work & Relationships */}
            <div className="space-y-6">
              <Section title="Work Style">
                <InfoItem
                  label="Work Environment"
                  value={displayProfile.work_environment}
                />
                <InfoItem
                  label="Interaction Style"
                  value={displayProfile.interaction_style}
                />
                <InfoItem
                  label="Work Rhythm"
                  value={displayProfile.work_rhythm}
                />
                <InfoItem
                  label="Career Decision Style"
                  value={displayProfile.career_decision_style}
                />
                <InfoItem
                  label="Work Demand Response"
                  value={displayProfile.work_demand_response}
                />
              </Section>

              <Section title="Relationship Styles">
                <InfoItem
                  label="Love Language"
                  value={
                    Array.isArray(displayProfile.love_language_affection)
                      ? displayProfile.love_language_affection.join(", ")
                      : displayProfile.love_language_affection
                  }
                />
                <InfoItem
                  label="Preference of Closeness"
                  value={displayProfile.preference_of_closeness}
                />
                <InfoItem
                  label="Approach to Physical Closeness"
                  value={displayProfile.approach_to_physical_closeness}
                />
                <InfoItem
                  label="Relationship Values"
                  value={displayProfile.relationship_values}
                />
                <InfoItem
                  label="Values in Others"
                  value={displayProfile.values_in_others}
                />
                <InfoItem
                  label="Relationship Pace"
                  value={displayProfile.relationship_pace}
                />
              </Section>

              {/* JSON Fields */}
              {hasValue(displayProfile.ways_i_spend_time) && (
                <Section title="Time Spending Style">
                  <InfoItem
                    label="Ways I Spend Time"
                    value={JSON.stringify(displayProfile.ways_i_spend_time)}
                    full
                  />
                </Section>
              )}
            </div>
          </div>
        )}

        {/* ✅ SIMPLE NAVIGATION BUTTONS */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t">
          <button
            className={`px-6 py-2 rounded-lg transition flex items-center gap-2 ${
              activeTab === 0
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-gray-500 text-white hover:bg-gray-600"
            }`}
            onClick={() => setActiveTab(0)}
            disabled={activeTab === 0}
          >
            ← Previous
          </button>

          <div className="flex gap-4">
            <button
              className={`px-4 py-2 rounded-lg text-sm ${
                activeTab === 0
                  ? "bg-indigo-100 text-indigo-600"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
              onClick={() => setActiveTab(0)}
            >
              Page 1
            </button>
            <button
              className={`px-4 py-2 rounded-lg text-sm ${
                activeTab === 1
                  ? "bg-indigo-100 text-indigo-600"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
              onClick={() => setActiveTab(1)}
            >
              Page 2
            </button>
          </div>

          <button
            className={`px-6 py-2 rounded-lg transition flex items-center gap-2 ${
              activeTab === 1
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
            onClick={() => setActiveTab(1)}
            disabled={activeTab === 1}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}

// ✅ InfoItem Component
function InfoItem({ label, value, full = false, type = "text" }) {
  const hasValue = (val) => {
    if (val === null || val === undefined) return false;
    if (typeof val === "string" && val.trim() === "") return false;
    if (typeof val === "number" && isNaN(val)) return false;
    if (Array.isArray(val) && val.length === 0) return false;
    if (typeof val === "object" && Object.keys(val).length === 0) return false;
    return true;
  };

  const displayValue = hasValue(value) ? value : null;

  if (!displayValue) {
    return (
      <div className={full ? "col-span-2" : ""}>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-gray-400 italic text-sm">Not provided</p>
      </div>
    );
  }

  return (
    <div className={full ? "col-span-2" : ""}>
      <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
      {type === "email" ? (
        <a
          href={`mailto:${displayValue}`}
          className="text-blue-600 hover:text-blue-800 hover:underline text-sm"
        >
          {displayValue}
        </a>
      ) : (
        <p className="text-gray-700 text-sm">
          {Array.isArray(displayValue) ? displayValue.join(", ") : displayValue}
        </p>
      )}
    </div>
  );
}

// ✅ Section Component
function Section({ title, children }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">
        {title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
    </div>
  );
}



















// import React, { useEffect, useRef, useState } from "react";
// import { useUserProfile } from "../context/UseProfileContext";
// import { useParams, useLocation, useNavigate } from "react-router-dom";
// import { adminAPI } from "../services/adminApi";
// import profileViewApi from "../services/profileViewApi";
// export default function ProfilePage() {
//   const { profile: currentUserProfile } = useUserProfile();
//   const [displayProfile, setDisplayProfile] = useState(null);
//   const { userId } = useParams();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);
//   const [isCurrentUser, setIsCurrentUser] = useState(false);
//   const hasTrackedRef = useRef(false);

//   useEffect(() => {
//     if (!currentUserProfile) return;

//     const myId = currentUserProfile?.id || currentUserProfile?.user_id;
//     const viewedId = userId; 

//     // ---------- SELF PROFILE CHECK ----------
//     const isOwnProfile = !viewedId || myId == viewedId;
//     setIsCurrentUser(isOwnProfile);

//     // ---------- TRACK PROFILE VIEW (ONLY ONCE) ----------
//     if (!isOwnProfile && viewedId && !hasTrackedRef.current) {
//       hasTrackedRef.current = true; // 🔒 LOCK

//       (async () => {
//         try {
//           console.log("🚀 Tracking profile view:", viewedId);
//           await profileViewApi.trackProfileView(viewedId);
//           console.log("✅ Profile view tracked");
//         } catch (err) {
//           console.error("❌ Profile view tracking failed:", err);
//         }
//       })();
//     }

//     // ---------- DATA LOADING LOGIC (UNCHANGED) ----------

//     // CASE 1: Data already passed via state (Member / Matches / Profile list)
//     if (location.state?.userProfile) {
//       setDisplayProfile(location.state.userProfile);
//       setLoading(false);
//       return;
//     }

//     // CASE 2: Own profile
//     if (!viewedId) {
//       if (currentUserProfile) {
//         setDisplayProfile(currentUserProfile);
//         setLoading(false);
//       } else {
//         fetchCurrentUserData();
//       }
//       return;
//     }

//     // CASE 3: Other user (direct URL)
//     fetchUserData(viewedId);
//   }, [userId, location.state, currentUserProfile]);

//   const fetchCurrentUserData = async () => {
//     try {
//       setLoading(true);
//       // Fetch current user data from API
//       const currentUserId =
//         currentUserProfile?.id || currentUserProfile?.user_id;
//       if (currentUserId) {
//         const response = await adminAPI.getUserDetails(currentUserId);
//         if (response.data) {
//           setDisplayProfile(response.data);
//         } else {
//           setDisplayProfile(currentUserProfile);
//         }
//       } else {
//         setDisplayProfile(currentUserProfile);
//       }
//     } catch (error) {
//       console.error("Error fetching current user:", error);
//       setDisplayProfile(currentUserProfile);
//     } finally {
//       setLoading(false);
//     }
//   };

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
//       setDisplayProfile({
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

//   console.log("Display Profile Email:", displayProfile?.email);

//   // ✅ FIXED: Format date
//   const formatDateForDisplay = (dateString) => {
//     if (!dateString) return "";
//     try {
//       const date = new Date(dateString);
//       return date.toLocaleDateString("en-IN", {
//         day: "numeric",
//         month: "long",
//         year: "numeric",
//       });
//     } catch (error) {
//       return dateString || "";
//     }
//   };

//   // ✅ FIXED: Check if value exists
//   const hasValue = (value) => {
//     if (value === null || value === undefined) return false;
//     if (typeof value === "string" && value.trim() === "") return false;
//     if (typeof value === "number" && isNaN(value)) return false;
//     if (Array.isArray(value) && value.length === 0) return false;
//     return true;
//   };

//   // ✅ FIXED: Get display value
//   const getDisplayValue = (value) => {
//     if (!hasValue(value)) return null;

//     if (Array.isArray(value)) {
//       return value.join(", ");
//     }

//     if (typeof value === "object") {
//       return JSON.stringify(value);
//     }

//     return value;
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
//               <span className="bg-blue-100 text-blue-800 text-xs font-medium px-0 py-0 rounded">
//                 {/* User ID: {displayProfile.user_id || displayProfile.id || "N/A"} */}
//               </span>
//               {location.state?.from === "member_page" && (
//                 <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2 py-1 rounded">
//                   From Member Page
//                 </span>
//               )}
//               {isCurrentUser && (
//                 <span className="bg-green-100 text-green-800 text-xs font-medium px-0 py-0 rounded"></span>
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
//               {getDisplayValue(displayProfile.first_name) ||
//               getDisplayValue(displayProfile.last_name)
//                 ? `${displayProfile.first_name || ""} ${
//                     displayProfile.last_name || ""
//                   }`.trim()
//                 : displayProfile.name || "User"}
//             </h1>

//             <p className="text-lg md:text-xl text-gray-600 mt-2">
//               {displayProfile.headline ||
//                 displayProfile.profession ||
//                 "No Profession"}
//             </p>

//             <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
//               {displayProfile.city && (
//                 <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
//                   📍 {displayProfile.city}
//                 </span>
//               )}
  
//               {displayProfile.age && (
//                 <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
//                    {displayProfile.age} Age
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

//               {/* ✅ FIXED: Email Field */}
//               <InfoItem
//                 label="Email"
//                 value={displayProfile.email}
//                 type="email"
//               />

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
//                 {/* Position */}
//   <InfoItem 
//     label="Position" 
//     value={displayProfile.position} 
//   />
//    {/* Company Type */}
//   <InfoItem 
//     label="Company Type" 
//     value={displayProfile.company_type} 
//   />
 
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
//                {/* Hobbies */}
//   <InfoItem 
//     label="Hobbies" 
//     value={
//       Array.isArray(displayProfile.hobbies) 
//         ? displayProfile.hobbies.join(", ")
//         : displayProfile.hobbies
//     } 
//   />
//             </Section>
            

//             <Section title="Skills & Interests">
//               <InfoItem
//                 label="Skills"
//                 value={
//                   Array.isArray(displayProfile.skills)
//                     ? displayProfile.skills.join(", ")
//                     : typeof displayProfile.skills === "object"
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

// // ✅ FIXED: InfoItem Component with email support
// function InfoItem({ label, value, full = false, type = "text" }) {
//   const hasValue = (val) => {
//     if (val === null || val === undefined) return false;
//     if (typeof val === "string" && val.trim() === "") return false;
//     if (typeof val === "number" && isNaN(val)) return false;
//     if (Array.isArray(val) && val.length === 0) return false;
//     return true;
//   };

//   const displayValue = hasValue(value) ? value : null;

//   if (!displayValue) {
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
//       {type === "email" ? (
//         <a
//           href={`mailto:${displayValue}`}
//           className="text-blue-600 hover:text-blue-800 hover:underline"
//         >
//           {displayValue}
//         </a>
//       ) : (
//         <p className="text-gray-700">
//           {Array.isArray(displayValue) ? displayValue.join(", ") : displayValue}
//         </p>
//       )}
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














































