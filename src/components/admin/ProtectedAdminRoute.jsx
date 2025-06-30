import { useEffect, useState } from 'react';
import { Link, Navigate, Outlet } from 'react-router-dom';
import api, { API_ENDPOINTS } from '../../config/api';
import { FaExclamationTriangle } from 'react-icons/fa';

const ErrorMessage = ({ message }) => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
    <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
      <div className="text-red-500 text-5xl mb-4">
        <FaExclamationTriangle className="mx-auto" />
      </div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Access Denied</h2>
      <p className="text-gray-600 mb-6">{message}</p>
      <Link
        to="/login"
        className="block w-full bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
      >
        Go to Login
      </Link>
    </div>
  </div>
);

const LoadingSpinner = ({ user }) => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      {user === null ? (
        <>
          <p className="mt-4 text-gray-600">You are not logged in</p>
          <p className="text-sm text-gray-500 mt-2">Please log in to access admin features</p>
      <Link
        to="/login"
            className="inline-block mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
      >
        Go to Login
      </Link>
        </>
      ) : (
        <>
          <p className="mt-4 text-gray-600">Verifying admin access...</p>
          <p className="text-sm text-gray-500 mt-2">Please wait while we check your permissions</p>
        </>
      )}
    </div>
  </div>
);

export default function ProtectedAdminRoute() {
  const [isAdmin, setIsAdmin] = useState(null);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const response = await api.get(API_ENDPOINTS.auth.user);
        if (!response.data || typeof response.data !== 'object') {
          console.error('Invalid response format:', response.data);
          setError('Invalid server response. Please try again later.');
          setIsAdmin(false);
          setUser(null);
          return;
        }

        // Check for admin email
        const userEmail = response.data.email;

        if (!userEmail) {
          console.error('No email found in user data');
          setError('User email not found. Please log in again.');
          setIsAdmin(false);
          setUser(null);
          return;
        }

        setUser(response.data); // User is logged in
        const isUserAdmin = userEmail === 'avishkarkakde2004@gmail.com';
        if (!isUserAdmin) {
          setError('You need admin privileges to access this page. Please log in with admin credentials.');
        }
        setIsAdmin(isUserAdmin);
      } catch (error) {
        console.error('Auth check error:', error);
        console.error('Error response:', error.response);
        if (error.response?.status === 401) {
          setError('Your session has expired. Please log in again.');
          setUser(null); // User is not logged in
        } else {
          setError('Failed to verify admin access. Please try again later.');
          setUser(null);
        }
        setIsAdmin(false);
      }
    };

    checkAdminStatus();
  }, []);

  if (isAdmin === null) {
    return <LoadingSpinner user={user} />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return isAdmin ? <Outlet /> : <Navigate to="/login" replace />;
}