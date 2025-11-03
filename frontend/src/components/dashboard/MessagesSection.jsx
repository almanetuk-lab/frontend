import React, { useState, useEffect, useRef } from "react";
import { chatApi } from '../services/chatApi';
import io from 'socket.io-client';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://backend-q0wc.onrender.com";

export default function MessagesSection() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [fileUploading, setFileUploading] = useState(false);
  const [currentUserId] = useState(1);
  
  const socketRef = useRef();
  const fileInputRef = useRef();
  const messagesEndRef = useRef();

  // ✅ Socket.IO Connection - YEH ADD KARNA IMPORTANT HAI
  useEffect(() => {
    console.log("🔌 Connecting to Socket.IO...");
    socketRef.current = io(API_BASE_URL);
    
    socketRef.current.emit('join', { userId: currentUserId });
    console.log("✅ Socket connected for user:", currentUserId);

    // Real-time message listener
    socketRef.current.on('new_message', (message) => {
      console.log("📩 New message received via socket:", message);
      
      if (selectedUser && (
        (message.sender_id === selectedUser.id && message.receiver_id === currentUserId) ||
        (message.receiver_id === selectedUser.id && message.sender_id === currentUserId)
      )) {
        console.log("✅ Adding message to UI");
        setMessages(prev => [...prev, message]);
      }
    });

    socketRef.current.on('connect', () => {
      console.log("✅ Socket.IO Connected successfully");
    });

    socketRef.current.on('disconnect', () => {
      console.log("❌ Socket.IO Disconnected");
    });

    return () => {
      if (socketRef.current) {
        console.log("🔌 Disconnecting socket...");
        socketRef.current.disconnect();
      }
    };
  }, [currentUserId, selectedUser]);

  // ✅ Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ Search users with REAL API
  const searchUsers = async (query) => {
    try {
      console.log("🔍 Searching users with query:", query);
      
      if (!query.trim()) {
        setUsers([]);
        return;
      }

      const response = await chatApi.searchUsers(query);
      console.log("✅ Users found:", response.data);
      setUsers(response.data);
    } catch (error) {
      console.error("❌ Error searching users:", error);
      console.log("📝 Error details:", error.response?.data);
      setUsers([]);
    }
  };

  // ✅ Load messages with REAL API
  const loadMessages = async (userId) => {
    try {
      console.log("📨 Loading messages for user:", userId);
      
      const response = await chatApi.getMessages(userId, currentUserId);
      console.log("✅ Messages loaded:", response.data);
      setMessages(response.data || []);
    } catch (error) {
      console.error("❌ Error loading messages:", error);
      console.log("📝 Error details:", error.response?.data);
      setMessages([]);
    }
  };

  // ✅ Handle user selection
  const handleUserSelect = (user) => {
    console.log("👤 User selected:", user);
    setSelectedUser(user);
    loadMessages(user.id);
  };

  // ✅ Send message with REAL API - YEH FIX KARTA HOON
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedUser) {
      console.log("⚠️ Cannot send: No message or user selected");
      return;
    }

    try {
      console.log("🚀 Sending message:", {
        content: newMessage.trim(),
        to: selectedUser.id,
        from: currentUserId
      });

      // ✅ PEHLE UI MEIN MESSAGE ADD KARO
      const tempMsg = {
        id: Date.now(), // Temporary ID
        sender_id: currentUserId,
        receiver_id: selectedUser.id,
        content: newMessage.trim(),
        created_at: new Date().toISOString(),
        attachment_url: null
      };
      
      setMessages(prev => [...prev, tempMsg]);
      setNewMessage("");

      // ✅ PHIR API CALL KARO
      const response = await chatApi.sendMessage({
        sender_id: currentUserId,
        receiver_id: selectedUser.id,
        content: newMessage.trim(),
        attachment_url: null
      });

      console.log("✅ Message sent successfully via API:", response.data);

      // ✅ SERVER SE REAL MESSAGE AAYEGA SOCKET.IO KE THROUGH
      // Isliye temporary message ko replace karne ki zaroorat nahi
      
    } catch (error) {
      console.error("❌ Error sending message:", error);
      console.log("📝 Error details:", error.response?.data);
      
      // ❌ Agar error aaye toh temporary message remove karo
      setMessages(prev => prev.filter(msg => msg.id !== tempMsg.id));
    }
  };

  // ✅ File upload with REAL API
  const handleFileUpload = async (file) => {
    if (!selectedUser) {
      console.log("⚠️ No user selected for file upload");
      return;
    }
    
    setFileUploading(true);
    try {
      console.log("📁 Uploading file:", file.name);
      
      const uploadResponse = await chatApi.uploadFile(file);
      console.log("✅ File uploaded:", uploadResponse.data);
      
      if (uploadResponse.data.url) {
        await chatApi.sendMessage({
          sender_id: currentUserId,
          receiver_id: selectedUser.id,
          content: '',
          attachment_url: uploadResponse.data.url
        });
        
        // Socket.IO se automatic message aa jayega
      }
    } catch (error) {
      console.error("❌ Error uploading file:", error);
      console.log("📝 Error details:", error.response?.data);
    } finally {
      setFileUploading(false);
    }
  };

  // ✅ Handle file input change
  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file && selectedUser) {
      handleFileUpload(file);
    }
    e.target.value = '';
  };

  // ✅ Format message time
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  // ✅ Search users when search term changes (with debounce)
  useEffect(() => {
    if (searchTerm.trim()) {
      const timeoutId = setTimeout(() => {
        searchUsers(searchTerm);
      }, 500);
      
      return () => clearTimeout(timeoutId);
    } else {
      setUsers([]);
    }
  }, [searchTerm]);

  // ✅ Enter key to send message
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Messages</h2>
      
      {/* Connection Status */}
      <div className="mb-4 p-2 bg-blue-100 border border-blue-400 rounded-lg">
        <p className="text-blue-800 text-sm">
          <strong>Real Time Chat System </strong>
        </p>
      </div>
      
      <div className="bg-white rounded-2xl shadow-lg h-96 flex border border-gray-200">
        {/* Chat List */}
        <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              />
            </div>
          </div>
          
          {/* Search Results */}
          {users.map(user => (
            <div
              key={user.id}
              onClick={() => handleUserSelect(user)}
              className={`p-4 border-b border-gray-100 cursor-pointer transition ${
                selectedUser?.id === user.id ? 'bg-indigo-50' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold">
                    {user.name?.charAt(0) || 'U'}
                  </div>
                  <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                    user.online ? 'bg-green-500' : 'bg-gray-400'
                  }`}></div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <p className="font-medium text-gray-800 truncate">{user.name}</p>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{user.email}</p>
                </div>
              </div>
            </div>
          ))}
          
          {searchTerm && users.length === 0 && (
            <div className="p-4 text-center text-gray-500">
              No users found
            </div>
          )}
          
          {!searchTerm && (
            <div className="p-4 text-center text-gray-500">
              Search for users to start chatting
            </div>
          )}
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedUser ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold">
                    {selectedUser.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{selectedUser.name}</p>
                    <p className="text-sm text-gray-500">
                      {selectedUser.online ? '🟢 Online' : '⚫ Offline'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender_id === currentUserId ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`rounded-2xl p-4 max-w-xs shadow-sm ${
                          message.sender_id === currentUserId
                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                            : 'bg-white text-gray-800'
                        }`}
                      >
                        {message.attachment_url && (
                          <div className="mb-2">
                            <img 
                              src={message.attachment_url} 
                              alt="Attachment" 
                              className="rounded-lg max-w-full h-auto"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                        {message.content && (
                          <p className="break-words">{message.content}</p>
                        )}
                        <p
                          className={`text-xs mt-2 ${
                            message.sender_id === currentUserId
                              ? 'text-indigo-200'
                              : 'text-gray-500'
                          }`}
                        >
                          {formatTime(message.created_at)}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileInputChange}
                    className="hidden"
                    accept="image/*,video/*,audio/*,application/*"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={fileUploading || !selectedUser}
                    className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 disabled:opacity-50 transition-colors"
                    title="Attach file"
                  >
                    {fileUploading ? '📤' : '📎'}
                  </button>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    onKeyPress={handleKeyPress}
                    disabled={!selectedUser}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || !selectedUser}
                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    Send
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500 p-8">
              <div className="text-6xl mb-4">💬</div>
              <p className="text-lg font-medium text-gray-600 mb-2">No chat selected</p>
              <p className="text-gray-500 text-center">Search and select a user to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



















































// //  old code 
// import React, { useState, useEffect, useRef } from "react";
// import { chatApi } from '../services/chatApi';

// export default function MessagesSection() {
//   const [users, setUsers] = useState([]);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [fileUploading, setFileUploading] = useState(false);
//   const [currentUserId] = useState(1); // Aap authentication se user ID le sakte hain
  
//   const fileInputRef = useRef();
//   const messagesEndRef = useRef();

//   // ✅ Auto-scroll to bottom
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   // ✅ Search users with REAL API
//   const searchUsers = async (query) => {
//     try {
//       console.log("🔍 Searching users with query:", query);
      
//       if (!query.trim()) {
//         setUsers([]);
//         return;
//       }

//       const response = await chatApi.searchUsers(query);
//       console.log("✅ Users found:", response.data);
//       setUsers(response.data);
//     } catch (error) {
//       console.error("❌ Error searching users:", error);
//       console.log("📝 Error details:", error.response?.data);
//       setUsers([]);
//     }
//   };

//   // ✅ Load messages with REAL API
//   const loadMessages = async (userId) => {
//     try {
//       console.log("📨 Loading messages for user:", userId);
      
//       const response = await chatApi.getMessages(userId, currentUserId);
//       console.log("✅ Messages loaded:", response.data);
//       setMessages(response.data || []);
//     } catch (error) {
//       console.error("❌ Error loading messages:", error);
//       console.log("📝 Error details:", error.response?.data);
//       setMessages([]);
//     }
//   };

//   // ✅ Handle user selection
//   const handleUserSelect = (user) => {
//     console.log("👤 User selected:", user);
//     setSelectedUser(user);
//     loadMessages(user.id);
//   };

//   // ✅ Send message with REAL API
//   const handleSendMessage = async () => {
//     if (!newMessage.trim() || !selectedUser) {
//       console.log("⚠️ Cannot send: No message or user selected");
//       return;
//     }

//     try {
//       console.log("🚀 Sending message:", {
//         content: newMessage.trim(),
//         to: selectedUser.id,
//         from: currentUserId
//       });

//       const response = await chatApi.sendMessage({
//         sender_id: currentUserId,
//         receiver_id: selectedUser.id,
//         content: newMessage.trim(),
//         attachment_url: null
//       });

//       console.log("✅ Message sent successfully:", response.data);
      
//       // ✅ IMMEDIATELY ADD MESSAGE TO UI
//       const newMsg = {
//         id: Date.now(), // Temporary ID
//         sender_id: currentUserId,
//         receiver_id: selectedUser.id,
//         content: newMessage.trim(),
//         created_at: new Date().toISOString(),
//         attachment_url: null
//       };
      
//       setMessages(prev => [...prev, newMsg]);
//       setNewMessage("");
      
//     } catch (error) {
//       console.error("❌ Error sending message:", error);
//       console.log("📝 Error details:", error.response?.data);
//     }
//   };

//   // ✅ File upload with REAL API
//   const handleFileUpload = async (file) => {
//     if (!selectedUser) {
//       console.log("⚠️ No user selected for file upload");
//       return;
//     }
    
//     setFileUploading(true);
//     try {
//       console.log("📁 Uploading file:", file.name);
      
//       const uploadResponse = await chatApi.uploadFile(file);
//       console.log("✅ File uploaded:", uploadResponse.data);
      
//       if (uploadResponse.data.url) {
//         await chatApi.sendMessage({
//           sender_id: currentUserId,
//           receiver_id: selectedUser.id,
//           content: '',
//           attachment_url: uploadResponse.data.url
//         });
        
//         // Reload messages after file send
//         loadMessages(selectedUser.id);
//       }
//     } catch (error) {
//       console.error("❌ Error uploading file:", error);
//       console.log("📝 Error details:", error.response?.data);
//     } finally {
//       setFileUploading(false);
//     }
//   };

//   // ✅ Handle file input change
//   const handleFileInputChange = (e) => {
//     const file = e.target.files[0];
//     if (file && selectedUser) {
//       handleFileUpload(file);
//     }
//     e.target.value = '';
//   };

//   // ✅ Format message time
//   const formatTime = (timestamp) => {
//     if (!timestamp) return '';
//     const date = new Date(timestamp);
//     return date.toLocaleTimeString('en-US', { 
//       hour: 'numeric', 
//       minute: '2-digit',
//       hour12: true 
//     });
//   };

//   // ✅ Search users when search term changes (with debounce)
//   useEffect(() => {
//     if (searchTerm.trim()) {
//       const timeoutId = setTimeout(() => {
//         searchUsers(searchTerm);
//       }, 500); // 500ms debounce
      
//       return () => clearTimeout(timeoutId);
//     } else {
//       setUsers([]);
//     }
//   }, [searchTerm]);

//   // ✅ Enter key to send message
//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter') {
//       handleSendMessage();
//     }
//   };

//   return (
//     <div className="bg-white rounded-2xl shadow-lg p-6">
//       <h2 className="text-2xl font-bold text-gray-800 mb-6">Messages</h2>
//       <div className="bg-white rounded-2xl shadow-lg h-96 flex border border-gray-200">
//         {/* Chat List */}
//         <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
//           <div className="p-4 border-b border-gray-200">
//             <div className="flex gap-2">
//               <input
//                 type="text"
//                 placeholder="Search users..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="flex-1 px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
//               />
//             </div>
//           </div>
          
//           {/* Search Results */}
//           {users.map(user => (
//             <div
//               key={user.id}
//               onClick={() => handleUserSelect(user)}
//               className={`p-4 border-b border-gray-100 cursor-pointer transition ${
//                 selectedUser?.id === user.id ? 'bg-indigo-50' : 'hover:bg-gray-50'
//               }`}
//             >
//               <div className="flex items-center gap-3">
//                 <div className="relative">
//                   <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold">
//                     {user.name?.charAt(0) || 'U'}
//                   </div>
//                   <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
//                     user.online ? 'bg-green-500' : 'bg-gray-400'
//                   }`}></div>
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <div className="flex justify-between items-center mb-1">
//                     <p className="font-medium text-gray-800 truncate">{user.name}</p>
//                   </div>
//                   <p className="text-sm text-gray-600 truncate">{user.email}</p>
//                 </div>
//               </div>
//             </div>
//           ))}
          
//           {searchTerm && users.length === 0 && (
//             <div className="p-4 text-center text-gray-500">
//               No users found
//             </div>
//           )}
          
//           {!searchTerm && (
//             <div className="p-4 text-center text-gray-500">
//               Search for users to start chatting
//             </div>
//           )}
//         </div>

//         {/* Chat Area */}
//         <div className="flex-1 flex flex-col">
//           {selectedUser ? (
//             <>
//               {/* Chat Header */}
//               <div className="p-4 border-b border-gray-200">
//                 <div className="flex items-center gap-3">
//                   <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold">
//                     {selectedUser.name?.charAt(0) || 'U'}
//                   </div>
//                   <div>
//                     <p className="font-medium text-gray-800">{selectedUser.name}</p>
//                     <p className="text-sm text-gray-500">
//                       {selectedUser.online ? '🟢 Online' : '⚫ Offline'}
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* Messages */}
//               <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
//                 <div className="space-y-4">
//                   {messages.map((message) => (
//                     <div
//                       key={message.id}
//                       className={`flex ${
//                         message.sender_id === currentUserId ? 'justify-end' : 'justify-start'
//                       }`}
//                     >
//                       <div
//                         className={`rounded-2xl p-4 max-w-xs shadow-sm ${
//                           message.sender_id === currentUserId
//                             ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
//                             : 'bg-white text-gray-800'
//                         }`}
//                       >
//                         {message.attachment_url && (
//                           <div className="mb-2">
//                             <img 
//                               src={message.attachment_url} 
//                               alt="Attachment" 
//                               className="rounded-lg max-w-full h-auto"
//                               onError={(e) => {
//                                 e.target.style.display = 'none';
//                               }}
//                             />
//                           </div>
//                         )}
//                         {message.content && (
//                           <p className="break-words">{message.content}</p>
//                         )}
//                         <p
//                           className={`text-xs mt-2 ${
//                             message.sender_id === currentUserId
//                               ? 'text-indigo-200'
//                               : 'text-gray-500'
//                           }`}
//                         >
//                           {formatTime(message.created_at)}
//                         </p>
//                       </div>
//                     </div>
//                   ))}
//                   <div ref={messagesEndRef} />
//                 </div>
//               </div>

//               {/* Message Input */}
//               <div className="p-4 border-t border-gray-200">
//                 <div className="flex gap-2">
//                   <input
//                     type="file"
//                     ref={fileInputRef}
//                     onChange={handleFileInputChange}
//                     className="hidden"
//                     accept="image/*,video/*,audio/*,application/*"
//                   />
//                   <button
//                     onClick={() => fileInputRef.current?.click()}
//                     disabled={fileUploading || !selectedUser}
//                     className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 disabled:opacity-50 transition-colors"
//                     title="Attach file"
//                   >
//                     {fileUploading ? '📤' : '📎'}
//                   </button>
//                   <input
//                     type="text"
//                     value={newMessage}
//                     onChange={(e) => setNewMessage(e.target.value)}
//                     placeholder="Type a message..."
//                     className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
//                     onKeyPress={handleKeyPress}
//                     disabled={!selectedUser}
//                   />
//                   <button
//                     onClick={handleSendMessage}
//                     disabled={!newMessage.trim() || !selectedUser}
//                     className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
//                   >
//                     Send
//                   </button>
//                 </div>
//               </div>
//             </>
//           ) : (
//             <div className="flex-1 flex flex-col items-center justify-center text-gray-500 p-8">
//               <div className="text-6xl mb-4">💬</div>
//               <p className="text-lg font-medium text-gray-600 mb-2">No chat selected</p>
//               <p className="text-gray-500 text-center">Search and select a user to start messaging</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// ----------------------------------------------------------------------//
//----------------------------------------------------------------------------//

























// old code 2
// import React, { useState, useEffect, useRef } from "react";
// import io from 'socket.io-client';
// import { chatApi } from '../services/chatApi';

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://backend-q0wc.onrender.com";

// export default function MessagesSection() {
//   const [users, setUsers] = useState([]);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [fileUploading, setFileUploading] = useState(false);
//   const [currentUserId] = useState(1);
  
//   const socketRef = useRef();
//   const fileInputRef = useRef();
//   const messagesEndRef = useRef();

//   // ✅ Socket.IO connection
//   useEffect(() => {
//     socketRef.current = io(API_BASE_URL);
//     socketRef.current.emit('join', { userId: currentUserId });

//     socketRef.current.on('new_message', (message) => {
//       if (
//         (message.sender_id === selectedUser?.id && message.receiver_id === currentUserId) ||
//         (message.receiver_id === selectedUser?.id && message.sender_id === currentUserId)
//       ) {
//         setMessages(prev => [...prev, message]);
//       }
//     });

//     return () => {
//       if (socketRef.current) {
//         socketRef.current.disconnect();
//       }
//     };
//   }, [currentUserId, selectedUser]);

//   // ✅ Auto-scroll to bottom
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   // ✅ Search users with chatApi
//   const searchUsers = async (query) => {
//     try {
//       const response = await chatApi.searchUsers(query);
//       setUsers(response.data);
//     } catch (error) {
//       console.error('Error searching users:', error);
//       setUsers([]);
//     }
//   };

//   // ✅ Load messages with chatApi
//   const loadMessages = async (userId) => {
//     try {
//       const response = await chatApi.getMessages(userId, currentUserId);
//       setMessages(response.data || []);
//     } catch (error) {
//       console.error('Error loading messages:', error);
//       setMessages([]);
//     }
//   };

//   // ✅ Handle user selection
//   const handleUserSelect = (user) => {
//     setSelectedUser(user);
//     loadMessages(user.id);
//   };

//   // ✅ Send message with chatApi
//   const handleSendMessage = async () => {
//     if (!newMessage.trim() || !selectedUser) return;

//     try {
//       await chatApi.sendMessage({
//         sender_id: currentUserId,
//         receiver_id: selectedUser.id,
//         content: newMessage.trim(),
//         attachment_url: null
//       });
//       setNewMessage("");
//     } catch (error) {
//       console.error('Error sending message:', error.response?.data || error.message);
//     }
//   };

//   // ✅ File upload with chatApi
//   const handleFileUpload = async (file) => {
//     if (!selectedUser) return;
    
//     setFileUploading(true);
//     try {
//       const uploadResponse = await chatApi.uploadFile(file);
      
//       if (uploadResponse.data.url) {
//         await chatApi.sendMessage({
//           sender_id: currentUserId,
//           receiver_id: selectedUser.id,
//           content: '',
//           attachment_url: uploadResponse.data.url
//         });
//       }
//     } catch (error) {
//       console.error('Error uploading file:', error.response?.data || error.message);
//     } finally {
//       setFileUploading(false);
//     }
//   };

//   // ✅ Handle file input change
//   const handleFileInputChange = (e) => {
//     const file = e.target.files[0];
//     if (file && selectedUser) {
//       handleFileUpload(file);
//     }
//     e.target.value = '';
//   };

//   // ✅ Format message time
//   const formatTime = (timestamp) => {
//     if (!timestamp) return '';
//     const date = new Date(timestamp);
//     return date.toLocaleTimeString('en-US', { 
//       hour: 'numeric', 
//       minute: '2-digit',
//       hour12: true 
//     });
//   };

//   // ✅ Search users when search term changes
//   useEffect(() => {
//     if (searchTerm.trim()) {
//       const timeoutId = setTimeout(() => {
//         searchUsers(searchTerm);
//       }, 300);
      
//       return () => clearTimeout(timeoutId);
//     } else {
//       setUsers([]);
//     }
//   }, [searchTerm]);

//   return (
//     <div className="bg-white rounded-2xl shadow-lg p-6">
//       <h2 className="text-2xl font-bold text-gray-800 mb-6">Messages</h2>
//       <div className="bg-white rounded-2xl shadow-lg h-96 flex border border-gray-200">
//         {/* Chat List */}
//         <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
//           <div className="p-4 border-b border-gray-200">
//             <div className="flex gap-2">
//               <input
//                 type="text"
//                 placeholder="Search users..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="flex-1 px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
//               />
//             </div>
//           </div>
          
//           {/* Search Results */}
//           {users.map(user => (
//             <div
//               key={user.id}
//               onClick={() => handleUserSelect(user)}
//               className={`p-4 border-b border-gray-100 cursor-pointer transition ${
//                 selectedUser?.id === user.id ? 'bg-indigo-50' : 'hover:bg-gray-50'
//               }`}
//             >
//               <div className="flex items-center gap-3">
//                 <div className="relative">
//                   <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold">
//                     {user.name?.charAt(0) || 'U'}
//                   </div>
//                   <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <div className="flex justify-between items-center mb-1">
//                     <p className="font-medium text-gray-800 truncate">{user.name}</p>
//                   </div>
//                   <p className="text-sm text-gray-600 truncate">{user.email}</p>
//                 </div>
//               </div>
//             </div>
//           ))}
          
//           {searchTerm && users.length === 0 && (
//             <div className="p-4 text-center text-gray-500">
//               No users found
//             </div>
//           )}
          
//           {!searchTerm && (
//             <div className="p-4 text-center text-gray-500">
//               Search for users to start chatting
//             </div>
//           )}
//         </div>

//         {/* Chat Area */}
//         <div className="flex-1 flex flex-col">
//           {selectedUser ? (
//             <>
//               {/* Chat Header */}
//               <div className="p-4 border-b border-gray-200">
//                 <div className="flex items-center gap-3">
//                   <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold">
//                     {selectedUser.name?.charAt(0) || 'U'}
//                   </div>
//                   <div>
//                     <p className="font-medium text-gray-800">{selectedUser.name}</p>
//                     <p className="text-sm text-gray-500">🟢 Online</p>
//                   </div>
//                 </div>
//               </div>

//               {/* Messages */}
//               <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
//                 <div className="space-y-4">
//                   {messages.map((message) => (
//                     <div
//                       key={message.id}
//                       className={`flex ${
//                         message.sender_id === currentUserId ? 'justify-end' : 'justify-start'
//                       }`}
//                     >
//                       <div
//                         className={`rounded-2xl p-4 max-w-xs shadow-sm ${
//                           message.sender_id === currentUserId
//                             ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
//                             : 'bg-white text-gray-800'
//                         }`}
//                       >
//                         {message.attachment_url && (
//                           <div className="mb-2">
//                             <img 
//                               src={message.attachment_url} 
//                               alt="Attachment" 
//                               className="rounded-lg max-w-full h-auto"
//                               onError={(e) => {
//                                 e.target.style.display = 'none';
//                               }}
//                             />
//                           </div>
//                         )}
//                         {message.content && (
//                           <p className="break-words">{message.content}</p>
//                         )}
//                         <p
//                           className={`text-xs mt-2 ${
//                             message.sender_id === currentUserId
//                               ? 'text-indigo-200'
//                               : 'text-gray-500'
//                           }`}
//                         >
//                           {formatTime(message.created_at)}
//                         </p>
//                       </div>
//                     </div>
//                   ))}
//                   <div ref={messagesEndRef} />
//                 </div>
//               </div>

//               {/* Message Input */}
//               <div className="p-4 border-t border-gray-200">
//                 <div className="flex gap-2">
//                   <input
//                     type="file"
//                     ref={fileInputRef}
//                     onChange={handleFileInputChange}
//                     className="hidden"
//                     accept="image/*,video/*,audio/*,application/*"
//                   />
//                   <button
//                     onClick={() => fileInputRef.current?.click()}
//                     disabled={fileUploading || !selectedUser}
//                     className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 disabled:opacity-50 transition-colors"
//                     title="Attach file"
//                   >
//                     {fileUploading ? '📤' : '📎'}
//                   </button>
//                   <input
//                     type="text"
//                     value={newMessage}
//                     onChange={(e) => setNewMessage(e.target.value)}
//                     placeholder="Type a message..."
//                     className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
//                     onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
//                     disabled={!selectedUser}
//                   />
//                   <button
//                     onClick={handleSendMessage}
//                     disabled={!newMessage.trim() || !selectedUser}
//                     className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
//                   >
//                     Send
//                   </button>
//                 </div>
//               </div>
//             </>
//           ) : (
//             <div className="flex-1 flex flex-col items-center justify-center text-gray-500 p-8">
//               <div className="text-6xl mb-4">💬</div>
//               <p className="text-lg font-medium text-gray-600 mb-2">No chat selected</p>
//               <p className="text-gray-500 text-center">Search and select a user to start messaging</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }















