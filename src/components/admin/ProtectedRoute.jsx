// ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const adminToken = localStorage.getItem('adminToken');
  
  if (!adminToken) {
    return <Navigate to="/admin-login" replace />;
  }
  
  return children;
};

// ✅ Ye line important hai - default export karo
export default ProtectedRoute;