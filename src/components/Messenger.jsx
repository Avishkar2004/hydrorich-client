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
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

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

    // Join user's room
    socketRef.current.emit('join', user.id);

    // Listen for new messages
    socketRef.current.on('new_message', (message) => {
      console.log('New message received:', message);
      setMessages(prev => {
        // Check if message already exists
        if (prev.some(m => m.id === message.id)) {
          return prev;
        }
        return [...prev, message];
      });
      scrollToBottom();
    });

    // Fetch existing messages
    fetchMessages();

    return () => {
      if (socketRef.current) {
        socketRef.current.off('new_message');
        socketRef.current.disconnect();
      }
    };
  }, [user]);

  const fetchMessages = async () => {
    try {
      console.log('Fetching messages...');
      const response = await axios.get(API_ENDPOINTS.messages.list, {
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
      console.log('Processed messages:', messagesData);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setSending(true);
    try {
      console.log('Sending message to admin...');
      const response = await axios.post(
        API_ENDPOINTS.messages.send,
        {
          receiver_id: 'admin',
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
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[600px] bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading messages...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-[600px] bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <MessageCircle className="w-20 h-20 text-green-600 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-800 mb-3">Welcome to Chat</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Connect with our support team for any questions or assistance. We're here to help you!
          </p>
          <div className="space-x-4">
            <Link
              to="/login"
              className="inline-block px-8 py-4 bg-green-600 text-white rounded-full hover:bg-green-700 transition duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Login to Chat
            </Link>
            <Link
              to="/register"
              className="inline-block px-8 py-4 border-2 border-green-600 text-green-600 rounded-full hover:bg-green-50 transition duration-200"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <MessageCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Support Chat</h2>
            <p className="text-green-100 flex items-center text-sm">
              <Clock className="w-4 h-4 mr-1" />
              We typically respond within 24 hours
            </p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <MessageCircle className="w-16 h-16 mb-4 text-gray-400" />
            <p className="text-xl font-semibold mb-2">No messages yet</p>
            <p className="text-sm text-gray-400">Start a conversation with our support team</p>
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
                    {message.sender_id === user.id ? user.name || user.displayName?.split(" ")[0] : message.sender_name || 'Admin'}
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

      {/* Message Input */}
      <form onSubmit={handleSubmit} className="p-4 bg-white border-t">
        <div className="flex space-x-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-3 border-2 border-gray-200 rounded-full focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition duration-200"
          />
          <button
            type="submit"
            disabled={sending || !newMessage.trim()}
            className={`p-3 rounded-full transition duration-200 flex items-center justify-center ${sending || !newMessage.trim()
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
              }`}
          >
            {sending ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <Send className="w-6 h-6" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Messenger; 