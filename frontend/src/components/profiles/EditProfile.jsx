// src/pages/EditProfile.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserProfile } from "../context/UseProfileContext";
import {  updateUserProfile } from "../services/api";
const user = getUserFromStorage();

const INITIAL_FORM_STATE = {
  user_id: user.id || null,
  profilePhotoUrl: user.profile_picture_url || "",
  fullName: user.fullName || user.full_name || "",
  headline: user.headline || "",
  age: user.age || "",
  gender: user.gender || "",
  maritalStatus: user.marital_status || "",
  address: user.address || "",
  city: user.city || "",
  email: user.email || "",
  phone: user.phone || "",
  education: user.education || "",
  profession: user.profession || "",
  company: user.company || "",
  experience: user.experience || "",
  skills: user.skills || "",
  about: user.about || "",
  interests: Array.isArray(user.interests)
    ? user.interests
    : user.interests
    ? user.interests.split(",").map((i) => i.trim())
    : [],
};

export default function EditProfile() {
  const { profile, updateProfile } = useUserProfile();
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [interestInput, setInterestInput] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const navigate = useNavigate();

  const authToken = localStorage.getItem("token");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: "" }));
  };

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) =>
      setFormData((p) => ({ ...p, profilePhotoUrl: ev.target.result }));
    reader.readAsDataURL(file);
  };

  const addInterest = () => {
    const v = interestInput.trim();
    if (!v || formData.interests.includes(v)) return setInterestInput("");
    setFormData((p) => ({ ...p, interests: [...p.interests, v] }));
    setInterestInput("");
  };

  const removeInterest = (tag) => {
    setFormData((p) => ({
      ...p,
      interests: p.interests.filter((t) => t !== tag),
    }));
  };

  const validate = () => {
    const newErr = {};
    if (!formData.fullName) newErr.fullName = "Full name required";
    if (!formData.email) newErr.email = "Email required";
    if (!formData.user_id) newErr.user_id = "User ID missing";
    setErrors(newErr);
    return Object.keys(newErr).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setApiError(null);

    try {
      const dataToUpdate = {
        user_id: formData.user_id,
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        gender: formData.gender,
        marital_status: formData.maritalStatus,
        address: formData.address,
        city: formData.city,
        profession: formData.profession,
        skills: formData.skills,
        interests: Array.isArray(formData.interests)
          ? formData.interests.join(",")
          : formData.interests,
        about: formData.about,
        profile_picture_url: formData.profilePhotoUrl,
        headline: formData.headline,
        age: formData.age,
        education: formData.education,
        company: formData.company,
        experience: formData.experience,
      };

      const updatedProfile = await updateUserProfile(dataToUpdate, authToken);
      updateProfile(updatedProfile);
      localStorage.setItem("user", JSON.stringify(updatedProfile.user || updatedProfile));
      alert("Profile saved successfully!");
      navigate("/dashboard");
    } catch (err) {
      setApiError(err.message || "Failed to save profile.");
      console.error(err);
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded-lg mt-6">
      <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
      <form onSubmit={handleSave} className="space-y-6">
        <div className="flex items-start gap-6">
          <div className="flex-shrink-0">
            {formData.profilePhotoUrl ? (
              <img
                src={formData.profilePhotoUrl}
                alt="profile"
                className="w-28 h-28 rounded-full object-cover border"
              />
            ) : (
              <div className="w-28 h-28 rounded-full bg-gray-100 flex items-center justify-center border text-gray-500">
                No Photo
              </div>
            )}
            <div className="mt-2">
              <input type="file" accept="image/*" onChange={handlePhoto} />
            </div>
          </div>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-600">Full Name</label>
              <input
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={`w-full border p-2 rounded ${
                  errors.fullName ? "border-red-500" : ""
                }`}
                placeholder="Full Name"
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm">{errors.fullName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm text-gray-600">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full border p-2 rounded ${
                  errors.email ? "border-red-500" : ""
                }`}
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm text-gray-600">Profession</label>
              <input
                name="profession"
                value={formData.profession}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600">Phone</label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm text-gray-600">About</label>
              <textarea
                name="about"
                value={formData.about}
                onChange={handleChange}
                rows={3}
                className="w-full border p-2 rounded"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm text-gray-600">
                Skills (comma separated)
              </label>
              <input
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm text-gray-600">Interests</label>
              <div className="flex gap-2 flex-wrap mb-2">
                {formData.interests.map((tag) => (
                  <span
                    key={tag}
                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full flex items-center gap-1"
                  >
                    {tag}{" "}
                    <button
                      type="button"
                      onClick={() => removeInterest(tag)}
                      className="text-red-500 font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  value={interestInput}
                  onChange={(e) => setInterestInput(e.target.value)}
                  className="border p-2 rounded flex-1"
                  placeholder="Add interest"
                />
                <button
                  type="button"
                  onClick={addInterest}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="text-right">
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}
