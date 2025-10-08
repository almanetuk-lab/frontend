
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserProfile } from "../context/UseProfileContext";

const INITIAL = {
  profilePhoto: null,
  fullName: "",
  headline: "",
  age: "",
  dob: "",
  gender: "",
  maritalStatus: "",
  address: "",
  city: "",
  email: "",
  phone: "",
  education: "",
  profession: "",
  company: "",
  experience: "",
  skills: "",
  about: "",
  interests: [],
};

export default function EditProfile() {
  const { profile, updateProfile } = useUserProfile();
  const [formData, setFormData] = useState(INITIAL);
  const [interestInput, setInterestInput] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Populate form from context/profile on mount
  useEffect(() => {
    if (profile) setFormData({ ...INITIAL, ...profile });
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
    setErrors(p => ({ ...p, [name]: "" }));
  };

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setFormData(p => ({ ...p, profilePhoto: ev.target.result }));
    reader.readAsDataURL(file);
  };

  const addInterest = () => {
    const v = interestInput.trim();
    if (!v || formData.interests.includes(v)) return setInterestInput("");
    setFormData(p => ({ ...p, interests: [...p.interests, v] }));
    setInterestInput("");
  };

  const removeInterest = (tag) => {
    setFormData(p => ({ ...p, interests: p.interests.filter(t => t !== tag) }));
  };

  const validate = () => {
    const newErr = {};
    if (!formData.fullName) newErr.fullName = "Full name required";
    if (!formData.email) newErr.email = "Email required";
    setErrors(newErr);
    return Object.keys(newErr).length === 0;
  };

  const handleSave = (e) => {
    e?.preventDefault();
    if (!validate()) return;

    // Update profile in context (shared with Dashboard & UserCreateForm)
    updateProfile(formData);

    // Show feedback
    alert("Profile saved!");

    // Redirect to Dashboard (reflect updated profile)
    navigate("/dashboard");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded-lg mt-6">
      <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="flex items-start gap-6">
          <div className="flex-shrink-0">
            {formData.profilePhoto ? (
              <img src={formData.profilePhoto} alt="profile" className="w-28 h-28 rounded-full object-cover border" />
            ) : (
              <div className="w-28 h-28 rounded-full bg-gray-100 flex items-center justify-center border text-gray-500">No Photo</div>
            )}
            <div className="mt-2">
              <input type="file" accept="image/*" onChange={handlePhoto} />
            </div>
          </div>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-600">Full Name</label>
              <input name="fullName" value={formData.fullName} onChange={handleChange} className={`w-full border p-2 rounded ${errors.fullName ? "border-red-500" : ""}`} placeholder="Full Name"/>
              {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
            </div>

            <div>
              <label className="block text-sm text-gray-600">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className={`w-full border p-2 rounded ${errors.email ? "border-red-500" : ""}`} placeholder="you@example.com"/>
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm text-gray-600">Profession</label>
              <input name="profession" value={formData.profession} onChange={handleChange} className="w-full border p-2 rounded" placeholder="Software Engineer, Doctor..."/>
            </div>

            <div>
              <label className="block text-sm text-gray-600">Phone</label>
              <input name="phone" value={formData.phone} onChange={handleChange} className="w-full border p-2 rounded" placeholder="+91 98765 43210"/>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm text-gray-600">About</label>
              <textarea name="about" value={formData.about} onChange={handleChange} rows={3} className="w-full border p-2 rounded"/>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm text-gray-600">Skills (comma separated)</label>
              <input name="skills" value={formData.skills} onChange={handleChange} className="w-full border p-2 rounded" placeholder="React, Node, SQL..."/>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm text-gray-600">Address</label>
              <input name="address" value={formData.address} onChange={handleChange} className="w-full border p-2 rounded" placeholder="Full address"/>
            </div>

            <div>
              <label className="block text-sm text-gray-600">City</label>
              <input name="city" value={formData.city} onChange={handleChange} className="w-full border p-2 rounded"/>
            </div>

            <div>
              <label className="block text-sm text-gray-600">Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange} className="w-full border p-2 rounded">
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-600">Marital Status</label>
              <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} className="w-full border p-2 rounded">
                <option value="">Select Status</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Divorced">Divorced</option>
                <option value="Widowed">Widowed</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Interests */}
        <div>
          <label className="block text-sm text-gray-600">Interests</label>
          <div className="flex gap-2 mt-2">
            <input value={interestInput} onChange={e => setInterestInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addInterest(); }}} className="flex-1 border p-2 rounded" placeholder="Type interest and Enter"/>
            <button type="button" onClick={addInterest} className="px-3 py-2 bg-indigo-600 text-white rounded">Add</button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {formData.interests.map(t => (
              <span key={t} className="inline-flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm">
                {t} <button onClick={() => removeInterest(t)} className="ml-2 text-red-500 font-bold">×</button>
              </span>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
          <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">Save Profile</button>
        </div>
      </form>
    </div>
  );
}

