import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import api, { API_ENDPOINTS } from '../../config/api';

export default function ProtectedAdminRoute() {
    const [isAdmin, setIsAdmin] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        const checkAdminStatus = async () => {
            try {
                console.log('Checking admin status...');
                const response = await api.get(API_ENDPOINTS.auth.user);

                console.log('Raw response:', response);
                console.log('User data:', response.data);

                if (!response.data || typeof response.data !== 'object') {
                    console.error('Invalid response format:', response.data);
                    setError('Invalid server response');
                    setIsAdmin(false);
                    return;
                }

                // Check for admin email
                const userEmail = response.data.email;
                console.log('User email:', userEmail);

                if (!userEmail) {
                    console.error('No email found in user data');
                    setError('User email not found');
                    setIsAdmin(false);
                    return;
                }

                const isUserAdmin = userEmail === 'avishkarkakde2004@gmail.com';
                console.log('Is user admin:', isUserAdmin);
                setIsAdmin(isUserAdmin);
            } catch (error) {
                console.error('Auth check error:', error);
                console.error('Error response:', error.response);
                setError(error.message);
                setIsAdmin(false);
            }
        };

        checkAdminStatus();
    }, []);


    if (isAdmin === null) {
        return <div>Loading...</div>
    }
    if (error) {
        return <div>Error: {error}</div>
    }
    return isAdmin ? <Outlet /> : <Navigate to="/login" replace />

}