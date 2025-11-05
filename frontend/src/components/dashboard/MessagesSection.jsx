import React, { useState, useEffect, useRef, useCallback } from "react";
import { chatApi } from '../services/chatApi';
import io from 'socket.io-client';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://backend-q0wc.onrender.com";

export default function MessagesSection() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [reactions, setReactions] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [fileUploading, setFileUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showReactionPicker, setShowReactionPicker] = useState(null);

  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const socketRef = useRef(null);
  const fileInputRef = useRef();
  const messagesEndRef = useRef();
  const [socketConnected, setSocketConnected] = useState(false);

  // ✅ Get current user once
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        const userId = userData.user_id || userData.id;
        if (userId) {
          setCurrentUser(userData);
          setCurrentUserId(userId);
          console.log("✅ User ID Set:", userId);
        }
      }
    } catch (err) {
      console.error('Error getting user:', err);
    }
  }, []);

  // ✅ FIXED: STABLE SOCKET CONNECTION
  useEffect(() => {
    if (!currentUserId) return;

    console.log("🔌 Initializing socket for user:", currentUserId);

    // Clean previous socket
    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    const socket = io(API_BASE_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('✅ Socket connected');
      setSocketConnected(true);
      socket.emit('join', { userId: currentUserId });
    });

    socket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
      setSocketConnected(false);
    });

    // ✅ FIXED: SIMPLIFIED MESSAGE HANDLER - NO DUPLICATES
    const handleIncomingMessage = (message) => {
      console.log('📩 Socket message received:', message);
      
      if (!selectedUser) return;

      // Check if message belongs to current conversation
      const isRelevant = 
        (message.sender_id === currentUserId && message.receiver_id === selectedUser.id) ||
        (message.sender_id === selectedUser.id && message.receiver_id === currentUserId);

      if (isRelevant) {
        setMessages(prev => {
          // Check if message already exists
          const exists = prev.some(m => m.id === message.id);
          if (exists) return prev;

          // Remove any temporary messages from same sender with same content
          const filtered = prev.filter(m => 
            !m.isTemporary || 
            (m.isTemporary && m.content !== message.content)
          );

          return [...filtered, message];
        });
      }
    };

    socket.on('new_message', handleIncomingMessage);

    return () => {
      socket.off('new_message', handleIncomingMessage);
      socket.disconnect();
    };
  }, [currentUserId, selectedUser]);

  // ✅ Auto-scroll
  useEffect(() => {
    if (messagesEndRef.current && messages.length > 0) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // ✅ Search users
  const searchUsers = useCallback(async (query) => {
    if (!query.trim() || !currentUserId) return;
    setLoading(true);
    try {
      const response = await chatApi.searchUsers(query);
      const filteredUsers = (response.data || [])
        .filter(user => user.id !== currentUserId)
        .map(user => ({
          ...user,
          name: user.name || user.email?.split('@')[0] || 'User',
          email: user.email || 'No email',
        }));
      setUsers(filteredUsers);
    } catch (error) {
      console.error('Search error:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [currentUserId]);

  // ✅ FIXED: LOAD MESSAGES - PROPERLY HANDLE RESPONSE
  const loadMessages = async (otherUserId) => {
    if (!currentUserId) return;
    try {
      console.log(`📨 Loading messages between ${currentUserId} and ${otherUserId}`);
      setLoading(true);
      
      const response = await chatApi.getMessages(otherUserId, currentUserId);
      console.log('📝 Messages response:', response.data);
      
      // Handle different response formats
      let messagesData = response.data;
      if (Array.isArray(response.data)) {
        messagesData = response.data;
      } else if (response.data && Array.isArray(response.data.messages)) {
        messagesData = response.data.messages;
      } else {
        messagesData = [];
      }

      // Filter for current conversation and sort
      const conversationMessages = messagesData
        .filter(msg => 
          (msg.sender_id === currentUserId && msg.receiver_id === otherUserId) ||
          (msg.sender_id === otherUserId && msg.receiver_id === currentUserId)
        )
        .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

      console.log(`✅ Loaded ${conversationMessages.length} messages`);
      setMessages(conversationMessages);
    } catch (err) {
      console.error('❌ Load messages error:', err);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Load reactions
  const loadReactions = async (userId) => {
    if (!currentUserId) return;
    try {
      const res = await chatApi.getReactions(currentUserId, userId);
      setReactions(res.data || []);
    } catch (e) {
      console.error('Load reactions error:', e);
      setReactions([]);
    }
  };

  // ✅ FIXED: SELECT USER - PRESERVE OLD MESSAGES
  const handleUserSelect = async (user) => {
    if (!currentUserId) return;
    
    console.log('👤 Selecting user:', user.name);
    const selectedUserData = {
      id: user.id,
      name: user.name || user.email?.split('@')[0] || 'User',
      email: user.email,
    };
    
    setSelectedUser(selectedUserData);
    
    // Load messages for selected user
    await loadMessages(user.id);
    await loadReactions(user.id);
  };

  // ✅ FIXED: SEND MESSAGE - NO DOUBLE MESSAGES
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedUser || !currentUserId) return;

    const messageContent = newMessage.trim();
    console.log(`🚀 Sending: "${messageContent}" to ${selectedUser.name}`);

    // Create temporary message
    const tempMsg = {
      id: `temp-${Date.now()}`,
      sender_id: currentUserId,
      receiver_id: selectedUser.id,
      content: messageContent,
      created_at: new Date().toISOString(),
      attachment_url: null,
      isTemporary: true,
    };

    // Add temporary message to UI
    setMessages(prev => [...prev, tempMsg]);
    setNewMessage("");

    try {
      // Send via API
      const response = await chatApi.sendMessage({
        sender_id: currentUserId,
        receiver_id: selectedUser.id,
        content: messageContent,
        attachment_url: null
      });

      console.log('✅ Message sent successfully');

      // Wait for socket to deliver real message
      // If not delivered in 3 seconds, replace manually
      setTimeout(() => {
        setMessages(prev => {
          const realMessageExists = prev.some(msg => 
            !msg.isTemporary && 
            msg.sender_id === currentUserId && 
            msg.content === messageContent
          );
          
          if (!realMessageExists && response.data) {
            console.log('🔄 Replacing temporary with real message');
            return prev.map(msg => 
              msg.id === tempMsg.id ? response.data : msg
            );
          }
          return prev;
        });
      }, 3000);

    } catch (error) {
      console.error('❌ Send failed:', error);
      // Remove temporary message on error
      setMessages(prev => prev.filter(msg => msg.id !== tempMsg.id));
      alert('Failed to send message');
    }
  };

  // ✅ Reconnect socket
  const reconnectSocket = () => {
    if (socketRef.current) {
      socketRef.current.connect();
    }
  };

  // ✅ File upload
  const handleFileUpload = async (file) => {
    if (!selectedUser || !currentUserId) return;
    
    setFileUploading(true);
    const tempId = `file-${Date.now()}`;
    const tempMsg = { 
      id: tempId, 
      sender_id: currentUserId, 
      receiver_id: selectedUser.id, 
      content: `Sending: ${file.name}`, 
      isTemporary: true, 
      isUploading: true 
    };
    
    setMessages(prev => [...prev, tempMsg]);

    try {
      const uploadResponse = await chatApi.uploadFile(file);
      if (uploadResponse.data?.url) {
        await chatApi.sendMessage({
          sender_id: currentUserId,
          receiver_id: selectedUser.id,
          content: `File: ${file.name}`,
          attachment_url: uploadResponse.data.url
        });
        
        // Remove temporary after successful send
        setTimeout(() => {
          setMessages(prev => prev.filter(msg => msg.id !== tempId));
        }, 1000);
      }
    } catch (err) {
      console.error('Upload failed:', err);
      setMessages(prev => prev.filter(msg => msg.id !== tempId));
    } finally {
      setFileUploading(false);
    }
  };

  // ✅ Add reaction
  const addReaction = async (messageId, emoji) => {
    if (!currentUserId) return;
    try {
      await chatApi.addReaction({
        message_id: messageId,
        user_id: currentUserId,
        emoji: emoji
      });
      setShowReactionPicker(null);
    } catch (err) {
      console.error('Reaction failed:', err);
    }
  };

  // ✅ File input
  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file && selectedUser && currentUserId) {
      handleFileUpload(file);
    }
    e.target.value = '';
  };

  // ✅ Search effect
  useEffect(() => {
    if (searchTerm.trim() && currentUserId) {
      const timeoutId = setTimeout(() => {
        searchUsers(searchTerm);
      }, 500);
      return () => clearTimeout(timeoutId);
    } else {
      setUsers([]);
    }
  }, [searchTerm, searchUsers, currentUserId]);

  // ✅ Enter key handler
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // ✅ Format time
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    });
  };

  // ✅ Get reactions for message
  const getMessageReactions = (messageId) => {
    return reactions.filter(r => r.message_id === messageId);
  };

  // ✅ Render attachment
  const renderAttachment = (message) => {
    if (!message.attachment_url) return null;
    
    const isImage = message.attachment_url.match(/\.(jpg|jpeg|png|gif|webp)$/i);
    const fileName = message.attachment_url.split('/').pop();

    if (isImage) {
      return (
        <img 
          src={message.attachment_url} 
          alt="Attachment" 
          className="max-w-full rounded-lg max-h-48 object-cover border border-gray-200 mt-2"
        />
      );
    } else {
      return (
        <a 
          href={message.attachment_url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-3 py-2 bg-white bg-opacity-20 rounded-lg border border-white border-opacity-30 hover:bg-opacity-30 transition mt-2"
        >
          <span>📎</span>
          <span className="text-sm truncate max-w-xs">{fileName}</span>
        </a>
      );
    }
  };

  // Show login message if no user
  if (!currentUserId) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Messages</h2>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔒</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Please Login First</h3>
          <p className="text-gray-500">You need to login to access messages</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Messages</h2>

      {/* Status */}
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-blue-800 text-sm">
          <strong>User:</strong> {currentUser?.full_name} (ID: {currentUserId}) | 
          <strong> Socket:</strong> 
          <span className={socketConnected ? "text-green-600" : "text-red-600"}>
            {socketConnected ? " 🟢 Connected" : " 🔴 Disconnected"}
          </span>
          {!socketConnected && (
            <button 
              onClick={reconnectSocket} 
              className="ml-2 px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
            >
              Reconnect
            </button>
          )} | 
          <strong> Chatting with:</strong> {selectedUser?.name || 'None'} |
          <strong> Messages:</strong> {messages.length}
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg h-[600px] flex border border-gray-200">
        {/* Sidebar */}
        <div className="w-1/3 border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <input 
              type="text" 
              placeholder="Search users..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm" 
            />
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading && searchTerm ? (
              <div className="p-4 text-center text-gray-500">Searching...</div>
            ) : users.length === 0 && searchTerm ? (
              <div className="p-4 text-center text-gray-500">No users found</div>
            ) : (
              users.map(user => (
                <div
                  key={user.id}
                  onClick={() => handleUserSelect(user)}
                  className={`p-4 cursor-pointer transition border-b border-gray-100 ${
                    selectedUser?.id === user.id ? 'bg-indigo-50 border-indigo-200' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold">
                      {user.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 truncate">{user.name}</p>
                      <p className="text-sm text-gray-600 truncate">{user.email}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedUser ? (
            <>
              {/* Header */}
              <div className="p-4 border-b border-gray-200 bg-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold">
                    {selectedUser.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{selectedUser.name}</p>
                    <p className="text-sm text-gray-500">{selectedUser.email}</p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                {loading ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    <span className="ml-3 text-gray-600">Loading messages...</span>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <div className="text-4xl mb-2">💬</div>
                    <p className="font-medium">No messages yet</p>
                    <p className="text-sm">Start the conversation with {selectedUser.name}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.sender_id === currentUserId ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md relative ${
                            message.sender_id === currentUserId 
                              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' 
                              : 'bg-white text-gray-800 shadow-sm border border-gray-200'
                          } rounded-2xl p-4 ${
                            message.isTemporary ? 'opacity-70 border-2 border-dashed border-yellow-400' : ''
                          }`}
                          onMouseEnter={() => setShowReactionPicker(message.id)}
                          onMouseLeave={() => setShowReactionPicker(null)}
                        >
                          {/* Sender name for received messages */}
                          {message.sender_id !== currentUserId && (
                            <p className="text-xs font-medium text-gray-500 mb-1">
                              {selectedUser.name}
                            </p>
                          )}

                          {/* Message content */}
                          {message.content && (
                            <p className="break-words whitespace-pre-wrap">{message.content}</p>
                          )}

                          {/* Attachment */}
                          {renderAttachment(message)}

                          {/* Timestamp */}
                          <p className={`text-xs mt-2 ${
                            message.sender_id === currentUserId ? 'text-indigo-200' : 'text-gray-500'
                          }`}>
                            {formatTime(message.created_at)}
                            {message.isTemporary && ' • Sending...'}
                          </p>

                          {/* Reactions */}
                          <div className="flex flex-wrap gap-1 mt-2">
                            {getMessageReactions(message.id).map((reaction) => (
                              <span 
                                key={reaction.id} 
                                className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full"
                              >
                                {reaction.emoji}
                              </span>
                            ))}
                          </div>

                          {/* Reaction Picker */}
                          {showReactionPicker === message.id && (
                            <div className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-xl shadow-lg p-2 flex gap-1">
                              {['❤️', '👍', '😂', '😮', '😢', '🎉'].map((emoji) => (
                                <button
                                  key={emoji}
                                  onClick={() => addReaction(message.id, emoji)}
                                  className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg transition text-lg"
                                >
                                  {emoji}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex gap-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={fileUploading}
                    className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 disabled:opacity-50"
                  >
                    {fileUploading ? '📤' : '📎'}
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileInputChange}
                    className="hidden"
                    accept="*/*"
                  />
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={`Message ${selectedUser.name}...`}
                    onKeyPress={handleKeyPress}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 font-medium disabled:opacity-50"
                  >
                    Send
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500 bg-gray-50">
              <div className="text-center">
                <div className="text-6xl mb-4">💬</div>
                <p className="text-lg font-medium">Select a user to start chatting</p>
                <p className="text-sm mt-2">Search for users in the sidebar</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}





// import React, { useState, useEffect, useRef, useCallback } from "react";
// import { chatApi } from '../services/chatApi';
// import io from 'socket.io-client';

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://backend-q0wc.onrender.com";

// export default function MessagesSection() {
//   const [users, setUsers] = useState([]);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [reactions, setReactions] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [fileUploading, setFileUploading] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [showReactionPicker, setShowReactionPicker] = useState(null);
  
//   // ✅ DYNAMIC USER
//   const [currentUserId, setCurrentUserId] = useState(null);
//   const [currentUser, setCurrentUser] = useState(null);
  
//   const socketRef = useRef(null);
//   const fileInputRef = useRef();
//   const messagesEndRef = useRef();
//   const [socketConnected, setSocketConnected] = useState(false);

//   // ✅ GET USER FROM LOCALSTORAGE
//   useEffect(() => {
//     const getCurrentUser = () => {
//       try {
//         const storedUser = localStorage.getItem('currentUser');
//         console.log("📦 localStorage data:", storedUser);
        
//         if (storedUser) {
//           const userData = JSON.parse(storedUser);
//           console.log("👤 CURRENT USER:", userData);
          
//           const userId = userData.user_id || userData.id;
          
//           if (userId) {
//             setCurrentUser(userData);
//             setCurrentUserId(userId);
//             console.log("✅ Dynamic User ID Set:", userId);
//           }
//         }
//       } catch (error) {
//         console.error("❌ Error getting user:", error);
//       }
//     };

//     getCurrentUser();
//   }, []);

//   // ✅ FIXED: SOCKET CONNECTION - BETTER MANAGEMENT
//   useEffect(() => {
//     if (currentUserId) {
//       console.log("🔌 INITIALIZING SOCKET for User ID:", currentUserId);
      
//       // Disconnect existing socket
//       if (socketRef.current) {
//         socketRef.current.disconnect();
//         socketRef.current = null;
//       }

//       // Create new socket connection
//       socketRef.current = io(API_BASE_URL, {
//         transports: ['websocket', 'polling'],
//         reconnection: true,
//         reconnectionAttempts: 10,
//         reconnectionDelay: 1000,
//       });

//       // Socket event handlers
//       socketRef.current.on('connect', () => {
//         console.log("✅ SOCKET CONNECTED - ID:", socketRef.current.id);
//         setSocketConnected(true);
        
//         // Join user's personal room
//         socketRef.current.emit('join', { userId: currentUserId });
//         console.log("📢 Joined room for user:", currentUserId);
//       });

//       socketRef.current.on('disconnect', (reason) => {
//         console.log("❌ SOCKET DISCONNECTED:", reason);
//         setSocketConnected(false);
//       });

//       socketRef.current.on('connect_error', (error) => {
//         console.error("❌ SOCKET CONNECTION ERROR:", error);
//         setSocketConnected(false);
//       });

//       // ✅ FIXED: BETTER MESSAGE HANDLER - PREVENT DUPLICATES
//       const messageHandler = (message) => {
//         console.log("📩 SOCKET: NEW MESSAGE RECEIVED:", message);
        
//         if (selectedUser && currentUserId) {
//           // ✅ SIMPLE CHECK: Is this message for current conversation?
//           const isForCurrentConversation = 
//             (message.sender_id === currentUserId && message.receiver_id === selectedUser.id) ||
//             (message.sender_id === selectedUser.id && message.receiver_id === currentUserId);

//           console.log("🔍 Message check:");
//           console.log("Current User:", currentUserId);
//           console.log("Selected User:", selectedUser.id);
//           console.log("Message From:", message.sender_id, "To:", message.receiver_id);
//           console.log("Is for current conversation?", isForCurrentConversation);

//           if (isForCurrentConversation) {
//             console.log("✅ ADDING TO UI");
//             setMessages(prev => {
//               const exists = prev.some(m => m.id === message.id);
//               if (!exists) {
//                 console.log("🆕 New message added from socket");
//                 // Remove temporary messages
//                 const filteredPrev = prev.filter(m => !m.isTemporary);
//                 return [...filteredPrev, message];
//               }
//               console.log("⚠️ Message already exists in state");
//               return prev;
//             });
//           }
//         }
//       };

//       // Add event listener once
//       socketRef.current.off('new_message'); // Remove existing listeners
//       socketRef.current.on('new_message', messageHandler);

//       return () => {
//         // Cleanup only socket listeners, not the connection
//         if (socketRef.current) {
//           socketRef.current.off('new_message', messageHandler);
//         }
//       };
//     }
//   }, [currentUserId, selectedUser]);

//   // ✅ AUTO-SCROLL
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   // ✅ SEARCH USERS
//   const searchUsers = useCallback(async (query) => {
//     if (!query.trim() || !currentUserId) return;
    
//     setLoading(true);
//     try {
//       const response = await chatApi.searchUsers(query);
//       const filteredUsers = (response.data || [])
//         .filter(user => user.id !== currentUserId)
//         .map(user => ({
//           ...user,
//           name: user.name || user.email?.split('@')[0] || 'User',
//           email: user.email || 'No email',
//         }));
      
//       setUsers(filteredUsers);
//     } catch (error) {
//       console.error("Search error:", error);
//       setUsers([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [currentUserId]);

//   // ✅ FIXED: LOAD MESSAGES - PERSIST MESSAGES
//   const loadMessages = async (userId) => {
//     if (!currentUserId) return;
//     try {
//       console.log(`📨 LOADING MESSAGES: Current User ${currentUserId} ↔ Selected User ${userId}`);
      
//       const response = await chatApi.getMessages(userId, currentUserId);
//       console.log("📝 MESSAGES LOADED:", response.data);
      
//       if (response.data && Array.isArray(response.data)) {
//         setMessages(response.data);
//         console.log(`✅ ${response.data.length} messages loaded`);
//       } else {
//         console.log("❌ No messages array in response");
//         setMessages([]);
//       }
//     } catch (error) {
//       console.error("❌ Load messages error:", error);
//       setMessages([]);
//     }
//   };

//   // ✅ LOAD REACTIONS
//   const loadReactions = async (userId) => {
//     if (!currentUserId) return;
//     try {
//       const response = await chatApi.getReactions(currentUserId, userId);
//       setReactions(response.data || []);
//     } catch (error) {
//       console.error("Load reactions error:", error);
//       setReactions([]);
//     }
//   };

//   // ✅ FIXED: SELECT USER - DON'T CLEAR MESSAGES IMMEDIATELY
//   const handleUserSelect = async (user) => {
//     if (!currentUserId) return;
    
//     console.log("👤 SELECTING USER:", user);
    
//     const selectedUserData = {
//       id: user.id,
//       name: user.name || user.email?.split('@')[0] || 'User',
//       email: user.email,
//     };
    
//     setSelectedUser(selectedUserData);
    
//     // Load messages for selected user
//     await Promise.all([
//       loadMessages(user.id),
//       loadReactions(user.id)
//     ]);
//   };

//   // ✅ FIXED: SEND MESSAGE - BETTER TEMPORARY MESSAGE HANDLING
//   const handleSendMessage = async () => {
//     if (!newMessage.trim() || !selectedUser || !currentUserId) {
//       console.log("⚠️ Cannot send: Missing input or user");
//       return;
//     }

//     const messageContent = newMessage.trim();
//     console.log(`🚀 SENDING MESSAGE: "${messageContent}" to User ${selectedUser.id}`);

//     // ✅ FIXED: Create temporary message with UNIQUE ID
//     const tempMsg = {
//       id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // More unique ID
//       sender_id: currentUserId,
//       receiver_id: selectedUser.id,
//       content: messageContent,
//       created_at: new Date().toISOString(),
//       attachment_url: null,
//       isTemporary: true,
//       timestamp: new Date().toISOString()
//     };

//     // Add to UI immediately
//     setMessages(prev => [...prev, tempMsg]);
//     setNewMessage("");

//     try {
//       console.log("📤 Calling sendMessage API...");
      
//       const messagePayload = {
//         sender_id: currentUserId,
//         receiver_id: selectedUser.id,
//         content: messageContent,
//         attachment_url: null
//       };
      
//       console.log("📦 Message payload:", messagePayload);
      
//       const response = await chatApi.sendMessage(messagePayload);
      
//       console.log("✅ MESSAGE SENT SUCCESSFULLY");
//       console.log("📨 Response data:", response.data);

//       // ✅ FIXED: IMMEDIATE UI UPDATE - Replace temporary with real message
//       setTimeout(() => {
//         setMessages(prev => {
//           // Remove temporary message
//           const filtered = prev.filter(msg => msg.id !== tempMsg.id);
//           // Check if real message already exists (from socket)
//           const realMessageExists = filtered.some(msg => msg.id === response.data.id);
          
//           if (!realMessageExists) {
//             console.log("🔄 Adding real message to UI");
//             return [...filtered, response.data];
//           } else {
//             console.log("✅ Real message already exists from socket");
//             return filtered;
//           }
//         });
//       }, 100);

//       // ✅ FIXED: BETTER SOCKET EMIT FOR RECEIVER
//       if (socketRef.current && socketRef.current.connected) {
//         console.log("📢 EMITTING SOCKET EVENT TO RECEIVER:", selectedUser.id);
        
//         // Emit to receiver's room specifically
//         socketRef.current.emit('private_message', {
//           message: response.data,
//           receiverId: selectedUser.id,
//           senderId: currentUserId
//         });
        
//         console.log("✅ Socket events emitted successfully");
//       } else {
//         console.log("⚠️ Socket not connected for real-time delivery");
//       }
      
//     } catch (error) {
//       console.error("❌ SEND MESSAGE FAILED:", error);
//       console.error("❌ Error details:", error.response?.data || error.message);
      
//       // Remove temporary message on error
//       setMessages(prev => prev.filter(msg => msg.id !== tempMsg.id));
//       alert(`Failed to send message: ${error.response?.data?.message || error.message}`);
//     }
//   };

//   // ✅ MANUAL SOCKET RECONNECT
//   const reconnectSocket = () => {
//     if (socketRef.current) {
//       console.log("🔄 Manual socket reconnect...");
//       socketRef.current.connect();
//     }
//   };

//   // ✅ FILE UPLOAD
//   const handleFileUpload = async (file) => {
//     if (!selectedUser || !currentUserId) return;
    
//     setFileUploading(true);
//     // ✅ FIXED: More unique temporary ID
//     const tempMsgId = `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
//     const tempMsg = {
//       id: tempMsgId,
//       sender_id: currentUserId,
//       receiver_id: selectedUser.id,
//       content: `Sending: ${file.name}`,
//       isTemporary: true,
//       isUploading: true,
//     };

//     setMessages(prev => [...prev, tempMsg]);

//     try {
//       const uploadResponse = await chatApi.uploadFile(file);
//       if (uploadResponse.data.url) {
//         const messageResponse = await chatApi.sendMessage({
//           sender_id: currentUserId,
//           receiver_id: selectedUser.id,
//           content: `File: ${file.name}`,
//           attachment_url: uploadResponse.data.url,
//         });

//         // Update UI immediately
//         setTimeout(() => {
//           setMessages(prev => {
//             const filtered = prev.filter(msg => msg.id !== tempMsgId);
//             const realMessageExists = filtered.some(msg => msg.id === messageResponse.data.id);
            
//             if (!realMessageExists) {
//               return [...filtered, messageResponse.data];
//             }
//             return filtered;
//           });
//         }, 100);

//         // Emit socket event
//         if (socketRef.current && socketRef.current.connected) {
//           socketRef.current.emit('private_message', {
//             message: messageResponse.data,
//             receiverId: selectedUser.id,
//             senderId: currentUserId
//           });
//         }
//       }
//     } catch (error) {
//       console.error("Upload failed:", error);
//       setMessages(prev => prev.filter(msg => msg.id !== tempMsgId));
//     } finally {
//       setFileUploading(false);
//     }
//   };

//   // ✅ ADD REACTION
//   const addReaction = async (messageId, emoji) => {
//     if (!currentUserId) return;
//     try {
//       await chatApi.addReaction({
//         message_id: messageId,
//         user_id: currentUserId,
//         emoji: emoji
//       });
//       setShowReactionPicker(null);
//     } catch (error) {
//       console.error("Reaction failed:", error);
//     }
//   };

//   // ✅ FILE INPUT
//   const handleFileInputChange = (e) => {
//     const file = e.target.files[0];
//     if (file && selectedUser && currentUserId) {
//       handleFileUpload(file);
//     }
//     e.target.value = '';
//   };

//   // ✅ SEARCH EFFECT
//   useEffect(() => {
//     if (searchTerm.trim() && currentUserId) {
//       const timeoutId = setTimeout(() => {
//         searchUsers(searchTerm);
//       }, 500);
//       return () => clearTimeout(timeoutId);
//     } else {
//       setUsers([]);
//     }
//   }, [searchTerm, searchUsers, currentUserId]);

//   // ✅ ENTER KEY
//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   // ✅ FORMAT TIME
//   const formatTime = (timestamp) => {
//     if (!timestamp) return '';
//     return new Date(timestamp).toLocaleTimeString('en-US', { 
//       hour: 'numeric', 
//       minute: '2-digit',
//       hour12: true 
//     });
//   };

//   // ✅ GET REACTIONS
//   const getMessageReactions = (messageId) => {
//     return reactions.filter(reaction => reaction.message_id === messageId);
//   };

//   // ✅ RENDER ATTACHMENT
//   const renderAttachment = (message) => {
//     if (!message.attachment_url) return null;
    
//     const isImage = message.attachment_url.match(/\.(jpg|jpeg|png|gif|webp)$/i);
//     const fileName = message.attachment_url.split('/').pop();

//     if (isImage) {
//       return (
//         <img 
//           src={message.attachment_url} 
//           alt="Attachment" 
//           className="max-w-full rounded-lg max-h-48 object-cover border border-gray-200 mt-2"
//         />
//       );
//     } else {
//       return (
//         <a 
//           href={message.attachment_url} 
//           target="_blank" 
//           rel="noopener noreferrer"
//           className="inline-flex items-center gap-2 px-3 py-2 bg-white bg-opacity-20 rounded-lg border border-white border-opacity-30 hover:bg-opacity-30 transition mt-2"
//         >
//           <span>📎</span>
//           <span className="text-sm truncate max-w-xs">{fileName}</span>
//         </a>
//       );
//     }
//   };

//   // ✅ SHOW LOGIN MESSAGE IF NO USER
//   if (!currentUserId) {
//     return (
//       <div className="bg-white rounded-2xl shadow-lg p-6">
//         <h2 className="text-2xl font-bold text-gray-800 mb-6">Messages</h2>
//         <div className="text-center py-12">
//           <div className="text-6xl mb-4">🔒</div>
//           <h3 className="text-xl font-semibold text-gray-700 mb-2">Please Login First</h3>
//           <p className="text-gray-500">You need to login to access messages</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white rounded-2xl shadow-lg p-6">
//       <h2 className="text-2xl font-bold text-gray-800 mb-6">Messages</h2>
      
//       {/* Status */}
//       <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
//         <p className="text-blue-800 text-sm">
//           <strong>User:</strong> {currentUser?.full_name} (ID: {currentUserId}) | 
//           <strong> Socket:</strong> 
//           <span className={socketConnected ? "text-green-600" : "text-red-600"}>
//             {socketConnected ? " 🟢 Connected" : " 🔴 Disconnected"}
//           </span>
//           {!socketConnected && (
//             <button 
//               onClick={reconnectSocket}
//               className="ml-2 px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
//             >
//               Reconnect
//             </button>
//           )}
//           | 
//           <strong> Chatting with:</strong> {selectedUser?.name || 'None'} |
//           <strong> Messages:</strong> {messages.length}
//         </p>
//       </div>
      
//       <div className="bg-white rounded-2xl shadow-lg h-[600px] flex border border-gray-200">
//         {/* Sidebar */}
//         <div className="w-1/3 border-r border-gray-200 flex flex-col">
//           <div className="p-4 border-b border-gray-200">
//             <input
//               type="text"
//               placeholder="Search users..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
//             />
//           </div>
          
//           <div className="flex-1 overflow-y-auto">
//             {loading ? (
//               <div className="p-4 text-center text-gray-500">Searching...</div>
//             ) : users.length === 0 && searchTerm ? (
//               <div className="p-4 text-center text-gray-500">No users found</div>
//             ) : (
//               users.map(user => (
//                 <div
//                   key={user.id}
//                   onClick={() => handleUserSelect(user)}
//                   className={`p-4 cursor-pointer transition border-b border-gray-100 ${
//                     selectedUser?.id === user.id ? 'bg-indigo-50 border-indigo-200' : 'hover:bg-gray-50'
//                   }`}
//                 >
//                   <div className="flex items-center gap-3">
//                     <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold">
//                       {user.name?.charAt(0)?.toUpperCase() || 'U'}
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <p className="font-medium text-gray-800 truncate">{user.name}</p>
//                       <p className="text-sm text-gray-600 truncate">{user.email}</p>
//                     </div>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>

//         {/* Chat Area */}
//         <div className="flex-1 flex flex-col">
//           {selectedUser ? (
//             <>
//               {/* Header */}
//               <div className="p-4 border-b border-gray-200 bg-white">
//                 <div className="flex items-center gap-3">
//                   <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold">
//                     {selectedUser.name?.charAt(0)?.toUpperCase() || 'U'}
//                   </div>
//                   <div>
//                     <p className="font-medium text-gray-800">{selectedUser.name}</p>
//                     <p className="text-sm text-gray-500">{selectedUser.email}</p>
//                   </div>
//                 </div>
//               </div>

//               {/* Messages */}
//               <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
//                 <div className="space-y-4">
//                   {messages.length === 0 ? (
//                     <div className="text-center text-gray-500 py-8">
//                       <div className="text-4xl mb-2">💬</div>
//                       <p>No messages yet. Start the conversation!</p>
//                     </div>
//                   ) : (
//                     messages.map((message) => (
//                       <div
//                         key={message.id} // ✅ FIXED: Unique key for each message
//                         className={`flex ${
//                           message.sender_id === currentUserId ? 'justify-end' : 'justify-start'
//                         }`}
//                       >
//                         <div
//                           className={`max-w-xs lg:max-w-md relative ${
//                             message.sender_id === currentUserId 
//                               ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' 
//                               : 'bg-white text-gray-800 shadow-sm'
//                           } rounded-2xl p-4 ${
//                             message.isTemporary ? 'opacity-70 border-2 border-dashed border-yellow-400' : ''
//                           }`}
//                           onMouseEnter={() => setShowReactionPicker(message.id)}
//                           onMouseLeave={() => setShowReactionPicker(null)}
//                         >
//                           {message.content && <p className="break-words whitespace-pre-wrap">{message.content}</p>}
                          
//                           {renderAttachment(message)}
                          
//                           <p className={`text-xs mt-2 ${
//                             message.sender_id === currentUserId ? 'text-indigo-200' : 'text-gray-500'
//                           }`}>
//                             {formatTime(message.created_at)}
//                             {message.isTemporary && ' • Sending...'}
//                           </p>
                          
//                           {/* Reactions */}
//                           <div className="flex flex-wrap gap-1 mt-2">
//                             {getMessageReactions(message.id).map((reaction) => (
//                               <span key={reaction.id} className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full">
//                                 {reaction.emoji}
//                               </span>
//                             ))}
//                           </div>
                          
//                           {/* Reaction Picker */}
//                           {showReactionPicker === message.id && (
//                             <div className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-xl shadow-lg p-2 flex gap-1">
//                               {['❤️', '👍', '😂', '😮', '😢', '🎉'].map((emoji) => (
//                                 <button
//                                   key={emoji}
//                                   onClick={() => addReaction(message.id, emoji)}
//                                   className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg transition text-lg"
//                                 >
//                                   {emoji}
//                                 </button>
//                               ))}
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     ))
//                   )}
//                   <div ref={messagesEndRef} />
//                 </div>
//               </div>

//               {/* Input */}
//               <div className="p-4 border-t border-gray-200 bg-white">
//                 <div className="flex gap-2">
//                   <button
//                     onClick={() => fileInputRef.current?.click()}
//                     disabled={fileUploading}
//                     className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 disabled:opacity-50"
//                   >
//                     {fileUploading ? '📤' : '📎'}
//                   </button>
//                   <input
//                     type="file"
//                     ref={fileInputRef}
//                     onChange={handleFileInputChange}
//                     className="hidden"
//                     accept="*/*"
//                   />
//                   <input
//                     type="text"
//                     value={newMessage}
//                     onChange={(e) => setNewMessage(e.target.value)}
//                     placeholder={`Message ${selectedUser.name}...`}
//                     onKeyPress={handleKeyPress}
//                     className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                   />
//                   <button
//                     onClick={handleSendMessage}
//                     disabled={!newMessage.trim()}
//                     className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 font-medium disabled:opacity-50"
//                   >
//                     Send
//                   </button>
//                 </div>
//               </div>
//             </>
//           ) : (
//             <div className="flex-1 flex items-center justify-center text-gray-500 bg-gray-50">
//               <div className="text-center">
//                 <div className="text-6xl mb-4">💬</div>
//                 <p className="text-lg font-medium">Select a user to start chatting</p>
//                 <p className="text-sm mt-2">Search for users in the sidebar</p>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }






























