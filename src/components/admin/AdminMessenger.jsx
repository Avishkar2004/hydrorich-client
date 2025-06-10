import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api.js';
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
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

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
    socketRef.current.on('new_message', (message) => {
      console.log('New message received:', message);
      if (selectedUser && message.sender_id === selectedUser.id) {
        setMessages(prevMessages => {
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

    // Listen for typing indicators
    socketRef.current.on('user_typing', (data) => {
      if (selectedUser && data.user_id === selectedUser.id) {
        setIsTyping(data.isTyping);
      }
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
        socketRef.current.off('new_message');
        socketRef.current.off('user_typing');
        socketRef.current.off('admin_room_joined');
        socketRef.current.off('error');
        socketRef.current.disconnect();
      }
    };
  }, [user, selectedUser]);

  useEffect(() => {
    if (selectedUser) {
      // Join the chat room with the selected user
      socketRef.current?.emit('join_chat', selectedUser.id);
      fetchMessages(selectedUser.id);
    }
    return () => {
      if (selectedUser) {
        // Leave the chat room when component unmounts or user changes
        socketRef.current?.emit('leave_chat', selectedUser.id);
      }
    };
  }, [selectedUser]);

  const fetchUsers = async () => {
    try {
      console.log('Fetching messages for admin...');
      // First get all messages to find users who have sent messages
      const messagesResponse = await axios.get(API_ENDPOINTS.messages.admin.list, {
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });

      console.log('Messages response:', messagesResponse.data);

      if (!messagesResponse.data || !messagesResponse.data.success) {
        throw new Error('Invalid response from server');
      }

      const messages = messagesResponse.data.data || [];
      console.log('Processed messages:', messages);

      // Get unique user IDs from messages
      const uniqueUserIds = [...new Set(messages.map(msg => msg.sender_id))];
      console.log('Unique user IDs:', uniqueUserIds);

      if (uniqueUserIds.length === 0) {
        setUsers([]);
        setLoading(false);
        return;
      }

      // Fetch user details for each unique user
      const usersWithMessages = await Promise.all(
        uniqueUserIds.map(async (userId) => {
          try {
            const userResponse = await axios.get(`${API_ENDPOINTS.users.list}/${userId}`, {
              withCredentials: true,
              headers: {
                'Authorization': `Bearer ${user.token}`
              }
            });
            return userResponse.data.data;
          } catch (error) {
            console.error(`Error fetching user ${userId}:`, error);
            return {
              id: userId,
              name: user.name || user.displayName?.split(" ")[0],
              email: user.email || "No email available"
            };
          }
        })
      );

      console.log('Users with messages:', usersWithMessages);
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
      console.log('Fetching messages for user:', userId);
      const response = await axios.get(`${API_ENDPOINTS.messages.admin.list}?userId=${userId}`, {
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });

      console.log('Messages response:', response.data);

      if (!response.data || !response.data.success) {
        throw new Error('Invalid response from server');
      }

      const messagesData = response.data.data || [];
      console.log('Sorted messages:', messagesData);
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

  const handleTyping = () => {
    if (selectedUser) {
      socketRef.current?.emit('typing', { receiver_id: selectedUser.id });

      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Set new timeout to stop typing indicator
      typingTimeoutRef.current = setTimeout(() => {
        socketRef.current?.emit('stop_typing', { receiver_id: selectedUser.id });
      }, 2000);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    setSending(true);
    try {
      // Emit the message through socket
      socketRef.current?.emit('send_message', {
        receiver_id: selectedUser.id,
        content: newMessage.trim()
      });

      // Optimistically add message to UI
      const optimisticMessage = {
        id: Date.now(), // Temporary ID
        sender_id: user.id,
        receiver_id: selectedUser.id,
        content: newMessage.trim(),
        created_at: new Date().toISOString(),
        sender_name: user.name
      };

      setMessages(prev => [...prev, optimisticMessage]);
      setNewMessage('');
      scrollToBottom();
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
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Users</h2>
        </div>
        <div className="overflow-y-auto h-[calc(100%-4rem)]">
          {users.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No users with messages
            </div>
          ) : (
            users.map((user) => (
              <div
                key={user.id}
                onClick={() => setSelectedUser(user)}
                className={`p-4 cursor-pointer hover:bg-gray-100 transition-colors ${selectedUser?.id === user.id ? 'bg-green-50' : ''
                  }`}
              >
                <h3 className="font-medium text-gray-800">{user.name || 'Unknown User'}</h3>
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
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <p>No messages yet</p>
                </div>
              ) : (
                messages.map((message) => (
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
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs mt-1 opacity-70">
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