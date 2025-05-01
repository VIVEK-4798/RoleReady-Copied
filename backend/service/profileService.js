const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const path = require('path');

// File storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/resumes'); // Make sure this folder exists
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// GET About info
router.get('/get-about/:user_id', (req, res) => {
  const userId = req.params.user_id;

  if (!userId) {
    return res.status(400).json({ message: 'user_id is required' });
  }

  const query = `SELECT about_text FROM profile_info WHERE user_id = ?`;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching About info:', err);
      return res.status(500).json({ message: 'Database error', error: err.message });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'No about info found', about_text: '' });
    }

    res.status(200).json({ message: 'About info retrieved successfully', about_text: results[0].about_text });
  });
});

// POST About info
router.post('/save-about', (req, res) => {
  const { user_id, about_text } = req.body;

  if (!user_id || !about_text) {
    return res.status(400).json({ message: 'user_id and about_text are required' });
  }

  const query = `
    INSERT INTO profile_info (user_id, about_text)
    VALUES (?, ?)
    ON DUPLICATE KEY UPDATE about_text = VALUES(about_text)
  `;

  db.query(query, [user_id, about_text], (err, result) => {
    if (err) {
      console.error('Error saving About info:', err);
      return res.status(500).json({ message: 'Database error', error: err.message });
    }

    res.status(200).json({ message: 'Profile about info saved successfully', success: true });
  });
});

// GET Resume info
router.get('/get-resume/:user_id', (req, res) => {
  const userId = req.params.user_id;

  if (!userId) {
    return res.status(400).json({ message: 'user_id is required' });
  }

  const query = `SELECT resume_file FROM profile_info WHERE user_id = ?`;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching Resume info:', err);
      return res.status(500).json({ message: 'Database error', error: err.message });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'No resume info found', resume_file: '' });
    }

    res.status(200).json({ message: 'Resume info retrieved successfully', resume_name: results[0].resume_file });
  });
});

// POST Resume info
router.post('/upload-resume', upload.single('resume'), (req, res) => {
  const user_id = req.body.user_id;
  const resume_file = req.file?.filename;

  if (!user_id || !resume_file) {
    return res.status(400).json({ message: 'user_id and resume_file are required' });
  }

  const query = `
    INSERT INTO profile_info (user_id, resume_file)
    VALUES (?, ?)
    ON DUPLICATE KEY UPDATE resume_file = VALUES(resume_file)
  `;

  db.query(query, [user_id, resume_file], (err, result) => {
    if (err) {
      console.error('Error saving Resume info:', err);
      return res.status(500).json({ message: 'Database error', error: err.message });
    }

    res.status(200).json({ message: 'Resume info saved successfully', success: true });
  });
});

// GET Skills
router.get('/get-skills/:user_id', (req, res) => {
  const userId = req.params.user_id;

  if (!userId) {
    return res.status(400).json({ message: 'user_id is required' });
  }

  const query = `SELECT skills FROM profile_info WHERE user_id = ?`;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching skills:', err);
      return res.status(500).json({ message: 'Database error', error: err.message });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'No skills found', skills: '' });
    }

    res.status(200).json({ message: 'Skills retrieved successfully', skills: results[0].skills });
  });
});

// POST Skills
router.post('/save-skills', (req, res) => {
  const { user_id, skills } = req.body;

  if (!user_id || !skills) {
    return res.status(400).json({ message: 'user_id and skills are required' });
  }

  const query = `
    INSERT INTO profile_info (user_id, skills)
    VALUES (?, ?)
    ON DUPLICATE KEY UPDATE skills = VALUES(skills)
  `;

  db.query(query, [user_id, skills], (err, result) => {
    if (err) {
      console.error('Error saving skills:', err);
      return res.status(500).json({ message: 'Database error', error: err.message });
    }

    res.status(200).json({ message: 'Skills saved successfully', success: true });
  });
});



module.exports = router;
