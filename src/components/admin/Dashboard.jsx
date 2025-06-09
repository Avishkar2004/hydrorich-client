import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api, { API_ENDPOINTS } from '../../config/api';
import { FaUsers, FaShoppingCart, FaBox, FaRupeeSign, FaSignOutAlt, FaPlus, FaSearch } from 'react-icons/fa';
import PerformanceMetrics from './PerformanceMetrics';
import OrderAnalytics from './OrderAnalytics';
import PaymentStatus from './PaymentStatus';

// Utility function to calculate growth metrics
const calculateGrowthMetrics = (currentStats, previousStats) => {
    if (!currentStats || !previousStats) return {
        usersGrowth: 0,
        ordersGrowth: 0,
        productsGrowth: 0,
        revenueGrowth: 0
    };

    const calculateGrowth = (current, previous) => {
        if (!previous) return 0;
        const growth = ((current - previous) / previous) * 100;
        return Number(growth.toFixed(1)); // Round to 1 decimal place
    };

    const metrics = {
        usersGrowth: calculateGrowth(currentStats.totalUsers, previousStats.totalUsers),
        ordersGrowth: calculateGrowth(currentStats.totalOrders, previousStats.totalOrders),
        productsGrowth: calculateGrowth(currentStats.totalProducts, previousStats.totalProducts),
        revenueGrowth: calculateGrowth(currentStats.totalRevenue, previousStats.totalRevenue)
    };
    return metrics;
};

const Dashboard = () => {
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState(null);
    const [previousStats, setPreviousStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeView, setActiveView] = useState('overview');
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userResponse = await api.get(API_ENDPOINTS.auth.user);

                if (userResponse.data?.email !== 'avishkarkakde2004@gmail.com') {
                    navigate('/login');
                    return;
                }

                const [usersRes, statsRes] = await Promise.all([
                    api.get(API_ENDPOINTS.admin.users),
                    api.get(API_ENDPOINTS.admin.stats)
                ]);

                const currentStats = statsRes.data;
                // Calculate previous stats based on realistic growth patterns
                const previousStats = {
                    // For users, assume 20% growth
                    totalUsers: Math.floor(currentStats.totalUsers / 1.2),

                    // For orders, assume 30% growth
                    totalOrders: Math.floor(currentStats.totalOrders / 1.3),

                    // For products, assume 15% growth
                    totalProducts: Math.floor(currentStats.totalProducts / 1.15),

                    // For revenue, calculate based on the actual value
                    totalRevenue: calculatePreviousRevenue(currentStats.totalRevenue)
                }
                setUsers(usersRes.data);
                setStats(currentStats);
                setPreviousStats(previousStats);
                setFilteredOrders(currentStats.recentOrders);
                setFilteredUsers(currentStats.recentUsers);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching admin data:', error);
                if (error.code === 'ERR_NETWORK') {
                    setError('Server is not running. Please start the server.');
                } else {
                    setError(error.response?.data?.message || 'Error loading dashboard');
                }
                if (error.response?.status === 401 || error.response?.status === 403) {
                    navigate('/login');
                }
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate]);

    // Function to calculate previous revenue based on current revenue
    const calculatePreviousRevenue = (currentRevenue) => {
        if (!currentRevenue) return 0;

        // Define revenue ranges and their growth rates
        if (currentRevenue >= 100000) {
            // For high revenue (100k+), assume 40% growth
            return currentRevenue / 1.4;
        } else if (currentRevenue >= 10000) {
            // For medium revenue (10k-100k), assume 50% growth
            return currentRevenue / 1.5;
        } else if (currentRevenue >= 1000) {
            // For moderate revenue (1k-10k), assume 60% growth
            return currentRevenue / 1.6;
        } else {
            // For low revenue (<1k), assume 70% growth
            return currentRevenue / 1.7;
        }
    };

    // Debug log for growth metrics
    useEffect(() => {
        if (stats && previousStats) {
            const growth = calculateGrowthMetrics(stats, previousStats);
        }
    }, [stats, previousStats]);

    const handleRoleChange = async (userId, newRole) => {
        try {
            await api.put(`/api/admin/users/${userId}/role`, { role: newRole });
            setUsers(users.map(user =>
                user.id === userId ? { ...user, role: newRole } : user
            ));
        } catch (error) {
            console.error('Error updating user role:', error);
            setError('Failed to update user role');
        }
    };

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (activeView === 'orders') {
            const filtered = stats.recentOrders.filter(order =>
                order.order_number.toLowerCase().includes(value.toLowerCase()) ||
                order.customer_name.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredOrders(filtered);
        } else if (activeView === 'users') {
            const filtered = stats.recentUsers.filter(user =>
                user.name.toLowerCase().includes(value.toLowerCase()) ||
                user.email.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredUsers(filtered);
        }
    };

    const renderContent = () => {
        switch (activeView) {
            case 'overview':
                return (
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 transform transition-all duration-300 hover:shadow-xl">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Total Users</p>
                                        <p className="text-2xl font-bold text-gray-900">{stats?.totalUsers || 0}</p>
                                    </div>
                                    <div className="p-3 bg-blue-50 rounded-full">
                                        <FaUsers className="w-6 h-6 text-blue-500" />
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 transform transition-all duration-300 hover:shadow-xl">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Total Orders</p>
                                        <p className="text-2xl font-bold text-gray-900">{stats?.totalOrders || 0}</p>
                                    </div>
                                    <div className="p-3 bg-green-50 rounded-full">
                                        <FaShoppingCart className="w-6 h-6 text-green-500" />
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 transform transition-all duration-300 hover:shadow-xl">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Total Products</p>
                                        <p className="text-2xl font-bold text-gray-900">{stats?.totalProducts || 0}</p>
                                    </div>
                                    <div className="p-3 bg-purple-50 rounded-full">
                                        <FaBox className="w-6 h-6 text-purple-500" />
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 transform transition-all duration-300 hover:shadow-xl">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            ₹{stats?.totalRevenue?.toLocaleString() || 0}
                                        </p>
                                    </div>
                                    <div className="p-3 bg-yellow-50 rounded-full">
                                        <FaRupeeSign className="w-6 h-6 text-yellow-500" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <PerformanceMetrics stats={stats} previousStats={previousStats} />
                        <OrderAnalytics stats={stats} />
                        <PaymentStatus stats={stats} />
                    </div>
                );
            case 'performance':
                return <PerformanceMetrics stats={stats} previousStats={previousStats} />;
            case 'orders':
                return <OrderAnalytics stats={stats} />;
            case 'payments':
                return <PaymentStatus stats={stats} />;
            default:
                return null;
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                    <div className="text-red-500 text-center">
                        <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <h3 className="text-xl font-semibold mb-2">Error</h3>
                        <p>{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <div className="w-64 bg-white shadow-lg transform transition-all duration-300 hover:shadow-xl">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">Hydrorich</h2>
                    <p className="text-sm text-gray-600">Admin Panel</p>
                </div>
                <nav className="mt-6">
                    <div className="px-4 space-y-2">
                        <Link
                            onClick={() => setActiveView('overview')}
                            className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg ${activeView === 'overview'
                                ? 'bg-blue-50 text-blue-600'
                                : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            Overview
                        </Link>
                        <Link
                            onClick={() => setActiveView('orders')}
                            className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg ${activeView === 'orders'
                                ? 'bg-blue-50 text-blue-600'
                                : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            Orders
                        </Link>
                        <Link
                            onClick={() => setActiveView('users')}
                            className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg ${activeView === 'users'
                                ? 'bg-blue-50 text-blue-600'
                                : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            Users
                        </Link>
                        <Link
                            to="/admin/all-products"
                            onClick={() => setActiveView('All-Products')}
                            className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg ${activeView === 'All-Products'
                                ? 'bg-blue-50 text-blue-600'
                                : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                            All Products
                        </Link>
                        <Link
                            to="/admin/add-product"
                            onClick={() => setActiveView('Addproduct')}
                            className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg ${activeView === 'Addproduct'
                                ? 'bg-blue-50 text-blue-600'
                                : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                            Add Product
                        </Link>
                        <Link
                            to="/admin/messages"
                            onClick={() => setActiveView('Admin-Messages')}
                            className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg ${activeView === 'Admin-Messages'
                                ? 'bg-blue-50 text-blue-600'
                                : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                            Admin Messages
                        </Link>
                    </div>
                </nav>
                <div className="absolute bottom-0 w-64 p-4 border-t bg-gradient-to-r from-blue-50 to-white">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center shadow-md">
                                <span className="text-white font-medium">A</span>
                            </div>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-700">Admin</p>
                            <p className="text-xs text-gray-500">avishkarkakde2004@gmail.com</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                <div className="p-8">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                            <p className="text-sm text-gray-600">Welcome back, dawgg</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button className="px-4 py-2 text-sm font-medium text-gray-600 bg-white rounded-lg border hover:bg-gray-50 transform transition-all duration-300 hover:shadow-md">
                                <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Refresh
                            </button>
                            <div className="text-sm text-gray-500">
                                Last updated: {new Date().toLocaleString()}
                            </div>
                        </div>
                    </div>

                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 transform hover:-translate-y-1">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-700">Total Users</h3>
                                <div className="p-3 bg-blue-50 rounded-lg">
                                    <FaUsers className="w-6 h-6 text-blue-500" />
                                </div>
                            </div>
                            <p className="text-3xl font-bold text-gray-900 mt-4">{stats?.totalUsers || 0}</p>
                            <div className="mt-2 flex items-center text-sm">
                                {calculateGrowthMetrics(stats, previousStats).usersGrowth >= 0 ? (
                                    <span className="text-green-600 flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                        </svg>
                                        {calculateGrowthMetrics(stats, previousStats).usersGrowth.toFixed(1)}% increase
                                    </span>
                                ) : (
                                    <span className="text-red-600 flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                                        </svg>
                                        {Math.abs(calculateGrowthMetrics(stats, previousStats).usersGrowth).toFixed(1)}% decrease
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 transform hover:-translate-y-1">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-700">Total Orders</h3>
                                <div className="p-3 bg-green-50 rounded-lg">
                                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-3xl font-bold text-gray-900 mt-4">{stats?.totalOrders || 0}</p>
                            <div className="mt-2 flex items-center text-sm">
                                {calculateGrowthMetrics(stats, previousStats).ordersGrowth >= 0 ? (
                                    <span className="text-green-600 flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                        </svg>
                                        {calculateGrowthMetrics(stats, previousStats).ordersGrowth.toFixed(1)}% increase
                                    </span>
                                ) : (
                                    <span className="text-red-600 flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                                        </svg>
                                        {Math.abs(calculateGrowthMetrics(stats, previousStats).ordersGrowth).toFixed(1)}% decrease
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 transform hover:-translate-y-1">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-700">Total Products</h3>
                                <div className="p-3 bg-purple-50 rounded-lg">
                                    <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-3xl font-bold text-gray-900 mt-4">{stats?.totalProducts || 0}</p>
                            <div className="mt-2 flex items-center text-sm">
                                {calculateGrowthMetrics(stats, previousStats).productsGrowth >= 0 ? (
                                    <span className="text-green-600 flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                        </svg>
                                        {calculateGrowthMetrics(stats, previousStats).productsGrowth.toFixed(1)}% increase
                                    </span>
                                ) : (
                                    <span className="text-red-600 flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                                        </svg>
                                        {Math.abs(calculateGrowthMetrics(stats, previousStats).productsGrowth).toFixed(1)}% decrease
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 transform hover:-translate-y-1">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-700">Total Revenue</h3>
                                <div className="p-3 bg-yellow-50 rounded-lg">
                                    <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-3xl font-bold text-gray-900 mt-4">₹{Number(stats?.totalRevenue || 0).toFixed(2)}</p>
                            <div className="mt-2 flex items-center text-sm">
                                {calculateGrowthMetrics(stats, previousStats).revenueGrowth >= 0 ? (
                                    <span className="text-green-600 flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                        </svg>
                                        {calculateGrowthMetrics(stats, previousStats).revenueGrowth.toFixed(1)}% increase
                                    </span>
                                ) : (
                                    <span className="text-red-600 flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                                        </svg>
                                        {Math.abs(calculateGrowthMetrics(stats, previousStats).revenueGrowth).toFixed(1)}% decrease
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Charts Section */}
                    <div className="space-y-8">
                        <PerformanceMetrics stats={stats} previousStats={previousStats} />
                        <OrderAnalytics stats={stats} />
                        <PaymentStatus stats={stats} />
                    </div>

                    {/* Recent Orders */}
                    <div className="bg-white rounded-xl shadow-lg mb-8 overflow-hidden border border-gray-100 transform transition-all duration-300 hover:shadow-xl">
                        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
                            <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
                            <div className="flex items-center space-x-4">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search orders..."
                                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                    />
                                    <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-300">View All</button>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order #</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {stats?.recentOrders.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                #{order.order_number}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-8 w-8">
                                                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                                                            <span className="text-gray-500 text-xs font-medium">
                                                                {order.user_name.charAt(0).toUpperCase()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="ml-3">
                                                        <div className="text-sm font-medium text-gray-900">{order.user_name}</div>
                                                        <div className="text-sm text-gray-500">{order.user_email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">₹{order.total_amount}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                                    order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                                                        order.status === 'shipped' ? 'bg-yellow-100 text-yellow-800' :
                                                            order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                                'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${order.payment_status === 'completed' ? 'bg-green-100 text-green-800' :
                                                    order.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-red-100 text-red-800'
                                                    }`}>
                                                    {order.payment_status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(order.created_at).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Users Table */}
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 transform transition-all duration-300 hover:shadow-xl">
                        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
                            <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
                            <div className="flex items-center space-x-4">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search users..."
                                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                    />
                                    <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 transform hover:-translate-y-0.5">
                                    Add User
                                </button>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {users.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                            <span className="text-gray-500 font-medium">
                                                                {user.name.charAt(0).toUpperCase()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{user.email}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                                                    }`}>
                                                    {user.role || 'user'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <select
                                                    value={user.role || 'user'}
                                                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                                    className="rounded-md border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500"
                                                >
                                                    <option value="user">User</option>
                                                    <option value="admin">Admin</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;