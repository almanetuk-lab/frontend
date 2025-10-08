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

      <button
        onClick={() => navigate("/profile/edit")}
        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded"
      >
        Edit Profile
      </button>
    </div>
  );
}




