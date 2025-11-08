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

//         {/* Profile Header with Photo */}
//         <div className="flex flex-col items-center md:flex-row md:items-start gap-6 mb-8 p-6 bg-gray-50 rounded-lg">
//           {profile.profile_picture_url || profile.profilePhoto ? (
//             <img
//               src={profile.profile_picture_url || profile.profilePhoto}
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
//               {profile.full_name || profile.fullName || "No Name"}
//             </h1>
//             <p className="text-xl text-gray-600 mt-2">
//               {profile.profession || profile.headline || "No Profession"}
//             </p>
//             <p className="text-gray-500 mt-1">
//               {profile.city || "No Location"} • {profile.age || "N/A"} years
//             </p>
//             <p className="text-gray-500">
//               {profile.gender || "Gender not specified"} • {profile.marital_status || "Marital status not specified"}
//             </p>
//           </div>
//         </div>

//         {/* Profile Details Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {/* Personal Information */}
//           <div className="space-y-6">
//             <Section title="Personal Information">
//               <InfoItem label="Full Name" value={profile.full_name || profile.fullName} />
//               <InfoItem label="Email" value={profile.email} />
//               <InfoItem label="Phone" value={profile.phone} />
//               <InfoItem label="Date of Birth" value={profile.date_of_birth} />
//               <InfoItem label="Age" value={profile.age} />
//               <InfoItem label="Gender" value={profile.gender} />
//               <InfoItem label="Marital Status" value={profile.marital_status} />
//               <InfoItem label="City" value={profile.city} />
//             </Section>
//           </div>

//           {/* Professional Information */}
//           <div className="space-y-6">
//             <Section title="Professional Information">
//               <InfoItem label="Profession" value={profile.profession} />
//               <InfoItem label="Company" value={profile.company} />
//               <InfoItem label="Experience" value={profile.experience ? `${profile.experience} years` : ""} />
//               <InfoItem label="Education" value={profile.education} />
//             </Section>

//             {/* About & Skills */}
//             <Section title="About Me">
//               <InfoItem label="About" value={profile.about} full />
//             </Section>

//             <Section title="Skills & Interests">
//               <InfoItem label="Skills" value={profile.skills} full />
//               <InfoItem label="Interests" value={profile.interests} full />
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
//   if (!value) {
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
//       <p className="text-gray-700">{value}</p>
//     </div>
//   );
// }














// // // src/components/profile/UserProfile.jsx
// // import React from "react";
// // import { useNavigate } from "react-router-dom";
// // import { useUserProfile } from "../context/UseProfileContext";

// // export default function UserProfile() {
// //   const { profile } = useUserProfile();
// //   const navigate = useNavigate();

// //   return (
// //     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
// //       <div className="max-w-4xl mx-auto px-4">
// //         {/* Header */}
// //         <div className="flex justify-between items-center mb-8">
// //           <button
// //             onClick={() => navigate("/dashboard")}
// //             className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition"
// //           >
// //             <span>←</span>
// //             Back to Dashboard
// //           </button>
// //           <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
// //           <button
// //             onClick={() => navigate("/edit-profile")}
// //             className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition font-medium shadow-lg"
// //           >
// //             Edit Profile
// //           </button>
// //         </div>

// //         {/* Profile Card */}
// //         <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
// //           {/* Profile Header */}
// //           <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-8 text-white">
// //             <div className="flex flex-col md:flex-row items-center gap-6">
// //               {profile.profile_picture_url || profile.profilePhoto ? (
// //                 <img
// //                   src={profile.profile_picture_url || profile.profilePhoto}
// //                   alt="Profile"
// //                   className="w-32 h-32 rounded-2xl object-cover border-4 border-white shadow-lg"
// //                 />
// //               ) : (
// //                 <div className="w-32 h-32 rounded-2xl bg-white bg-opacity-20 flex items-center justify-center text-white text-4xl font-bold border-4 border-white">
// //                   {profile.full_name?.charAt(0) || 'U'}
// //                 </div>
// //               )}
// //               <div className="text-center md:text-left">
// //                 <h1 className="text-4xl font-bold mb-2">{profile.full_name || "—"}</h1>
// //                 <p className="text-xl opacity-90 mb-2">{profile.profession || "—"}</p>
// //                 <p className="opacity-80 flex items-center justify-center md:justify-start gap-2">
// //                   📍 {profile.city || "—"}, {profile.country || "—"} • {profile.age || "—"} years
// //                 </p>
// //                 <div className="flex gap-2 mt-4 justify-center md:justify-start">
// //                   <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm">Active</span>
// //                   <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm">Verified</span>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>

// //           {/* Profile Details */}
// //           <div className="p-8">
// //             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
// //               {/* Personal Information */}
// //               <div className="space-y-6">
// //                 <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">Personal Information</h2>
// //                 <InfoRow label="Full Name" value={profile.full_name} />
// //                 <InfoRow label="Age" value={profile.age} />
// //                 <InfoRow label="Gender" value={profile.gender} />
// //                 <InfoRow label="Date of Birth" value={profile.date_of_birth} />
// //                 <InfoRow label="Marital Status" value={profile.marital_status} />
// //                 <InfoRow label="Religion" value={profile.religion} />
// //                 <InfoRow label="Community" value={profile.community} />
// //               </div>

// //               {/* Professional & Location */}
// //               <div className="space-y-6">
// //                 <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">Professional & Location</h2>
// //                 <InfoRow label="Profession" value={profile.profession} />
// //                 <InfoRow label="Education" value={profile.education} />
// //                 <InfoRow label="Income" value={profile.income} />
// //                 <InfoRow label="Country" value={profile.country} />
// //                 <InfoRow label="State" value={profile.state} />
// //                 <InfoRow label="City" value={profile.city} />
// //                 <InfoRow label="Pincode" value={profile.pincode} />
// //               </div>
// //             </div>

// //             {/* About Me */}
// //             {profile.about_me && (
// //               <div className="mt-8">
// //                 <h2 className="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">About Me</h2>
// //                 <p className="text-gray-700 leading-relaxed">{profile.about_me}</p>
// //               </div>
// //             )}

// //             {/* Partner Preferences */}
// //             {profile.partner_preferences && (
// //               <div className="mt-8">
// //                 <h2 className="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">Partner Preferences</h2>
// //                 <p className="text-gray-700 leading-relaxed">{profile.partner_preferences}</p>
// //               </div>
// //             )}
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // function InfoRow({ label, value }) {
// //   return (
// //     <div className="flex justify-between items-center py-3 border-b border-gray-100">
// //       <span className="text-gray-600 font-medium">{label}:</span>
// //       <span className="text-gray-800">{value || "Not specified"}</span>
// //     </div>
// //   );
// // }