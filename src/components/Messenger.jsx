import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api.js';

const Messenger = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
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

    try {
      await axios.post(API_ENDPOINTS.messages.send,
        { 
          content: newMessage,
          receiverId: 'admin' // Special identifier for admin messages
        },
        { withCredentials: true }
      );
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading messages...</div>;
  }

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg shadow-lg">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold text-gray-800">Chat with Admin</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages?.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.is_admin ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${message.is_admin
                  ? 'bg-gray-100 text-gray-800'
                  : 'bg-green-600 text-white'
                }`}
            >
              <p className="text-sm font-semibold mb-1">
                {message.is_admin ? 'Admin' : message.sender_name}
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
    </div>
  );
};

export default Messenger; 