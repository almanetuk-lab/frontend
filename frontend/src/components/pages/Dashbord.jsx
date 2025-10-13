

import React from "react";
import { useNavigate } from "react-router-dom";
import { useUserProfile } from "../context/UseProfileContext";

export default function Dashboard() {
  const { profile } = useUserProfile();
  const navigate = useNavigate();

  if (!profile) return <p>Loading profile...</p>;

  return (
    
    <div className="max-w-2xl mx-auto p-6 mt-6 bg-white shadow rounded-lg">
      <h2 className="text-center p-2 text-bold">Your Profile</h2>
      {profile.profilePhoto && (
        <img src={profile.profilePhoto} alt="Profile" className="w-32 h-32 rounded-full object-cover mb-4" />
      )}

      <h2 className="text-xl font-bold mb-2">{profile.fullName}</h2>
      <p><strong>Email:</strong> {profile.email}</p>
      <p><strong>Profession:</strong> {profile.profession}</p>
      <p><strong>About:</strong> {profile.about}</p>
      <p><strong>Skills:</strong> {profile.skills}</p>
        <p className="text-sm font-semibold text-gray-500">Gender</p>
           <p>{profile.gender || ""}</p>


       <button
        onClick={() => navigate("/profile/edit")}
        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded"
      >
        Edit Profile
      </button>
    </div>
  );
}


















// // src/pages/Dashboard.jsx
// import React, { useEffect, useState } from "react";

// export default function Dashboard() {
//   const [profile, setProfile] = useState({});

//   useEffect(() => {
//     const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
//     setProfile(savedUser);
//   }, []);

//   if (!profile.user_id) {
//     return <div className="p-6 text-center">No profile data found.</div>;
//   }

//   return (
//     <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
//       <div className="flex items-center mb-6">
//         {profile.profile_picture_url ? (
//           <img
//             src={profile.profile_picture_url}
//             alt="profile"
//             className="w-32 h-32 rounded-full object-cover border"
//           />
//         ) : (
//           <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center border text-gray-400">
//             No Photo
//           </div>
//         )}
//         <div className="ml-6">
//           <h1 className="text-2xl font-bold">{profile.fullName || "—"}</h1>
//           {profile.headline && <p className="text-gray-600">{profile.headline}</p>}
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//         <div>
//           <p className="text-sm font-semibold text-gray-500">Email</p>
//           <p>{profile.email || "—"}</p>
//         </div>
//         <div>
//           <p className="text-sm font-semibold text-gray-500">Phone</p>
//           <p>{profile.phone || "—"}</p>
//         </div>
//         <div>
//           <p className="text-sm font-semibold text-gray-500">Date of Birth</p>
//           <p>{profile.dob || "—"}</p>
//         </div>
//         <div>
//           <p className="text-sm font-semibold text-gray-500">Age</p>
//           <p>{profile.age || "—"}</p>
//         </div>
//         <div>
//           <p className="text-sm font-semibold text-gray-500">Gender</p>
//           <p>{profile.gender || "—"}</p>
//         </div>
//         <div>
//           <p className="text-sm font-semibold text-gray-500">Marital Status</p>
//           <p>{profile.maritalStatus || "—"}</p>
//         </div>
//         <div>
//           <p className="text-sm font-semibold text-gray-500">Address</p>
//           <p>{profile.address || "—"}</p>
//         </div>
//         <div>
//           <p className="text-sm font-semibold text-gray-500">City</p>
//           <p>{profile.city || "—"}</p>
//         </div>
//         <div>
//           <p className="text-sm font-semibold text-gray-500">Education</p>
//           <p>{profile.education || "—"}</p>
//         </div>
//         <div>
//           <p className="text-sm font-semibold text-gray-500">Profession</p>
//           <p>{profile.profession || "—"}</p>
//         </div>
//         <div>
//           <p className="text-sm font-semibold text-gray-500">Company</p>
//           <p>{profile.company || "—"}</p>
//         </div>
//         <div>
//           <p className="text-sm font-semibold text-gray-500">Experience (yrs)</p>
//           <p>{profile.experience || "—"}</p>
//         </div>
//       </div>

//       <div className="mb-6">
//         <p className="text-sm font-semibold text-gray-500">Skills</p>
//         <p>{profile.skills || "—"}</p>
//       </div>

//       <div className="mb-6">
//         <p className="text-sm font-semibold text-gray-500">About</p>
//         <p>{profile.about || "—"}</p>
//       </div>

//       <div>
//         <p className="text-sm font-semibold text-gray-500">Interests</p>
//         <div className="flex gap-2 flex-wrap mt-1">
//           {profile.interests && profile.interests.length > 0 ? (
//             profile.interests.map((tag) => (
//               <span
//                 key={tag}
//                 className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
//               >
//                 {tag}
//               </span>
//             ))
//           ) : (
//             <span className="text-gray-400">—</span>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }







