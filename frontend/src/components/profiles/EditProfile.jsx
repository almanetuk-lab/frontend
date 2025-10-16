// src/pages/EditProfile.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useUserProfile } from "../context/UseProfileContext";
import { updateUserProfile } from "../services/api";

// Get initial user data from localStorage
const savedUser = JSON.parse(localStorage.getItem("user") || "{}");

const INITIAL_FORM_STATE = {
  user_id: savedUser.id || null,
  profilePhoto: savedUser.profile_picture_url || "",
  fullName: savedUser.fullName || savedUser.full_name || "",
  headline: savedUser.headline || "",
  age: savedUser.age || "",
  gender: savedUser.gender || "",
  maritalStatus: savedUser.marital_status || "",
  address: savedUser.address || "",
  city: savedUser.city || "",
  email: savedUser.email || "",
  phone: savedUser.phone || "",
  education: savedUser.education || "",
  profession: savedUser.profession || "",
  company: savedUser.company || "",
  experience: savedUser.experience || "",
  skills: savedUser.skills || "",
  about: savedUser.about || "",
  interests: Array.isArray(savedUser.interests)
    ? savedUser.interests
    : savedUser.interests
    ? savedUser.interests.split(",").map((i) => i.trim())
    : [],
};

export default function EditProfile() {
  const { updateProfile } = useUserProfile();
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [interestInput, setInterestInput] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const sliderRef = useRef(null);
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  const authToken = localStorage.getItem("accessToken") || "";

  useEffect(() => {
    localStorage.setItem("userProfile", JSON.stringify(formData));
  }, [formData]);

  // swipe handlers
  const onTouchStart = (e) => (touchStartX.current = e.touches[0].clientX);
  const onTouchMove = (e) => (touchEndX.current = e.touches[0].clientX);
  const onTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const dist = touchStartX.current - touchEndX.current;
    const threshold = 50;
    if (dist > threshold) nextStep();
    else if (dist < -threshold) prevStep();
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: "" }));
  };

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setFormData((p) => ({ ...p, profilePhoto: ev.target.result }));
    reader.readAsDataURL(file);
  };

  const addInterest = () => {
    const v = interestInput.trim();
    if (!v || formData.interests.includes(v)) return setInterestInput("");
    setFormData((p) => ({ ...p, interests: [...p.interests, v] }));
    setInterestInput("");
  };

  const removeInterest = (tag) => {
    setFormData((p) => ({ ...p, interests: p.interests.filter((t) => t !== tag) }));
  };

  const validateStep = () => {
    const newErr = {};
    if (step === 1) {
      if (!formData.fullName) newErr.fullName = "Full name required";
      if (!formData.email) newErr.email = "Email required";
      if (!formData.phone) newErr.phone = "Phone required";
      if (!formData.gender) newErr.gender = "Gender required";
      if (!formData.maritalStatus) newErr.maritalStatus = "Marital status required";
    } else if (step === 2) {
      if (!formData.profession) newErr.profession = "Profession required";
      if (!formData.experience) newErr.experience = "Experience required";
    }
    setErrors(newErr);
    return Object.keys(newErr).length === 0;
  };

  const nextStep = () => {
    if (!validateStep()) return;
    setStep((s) => Math.min(s + 1, 3));
    sliderRef.current?.focus();
  };
  const prevStep = () => {
    setStep((s) => Math.max(s - 1, 1));
    sliderRef.current?.focus();
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;

    if (!authToken) {
      alert("User not logged in or token missing!");
      return;
    }

    setLoading(true);
    try {
      const payload = {
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
        interests: formData.interests.join(","),
        about: formData.about,
        profile_picture_url: formData.profilePhoto,
        headline: formData.headline,
        age: formData.age,
        education: formData.education,
        company: formData.company,
        experience: formData.experience,
      };

      const res = await updateUserProfile(payload, authToken);
      const finalProfile = res.user || res;

      updateProfile(finalProfile);
      localStorage.setItem("user", JSON.stringify(finalProfile));

      alert("Profile saved successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Error saving profile: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const PhotoPreview = () =>
    formData.profilePhoto ? (
      <img
        src={formData.profilePhoto}
        alt="profile"
        className="w-28 h-28 rounded-full object-cover border"
      />
    ) : (
      <div className="w-28 h-28 rounded-full bg-gray-100 flex items-center justify-center border">
        <span className="text-sm text-gray-500">No Photo</span>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Edit Profile</h2>
        <div className="text-sm text-gray-600">Step {step} of 3</div>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
        <div
          className="bg-indigo-600 h-2 rounded-full transition-all"
          style={{ width: `${(step / 3) * 100}%` }}
        />
      </div>

      <form onSubmit={handleSave}>
        <div
          ref={sliderRef}
          tabIndex={0}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          className="relative overflow-hidden"
        >
          <div
            className="flex transition-transform duration-300"
            style={{ transform: `translateX(-${(step - 1) * 100}%)` }}
          >
            {/* ------------------- Slide 1 ------------------- */}
            <div className="w-full flex-shrink-0 px-4">
              <div className="md:flex md:space-x-6">
                <div className="md:w-1/3 flex flex-col items-center space-y-4">
                  <PhotoPreview />
                  <label className="text-sm text-gray-600">Profile Photo</label>
                  <input type="file" accept="image/*" onChange={handlePhoto} className="text-sm" />
                  <p className="text-xs text-gray-500 text-center">
                    A clear face photo helps matches and recruiters connect with you.
                  </p>
                </div>
                <div className="md:w-2/3 mt-4 md:mt-0 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm text-gray-600">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className={`w-full border p-2 rounded ${errors.fullName ? "border-red-500" : ""}`}
                      placeholder="Full Name"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Headline</label>
                    <input
                      type="text"
                      name="headline"
                      value={formData.headline}
                      onChange={handleChange}
                      className="w-full border p-2 rounded"
                      placeholder="Short headline"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full border p-2 rounded ${errors.email ? "border-red-500" : ""}`}
                      placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Phone</label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full border p-2 rounded ${errors.phone ? "border-red-500" : ""}`}
                      placeholder="+91 9876543210"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Age</label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      className="w-full border p-2 rounded"
                      min={0}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Gender</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className={`w-full border p-2 rounded ${errors.gender ? "border-red-500" : ""}`}
                    >
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Marital Status</label>
                    <select
                      name="maritalStatus"
                      value={formData.maritalStatus}
                      onChange={handleChange}
                      className={`w-full border p-2 rounded ${errors.maritalStatus ? "border-red-500" : ""}`}
                    >
                      <option value="">Select</option>
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                      <option value="Divorced">Divorced</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full border p-2 rounded"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full border p-2 rounded"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Education</label>
                    <input
                      type="text"
                      name="education"
                      value={formData.education}
                      onChange={handleChange}
                      className="w-full border p-2 rounded"
                      placeholder="Highest education"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ------------------- Slide 2 ------------------- */}
            <div className="w-full flex-shrink-0 px-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-gray-600">Profession</label>
                  <input
                    name="profession"
                    value={formData.profession}
                    onChange={handleChange}
                    className={`w-full border p-2 rounded ${errors.profession ? "border-red-500" : ""}`}
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Company</label>
                  <input
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Experience (Years)</label>
                  <input
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    className={`w-full border p-2 rounded ${errors.experience ? "border-red-500" : ""}`}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm text-gray-600">Skills (comma separated)</label>
                  <input
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm text-gray-600">About</label>
                  <textarea
                    name="about"
                    value={formData.about}
                    onChange={handleChange}
                    rows={3}
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm text-gray-600">Interests</label>
                  <div className="flex gap-2 flex-wrap mb-2">
                    {formData.interests.map((tag) => (
                      <span
                        key={tag}
                        className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full flex items-center gap-1"
                      >
                        {tag}
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

            {/* ------------------- Slide 3 ------------------- */}
            <div className="w-full flex-shrink-0 px-4">
              <h3 className="text-lg font-semibold mb-2">Review & Save</h3>
              <div className="overflow-x-auto border rounded">
                <table className="min-w-full">
                  <tbody>
                    {Object.entries({
                      "Full Name": formData.fullName,
                      Headline: formData.headline,
                      Email: formData.email,
                      Phone: formData.phone,
                      Age: formData.age,
                      Gender: formData.gender,
                      "Marital Status": formData.maritalStatus,
                      Address: formData.address,
                      City: formData.city,
                      Education: formData.education,
                      Profession: formData.profession,
                      Company: formData.company,
                      "Experience (yrs)": formData.experience,
                      Skills: formData.skills,
                      About: formData.about,
                      Interests: formData.interests.join(", "),
                    }).map(([label, value]) => (
                      <tr key={label} className="border-b">
                        <td className="px-4 py-2 font-semibold bg-gray-50">{label}</td>
                        <td className="px-4 py-2">{value || <span className="text-gray-400">—</span>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={prevStep}
              disabled={step === 1}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Previous
            </button>
            {step < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                {loading ? "Saving..." : "Save Profile"}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}























































// // src/pages/EditProfile.jsx
// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { useUserProfile } from "../context/UseProfileContext";
// import { updateUserProfile } from "../services/api";

// // Get initial user data from localStorage
// const savedUser = JSON.parse(localStorage.getItem("user") || "{}");

// const INITIAL_FORM_STATE = {
//   user_id: savedUser.id || null,
//   profilePhoto: savedUser.profile_picture_url || "",
//   fullName: savedUser.fullName || savedUser.full_name || "",
//   headline: savedUser.headline || "",
//   age: savedUser.age || "",
//   // dob: savedUser.dob || "",
//   gender: savedUser.gender || "",
//   maritalStatus: savedUser.marital_status || "",
//   address: savedUser.address || "",
//   city: savedUser.city || "",
//   email: savedUser.email || "",
//   phone: savedUser.phone || "",
//   education: savedUser.education || "",
//   profession: savedUser.profession || "",
//   company: savedUser.company || "",
//   experience: savedUser.experience || "",
//   skills: savedUser.skills || "",
//   about: savedUser.about || "",
//   interests: Array.isArray(savedUser.interests)
//     ? savedUser.interests
//     : savedUser.interests
//     ? savedUser.interests.split(",").map((i) => i.trim())
//     : [],
// };

// export default function EditProfile() {
//   const { updateProfile } = useUserProfile();
//   const [formData, setFormData] = useState(INITIAL_FORM_STATE);
//   const [interestInput, setInterestInput] = useState("");
//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [step, setStep] = useState(1);
//   const navigate = useNavigate();

//   const sliderRef = useRef(null);
//   const touchStartX = useRef(null);
//   const touchEndX = useRef(null);

//   const authToken = localStorage.getItem("accessToken") || "";

//   useEffect(() => {
//     localStorage.setItem("userProfile", JSON.stringify(formData));
//   }, [formData]);

//   // swipe handlers
//   const onTouchStart = (e) => (touchStartX.current = e.touches[0].clientX);
//   const onTouchMove = (e) => (touchEndX.current = e.touches[0].clientX);
//   const onTouchEnd = () => {
//     if (!touchStartX.current || !touchEndX.current) return;
//     const dist = touchStartX.current - touchEndX.current;
//     const threshold = 50;
//     if (dist > threshold) nextStep();
//     else if (dist < -threshold) prevStep();
//     touchStartX.current = null;
//     touchEndX.current = null;
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((p) => ({ ...p, [name]: value }));
//     setErrors((p) => ({ ...p, [name]: "" }));
//   };

//   const handlePhoto = (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     const reader = new FileReader();
//     reader.onload = (ev) => setFormData((p) => ({ ...p, profilePhoto: ev.target.result }));
//     reader.readAsDataURL(file);
//   };

//   const addInterest = () => {
//     const v = interestInput.trim();
//     if (!v || formData.interests.includes(v)) return setInterestInput("");
//     setFormData((p) => ({ ...p, interests: [...p.interests, v] }));
//     setInterestInput("");
//   };

//   const removeInterest = (tag) => {
//     setFormData((p) => ({ ...p, interests: p.interests.filter((t) => t !== tag) }));
//   };

//   // validation per step
//   const validateStep = () => {
//     const newErr = {};
//     if (step === 1) {
//       if (!formData.fullName) newErr.fullName = "Full name required";
//       if (!formData.email) newErr.email = "Email required";
//       if (!formData.phone) newErr.phone = "Phone required";
//       if (!formData.gender) newErr.gender = "Gender required";
//       if (!formData.maritalStatus) newErr.maritalStatus = "Marital status required";
//     } else if (step === 2) {
//       if (!formData.profession) newErr.profession = "Profession required";
//       if (!formData.experience) newErr.experience = "Experience required";
//     }
//     setErrors(newErr);
//     return Object.keys(newErr).length === 0;
//   };

//   const nextStep = () => {
//     if (!validateStep()) return;
//     setStep((s) => Math.min(s + 1, 3));
//     sliderRef.current?.focus();
//   };
//   const prevStep = () => {
//     setStep((s) => Math.max(s - 1, 1));
//     sliderRef.current?.focus();
//   };

//   const handleSave = async (e) => {
//     e.preventDefault();
//     if (!validateStep()) return;

//     if (!authToken) {
//       alert("User not logged in or token missing!");
//       return;
//     }

//     setLoading(true);
//     try {
//       const payload = {
//         user_id: formData.user_id,
//         full_name: formData.fullName,
//         email: formData.email,
//         phone: formData.phone,
//         gender: formData.gender,
//         marital_status: formData.maritalStatus,
//         address: formData.address,
//         city: formData.city,
//         profession: formData.profession,
//         skills: formData.skills,
//         interests: formData.interests.join(","),
//         about: formData.about,
//         profile_picture_url: formData.profilePhoto,
//         headline: formData.headline,
//         age: formData.age,
//         education: formData.education,
//         company: formData.company,
//         experience: formData.experience,
//         // dob: formData.dob,
//       };

//       const res = await updateUserProfile(payload, authToken);
//       const finalProfile = res.user || res;

//       updateProfile(finalProfile);
//       localStorage.setItem("user", JSON.stringify(finalProfile));

//       alert("Profile saved successfully!");
//       navigate("/dashboard");
//     } catch (err) {
//       console.error(err);
//       alert("Error saving profile: " + (err.response?.data?.message || err.message));
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Profile photo preview
//   const PhotoPreview = () =>
//     formData.profilePhoto ? (
//       <img
//         src={formData.profilePhoto}
//         alt="profile"
//         className="w-28 h-28 rounded-full object-cover border"
//       />
//     ) : (
//       <div className="w-28 h-28 rounded-full bg-gray-100 flex items-center justify-center border">
//         <span className="text-sm text-gray-500">No Photo</span>
//       </div>
//     );

//   return (
//     <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
//       <div className="flex items-center justify-between mb-4">
//         <h2 className="text-2xl font-bold">Edit Profile</h2>
//         <div className="text-sm text-gray-600">Step {step} of 3</div>
//       </div>

//       <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
//         <div
//           className="bg-indigo-600 h-2 rounded-full transition-all"
//           style={{ width: `${(step / 3) * 100}%` }}
//         />
//       </div>

//       <form onSubmit={handleSave}>
//         <div
//           ref={sliderRef}
//           tabIndex={0}
//           onTouchStart={onTouchStart}
//           onTouchMove={onTouchMove}
//           onTouchEnd={onTouchEnd}
//           className="relative overflow-hidden"
//         >
//           <div className="flex transition-transform duration-300" style={{ transform: `translateX(-${(step - 1) * 100}%)` }}>
//             {/* Slide 1 - Personal & Contact */}
//             <div className="w-full flex-shrink-0 px-4">
//               <div className="md:flex md:space-x-6">
//                 <div className="md:w-1/3 flex flex-col items-center space-y-4">
//                   <PhotoPreview />
//                   <label className="text-sm text-gray-600">Profile Photo</label>
//                   <input type="file" accept="image/*" onChange={handlePhoto} className="text-sm" />
//                   <p className="text-xs text-gray-500 text-center">
//                     A clear face photo helps matches and recruiters connect with you.
//                   </p>
//                 </div>

//                 <div className="md:w-2/3 mt-4 md:mt-0 grid grid-cols-1 md:grid-cols-2 gap-3">
//                   <div>
//                     <label className="text-sm text-gray-600">Full Name</label>
//                     <input
//                       type="text"
//                       name="fullName"
//                       value={formData.fullName}
//                       onChange={handleChange}
//                       className={`w-full border p-2 rounded ${errors.fullName ? "border-red-500" : ""}`}
//                       placeholder="Full Name"
//                     />
//                   </div>

//                   <div>
//                     <label className="text-sm text-gray-600">Headline</label>
//                     <input
//                       type="text"
//                       name="headline"
//                       value={formData.headline}
//                       onChange={handleChange}
//                       className="w-full border p-2 rounded"
//                       placeholder="Short headline"
//                     />
//                   </div>

//                   <div>
//                     <label className="text-sm text-gray-600">Email</label>
//                     <input
//                       type="email"
//                       name="email"
//                       value={formData.email}
//                       onChange={handleChange}
//                       className={`w-full border p-2 rounded ${errors.email ? "border-red-500" : ""}`}
//                       placeholder="you@example.com"
//                     />
//                   </div>

//                   <div>
//                     <label className="text-sm text-gray-600">Phone</label>
//                     <input
//                       type="text"
//                       name="phone"
//                       value={formData.phone}
//                       onChange={handleChange}
//                       className={`w-full border p-2 rounded ${errors.phone ? "border-red-500" : ""}`}
//                       placeholder="+91 9876543210"
//                     />
//                   </div>

//                   {/* <div>
//                     <label className="text-sm text-gray-600">Date of Birth</label>
//                     <input
//                       type="date"
//                       name="dob"
//                       value={formData.dob}
//                       onChange={handleChange}
//                       className="w-full border p-2 rounded"
//                     />
//                   </div> */}

//                   <div>
//                     <label className="text-sm text-gray-600">Age</label>
//                     <input
//                       type="number"
//                       name="age"
//                       value={formData.age}
//                       onChange={handleChange}
//                       className="w-full border p-2 rounded"
//                       min={0}
//                     />
//                   </div>

//                   <div>
//                     <label className="text-sm text-gray-600">Gender</label>
//                     <select
//                       name="gender"
//                       value={formData.gender}
//                       onChange={handleChange}
//                       className={`w-full border p-2 rounded ${errors.gender ? "border-red-500" : ""}`}
//                     >
//                       <option value="">Select</option>
//                       <option value="Male">Male</option>
//                       <option value="Female">Female</option>
//                       <option value="Other">Other</option>
//                     </select>
//                   </div>

//                   <div>
//                     <label className="text-sm text-gray-600">Marital Status</label>
//                     <select
//                       name="maritalStatus"
//                       value={formData.maritalStatus}
//                       onChange={handleChange}
//                       className={`w-full border p-2 rounded ${errors.maritalStatus ? "border-red-500" : ""}`}
//                     >
//                       <option value="">Select</option>
//                       <option value="Single">Single</option>
//                       <option value="Married">Married</option>
//                       <option value="Divorced">Divorced</option>
//                     </select>
//                   </div>

//                   <div>
//                     <label className="text-sm text-gray-600">Address</label>
//                     <input
//                       type="text"
//                       name="address"
//                       value={formData.address}
//                       onChange={handleChange}
//                       className="w-full border p-2 rounded"
//                     />
//                   </div>

//                   <div>
//                     <label className="text-sm text-gray-600">City</label>
//                     <input
//                       type="text"
//                       name="city"
//                       value={formData.city}
//                       onChange={handleChange}
//                       className="w-full border p-2 rounded"
//                     />
//                   </div>

//                   <div>
//                     <label className="text-sm text-gray-600">Education</label>
//                     <input
//                       type="text"
//                       name="education"
//                       value={formData.education}
//                       onChange={handleChange}
//                       className="w-full border p-2 rounded"
//                       placeholder="Highest education"
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Slide 2 - Professional & Interests */}
//             <div className="w-full flex-shrink-0 px-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                 <div>
//                   <label className="text-sm text-gray-600">Profession</label>
//                   <input
//                     name="profession"
//                     value={formData.profession}
//                     onChange={handleChange}
//                     className={`w-full border p-2 rounded ${errors.profession ? "border-red-500" : ""}`}
//                   />
//                 </div>

//                 <div>
//                   <label className="text-sm text-gray-600">Company</label>
//                   <input
//                     name="company"
//                     value={formData.company}
//                     onChange={handleChange}
//                     className="w-full border p-2 rounded"
//                   />
//                 </div>

//                 <div>
//                   <label className="text-sm text-gray-600">Experience (Years)</label>
//                   <input
//                     name="experience"
//                     value={formData.experience}
//                     onChange={handleChange}
//                     className={`w-full border p-2 rounded ${errors.experience ? "border-red-500" : ""}`}
//                   />
//                 </div>

//                 <div className="md:col-span-2">
//                   <label className="text-sm text-gray-600">Skills (comma separated)</label>
//                   <input
//                     name="skills"
//                     value={formData.skills}
//                     onChange={handleChange}
//                     className="w-full border p-2 rounded"
//                   />
//                 </div>

//                 <div className="md:col-span-2">
//                   <label className="text-sm text-gray-600">About</label>
//                   <textarea
//                     name="about"
//                     value={formData.about}
//                     onChange={handleChange}
//                     rows={3}
//                     className="w-full border p-2 rounded"
//                   />
//                 </div>

//                 <div className="md:col-span-2">
//                   <label className="text-sm text-gray-600">Interests</label>
//                   <div className="flex gap-2 flex-wrap mb-2">
//                     {formData.interests.map((tag) => (
//                       <span
//                         key={tag}
//                         className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full flex items-center gap-1"
//                       >
//                         {tag}
//                         <button
//                           type="button"
//                           onClick={() => removeInterest(tag)}
//                           className="text-red-500 font-bold"
//                         >
//                           ×
//                         </button>
//                       </span>
//                     ))}
//                   </div>
//                   <div className="flex gap-2">
//                     <input
//                       value={interestInput}
//                       onChange={(e) => setInterestInput(e.target.value)}
//                       className="border p-2 rounded flex-1"
//                       placeholder="Add interest"
//                     />
//                     <button
//                       type="button"
//                       onClick={addInterest}
//                       className="bg-blue-600 text-white px-4 py-2 rounded"
//                     >
//                       Add
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Slide 3 - Review */}
//             <div className="w-full flex-shrink-0 px-4">
//               <h3 className="text-lg font-semibold mb-2">Review & Save</h3>
//               <div className="overflow-x-auto border rounded">
//                 <table className="min-w-full">
//                   <tbody>
//                     {Object.entries({
//                       "Full Name": formData.fullName,
//                       Headline: formData.headline,
//                       Email: formData.email,
//                       Phone: formData.phone,
//                       DOB: formData.dob,
//                       Age: formData.age,
//                       Gender: formData.gender,
//                       "Marital Status": formData.maritalStatus,
//                       Address: formData.address,
//                       City: formData.city,
//                       Education: formData.education,
//                       Profession: formData.profession,
//                       Company: formData.company,
//                       "Experience (yrs)": formData.experience,
//                       Skills: formData.skills,
//                       About: formData.about,
//                       Interests: formData.interests.join(", "),
//                     }).map(([label, value]) => (
//                       <tr key={label} className="border-b">
//                         <td className="px-4 py-2 font-semibold bg-gray-50">{label}</td>
//                         <td className="px-4 py-2">{value || <span className="text-gray-400">—</span>}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>

//           {/* Navigation buttons */}
//           <div className="flex justify-between mt-4">
//             <button
//               type="button"
//               onClick={prevStep}
//               disabled={step === 1}
//               className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
//             >
//               Previous
//             </button>
//             {step < 3 ? (
//               <button
//                 type="button"
//                 onClick={nextStep}
//                 className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
//               >
//                 Next
//               </button>
//             ) : (
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
//               >
//                 {loading ? "Saving..." : "Save Profile"}
//               </button>
//             )}
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// }






