const express = require('express');
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Generate portfolio
router.post('/generate', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const templatePath = path.join(__dirname, '../templates/portfolio.ejs');
    const outputDir = path.join(__dirname, '../public/portfolios');
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
    const outputPath = path.join(outputDir, `${user.username}.html`);

    const html = await ejs.renderFile(templatePath, { profile: user.profile });
    fs.writeFileSync(outputPath, html);

    user.portfolioUrl = `/portfolios/${user.username}.html`;
    await user.save();

    res.json({ message: 'Portfolio generated', url: user.portfolioUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get portfolio
router.get('/:username', (req, res) => {
  const filePath = path.join(__dirname, '../public/portfolios', `${req.params.username}.html`);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ error: 'Portfolio not found' });
  }
});

module.exports = router;