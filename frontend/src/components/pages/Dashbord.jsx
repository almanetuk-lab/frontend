import React from "react";
// import { useAuth } from "../context/AuthProvider";
import { useNavigate, Link } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
import { useUserProfile } from "../context/UseProfileContext";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">No user logged in. <Link to="/login" className="text-indigo-600">Login</Link></p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow rounded-lg p-6">
        <div className="flex items-center gap-6">
          {user.profilePhotoUrl ? (
            <img src={user.profilePhotoUrl} alt="profile" className="w-28 h-28 rounded-full object-cover border" />
          ) : (
            <div className="w-28 h-28 rounded-full bg-gray-100 flex items-center justify-center border text-gray-500">No Photo</div>
          )}
          <div>
            <h2 className="text-2xl font-bold">{user.fullName}</h2>
            <p className="text-gray-600">{user.headline || "No headline provided"}</p>
            <p className="text-gray-600">{user.profession || "No profession set"}</p>
            <p className="text-gray-600">{user.city || ""}</p>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">About</h3>
          <p className="text-gray-700">{user.about || "No about info"}</p>
        </div>

        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">Skills</h3>
          <p className="text-gray-700">{user.skills || "No skills added"}</p>
        </div>

        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">Interests</h3>
          {user.interests && user.interests.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {user.interests.map((i) => (
                <span key={i} className="inline-block bg-gray-100 px-3 py-1 rounded-full text-sm">{i}</span>
              ))}
            </div>
          ) : (
            <p className="text-gray-700">No interests added</p>
          )}
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={() => navigate("/edit-profile")}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Edit Profile
          </button>
          <button
            onClick={() => { logout(); navigate("/login"); }}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>
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

//       <button
//         onClick={() => navigate("/profile/edit")}
//         className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded"
//       >
//         Edit Profile
//       </button>
//     </div>
//   );
// }




