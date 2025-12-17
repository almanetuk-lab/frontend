import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useUserProfile } from "../context/UseProfileContext";
import { updateUserProfile } from "../services/api";
import { uploadImage, saveProfileImage } from "../services/api";
import axios from "axios";

export default function EditProfilePage() {
  const { profile, updateProfile } = useUserProfile();
  const navigate = useNavigate();

  const [showCamera, setShowCamera] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [capturedImage, setCapturedImage] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const openCamera = () => {
    console.log("Opening camera...");
    setShowCamera(true);
    setCapturedImage(null);
  };

  const closeCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
      streamRef.current = null;
    }
    setIsCameraActive(false);
    setCameraError("");
    setShowCamera(false);
  };

  const startCamera = async () => {
    try {
      setCameraError("");
      setIsCameraActive(false);

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera not supported in this browser");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        // Wait for video to load metadata
        videoRef.current.onloadedmetadata = () => {
          console.log("Video metadata loaded");
          videoRef.current
            .play()
            .then(() => {
              console.log("Camera started successfully");
              setIsCameraActive(true);
            })
            .catch((error) => {
              console.error("Video play error:", error);
              setCameraError("Failed to start video playback");
            });
        };
      }
    } catch (error) {
      console.error("Camera error:", error);
      let errorMessage = "Failed to access camera. Please try again.";

      if (error.name === "NotAllowedError") {
        errorMessage =
          "Camera permission denied. Please allow camera access in your browser settings.";
      } else if (error.name === "NotFoundError") {
        errorMessage = "No camera found on this device.";
      } else if (error.name === "NotSupportedError") {
        errorMessage = "Camera not supported in this browser.";
      } else if (error.name === "NotReadableError") {
        errorMessage = "Camera is already in use by another application.";
      }

      setCameraError(errorMessage);
      setIsCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current || !isCameraActive) {
      console.log("Cannot capture: Camera not ready");
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw current video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas to image data URL
    const imageDataUrl = canvas.toDataURL("image/png");
    console.log("Photo captured successfully");
    setCapturedImage(imageDataUrl);
    closeCamera();
  };

  const retryCamera = () => {
    setCameraError("");
    startCamera();
  };

  const useCapturedImage = () => {
    console.log("Using captured image:", capturedImage);
    // Here you can use the capturedImage for your purpose
    // For example: upload to server, set as profile picture, etc.
    alert("Photo captured successfully! You can now use it.");
  };

  // Effect to handle camera start/stop
  useEffect(() => {
    if (showCamera) {
      // Small delay to ensure DOM is updated
      const timer = setTimeout(() => {
        startCamera();
      }, 100);

      return () => clearTimeout(timer);
    } else {
      closeCamera();
    }

    return () => {
      // Cleanup on unmount
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [showCamera]);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    profession: "",
    company: "",
    experience: "",
    education: "",
    age: "",
    gender: "",
    marital_status: "",
    country: "",
    state: "",
    pincode: "",
    city: "",
    address: "",
    dob: "",
    about: "",
    skills: "",
    interests: "",
    headline: "",
  });

  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  // ✅ FIXED: Better form population with first_name and last_name handling
  useEffect(() => {
    if (profile) {
      console.log("🔄 Loading profile data into form:", profile);

      const formatDateForInput = (dateString) => {
        if (!dateString || dateString === "Not provided") return "";
        try {
          const date = new Date(dateString);
          return date.toISOString().split("T")[0];
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
        if (typeof field === "string") {
          return field;
        }
        return "";
      };

      // ✅ FIXED: Handle full_name split for backward compatibility
      let firstName = formatField(profile.first_name);
      let lastName = formatField(profile.last_name);

      // If first_name and last_name are empty but full_name exists, split it
      if ((!firstName || !lastName) && profile.full_name) {
        const fullNameParts = profile.full_name.split(" ");
        firstName = fullNameParts[0] || "";
        lastName = fullNameParts.slice(1).join(" ") || "";
      }

      setFormData({
        first_name: firstName,
        last_name: lastName,
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
        country: formatField(profile.country) || "",
        state: formatField(profile.state) || "",
        pincode: formatField(profile.pincode) || "",
        address: formatField(profile.address),
        dob: formatDateForInput(profile.dob),
        about: formatField(profile.about),
        skills: formatArrayField(profile.skills),
        interests: formatArrayField(profile.interests),
        headline: formatField(profile.headline),
      });

      // ✅ Set current profile image preview
      if (profile.image_url && profile.image_url !== "Not provided") {
        setImagePreview(profile.image_url);
      }
    }
  }, [profile]);

  // Start camera when modal opens
  useEffect(() => {
    if (showCamera) {
      startCamera();
    } else {
      closeCamera();
    }
  }, [showCamera]);

  // ✅ Image Upload Handler
  const handleImageUpload = async (file) => {
    if (!file) return null;

    setImageLoading(true);
    try {
      console.log("📤 Uploading image to Cloudinary...");

      // Step 1: Upload image to Cloudinary
      const uploadFormData = new FormData();
      uploadFormData.append("image", file);

      const uploadResponse = await axios.post(
        "https://backend-q0wc.onrender.com/api/upload",
        uploadFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("✅ Image uploaded:", uploadResponse.data);

      // Step 2: Save image URL to profile
      const saveResponse = await axios.post(
        "https://backend-q0wc.onrender.com/api/saveProfileImage",
        {
          user_id: profile.user_id,
          imageUrl: uploadResponse.data.imageUrl,
        }
      );

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

  // ✅ Handle Image Selection
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

  // ✅ Remove Image with API Call
  const handleRemoveImage = async () => {
    try {
      setImageLoading(true);

      console.log("🗑️ Removing profile image for user:", profile.user_id);

      // API call to remove profile image
      const removeResponse = await axios.post(
        "https://backend-q0wc.onrender.com/api/remove/profile-picture",
        {
          user_id: profile.user_id,
        }
      );

      console.log("✅ Image removed successfully:", removeResponse.data);

      if (
        removeResponse.data.message === "Profile picture removed successfully"
      ) {
        // Update frontend state
        setSelectedImage(null);
        setImagePreview("");

        // Update context with new profile data (without image)
        const updatedProfile = {
          ...profile,
          image_url: null,
          profile_picture_url: null,
          profilePhoto: null,
          last_updated: new Date().toISOString(),
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("🔵 Form Data Before Processing:", formData);

      // ✅ FIXED: Proper payload with first_name and last_name
      const payload = {
        // Personal Information
        first_name: formData.first_name?.trim() || "",
        last_name: formData.last_name?.trim() || "",
        email: formData.email?.trim() || "",
        phone: formData.phone?.trim() || null,
        gender: formData.gender || null,
        marital_status: formData.marital_status || null,
        city: formData.city?.trim() || null,
        country: formData.country?.trim() || null,
        state: formData.state?.trim() || null,
        pincode: formData.pincode?.trim() || null,
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
          ? formData.skills
              .split(",")
              .map((skill) => skill.trim())
              .filter((skill) => skill !== "")
          : [],
        interests: formData.interests
          ? formData.interests
              .split(",")
              .map((interest) => interest.trim())
              .filter((interest) => interest !== "")
          : [],
      };

      console.log("🎯 Final API Payload:", payload);

      // API call
      const response = await updateUserProfile(payload);
      console.log("✅ API Response:", response);

      // ✅ FIXED: Create full_name for display purposes (if needed by other components)
      const full_name = `${payload.first_name} ${payload.last_name}`.trim();

      // ✅ FIXED: Better context update with first_name and last_name
      const updatedProfile = {
        // Keep existing profile data
        ...profile,

        // Update with new data
        ...payload,

        // Add full_name for backward compatibility (if needed)
        full_name: full_name,

        // Ensure required fields
        is_submitted: true,
        last_updated: new Date().toISOString(),

        // ✅ FIXED: Ensure all fields have proper values
        first_name: payload.first_name || "",
        last_name: payload.last_name || "",
        email: payload.email || "",
        phone: payload.phone || "",
        gender: payload.gender || "",
        marital_status: payload.marital_status || "",
        city: payload.city || "",
        country: payload.country || "",
        state: payload.state || "",
        pincode: payload.pincode || "",
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
        interests: payload.interests || [],
      };

      console.log("🔄 Updating context with:", updatedProfile);
      updateProfile(updatedProfile);

      alert("Profile updated successfully!");

      // Navigate after short delay
      setTimeout(() => {
        navigate("/dashboard");
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
    return (
      value && value !== "" && value !== "Not provided" && value !== "null"
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Edit Profile</h1>
          <button
            onClick={() => navigate("/dashboard/profile")}
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

                {/* ✅ Take Photo Button Added  */}
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
                        className="text-gray-500 hover:text-gray-700 text-xl"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="relative">
                      {!isCameraActive ? (
                        <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                          <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-2"></div>
                            <p className="text-gray-600">Starting camera...</p>
                          </div>
                        </div>
                      ) : (
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          muted
                          className="w-full h-64 bg-gray-200 rounded-lg object-cover"
                        />
                      )}
                      <canvas ref={canvasRef} className="hidden" />
                    </div>

                    <div className="flex justify-center gap-4 mt-4">
                      <button
                        type="button"
                        onClick={capturePhoto}
                        disabled={!isCameraActive}
                        className={`px-6 py-2 text-white rounded-lg transition flex items-center gap-2 ${
                          isCameraActive
                            ? "bg-indigo-600 hover:bg-indigo-700"
                            : "bg-gray-400 cursor-not-allowed"
                        }`}
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

                    {/* Camera Error Message */}
                    {cameraError && (
                      <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg">
                        <p className="text-red-700 text-sm">{cameraError}</p>
                        <button
                          onClick={retryCamera}
                          className="mt-2 text-red-600 hover:text-red-800 text-sm underline"
                        >
                          Retry Camera
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Help Text */}
              <p className="text-sm text-gray-500 text-center">
                Supported formats: JPEG, PNG, JPG, WEBP
                <br />
                Max size: 5MB
              </p>
            </div>
          </Section>

          {/* Rest of your existing form sections remain exactly the same */}
          <Section title="Personal Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* <FormField 
                label="Full Name *" 
                name="full_name" 
                value={formData.full_name} 
                onChange={handleChange} 
                required 
              />  */}

              <FormField
                label="First Name "
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
              />

              <FormField
                label="Last Name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
              />

              <FormField
                label="Country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="Enter your country"
              />
              <FormField
                label="State"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="Enter your state"
              />
              <FormField
                label="Pincode"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                placeholder="Enter pincode"
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
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || imageLoading}
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

// Reusable Form Components (Same as before - UNCHANGED)
function Section({ title, children }) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      {children}
    </div>
  );
}

function FormField({
  label,
  name,
  type = "text",
  value,
  onChange,
  required = false,
  placeholder = "",
}) {
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

function TextAreaField({
  label,
  name,
  value,
  onChange,
  rows = 3,
  placeholder = "",
}) {
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
        {options.map((option) => (
          <option key={option} value={option}>
            {option || `Select ${label}`}
          </option>
        ))}
      </select>
    </div>
  );
}
