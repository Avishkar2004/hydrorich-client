import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api.js';
import { Send, Loader2, LogIn, MessageCircle, Clock, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';
import { Link } from 'react-router-dom';

const Messenger = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

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

        // Socket connection events
        socketRef.current.on('connect', () => {
          console.log('Socket connected');
          setSocketConnected(true);
        });

        socketRef.current.on('disconnect', () => {
          console.log('Socket disconnected');
          setSocketConnected(false);
        });

        socketRef.current.on('connect_error', (error) => {
          console.error('Socket connection error:', error);
          setSocketConnected(false);
        });

        // Join user's room
        socketRef.current.emit('join', user.id);
        // console.log('Joined user room:', `user_${user.id}`);

        // Listen for new messages
        socketRef.current.on('new_message', (message) => {
          // console.log('New message received:', message);
          // console.log('Current user ID:', user.id);
          // console.log('Message sender ID:', message.sender_id);
          // console.log('Message receiver ID:', message.receiver_id);
          setMessages(prev => {
            // console.log('Current messages before update:', prev);

            // Check if message already exists by content and sender
            const exists = prev.some(m =>
              m.content === message.content &&
              m.sender_id === message.sender_id &&
              Math.abs(new Date(m.created_at) - new Date(message.created_at)) < 5000 // Within 5 seconds
            );

            // console.log('Message exists check:', exists);

            if (exists) {
              // Replace temporary message with real message
              const updatedMessages = prev.map(m =>
                (m.content === message.content &&
                  m.sender_id === message.sender_id &&
                  Math.abs(new Date(m.created_at) - new Date(message.created_at)) < 5000)
                  ? message
                  : m
              );
              // console.log('Updated messages (replaced):', updatedMessages);
              return updatedMessages;
            }

            const newMessages = [...prev, message];
            // console.log('Updated messages (added):', newMessages);
            return newMessages;
          });
          scrollToBottom();
        });

        // Listen for message notifications
        socketRef.current.on('message_notification', (message) => {
          // console.log('Message notification received:', message);
          setMessages(prev => {
            // Check if message already exists by content and sender
            const exists = prev.some(m =>
              m.content === message.content &&
              m.sender_id === message.sender_id &&
              Math.abs(new Date(m.created_at) - new Date(message.created_at)) < 5000 // Within 5 seconds
            );

            if (exists) {
              return prev;
            }

            return [...prev, message];
          });
          scrollToBottom();
        });

        // Fetch existing messages
        fetchMessages();
      } catch (error) {
        console.error('Error initializing socket:', error);
        setLoading(false);
      }
    };

    initializeSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.off('new_message');
        socketRef.current.off('message_notification');
        socketRef.current.off('connect');
        socketRef.current.off('disconnect');
        socketRef.current.off('connect_error');
        socketRef.current.disconnect();
      }
    };
  }, [user]);

  const fetchMessages = async () => {
    try {
      // console.log('Fetching messages...');
      const response = await axios.get(API_ENDPOINTS.messages.list, {
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });

      // console.log('Messages response:', response.data);

      if (!response.data || !response.data.success) {
        throw new Error('Invalid response from server');
      }

      const messagesData = response.data.data || [];
      // console.log('Processed messages:', messagesData);

      // Sort messages by timestamp
      messagesData.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      setMessages(messagesData);
      setLoading(false);
      scrollToBottom();
    } catch (error) {
      console.error('Error fetching messages:', error);
      setLoading(false);
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
    // console.log('Messages state changed:', messages);
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socketConnected) return;

    setSending(true);
    try {
      // console.log('Sending message via socket...');
      // console.log('User ID:', user.id);
      // console.log('User object:', user);

      // Send message via socket
      socketRef.current.emit('send_message', {
        receiver_id: 'admin',
        content: newMessage.trim()
      });

      // Optimistically add message to UI
      const tempMessage = {
        id: Date.now(), // Temporary ID
        sender_id: user.id,
        receiver_id: 'admin',
        content: newMessage.trim(),
        created_at: new Date().toISOString(),
        sender_name: user.name || user.displayName?.split(" ")[0]
      };

      // console.log('Adding temporary message:', tempMessage);
      setMessages(prev => {
        const newMessages = [...prev, tempMessage];
        // console.log('Messages after adding temp:', newMessages);
        return newMessages;
      });
      setNewMessage('');
      scrollToBottom();
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[600px] bg-white rounded-2xl shadow-2xl">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading messages...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-[600px] bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center">
          <MessageCircle className="w-20 h-20 text-green-600 mx-auto mb-6 drop-shadow-lg" />
          <h2 className="text-3xl font-bold text-gray-800 mb-3">Welcome to Chat</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Connect with our support team for any questions or assistance. We're here to help you!
          </p>
          <div className="space-x-4">
            <Link
              to="/login"
              className="inline-block px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full hover:bg-green-700 transition duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold text-lg"
            >
              Login to Chat
            </Link>
            <Link
              to="/register"
              className="inline-block px-8 py-4 border-2 border-green-600 text-green-600 rounded-full hover:bg-green-50 transition duration-200 font-semibold text-lg"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-2xl shadow-2xl overflow-hidden font-sans">
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-green-600 to-green-500 via-green-700 text-white rounded-t-2xl shadow-md relative">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center shadow-md">
            <MessageCircle className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold tracking-tight drop-shadow">Support Chat</h2>
            <p className="text-green-100 flex items-center text-sm font-medium">
              <Clock className="w-4 h-4 mr-1" />
              We typically respond within 24 hours
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${socketConnected ? 'bg-green-400' : 'bg-red-400'} shadow`} />
            <span className="text-xs text-green-100 font-semibold">
              {socketConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
        <div className="absolute left-0 right-0 bottom-0 h-2 bg-gradient-to-r from-green-400/30 to-green-700/30 blur-sm opacity-60" />
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-br from-green-50 via-white to-green-100 relative">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <MessageCircle className="w-16 h-16 mb-4 text-gray-400" />
            <p className="text-xl font-semibold mb-2">No messages yet</p>
            <p className="text-sm text-gray-400">Start a conversation with our support team</p>
          </div>
        ) : (
          messages.map((message, idx) => (
            <div
              key={`${message.id}-${message.created_at}`}
              className={`flex ${message.sender_id === user.id ? 'justify-end' : 'justify-start'} animate-fade-in`}
              style={{ animationDelay: `${idx * 30}ms` }}
            >
              <div
                className={`max-w-[70%] rounded-2xl p-4 transition-all duration-200 shadow-lg ${message.sender_id === user.id
                  ? 'bg-gradient-to-br from-green-500 to-green-600 text-white rounded-br-3xl'
                  : 'bg-white text-gray-800 rounded-bl-3xl border border-green-100'}
                  hover:scale-[1.02] hover:shadow-xl`}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${message.sender_id === user.id ? 'bg-green-500' : 'bg-gray-200'} shadow`}>
                    <User className={`w-4 h-4 ${message.sender_id === user.id ? 'text-white' : 'text-gray-600'}`} />
                  </div>
                  <p className="text-sm font-semibold">
                    {message.sender_id === user.id ? user.name || user.displayName?.split(" ")[0] : message.sender_name || 'Admin'}
                  </p>
                </div>
                <p className="text-base mb-2 leading-relaxed">{message.content}</p>
                <p className="text-xs opacity-70 flex items-center gap-1 mt-1">
                  <Clock className="w-3 h-3" />
                  {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSubmit} className="p-4 bg-white/80 border-t border-green-100 backdrop-blur-md">
        <div className="flex space-x-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={socketConnected ? "Type your message..." : "Connecting..."}
            disabled={!socketConnected}
            className={`flex-1 p-3 border-2 rounded-full focus:outline-none focus:ring-2 transition duration-200 bg-white/80 shadow-inner text-gray-800 placeholder-gray-400 ${socketConnected
              ? 'border-green-200 focus:border-green-500 focus:ring-green-200'
              : 'border-gray-300 bg-gray-100 cursor-not-allowed'
              }`}
          />
          <button
            type="submit"
            disabled={sending || !newMessage.trim() || !socketConnected}
            className={`p-3 rounded-full transition duration-200 flex items-center justify-center shadow-lg text-lg font-bold focus:outline-none focus:ring-2 focus:ring-green-300 ${sending || !newMessage.trim() || !socketConnected
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white hover:scale-105'
              }`}
          >
            {sending ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <Send className="w-6 h-6 transition-transform duration-200 group-hover:translate-x-1" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Messenger; 