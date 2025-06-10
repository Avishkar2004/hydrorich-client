import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Bell } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth.js';
import { API_ENDPOINTS } from '../../config/api.js';

const MessageBox = () => {
    const { user } = useAuth();
    const [unreadCount, setUnreadCount] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUnreadCount = async () => {
            try {
                const response = await axios.get(API_ENDPOINTS.messages.unread, {
                    withCredentials: true
                });
                setUnreadCount(response.data.count || 0);
            } catch (error) {
                console.error('Error fetching unread count:', error);
            }
        };

        fetchUnreadCount();
        const interval = setInterval(fetchUnreadCount, 60000);
        return () => clearInterval(interval);
    }, []);

    const handleClick = () => {
        if (user.email === "avishkarkakde2004@gmail.com") {
            navigate("/admin/messages")
        } else {
            navigate("/messages")
        }
    };

    return (
        <div
            className="fixed bottom-6 right-6 z-50"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div
                className="relative cursor-pointer transform transition-all duration-300 hover:scale-110"
                onClick={handleClick}
            >
                {/* Main button */}
                <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                    <MessageSquare className="w-6 h-6 text-white" />
                </div>

                {/* Unread count badge */}
                {unreadCount > 0 && (
                    <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-bounce">
                        {unreadCount}
                    </div>
                )}

                {/* Tooltip */}
                <div
                    className={`absolute bottom-full right-0 mb-3 bg-gray-800 text-white text-sm py-2 px-4 rounded-lg shadow-lg transition-all duration-300 transform ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
                        }`}
                >
                    <div className="flex items-center space-x-2">
                        <Bell className="w-4 h-4" />
                        <span>Messages</span>
                    </div>
                    {unreadCount > 0 && (
                        <div className="text-xs text-gray-300 mt-1">
                            {unreadCount} unread message{unreadCount !== 1 ? 's' : ''}
                        </div>
                    )}
                </div>

                {/* Pulse effect */}
                {unreadCount > 0 && (
                    <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-20" />
                )}
            </div>
        </div>
    );
};

export default MessageBox;