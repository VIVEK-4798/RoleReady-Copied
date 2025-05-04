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

// Get all info
router.get('/get-profile-info/:user_id', (req, res) => {
  const userId = req.params.user_id;
  const role = req.query.role || 'user';

  if (!userId) {
    return res.status(400).json({ message: 'user_id is required' });
  }

  let tableName;
  if (role === 'user') tableName = 'profile_info';
  else if (role === 'mentor') tableName = 'mentor_profile_info';
  else if (role === 'admin') tableName = 'admin_profile_info';
  else return res.status(400).json({ message: 'Invalid role' });

  const query = `
    SELECT about_text, skills, experience, resume_file, projects, certificate, education
    FROM ${tableName}
    WHERE user_id = ?
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching profile info:', err);
      return res.status(500).json({ message: 'Database error', error: err.message });
    }

    if (results.length === 0) {
      return res.status(200).json({
        about_text: '',
        skills: '',
        experience: '',
        resume_file: '',
        projects: '',
        certificate: '',
        education: '',
      });
    }

    const result = results[0];
    res.status(200).json({
      about_text: result.about_text || '',
      skills: result.skills || '',
      experience: result.experience || '',
      resume_file: result.resume_file || '',
      projects: result.projects ? JSON.parse(result.projects) : '',
      certificate: result.certificate ? JSON.parse(result.certificate) : '',
      education: result.education ? JSON.parse(result.education) : '',
    });
  });
});


// GET About info
router.get('/get-about/:user_id', (req, res) => {
  const userId = req.params.user_id;
  const role = req.query.role; // Now using query param for role

  if (!userId || !role) {
    return res.status(400).json({ message: 'user_id and role are required' });
  }

  let tableName;
  if (role === 'user') tableName = 'profile_info';
  else if (role === 'mentor') tableName = 'mentor_profile_info';
  else if (role === 'admin') tableName = 'admin_profile_info';
  else return res.status(400).json({ message: 'Invalid role' });

  const query = `SELECT about_text FROM ${tableName} WHERE user_id = ?`;

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
  const { user_id, about_text, role } = req.body;

  if (!user_id || !about_text || !role) {
    return res.status(400).json({ success: false, message: 'user_id, about_text, and role are required' });
  }

  let tableName;
  if (role === 'user') tableName = 'profile_info';
  else if (role === 'mentor') tableName = 'mentor_profile_info';
  else if (role === 'admin') tableName = 'admin_profile_info';
  else return res.status(400).json({ success: false, message: 'Invalid role' });

  const checkQuery = `SELECT * FROM ${tableName} WHERE user_id = ?`;
  const updateQuery = `UPDATE ${tableName} SET about_text = ? WHERE user_id = ?`;
  const insertQuery = `INSERT INTO ${tableName} (user_id, about_text) VALUES (?, ?)`;

  db.query(checkQuery, [user_id], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Database error', error: err.message });

    if (results.length > 0) {
      db.query(updateQuery, [about_text, user_id], (err) => {
        if (err) return res.status(500).json({ success: false, message: 'Update failed', error: err.message });
        return res.status(200).json({ success: true, message: 'About info updated successfully' });
      });
    } else {
      db.query(insertQuery, [user_id, about_text], (err) => {
        if (err) return res.status(500).json({ success: false, message: 'Insert failed', error: err.message });
        return res.status(201).json({ success: true, message: 'About info inserted successfully' });
      });
    }
  });
});


// GET Resume info
router.get('/get-resume/:user_id', (req, res) => {
  const userId = req.params.user_id;
  const role = req.query.role;

  if (!userId || !role) {
    return res.status(400).json({ message: 'user_id and role are required' });
  }

  let tableName;
  if (role === 'user') tableName = 'profile_info';
  else if (role === 'mentor') tableName = 'mentor_profile_info';
  else if (role === 'admin') tableName = 'admin_profile_info';
  else return res.status(400).json({ message: 'Invalid role' });

  const query = `SELECT resume_file FROM ${tableName} WHERE user_id = ?`;

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
  const role = req.body.role;
  const resume_file = req.file?.filename;

  if (!user_id || !resume_file || !role) {
    return res.status(400).json({ message: 'user_id, resume_file, and role are required' });
  }

  let tableName;
  if (role === 'user') tableName = 'profile_info';
  else if (role === 'mentor') tableName = 'mentor_profile_info';
  else if (role === 'admin') tableName = 'admin_profile_info';
  else return res.status(400).json({ message: 'Invalid role' });

  const query = `
    INSERT INTO ${tableName} (user_id, resume_file)
    VALUES (?, ?)
    ON DUPLICATE KEY UPDATE resume_file = VALUES(resume_file)
  `;

  db.query(query, [user_id, resume_file], (err) => {
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
  const role = req.query.role || 'user';

  if (!userId) {
    return res.status(400).json({ message: 'user_id is required' });
  }

  let tableName;
  if (role === 'user') tableName = 'profile_info';
  else if (role === 'mentor') tableName = 'mentor_profile_info';
  else if (role === 'admin') tableName = 'admin_profile_info';
  else return res.status(400).json({ message: 'Invalid role' });

  const query = `SELECT skills FROM ${tableName} WHERE user_id = ?`;

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
  const { user_id, skills, role = 'user' } = req.body;

  if (!user_id || !skills) {
    return res.status(400).json({ message: 'user_id and skills are required' });
  }

  let tableName;
  if (role === 'user') tableName = 'profile_info';
  else if (role === 'mentor') tableName = 'mentor_profile_info';
  else if (role === 'admin') tableName = 'admin_profile_info';
  else return res.status(400).json({ message: 'Invalid role' });

  const query = `
    INSERT INTO ${tableName} (user_id, skills)
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



// GET Experience Info
router.get('/get-experience/:user_id', (req, res) => {
  const userId = req.params.user_id;
  const role = req.query.role || 'user';

  if (!userId) {
    return res.status(400).json({ message: 'user_id is required' });
  }

  let tableName;
  if (role === 'user') tableName = 'profile_info';
  else if (role === 'mentor') tableName = 'mentor_profile_info';
  else if (role === 'admin') tableName = 'admin_profile_info';
  else return res.status(400).json({ message: 'Invalid role' });

  const query = `SELECT experience FROM ${tableName} WHERE user_id = ?`;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching experience info:', err);
      return res.status(500).json({ message: 'Database error', error: err.message });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'No experience info found', experience: [] });
    }

    res.status(200).json({
      message: 'Experience info retrieved successfully',
      experience: results[0].experience
    });
  });
});



// POST Experience Info
router.post('/save-experience', (req, res) => {
  const { user_id, experience, role = 'user' } = req.body;  

  if (!user_id || !experience) {
    return res.status(400).json({ message: 'user_id and experience are required' });
  }

  let tableName;
  if (role === 'user') tableName = 'profile_info';
  else if (role === 'mentor') tableName = 'mentor_profile_info';
  else if (role === 'admin') tableName = 'admin_profile_info';
  else return res.status(400).json({ message: 'Invalid role' });

  const query = `
    INSERT INTO ${tableName} (user_id, experience)
    VALUES (?, ?)
    ON DUPLICATE KEY UPDATE experience = VALUES(experience)
  `;

  db.query(query, [user_id, JSON.stringify(experience)], (err, result) => {
    if (err) {
      console.error('Error saving experience info:', err);
      return res.status(500).json({ message: 'Database error', error: err.message });
    }

    res.status(200).json({ message: 'Experience info saved successfully', success: true });
  });
});


// GET Education Info
router.get('/get-education/:user_id', (req, res) => {
  const userId = req.params.user_id;
  const role = req.query.role || 'user';

  if (!userId) {
    return res.status(400).json({ message: 'user_id is required' });
  }

  let tableName;
  if (role === 'user') tableName = 'profile_info';
  else if (role === 'mentor') tableName = 'mentor_profile_info';
  else if (role === 'admin') tableName = 'admin_profile_info';
  else return res.status(400).json({ message: 'Invalid role' });

  const query = `SELECT education FROM ${tableName} WHERE user_id = ?`;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching education info:', err);
      return res.status(500).json({ message: 'Database error', error: err.message });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'No education info found', education: [] });
    }

    res.status(200).json({
      message: 'Education info retrieved successfully',
      education: results[0].education
    });
  });
});



// POST Education Info
router.post('/save-education', (req, res) => {
  const { user_id, education, role = 'user' } = req.body;

  if (!user_id || !education) {
    return res.status(400).json({ message: 'user_id and education are required' });
  }

  let tableName;
  if (role === 'user') tableName = 'profile_info';
  else if (role === 'mentor') tableName = 'mentor_profile_info';
  else if (role === 'admin') tableName = 'admin_profile_info';
  else return res.status(400).json({ message: 'Invalid role' });

  const query = `
    INSERT INTO ${tableName} (user_id, education)
    VALUES (?, ?)
    ON DUPLICATE KEY UPDATE education = VALUES(education)
  `;

  db.query(query, [user_id, JSON.stringify(education)], (err, result) => {
    if (err) {
      console.error('Error saving education info:', err);
      return res.status(500).json({ message: 'Database error', error: err.message });
    }

    res.status(200).json({ message: 'Education info saved successfully', success: true });
  });
});


// GET Certificate Info
router.get('/get-certificate/:user_id', (req, res) => {
  const userId = req.params.user_id;
  const role = req.query.role || 'user';

  if (!userId) {
    return res.status(400).json({ message: 'user_id is required' });
  }

  let tableName;
  if (role === 'user') tableName = 'profile_info';
  else if (role === 'mentor') tableName = 'mentor_profile_info';
  else if (role === 'admin') tableName = 'admin_profile_info';
  else return res.status(400).json({ message: 'Invalid role' });

  const query = `SELECT certificate FROM ${tableName} WHERE user_id = ?`;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching certificate info:', err);
      return res.status(500).json({ message: 'Database error', error: err.message });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'No certificate info found', certificate: [] });
    }

    res.status(200).json({
      message: 'Certificate info retrieved successfully',
      certificate: results[0].certificate
    });
  });
});



// POST Certificate Info
router.post('/save-certificate', (req, res) => {
  const { user_id, certificate, role = 'user' } = req.body;

  if (!user_id || !certificate) {
    return res.status(400).json({ message: 'user_id and certificate are required' });
  }

  let tableName;
  if (role === 'user') tableName = 'profile_info';
  else if (role === 'mentor') tableName = 'mentor_profile_info';
  else if (role === 'admin') tableName = 'admin_profile_info';
  else return res.status(400).json({ message: 'Invalid role' });

  const query = `
    INSERT INTO ${tableName} (user_id, certificate)
    VALUES (?, ?)
    ON DUPLICATE KEY UPDATE certificate = VALUES(certificate)
  `;

  db.query(query, [user_id, JSON.stringify(certificate)], (err, result) => {
    if (err) {
      console.error('Error saving certificate info:', err);
      return res.status(500).json({ message: 'Database error', error: err.message });
    }

    res.status(200).json({ message: 'Certificate info saved successfully', success: true });
  });
});


// GET Project Info
router.get('/get-projects/:user_id', (req, res) => {
  const userId = req.params.user_id;
  const role = req.query.role || 'user';

  if (!userId) {
    return res.status(400).json({ message: 'user_id is required' });
  }

  let tableName;
  if (role === 'user') tableName = 'profile_info';
  else if (role === 'mentor') tableName = 'mentor_profile_info';
  else if (role === 'admin') tableName = 'admin_profile_info';
  else return res.status(400).json({ message: 'Invalid role' });

  const query = `SELECT projects FROM ${tableName} WHERE user_id = ?`;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching projects info:', err);
      return res.status(500).json({ message: 'Database error', error: err.message });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'No project info found', projects: [] });
    }

    res.status(200).json({
      message: 'Project info retrieved successfully',
      projects: results[0].projects ? JSON.parse(results[0].projects) : []
    });
  });
});


// POST Project Info
router.post('/save-projects', (req, res) => {
  const { user_id, projects, role = 'user' } = req.body;

  if (!user_id || !projects) {
    return res.status(400).json({ message: 'user_id and projects are required' });
  }

  let tableName;
  if (role === 'user') tableName = 'profile_info';
  else if (role === 'mentor') tableName = 'mentor_profile_info';
  else if (role === 'admin') tableName = 'admin_profile_info';
  else return res.status(400).json({ message: 'Invalid role' });

  const query = `
    INSERT INTO ${tableName} (user_id, projects)
    VALUES (?, ?)
    ON DUPLICATE KEY UPDATE projects = VALUES(projects)
  `;

  db.query(query, [user_id, JSON.stringify(projects)], (err, result) => {
    if (err) {
      console.error('Error saving projects info:', err);
      return res.status(500).json({ message: 'Database error', error: err.message });
    }

    res.status(200).json({ message: 'Projects info saved successfully', success: true });
  });
});


// GET niche or Experience 
router.get('/get-niche-or-experience/:user_id/:role', (req, res) => {
  const { user_id, role } = req.params;

  if (!user_id || !role) {
    return res.status(400).json({ message: 'user_id and role are required' });
  }

  const query = role === 'mentor'
    ? `SELECT work_experience FROM mentor_profile_info WHERE user_id = ?`
    : `SELECT niche FROM profile_info WHERE user_id = ?`;

  db.query(query, [user_id], (err, results) => {
    if (err) {
      console.error('Error fetching info:', err);
      return res.status(500).json({ message: 'Database error', error: err.message });
    }

    const data =
      results.length === 0
        ? null
        : role === 'mentor'
        ? results[0].work_experience
        : results[0].niche;

    res.status(200).json({
      message: 'Info fetched successfully',
      value: data
    });
  });
});

// POST niche or experience
router.post('/save-niche-or-experience', (req, res) => {
  const { user_id, role, value } = req.body;  

  if (!user_id || !role || !value) {
    return res.status(400).json({ message: 'user_id, role, and value are required' });
  }

  const query =
    role === 'mentor'
      ? `
      INSERT INTO mentor_profile_info (user_id, work_experience)
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE work_experience = VALUES(work_experience)
    `
      : `
      INSERT INTO profile_info (user_id, niche)
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE niche = VALUES(niche)
    `;

  db.query(query, [user_id, value], (err, result) => {
    if (err) {
      console.error('Error saving info:', err);
      return res.status(500).json({ message: 'Database error', error: err.message });
    }

    res.status(200).json({ message: 'Info saved successfully', success: true });
  });
});



module.exports = router;
