// src/pages/AdminPage.jsx
import React, { useState } from "react";

export default function AdminPage() {
  // mock data (UI preview ke liye)
  const [pendingUsers] = useState([
    { id: "u1", fullName: "Aman Sharma", email: "aman@example.com" },
    { id: "u2", fullName: "Riya Patel", email: "riya@example.com" },
    { id: "u3", fullName: "Sahil Khan", email: "sahil@example.com" },
  ]);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-6">
        <h2 className="text-2xl font-semibold mb-6">Admin Panel</h2>
        <nav>
          <ul>
            <li className="py-2 px-3 hover:bg-gray-700 rounded mb-2 cursor-pointer">Dashboard</li>
            <li className="py-2 px-3 hover:bg-gray-700 rounded mb-2 cursor-pointer">Users</li>
            <li className="py-2 px-3 hover:bg-gray-700 rounded mb-2 cursor-pointer">Settings</li>
            <li className="py-2 px-3 hover:bg-gray-700 rounded mb-2 cursor-pointer">Logs</li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-8">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Pending Users</h1>
          <div className="text-sm text-gray-600">Preview mode — UI only</div>
        </header>

        <section className="bg-white shadow rounded overflow-hidden">
          <table className="w-full table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Name</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Email</th>
                <th className="px-6 py-3 text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingUsers.map((u, idx) => (
                <tr key={u.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-6 py-4">{u.fullName}</td>
                  <td className="px-6 py-4">{u.email}</td>
                  <td className="px-6 py-4">
                    {/* buttons are UI-only (no API) */}
                    <button className="mr-2 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded">Approve</button>
                    <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* empty state example (toggle by removing mock data) */}
          {pendingUsers.length === 0 && (
            <div className="p-6 text-center text-gray-500">No pending users.</div>
          )}
        </section>
      </main>
    </div>
  );
}







// import React, { useEffect, useState } from "react";
// import axios from "axios";
// export default function AdminPage() {
//   const [pendingUsers, setPendingUsers] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Fetch pending users from backend
//   const fetchPendingUsers = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get("/api/admin/pending-users", {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });
//       setPendingUsers(res.data); // backend should return array of users
//       setLoading(false);
//     } catch (err) {
//       console.error(err);
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPendingUsers();
//   }, []);

//   // Approve user
//   const handleApprove = async (userId) => {
//     try {
//       await axios.post(
//         `/api/admin/users/${userId}/approve`,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );
//       fetchPendingUsers(); // refresh list
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // Remove user
//   const handleRemove = async (userId) => {
//     try {
//       await axios.post(
//         `/api/admin/users/${userId}/remove`,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );
//       fetchPendingUsers(); // refresh list
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <div className="flex min-h-screen">
//       {/* Sidebar */}
//       <div className="w-64 bg-gray-800 text-white p-5">
//         <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
//         <ul>
//           <li className="py-2 px-3 hover:bg-gray-700 rounded mb-2">Dashboard</li>
//           <li className="py-2 px-3 hover:bg-gray-700 rounded mb-2">Users</li>
//           <li className="py-2 px-3 hover:bg-gray-700 rounded mb-2">Settings</li>
//         </ul>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 bg-gray-100 p-6">
//         <h1 className="text-3xl font-bold mb-4">Pending Users</h1>
//         {loading ? (
//           <p>Loading...</p>
//         ) : pendingUsers.length === 0 ? (
//           <p className="text-gray-600">No pending users.</p>
//         ) : (
//           <table className="w-full table-auto border border-gray-300">
//             <thead>
//               <tr className="bg-gray-200">
//                 <th className="border px-4 py-2">Name</th>
//                 <th className="border px-4 py-2">Email</th>
//                 <th className="border px-4 py-2">Actions</th>
//               </tr>
//             </thead>
//             <tbody>

//               {pendingUsers.map((user) => (
//                 <tr key={user.id}>
//                   <td className="border px-4 py-2">{user.fullName}</td>
//                   <td className="border px-4 py-2">{user.email}</td>
//                   <td className="border px-4 py-2 space-x-2">
//                     <button
//                       className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
//                       onClick={() => handleApprove(user.id)}
//                     >
//                       Approve
//                     </button>
//                     <button
//                       className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
//                       onClick={() => handleRemove(user.id)}
//                     >
//                       Remove
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   );
// }
