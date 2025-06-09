import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';
import { Send, Loader2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const AdminMessenger = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!user) return;

    // Initialize socket connection
    socketRef.current = io(API_ENDPOINTS.socket, {
      withCredentials: true,
      auth: {
        token: user.token
      }
    });

    // Join admin room
    socketRef.current.emit('join_admin_room');

    // Listen for new messages
    socketRef.current.on('newMessage', (message) => {
      console.log('New message received:', message);
      if (selectedUser && message.sender_id === selectedUser.id) {
        setMessages(prevMessages => {
          // Check if message already exists
          if (prevMessages.some(m => m.id === message.id)) {
            return prevMessages;
          }
          return [...prevMessages, message];
        });
        scrollToBottom();
      }
      // Refresh users list to show new message sender
      fetchUsers();
    });

    // Listen for admin room join confirmation
    socketRef.current.on('admin_room_joined', () => {
      console.log('Admin room joined successfully');
    });

    // Listen for errors
    socketRef.current.on('error', (error) => {
      console.error('Socket error:', error);
      setError('Connection error. Please refresh the page.');
    });

    // Fetch users immediately
    fetchUsers();

    return () => {
      if (socketRef.current) {
        socketRef.current.off('newMessage');
        socketRef.current.off('admin_room_joined');
        socketRef.current.off('error');
        socketRef.current.disconnect();
      }
    };
  }, [user, selectedUser]);

  useEffect(() => {
    if (selectedUser) {
      fetchMessages(selectedUser.id);
    }
  }, [selectedUser]);

  const fetchUsers = async () => {
    try {
      // First get all messages to find users who have sent messages
      const messagesResponse = await axios.get(API_ENDPOINTS.messages.admin, {
        withCredentials: true
      });

      // Handle different possible response structures
      let messages = [];
      if (messagesResponse.data && Array.isArray(messagesResponse.data)) {
        messages = messagesResponse.data;
      } else if (messagesResponse.data && messagesResponse.data.data && Array.isArray(messagesResponse.data.data)) {
        messages = messagesResponse.data.data;
      } else {
        console.error('Unexpected messages response structure:', messagesResponse.data);
        setUsers([]);
        setLoading(false);
        return;
      }

      // Get unique user IDs from messages
      const uniqueUserIds = [...new Set(messages.map(msg => msg.sender_id))];

      if (uniqueUserIds.length === 0) {
        setUsers([]);
        setLoading(false);
        return;
      }

      // Fetch all users first
      const allUsersResponse = await axios.get(API_ENDPOINTS.users.list, {
        withCredentials: true
      });

      let allUsers = [];
      if (allUsersResponse.data && Array.isArray(allUsersResponse.data)) {
        allUsers = allUsersResponse.data;
      } else if (allUsersResponse.data && allUsersResponse.data.data && Array.isArray(allUsersResponse.data.data)) {
        allUsers = allUsersResponse.data.data;
      }

      // Filter users who have sent messages and are not admin
      const usersWithMessages = allUsers.filter(user => 
        uniqueUserIds.includes(user.id) && user.role !== 'admin'
      );

      setUsers(usersWithMessages);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users. Please try again later.');
      setUsers([]);
      setLoading(false);
    }
  };

  const fetchMessages = async (userId) => {
    try {
      const response = await axios.get(`${API_ENDPOINTS.messages.admin}?userId=${userId}`, {
        withCredentials: true
      });

      let messagesData = [];
      if (response.data && Array.isArray(response.data)) {
        messagesData = response.data;
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        messagesData = response.data.data;
      }

      // Sort messages by timestamp
      messagesData.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      setMessages(messagesData);
      scrollToBottom();
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError('Failed to load messages. Please try again.');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    setSending(true);
    try {
      const response = await axios.post(
        API_ENDPOINTS.messages.create,
        {
          receiver_id: selectedUser.id,
          content: newMessage.trim()
        },
        {
          withCredentials: true
        }
      );

      let sentMessage;
      if (response.data && response.data.data) {
        sentMessage = response.data.data;
      } else {
        sentMessage = response.data;
      }

      setMessages(prev => [...prev, sentMessage]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[800px] bg-white rounded-lg shadow-lg">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-[800px] bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <p className="text-red-600 mb-2">{error}</p>
          <button
            onClick={fetchUsers}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[800px] bg-white rounded-lg shadow-lg">
      {/* Users List */}
      <div className="w-1/4 border-r bg-gray-50">
        <div className="p-4 border-b bg-green-50">
          <h2 className="text-xl font-semibold text-gray-800">Users with Messages</h2>
          <p className="text-sm text-gray-600">Select a user to view conversation</p>
        </div>
        <div className="overflow-y-auto h-[calc(100%-4rem)]">
          {users.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No users have sent messages yet
            </div>
          ) : (
            users.map((user) => (
              <div
                key={user.id}
                onClick={() => {
                  setSelectedUser(user);
                  fetchMessages(user.id);
                }}
                className={`p-8 cursor-pointer hover:bg-gray-100 transition-colors ${selectedUser?.id === user.id ? 'bg-gray-100 border-l-4 border-green-600' : ''}`}
              >
                <p className="font-medium text-gray-800">{user.name || 'Unknown User'}</p>
                <p className="text-sm text-gray-500">{user.email || 'No email available'}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            <div className="p-4 border-b bg-white">
              <h3 className="text-lg font-semibold text-gray-800">{selectedUser.name || 'Unknown User'}</h3>
              <p className="text-sm text-gray-500">{selectedUser.email || 'No email available'}</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages?.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <p className="text-lg">No messages yet</p>
                  <p className="text-sm">Start the conversation</p>
                </div>
              ) : (
                messages?.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${message.sender_id === user.id
                        ? 'bg-green-600 text-white'
                        : 'bg-white text-gray-800 shadow-sm'
                        }`}
                    >
                      <p className="text-sm font-semibold mb-1">
                        {message.sender_id === user.id ? 'You' : selectedUser.name}
                      </p>
                      <p>{message.content || message.message}</p>
                      <p className="text-xs mt-1 opacity-75">
                        {new Date(message.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-4 border-t bg-white">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                  type="submit"
                  disabled={sending || !newMessage.trim()}
                  className={`px-4 py-2 rounded-lg transition duration-200 flex items-center space-x-2 ${sending || !newMessage.trim()
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                >
                  {sending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <p>Select a user to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMessenger; 