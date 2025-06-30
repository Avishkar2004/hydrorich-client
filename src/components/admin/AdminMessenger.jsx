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
  const [autoSelectedUser, setAutoSelectedUser] = useState(false);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const initializeSocket = async () => {
      try {
        // Fetch session data for socket authentication
        const sessionResponse = await fetch(`${API_ENDPOINTS.auth.base}/session`, {
          credentials: 'include'
        });

        if (!sessionResponse.ok) {
          throw new Error('Failed to get session');
        }

        const sessionData = await sessionResponse.json();

        // Initialize socket connection with session
        socketRef.current = io(API_ENDPOINTS.socket, {
          withCredentials: true,
          auth: {
            session: sessionData.session
          }
        });

        // Join admin room
        socketRef.current.emit('joinAdmin');

        // Listen for new messages
        socketRef.current.on('new_message', (message) => {
          console.log('New message received in admin:', message);
          console.log('Selected user ID:', selectedUser?.id);
          console.log('Message sender ID:', message.sender_id);

          // If no user is selected, or the message is from a different user, auto-select the sender
          if (!selectedUser || message.sender_id !== selectedUser.id) {
            console.log('Auto-selecting user:', message.sender_id);
            // Find the user in the users list or create a new user object
            const senderUser = users.find(u => u.id === message.sender_id) || {
              id: message.sender_id,
              name: message.sender_name || 'Unknown User',
              email: 'No email available',
              lastMessage: message.content,
              lastMessageTime: message.created_at
            };

            // If the user doesn't exist in the users list, add them
            if (!users.find(u => u.id === message.sender_id)) {
              setUsers(prevUsers => [...prevUsers, senderUser]);
            }

            setSelectedUser(senderUser);
            setAutoSelectedUser(true);

            // Clear the auto-selection notification after 3 seconds
            setTimeout(() => setAutoSelectedUser(false), 3000);

            // Add the message to the conversation immediately
            setMessages(prevMessages => {
              console.log('Adding message to conversation (auto-select):', message);
              const newMessages = [...prevMessages, message];
              console.log('Updated messages (auto-select):', newMessages);
              return newMessages;
            });
            scrollToBottom();
          } else {
            // Message is from currently selected user
            setMessages(prevMessages => {
              console.log('Current messages before update:', prevMessages);

              // Check if message already exists by content and sender
              const exists = prevMessages.some(m =>
                m.content === message.content &&
                m.sender_id === message.sender_id &&
                Math.abs(new Date(m.created_at) - new Date(message.created_at)) < 5000 // Within 5 seconds
              );

              console.log('Message exists check:', exists);

              if (exists) {
                // Replace temporary message with real message
                const updatedMessages = prevMessages.map(m =>
                  (m.content === message.content &&
                    m.sender_id === message.sender_id &&
                    Math.abs(new Date(m.created_at) - new Date(message.created_at)) < 5000)
                    ? message
                    : m
                );
                console.log('Updated messages (replaced):', updatedMessages);
                return updatedMessages;
              }

              const newMessages = [...prevMessages, message];
              console.log('Updated messages (added):', newMessages);
              return newMessages;
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
      } catch (error) {
        console.error('Error initializing socket:', error);
        setLoading(false);
      }
    };

    initializeSocket();

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
      console.log('Joining chat room with user:', selectedUser.id);
      // Join the chat room with the selected user
      socketRef.current?.emit('join_chat', selectedUser.id);
      fetchMessages(selectedUser.id);
    }
    return () => {
      if (selectedUser) {
        console.log('Leaving chat room with user:', selectedUser.id);
        // Leave the chat room when component unmounts or user changes
        socketRef.current?.emit('leave_chat', selectedUser.id);
      }
    };
  }, [selectedUser]);

  // Auto-fetch messages when selectedUser changes
  useEffect(() => {
    if (selectedUser && socketRef.current) {
      console.log('Auto-fetching messages for selected user:', selectedUser.id);
      fetchMessages(selectedUser.id);
    }
  }, [selectedUser?.id]); // Only trigger when user ID changes

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
      console.log('Fetched messages data:', messagesData);
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

  // Debug messages state changes
  useEffect(() => {
    console.log('Admin messages state changed:', messages);
  }, [messages]);

  // Debug selected user changes
  useEffect(() => {
    console.log('Selected user changed:', selectedUser);
  }, [selectedUser]);

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
      console.log('Sending message via socket to user:', selectedUser.id);
      console.log('Selected user object:', selectedUser);

      // Send message via socket
      socketRef.current?.emit('send_message', {
        receiver_id: selectedUser.id,
        content: newMessage.trim()
      });

      // Optimistically add message to UI
      const tempMessage = {
        id: Date.now(), // Temporary ID
        sender_id: user.id,
        receiver_id: selectedUser.id,
        content: newMessage.trim(),
        created_at: new Date().toISOString(),
        sender_name: 'Admin'
      };

      console.log('Adding temporary message:', tempMessage);
      setMessages(prev => {
        const newMessages = [...prev, tempMessage];
        console.log('Messages after adding temp:', newMessages);
        return newMessages;
      });
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
    <div className="flex h-screen bg-gray-100">
      <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Customer Messages</h2>
          {autoSelectedUser && selectedUser && (
            <div className="mt-2 p-2 bg-blue-100 border border-blue-300 rounded-md">
              <p className="text-sm text-blue-700">
                Auto-selected conversation with <strong>{selectedUser.name}</strong>
              </p>
            </div>
          )}
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