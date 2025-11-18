const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
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
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const updates = req.body;
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
    if (req.file.mimetype === 'application/pdf') {
      const dataBuffer = fs.readFileSync(req.file.path);
      const data = await pdfParse(dataBuffer);
      text = data.text;
    } else if (req.file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const result = await mammoth.extractRawText({ path: req.file.path });
      text = result.value;
    }

    // Simple parsing (this can be improved with NLP)
    const lines = text.split('\n').map(line => line.trim()).filter(line => line);
    const name = lines[0] || '';
    const skills = lines.filter(line => line.toLowerCase().includes('skill')).join(' ').split(',').map(s => s.trim());
    // More parsing logic here...

    user.profile.name = name;
    user.profile.skills = skills;
    await user.save();

    res.json({ message: 'CV uploaded and parsed', profile: user.profile });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;