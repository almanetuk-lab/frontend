import React, { useState } from 'react';

export default function ChatModule() {
  const [chats, setChats] = useState([
    { id: 1, name: "Prisha Narayan", lastMessage: "Hi", unread: 2, online: true },
    { id: 2, name: "Kanha Prasad", lastMessage: "test", unread: 0, online: false },
    { id: 3, name: "Diya Vijaya", lastMessage: "hi", unread: 1, online: true },
    { id: 4, name: "Agastya Sharma", lastMessage: "Do you have girlfriends", unread: 0, online: false },
    { id: 5, name: "Aaradhya Charan", lastMessage: "Hey", unread: 0, online: true },
  ]);

  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return;
    
    const updatedChats = chats.map(chat => 
      chat.id === selectedChat.id 
        ? { ...chat, lastMessage: newMessage }
        : chat
    );
    
    setChats(updatedChats);
    setNewMessage("");
  };

  return (
    <div className="bg-white rounded-lg shadow-lg h-full flex flex-col">
      {/* Chat Header */}
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold text-gray-800">Messages</h3>
        <div className="flex gap-2 mt-2">
          <button className="px-3 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700">
            Start New Chat
          </button>
          <button className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200">
            Create Group
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Chat List */}
        <div className="w-1/3 border-r overflow-y-auto">
          {chats.map(chat => (
            <div
              key={chat.id}
              onClick={() => setSelectedChat(chat)}
              className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${
                selectedChat?.id === chat.id ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    {chat.name.charAt(0)}
                  </div>
                  {chat.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <p className="font-medium text-gray-800">{chat.name}</p>
                    {chat.unread > 0 && (
                      <span className="bg-red-500 text-white text-xs px-1 rounded-full">
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
              <div className="p-4 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    {selectedChat.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{selectedChat.name}</p>
                    <p className="text-sm text-gray-500">
                      {selectedChat.online ? 'Online' : 'Offline'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                <div className="space-y-4">
                  <div className="flex justify-start">
                    <div className="bg-white rounded-lg p-3 max-w-xs shadow">
                      <p className="text-gray-800">Hello</p>
                      <p className="text-xs text-gray-500 mt-1">9:30 PM</p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="bg-indigo-600 text-white rounded-lg p-3 max-w-xs shadow">
                      <p>Hi there!</p>
                      <p className="text-xs text-indigo-200 mt-1">9:32 PM</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Message Input */}
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <button
                    onClick={handleSendMessage}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    Send
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Select a chat to start messaging
            </div>
          )}
        </div>
      </div>
    </div>
  );
}