import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserProfile } from "../context/UseProfileContext";

export default function Dashboard() {
  const { profile, loading } = useUserProfile();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 text-lg">Loading profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 text-lg">No profile data found</p>
        <button 
          onClick={() => navigate("/profile/edit")}
          className="ml-4 px-4 py-2 bg-indigo-600 text-white rounded"
        >
          Create Profile
        </button>
      </div>
    );
  }

  // Safe function to handle interests
  const getInterests = () => {
    if (!profile.interests) return "";
    if (Array.isArray(profile.interests)) {
      return profile.interests.join(", ");
    }
    return profile.interests;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 mt-8 bg-white rounded-lg shadow-lg space-y-6">
      {/* Profile Header */}
      <div className="flex flex-col items-center md:flex-row md:items-start gap-6">
        {profile.profile_picture_url || profile.profilePhoto ? (
          <img
            src={profile.profile_picture_url || profile.profilePhoto}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-2 border-indigo-500"
          />
        ) : (
          <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center border-2 border-gray-300 text-gray-400">
            No Photo
          </div>
        )}
        <div className="text-center md:text-left">
          <h1 className="text-2xl font-bold">{profile.full_name || profile.fullName || "—"}</h1>
          <p className="text-gray-600">{profile.profession || profile.headline || "—"}</p>
          <p className="text-sm text-gray-500 mt-1">{profile.city || "—"}</p>
        </div>
      </div>

      {/* Contact & Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoItem label="Email" value={profile.email} />
        <InfoItem label="Phone" value={profile.phone} />
        <InfoItem label="Gender" value={profile.gender} />
        <InfoItem label="Age" value={profile.age} />
          <InfoItem label="Date of Birth" value={profile.date_of_birth} />
        <InfoItem label="Marital Status" value={profile.marital_status} />
        <InfoItem label="City" value={profile.city} />
        <InfoItem label="Profession" value={profile.profession} />
        <InfoItem label="Company" value={profile.company} />
        <InfoItem label="Experience" value={profile.experience} />
        <InfoItem label="Education" value={profile.education} />
        <InfoItem label="About" value={profile.about} full />
        <InfoItem label="Skills" value={profile.skills} full />
        <InfoItem label="Interests" value={getInterests()} full />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <button
          onClick={() => navigate("/profile/edit")}
          className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
        >
          Edit Profile
        </button>
        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/login";
          }}
          className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Logout
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















































