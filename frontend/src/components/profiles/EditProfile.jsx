import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useUserProfile } from "../context/UseProfileContext";
import { updateUserProfile } from "../services/api";
import { uploadImage, saveProfileImage } from "../services/api";
import axios from "axios";

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
  const [imageLoading, setImageLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  
  // ✅ Camera State Variables
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);

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

      // ✅ Set current profile image preview
      if (profile.image_url && profile.image_url !== "Not provided") {
        setImagePreview(profile.image_url);
      }
    }
  }, [profile]);

  // ✅ Camera Open Handler 1111111111111
  
  const openCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 500, height: 500 } 
      });
      setStream(mediaStream);
      setShowCamera(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error("❌ Camera access error:", error);
      alert("Camera access failed. Please check permissions.");
    }
  };

  // ✅ Camera Close Handler22222222222222222
  const closeCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowCamera(false);
  };

  // ✅ Alternative Capture Photo (More Reliable)3333333333333
const capturePhoto = () => {
  if (videoRef.current && canvasRef.current) {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    // Wait for video to be fully ready
    if (video.readyState !== 4) {
      alert("Camera not ready. Please wait...");
      return;
    }
    
    // Set canvas dimensions
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw with small delay to ensure stability
    setTimeout(() => {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert to blob
      canvas.toBlob((blob) => {
        if (blob && blob.size > 1000) { // At least 1KB
          const file = new File([blob], `photo-${Date.now()}.jpg`, {
            type: 'image/jpeg'
          });
          
          const previewUrl = URL.createObjectURL(blob);
          setImagePreview(previewUrl);
          setSelectedImage(file);
          handleImageUpload(file);
          closeCamera();
        } else {
          alert("Photo capture failed. Please try again.");
          closeCamera();
        }
      }, 'image/jpeg', 0.7);
    }, 500);
  }
};

  // ✅ Cleanup on unmount44444444444
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  // ✅ Image Upload Handler (Direct Axios - TEMPORARY FIX)55555555
const handleImageUpload = async (file) => {
  if (!file) return null;
  
  setImageLoading(true);
  try {
    console.log("📤 Uploading image to Cloudinary...");

    // Step 1: Upload image to Cloudinary - CORRECT URL
    const uploadFormData = new FormData();
    uploadFormData.append("image", file);

    const uploadResponse = await axios.post("https://backend-q0wc.onrender.com/api/upload", uploadFormData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    console.log("✅ Image uploaded:", uploadResponse.data);

    // Step 2: Save image URL to profile - CORRECT URL
    const saveResponse = await axios.post("https://backend-q0wc.onrender.com/api/saveProfileImage", {
      user_id: profile.user_id,
      imageUrl: uploadResponse.data.imageUrl,
    });

    console.log("✅ Profile image saved:", saveResponse.data);

    // Update context with new profile data
    updateProfile(saveResponse.data.profiles);
    
    // Update image preview
    setImagePreview(uploadResponse.data.imageUrl);
    
    return uploadResponse.data.imageUrl;

  } catch (error) {
    console.error("❌ Image upload error:", error);
    alert("Image upload failed. Please try again.");
    return null;
  } finally {
    setImageLoading(false);
  }
};
 

  // ✅ Handle Image Selection666666666666
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      alert("Please select a valid image file (JPEG, PNG, JPG, WEBP)");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }

    setSelectedImage(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);

    // Auto-upload image
    handleImageUpload(file);
  };

  // ✅ Remove Image77777777777777

  // ✅ Remove Image with API Call
const handleRemoveImage = async () => {
  try {
    setImageLoading(true);
    
    console.log("🗑️ Removing profile image for user:", profile.user_id);

    // API call to remove profile image
    const removeResponse = await axios.post(
      "https://backend-q0wc.onrender.com/api/remove/profile-picture", 
      {
        user_id: profile.user_id
      }
    );

    console.log("✅ Image removed successfully:", removeResponse.data);

    if (removeResponse.data.message === "Profile picture removed successfully") {
      // Update frontend state
      setSelectedImage(null);
      setImagePreview("");
      
      // Update context with new profile data (without image)
      const updatedProfile = {
        ...profile,
        image_url: null,
        profile_picture_url: null,
        profilePhoto: null,
        last_updated: new Date().toISOString()
      };
      
      updateProfile(updatedProfile);
      alert("✅ Profile image removed successfully!");
    } else {
      throw new Error("Unexpected response from server");
    }

  } catch (error) {
    console.error("❌ Error removing image:", error);
    
    let errorMessage = "Failed to remove image. Please try again.";
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    alert(`❌ ${errorMessage}`);
  } finally {
    setImageLoading(false);
  }
};

  // const handleRemoveImage = () => {
  //   setSelectedImage(null);
  //   setImagePreview("");
  //   // You can also call API to remove image from profile if needed
  // };

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
      
      // ✅ FIXED: Better payload with proper null handling888888888
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
          {/* Profile Image Upload Section */}
          <Section title="Profile Picture">
            <div className="flex flex-col items-center space-y-4">
              {/* Image Preview */}
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-gray-300 overflow-hidden bg-gray-200 flex items-center justify-center">
                  {imagePreview ? (
                    <img 
                      src={imagePreview} 
                      alt="Profile preview" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-500 text-sm text-center">
                      No Image
                    </span>
                  )}
                </div>
                
                {/* Loading Indicator */}
                {imageLoading && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full">
                    <div className="text-white text-sm">Uploading...</div>
                  </div>
                )}
              </div>

              {/* Upload Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <label className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition cursor-pointer text-center">
                  Upload Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                    disabled={imageLoading}
                  />
                </label>
                
                {/* ✅ Take Photo Button Added */}
                <button
                  type="button"
                  onClick={openCamera}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  disabled={imageLoading}
                >
                  Take Photo
                </button>
                
                {imagePreview && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                    disabled={imageLoading}
                  >
                    Remove
                  </button>
                )}
              </div>

              {/* ✅ Camera Modal */}
              {showCamera && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">Take Photo</h3>
                      <button
                        onClick={closeCamera}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        ✕
                      </button>
                    </div>
                    
                    <div className="relative">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-full h-64 bg-gray-200 rounded-lg"
                      />
                      <canvas
                        ref={canvasRef}
                        className="hidden"
                      />
                    </div>
                    
                    <div className="flex justify-center gap-4 mt-4">
                      <button
                        type="button"
                        onClick={capturePhoto}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                      >
                        📸 Capture
                      </button>
                      <button
                        type="button"
                        onClick={closeCamera}
                        className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Help Text */}
              <p className="text-sm text-gray-500 text-center">
                Supported formats: JPEG, PNG, JPG, WEBP<br />
                Max size: 5MB
              </p>
            </div>
          </Section>

          {/* Rest of your existing form sections remain exactly the same */}
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
            <button type="submit" disabled={loading || imageLoading} className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50">
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Reusable Form Components (Same as before - UNCHANGED)
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



















































