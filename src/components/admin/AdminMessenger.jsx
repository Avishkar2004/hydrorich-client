import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';

const AdminMessenger = () => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [adminId, setAdminId] = useState(null);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io(import.meta.env.VITE_API_URL || 'http://localhost:8080', {
      withCredentials: true
    });

    // Join admin room
    socketRef.current.emit('joinAdmin');

    // Listen for new messages
    socketRef.current.on('newMessage', (message) => {
      if (selectedUser && message.sender_id === selectedUser.id) {
        setMessages(prev => [...prev, message]);
      }
    });

    // Fetch users and messages
    fetchUsers();
    fetchMessages();

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    if (selectedUser) {
      fetchMessages();
    }
  }, [selectedUser]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.users.list, {
        withCredentials: true
      });
      // Get admin user
      const adminUser = response.data.data.find(user => user.role === 'admin');
      if (adminUser) {
        setAdminId(adminUser.id);
      }
      // Filter out the admin user from the list
      const filteredUsers = response.data.data.filter(user => user.role !== 'admin');
      setUsers(filteredUsers);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    if (!selectedUser) return;

    try {
      const response = await axios.get(`${API_ENDPOINTS.messages.admin}/${selectedUser.id}`, {
        withCredentials: true
      });
      setMessages(response.data.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser || !adminId) return;

    try {
      await axios.post(API_ENDPOINTS.messages.admin.send,
        {
          content: newMessage,
          receiverId: selectedUser.id,
          senderId: adminId
        },
        { withCredentials: true }
      );
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="flex h-[800px] bg-white rounded-lg shadow-lg">
      {/* Users List */}
      <div className="w-1/4 border-r">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Users</h2>
        </div>
        <div className="overflow-y-auto h-[calc(100%-4rem)]">
          {users?.map((user) => (
            <div
              key={user.id}
              onClick={() => setSelectedUser(user)}
              className={`p-4 cursor-pointer hover:bg-gray-50 ${selectedUser?.id === user.id ? 'bg-gray-100' : ''
                }`}
            >
              <p className="font-medium text-gray-800">{user.name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            <div className="p-4 border-b">
              <h2 className="text-xl font-semibold text-gray-800">
                Chat with {selectedUser.name}
              </h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages?.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.is_admin ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${message.is_admin
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-800'
                      }`}
                  >
                    <p className="text-sm font-semibold mb-1">
                      {message.is_admin ? 'You' : selectedUser.name}
                    </p>
                    <p>{message.content}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {new Date(message.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="p-4 border-t">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
                >
                  Send
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a user to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMessenger; 