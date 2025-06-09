import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api.js';
import { Send, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';

const Messenger = () => {
  const {user} = useAuth()
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io(import.meta.env.VITE_API_URL || 'http://localhost:8080', {
      withCredentials: true
    });

    // Join user's room
    socketRef.current.emit('join', localStorage.getItem('userId'));

    // Listen for new messages
    socketRef.current.on('newMessage', (message) => {
      setMessages(prev => [...prev, message]);
      scrollToBottom();
    });

    // Fetch existing messages
    fetchMessages();

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.messages.list, {
        withCredentials: true
      });
      setMessages(response.data.data);
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
      const response = await axios.post(API_ENDPOINTS.messages.send,
        { 
          content: newMessage,
          receiverId: 'admin'
        },
        { withCredentials: true }
      );
      
      // Add the sent message to the local state
      setMessages(prev => [...prev, response.data.data]);
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
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="p-4 border-b bg-green-50">
        <h2 className="text-xl font-semibold text-gray-800">Chat with Admin</h2>
        <p className="text-sm text-gray-600">We typically respond within 24 hours</p>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <p className="text-lg">No messages yet</p>
            <p className="text-sm">Start a conversation with our admin team</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender_id === localStorage.getItem('userId') ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  message.sender_id === localStorage.getItem('userId')
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-800 shadow-sm'
                }`}
              >
                <p className="text-sm font-semibold mb-1">
                  {message.sender_id === localStorage.getItem('userId') ? 'Admin' : 'You'}
                </p>
                <p className="text-sm">{message.message}</p>
                <p className="text-xs mt-1 opacity-70">
                  {new Date(message.created_at).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t bg-white">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 bg-gray-50"
            disabled={sending}
          />
          <button
            type="submit"
            disabled={sending || !newMessage.trim()}
            className={`px-4 py-2 rounded-lg transition duration-200 flex items-center space-x-2 ${
              sending || !newMessage.trim()
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
    </div>
  );
};

export default Messenger; 