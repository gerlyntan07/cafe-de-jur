import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from './pages/Landing';
import SignUp from './pages/SignUp';
import EmailVerified from './pages/EmailVerified';
import MyAccount from './pages/MyAccount.jsx';

import PrivateRoute from './hooks/PrivateRoute.jsx';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Landing />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/email-verified' element={<EmailVerified />} />        
        <Route path='/myAcc' element={<PrivateRoute><MyAccount /></PrivateRoute>} />       
      </Routes>
    </Router>
  )
}

export default App