import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api.js';
import { Send, Loader2, MessageCircle, Clock, User, Search } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.js';

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
    socketRef.current.emit('joinAdmin');

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
  }, [user]);

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
      setLoading(true);
      const response = await axios.get(API_ENDPOINTS.messages.admin.list, {
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });

      if (!response.data || !response.data.success) {
        throw new Error('Invalid response from server');
      }

      const messages = response.data.data || [];

      // Get unique users from messages
      const uniqueUsers = messages.reduce((acc, message) => {
        const userId = message.sender_id;
        if (!acc[userId]) {
          acc[userId] = {
            id: userId,
            name: message.sender_name,
            email: message.sender_email || 'No email available',
            lastMessage: message.content,
            lastMessageTime: message.created_at
          };
        }
        return acc;
      }, {});

      setUsers(Object.values(uniqueUsers));
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users');
    } finally {
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
      console.log('Sending message to user:', selectedUser.id);
      const response = await axios.post(
        API_ENDPOINTS.messages.admin.send,
        {
          receiver_id: selectedUser.id,
          content: newMessage.trim()
        },
        {
          withCredentials: true,
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        }
      );

      console.log('Send message response:', response.data);

      if (!response.data || !response.data.success) {
        throw new Error('Invalid response from server');
      }

      const sentMessage = response.data.data;
      setMessages(prev => [...prev, sentMessage]);
      setNewMessage('');
      scrollToBottom();

      // Emit the message through socket
      socketRef.current?.emit('send_message', {
        receiver_id: selectedUser.id,
        content: newMessage.trim()
      });
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
    <div className="flex h-[800px] bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Users List */}
      <div className="w-1/4 border-r bg-gray-50">
        <div className="p-6 bg-gradient-to-r from-green-600 to-green-700 text-white">
          <h2 className="text-xl font-bold mb-2">Support Inbox</h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Search users..."
              className="w-full p-2 pl-8 bg-white/20 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <Search className="w-4 h-4 absolute left-2 top-3 text-white/70" />
          </div>
        </div>
        <div className="overflow-y-auto h-[calc(100%-8rem)]">
          {users.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p>No active conversations</p>
            </div>
          ) : (
            users.map((user) => (
              <div
                key={user.id}
                onClick={() => {
                  setSelectedUser(user);
                  fetchMessages(user.id);
                }}
                className={`p-4 cursor-pointer transition-colors ${selectedUser?.id === user.id ? 'bg-green-50 border-l-4 border-green-600' : 'hover:bg-gray-100'}`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-800 truncate">{user.name}</h3>
                    <p className="text-sm text-gray-500 truncate">{user.email}</p>
                    {/* <p className="text-sm text-gray-500 truncate">{user.lastMessage}</p> */}
                    <div className="flex items-center mt-1">
                      <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                        Customer
                      </span>
                      <span className="text-xs text-gray-500 ml-2">
                        {new Date(user.lastMessageTime).toLocaleTimeString()}
                      </span>
                    </div>
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
            <div className="p-6 bg-white border-b">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {selectedUser.name || 'Unknown User'}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {selectedUser.email || 'No email available'}
                  </p>
                  <div className="flex items-center mt-1">
                    <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                      Customer
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-xl font-semibold mb-2">No messages yet</p>
                    <p className="text-sm text-gray-400">Start the conversation</p>
                  </div>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={`${message.id}-${message.created_at}`}
                    className={`flex ${message.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-2xl p-4 ${message.sender_id === user.id
                        ? 'bg-green-600 text-white shadow-lg'
                        : 'bg-white text-gray-800 shadow-md'
                        }`}
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${message.sender_id === user.id ? 'bg-green-500' : 'bg-gray-200'
                          }`}>
                          <User className={`w-4 h-4 ${message.sender_id === user.id ? 'text-white' : 'text-gray-600'}`} />
                        </div>
                        <p className="text-sm font-semibold">
                          {message.sender_id === user.id ? 'You' : message.sender_name}
                        </p>
                      </div>
                      <p className="text-sm mb-2">{message.content}</p>
                      <p className="text-xs opacity-70 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {new Date(message.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-white border-t">
              <form onSubmit={handleSendMessage} className="flex items-center space-x-4">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 p-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim() || sending}
                  className="p-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <MessageCircle className="w-20 h-20 mx-auto mb-4 text-gray-400" />
              <p className="text-xl font-semibold mb-2">Select a user to start chatting</p>
              <p className="text-sm text-gray-400">Choose from the list on the left</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMessenger; 