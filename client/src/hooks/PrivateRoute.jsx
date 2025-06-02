// src/hooks/PrivateRoute.jsx
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from './AxiosConfig.js';

const PrivateRoute = ({ children }) => {
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
            userRole: res.data.userRole,
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

  if (loading) return <div>Loading...</div>;

  return isAuthenticated
    ? React.cloneElement(children, { userData, isAuthenticated })
    : <Navigate to="/" replace />;
};

export default PrivateRoute;
