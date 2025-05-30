const express = require("express");
const router = express.Router();
const db = require("../db.js");
const nodemailer = require('nodemailer');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


router.post('/register', async (req, res) => {
    const { firstname, lastname, phone, email, password } = req.body;
    const checkEmail = 'SELECT * FROM account WHERE email = ?';

    db.query(checkEmail, [email], async (err, emailRes) => {
        if (err) return res.status(500).json({ error: err.message });
        if (emailRes.length > 0) return res.status(400).json({ error: "Email already exists" });


        const hashedPassword = await bcrypt.hash(password, 10);

        const insertValues = 'INSERT INTO account (firstname, lastname, email, password, phoneNum, userRole) VALUES(?,?,?,?,?,?)';
        const values = [
            firstname,
            lastname,
            email,            
            hashedPassword,
            phone,
            'Customer'
        ];
        db.query(insertValues, values, (err, accRes) => {
            if (err) return res.status(500).json({ error: err.message });
            if (accRes.affectedRows === 0) return res.status(400).json({ error: "Failed to create account" });

            const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1d' });

            // Send verification email
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });

            const verificationLink = `http://localhost:${process.env.PORT}/api/verify/${token}`;

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Verify your email address',
                html: `<p style="font-weight: bold;">Welcome to CAFÉ de JÚR, ${firstname + ' ' + lastname}!</p><p>Please verify your email to finish creating your account.<br><a href="${verificationLink}" style="
      display: inline-block;
      margin-top: 20px;
      padding: 10px 20px;
      background-color: #6F4E37;
      color: white;
      text-decoration: none;
      border-radius: 5px;
      font-weight: bold;
    ">VERIFY EMAIL</a></p>`,
            };

            transporter.sendMail(mailOptions, (err, info) => {
                if (err) return res.status(500).json({ error: `Email failed to send: ${err}` });
                res.json({ message: 'Registration successful! Please verify your email.' });
            })
        })
    })
})


router.get('/verify/:token', (req, res) => {
    const token = req.params.token;

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(400).send('Invalid or expired token');

        const email = decoded.email;
        db.query('UPDATE account SET accStatus = "Registered" WHERE email = ?', [email], (err, result) => {
            if (err) return res.status(500).send('Error activating account');

            // Redirect user to frontend confirmation page
            res.redirect("http://localhost:5173/email-verified");
        });
    });
});



module.exports = router;