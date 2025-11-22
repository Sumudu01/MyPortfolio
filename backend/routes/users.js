const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mammoth = require('mammoth');
const extract = require('pdf-extract');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Multer setup for CV upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update user profile
router.put('/profile', auth, upload.single('profilePicture'), async (req, res) => {
  try {
    let updates;
    if (req.body.profile) {
      updates = JSON.parse(req.body.profile);
    } else {
      updates = req.body;
    }
    if (req.file) {
      updates.profilePicture = req.file.path;
    }
    const user = await User.findByIdAndUpdate(req.user.id, { profile: updates }, { new: true }).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Upload CV
router.post('/upload-cv', auth, upload.single('cv'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const user = await User.findById(req.user.id);
    user.cvFile = req.file.path;
    await user.save();

    // Parse CV
    let text = '';
    try {
      if (req.file.mimetype === 'application/pdf') {
        // Use pdf-extract
        const options = {};
        text = await new Promise((resolve, reject) => {
          extract(req.file.path, options, (err, data) => {
            if (err) reject(err);
            else resolve(data);
          });
        });
      } else if (req.file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        const result = await mammoth.extractRawText({ path: req.file.path });
        text = result.value;
      }
    } catch (parseErr) {
      console.error('CV parsing error:', parseErr);
      // Continue without parsing
    }

    // Parse CV content (simplified)
    const lines = text.split('\n').map(line => line.trim()).filter(line => line);
    let name = '';
    let bio = '';
    let skills = [];
    let experience = [];
    let education = [];
    let contact = {};

    // Extract name (usually first line)
    if (lines.length > 0) {
      name = lines[0];
    }

    // Simple section detection
    let currentSection = '';
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].toLowerCase();
      if (line.includes('experience') || line.includes('work history')) {
        currentSection = 'experience';
      } else if (line.includes('education') || line.includes('qualification')) {
        currentSection = 'education';
      } else if (line.includes('skill')) {
        currentSection = 'skills';
      } else if (line.includes('contact') || line.includes('phone') || line.includes('email')) {
        currentSection = 'contact';
      } else if (line.includes('summary') || line.includes('objective') || line.includes('profile')) {
        currentSection = 'bio';
      } else if (currentSection && line) {
        // Add content to current section
        switch (currentSection) {
          case 'bio':
            if (!bio) bio = lines[i];
            break;
          case 'skills':
            if (line.includes(',')) {
              skills = skills.concat(line.split(',').map(s => s.trim()));
            } else {
              skills.push(lines[i]);
            }
            break;
          case 'experience':
            if (experience.length < 3) {
              experience.push({ title: lines[i], company: '', duration: '', description: '' });
            }
            break;
          case 'education':
            if (education.length < 3) {
              education.push({ degree: lines[i], institution: '', year: '' });
            }
            break;
          case 'contact':
            if (line.includes('@')) {
              contact.email = lines[i];
            } else if (line.match(/\d{10}/)) {
              contact.phone = lines[i];
            }
            break;
        }
      }
    }

    // Update user profile
    user.profile.name = name;
    user.profile.bio = bio;
    user.profile.skills = skills.filter(s => s);
    user.profile.experience = experience;
    user.profile.education = education;
    user.profile.contact = contact;
    await user.save();

    res.json({ message: 'CV uploaded and parsed', profile: user.profile });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;