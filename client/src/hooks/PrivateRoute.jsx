// src/hooks/PrivateRoute.jsx
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from './AxiosConfig.js';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

const PrivateRoute = ({ children, requiredRole }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const validateSession = async () => {
      try {
        const res = await axios.get('/session');
        if (res.data.loggedIn === false) {
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(true);
          setUserData({
            email: res.data.email,
            accountID: res.data.accountID,
            userRole: res.data.userRole, // Ensure consistent case from backend
            firstname: res.data.firstname
          });
        }
      } catch (error) {
        console.error('Session validation failed:', error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    validateSession();
  }, []);

  if (loading) {
    return <Backdrop
      sx={(theme) => ({ color: '#fff', zIndex: 12000 })}
      open={open}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Automatic redirection based on user role
  if (!requiredRole) {
    if (userData?.userRole?.toLowerCase() === 'admin') {
      return <Navigate to="/admin-dashboard" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  // Check if the user has the required role if specified
  if (requiredRole && userData?.userRole?.toLowerCase() !== requiredRole.toLowerCase()) {
    return <Navigate to="/" replace />;
  }

  return React.cloneElement(children, { userData, isAuthenticated });
};

export default PrivateRoute;