const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');
const auth = require('../middleware/auth');

// Get profile
router.get('/:userId', async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.params.userId });
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Upsert profile
router.post('/', auth, async (req, res) => {
  try {
    let profile = await Profile.findOne({ user: req.user.id });
    
    if (profile) {
      if (req.body.avatar_url) profile.avatar_url = req.body.avatar_url;
      profile = await profile.save();
    } else {
      profile = new Profile({
        user: req.user.id,
        avatar_url: req.body.avatar_url
      });
      profile = await profile.save();
    }
    
    res.json(profile);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
