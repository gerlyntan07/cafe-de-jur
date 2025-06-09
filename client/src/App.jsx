import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from './pages/Landing';
import SignUp from './pages/SignUp';
import EmailVerified from './pages/EmailVerified';
import MyAccount from './pages/MyAccount.jsx';
import Menu from './pages/Menu.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx';

import PrivateRoute from './hooks/PrivateRoute.jsx';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Landing />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/email-verified' element={<EmailVerified />} />
        <Route path='/menu' element={<Menu />} />

        <Route path='/redirect-after-login' element={<PrivateRoute />} />
        <Route path='/myAcc' element={<PrivateRoute requiredRole='customer'><MyAccount /></PrivateRoute>} />
        <Route path='/admin-dashboard' element={<PrivateRoute requiredRole='admin'><AdminDashboard /></PrivateRoute>} />        
      </Routes>
    </Router>
  )
}

export default App