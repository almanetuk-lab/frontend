import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
   const navigate = useNavigate();

const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  try {
    //  Environment variable se
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://backend-q0wc.onrender.com';
    const response = await axios.post(
      `${API_BASE_URL}/api/admin/login`, 
      formData
    );
    
    if (response.data.status === "success") {
      localStorage.setItem('adminToken', response.data.token);
      localStorage.setItem('adminData', JSON.stringify(response.data.admin));
      navigate('/admin-dashboard');
      // window.location.href = '/admin-dashboard';
      //  window.location.href = '/admin-dashboard';
    } else {
      setError(response.data.message || 'Login failed!');
    }
    
  } catch (error) {
    console.error('Login failed:', error);
    setError('Login failed! Please check your credentials.');
  } finally {
    setLoading(false);
  }
};

const handleLogout = () => {
  try {
    // Clear all admin related data
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    sessionStorage.removeItem('adminSession');
    
    // Clear any other related storage
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('admin')) {
        localStorage.removeItem(key);
      }
    });
    
    // Force redirect to home page
    window.location.href = '/#/';
    
  } catch (error) {
    console.error('Logout error:', error);
    window.location.href = '/';
  }
};

// const handleLogout = () => {
//   // Clear admin data
//   localStorage.removeItem('adminToken');
//   localStorage.removeItem('adminData');
  
//   //  FIXED: Redirect to home page
//   window.location.href = '/'; 
  
//   setTimeout(() => {
//     window.location.reload();
//   }, 100);

  // Ya phir React Router use karo
  // navigate('/');


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white/45 to-white/100 px-4 py-8">
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

        {/*  Error Message - Ab error variable accessible hai */}
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











