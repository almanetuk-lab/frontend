
import React from "react";
import { useNavigate } from "react-router-dom";
import { useUserProfile } from "../context/UseProfileContext";

export default function Dashboard() {
  const { profile } = useUserProfile();
  const navigate = useNavigate();

  if (!profile) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 text-lg">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 mt-8 bg-white rounded-lg shadow-lg space-y-6">
      {/* Profile Header */}
      <div className="flex flex-col items-center md:flex-row md:items-start gap-6">
        {profile.profilePhoto ? (
          <img
            src={profile.profilePhoto}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-2 border-indigo-500"
          />
        ) : (
          <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center border-2 border-gray-300 text-gray-400">
            No Photo
          </div>
        )}
        <div className="text-center md:text-left">
          <h1 className="text-2xl font-bold">{profile.fullName || "—"}</h1>
          <p className="text-gray-600">{profile.profession || "—"}</p>
        </div>
      </div>

      {/* Contact & Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoItem label="Email" value={profile.email} />
        <InfoItem label="Gender" value={profile.gender} />
        <InfoItem label="Marital Status" value={profile.marital_status} />
        <InfoItem label="City" value={profile.city} />
        <InfoItem label="About" value={profile.about} full />
        <InfoItem label="Skills" value={profile.skills} full />
        <InfoItem label="Interests" value={profile.interests?.join(", ")} full />
      </div>

      {/* Edit Profile Button */}
      <div className="flex justify-center">
        <button
          onClick={() => navigate("/profile/edit")}
          className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
}

// Reusable Info Item component
function InfoItem({ label, value, full = false }) {
  if (!value) return null;

  return (
    <div className={full ? "col-span-full" : ""}>
      <p className="text-sm font-semibold text-gray-500">{label}</p>
      <p className="text-gray-700">{value}</p>
    </div>
  );
}









// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { useUserProfile } from "../context/UseProfileContext";

// export default function Dashboard() {
//   const { profile } = useUserProfile();
//   const navigate = useNavigate();

//   if (!profile) return <p>Loading profile...</p>;

//   return (
    
//     <div className="max-w-2xl mx-auto p-6 mt-6 bg-white shadow rounded-lg">
//       <h2 className="text-center p-2 text-bold">Your Profile</h2>
//       {profile.profilePhoto && (
//         <img src={profile.profilePhoto} alt="Profile" className="w-32 h-32 rounded-full object-cover mb-4" />
//       )}

//       <h2 className="text-xl font-bold mb-2">{profile.fullName}</h2>
//       <p><strong>Email:</strong> {profile.email}</p>
//       <p><strong>Profession:</strong> {profile.profession}</p>
//       <p><strong>About:</strong> {profile.about}</p>
//       <p><strong>Skills:</strong> {profile.skills}</p>
//         <p className="text-sm font-semibold text-gray-500">Gender</p>
//            <p>{profile.gender || ""}</p>


//        <button
//         onClick={() => navigate("/profile/edit")}
//         className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded"
//       >
//         Edit Profile
//       </button>
//     </div>
//   );
// }















