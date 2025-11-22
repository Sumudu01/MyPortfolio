const express = require('express');
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
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
    const outputPath = path.join(outputDir, `${user.username}.pdf`);

    const html = await ejs.renderFile(templatePath, { profile: user.profile });

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html);
    const pdf = await page.pdf({ format: 'A4' });
    await browser.close();

    fs.writeFileSync(outputPath, pdf);

    user.portfolioUrl = `/portfolios/${user.username}`;
    await user.save();

    res.json({ message: 'Portfolio generated', url: user.portfolioUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get portfolio
router.get('/:username', (req, res) => {
  const filePath = path.join(__dirname, '../public/portfolios', `${req.params.username}.pdf`);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ error: 'Portfolio not found' });
  }
});

module.exports = router;