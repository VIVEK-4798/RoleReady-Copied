const express = require('express');
require('dotenv').config();
const db = require("../db");
const bcrypt = require('bcrypt');
const crypto = require("crypto");
const sendEmail = require('../Utils/SendEmail');

const app = express();
let otpStore = {}; 

const allowedRoles = ['user', 'mentor', 'admin']; 

// ---------------- LOGIN ---------------- //
app.post('/login', (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ message: 'Email, password, and role are required' });
  }

  if (!allowedRoles.includes(role)) {
    return res.status(403).json({ message: 'Access denied for this role' });
  }

  const query = 'SELECT * FROM user WHERE email = ? AND role = ?';
  db.query(query, [email, role], async (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error', err });
    if (results.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = results[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    res.status(200).json({ message: 'Login successful', userData: user });
  });
});

// ---------------- SEND OTP ---------------- //
app.post("/send-otp", (req, res) => {
  const { email, role } = req.body;

  if (!email || !role) {
    return res.status(400).json({ message: "Email and role are required" });
  }

  if (!allowedRoles.includes(role)) {
    return res.status(403).json({ message: 'Access denied for this role' });
  }

  const query = "SELECT * FROM user WHERE email = ? AND role = ?";
  db.query(query, [email, role], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", err });
    if (results.length === 0) {
      return res.status(404).json({ message: "User not found for the given role" });
    }

    const otp = crypto.randomInt(100000, 999999);
    const key = `${email}_${role}`;
    otpStore[key] = otp;

    setTimeout(() => {
      delete otpStore[key];
      console.log(`OTP for ${email} with role ${role} expired`);
    }, 5 * 60 * 1000);

    const mailOptions = {
      from: 'info@startup24x7.com',
      to: email,
      subject: `OTP from Startup24x7`,
      text: `Hello,

Here is your OTP: ${otp}.
This OTP is valid for 5 minutes.

Best regards,
Startup24x7 Team`,
    };

    sendEmail(mailOptions)
      .then(() => {
        res.status(200).json({ message: "OTP sent successfully" });
      })
      .catch((error) => {
        res.status(500).json({ message: "Failed to send OTP", error });
      });
  });
});

// ---------------- VERIFY OTP ---------------- //
app.post("/verify-otp", (req, res) => {
  const { email, role, otp } = req.body;

  if (!email || !role || !otp) {
    return res.status(400).json({ message: "Email, role, and OTP are required" });
  }

  if (!allowedRoles.includes(role)) {
    return res.status(403).json({ message: 'Access denied for this role' });
  }

  const key = `${email}_${role}`;
  if (otpStore[key] && otpStore[key].toString() === otp) {
    delete otpStore[key];
    return res.status(200).json({ message: "OTP verified successfully" });
  }

  res.status(400).json({ message: "Invalid or expired OTP" });
});

module.exports = app;
