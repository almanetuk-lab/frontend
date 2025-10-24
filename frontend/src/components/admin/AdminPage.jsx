import { useState } from 'react';

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [userStatusFilter, setUserStatusFilter] = useState('pending');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);

  // Dummy data with additional fields
  const usersData = [
    { id: 1, name: 'Aman Sharma', email: 'aman@example.com', password: 'aman123', profession: 'Software Engineer', status: 'pending' },
    { id: 2, name: 'Riya Patel', email: 'riya@example.com', password: 'riya456', profession: 'Doctor', status: 'pending' },
    { id: 3, name: 'ritik', email: 'ritik@example.com', password: 'ritik789', profession: 'Student', status: 'approved' },
    { id: 4, name: 'imran', email: 'imran@example.com', password: 'imran012', profession: 'Business', status: 'onhold' },
    { id: 5, name: 'celina', email: 'celina@example.com', password: 'celina345', profession: 'Teacher', status: 'pending' },
    { id: 6, name: 'test', email: 'test@example.com', password: 'test678', profession: 'Tester', status: 'approved' },
    { id: 7, name: 'almanet', email: 'almanet@example.com', password: 'almanet901', profession: 'Developer', status: 'pending' },
  ];

  const filteredUsers = usersData.filter(user => 
    userStatusFilter === 'all' ? true : user.status === userStatusFilter
  );

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleApprove = (userId) => {
    console.log(`Approve user: ${userId}`);
    // API integration yahan aayegi
    setShowUserModal(false);
  };

  const handleReject = (userId) => {
    console.log(`Reject user: ${userId}`);
    // API integration yahan aayegi
    setShowUserModal(false);
  };

  const handleOnHold = (userId) => {
    console.log(`On Hold user: ${userId}`);
    // API integration yahan aayegi
    setShowUserModal(false);
  };

  // User Details Modal
  const UserDetailsModal = () => {
    if (!selectedUser) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          {/* Modal Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">User Details</h2>
              <button
                onClick={() => setShowUserModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
          </div>

          {/* User Information */}
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-900">{selectedUser.name}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-900">{selectedUser.email}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-900">••••••••</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Profession</label>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-900">{selectedUser.profession}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold
                    ${selectedUser.status === 'approved' ? 'bg-green-100 text-green-800' : 
                      selectedUser.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'}`}>
                    {selectedUser.status}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">User ID</label>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-900 text-sm">#{selectedUser.id}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
            <div className="flex flex-wrap gap-3 justify-end">
              <button
                onClick={() => handleOnHold(selectedUser.id)}
                className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium"
              >
                On Hold
              </button>
              <button
                onClick={() => handleReject(selectedUser.id)}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Reject
              </button>
              <button
                onClick={() => handleApprove(selectedUser.id)}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Main Content Render
  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-700">Total Users</h3>
                <p className="text-3xl font-bold text-blue-600 mt-2">{usersData.length}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-700">Pending Users</h3>
                <p className="text-3xl font-bold text-yellow-600 mt-2">
                  {usersData.filter(u => u.status === 'pending').length}
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-700">Approved Users</h3>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {usersData.filter(u => u.status === 'approved').length}
                </p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h3>
              <p className="text-gray-600">Welcome to Admin Panel. Use the sidebar to navigate.</p>
            </div>
          </div>
        );

      case 'users':
        return (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
              
              {/* Status Filter Dropdown */}
              <div className="flex gap-4">
                <select 
                  value={userStatusFilter}
                  onChange={(e) => setUserStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Users</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="onhold">On Hold</option>
                </select>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${user.status === 'approved' ? 'bg-green-100 text-green-800' : 
                            user.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-red-100 text-red-800'}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleViewDetails(user)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                          View User Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* User Details Modal */}
            {showUserModal && <UserDetailsModal />}
          </div>
        );

      // ... rest of the code (settings, logs) same as before
      case 'settings':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Settings</h1>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">System Settings</h3>
              <p className="text-gray-600">Settings content will be displayed here.</p>
            </div>
          </div>
        );

      case 'logs':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">System Logs</h1>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Activity Logs</h3>
              <p className="text-gray-600">System logs and activities will be displayed here.</p>
            </div>
          </div>
        );

      default:
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800">Welcome to Admin Panel</h1>
          </div>
        );
    }
  };

  // ... rest of the component (sidebar, header) remains same
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
        </div>
        
        <nav className="mt-6">
          <div className="px-6 py-3">
            <button
              onClick={() => setActiveSection('dashboard')}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                activeSection === 'dashboard' 
                  ? 'bg-blue-100 text-blue-600 font-semibold' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Dashboard
            </button>
          </div>
          
          <div className="px-6 py-3">
            <button
              onClick={() => setActiveSection('users')}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                activeSection === 'users' 
                  ? 'bg-blue-100 text-blue-600 font-semibold' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Users
            </button>
          </div>
          
          <div className="px-6 py-3">
            <button
              onClick={() => setActiveSection('settings')}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                activeSection === 'settings' 
                  ? 'bg-blue-100 text-blue-600 font-semibold' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Settings
            </button>
          </div>
          
          <div className="px-6 py-3">
            <button
              onClick={() => setActiveSection('logs')}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                activeSection === 'logs' 
                  ? 'bg-blue-100 text-blue-600 font-semibold' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Logs
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex justify-between items-center px-6 py-4">
            <h1 className="text-lg font-semibold text-gray-800 capitalize">
              {activeSection}
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Welcome, Admin</span>
              <button
                onClick={() => {
                  localStorage.removeItem('adminToken');
                  localStorage.removeItem('adminData');
                  window.location.href = '/admin-login';
                }}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;









