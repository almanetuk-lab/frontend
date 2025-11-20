import { useState, useEffect } from 'react';
import { adminAPI } from '../services/adminApi';
import AdminPlans from './AdminAllPlan.jsx';

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [userStatusFilter, setUserStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [usersData, setUsersData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userDetailsLoading, setUserDetailsLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [plans, setPlans] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false); // New state for mobile sidebar

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getUsers();
      
      if (response.data.status === "success") {
        let dataToUse = [];
        
        if (response.data.userDetails && response.data.userDetails.length > 0) {
          dataToUse = response.data.userDetails;
        } else if (response.data.users && response.data.users.length > 0) {
          dataToUse = response.data.users;
        }
        
        // Normalize status to lowercase for consistency
        const usersWithNormalizedStatus = dataToUse.map(user => ({
          ...user,
          status: (user.status || user.current_status || 'in process').toLowerCase(),
          current_status: (user.current_status || user.status || 'in process').toLowerCase()
        }));
        
        setUsersData(usersWithNormalizedStatus);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('Error fetching users: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const fetchUserDetails = async (userId) => {
    try {
      setUserDetailsLoading(true);
      const response = await adminAPI.getUserDetails(userId);
      
      if (response.data.status === "success") {
        const userData = response.data.user;
        // Normalize status for detailed user as well
        const normalizedUser = {
          ...userData,
          status: (userData.status || userData.current_status || 'in process').toLowerCase(),
          current_status: (userData.current_status || userData.status || 'in process').toLowerCase()
        };
        setSelectedUser(normalizedUser);
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      alert('Error fetching user details: ' + (error.response?.data?.message || error.message));
    } finally {
      setUserDetailsLoading(false);
    }
  };

  // Filter users based on status
  const filteredUsers = usersData.filter(user => {
    if (userStatusFilter === 'all') return true;
    return user.status === userStatusFilter;
  });

  const handleViewDetails = async (user) => {
    setSelectedUser(user); // Show basic info immediately
    setShowUserModal(true);
    
    // Fetch detailed information in background
    await fetchUserDetails(user.user_id || user.id);
  };

  const handleApprove = async (userId) => {
    try {
      const adminData = JSON.parse(localStorage.getItem('adminData'));
      const response = await adminAPI.approveUser(userId, adminData?.id);
      
      if (response.data?.status === "success") {
        // Update local state immediately
        setUsersData(prev => prev.map(user => 
          (user.user_id === userId || user.id === userId) ? { 
            ...user, 
            status: 'approve',
            current_status: 'approve'
          } : user
        ));
        
        // Update selected user if modal is open
        if (selectedUser && (selectedUser.user_id === userId || selectedUser.id === userId)) {
          setSelectedUser(prev => ({
            ...prev,
            status: 'approve',
            current_status: 'approve'
          }));
        }
        
        setShowUserModal(false);
        alert('User approved successfully!');
      }
    } catch (error) {
      console.error('Approve error:', error);
      alert('Error approving user: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleOnHold = async (userId) => {
    try {
      const reason = prompt("Please enter reason for putting user on hold:");
      if (!reason) return;

      const response = await adminAPI.onHoldUser(userId, reason);
      
      if (response.data?.message === "User placed on hold" || response.data?.status === "success") {
        setUsersData(prev => prev.map(user => 
          (user.user_id === userId || user.id === userId) ? { 
            ...user, 
            status: 'on hold',
            current_status: 'on hold'
          } : user
        ));
        
        if (selectedUser && (selectedUser.user_id === userId || selectedUser.id === userId)) {
          setSelectedUser(prev => ({
            ...prev,
            status: 'on hold',
            current_status: 'on hold'
          }));
        }
        
        setShowUserModal(false);
        alert('User put on hold successfully!');
      }
    } catch (error) {
      console.error('On Hold error:', error);
      alert('Error putting user on hold: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDeactivate = async (userId) => {
    try {
      const reason = prompt("Please enter reason for deactivation:");
      if (!reason) return;

      const response = await adminAPI.deactivateUser(userId, reason);
      
      if (response.data?.status === "success") {
        setUsersData(prev => prev.map(user => 
          (user.user_id === userId || user.id === userId) ? { 
            ...user, 
            status: 'deactivate',
            current_status: 'deactivate'
          } : user
        ));
        
        if (selectedUser && (selectedUser.user_id === userId || selectedUser.id === userId)) {
          setSelectedUser(prev => ({
            ...prev,
            status: 'deactivate',
            current_status: 'deactivate'
          }));
        }
        
        setShowUserModal(false);
        alert('User deactivated successfully!');
      }
    } catch (error) {
      console.error('Deactivate error:', error);
      alert('Error deactivating user: ' + (error.response?.data?.message || error.message));
    }
  };

  // UserDetailsModal Component - Made responsive
  const UserDetailsModal = () => {
    if (!selectedUser) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
        <div className="bg-white rounded-lg sm:rounded-2xl shadow-2xl w-full max-w-full sm:max-w-4xl max-h-[95vh] overflow-y-auto mx-2">
          {/* Modal Header */}
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">User Details</h2>
              <button 
                onClick={() => setShowUserModal(false)} 
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            <p className="text-gray-600 text-xs sm:text-sm mt-1">User ID: #{selectedUser.user_id || selectedUser.id}</p>
          </div>

          {/* Loading State */}
          {userDetailsLoading && (
            <div className="p-6 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          )}

          {/* User Information */}
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:gap-6">
              
              {/* Personal Information */}
              <div className="col-span-1">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 border-b pb-2">Personal Information</h3>
              </div>

              {[
                { 
                  label: 'Full Name', 
                  value: selectedUser.first_name && selectedUser.last_name 
                    ? `${selectedUser.first_name} ${selectedUser.last_name}`
                    : selectedUser.first_name || selectedUser.last_name || 'No Name', 
                  className: 'font-medium' 
                },
                { label: 'Email Address', value: selectedUser.email },
                { label: 'Phone', value: selectedUser.phone || 'Not provided' },
                { label: 'Gender', value: selectedUser.gender || 'Not specified' },
                { label: 'Marital Status', value: selectedUser.marital_status || 'Not specified' },
                { label: 'Date of Birth', value: selectedUser.dob ? new Date(selectedUser.dob).toLocaleDateString() : 'Not specified' },
                { label: 'Age', value: selectedUser.age || 'Not specified' },
              ].map((field, index) => (
                <div key={index}>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">{field.label}</label>
                  <div className="p-2 sm:p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className={`text-gray-900 text-sm sm:text-base ${field.className || ''}`}>{field.value}</p>
                  </div>
                </div>
              ))}

              {/* Professional Information */}
              <div className="col-span-1 mt-4 sm:mt-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 border-b pb-2">Professional Information</h3>
              </div>

              {[
                { label: 'Profession', value: selectedUser.profession || 'Not specified' },
                { label: 'Headline', value: selectedUser.headline || 'Not specified' },
                { label: 'Education', value: selectedUser.education || 'Not specified' },
                { label: 'Company', value: selectedUser.company || 'Not specified' },
                { label: 'Experience', value: selectedUser.experience ? `${selectedUser.experience} year(s)` : 'Not specified' },
              ].map((field, index) => (
                <div key={index}>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">{field.label}</label>
                  <div className="p-2 sm:p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-900 text-sm sm:text-base">{field.value}</p>
                  </div>
                </div>
              ))}

              {/* Profile Submitted */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Profile Submitted</label>
                <div className="p-2 sm:p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    selectedUser.is_submitted ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedUser.is_submitted ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>

              {/* Location Information */}
              <div className="col-span-1 mt-4 sm:mt-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 border-b pb-2">Location Information</h3>
              </div>

              {[
                { label: 'City', value: selectedUser.city || 'Not specified' },
                { label: 'Address', value: selectedUser.address || 'Not specified' },
              ].map((field, index) => (
                <div key={index}>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">{field.label}</label>
                  <div className="p-2 sm:p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-900 text-sm sm:text-base">{field.value}</p>
                  </div>
                </div>
              ))}

              {/* Skills & Interests */}
              <div className="col-span-1 mt-4 sm:mt-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 border-b pb-2">Skills & Interests</h3>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Skills</label>
                <div className="p-2 sm:p-3 bg-gray-50 rounded-lg border border-gray-200">
                  {selectedUser.skills && selectedUser.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      {selectedUser.skills.map((skill, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No skills specified</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Interests</label>
                <div className="p-2 sm:p-3 bg-gray-50 rounded-lg border border-gray-200">
                  {selectedUser.interests && selectedUser.interests.length > 0 ? (
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      {selectedUser.interests.map((interest, index) => (
                        <span key={index} className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                          {interest}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No interests specified</p>
                  )}
                </div>
              </div>

              {/* About Section */}
              <div className="col-span-1">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">About</label>
                <div className="p-2 sm:p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-900 text-sm sm:text-base whitespace-pre-line">
                    {selectedUser.about || 'No description provided'}
                  </p>
                </div>
              </div>

              {/* Account Information */}
              <div className="col-span-1 mt-4 sm:mt-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 border-b pb-2">Account Information</h3>
              </div>

              {[
                { 
                  label: 'Current Status', 
                  value: selectedUser.status || selectedUser.current_status,
                  isStatus: true 
                },
                { 
                  label: 'Registration Date', 
                  value: selectedUser.registration_date ? new Date(selectedUser.registration_date).toLocaleDateString() : 
                         selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : 'Not available' 
                },
                { 
                  label: 'Last Updated', 
                  value: selectedUser.updated_at ? new Date(selectedUser.updated_at).toLocaleDateString() : 'Not available' 
                },
              ].map((field, index) => (
                <div key={index}>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">{field.label}</label>
                  <div className="p-2 sm:p-3 bg-gray-50 rounded-lg border border-gray-200">
                    {field.isStatus ? (
                      <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold
                        ${selectedUser.status === 'approve' ? 'bg-green-100 text-green-800' : 
                          selectedUser.status === 'in process' ? 'bg-yellow-100 text-yellow-800' : 
                          selectedUser.status === 'on hold' ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'}`}>
                        {selectedUser.status?.toUpperCase() || 'IN PROCESS'}
                      </span>
                    ) : (
                      <p className="text-gray-900 text-sm sm:text-base">{field.value}</p>
                    )}
                  </div>
                </div>
              ))}

            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-4 sm:p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg sm:rounded-b-2xl">
            <div className="flex flex-col gap-2 sm:flex-row sm:gap-3 justify-end">
              <button
                onClick={() => handleOnHold(selectedUser.user_id || selectedUser.id)}
                className="px-4 sm:px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium text-sm sm:text-base flex-1 sm:flex-none order-2 sm:order-1"
              >
                Put On Hold
              </button>
              <button
                onClick={() => handleDeactivate(selectedUser.user_id || selectedUser.id)}
                className="px-4 sm:px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm sm:text-base flex-1 sm:flex-none order-3 sm:order-2"
              >
                Deactivate
              </button>
              <button
                onClick={() => handleApprove(selectedUser.user_id || selectedUser.id)}
                className="px-4 sm:px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm sm:text-base flex-1 sm:flex-none order-1 sm:order-3"
              >
                Approve User
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Stats calculations
  const totalUsers = usersData.length;
  const inProcessUsers = usersData.filter(u => u.status === 'in process').length;
  const approvedUsers = usersData.filter(u => u.status === 'approve').length;
  const onHoldUsers = usersData.filter(u => u.status === 'on hold').length;
  const deactivatedUsers = usersData.filter(u => u.status === 'deactivate').length;

  // Main Content Render
  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="p-4 sm:p-6">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Admin Dashboard</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {[
                { title: 'Total Users', value: totalUsers, color: 'blue' },
                { title: 'In Process', value: inProcessUsers, color: 'yellow' },
                { title: 'Approved', value: approvedUsers, color: 'green' },
                { title: 'On Hold', value: onHoldUsers, color: 'orange' },
                { title: 'Deactivated', value: deactivatedUsers, color: 'red' },
              ].map((stat, index) => (
                <div key={index} className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-gray-200">
                  <h3 className="text-sm sm:text-lg font-semibold text-gray-700">{stat.title}</h3>
                  <p className={`text-2xl sm:text-3xl font-bold text-${stat.color}-600 mt-1 sm:mt-2`}>{stat.value}</p>
                </div>
              ))}
            </div>
            
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Recent Activity</h3>
              <p className="text-gray-600 text-sm sm:text-base">Welcome to Admin Panel</p>
            </div>
          </div>
        );

      case 'users':
        return (
          <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0 mb-4 sm:mb-6">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">User Management</h1>
              
              {/* Status Filter Dropdown */}
              <div className="flex gap-4">
                <select 
                  value={userStatusFilter}
                  onChange={(e) => setUserStatusFilter(e.target.value)}
                  className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base w-full sm:w-auto"
                >
                  <option value="all">All Users</option>
                  <option value="in process">In Process</option>
                  <option value="approve">Approved</option>
                  <option value="on hold">On Hold</option>
                  <option value="deactivate">Deactivated</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                {/* Mobile Cards View */}
                <div className="block sm:hidden">
                  {filteredUsers.map((user) => (
                    <div key={user.user_id || user.id} className="p-4 border-b border-gray-200">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {user.first_name && user.last_name 
                              ? `${user.first_name} ${user.last_name}`
                              : user.first_name || user.last_name || 'No Name'
                            }
                          </div>
                          <div className="text-xs text-gray-500 mt-1">{user.email}</div>
                        </div>
                        <span className={`px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full
                          ${user.status === 'approve' ? 'bg-green-100 text-green-800 border border-green-200' : 
                            user.status === 'in process' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' : 
                            user.status === 'on hold' ? 'bg-orange-100 text-orange-800 border border-orange-200' :
                            user.status === 'deactivate' ? 'bg-red-100 text-red-800 border border-red-200' :
                            'bg-gray-100 text-gray-800 border border-gray-200'}`}>
                          {user.status ? user.status.toUpperCase() : 'IN PROCESS'}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600 mb-3">
                        Profession: {user.profession || 'Not specified'}
                      </div>
                      <button
                        onClick={() => handleViewDetails(user)}
                        className="w-full bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                      >
                        View Details
                      </button>
                    </div>
                  ))}
                  
                  {filteredUsers.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No users found</p>
                    </div>
                  )}
                </div>

                {/* Desktop Table View */}
                <table className="hidden sm:table min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profession</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr key={user.user_id || user.id} className="hover:bg-gray-50">
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {user.first_name && user.last_name 
                              ? `${user.first_name} ${user.last_name}`
                              : user.first_name || user.last_name || 'No Name'
                            }
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{user.profession || 'Not specified'}</div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                            ${user.status === 'approve' ? 'bg-green-100 text-green-800 border border-green-200' : 
                              user.status === 'in process' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' : 
                              user.status === 'on hold' ? 'bg-orange-100 text-orange-800 border border-orange-200' :
                              user.status === 'deactivate' ? 'bg-red-100 text-red-800 border border-red-200' :
                              'bg-gray-100 text-gray-800 border border-gray-200'}`}>
                            {user.status ? user.status.toUpperCase() : 'IN PROCESS'}
                          </span>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleViewDetails(user)}
                            className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {filteredUsers.length === 0 && (
                  <div className="hidden sm:block text-center py-8">
                    <p className="text-gray-500">No users found</p>
                  </div>
                )}
              </div>
            )}

            {/* User Details Modal */}
            {showUserModal && <UserDetailsModal />}
          </div>
        );

      case 'settings':
        return (
          <div className="p-4 sm:p-6">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Settings</h1>
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-700 mb-3 sm:mb-4">System Settings</h3>
              <p className="text-gray-600 text-sm sm:text-base">Settings content will be displayed here.</p>
            </div>
          </div>
        );

      case 'logs':
        return (
          <div className="p-4 sm:p-6">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">System Logs</h1>
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-700 mb-3 sm:mb-4">Activity Logs</h3>
              <p className="text-gray-600 text-sm sm:text-base">System logs and activities will be displayed here.</p>
            </div>
          </div>
        );

      case 'plans':
        return (
          <AdminPlans editingId={editingId} setEditingId={setEditingId} plans={plans} setPlans={setPlans}/>
        );
      
      default:
        return (
          <div className="p-4 sm:p-6">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Welcome to Admin Panel</h1>
          </div>
        );
    }
  };

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Close sidebar when clicking on a menu item on mobile
  const handleMenuClick = (section) => {
    setActiveSection(section);
    if (window.innerWidth < 640) { // sm breakpoint
      setSidebarOpen(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 sm:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed sm:relative z-30
        w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full sm:translate-x-0'}
        h-full
      `}>
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800">Admin Panel</h2>
        </div>
        
        <nav className="mt-4 sm:mt-6">
          {['dashboard', 'users', 'settings', 'logs', 'plans'].map((section) => (
            <div key={section} className="px-4 sm:px-6 py-2 sm:py-3">
              <button
                onClick={() => handleMenuClick(section)}
                className={`w-full text-left px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm sm:text-base ${
                  activeSection === section 
                    ? 'bg-blue-100 text-blue-600 font-semibold' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </button>
            </div>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto min-w-0">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex justify-between items-center px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center gap-4">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="sm:hidden text-gray-600 hover:text-gray-800"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="text-base sm:text-lg font-semibold text-gray-800 capitalize">
                {activeSection}
              </h1>
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              <span className="text-xs sm:text-sm text-gray-600 hidden sm:inline">Welcome, Admin</span>
              <button
                onClick={() => {
                  localStorage.removeItem('adminToken');
                  localStorage.removeItem('adminData');
                  window.location.href = '/admin-login';
                }}
                className="bg-red-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base"
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





// import { useState, useEffect } from 'react';
// import { adminAPI } from '../services/adminApi';
// import AdminPlans from './AdminAllPlan.jsx';

// const AdminDashboard = () => {
//   const [activeSection, setActiveSection] = useState('dashboard');
//   const [userStatusFilter, setUserStatusFilter] = useState('all');
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [showUserModal, setShowUserModal] = useState(false);
//   const [usersData, setUsersData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [userDetailsLoading, setUserDetailsLoading] = useState(false);
//   const [editingId, setEditingId] = useState(null);
//   const [plans, setPlans] = useState([]);


//   const fetchUsers = async () => {
//     try {
//       setLoading(true);
//       const response = await adminAPI.getUsers();
      
//       if (response.data.status === "success") {
//         let dataToUse = [];
        
//         if (response.data.userDetails && response.data.userDetails.length > 0) {
//           dataToUse = response.data.userDetails;
//         } else if (response.data.users && response.data.users.length > 0) {
//           dataToUse = response.data.users;
//         }
        
//         // Normalize status to lowercase for consistency
//         const usersWithNormalizedStatus = dataToUse.map(user => ({
//           ...user,
//           status: (user.status || user.current_status || 'in process').toLowerCase(),
//           current_status: (user.current_status || user.status || 'in process').toLowerCase()
//         }));
        
//         setUsersData(usersWithNormalizedStatus);
//       }
//     } catch (error) {
//       console.error('Error fetching users:', error);
//       alert('Error fetching users: ' + (error.response?.data?.message || error.message));
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchUserDetails = async (userId) => {
//     try {
//       setUserDetailsLoading(true);
//       const response = await adminAPI.getUserDetails(userId);
      
//       if (response.data.status === "success") {
//         const userData = response.data.user;
//         // Normalize status for detailed user as well
//         const normalizedUser = {
//           ...userData,
//           status: (userData.status || userData.current_status || 'in process').toLowerCase(),
//           current_status: (userData.current_status || userData.status || 'in process').toLowerCase()
//         };
//         setSelectedUser(normalizedUser);
//       }
//     } catch (error) {
//       console.error('Error fetching user details:', error);
//       alert('Error fetching user details: ' + (error.response?.data?.message || error.message));
//     } finally {
//       setUserDetailsLoading(false);
//     }
//   };

//   // Filter users based on status
//   const filteredUsers = usersData.filter(user => {
//     if (userStatusFilter === 'all') return true;
//     return user.status === userStatusFilter;
//   });

//   const handleViewDetails = async (user) => {
//     setSelectedUser(user); // Show basic info immediately
//     setShowUserModal(true);
    
//     // Fetch detailed information in background
//     await fetchUserDetails(user.user_id || user.id);
//   };

//   const handleApprove = async (userId) => {
//     try {
//       const adminData = JSON.parse(localStorage.getItem('adminData'));
//       const response = await adminAPI.approveUser(userId, adminData?.id);
      
//       if (response.data?.status === "success") {
//         // Update local state immediately
//         setUsersData(prev => prev.map(user => 
//           (user.user_id === userId || user.id === userId) ? { 
//             ...user, 
//             status: 'approve',
//             current_status: 'approve'
//           } : user
//         ));
        
//         // Update selected user if modal is open
//         if (selectedUser && (selectedUser.user_id === userId || selectedUser.id === userId)) {
//           setSelectedUser(prev => ({
//             ...prev,
//             status: 'approve',
//             current_status: 'approve'
//           }));
//         }
        
//         setShowUserModal(false);
//         alert('User approved successfully!');
//       }
//     } catch (error) {
//       console.error('Approve error:', error);
//       alert('Error approving user: ' + (error.response?.data?.message || error.message));
//     }
//   };

//   const handleOnHold = async (userId) => {
//     try {
//       const reason = prompt("Please enter reason for putting user on hold:");
//       if (!reason) return;

//       const response = await adminAPI.onHoldUser(userId, reason);
      
//       if (response.data?.message === "User placed on hold" || response.data?.status === "success") {
//         setUsersData(prev => prev.map(user => 
//           (user.user_id === userId || user.id === userId) ? { 
//             ...user, 
//             status: 'on hold',
//             current_status: 'on hold'
//           } : user
//         ));
        
//         if (selectedUser && (selectedUser.user_id === userId || selectedUser.id === userId)) {
//           setSelectedUser(prev => ({
//             ...prev,
//             status: 'on hold',
//             current_status: 'on hold'
//           }));
//         }
        
//         setShowUserModal(false);
//         alert('User put on hold successfully!');
//       }
//     } catch (error) {
//       console.error('On Hold error:', error);
//       alert('Error putting user on hold: ' + (error.response?.data?.message || error.message));
//     }
//   };

//   const handleDeactivate = async (userId) => {
//     try {
//       const reason = prompt("Please enter reason for deactivation:");
//       if (!reason) return;

//       const response = await adminAPI.deactivateUser(userId, reason);
      
//       if (response.data?.status === "success") {
//         setUsersData(prev => prev.map(user => 
//           (user.user_id === userId || user.id === userId) ? { 
//             ...user, 
//             status: 'deactivate',
//             current_status: 'deactivate'
//           } : user
//         ));
        
//         if (selectedUser && (selectedUser.user_id === userId || selectedUser.id === userId)) {
//           setSelectedUser(prev => ({
//             ...prev,
//             status: 'deactivate',
//             current_status: 'deactivate'
//           }));
//         }
        
//         setShowUserModal(false);
//         alert('User deactivated successfully!');
//       }
//     } catch (error) {
//       console.error('Deactivate error:', error);
//       alert('Error deactivating user: ' + (error.response?.data?.message || error.message));
//     }
//   };

//   // UserDetailsModal Component
//   const UserDetailsModal = () => {
//     if (!selectedUser) return null;

//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//         <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
//           {/* Modal Header */}
//           <div className="p-6 border-b border-gray-200">
//             <div className="flex justify-between items-center">
//               <h2 className="text-2xl font-bold text-gray-800">User Details</h2>
//               <button 
//                 onClick={() => setShowUserModal(false)} 
//                 className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
//               >
//                 ×
//               </button>
//             </div>
//             <p className="text-gray-600 text-sm mt-1">User ID: #{selectedUser.user_id || selectedUser.id}</p>
//           </div>

//           {/* Loading State */}
//           {userDetailsLoading && (
//             <div className="p-6 flex justify-center">
//               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
//             </div>
//           )}

//           {/* User Information */}
//           <div className="p-6 space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
//               {/* Personal Information */}
//               <div className="md:col-span-2 lg:col-span-3">
//                 <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Personal Information</h3>
//               </div>

//               {[
//                 // { label: 'Full Name', value: selectedUser.firsr_name || 'No Name', className: 'font-medium' },
//                { 
//                 label: 'Full Name', 
//                 value: selectedUser.first_name && selectedUser.last_name 
//              ? `${selectedUser.first_name} ${selectedUser.last_name}`
//               : selectedUser.first_name || selectedUser.last_name || 'No Name', 
//                className: 'font-medium' 
//                 },
//                 { label: 'Email Address', value: selectedUser.email },
//                 { label: 'Phone', value: selectedUser.phone || 'Not provided' },
//                 { label: 'Gender', value: selectedUser.gender || 'Not specified' },
//                 { label: 'Marital Status', value: selectedUser.marital_status || 'Not specified' },
//                 { label: 'Date of Birth', value: selectedUser.dob ? new Date(selectedUser.dob).toLocaleDateString() : 'Not specified' },
//                 { label: 'Age', value: selectedUser.age || 'Not specified' },
//               ].map((field, index) => (
//                 <div key={index}>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">{field.label}</label>
//                   <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
//                     <p className={`text-gray-900 ${field.className || ''}`}>{field.value}</p>
//                   </div>
//                 </div>
//               ))}

//               {/* Professional Information */}
//               <div className="md:col-span-2 lg:col-span-3 mt-6">
//                 <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Professional Information</h3>
//               </div>

//               {[
//                 { label: 'Profession', value: selectedUser.profession || 'Not specified' },
//                 { label: 'Headline', value: selectedUser.headline || 'Not specified' },
//                 { label: 'Education', value: selectedUser.education || 'Not specified' },
//                 { label: 'Company', value: selectedUser.company || 'Not specified' },
//                 { label: 'Experience', value: selectedUser.experience ? `${selectedUser.experience} year(s)` : 'Not specified' },
//               ].map((field, index) => (
//                 <div key={index}>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">{field.label}</label>
//                   <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
//                     <p className="text-gray-900">{field.value}</p>
//                   </div>
//                 </div>
//               ))}

//               {/* Profile Submitted */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Profile Submitted</label>
//                 <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
//                   <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
//                     selectedUser.is_submitted ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
//                   }`}>
//                     {selectedUser.is_submitted ? 'Yes' : 'No'}
//                   </span>
//                 </div>
//               </div>

//               {/* Location Information */}
//               <div className="md:col-span-2 lg:col-span-3 mt-6">
//                 <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Location Information</h3>
//               </div>

//               {[
//                 { label: 'City', value: selectedUser.city || 'Not specified' },
//                 { label: 'Address', value: selectedUser.address || 'Not specified', span: 2 },
//               ].map((field, index) => (
//                 <div key={index} className={field.span === 2 ? 'md:col-span-2' : ''}>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">{field.label}</label>
//                   <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
//                     <p className="text-gray-900">{field.value}</p>
//                   </div>
//                 </div>
//               ))}

//               {/* Skills & Interests */}
//               <div className="md:col-span-2 lg:col-span-3 mt-6">
//                 <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Skills & Interests</h3>
//               </div>

//               <div className="md:col-span-2">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
//                 <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
//                   {selectedUser.skills && selectedUser.skills.length > 0 ? (
//                     <div className="flex flex-wrap gap-2">
//                       {selectedUser.skills.map((skill, index) => (
//                         <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
//                           {skill}
//                         </span>
//                       ))}
//                     </div>
//                   ) : (
//                     <p className="text-gray-500">No skills specified</p>
//                   )}
//                 </div>
//               </div>

//               <div className="md:col-span-2">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Interests</label>
//                 <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
//                   {selectedUser.interests && selectedUser.interests.length > 0 ? (
//                     <div className="flex flex-wrap gap-2">
//                       {selectedUser.interests.map((interest, index) => (
//                         <span key={index} className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
//                           {interest}
//                         </span>
//                       ))}
//                     </div>
//                   ) : (
//                     <p className="text-gray-500">No interests specified</p>
//                   )}
//                 </div>
//               </div>

//               {/* About Section */}
//               <div className="md:col-span-2 lg:col-span-3">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">About</label>
//                 <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
//                   <p className="text-gray-900 whitespace-pre-line">
//                     {selectedUser.about || 'No description provided'}
//                   </p>
//                 </div>
//               </div>

//               {/* Account Information */}
//               <div className="md:col-span-2 lg:col-span-3 mt-6">
//                 <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Account Information</h3>
//               </div>

//               {[
//                 { 
//                   label: 'Current Status', 
//                   value: selectedUser.status || selectedUser.current_status,
//                   isStatus: true 
//                 },
//                 { 
//                   label: 'Registration Date', 
//                   value: selectedUser.registration_date ? new Date(selectedUser.registration_date).toLocaleDateString() : 
//                          selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : 'Not available' 
//                 },
//                 { 
//                   label: 'Last Updated', 
//                   value: selectedUser.updated_at ? new Date(selectedUser.updated_at).toLocaleDateString() : 'Not available' 
//                 },
//               ].map((field, index) => (
//                 <div key={index}>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">{field.label}</label>
//                   <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
//                     {field.isStatus ? (
//                       <span className={`px-3 py-1 rounded-full text-sm font-semibold
//                         ${selectedUser.status === 'approve' ? 'bg-green-100 text-green-800' : 
//                           selectedUser.status === 'in process' ? 'bg-yellow-100 text-yellow-800' : 
//                           selectedUser.status === 'on hold' ? 'bg-orange-100 text-orange-800' :
//                           'bg-red-100 text-red-800'}`}>
//                         {selectedUser.status?.toUpperCase() || 'IN PROCESS'}
//                       </span>
//                     ) : (
//                       <p className="text-gray-900">{field.value}</p>
//                     )}
//                   </div>
//                 </div>
//               ))}

//             </div>
//           </div>

//           {/* Action Buttons */}
//           <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
//             <div className="flex flex-col sm:flex-row gap-3 justify-end">
//               <button
//                 onClick={() => handleOnHold(selectedUser.user_id || selectedUser.id)}
//                 className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium flex-1 sm:flex-none"
//               >
//                 Put On Hold
//               </button>
//               <button
//                 onClick={() => handleDeactivate(selectedUser.user_id || selectedUser.id)}
//                 className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex-1 sm:flex-none"
//               >
//                 Deactivate
//               </button>
//               <button
//                 onClick={() => handleApprove(selectedUser.user_id || selectedUser.id)}
//                 className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex-1 sm:flex-none"
//               >
//                 Approve User
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   // Stats calculations
//   const totalUsers = usersData.length;
//   const inProcessUsers = usersData.filter(u => u.status === 'in process').length;
//   const approvedUsers = usersData.filter(u => u.status === 'approve').length;
//   const onHoldUsers = usersData.filter(u => u.status === 'on hold').length;
//   const deactivatedUsers = usersData.filter(u => u.status === 'deactivate').length;

//   // Main Content Render
//   const renderContent = () => {
//     switch (activeSection) {
//       case 'dashboard':
//         return (
//           <div className="p-6">
//             <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
//               {[
//                 { title: 'Total Users', value: totalUsers, color: 'blue' },
//                 { title: 'In Process Users', value: inProcessUsers, color: 'yellow' },
//                 { title: 'Approved Users', value: approvedUsers, color: 'green' },
//                 { title: 'On Hold Users', value: onHoldUsers, color: 'orange' },
//                 { title: 'Deactivated Users', value: deactivatedUsers, color: 'red' },
//               ].map((stat, index) => (
//                 <div key={index} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
//                   <h3 className="text-lg font-semibold text-gray-700">{stat.title}</h3>
//                   <p className={`text-3xl font-bold text-${stat.color}-600 mt-2`}>{stat.value}</p>
//                 </div>
//               ))}
//             </div>
            
//             <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
//               <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h3>
//               <p className="text-gray-600">Welcome to Admin Panel</p>
//             </div>
//           </div>
//         );

//       case 'users':
//         return (
//           <div className="p-6">
//             <div className="flex justify-between items-center mb-6">
//               <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
              
//               {/* Status Filter Dropdown */}
//               <div className="flex gap-4">
//                 <select 
//                   value={userStatusFilter}
//                   onChange={(e) => setUserStatusFilter(e.target.value)}
//                   className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 >
//                   <option value="all">All Users</option>
//                   <option value="in process">In Process</option>
//                   <option value="approve">Approved</option>
//                   <option value="on hold">On Hold</option>
//                   <option value="deactivate">Deactivated</option>
//                 </select>
//               </div>
//             </div>

//             {loading ? (
//               <div className="flex justify-center items-center py-8">
//                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
//               </div>
//             ) : (
//               <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profession</th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {filteredUsers.map((user) => (
//                       <tr key={user.user_id || user.id} className="hover:bg-gray-50">
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm font-medium text-gray-900"> {                      user.first_name && user.last_name 
//                          ? `${user.first_name} ${user.last_name}`
//                          : user.first_name || user.last_name || user.full_name || 'No Name'
//                             }
// </div>
//                           {/* <div className="text-sm font-medium text-gray-900">{user.full_name || 'No Name'}</div> */}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm text-gray-500">{user.email}</div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm text-gray-500">{user.profession || 'Not specified'}</div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
//                             ${user.status === 'approve' ? 'bg-green-100 text-green-800 border border-green-200' : 
//                               user.status === 'in process' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' : 
//                               user.status === 'on hold' ? 'bg-orange-100 text-orange-800 border border-orange-200' :
//                               user.status === 'deactivate' ? 'bg-red-100 text-red-800 border border-red-200' :
//                               'bg-gray-100 text-gray-800 border border-gray-200'}`}>
//                             {user.status ? user.status.toUpperCase() : 'IN PROCESS'}
//                           </span>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                           <button
//                             onClick={() => handleViewDetails(user)}
//                             className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
//                           >
//                             View Details
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
                
//                 {filteredUsers.length === 0 && (
//                   <div className="text-center py-8">
//                     <p className="text-gray-500">No users found</p>
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* User Details Modal */}
//             {showUserModal && <UserDetailsModal />}
//           </div>
//         );

//       case 'settings':
//         return (
//           <div className="p-6">
//             <h1 className="text-2xl font-bold text-gray-800 mb-6">Settings</h1>
//             <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
//               <h3 className="text-lg font-semibold text-gray-700 mb-4">System Settings</h3>
//               <p className="text-gray-600">Settings content will be displayed here.</p>
//             </div>
//           </div>
//         );

//       case 'logs':
//         return (
//           <div className="p-6">
//             <h1 className="text-2xl font-bold text-gray-800 mb-6">System Logs</h1>
//             <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
//               <h3 className="text-lg font-semibold text-gray-700 mb-4">Activity Logs</h3>
//               <p className="text-gray-600">System logs and activities will be displayed here.</p>
//             </div>
//           </div>
//         );

//           case 'plans':
//         return (
//           <AdminPlans editingId={editingId} setEditingId={setEditingId} plans={plans} setPlans={setPlans}/>
//         );
      
          
//       default:
//         return (
//           <div className="p-6">
//             <h1 className="text-2xl font-bold text-gray-800">Welcome to Admin Panel</h1>
//           </div>
//         );
//     }
//   };

//   // Fetch users on component mount
//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* Sidebar */}
//       <div className="w-64 bg-white shadow-lg">
//         <div className="p-6 border-b border-gray-200">
//           <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
//         </div>
        
//         <nav className="mt-6">
//           {['dashboard', 'users', 'settings', 'logs', 'plans'].map((section) => (
//             <div key={section} className="px-6 py-3">
//               <button
//                 onClick={() => setActiveSection(section)}
//                 className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
//                   activeSection === section 
//                     ? 'bg-blue-100 text-blue-600 font-semibold' 
//                     : 'text-gray-600 hover:bg-gray-100'
//                 }`}
//               >
//                 {section.charAt(0).toUpperCase() + section.slice(1)}
//               </button>
//             </div>
//           ))}
//         </nav>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 overflow-auto">
//         <header className="bg-white shadow-sm border-b border-gray-200">
//           <div className="flex justify-between items-center px-6 py-4">
//             <h1 className="text-lg font-semibold text-gray-800 capitalize">
//               {activeSection}
//             </h1>
//             <div className="flex items-center gap-4">
//               <span className="text-sm text-gray-600">Welcome, Admin</span>
//               <button
//                 onClick={() => {
//                   localStorage.removeItem('adminToken');
//                   localStorage.removeItem('adminData');
//                   window.location.href = '/admin-login';
//                 }}
//                 className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
//               >
//                 Logout
//               </button>
//             </div>
//           </div>
//         </header>

//         {renderContent()}
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;



