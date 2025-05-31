import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:8080';

class SocketService {
    constructor() {
        this.socket = null;
        this.listeners = new Map();
    }

    connect() {
        if (!this.socket) {
            this.socket = io(SOCKET_URL, {
                withCredentials: true,
                autoConnect: true
            });

            this.socket.on('connect', () => {
                console.log('Connected to socket server');
            });

            this.socket.on('disconnect', () => {
                console.log('Disconnected from socket server');
            });

            this.socket.on('error', (error) => {
                console.error('Socket error:', error);
            });
        }
        return this.socket;
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    joinOrderTracking(orderId) {
        if (this.socket) {
            this.socket.emit('join_order_tracking', orderId);
        }
    }

    leaveOrderTracking(orderId) {
        if (this.socket) {
            this.socket.emit('leave_order_tracking', orderId);
        }
    }

    onOrderStatusUpdate(callback) {
        if (this.socket) {
            this.socket.on('order_status_update', callback);
            this.listeners.set('order_status_update', callback);
        }
    }

    removeOrderStatusListener() {
        if (this.socket && this.listeners.has('order_status_update')) {
            this.socket.off('order_status_update', this.listeners.get('order_status_update'));
            this.listeners.delete('order_status_update');
        }
    }
}

export const socketService = new SocketService(); 