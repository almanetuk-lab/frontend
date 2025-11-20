
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
  const [showSidebar, setShowSidebar] = useState(true);

  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [recentChats, setRecentChats] = useState([]);
  const [recentChatsLoading, setRecentChatsLoading] = useState(true);

  const socketRef = useRef(null);
  const fileInputRef = useRef();
  const messagesEndRef = useRef();
  const [socketConnected, setSocketConnected] = useState(false);

  // ✅ Fetch recent chats
  const fetchRecentChats = async () => {
    try {
      setRecentChatsLoading(true);
      const response = await chatApi.getRecentChats(currentUserId);
      setRecentChats(response.data);
    } catch (error) {
      console.error('Error fetching recent chats:', error);
    } finally {
      setRecentChatsLoading(false);
    }
  };

  // ✅ Handle recent chat selection
  const handleRecentChatSelect = (chat) => {
    const user = {
      id: chat.user_id,
      name: chat.name,
      email: chat.email
    };
    handleUserSelect(user);
    setShowSidebar(false);
  };

  // ✅ RECENT CHATS USE EFFECT - YAHAN ADD KARNA HAI
  useEffect(() => {
    if (currentUserId) {
      fetchRecentChats();
    }
  }, [currentUserId]);

  // ✅ Click outside to close reaction picker
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showReactionPicker && !event.target.closest('.reaction-picker') && !event.target.closest('.message-bubble')) {
        setShowReactionPicker(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showReactionPicker]);

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

  // ✅ FIXED: SOCKET WITH REACTION HANDLING
  useEffect(() => {
    if (!currentUserId) return;

    console.log("🔌 Initializing socket for user:", currentUserId);

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

    // ✅ FIXED: HANDLE NEW REACTIONS VIA SOCKET
    socket.on('new_reaction', (reactionData) => {
      console.log('🎭 New reaction received via socket:', reactionData);
      if (reactionData && selectedUser) {
        setReactions(prev => {
          const exists = prev.some(r => 
            r.id === reactionData.id || 
            (r.message_id === reactionData.message_id && r.user_id === reactionData.user_id)
          );
          if (exists) {
            return prev.map(r => 
              (r.message_id === reactionData.message_id && r.user_id === reactionData.user_id) 
                ? reactionData 
                : r
            );
          }
          return [...prev, reactionData];
        });
      }
    });

    // ✅ Handle incoming messages
    const handleIncomingMessage = (message) => {
      console.log('📩 Socket message received:', message);
       fetchRecentChats();
      
      if (!selectedUser) return;

      const isRelevant = 
        (message.sender_id === currentUserId && message.receiver_id === selectedUser.id) ||
        (message.sender_id === selectedUser.id && message.receiver_id === currentUserId);

      if (isRelevant) {
        setMessages(prev => {
          const exists = prev.some(m => m.id === message.id);
          if (exists) return prev;

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
      socket.off('new_reaction');
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

  // ✅ LOAD MESSAGES
  const loadMessages = async (otherUserId) => {
    if (!currentUserId) return;
    try {
      console.log(`📨 Loading messages between ${currentUserId} and ${otherUserId}`);
      setLoading(true);
      
      const response = await chatApi.getMessages(otherUserId, currentUserId);
      console.log('📝 Messages response:', response.data);
      
      let messagesData = response.data;
      if (Array.isArray(response.data)) {
        messagesData = response.data;
      } else if (response.data && Array.isArray(response.data.messages)) {
        messagesData = response.data.messages;
      } else {
        messagesData = [];
      }

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

  // ✅ FIXED: LOAD REACTIONS PROPERLY
  const loadReactions = async (userId) => {
    if (!currentUserId || !userId) return;
    try {
      console.log(`🎭 Loading reactions for users: ${currentUserId} and ${userId}`);
      const res = await chatApi.getReactions(currentUserId, userId);
      console.log('🎭 Reactions loaded from API:', res.data);
      
      let reactionsData = [];
      if (Array.isArray(res.data)) {
        reactionsData = res.data;
      } else if (res.data && Array.isArray(res.data.reactions)) {
        reactionsData = res.data.reactions;
      } else if (res.data && Array.isArray(res.data.data)) {
        reactionsData = res.data.data;
      }
      
      console.log('🎭 Final reactions data:', reactionsData);
      setReactions(reactionsData);
    } catch (e) {
      console.error('❌ Load reactions error:', e);
      setReactions([]);
    }
  };

  // ✅ SELECT USER - WITH MOBILE SUPPORT
  const handleUserSelect = async (user) => {
    if (!currentUserId) return;
    
    console.log('👤 Selecting user:', user.name);
    const selectedUserData = {
      id: user.id,
      name: user.name || user.email?.split('@')[0] || 'User',
      email: user.email,
    };
    
    setSelectedUser(selectedUserData);
    
    if (window.innerWidth < 768) {
      setShowSidebar(false);
    }
    
    await loadMessages(user.id);
    await loadReactions(user.id);
  };

  // ✅ SEND MESSAGE
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedUser || !currentUserId) return;

    const messageContent = newMessage.trim();
    console.log(`🚀 Sending: "${messageContent}" to ${selectedUser.name}`);

    const tempMsg = {
      id: `temp-${Date.now()}`,
      sender_id: currentUserId,
      receiver_id: selectedUser.id,
      content: messageContent,
      created_at: new Date().toISOString(),
      attachment_url: null,
      isTemporary: true,
    };

    setMessages(prev => [...prev, tempMsg]);
    setNewMessage("");

    try {
      const response = await chatApi.sendMessage({
        sender_id: currentUserId,
        receiver_id: selectedUser.id,
        content: messageContent,
        attachment_url: null
      });

      console.log('✅ Message sent successfully');
         fetchRecentChats();

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
      setMessages(prev => prev.filter(msg => msg.id !== tempMsg.id));
      alert('Failed to send message');
    }
  };

  // ✅ FIXED: ADD REACTION - PROPER REAL-TIME HANDLING
  const addReaction = async (messageId, emoji) => {
    if (!currentUserId || !messageId) {
      console.error('❌ Cannot add reaction: missing user ID or message ID');
      return;
    }

    console.log(`🎭 Adding reaction: ${emoji} to message ${messageId} by user ${currentUserId}`);

    try {
      const response = await chatApi.addReaction({
        message_id: messageId,
        user_id: currentUserId,
        emoji: emoji
      });

      console.log('✅ Reaction sent successfully:', response.data);

      if (selectedUser) {
        setTimeout(() => {
          loadReactions(selectedUser.id);
        }, 500);
      }

      if (socketRef.current && response.data) {
        socketRef.current.emit('send_reaction', response.data);
      }

      setShowReactionPicker(null);

    } catch (err) {
      console.error('❌ Reaction failed:', err);
      alert('Failed to add reaction');
    }
  };

  // ✅ FIXED: GET REACTIONS FOR MESSAGE - SIMPLE AND WORKING
  const getMessageReactions = (messageId) => {
    if (!messageId) return [];
    
    const messageReactions = reactions.filter(r => {
      return r.message_id == messageId;
    });
    
    console.log(`🎭 Reactions for message ${messageId}:`, messageReactions);
    
    return messageReactions;
  };

  // ✅ RECONNECT SOCKET
  const reconnectSocket = () => {
    if (socketRef.current) {
      socketRef.current.connect();
    }
  };

  // ✅ FILE UPLOAD
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

  // ✅ FILE INPUT
  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file && selectedUser && currentUserId) {
      handleFileUpload(file);
    }
    e.target.value = '';
  };

  // ✅ SEARCH EFFECT
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

  // ✅ ENTER KEY HANDLING
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // ✅ FORMAT TIME
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    });
  };

  // ✅ RENDER ATTACHMENT
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
    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Messages</h2>

      {/* Status - Hidden on mobile */}
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg hidden sm:block">
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
          <strong> Messages:</strong> {messages.length} |
          <strong> Reactions:</strong> {reactions.length}
        </p>
      </div>

      {/* ✅ RESPONSIVE CHAT CONTAINER */}
      <div className="bg-white rounded-2xl shadow-lg h-[70vh] sm:h-[600px] flex flex-col md:flex-row border border-gray-200 relative">
        
        {/* ✅ MOBILE HEADER FOR CHAT */}
        {selectedUser && !showSidebar && (
          <div className="md:hidden p-4 border-b border-gray-200 bg-white flex items-center gap-3">
            <button 
              onClick={() => setShowSidebar(true)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              ← Back
            </button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                {selectedUser.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div>
                <p className="font-medium text-gray-800 text-sm">{selectedUser.name}</p>
                <p className="text-xs text-gray-500">Online</p>
              </div>
            </div>
          </div>
        )}

        {/* ✅ SIDEBAR - Responsive */}
        <div className={`
          ${showSidebar ? 'flex' : 'hidden'} 
          md:flex
          w-full md:w-1/3 lg:w-1/4 
          border-r border-gray-200 
          flex-col 
          absolute md:relative 
          h-full bg-white z-10
        `}>
          {/* Search Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              {/* Mobile back button */}
              <button 
                onClick={() => setShowSidebar(false)}
                className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                ←
              </button>
              <input 
                type="text" 
                placeholder="Search users..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="flex-1 px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm" 
              />
            </div>
          </div>

          {/* ✅ RECENT CHATS SECTION - RESPONSIVE */}
          <div className="border-b border-gray-200">
            <div className="px-4 py-3 bg-gray-50">
              <h3 className="text-sm font-medium text-gray-700">Recent Chats</h3>
            </div>
            
            <div className="max-h-48 overflow-y-auto">
              {recentChatsLoading ? (
                <div className="p-3 text-center text-gray-500 text-sm">Loading recent chats...</div>
              ) : recentChats.length === 0 ? (
                <div className="p-3 text-center text-gray-500 text-sm">No recent conversations</div>
              ) : (
                recentChats.map(chat => (
                  <div
                    key={chat.user_id}
                    onClick={() => handleRecentChatSelect(chat)}
                    className={`p-3 cursor-pointer transition border-b border-gray-100 ${
                      selectedUser?.id === chat.user_id ? 'bg-indigo-50 border-indigo-200' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-xs">
                        {chat.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <p className="font-medium text-gray-800 truncate text-sm">{chat.name}</p>
                          <span className="text-xs text-gray-500">
                            {new Date(chat.last_message_time).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <p className="text-xs text-gray-600 truncate">
                            {chat.last_message || 'No messages yet'}
                          </p>
                          {chat.unread_count > 0 && (
                            <span className="bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                              {chat.unread_count}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Users List */}
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
                  className={`p-3 cursor-pointer transition border-b border-gray-100 ${
                    selectedUser?.id === user.id ? 'bg-indigo-50 border-indigo-200' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-sm sm:text-base">
                      {user.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 truncate text-sm sm:text-base">{user.name}</p>
                      <p className="text-xs sm:text-sm text-gray-600 truncate">{user.email}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ✅ CHAT AREA - Responsive */}
        <div className="flex-1 flex flex-col">
          {selectedUser ? (
            <>
              {/* Desktop Header */}
              <div className="hidden md:flex p-4 border-b border-gray-200 bg-white">
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

              {/* Messages Area */}
              <div className="flex-1 p-3 sm:p-4 overflow-y-auto bg-gray-50">
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
                  <div className="space-y-3 sm:space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.sender_id === currentUserId ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-[85%] xs:max-w-xs sm:max-w-md relative message-bubble ${
                            message.sender_id === currentUserId 
                              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' 
                              : 'bg-white text-gray-800 shadow-sm border border-gray-200'
                          } rounded-2xl p-3 sm:p-4 ${
                            message.isTemporary ? 'opacity-70 border-2 border-dashed border-yellow-400' : ''
                          }`}
                          onClick={() => setShowReactionPicker(showReactionPicker === message.id ? null : message.id)}
                        >
                          {/* Sender name for received messages */}
                          {message.sender_id !== currentUserId && (
                            <p className="text-xs font-medium text-gray-500 mb-1">
                              {selectedUser.name}
                            </p>
                          )}

                          {/* Message content */}
                          {message.content && (
                            <p className="break-words whitespace-pre-wrap text-sm sm:text-base">{message.content}</p>
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

                          {/* ✅ FIXED: SIMPLE REACTIONS DISPLAY */}
                          <div className="flex flex-wrap gap-1 mt-2">
                            {getMessageReactions(message.id).map((reaction, index) => (
                              <span 
                                key={reaction.id || index} 
                                className="text-xs bg-white bg-opacity-90 px-2 py-1 rounded-full border border-gray-300 flex items-center gap-1 shadow-sm"
                                title={`Reaction by user`}
                              >
                                <span className="text-sm">
                                  {reaction.emoji || reaction.reaction || '❤️'}
                                </span>
                              </span>
                            ))}
                          </div>

                          {/* Reaction Picker */}
                          {showReactionPicker === message.id && (
                            <div className="absolute bottom-full right-0 mb-2 bg-white border border-gray-200 rounded-xl shadow-lg p-2 flex gap-1 reaction-picker z-10">
                              {['❤️', '👍', '😂', '😮', '😢', '🎉'].map((emoji) => (
                                <button
                                  key={emoji}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    addReaction(message.id, emoji);
                                  }}
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

              {/* Input Area */}
              <div className="p-3 sm:p-4 border-t border-gray-200 bg-white">
                <div className="flex gap-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={fileUploading}
                    className="px-3 py-2 sm:px-4 sm:py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 disabled:opacity-50 text-sm"
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
                    className="flex-1 px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm sm:text-base"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 font-medium disabled:opacity-50 text-sm sm:text-base"
                  >
                    Send
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500 bg-gray-50">
              <div className="text-center">
                <div className="text-4xl sm:text-6xl mb-4">💬</div>
                <p className="text-lg font-medium">Select a user to start chatting</p>
                <p className="text-sm mt-2">Search for users in the sidebar</p>
                {/* Mobile sidebar toggle */}
                <button 
                  onClick={() => setShowSidebar(true)}
                  className="md:hidden mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Open Contacts
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}










































































































































































































































































