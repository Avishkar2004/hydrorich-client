import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINTS } from "../../config/api.js";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" });
    };

    const validate = () => {
        const newErrors = {};
        if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
            newErrors.email = "Enter a valid email address.";
        }
        if (formData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters.";
        }
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        } else {
            try {
                const response = await axios.post(API_ENDPOINTS.auth.login, formData, {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                if (response.data.success) {
                    console.log("response", response.data)
                    // Show welcome toast for admin
                    if (response.data.user?.role === 'admin') {
                        toast.success('Welcome Admin! 👋', {
                            position: "top-center",
                            autoClose: 3000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            theme: "colored",
                            style: {
                                background: 'linear-gradient(to right, #00b09b, #96c93d)',
                                color: 'white',
                                fontSize: '16px',
                                fontWeight: 'bold',
                                padding: '16px',
                                borderRadius: '8px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                            },
                            progressStyle: {
                                background: 'rgba(255,255,255,0.3)'
                            }
                        });
                    }
                    // Refresh the page to update the auth state
                    window.location.href = "/";
                }
            } catch (error) {
                if (error.message) {
                    const { data } = error.response
                    if (data.message) {
                        toast.error(data.message, {
                            position: "top-center",
                            theme: "colored",
                            style: {
                                background: 'linear-gradient(to right, #ff416c, #ff4b2b)',
                                color: 'white',
                                fontSize: '16px',
                                fontWeight: 'bold',
                                padding: '16px',
                                borderRadius: '8px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                            }
                        });
                    }
                } else {
                    console.error("Login error:", error)
                    toast.error("Something went wrong", {
                        position: "top-center",
                        theme: "colored",
                        style: {
                            background: 'linear-gradient(to right, #ff416c, #ff4b2b)',
                            color: 'white',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            padding: '16px',
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                        }
                    });
                }
            }
        }
    };

    const handleGoogleLogin = () => {
        toast.info('Redirecting to Google login... 🔄', {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "colored",
            style: {
                background: 'linear-gradient(to right, #2193b0, #6dd5ed)',
                color: 'white',
                fontSize: '16px',
                fontWeight: 'bold',
                padding: '16px',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }
        });
        window.open(API_ENDPOINTS.auth.google, '_self');
    };

    return (
        <div className="flex items-center justify-center bg-gray-50 px-4">
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
                style={{ zIndex: 9999 }}
            />
            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-md mt-10">
                <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Log In to Your Account</h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email Address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`mt-1 block w-full px-4 py-2 border ${errors.email ? "border-red-500" : "border-gray-300"} rounded-lg shadow-sm focus:ring-green-600 focus:border-green-600`}
                            placeholder="you@example.com"
                        />
                        {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={`mt-1 block w-full px-4 py-2 border ${errors.password ? "border-red-500" : "border-gray-300"} rounded-lg shadow-sm focus:ring-green-600 focus:border-green-600`}
                            placeholder="********"
                        />
                        {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-200"
                    >
                        Log In
                    </button>
                    <div className="my-4 flex items-center">
                        <div className="flex-grow h-px bg-gray-300" />
                        <span className="mx-2 text-gray-500 text-sm">or</span>
                        <div className="flex-grow h-px bg-gray-300" />
                    </div>

                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 transition duration-150"
                    >
                        <img
                            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                            alt="Google logo"
                            className="w-5 h-5"
                        />
                        <span className="text-sm font-medium text-gray-700">Log in with Google</span>
                    </button>
                </form>
                <p className="mt-4 text-sm text-gray-600 text-center">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-green-600 hover:underline">
                        Create one
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
