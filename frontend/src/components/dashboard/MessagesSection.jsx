// src/components/dashboard/MessagesSection.jsx
import React, { useState } from "react";

export default function MessagesSection() {
  const [chats, setChats] = useState([
    { id: 1, name: "Prisha Narayan", lastMessage: "Hi", unread: 2, online: true },
    { id: 2, name: "Kanha Prasad", lastMessage: "test", unread: 0, online: false },
    { id: 3, name: "Diya Vijaya", lastMessage: "hi", unread: 1, online: true },
  ]);

  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return;
    setNewMessage("");
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Messages</h2>
      <div className="bg-white rounded-2xl shadow-lg h-96 flex border border-gray-200">
        {/* Chat List */}
        <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <div className="flex gap-2">
              <button className="flex-1 py-2 bg-indigo-600 text-white text-sm rounded-xl font-medium">
                New Chat
              </button>
              <button className="px-3 py-2 bg-gray-100 text-gray-700 text-sm rounded-xl hover:bg-gray-200">
                👥
              </button>
            </div>
          </div>
          
          {chats.map(chat => (
            <div
              key={chat.id}
              onClick={() => setSelectedChat(chat)}
              className={`p-4 border-b border-gray-100 cursor-pointer transition ${
                selectedChat?.id === chat.id ? 'bg-indigo-50' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold">
                    {chat.name.charAt(0)}
                  </div>
                  {chat.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <p className="font-medium text-gray-800 truncate">{chat.name}</p>
                    {chat.unread > 0 && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold">
                    {selectedChat.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{selectedChat.name}</p>
                    <p className="text-sm text-gray-500">
                      {selectedChat.online ? '🟢 Online' : '⚫ Offline'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                <div className="space-y-4">
                  <div className="flex justify-start">
                    <div className="bg-white rounded-2xl p-4 max-w-xs shadow-sm">
                      <p className="text-gray-800">Hello there! 👋</p>
                      <p className="text-xs text-gray-500 mt-2">9:30 PM</p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl p-4 max-w-xs shadow-sm">
                      <p>Hi! How are you doing?</p>
                      <p className="text-xs text-indigo-200 mt-2">9:32 PM</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <button
                    onClick={handleSendMessage}
                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 font-medium shadow-sm"
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
              <p className="text-gray-500 text-center">Choose a conversation from the list to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}