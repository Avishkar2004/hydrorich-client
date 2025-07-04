import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth.js';
import {
    User,
    Bell,
    Lock,
    CreditCard,
    MapPin,
    Globe,
    Moon,
    Shield,
    Loader2,
    Check,
    X,
    Save,
    Eye,
    EyeOff,
    LogOut,
    AlertTriangle
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { API_ENDPOINTS, getAuthHeader } from '../../config/api.js';

const Settings = () => {
    const { user, loading, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('account');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [latestOrder, setLatestOrder] = useState(null);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [passwordError, setPasswordError] = useState("")
    const [passwordSuccess, setPasswordSuccess] = useState("")


    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: user?.address || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    useEffect(() => {
        const fetchLatestOrder = async () => {
            if (!user) return;

            try {
                const response = await fetch(API_ENDPOINTS.orders, {
                    headers: getAuthHeader(),
                    credentials: 'include'
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch orders');
                }

                const data = await response.json();
                if (data.success && Array.isArray(data.data) && data.data.length > 0) {
                    const sortedOrders = data.data.sort((a, b) =>
                        new Date(b.created_at) - new Date(a.created_at)
                    );
                    setLatestOrder(sortedOrders[0]);
                }
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setLoadingOrders(false);
            }
        };

        fetchLatestOrder();
    }, [user]);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault()
        setPasswordError("")
        setPasswordSuccess("")
        setIsLoading(true)

        // Validate passwords
        if (formData.newPassword.length < 8) {
            setPasswordError("New password must be at least 8 characters long")
            setIsLoading(false)
            return
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setPasswordError("New passwords do not match")
            setIsLoading(false)
            return
        }


        try {
            const response = await fetch(`${API_ENDPOINTS.auth.user}/change-password`, {
                method: "POST",
                headers: {
                    ...getAuthHeader(),
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    currentPassword: formData.currentPassword,
                    newPassword: formData.newPassword
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || "Failed to change password")
            }
            setPasswordSuccess("Password changed successfully")

            // Clear Password fields
            setFormData((prev) => ({
                ...prev,
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            }))
        } catch (error) {
            setPasswordError(error.message || "Failed to change password. Please try again.")
        } finally {
            setIsLoading(false)
        }

    }

    const handlePasswordChage = async (e) => {
        e.preventDefault();
        setPasswordError('');
        setPasswordSuccess('');
        setIsLoading(true);

        // Validate passwords
        if (formData.newPassword.length < 8) {
            setPasswordError('New password must be at least 8 characters long');
            setIsLoading(false);
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setPasswordError('New passwords do not match');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_ENDPOINTS.auth.changePasseword}`, {
                method: 'POST',
                headers: {
                    ...getAuthHeader(),
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    currentPassword: formData.currentPassword,
                    newPassword: formData.newPassword,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to change password');
            }

            setPasswordSuccess('Password changed successfully');
            // Clear password fields
            setFormData(prev => ({
                ...prev,
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            }));
        } catch (error) {
            setPasswordError(error.message || 'Failed to change password. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            // API call to update settings
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
            setIsLoading(false);
        } catch (error) {
            console.error('Error updating settings:', error);
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            setIsLoading(true);
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Error logging out:', error);
            setIsLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-600">
                <Loader2 className="animate-spin mb-4" size={32} />
                <span className="text-lg">Loading settings...</span>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
                <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
                    <User size={48} className="mx-auto mb-4 text-gray-400" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
                    <p className="text-gray-600 mb-8">
                        Please sign in to access your settings.
                    </p>
                    <Link
                        to="/login"
                        className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl transition-all duration-300 transform hover:scale-105"
                    >
                        Sign In
                    </Link>
                </div>
            </div>
        );
    }

    const tabs = [
        { id: 'account', label: 'Account', icon: User },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'security', label: 'Security', icon: Lock },
        { id: 'payment', label: 'Payment', icon: CreditCard },
        { id: 'address', label: 'Address', icon: MapPin },
        { id: 'preferences', label: 'Preferences', icon: Globe },
    ];

    return (
        <div className="max-w-6xl mx-auto px-4 py-10">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar Navigation */}
                <div className="w-full md:w-64 flex-shrink-0">
                    <div className="bg-white rounded-2xl shadow-sm p-4">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 px-2">Settings</h2>
                        <nav className="space-y-1">
                            {tabs.map(tab => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === tab.id
                                            ? 'bg-green-50 text-green-700'
                                            : 'text-gray-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        <Icon size={20} />
                                        <span>{tab.label}</span>
                                    </button>
                                );
                            })}
                        </nav>
                        {/* Logout Button */}
                        <div className="mt-6 pt-6 border-t border-gray-100">
                            <button
                                onClick={() => setShowLogoutConfirm(true)}
                                className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
                            >
                                <LogOut size={20} />
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1">
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        {/* Account Settings */}
                        {activeTab === 'account' && (
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">Account Settings</h2>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Full Name
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                                                placeholder="Your name"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Email Address
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                disabled
                                                className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Phone Number
                                            </label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={latestOrder?.shipping_address?.phone || formData.phone}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                                                placeholder="Your phone number"
                                            />
                                            {latestOrder?.shipping_address?.phone && (
                                                <p className='mt-1 text-sm text-gray-500'>
                                                    Last used in your most recent order
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
                                        >
                                            {isLoading ? (
                                                <Loader2 size={18} className="animate-spin" />
                                            ) : (
                                                <Save size={18} />
                                            )}
                                            Save Changes
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Security Settings */}
                        {activeTab === 'security' && (
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">Security Settings</h2>
                                <form onSubmit={handlePasswordChange} className="space-y-6">
                                    {passwordError && (
                                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                                            {passwordError}
                                        </div>
                                    )}
                                    {passwordSuccess && (
                                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-600">
                                            {passwordSuccess}
                                        </div>
                                    )}
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Current Password
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    name="currentPassword"
                                                    value={formData.currentPassword}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                                                    placeholder="Enter current password"
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                >
                                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="relative">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                New Password
                                            </label>
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                name="newPassword"
                                                value={formData.newPassword}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                                                placeholder="Enter new password"
                                                required
                                                minLength={8}
                                            />
                                            <button
                                                type='button'
                                                onClick={() => setShowPassword(!showPassword)}
                                                className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'
                                            >
                                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                            <p className="mt-1 text-sm text-gray-500">Password must be at least 8 characters long</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Confirm New Password
                                            </label>
                                            <input
                                                type="password"
                                                name="confirmPassword"
                                                value={formData.confirmPassword}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                                                placeholder="Confirm new password"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
                                        >
                                            {isLoading ? (
                                                <Loader2 size={18} className="animate-spin" />
                                            ) : (
                                                <Save size={18} />
                                            )}
                                            Update Password
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Notifications Settings */}
                        {activeTab === 'notifications' && (
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">Notification Preferences</h2>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                        <div>
                                            <h3 className="font-medium text-gray-800">Email Notifications</h3>
                                            <p className="text-sm text-gray-600">Receive updates about your orders and account</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" defaultChecked />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                        </label>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                        <div>
                                            <h3 className="font-medium text-gray-800">Marketing Emails</h3>
                                            <p className="text-sm text-gray-600">Receive offers and promotions</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Payment Settings */}
                        {activeTab === 'payment' && (
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">Payment Methods</h2>
                                <div className="space-y-4">
                                    <div className="p-4 border border-gray-200 rounded-xl">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center">
                                                    <CreditCard size={20} className="text-gray-600" />
                                                </div>
                                                <div>
                                                    <h3 className="font-medium text-gray-800">{latestOrder?.payment_method}</h3>
                                                    <p className='text-sm text-gray-600'>Due to security reasons, we do not store your payment details. You can add a new payment method to your account.</p>
                                                </div>
                                            </div>
                                            <button className="text-red-600 hover:text-red-700">Remove</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Address Settings */}
                        {activeTab === 'address' && (
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">Saved Addresses</h2>
                                <div className="space-y-4">
                                    <div className="p-4 border border-gray-200 rounded-xl">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="font-medium text-gray-800">{latestOrder?.shipping_address?.fullName}</h3>
                                                <p className="text-gray-600 mt-1">{latestOrder?.shipping_address?.street}</p>
                                                <p className="text-gray-600">{latestOrder?.shipping_address?.city}, {latestOrder?.shipping_address?.state}, {latestOrder?.shipping_address?.pincode}</p>
                                            </div>
                                        </div>
                                        <span className='text-sm text-gray-500'>This is the last address used in your most recent order</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Preferences Settings */}
                        {activeTab === 'preferences' && (
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">Preferences</h2>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                        <div>
                                            <h3 className="font-medium text-gray-800">Dark Mode</h3>
                                            <p className="text-sm text-gray-600">Switch between light and dark theme</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                        </label>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                        <div>
                                            <h3 className="font-medium text-gray-800">Language</h3>
                                            <p className="text-sm text-gray-600">Select your preferred language</p>
                                        </div>
                                        <select className="px-4 py-2 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all">
                                            <option value="en">English</option>
                                            <option value="es">Spanish</option>
                                            <option value="fr">French</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Logout Confirmation Modal */}
            {showLogoutConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
                        <div className="flex items-center gap-3 mb-4">
                            <AlertTriangle className="text-red-600" size={24} />
                            <h3 className="text-xl font-semibold text-gray-800">Confirm Logout</h3>
                        </div>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to logout? You will need to login again to access your account.
                        </p>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setShowLogoutConfirm(false)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                                disabled={isLoading}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleLogout}
                                disabled={isLoading}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                            >
                                {isLoading ? (
                                    <Loader2 size={18} className="animate-spin" />
                                ) : (
                                    <LogOut size={18} />
                                )}
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Settings; 