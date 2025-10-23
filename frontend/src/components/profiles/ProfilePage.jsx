import React from "react";
import { useNavigate } from "react-router-dom";
import { useUserProfile } from "../context/UseProfileContext";

export default function ProfilePage() {
  const { profile } = useUserProfile();
  const navigate = useNavigate();

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg mb-4">No profile data found</p>
          <button
            onClick={() => navigate("/edit-profile")}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Create Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
          <button
            onClick={() => navigate("/edit-profile")}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Edit Profile
          </button>
        </div>

        {/* Profile Header with Photo */}
        <div className="flex flex-col items-center md:flex-row md:items-start gap-6 mb-8 p-6 bg-gray-50 rounded-lg">
          {profile.profile_picture_url || profile.profilePhoto ? (
            <img
              src={profile.profile_picture_url || profile.profilePhoto}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center border-4 border-white shadow-lg text-gray-400">
              No Photo
            </div>
          )}
          <div className="text-center md:text-left flex-1">
            <h1 className="text-3xl font-bold text-gray-800">
              {profile.full_name || profile.fullName || "No Name"}
            </h1>
            <p className="text-xl text-gray-600 mt-2">
              {profile.profession || profile.headline || "No Profession"}
            </p>
            <p className="text-gray-500 mt-1">
              {profile.city || "No Location"} • {profile.age || "N/A"} years
            </p>
            <p className="text-gray-500">
              {profile.gender || "Gender not specified"} • {profile.marital_status || "Marital status not specified"}
            </p>
          </div>
        </div>

        {/* Profile Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="space-y-6">
            <Section title="Personal Information">
              <InfoItem label="Full Name" value={profile.full_name || profile.fullName} />
              <InfoItem label="Email" value={profile.email} />
              <InfoItem label="Phone" value={profile.phone} />
              <InfoItem label="Date of Birth" value={profile.date_of_birth} />
              <InfoItem label="Age" value={profile.age} />
              <InfoItem label="Gender" value={profile.gender} />
              <InfoItem label="Marital Status" value={profile.marital_status} />
              <InfoItem label="City" value={profile.city} />
            </Section>
          </div>

          {/* Professional Information */}
          <div className="space-y-6">
            <Section title="Professional Information">
              <InfoItem label="Profession" value={profile.profession} />
              <InfoItem label="Company" value={profile.company} />
              <InfoItem label="Experience" value={profile.experience ? `${profile.experience} years` : ""} />
              <InfoItem label="Education" value={profile.education} />
            </Section>

            {/* About & Skills */}
            <Section title="About Me">
              <InfoItem label="About" value={profile.about} full />
            </Section>

            <Section title="Skills & Interests">
              <InfoItem label="Skills" value={profile.skills} full />
              <InfoItem label="Interests" value={profile.interests} full />
            </Section>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-8 pt-6 border-t">
          <button
            onClick={() => navigate("/dashboard")}
            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
          >
            Back to Dashboard
          </button>
          <button
            onClick={() => navigate("/edit-profile")}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
}

// Section Component
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

// Info Item Component
function InfoItem({ label, value, full = false }) {
  if (!value) {
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
      <p className="text-gray-700">{value}</p>
    </div>
  );
}