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
    address: "",
    dob: "",
    about: "",
    skills: "",
    interests: "",
    headline: ""
  });

  const [loading, setLoading] = useState(false);

  // ✅ FIXED: Better form population
  useEffect(() => {
    if (profile) {
      console.log("🔄 Loading profile data into form:", profile);
      
      const formatDateForInput = (dateString) => {
        if (!dateString || dateString === "Not provided") return "";
        try {
          const date = new Date(dateString);
          return date.toISOString().split('T')[0];
        } catch (error) {
          return "";
        }
      };

      // ✅ FIXED: Handle "Not provided" and empty values properly
      const formatField = (value) => {
        if (!value || value === "Not provided" || value === "null") return "";
        return value;
      };

      // ✅ FIXED: Handle array fields properly
      const formatArrayField = (field) => {
        if (!field || field === "Not provided") return "";
        if (Array.isArray(field)) {
          return field.join(", ");
        }
        if (typeof field === 'string') {
          return field;
        }
        return "";
      };

      setFormData({
        full_name: formatField(profile.full_name),
        email: formatField(profile.email),
        phone: formatField(profile.phone),
        profession: formatField(profile.profession),
        company: formatField(profile.company),
        experience: formatField(profile.experience),
        education: formatField(profile.education),
        age: formatField(profile.age),
        gender: formatField(profile.gender),
        marital_status: formatField(profile.marital_status),
        city: formatField(profile.city),
        address: formatField(profile.address),
        dob: formatDateForInput(profile.dob),
        about: formatField(profile.about),
        skills: formatArrayField(profile.skills),
        interests: formatArrayField(profile.interests),
        headline: formatField(profile.headline)
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      console.log("🔵 Form Data Before Processing:", formData);
      
      // ✅ FIXED: Better payload with proper null handling
      const payload = {
        // Personal Information
        full_name: formData.full_name?.trim() || "",
        email: formData.email?.trim() || "",
        phone: formData.phone?.trim() || null,
        gender: formData.gender || null,
        marital_status: formData.marital_status || null,
        city: formData.city?.trim() || null,
        address: formData.address?.trim() || null,
        dob: formData.dob || null,
        age: formData.age ? parseInt(formData.age) : null,
        
        // Professional Information
        profession: formData.profession?.trim() || null,
        company: formData.company?.trim() || null,
        experience: formData.experience ? parseInt(formData.experience) : null,
        education: formData.education?.trim() || null,
        headline: formData.headline?.trim() || null,
        
        // Additional Information
        about: formData.about?.trim() || null,
        skills: formData.skills 
          ? formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill !== "")
          : [],
        interests: formData.interests 
          ? formData.interests.split(',').map(interest => interest.trim()).filter(interest => interest !== "")
          : []
      };

      console.log("🎯 Final API Payload:", payload);

      // API call
      const response = await updateUserProfile(payload);
      console.log("✅ API Response:", response);

      // ✅ FIXED: Better context update with ALL fields
      const updatedProfile = {
        // Keep existing profile data
        ...profile,
        
        // Update with new data
        ...payload,
        
        // Ensure required fields
        is_submitted: true,
        last_updated: new Date().toISOString(),
        
        // ✅ FIXED: Ensure all fields have proper values (not "Not provided")
        full_name: payload.full_name || "",
        email: payload.email || "",
        phone: payload.phone || "",
        gender: payload.gender || "",
        marital_status: payload.marital_status || "",
        city: payload.city || "",
        address: payload.address || "",
        dob: payload.dob || "",
        age: payload.age || "",
        profession: payload.profession || "",
        company: payload.company || "",
        experience: payload.experience || "",
        education: payload.education || "",
        headline: payload.headline || "",
        about: payload.about || "",
        skills: payload.skills || [],
        interests: payload.interests || []
      };

      console.log("🔄 Updating context with:", updatedProfile);
      updateProfile(updatedProfile);
      
      alert("Profile updated successfully!");
      
      // Navigate after short delay
      setTimeout(() => {
        navigate("/profile");
      }, 1000);
      
    } catch (error) {
      console.error("❌ Profile update error:", error);
      console.error("❌ Error details:", error.response?.data);
      
      let errorMessage = "Failed to update profile. Please try again.";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Helper function to check if field has value
  const hasValue = (value) => {
    return value && value !== "" && value !== "Not provided" && value !== "null";
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
                label="Full Name *" 
                name="full_name" 
                value={formData.full_name} 
                onChange={handleChange} 
                required 
              />
              <FormField 
                label="Email *" 
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
                placeholder="+91 1234567890" 
              />
              <FormField 
                label="Date of Birth" 
                name="dob" 
                type="date" 
                value={formData.dob} 
                onChange={handleChange} 
              />
              <FormField 
                label="Age" 
                name="age" 
                type="number" 
                value={formData.age} 
                onChange={handleChange} 
                placeholder="25" 
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
                placeholder="New Delhi" 
              />
            </div>
            
            <div className="mt-4">
              <TextAreaField 
                label="Address" 
                name="address" 
                value={formData.address} 
                onChange={handleChange} 
                rows={3} 
                placeholder="Enter your complete address" 
              />
            </div>
          </Section>

          {/* Professional Information */}
          <Section title="Professional Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField 
                label="Headline" 
                name="headline" 
                value={formData.headline} 
                onChange={handleChange} 
                placeholder="Senior Software Engineer at Google" 
              />
              <FormField 
                label="Profession" 
                name="profession" 
                value={formData.profession} 
                onChange={handleChange} 
                placeholder="Software Engineer" 
              />
              <FormField 
                label="Company" 
                name="company" 
                value={formData.company} 
                onChange={handleChange} 
                placeholder="Google Inc." 
              />
              <FormField 
                label="Experience (years)" 
                name="experience" 
                type="number" 
                value={formData.experience} 
                onChange={handleChange} 
                placeholder="3" 
              />
              <FormField 
                label="Education" 
                name="education" 
                value={formData.education} 
                onChange={handleChange} 
                placeholder="Bachelor of Technology" 
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
              placeholder="Tell us about yourself, your background, and your interests..." 
            />
          </Section>

          <Section title="Skills & Interests">
            <TextAreaField 
              label="Skills" 
              name="skills" 
              value={formData.skills} 
              onChange={handleChange} 
              rows={3} 
              placeholder="JavaScript, React, Node.js, Python (separate with commas)" 
            />
            <TextAreaField 
              label="Interests" 
              name="interests" 
              value={formData.interests} 
              onChange={handleChange} 
              rows={3} 
              placeholder="Coding, Reading, Travel, Photography (separate with commas)" 
            />
          </Section>

          {/* Submit Buttons */}
          <div className="flex justify-center gap-4 pt-6 border-t">
            <button type="button" onClick={() => navigate("/profile")} className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50">
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Reusable Form Components (Same as before)
function Section({ title, children }) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      {children}
    </div>
  );
}

function FormField({ label, name, type = "text", value, onChange, required = false, placeholder = "" }) {
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
        placeholder={placeholder}
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
// import { updateUserProfile } from "../services/api";

// export default function EditProfilePage() {
//   const { profile, updateProfile } = useUserProfile();
//   const navigate = useNavigate();
  
//   const [formData, setFormData] = useState({
//     full_name: "",
//     email: "",
//     phone: "",
//     profession: "",
//     company: "",
//     experience: "",
//     education: "",
//     age: "",
//     gender: "",
//     marital_status: "",
//     city: "",
//     address: "",
//     dob: "",
//     about: "",
//     skills: "",
//     interests: "",
//     headline: ""
//   });

//   const [loading, setLoading] = useState(false);

//   // Populate form with existing profile data
//   useEffect(() => {
//     if (profile) {
//       console.log("🔄 Loading profile data into form:", profile);
      
//       const formatDateForInput = (dateString) => {
//         if (!dateString) return "";
//         try {
//           const date = new Date(dateString);
//           return date.toISOString().split('T')[0];
//         } catch (error) {
//           return "";
//         }
//       };

//       setFormData({
//         full_name: profile.full_name || "",
//         email: profile.email || "",
//         phone: profile.phone || "",
//         profession: profile.profession || "",
//         company: profile.company || "",
//         experience: profile.experience || "",
//         education: profile.education || "",
//         age: profile.age || "",
//         gender: profile.gender || "",
//         marital_status: profile.marital_status || "",
//         city: profile.city || "",
//         address: profile.address || "",
//         dob: formatDateForInput(profile.dob),
//         about: profile.about || "",
//         skills: Array.isArray(profile.skills) ? profile.skills.join(", ") : (profile.skills || ""),
//         interests: Array.isArray(profile.interests) ? profile.interests.join(", ") : (profile.interests || ""),
//         headline: profile.headline || ""
//       });
//     }
//   }, [profile]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };
// const handleSubmit = async (e) => {
//   e.preventDefault();
//   setLoading(true);
  
//   try {
//     console.log("🔵 Form Data Before Processing:", formData);
    
//     // **FIX: Proper payload structure**
//     const payload = {
//       full_name: formData.full_name?.trim() || "",
//       email: formData.email?.trim() || "",
//       phone: formData.phone?.trim() || null,
//       gender: formData.gender || null,
//       marital_status: formData.marital_status || null,
//       city: formData.city?.trim() || null,
//       address: formData.address?.trim() || null,
//       dob: formData.dob || null,
//       age: formData.age ? parseInt(formData.age) : null,
//       profession: formData.profession?.trim() || null,
//       company: formData.company?.trim() || null,
//       experience: formData.experience ? parseInt(formData.experience) : null,
//       education: formData.education?.trim() || null,
//       headline: formData.headline?.trim() || null,
//       about: formData.about?.trim() || null,
//       skills: formData.skills 
//         ? formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill !== "")
//         : [],
//       interests: formData.interests 
//         ? formData.interests.split(',').map(interest => interest.trim()).filter(interest => interest !== "")
//         : []
//     };

//     console.log("🎯 Final API Payload:", payload);

//     // API call
//     const response = await updateUserProfile(payload);
//     console.log("✅ API Response:", response);

//     // **FIX: Context update - merge with existing profile**
//     const updatedProfile = {
//       ...profile, // existing data
//       ...payload, // new data
//       is_submitted: true,
//       updated_at: new Date().toISOString()
//     };

//     console.log("🔄 Updating context with merged profile:", updatedProfile);
//     updateProfile(updatedProfile);
    
//     alert("Profile updated successfully!");
    
//     // Navigate after short delay
//     setTimeout(() => {
//       navigate("/profile");
//     }, 1000);
    
//   } catch (error) {
//     console.error("❌ Profile update error:", error);
//     console.error("❌ Error details:", error.response?.data);
    
//     let errorMessage = "Failed to update profile. Please try again.";
//     if (error.response?.data?.message) {
//       errorMessage = error.response.data.message;
//     } else if (error.response?.data?.error) {
//       errorMessage = error.response.data.error;
//     }
//     alert(errorMessage);
//   } finally {
//     setLoading(false);
//   }
// };
//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-8">
//           <h1 className="text-2xl font-bold text-gray-800">Edit Profile</h1>
//           <button
//             onClick={() => navigate("/profile")}
//             className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
//           >
//             Cancel
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-8">
//           {/* Personal Information */}
//           <Section title="Personal Information">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <FormField label="Full Name *" name="full_name" value={formData.full_name} onChange={handleChange} required />
//               <FormField label="Email *" name="email" type="email" value={formData.email} onChange={handleChange} required />
//               <FormField label="Phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 1234567890" />
//               <FormField label="Date of Birth" name="dob" type="date" value={formData.dob} onChange={handleChange} />
//               <FormField label="Age" name="age" type="number" value={formData.age} onChange={handleChange} placeholder="25" />
//               <SelectField label="Gender" name="gender" value={formData.gender} onChange={handleChange} options={["", "Male", "Female", "Other"]} />
//               <SelectField label="Marital Status" name="marital_status" value={formData.marital_status} onChange={handleChange} options={["", "Single", "Married", "Divorced", "Widowed"]} />
//               <FormField label="City" name="city" value={formData.city} onChange={handleChange} placeholder="New Delhi" />
//             </div>
            
//             <div className="mt-4">
//               <TextAreaField label="Address" name="address" value={formData.address} onChange={handleChange} rows={3} placeholder="Enter your complete address" />
//             </div>
//           </Section>

//           {/* Professional Information */}
//           <Section title="Professional Information">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <FormField label="Profession" name="profession" value={formData.profession} onChange={handleChange} placeholder="Software Engineer" />
//               <FormField label="Company" name="company" value={formData.company} onChange={handleChange} placeholder="Google Inc." />
//               <FormField label="Experience (years)" name="experience" type="number" value={formData.experience} onChange={handleChange} placeholder="3" />
//               <FormField label="Education" name="education" value={formData.education} onChange={handleChange} placeholder="Bachelor of Technology" />
//               <FormField label="Headline" name="headline" value={formData.headline} onChange={handleChange} placeholder="Senior Software Engineer at Google" />
//             </div>
//           </Section>

//           {/* About & Skills */}
//           <Section title="About Me">
//             <TextAreaField label="About Yourself" name="about" value={formData.about} onChange={handleChange} rows={4} placeholder="Tell us about yourself, your background, and your interests..." />
//           </Section>

//           <Section title="Skills & Interests">
//             <TextAreaField label="Skills" name="skills" value={formData.skills} onChange={handleChange} rows={3} placeholder="JavaScript, React, Node.js, Python (separate with commas)" />
//             <TextAreaField label="Interests" name="interests" value={formData.interests} onChange={handleChange} rows={3} placeholder="Coding, Reading, Travel, Photography (separate with commas)" />
//           </Section>

//           {/* Submit Buttons */}
//           <div className="flex justify-center gap-4 pt-6 border-t">
//             <button type="button" onClick={() => navigate("/profile")} className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition">
//               Cancel
//             </button>
//             <button type="submit" disabled={loading} className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50">
//               {loading ? "Saving..." : "Save Changes"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// // Reusable Form Components
// function Section({ title, children }) {
//   return (
//     <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
//       <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
//       {children}
//     </div>
//   );
// }

// function FormField({ label, name, type = "text", value, onChange, required = false, placeholder = "" }) {
//   return (
//     <div>
//       <label className="block text-sm font-semibold text-gray-700 mb-2">
//         {label}
//         {required && <span className="text-red-500 ml-1">*</span>}
//       </label>
//       <input
//         type={type}
//         name={name}
//         value={value}
//         onChange={onChange}
//         placeholder={placeholder}
//         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//         required={required}
//       />
//     </div>
//   );
// }

// function TextAreaField({ label, name, value, onChange, rows = 3, placeholder = "" }) {
//   return (
//     <div>
//       <label className="block text-sm font-semibold text-gray-700 mb-2">
//         {label}
//       </label>
//       <textarea
//         name={name}
//         value={value}
//         onChange={onChange}
//         rows={rows}
//         placeholder={placeholder}
//         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//       />
//     </div>
//   );
// }

// function SelectField({ label, name, value, onChange, options }) {
//   return (
//     <div>
//       <label className="block text-sm font-semibold text-gray-700 mb-2">
//         {label}
//       </label>
//       <select
//         name={name}
//         value={value}
//         onChange={onChange}
//         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//       >
//         {options.map(option => (
//           <option key={option} value={option}>
//             {option || `Select ${label}`}
//           </option>
//         ))}
//       </select>
//     </div>
//   );
// }


































