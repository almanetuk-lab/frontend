import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserProfile } from "../context/UseProfileContext"; 
import { fetchUserProfile, updateUserProfile } from "../services/api"; 

const INITIAL_FORM_STATE = {
  user_id: null, // Add user_id to initial state
  profilePhotoUrl: "", 
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
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [interestInput, setInterestInput] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const navigate = useNavigate();

  // --- Placeholder for User ID and Token ---
  // If user_id comes from profile context, use it. Otherwise, you'll need to fetch it from token or elsewhere.
  // For now, assuming profile.user_id is the source.
  const currentUserId = profile?.user_id; // Get user_id from context
  const authToken = localStorage.getItem("token"); // Get auth token from localStorage

  // Populate form from API on mount
  useEffect(() => {
    const loadUserProfile = async () => {
      // Check if we have a token to fetch profile
      if (!authToken) {
        setApiError("Authentication token not available. Please log in.");
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        // Calling fetchUserProfile without userId in URL
        const data = await fetchUserProfile(authToken);
        setFormData(prev => ({
          ...INITIAL_FORM_STATE, 
          ...data,
          // Ensure user_id from API response is stored in formData
          user_id: data.user_id || currentUserId, 
          profilePhotoUrl: data.profile_picture_url || "", 
          skills: data.skills || "", 
          interests: Array.isArray(data.interests) ? data.interests : (data.interests ? data.interests.split(',').map(item => item.trim()) : []),
        }));
        updateProfile(data); 
      } catch (error) {
        setApiError(error.message || "Failed to fetch profile data.");
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, [authToken, updateProfile, currentUserId]); // Depend on authToken and updateProfile


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
    setErrors(p => ({ ...p, [name]: "" }));
  };

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (ev) => {
      setFormData(p => ({ ...p, profilePhotoUrl: ev.target.result })); 
    };
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
    // Ensure user_id is present if your backend requires it for identification
    if (!formData.user_id) newErr.user_id = "User ID not found for profile update.";
    setErrors(newErr);
    return Object.keys(newErr).length === 0;
  };

  const handleSave = async (e) => {
    e?.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setApiError(null);
    
    try {
      const dataToUpdate = {
        user_id: formData.user_id, // IMPORTANT: Sending user_id in the body
        email: formData.email, // Ensure this matches your Postman example
        full_name: formData.fullName, // Adjust to 'full_name' as per Postman example
        phone: formData.phone,
        gender: formData.gender,
        marital_status: formData.maritalStatus, // Adjust to 'marital_status'
        address: formData.address,
        city: formData.city,
        profession: formData.profession,
        // skills: formData.skills.split(',').map(s => s.trim()), // If backend expects array, convert
        skills: formData.skills, // If backend expects comma-separated string
        interests: Array.isArray(formData.interests) ? formData.interests.join(',') : formData.interests, // Convert array to string
        about: formData.about,
        profile_picture_url: formData.profilePhotoUrl, 
        // Add other fields from your Postman JSON if they are not dynamically collected by the form
        // For example, if you have 'headline', 'age', 'dob', 'education', 'company', 'experience'
        headline: formData.headline,
        age: formData.age,
        dob: formData.dob,
        education: formData.education,
        company: formData.company,
        experience: formData.experience,
      };

      // Call updateUserProfile without userId in URL, passing user_id in dataToUpdate
      const updatedProfile = await updateUserProfile(dataToUpdate, authToken);
      
      updateProfile(updatedProfile); 

      alert("Profile saved successfully!");
      navigate("/dashboard");

    } catch (error) {
      setApiError(error.message || "Failed to save profile.");
      console.error("Error saving profile:", error);
      alert(`Error saving profile: ${error.message}`); 
    } finally {
      setLoading(false);
    }
  };

  if (loading && !formData.user_id && !apiError) { // Show initial loading state more robustly
    return <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded-lg mt-6">Loading profile...</div>;
  }

  if (apiError && !loading) { 
    return <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded-lg mt-6 text-red-600">Error: {apiError}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded-lg mt-6">
      <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="flex items-start gap-6">
          <div className="flex-shrink-0">
            {formData.profilePhotoUrl ? (
              <img src={formData.profilePhotoUrl} alt="profile" className="w-28 h-28 rounded-full object-cover border" />
            ) : (
              <div className="w-28 h-28 rounded-full bg-gray-100 flex items-center justify-center border text-gray-500">No Photo</div>
            )}
            <div className="mt-2">
              <input type="file" accept="image/*" onChange={handlePhoto} />
            </div>
          </div>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* User ID display (optional, for debugging) */}
            {/* <div>
              <label className="block text-sm text-gray-600">User ID</label>
              <input name="user_id" value={formData.user_id || ''} readOnly className="w-full border p-2 rounded bg-gray-100"/>
              {errors.user_id && <p className="text-red-500 text-sm">{errors.user_id}</p>}
            </div> */}

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

            {/* Add other input fields here if they are part of your Postman JSON and INITIAL_FORM_STATE */}
            {/* Example: Headline */}
            <div>
              <label className="block text-sm text-gray-600">Headline</label>
              <input name="headline" value={formData.headline} onChange={handleChange} className="w-full border p-2 rounded" placeholder="e.g., Passionate Developer"/>
            </div>
            {/* Example: Age */}
            <div>
              <label className="block text-sm text-gray-600">Age</label>
              <input type="number" name="age" value={formData.age} onChange={handleChange} className="w-full border p-2 rounded" placeholder="e.g., 30"/>
            </div>
            {/* Example: DOB */}
            <div>
              <label className="block text-sm text-gray-600">Date of Birth</label>
              <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full border p-2 rounded"/>
            </div>
            {/* Example: Education */}
            <div>
              <label className="block text-sm text-gray-600">Education</label>
              <input name="education" value={formData.education} onChange={handleChange} className="w-full border p-2 rounded" placeholder="e.g., B.Tech in CS"/>
            </div>
            {/* Example: Company */}
            <div>
              <label className="block text-sm text-gray-600">Company</label>
              <input name="company" value={formData.company} onChange={handleChange} className="w-full border p-2 rounded" placeholder="e.g., Google"/>
            </div>
            {/* Example: Experience */}
            <div>
              <label className="block text-sm text-gray-600">Experience (Years)</label>
              <input type="number" name="experience" value={formData.experience} onChange={handleChange} className="w-full border p-2 rounded" placeholder="e.g., 5"/>
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
          <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded" disabled={loading}>
            {loading ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}





// ----------------------------------------------------------- //
// old with api code 




// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useUserProfile } from "../context/UseProfileContext";

// const INITIAL = {
//   profilePhoto: null,
//   fullName: "",
//   headline: "",
//   age: "",
//   dob: "",
//   gender: "",
//   maritalStatus: "",
//   address: "",
//   city: "",
//   email: "",
//   phone: "",
//   education: "",
//   profession: "",
//   company: "",
//   experience: "",
//   skills: "",
//   about: "",
//   interests: [],
// };

// export default function EditProfile() {
//   const { profile, updateProfile } = useUserProfile();
//   const [formData, setFormData] = useState(INITIAL);
//   const [interestInput, setInterestInput] = useState("");
//   const [errors, setErrors] = useState({});
//   const navigate = useNavigate();

//   // Populate form from context/profile on mount
//   useEffect(() => {
//     if (profile) setFormData({ ...INITIAL, ...profile });
//   }, [profile]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(p => ({ ...p, [name]: value }));
//     setErrors(p => ({ ...p, [name]: "" }));
//   };

//   const handlePhoto = (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     const reader = new FileReader();
//     reader.onload = (ev) => setFormData(p => ({ ...p, profilePhoto: ev.target.result }));
//     reader.readAsDataURL(file);
//   };

//   const addInterest = () => {
//     const v = interestInput.trim();
//     if (!v || formData.interests.includes(v)) return setInterestInput("");
//     setFormData(p => ({ ...p, interests: [...p.interests, v] }));
//     setInterestInput("");
//   };

//   const removeInterest = (tag) => {
//     setFormData(p => ({ ...p, interests: p.interests.filter(t => t !== tag) }));
//   };

//   const validate = () => {
//     const newErr = {};
//     if (!formData.fullName) newErr.fullName = "Full name required";
//     if (!formData.email) newErr.email = "Email required";
//     setErrors(newErr);
//     return Object.keys(newErr).length === 0;
//   };

//   const handleSave = (e) => {
//     e?.preventDefault();
//     if (!validate()) return;

//     // Update profile in context (shared with Dashboard & UserCreateForm)
//     updateProfile(formData);

//     // Show feedback
//     alert("Profile saved!");

//     // Redirect to Dashboard (reflect updated profile)
//     navigate("/dashboard");
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded-lg mt-6">
//       <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>

//       <form onSubmit={handleSave} className="space-y-6">
//         <div className="flex items-start gap-6">
//           <div className="flex-shrink-0">
//             {formData.profilePhoto ? (
//               <img src={formData.profilePhoto} alt="profile" className="w-28 h-28 rounded-full object-cover border" />
//             ) : (
//               <div className="w-28 h-28 rounded-full bg-gray-100 flex items-center justify-center border text-gray-500">No Photo</div>
//             )}
//             <div className="mt-2">
//               <input type="file" accept="image/*" onChange={handlePhoto} />
//             </div>
//           </div>

//           <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
//             <div>
//               <label className="block text-sm text-gray-600">Full Name</label>
//               <input name="fullName" value={formData.fullName} onChange={handleChange} className={`w-full border p-2 rounded ${errors.fullName ? "border-red-500" : ""}`} placeholder="Full Name"/>
//               {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
//             </div>

//             <div>
//               <label className="block text-sm text-gray-600">Email</label>
//               <input type="email" name="email" value={formData.email} onChange={handleChange} className={`w-full border p-2 rounded ${errors.email ? "border-red-500" : ""}`} placeholder="you@example.com"/>
//               {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
//             </div>

//             <div>
//               <label className="block text-sm text-gray-600">Profession</label>
//               <input name="profession" value={formData.profession} onChange={handleChange} className="w-full border p-2 rounded" placeholder="Software Engineer, Doctor..."/>
//             </div>

//             <div>
//               <label className="block text-sm text-gray-600">Phone</label>
//               <input name="phone" value={formData.phone} onChange={handleChange} className="w-full border p-2 rounded" placeholder="+91 98765 43210"/>
//             </div>

//             <div className="md:col-span-2">
//               <label className="block text-sm text-gray-600">About</label>
//               <textarea name="about" value={formData.about} onChange={handleChange} rows={3} className="w-full border p-2 rounded"/>
//             </div>

//             <div className="md:col-span-2">
//               <label className="block text-sm text-gray-600">Skills (comma separated)</label>
//               <input name="skills" value={formData.skills} onChange={handleChange} className="w-full border p-2 rounded" placeholder="React, Node, SQL..."/>
//             </div>

//             <div className="md:col-span-2">
//               <label className="block text-sm text-gray-600">Address</label>
//               <input name="address" value={formData.address} onChange={handleChange} className="w-full border p-2 rounded" placeholder="Full address"/>
//             </div>

//             <div>
//               <label className="block text-sm text-gray-600">City</label>
//               <input name="city" value={formData.city} onChange={handleChange} className="w-full border p-2 rounded"/>
//             </div>

//             <div>
//               <label className="block text-sm text-gray-600">Gender</label>
//               <select name="gender" value={formData.gender} onChange={handleChange} className="w-full border p-2 rounded">
//                 <option value="">Select Gender</option>
//                 <option value="Male">Male</option>
//                 <option value="Female">Female</option>
//                 <option value="Other">Other</option>
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm text-gray-600">Marital Status</label>
//               <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} className="w-full border p-2 rounded">
//                 <option value="">Select Status</option>
//                 <option value="Single">Single</option>
//                 <option value="Married">Married</option>
//                 <option value="Divorced">Divorced</option>
//                 <option value="Widowed">Widowed</option>
//                 <option value="Other">Other</option>
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Interests */}
//         <div>
//           <label className="block text-sm text-gray-600">Interests</label>
//           <div className="flex gap-2 mt-2">
//             <input value={interestInput} onChange={e => setInterestInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addInterest(); }}} className="flex-1 border p-2 rounded" placeholder="Type interest and Enter"/>
//             <button type="button" onClick={addInterest} className="px-3 py-2 bg-indigo-600 text-white rounded">Add</button>
//           </div>
//           <div className="mt-3 flex flex-wrap gap-2">
//             {formData.interests.map(t => (
//               <span key={t} className="inline-flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm">
//                 {t} <button onClick={() => removeInterest(t)} className="ml-2 text-red-500 font-bold">×</button>
//               </span>
//             ))}
//           </div>
//         </div>

//         <div className="flex justify-end gap-3">
//           <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
//           <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">Save Profile</button>
//         </div>
//       </form>
//     </div>
//   );
// }

