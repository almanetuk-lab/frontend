import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserProfile } from "../context/UseProfileContext";
import { updateUserProfile } from "../services/api";

export default function EditProfilePage() {
  const { profile, updateProfile } = useUserProfile();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    profession: "",
    company: "",
    experience: "",
    education: "",
    age: "",
    gender: "",
    marital_status: "",
    city: "",
    date_of_birth: "",
    about: "",
    skills: "",
    interests: ""
  });

  const [loading, setLoading] = useState(false);

  // Populate form with existing profile data
  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || profile.fullName || "",
        email: profile.email || "",
        phone: profile.phone || "",
        profession: profile.profession || "",
        company: profile.company || "",
        experience: profile.experience || "",
        education: profile.education || "",
        age: profile.age || "",
        gender: profile.gender || "",
        marital_status: profile.marital_status || "",
        city: profile.city || "",
        date_of_birth: profile.date_of_birth || "",
        about: profile.about || "",
        skills: profile.skills || "",
        interests: profile.interests || ""
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

//   const handleSubmit = async (e) => {
//   e.preventDefault();
//   setLoading(true);
  
//   try {
//     console.log("🔵 STEP 1 - Form Data to be sent:", formData);
    
//     // API call karo
//     const response = await updateUserProfile(formData);
//     console.log("🔵 STEP 2 - API Response:", response);
    
//     // ✅ Check response format
//     if (response.success || response.message === "Profile updated successfully") {
//       console.log("✅ API Success - Updating context with FRESH data");
      
//       // ✅ IMPORTANT: Fresh data leke aao getUserProfile se
//       const freshData = await getUserProfile();
//       console.log("🔵 STEP 3 - Fresh Data from getUserProfile:", freshData);
      
//       // Context update with FRESH data
//       updateProfile(freshData.data || freshData);
      
//       alert("Profile updated successfully!");
//       navigate("/profile");
//     } else {
//       console.log("❌ API Failed - No success in response");
//       alert("Profile update failed!");
//     }
    
//   } catch (error) {
//     console.error("🔵 STEP 4 - API Error:", error);
//     alert("Failed to update profile. Please try again.");
//   } finally {
//     setLoading(false);
//   }
// };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Yahan aap API call karenge profile update karne ke liye
      await updateProfile(formData);
      
      // Success message ya redirect
      alert("Profile updated successfully!");
      navigate("/profile");
      
    } catch (error) {
      console.error("Profile update error:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Edit Profile</h1>
          <button
            onClick={() => navigate("/profile")}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
          >
            Cancel
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <Section title="Personal Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Full Name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                required
              />
              <FormField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <FormField
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
              <FormField
                label="Date of Birth"
                name="date_of_birth"
                type="date"
                value={formData.date_of_birth}
                onChange={handleChange}
              />
              <FormField
                label="Age"
                name="age"
                type="number"
                value={formData.age}
                onChange={handleChange}
              />
              <SelectField
                label="Gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                options={["", "Male", "Female", "Other"]}
              />
              <SelectField
                label="Marital Status"
                name="marital_status"
                value={formData.marital_status}
                onChange={handleChange}
                options={["", "Single", "Married", "Divorced", "Widowed"]}
              />
              <FormField
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
              />
            </div>
          </Section>

          {/* Professional Information */}
          <Section title="Professional Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Profession"
                name="profession"
                value={formData.profession}
                onChange={handleChange}
              />
              <FormField
                label="Company"
                name="company"
                value={formData.company}
                onChange={handleChange}
              />
              <FormField
                label="Experience (years)"
                name="experience"
                type="number"
                value={formData.experience}
                onChange={handleChange}
              />
              <FormField
                label="Education"
                name="education"
                value={formData.education}
                onChange={handleChange}
              />
            </div>
          </Section>

          {/* About & Skills */}
          <Section title="About Me">
            <TextAreaField
              label="About Yourself"
              name="about"
              value={formData.about}
              onChange={handleChange}
              rows={4}
            />
          </Section>

          <Section title="Skills & Interests">
            <TextAreaField
              label="Skills"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              rows={3}
              placeholder="Separate skills with commas"
            />
            <TextAreaField
              label="Interests"
              name="interests"
              value={formData.interests}
              onChange={handleChange}
              rows={3}
              placeholder="Separate interests with commas"
            />
          </Section>

          {/* Submit Buttons */}
          <div className="flex justify-center gap-4 pt-6 border-t">
            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Reusable Form Components
function Section({ title, children }) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      {children}
    </div>
  );
}

function FormField({ label, name, type = "text", value, onChange, required = false }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        required={required}
      />
    </div>
  );
}

function TextAreaField({ label, name, value, onChange, rows = 3, placeholder = "" }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
      />
    </div>
  );
}

function SelectField({ label, name, value, onChange, options }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
      >
        {options.map(option => (
          <option key={option} value={option}>
            {option || `Select ${label}`}
          </option>
        ))}
      </select>
    </div>
  );
}














// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useUserProfile } from "../context/UseProfileContext";
// import { updateUserProfile, getUserProfile } from "../services/api";

// export default function EditProfile() {
//   const { profile, updateProfile } = useUserProfile();
//   const navigate = useNavigate();
  
//   const [formData, setFormData] = useState({
//     full_name: "",
//     email: "",
//     phone: "",
//     gender: "",
//     age: "",
//     date_of_birth: "",
//     marital_status: "",
//     city: "",
//     profession: "",
//     company: "",
//     experience: "",
//     skills: "",
//     about: "",
//     interests: "",
//     profile_picture_url: "",
//     education: "",
//     headline: ""
//   });
  
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [dataLoaded, setDataLoaded] = useState(false);

//   // ✅ 1. FIRST TIME PROFILE FETCH
//   useEffect(() => {
//     const fetchUserProfile = async () => {
//       try {
//         const token = localStorage.getItem("accessToken");
//         if (!token) {
//           navigate("/login");
//           return;
//         }

//         console.log("Current profile:", profile);
        
//         // Agar profile empty hai to API se fetch karo
//         if (!profile || Object.keys(profile).length === 0) {
//           console.log("Fetching profile from API...");
//           const userData = await getUserProfile();
//           console.log("API Response:", userData);
          
//           if (userData && userData.user) {
//             updateProfile(userData.user);
//           } else if (userData && userData.data) {
//             // Agar response {data: user} format mein hai
//             updateProfile(userData.data);
//           }
//         } else {
//           console.log("Using existing profile data");
//           setDataLoaded(true);
//         }
//       } catch (err) {
//         console.error("Profile fetch error:", err);
//         setError("Failed to load profile data");
//       }
//     };

//     fetchUserProfile();
//   }, []); // ✅ Empty dependencies - sirf ek baar chalega

//   // ✅ 2. FORM DATA SET KARO - Jab profile update ho
//   useEffect(() => {
//     if (profile && Object.keys(profile).length > 0) {
//       console.log("Setting form data with profile:", profile);
      
//       setFormData({
//         full_name: profile.full_name || profile.fullName || "",
//         email: profile.email || "",
//         phone: profile.phone || "",
//         gender: profile.gender || "",
//         age: profile.age || "",
//         marital_status: profile.marital_status || profile.maritalStatus || "",
//         city: profile.city || "",
//         profession: profile.profession || "",
//         company: profile.company || "",
//         experience: profile.experience || "",
//         skills: profile.skills || "",
//         about: profile.about || "",
//         interests: Array.isArray(profile.interests) ? profile.interests.join(", ") : (profile.interests || ""),
//         profile_picture_url: profile.profile_picture_url || profile.profilePhoto || profile.profile_picture || "",
//         education: profile.education || "",
//         headline: profile.headline || ""
//       });
//       setDataLoaded(true);
//     }
//   }, [profile]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = async (e) => {
//   e.preventDefault();
//   setLoading(true);
//   setError("");

//   try {
//     const token = localStorage.getItem("accessToken");
//     if (!token) {
//       throw new Error("Please login first");
//     }

//     console.log("Submitting data:", formData);

//     // Clean payload
//     const payload = {
//       full_name: formData.full_name,
//       email: formData.email,
//       phone: formData.phone || null,
//       gender: formData.gender || null,
//       age: formData.age ? parseInt(formData.age) : null,
//       experience: formData.experience ? parseInt(formData.experience) : null,
//       marital_status: formData.marital_status || null,
//       city: formData.city || null,
//       profession: formData.profession || null,
//       company: formData.company || null,
//       skills: formData.skills || null,
//       about: formData.about || null,
//       interests: formData.interests || null,
//       profile_picture_url: formData.profile_picture_url || null,
//       education: formData.education || null,
//       headline: formData.headline || null
//     };

//     console.log("Cleaned payload:", payload);

//     const result = await updateUserProfile(payload);
//     console.log("Update API Response:", result);
    
//     // ✅ FIX: Properly update profile with ALL data
//     const updatedProfile = result.user || result.data || result.profile || result;
//     console.log("Updated profile to save:", updatedProfile);
    
//     // ✅ Merge existing profile with updated data
//     const mergedProfile = {
//       ...profile,  // Existing data
//       ...updatedProfile, // New updated data
//       ...payload   // Form data as fallback
//     };
    
//     updateProfile(mergedProfile);
//     localStorage.setItem("user", JSON.stringify(mergedProfile));

//     alert("Profile updated successfully!");
//     navigate("/dashboard");
    
//   } catch (err) {
//     console.error("Update error:", err);
//     console.error("Error response:", err.response?.data);
//     setError(err.response?.data?.message || err.message || "Failed to update profile");
//   } finally {
//     setLoading(false); // ✅ YEH RAHEGA - loading hamesha false hoga
//   }
// };


//   // ✅ Loading state
//   if (!dataLoaded && !profile) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-lg">Loading profile...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
//       <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>

//       {error && (
//         <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
//           {error}
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Full Name *</label>
//             <input
//               type="text"
//               name="full_name"
//               value={formData.full_name}
//               onChange={handleChange}
//               required
//               className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">Email *</label>
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               required
//               className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">Phone</label>
//             <input
//               type="text"
//               name="phone"
//               value={formData.phone}
//               onChange={handleChange}
//               className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">Gender</label>
//             <select
//               name="gender"
//               value={formData.gender}
//               onChange={handleChange}
//               className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//             >
//               <option value="">Select Gender</option>
//               <option value="Male">Male</option>
//               <option value="Female">Female</option>
//               <option value="Other">Other</option>
//             </select>
//           </div>

//           {/* Age Field */}
// <div>
//   <label className="block text-sm font-medium text-gray-700">Age</label>
//   <input
//     type="number"
//     name="age"
//     value={formData.age}
//     onChange={handleChange}
//     className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//   />
// </div>
//  {/* janm tarikha  */}
// <div>
//   <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
//   <input
//     type="date"
//     name="date_of_birth"
//     value={formData.date_of_birth}
//     onChange={handleChange}
//     className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//   />
// </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">Marital Status</label>
//             <select
//               name="marital_status"
//               value={formData.marital_status}
//               onChange={handleChange}
//               className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//             >
//               <option value="">Select Status</option>
//               <option value="Single">Single</option>
//               <option value="Married">Married</option>
//               <option value="Divorced">Divorced</option>
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">City</label>
//             <input
//               type="text"
//               name="city"
//               value={formData.city}
//               onChange={handleChange}
//               className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">Profession</label>
//             <input
//               type="text"
//               name="profession"
//               value={formData.profession}
//               onChange={handleChange}
//               className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">Company</label>
//             <input
//               type="text"
//               name="company"
//               value={formData.company}
//               onChange={handleChange}
//               className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//             />
//           </div>


//           {/* Experience Field */}
// <div>
//   <label className="block text-sm font-medium text-gray-700">Experience (Years)</label>
//   <input
//     type="number"
//     name="experience"
//     value={formData.experience}
//     onChange={handleChange}
//     className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//   />
// </div>

//           <div className="md:col-span-2">
//             <label className="block text-sm font-medium text-gray-700">Education</label>
//             <input
//               type="text"
//               name="education"
//               value={formData.education}
//               onChange={handleChange}
//               className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//             />
//           </div>

//           <div className="md:col-span-2">
//             <label className="block text-sm font-medium text-gray-700">Headline</label>
//             <input
//               type="text"
//               name="headline"
//               value={formData.headline}
//               onChange={handleChange}
//               className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//             />
//           </div>

//           <div className="md:col-span-2">
//             <label className="block text-sm font-medium text-gray-700">Skills</label>
//             <input
//               type="text"
//               name="skills"
//               value={formData.skills}
//               onChange={handleChange}
//               placeholder="Comma separated skills"
//               className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//             />
//           </div>

//           <div className="md:col-span-2">
//             <label className="block text-sm font-medium text-gray-700">Interests</label>
//             <input
//               type="text"
//               name="interests"
//               value={formData.interests}
//               onChange={handleChange}
//               placeholder="Comma separated interests"
//               className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//             />
//           </div>

//           <div className="md:col-span-2">
//             <label className="block text-sm font-medium text-gray-700">Profile Photo URL</label>
//             <input
//               type="text"
//               name="profile_picture_url"
//               value={formData.profile_picture_url}
//               onChange={handleChange}
//               placeholder="https://example.com/photo.jpg"
//               className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//             />
//           </div>

//           <div className="md:col-span-2">
//             <label className="block text-sm font-medium text-gray-700">About</label>
//             <textarea
//               name="about"
//               value={formData.about}
//               onChange={handleChange}
//               rows={4}
//               className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//             />
//           </div>
//         </div>

//         <div className="flex gap-4 pt-4">
//           <button
//             type="button"
//             onClick={() => navigate("/dashboard")}
//             className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             disabled={loading}
//             className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition disabled:bg-indigo-400"
//           >
//             {loading ? "Updating..." : "Update Profile"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }






