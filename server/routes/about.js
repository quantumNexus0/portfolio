const express = require('express');
const router = express.Router();
const AboutSection = require('../models/AboutSection');
const auth = require('../middleware/auth');

// Get all about sections
router.get('/', async (req, res) => {
  try {
    const sections = await AboutSection.find().sort({ title: 1 });
    res.json(sections);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create an about section
router.post('/', auth, async (req, res) => {
  const section = new AboutSection({
    title: req.body.title,
    description: req.body.description,
    icon: req.body.icon,
    user: req.user.id
  });

  try {
    const newSection = await section.save();
    res.status(201).json(newSection);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update an about section
router.put('/:id', auth, async (req, res) => {
  try {
    const section = await AboutSection.findById(req.params.id);
    if (!section) return res.status(404).json({ message: 'About section not found' });

    if (req.body.title) section.title = req.body.title;
    if (req.body.description) section.description = req.body.description;
    if (req.body.icon) section.icon = req.body.icon;

    const updatedSection = await section.save();
    res.json(updatedSection);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete an about section
router.delete('/:id', auth, async (req, res) => {
  try {
    const section = await AboutSection.findById(req.params.id);
    if (!section) return res.status(404).json({ message: 'About section not found' });

    await section.deleteOne();
    res.json({ message: 'About section deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
