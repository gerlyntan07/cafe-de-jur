// routes/login.js
const express = require('express');
const router = express.Router();
const db = require("../db.js");
const bcrypt = require("bcrypt");
require('dotenv').config();

router.use(express.json());

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const readUser = 'SELECT * FROM account WHERE email = ?';

  db.query(readUser, [email], (err, emailRes) => {
    if (err) return res.status(500).json({ error: err.message });

    const user = emailRes[0];
    if (emailRes.length > 0) {
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          return res.json({ message: "Error in password comparison", isLoggedIn: false });
        }
        if (isMatch) {
          if (user.accStatus === 'Pending') {
            return res.status(403).json({ message: 'Your account is not yet activated. Please check your email.', isLoggedIn: false });
          } else {
            req.session.accountID = user.accountID;
            req.session.email = user.email;
            req.session.userRole = user.userRole;
            req.session.firstname = user.firstname;
            req.session.lastname = user.lastname;
            console.log('Set cookies:', req.cookies);
            console.log('Session data:', req.session);
            res.json({
              message: 'login successful',
              accountID: req.session.accountID,
              email: req.session.email,
              userRole: req.session.userRole,
              isLoggedIn: true              
            })
          }
        } else {
          return res.status(401).json({ message: 'Incorrect password. Please try again.', isLoggedIn: false });
        }
      })
    } else if(emailRes.length === 0){
      return res.status(404).json({ message: 'Email not found. Please try again.', isLoggedIn: false });
    }
  })
});

// Check session
router.get('/session', (req, res) => {
  console.log("Session after setting: ", req.session);
  if (req.session && req.session.accountID) {
    res.json({ 
      loggedIn: true, 
      accountID: req.session.accountID,
      email: req.session.email,
      userRole: req.session.userRole,
      firstname: req.session.firstname,
      lastname: req.session.lastname,
    });
  } else {
    console.error('Session not found');
    res.json({ loggedIn: false });
  }
});

// Logout
router.post('/logout', (req, res) => {
  if (req.session) {
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ valid: false, message: "Logout failed." });
            }
            // Clear the session cookie
            res.clearCookie("cafe_user_sid");
            return res.json({ valid: true, message: "Logout successful." });
        });
    } else {
        return res.json({ valid: false, message: "No active session." });
    }
});


module.exports = router;
