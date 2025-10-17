import { useState } from 'react';
import axios from 'axios';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('YOUR_ADMIN_LOGIN_API', formData);
      
      // Save token and admin data
      localStorage.setItem('adminToken', response.data.token);
      localStorage.setItem('adminData', JSON.stringify(response.data.admin));
      
      // Redirect to admin dashboard
      window.location.href = '/admin-dashboard';
      
    } catch (error) {
      console.error('Login failed:', error);
      setError('Login failed! Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white-600  px-4 py-8">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-100">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-2xl">
              <span className="text-2xl">🔐</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
          <p className="text-gray-600 text-sm">Sign in to your administrator account</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
            <span className="text-red-500 text-lg">⚠️</span>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input 
              id="email"
              type="email" 
              placeholder="admin@example.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input 
              id="password"
              type="password" 
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Login Button */}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-600 to-amber-300 text-white py-3 px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
            <span>🔒</span>
            <p>Secure Admin Access</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;










// // AdminLogin.jsx
// import { useState } from 'react';
// import axios from 'axios';

// const AdminLogin = () => {
//   const [formData, setFormData] = useState({
//     email: '',
//     password: ''
//   });

//   const handleLogin = async (e) => {
//     e.preventDefault();
    
//     try {
//       const response = await axios.post('YOUR_ADMIN_LOGIN_API', formData);
      
//       // Save token to localStorage/sessionStorage
//       localStorage.setItem('adminToken', response.data.token);
//       localStorage.setItem('adminData', JSON.stringify(response.data.admin));
      
//       // Redirect to admin dashboard
//       window.location.href = '/admin-dashboard';
      
//     } catch (error) {
//       console.error('Login failed:', error);
//       alert('Login failed! Please check credentials.');
//     }
//   };

//   return (
//     <div className="admin-login-container">
//       <form onSubmit={handleLogin}>
//         <input 
//           type="email" 
//           placeholder="Admin Email"
//           value={formData.email}
//           onChange={(e) => setFormData({...formData, email: e.target.value})}
//         />
//         <input 
//           type="password" 
//           placeholder="Password"
//           value={formData.password}
//           onChange={(e) => setFormData({...formData, password: e.target.value})}
//         />
//         <button type="submit">Admin Login</button>
//       </form>
//     </div>
//   );
// };

// export default AdminLogin;