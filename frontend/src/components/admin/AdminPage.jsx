
import { useState, useEffect } from 'react';
import { adminAPI } from '../services/adminApi';

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [userStatusFilter, setUserStatusFilter] = useState('in process');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [usersData, setUsersData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch users from API

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getUsers();
      if (response.data.status === "success") {
        setUsersData(response.data.users);
        console.log('Full API Response:', response.data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('Error fetching users: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  // Filter users based on status
  const filteredUsers = usersData.filter(user => 
    userStatusFilter === 'all' ? true : user.status === userStatusFilter
  );

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  // API Integration Functions

  const handleApprove = async (userId) => {
    try {
      const adminData = JSON.parse(localStorage.getItem('adminData'));
      const response = await adminAPI.approveUser(userId, adminData.id);
      
      if (response.data.status === "success") {
        // Update local state
        setUsersData(prev => prev.map(user => 
          user.id === userId ? { ...user, status: 'approve' } : user
        ));
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
      
      if (response.data.message === "User placed on hold") {
        // Update local state
        setUsersData(prev => prev.map(user => 
          user.id === userId ? { ...user, status: 'on hold' } : user
        ));
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
      
      if (response.data.status === "success") {
        // Update local state
        setUsersData(prev => prev.map(user => 
          user.id === userId ? { ...user, status: 'deactivate' } : user
        ));
        setShowUserModal(false);
        alert('User deactivated successfully!');
      }
    } catch (error) {
      console.error('Deactivate error:', error);
      alert('Error deactivating user: ' + (error.response?.data?.message || error.message));
    }
  };
  

  //user models code new with proper user profile data 
  // UserDetailsModal component with ALL fields

  const UserDetailsModal = () => {
  if (!selectedUser) return null;

  // Get the actual status from user data
  const userStatus = selectedUser.status || 'in process';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">User Details</h2>
            <button onClick={() => setShowUserModal(false)} className="text-gray-500 hover:text-gray-700 text-2xl font-bold">×</button>
          </div>
          <p className="text-gray-600 text-sm mt-1">User ID: #{selectedUser.user_id || selectedUser.id}</p>
        </div>

        {/* User Information - ALL FIELDS */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Personal Information */}
            <div className="md:col-span-2 lg:col-span-3">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Personal Information</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-900 font-medium">{selectedUser.full_name || 'No Name'}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-900">{selectedUser.email}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-900">{selectedUser.phone || 'Not provided'}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-900">{selectedUser.gender || 'Not specified'}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Marital Status</label>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-900">{selectedUser.marital_status || 'Not specified'}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-900">
                  {selectedUser.dob ? new Date(selectedUser.dob).toLocaleDateString() : 'Not specified'}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-900">{selectedUser.age || 'Not specified'}</p>
              </div>
            </div>

            {/* Professional Information */}
            <div className="md:col-span-2 lg:col-span-3 mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Professional Information</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Profession</label>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-900">{selectedUser.profession || 'Not specified'}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Headline</label>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-900">{selectedUser.headline || 'Not specified'}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Education</label>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-900">{selectedUser.education || 'Not specified'}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-900">{selectedUser.company || 'Not specified'}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-900">
                  {selectedUser.experience ? `${selectedUser.experience} year(s)` : 'Not specified'}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Profile Submitted</label>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  selectedUser.is_submitted ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {selectedUser.is_submitted ? 'Yes' : 'No'}
                </span>
              </div>
            </div>

            {/* Location Information */}
            <div className="md:col-span-2 lg:col-span-3 mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Location Information</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-900">{selectedUser.city || 'Not specified'}</p>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-900">{selectedUser.address || 'Not specified'}</p>
              </div>
            </div>

            {/* Skills & Interests */}
            <div className="md:col-span-2 lg:col-span-3 mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Skills & Interests</h3>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                {selectedUser.skills && selectedUser.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedUser.skills.map((skill, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No skills specified</p>
                )}
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Interests</label>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                {selectedUser.interests && selectedUser.interests.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedUser.interests.map((interest, index) => (
                      <span key={index} className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                        {interest}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No interests specified</p>
                )}
              </div>
            </div>

            {/* About Section */}
            <div className="md:col-span-2 lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">About</label>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-900 whitespace-pre-line">
                  {selectedUser.about || 'No description provided'}
                </p>
              </div>
            </div>

            {/* Status Information - FIXED */}
            <div className="md:col-span-2 lg:col-span-3 mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Account Information</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Status</label>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold
                  ${userStatus === 'approve' ? 'bg-green-100 text-green-800' : 
                    userStatus === 'in process' ? 'bg-yellow-100 text-yellow-800' : 
                    userStatus === 'on hold' ? 'bg-orange-100 text-orange-800' :
                    userStatus === 'deactivate' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'}`}>
                  {userStatus.toUpperCase()}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Registration Date</label>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-900">
                  {selectedUser.registration_date ? new Date(selectedUser.registration_date).toLocaleDateString() : 
                   selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : 'Not available'}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Last Updated</label>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-900">
                  {selectedUser.updated_at ? new Date(selectedUser.updated_at).toLocaleDateString() : 'Not available'}
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <button
              onClick={() => handleOnHold(selectedUser.user_id || selectedUser.id)}
              className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium flex-1 sm:flex-none"
            >
              Put On Hold
            </button>
            <button
              onClick={() => handleDeactivate(selectedUser.user_id || selectedUser.id)}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex-1 sm:flex-none"
            >
              Deactivate
            </button>
            <button
              onClick={() => handleApprove(selectedUser.user_id || selectedUser.id)}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex-1 sm:flex-none"
            >
              Approve User
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --------------------------old code----------------------------------------//


  // User Details Modal

  // const UserDetailsModal = () => {
  //   if (!selectedUser) return null;

  //   return (
  //     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
  //       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
  //         {/* Modal Header */}
  //         <div className="p-6 border-b border-gray-200">
  //           <div className="flex justify-between items-center">
  //             <h2 className="text-2xl font-bold text-gray-800">User Details</h2>
  //             <button
  //               onClick={() => setShowUserModal(false)}
  //               className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
  //             >
  //               ×
  //             </button>
  //           </div>
  //           <p className="text-gray-600 text-sm mt-1">User ID: #{selectedUser.id}</p>
  //         </div>

  //         {/* User Information */}
  //         <div className="p-6 space-y-6">
  //           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  //             {/* Name */}
  //             <div>
  //               <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
  //               <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
  //                 <p className="text-gray-900 font-medium">{selectedUser.full_name || 'No Name'}</p>
  //               </div>
  //             </div>

  //             {/* Email */}
  //             <div>
  //               <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
  //               <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
  //                 <p className="text-gray-900">{selectedUser.email}</p>
  //               </div>
  //             </div>

  //             {/* Profession */}
  //             <div>
  //               <label className="block text-sm font-medium text-gray-700 mb-2">Profession</label>
  //               <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
  //                 <p className="text-gray-900">{selectedUser.profession || 'Not specified'}</p>
  //               </div>
  //             </div>

  //             {/* Status */}
  //             <div>
  //               <label className="block text-sm font-medium text-gray-700 mb-2">Current Status</label>
  //               <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
  //                 <span className={`px-3 py-1 rounded-full text-sm font-semibold
  //                   ${selectedUser.status === 'approve' ? 'bg-green-100 text-green-800' : 
  //                     selectedUser.status === 'in process' ? 'bg-yellow-100 text-yellow-800' : 
  //                     selectedUser.status === 'on hold' ? 'bg-orange-100 text-orange-800' :
  //                     'bg-red-100 text-red-800'}`}>
  //                   {selectedUser.status}
  //                 </span>
  //               </div>
  //             </div>

  //             {/* User ID */}
  //             <div>
  //               <label className="block text-sm font-medium text-gray-700 mb-2">User ID</label>
  //               <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
  //                 <p className="text-gray-900 font-mono">#{selectedUser.id}</p>
  //               </div>
  //             </div>

  //             {/* Registration Date */}
  //             <div>
  //               <label className="block text-sm font-medium text-gray-700 mb-2">Registration Date</label>
  //               <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
  //                 <p className="text-gray-900">
  //                   {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : 'Not available'}
  //                 </p>
  //               </div>
  //             </div>
  //           </div>

  //         </div>

  //         {/* Action Buttons */}
  //         <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
  //           <div className="flex flex-col sm:flex-row gap-3 justify-end">
  //             <button
  //               onClick={() => handleOnHold(selectedUser.id)}
  //               className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium flex-1 sm:flex-none"
  //             >
  //               Put On Hold
  //             </button>
  //             <button
  //               onClick={() => handleDeactivate(selectedUser.id)}
  //               className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex-1 sm:flex-none"
  //             >
  //               Deactivate
  //             </button>
  //             <button
  //               onClick={() => handleApprove(selectedUser.id)}
  //               className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex-1 sm:flex-none"
  //             >
  //               Approve User
  //             </button>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // };
  // ---------------------------------------------------------------//

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
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-700">Total Users</h3>
                <p className="text-3xl font-bold text-blue-600 mt-2">{totalUsers}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-700">In Process Users</h3>
                <p className="text-3xl font-bold text-yellow-600 mt-2">{inProcessUsers}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-700">Approved Users</h3>
                <p className="text-3xl font-bold text-green-600 mt-2">{approvedUsers}</p>
              </div>
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-700">On Hold user</h3>
                <p className="text-3xl font-bold text-green-600 mt-2">{onHoldUsers}</p>
              </div>
                      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-700">Deactivated user</h3>
                <p className="text-3xl font-bold text-green-600 mt-2">{deactivatedUsers}</p>
              </div>

            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h3>
              <p className="text-gray-600">Welcome to Admin Panel</p>
            </div>
          </div>
        );
// -----------------------------------------------------------------

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
            <option value="in process">In Process</option>
            <option value="approve">Approve</option>
            <option value="on hold">On Hold</option>
            <option value="deactivate">Deactivate</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (

        /* Users Table */
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
                  Profession
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
                    <div className="text-sm font-medium text-gray-900">{user.full_name || 'No Name'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{user.profession || 'Not specified'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${user.status === 'approve' ? 'bg-green-100 text-green-800 border border-green-200' : 
                        user.status === 'in process' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' : 
                        user.status === 'on hold' ? 'bg-orange-100 text-orange-800 border border-orange-200' :
                        user.status === 'deactivate' ? 'bg-red-100 text-red-800 border border-red-200' :
                        'bg-gray-100 text-gray-800 border border-gray-200'}`}>
                      {user.status ? user.status.toUpperCase() : 'PENDING'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleViewDetails(user)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredUsers.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No users found</p>
            </div>
          )}
        </div>
      )}

      {/* User Details Modal */}
      {showUserModal && <UserDetailsModal />}
    </div>
  );


// case 'users':
//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
        
//         {/* Status Filter Dropdown */}
//         <div className="flex gap-4">
//           <select 
//             value={userStatusFilter}
//             onChange={(e) => setUserStatusFilter(e.target.value)}
//             className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//           >
//             <option value="all">All Users</option>
//             <option value="in process">In Process</option>
//             <option value="approve">Approve</option>
//             <option value="on hold">On Hold</option>
//             <option value="deactivate">Deactivate</option>
//           </select>
//         </div>
//       </div>

//       {loading ? (
//         <div className="flex justify-center items-center py-8">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
//         </div>
//       ) : (

//         /* Users Table */
//         <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Name
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Email
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Profession
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Status
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {filteredUsers && filteredUsers.length > 0 ? filteredUsers.map((user) => {
//                 // Debugging - console log each user's status
//                 console.log("User:", user.full_name, "Status:", user.status);
                
//                 return (
//                   <tr key={user.id} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="text-sm font-medium text-gray-900">{user.full_name || 'No Name'}</div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="text-sm text-gray-500">{user.email}</div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="text-sm text-gray-500">{user.profession || 'Not specified'}</div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
//                         ${user.status === 'approve' ? 'bg-green-100 text-green-800' : 
//                           user.status === 'in process' ? 'bg-yellow-100 text-yellow-800' : 
//                           user.status === 'on hold' ? 'bg-orange-100 text-orange-800' :
//                           user.status === 'deactivate' ? 'bg-red-100 text-red-800' :
//                           'bg-gray-100 text-gray-800'}`}>
//                         {user.status || 'Pending'}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                       <button
//                         onClick={() => handleViewDetails(user)}
//                         className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
//                       >
//                         View Details
//                       </button>
//                     </td>
//                   </tr>
//                 );
//               }) : (
//                 <tr>
//                   <td colSpan="5" className="px-6 py-4 text-center">
//                     <div className="text-gray-500">No users found</div>
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* User Details Modal */}
//       {showUserModal && <UserDetailsModal />}
//     </div>
//   );



      // case 'users':
      //   return (
      //     <div className="p-6">
      //       <div className="flex justify-between items-center mb-6">
      //         <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
              
      //         {/* Status Filter Dropdown */}
      //         <div className="flex gap-4">
      //           <select 
      //             value={userStatusFilter}
      //             onChange={(e) => setUserStatusFilter(e.target.value)}
      //             className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      //           >
      //             <option value="all">All Users</option>
      //             <option value="in process">In Process</option>
      //             <option value="approve">Approve</option>
      //             <option value="on hold">On Hold</option>
      //             <option value="deactivate">Deactivate</option>
      //           </select>
      //         </div>
      //       </div>

      //       {loading ? (
      //         <div className="flex justify-center items-center py-8">
      //           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      //         </div>
      //       ) : (

      //         /* Users Table */
      //         <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      //           <table className="min-w-full divide-y divide-gray-200">
      //             <thead className="bg-gray-50">
      //               <tr>
      //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
      //                   Name
      //                 </th>
      //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
      //                   Email
      //                 </th>
      //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
      //                   Profession
      //                 </th>
      //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
      //                   Status
      //                 </th>
      //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
      //                   Actions
      //                 </th>
      //               </tr>
      //             </thead>
      //             <tbody className="bg-white divide-y divide-gray-200">
      //               {filteredUsers.map((user) => (
      //                 <tr key={user.id} className="hover:bg-gray-50">
      //                   <td className="px-6 py-4 whitespace-nowrap">
      //                     <div className="text-sm font-medium text-gray-900">{user.full_name || 'No Name'}</div>
      //                   </td>
      //                   <td className="px-6 py-4 whitespace-nowrap">
      //                     <div className="text-sm text-gray-500">{user.email}</div>
      //                   </td>
      //                   <td className="px-6 py-4 whitespace-nowrap">
      //                     <div className="text-sm text-gray-500">{user.profession || 'Not specified'}</div>
      //                   </td>
      //                   <td className="px-6 py-4 whitespace-nowrap">
      //                     <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
      //                       ${user.status === 'approve' ? 'bg-green-100 text-green-800' : 
      //                         user.status === 'in process' ? 'bg-yellow-100 text-yellow-800' : 
      //                         user.status === 'on hold' ? 'bg-orange-100 text-orange-800' :
      //                         'bg-red-100 text-red-800'}`}>
      //                       {user.status}
      //                     </span>
      //                   </td>
      //                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
      //                     <button
      //                       onClick={() => handleViewDetails(user)}
      //                       className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
      //                     >
      //                       View Details
      //                     </button>
      //                   </td>
      //                 </tr>
      //               ))}
      //             </tbody>
      //           </table>
                
      //           {filteredUsers.length === 0 && (
      //             <div className="text-center py-8">
      //               <p className="text-gray-500">No users found</p>
      //             </div>
      //           )}
      //         </div>
      //       )}

      //       {/* User Details Modal */}
      //       {showUserModal && <UserDetailsModal />}
      //     </div>
      //   );

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

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

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






// old code hai 











// import { useState } from 'react';
// import { adminAPI } from '../services/adminApi';

// const AdminDashboard = () => {
//   const [activeSection, setActiveSection] = useState('dashboard');
//   const [userStatusFilter, setUserStatusFilter] = useState('In Process');
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [showUserModal, setShowUserModal] = useState(false);

//   // Dummy data with new status system
//   const usersData = [
//     { id: 1, name: 'Aman Sharma', email: 'aman@example.com', profession: 'Software Engineer', status: 'In Process' },
//     { id: 2, name: 'Riya Patel', email: 'riya@example.com', profession: 'Doctor', status: 'In Process' },
//     { id: 3, name: 'ritik', email: 'ritik@example.com', profession: 'Student', status: 'Approve' },
//     { id: 4, name: 'imran', email: 'imran@example.com', profession: 'Business', status: 'On Hold' },
//     { id: 5, name: 'celina', email: 'celina@example.com', profession: 'Teacher', status: 'In Process' },
//     { id: 6, name: 'test', email: 'test@example.com', profession: 'Tester', status: 'Approve' },
//     { id: 7, name: 'almanet', email: 'almanet@example.com', profession: 'Developer', status: 'Deactivate' },
//   ];

//   const filteredUsers = usersData.filter(user => 
//     userStatusFilter === 'all' ? true : user.status === userStatusFilter
//   );

//   const handleViewDetails = (user) => {
//     setSelectedUser(user);
//     setShowUserModal(true);
//   };

//   // API Integration Functions
//   const handleApprove = async (userId) => {
//     try {
//       const adminData = JSON.parse(localStorage.getItem('adminData'));
//       const response = await adminAPI.approveUser(userId, adminData.id);
      
//       if (response.data.status === "success") {
//         // Update local state
//         setUsersData(prev => prev.map(user => 
//           user.id === userId ? { ...user, status: 'Approve' } : user
//         ));
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
      
//       if (response.data.message === "User placed on hold") {
//         // Update local state
//         setUsersData(prev => prev.map(user => 
//           user.id === userId ? { ...user, status: 'On Hold' } : user
//         ));
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
      
//       if (response.data.status === "success") {
//         // Update local state
//         setUsersData(prev => prev.map(user => 
//           user.id === userId ? { ...user, status: 'Deactivate' } : user
//         ));
//         setShowUserModal(false);
//         alert('User deactivated successfully!');
//       }
//     } catch (error) {
//       console.error('Deactivate error:', error);
//       alert('Error deactivating user: ' + (error.response?.data?.message || error.message));
//     }
//   };

//   // User Details Modal
//   const UserDetailsModal = () => {
//     if (!selectedUser) return null;

//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//         <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
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
//             <p className="text-gray-600 text-sm mt-1">User ID: #{selectedUser.id}</p>
//           </div>

//           {/* User Information */}
//           <div className="p-6 space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {/* Name */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
//                 <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
//                   <p className="text-gray-900 font-medium">{selectedUser.name}</p>
//                 </div>
//               </div>

//               {/* Email */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
//                 <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
//                   <p className="text-gray-900">{selectedUser.email}</p>
//                 </div>
//               </div>

//               {/* Profession */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Profession</label>
//                 <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
//                   <p className="text-gray-900">{selectedUser.profession || 'Not specified'}</p>
//                 </div>
//               </div>

//               {/* Status */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Current Status</label>
//                 <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
//                   <span className={`px-3 py-1 rounded-full text-sm font-semibold
//                     ${selectedUser.status === 'Approve' ? 'bg-green-100 text-green-800' : 
//                       selectedUser.status === 'In Process' ? 'bg-yellow-100 text-yellow-800' : 
//                       selectedUser.status === 'On Hold' ? 'bg-orange-100 text-orange-800' :
//                       'bg-red-100 text-red-800'}`}>
//                     {selectedUser.status}
//                   </span>
//                 </div>
//               </div>

//               {/* User ID */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">User ID</label>
//                 <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
//                   <p className="text-gray-900 font-mono">#{selectedUser.id}</p>
//                 </div>
//               </div>

//               {/* Registration Date */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Registration Date</label>
//                 <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
//                   <p className="text-gray-900">
//                     {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : 'Not available'}
//                   </p>
//                 </div>
//               </div>
//             </div>

//           </div>

//           {/* Action Buttons */}
//           <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
//             <div className="flex flex-col sm:flex-row gap-3 justify-end">
//               <button
//                 onClick={() => handleOnHold(selectedUser.id)}
//                 className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium flex-1 sm:flex-none"
//               >
//                 Put On Hold
//               </button>
//               <button
//                 onClick={() => handleDeactivate(selectedUser.id)}
//                 className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex-1 sm:flex-none"
//               >
//                 Deactivate
//               </button>
//               <button
//                 onClick={() => handleApprove(selectedUser.id)}
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

//   // Main Content Render
//   const renderContent = () => {
//     switch (activeSection) {
//       case 'dashboard':
//         return (
//           <div className="p-6">
//             <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//               <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
//                 <h3 className="text-lg font-semibold text-gray-700">Total Users</h3>
//                 <p className="text-3xl font-bold text-blue-600 mt-2">{usersData.length}</p>
//               </div>
//               <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
//                 <h3 className="text-lg font-semibold text-gray-700">In Process Users</h3>
//                 <p className="text-3xl font-bold text-yellow-600 mt-2">
//                   {usersData.filter(u => u.status === 'In Process').length}
//                 </p>
//               </div>
//               <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
//                 <h3 className="text-lg font-semibold text-gray-700">Approved Users</h3>
//                 <p className="text-3xl font-bold text-green-600 mt-2">
//                   {usersData.filter(u => u.status === 'Approve').length}
//                 </p>
//               </div>
//             </div>
            
//             <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
//               <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h3>
//               <p className="text-gray-600">Welcome to Admin Panel. Use the sidebar to navigate.</p>
//             </div>
//           </div>
//         );

      // case 'users':
      //   return (
      //     <div className="p-6">
      //       <div className="flex justify-between items-center mb-6">
      //         <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
              
      //         {/* Status Filter Dropdown */}
      //         <div className="flex gap-4">
      //           <select 
      //             value={userStatusFilter}
      //             onChange={(e) => setUserStatusFilter(e.target.value)}
      //             className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      //           >
      //             <option value="all">All Users</option>
      //             <option value="In Process">In Process</option>
      //             <option value="Approve">Approve</option>
      //             <option value="On Hold">On Hold</option>
      //             <option value="Deactivate">Deactivate</option>
      //           </select>
      //         </div>
      //       </div>

      //       {/* Users Table */}
      //       <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      //         <table className="min-w-full divide-y divide-gray-200">
      //           <thead className="bg-gray-50">
      //             <tr>
      //               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
      //                 Name
      //               </th>
      //               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
      //                 Email
      //               </th>
      //               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
      //                 Status
      //               </th>
      //               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
      //                 Actions
      //               </th>
      //             </tr>
      //           </thead>
      //           <tbody className="bg-white divide-y divide-gray-200">
      //             {filteredUsers.map((user) => (
      //               <tr key={user.id} className="hover:bg-gray-50">
      //                 <td className="px-6 py-4 whitespace-nowrap">
      //                   <div className="text-sm font-medium text-gray-900">{user.name}</div>
      //                 </td>
      //                 <td className="px-6 py-4 whitespace-nowrap">
      //                   <div className="text-sm text-gray-500">{user.email}</div>
      //                 </td>
      //                 <td className="px-6 py-4 whitespace-nowrap">
      //                   <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
      //                     ${user.status === 'Approve' ? 'bg-green-100 text-green-800' : 
      //                       user.status === 'In Process' ? 'bg-yellow-100 text-yellow-800' : 
      //                       user.status === 'On Hold' ? 'bg-orange-100 text-orange-800' :
      //                       'bg-red-100 text-red-800'}`}>
      //                     {user.status}
      //                   </span>
      //                 </td>
      //                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
      //                   <button
      //                     onClick={() => handleViewDetails(user)}
      //                     className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
      //                   >
      //                     View User Details
      //                   </button>
      //                 </td>
      //               </tr>
      //             ))}
      //           </tbody>
      //         </table>
      //       </div>

      //       {/* User Details Modal */}
      //       {showUserModal && <UserDetailsModal />}
      //     </div>
      //   );

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

//       default:
//         return (
//           <div className="p-6">
//             <h1 className="text-2xl font-bold text-gray-800">Welcome to Admin Panel</h1>
//           </div>
//         );
//     }
//   };

//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* Sidebar */}
//       <div className="w-64 bg-white shadow-lg">
//         <div className="p-6 border-b border-gray-200">
//           <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
//         </div>
        
//         <nav className="mt-6">
//           <div className="px-6 py-3">
//             <button
//               onClick={() => setActiveSection('dashboard')}
//               className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
//                 activeSection === 'dashboard' 
//                   ? 'bg-blue-100 text-blue-600 font-semibold' 
//                   : 'text-gray-600 hover:bg-gray-100'
//               }`}
//             >
//               Dashboard
//             </button>
//           </div>
          
//           <div className="px-6 py-3">
//             <button
//               onClick={() => setActiveSection('users')}
//               className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
//                 activeSection === 'users' 
//                   ? 'bg-blue-100 text-blue-600 font-semibold' 
//                   : 'text-gray-600 hover:bg-gray-100'
//               }`}
//             >
//               Users
//             </button>
//           </div>
          
//           <div className="px-6 py-3">
//             <button
//               onClick={() => setActiveSection('settings')}
//               className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
//                 activeSection === 'settings' 
//                   ? 'bg-blue-100 text-blue-600 font-semibold' 
//                   : 'text-gray-600 hover:bg-gray-100'
//               }`}
//             >
//               Settings
//             </button>
//           </div>
          
//           <div className="px-6 py-3">
//             <button
//               onClick={() => setActiveSection('logs')}
//               className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
//                 activeSection === 'logs' 
//                   ? 'bg-blue-100 text-blue-600 font-semibold' 
//                   : 'text-gray-600 hover:bg-gray-100'
//               }`}
//             >
//               Logs
//             </button>
//           </div>
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




