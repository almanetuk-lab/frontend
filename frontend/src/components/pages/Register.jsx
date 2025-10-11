
/* src/pages/Register.jsx */
import React, { useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/api";

export default function Register() {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    profession: "",
    interests: "",
    marital_status: "Single",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Input change handle
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Submit handler (Axios se API connect)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const dataToSend = {
        full_name: formData.full_name,
        email: formData.email,
        password: formData.password,
        profession: formData.profession,
        interests: formData.interests
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        marital_status: formData.marital_status,
      };

      // 🔗 Axios API call
      const response = await registerUser(dataToSend);

      console.log("Registration Response:", response);

      if (response?.user) {
        setUser(response.user);
        navigate("/dashboard");
      } else {
        setError(response?.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      console.error("Registration Error:", err);
      const errorMessage =
        err.response?.data?.message || "Something went wrong!";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-semibold mb-6 text-center text-indigo-700">
          Create Your Account
        </h2>

        {error && <div className="text-red-500 mb-4 text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="full_name" className="block text-sm text-gray-600">Full Name</label>
            <input type="text" id="full_name" name="full_name" value={formData.full_name} onChange={handleChange} placeholder="Enter your full name" required className="block w-full mt-1 p-2 border rounded focus:ring-indigo-500 focus:border-indigo-500"/>
          </div>
          <div>
            <label htmlFor="email" className="block text-sm text-gray-600">Email</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" required className="block w-full mt-1 p-2 border rounded focus:ring-indigo-500 focus:border-indigo-500"/>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm text-gray-600">Password</label>
            <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} placeholder="Enter a strong password" required className="block w-full mt-1 p-2 border rounded focus:ring-indigo-500 focus:border-indigo-500"/>
          </div>
          <div>
            <label htmlFor="profession" className="block text-sm text-gray-600">Profession</label>
            <input type="text" id="profession" name="profession" value={formData.profession} onChange={handleChange} placeholder="E.g. Software Engineer, Doctor, Teacher..." className="block w-full mt-1 p-2 border rounded focus:ring-indigo-500 focus:border-indigo-500"/>
          </div>
          <div>
            <label htmlFor="interests" className="block text-sm text-gray-600">Interests (comma-separated)</label>
            <input type="text" id="interests" name="interests" value={formData.interests} onChange={handleChange} placeholder="E.g. Coding, Reading, Travelling..." className="block w-full mt-1 p-2 border rounded focus:ring-indigo-500 focus:border-indigo-500"/>
          </div>
          <div>
            <label htmlFor="marital_status" className="block text-sm text-gray-600">Marital Status</label>
            <select id="marital_status" name="marital_status" value={formData.marital_status} onChange={handleChange} className="block w-full mt-1 p-2 border rounded focus:ring-indigo-500 focus:border-indigo-500">
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Divorced">Divorced</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <button type="submit" className="w-full px-4 py-2 bg-indigo-600 text-white rounded mt-4 hover:bg-indigo-700 transition" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <p className="text-sm text-gray-600 mt-4 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}
































// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { registerUser } from "../services/api"; // api.js se import
// import { useAuth } from "../context/AuthProvider"; 

// export default function Register() {
//   const navigate = useNavigate();
//   const { setUser } = useAuth(); 

//   const [formData, setFormData] = useState({
//     full_name: "",
//     email: "",
//     password: "",
//     profession: "",
//     interests: "",
//     marital_status: "Single",
//   });

// /   const [formData, setFormData] = useState({
//     full_name: "", // Back-end expectation: full_name
//     email: "",
//     password: "",
//     profession: "",
//     interests: "", // इसे एक स्ट्रिंग के रूप में लेंगे और भेजने से पहले array में बदलेंगे
//     marital_status: "Single", // Back-end expectation: marital_status
//   });


  // const [error, setError] = useState("");
  // const [loading, setLoading] = useState(false);

  // // ✅ Input change handle
  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prev) => ({ ...prev, [name]: value }));
  // };

  // // ✅ Submit handler (Axios se API connect)
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setError("");
  //   setLoading(true);

  //   try {
  //     const dataToSend = {
  //       full_name: formData.full_name,
  //       email: formData.email,
  //       password: formData.password,
  //       profession: formData.profession,
  //       interests: formData.interests
  //         .split(",")
  //         .map((item) => item.trim())
  //         .filter(Boolean),
  //       marital_status: formData.marital_status,
  //     };

  //     // 🔗 Axios API call
  //     const response = await registerUser(dataToSend);

  //     console.log("Registration Response:", response);

  //     if (response?.user) {
  //       setUser(response.user);
  //       navigate("/dashboard");
  //     } else {
  //       setError(response?.message || "Registration failed. Please try again.");
  //     }
  //   } catch (err) {
  //     console.error("Registration Error:", err);
  //     const errorMessage =
  //       err.response?.data?.message || "Something went wrong!";
  //     setError(errorMessage);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

//   return (
//     <form onSubmit={handleSubmit} className="p-6 space-y-4">
//       <input
//         name="full_name"
//         onChange={handleChange}
//         placeholder="Full Name"
//         value={formData.full_name}
//       />
//       <input
//         name="email"
//         type="email"
//         onChange={handleChange}
//         placeholder="Email"
//         value={formData.email}
//       />
//       <input
//         name="password"
//         type="password"
//         onChange={handleChange}
//         placeholder="Password"
//         value={formData.password}
//       />
//       <input
//         name="profession"
//         onChange={handleChange}
//         placeholder="Profession"
//         value={formData.profession}
//       />
//       <input
//         name="interests"
//         onChange={handleChange}
//         placeholder="Interests (comma separated)"
//         value={formData.interests}
//       />
//       <select
//         name="marital_status"
//         onChange={handleChange}
//         value={formData.marital_status}
//       >
//         <option value="Single">Single</option>
//         <option value="Married">Married</option>
//       </select>

//       <button
//         type="submit"
//         disabled={loading}
//         className="bg-blue-600 text-white py-2 px-4 rounded"
//       >
//         {loading ? "Registering..." : "Register"}
//       </button>

//       {error && <p className="text-red-500">{error}</p>}
//     </form>
//   );
// }



























































// /* src/pages/Register.jsx */
// import React, { useState } from "react";
// import { useAuth } from "../context/Authprovider";
// import { useNavigate, Link } from "react-router-dom";
// import { registerUser } from "../services/api"; // आपकी API सेवा इम्पोर्ट करें

// export default function Register() {
//   const { setUser } = useAuth(); // केवल setUser की आवश्यकता है अगर register logic api से आ रहा है
//   const navigate = useNavigate();

//   // Postman request body के अनुसार formData को अपडेट करें
//   const [formData, setFormData] = useState({
//     full_name: "", // Back-end expectation: full_name
//     email: "",
//     password: "",
//     profession: "",
//     interests: "", // इसे एक स्ट्रिंग के रूप में लेंगे और भेजने से पहले array में बदलेंगे
//     marital_status: "Single", // Back-end expectation: marital_status
//   });

//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false); // लोडिंग स्टेट ऐड करें

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };


// const handleSubmit = async (e) => {
//   e.preventDefault();
//   setError("");

//   try {
//     const data = await registerUser(formData);
//     if (data.success) {
//       setUser(data.user);
//       navigate("/dashboard");
//     } else {
//       setError(data.message || "Registration failed");
//     }
//   } catch (err) {
//     // debug info
//     console.error("Register error:", err);
//     // agar backend detailed error bheje to show karo
//     setError(err.message || err.error || "Something went wrong!");
//   }
// };



//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();
//   //   setError("");
//   //   setLoading(true); // सबमिट पर लोडिंग शुरू करें

//   //   try {
//   //     // formData को बैकएंड के अपेक्षित फॉर्मेट में बदलना
//   //     const dataToSend = {
//   //       full_name: formData.full_name,
//   //       email: formData.email,
//   //       password: formData.password,
//   //       profession: formData.profession,
//   //       // 'interests' स्ट्रिंग को कॉमा से स्प्लिट करके एक array में बदलें, फिर हर आइटम से whitespace हटाएँ
//   //       interests: formData.interests
//   //         .split(",")
//   //         .map((item) => item.trim())
//   //         .filter(Boolean), // खाली स्ट्रिंग्स को हटाएँ
//   //       marital_status: formData.marital_status,
//   //     };

//   //     const response = await registerUser(dataToSend); // API कॉल को अपडेटेड डेटा के साथ करें
//   //     console.log("Registration Response:", response);

//   //     if (response.user) {
//   //       // अगर API response में user ऑब्जेक्ट है तो सफल
//   //       setUser(response.user); // context me user set karein
//   //       navigate("/dashboard"); // अब dashboard पर रीडायरेक्ट करें
//   //     } else {
//   //       // अगर API response में user ऑब्जेक्ट नहीं है लेकिन success: false या कोई अन्य एरर मैसेज है
//   //       setError(response.message || "Registration failed. Please try again.");
//   //     }
//   //   } catch (err) {
//   //     // API से आया हुआ एरर हैंडल करें
//   //     const errorMessage = err.message || "Something went wrong!";
//   //     setError(errorMessage);
//   //     console.error("Registration Error:", err);
//   //   } finally {
//   //     setLoading(false); // लोडिंग खत्म करें चाहे सफल हो या विफल
//   //   }
//   // };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
//       <div className="max-w-md w-full bg-white p-8 rounded shadow">
//         <h2 className="text-2xl font-semibold mb-6 text-center text-indigo-700">
//           Create Your Account
//         </h2>

//         {error && <div className="text-red-500 mb-4 text-center">{error}</div>}

//         <form onSubmit={handleSubmit} className="space-y-4">
//           {/* Full Name */}
//           <div>
//             <label htmlFor="full_name" className="block text-sm text-gray-600">
//               Full Name
//             </label>
//             <input
//               type="text"
//               id="full_name" // id ऐड करें
//               name="full_name" // name को 'full_name' में बदलें
//               value={formData.full_name}
//               onChange={handleChange}
//               placeholder="Enter your full name"
//               required
//               className="block w-full mt-1 p-2 border rounded focus:ring-indigo-500 focus:border-indigo-500"
//             />
//           </div>

//           {/* Email */}
//           <div>
//             <label htmlFor="email" className="block text-sm text-gray-600">
//               Email
//             </label>
//             <input
//               type="email"
//               id="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               placeholder="Enter your email"
//               required
//               className="block w-full mt-1 p-2 border rounded focus:ring-indigo-500 focus:border-indigo-500"
//             />
//           </div>

//           {/* Password */}
//           <div>
//             <label htmlFor="password" className="block text-sm text-gray-600">
//               Password
//             </label>
//             <input
//               type="password"
//               id="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               placeholder="Enter a strong password"
//               required
//               className="block w-full mt-1 p-2 border rounded focus:ring-indigo-500 focus:border-indigo-500"
//             />
//           </div>

//           {/* Profession */}
//           <div>
//             <label
//               htmlFor="profession"
//               className="block text-sm text-gray-600"
//             >
//               Profession
//             </label>
//             <input
//               type="text"
//               id="profession"
//               name="profession"
//               value={formData.profession}
//               onChange={handleChange}
//               placeholder="E.g. Software Engineer, Doctor, Teacher..."
//               className="block w-full mt-1 p-2 border rounded focus:ring-indigo-500 focus:border-indigo-500"
//             />
//           </div>

//           {/* Interests */}
//           <div>
//             <label htmlFor="interests" className="block text-sm text-gray-600">
//               Interests (comma-separated)
//             </label>
//             <input
//               type="text"
//               id="interests"
//               name="interests" // name को 'interests' में बदलें
//               value={formData.interests}
//               onChange={handleChange}
//               placeholder="E.g. Coding, Reading, Travelling..."
//               className="block w-full mt-1 p-2 border rounded focus:ring-indigo-500 focus:border-indigo-500"
//             />
//           </div>

//           {/* Marital Status Dropdown */}
//           <div>
//             <label
//               htmlFor="marital_status"
//               className="block text-sm text-gray-600"
//             >
//               Marital Status
//             </label>
//             <select
//               id="marital_status"
//               name="marital_status" // name को 'marital_status' में बदलें
//               value={formData.marital_status}
//               onChange={handleChange}
//               className="block w-full mt-1 p-2 border rounded focus:ring-indigo-500 focus:border-indigo-500"
//             >
//               <option value="Single">Single</option>
//               <option value="Married">Married</option>
//               <option value="Divorced">Divorced</option>
//               <option value="Other">Other</option>
//             </select>
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             className="w-full px-4 py-2 bg-indigo-600 text-white rounded mt-4 hover:bg-indigo-700 transition"
//             disabled={loading} // लोडिंग के दौरान बटन को डिसेबल करें
//           >
//             {loading ? "Registering..." : "Register"}
//           </button>
//         </form>

//         <p className="text-sm text-gray-600 mt-4 text-center">
//           Already have an account?{" "}
//           <Link to="/login" className="text-indigo-600 hover:underline">
//             Login
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }


















// /* src/pages/Register.jsx */
// import React, { useState } from "react";
// import { useAuth } from "../context/Authprovider";
// import { useNavigate, Link } from "react-router-dom";
// // import { registerUser } from "../services/api";
// import { registerUser } from "../services/api";

// export default function Register() {
//   const { register, setUser } = useAuth(); // setUser hook add karein taake user context update ho
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     fullName: "",
//     email: "",
//     password: "",
//     profession: "",
//     interest: "",
//     status: "Single",
//   });

//   const [error, setError] = useState("");

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

// // axois se connet wala handleSubmit hai 

// const handleSubmit = async (e) => {
//   e.preventDefault();
//   setError("");

//   try {
//     const data = await registerUser(formData); // API call
//     if (data.success) {
//       setUser(data.user);
//       navigate("/dashboard");
//     } else {
//       setError(data.message || "Registration failed");
//     }
//   } catch (err) {
//     setError(err.message || "Something went wrong!");
//   }
// };


//   // const handleSubmit = (e) => {
//   //   e.preventDefault();

//   //   const { email, password } = formData;
//   //   const registeredUser = register(email, password); // register function backend / context se

//   //   if (registeredUser) {
//   //     setUser({ ...registeredUser, profile: null }); // context me user set karein
//   //     navigate("/dashboard"); // ab dashboard redirect
//   //   } else {
//   //     setError("User already exists");
//   //   }
//   // };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
//       <div className="max-w-md w-full bg-white p-8 rounded shadow">
//         <h2 className="text-2xl font-semibold mb-6 text-center text-indigo-700">
//           Create Your Account
//         </h2>

//         {error && <div className="text-red-500 mb-4 text-center">{error}</div>}

//         <form onSubmit={handleSubmit} className="space-y-4">
//           {/* Full Name */}
//           <div>
//             <label className="block text-sm text-gray-600">Full Name</label>
//             <input
//               type="text"
//               name="fullName"
//               value={formData.fullName}
//               onChange={handleChange}
//               placeholder="Enter your full name"
//               required
//               className="block w-full mt-1 p-2 border rounded focus:ring-indigo-500 focus:border-indigo-500"
//             />
//           </div>

//           {/* Email */}
//           <div>
//             <label className="block text-sm text-gray-600">Email</label>
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               placeholder="Enter your email"
//               required
//               className="block w-full mt-1 p-2 border rounded focus:ring-indigo-500 focus:border-indigo-500"
//             />
//           </div>

//           {/* Password */}
//           <div>
//             <label className="block text-sm text-gray-600">Password</label>
//             <input
//               type="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               placeholder="Enter a strong password"
//               required
//               className="block w-full mt-1 p-2 border rounded focus:ring-indigo-500 focus:border-indigo-500"
//             />
//           </div>

//           {/* Profession */}
//           <div>
//             <label className="block text-sm text-gray-600">Profession</label>
//             <input
//               type="text"
//               name="profession"
//               value={formData.profession}
//               onChange={handleChange}
//               placeholder="E.g. Software Engineer, Doctor, Teacher..."
//               className="block w-full mt-1 p-2 border rounded focus:ring-indigo-500 focus:border-indigo-500"
//             />
//           </div>

//           {/* Interest */}
//           <div>
//             <label className="block text-sm text-gray-600">Interests</label>
//             <input
//               type="text"
//               name="interest"
//               value={formData.interest}
//               onChange={handleChange}
//               placeholder="E.g. Coding, Reading, Travelling..."
//               className="block w-full mt-1 p-2 border rounded focus:ring-indigo-500 focus:border-indigo-500"
//             />
//           </div>

//           {/* Marital Status Dropdown */}
//           <div>
//             <label className="block text-sm text-gray-600">Marital Status</label>
//             <select
//               name="status"
//               value={formData.status}
//               onChange={handleChange}
//               className="block w-full mt-1 p-2 border rounded focus:ring-indigo-500 focus:border-indigo-500"
//             >
//               <option value="Single">Single</option>
//               <option value="Married">Married</option>
//               <option value="Divorced">Divorced</option>
//               <option value="Other">Other</option>
//             </select>
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             className="w-full px-4 py-2 bg-indigo-600 text-white rounded mt-4 hover:bg-indigo-700 transition"
//           >
//             Register
//           </button>
//         </form>

//         <p className="text-sm text-gray-600 mt-4 text-center">
//           Already have an account?{" "}
//           <Link to="/login" className="text-indigo-600 hover:underline">
//             Login
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }





