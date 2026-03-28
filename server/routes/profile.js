const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');
const auth = require('../middleware/auth');

// Get profile
router.get('/:userId', async (req, res) => {
  try {
    let profile = await Profile.findOne({ user: req.params.userId });
    if (!profile) {
      // Create a default profile if it doesn't exist to avoid 404s on landing
      profile = new Profile({ user: req.params.userId });
      await profile.save();
    }
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Upsert profile
router.post('/', auth, async (req, res) => {
  try {
    const { fullName, heroTitle, bio, avatar_url, socialLinks } = req.body;
    let profile = await Profile.findOne({ user: req.user.id });
    
    if (profile) {
      if (fullName !== undefined) profile.fullName = fullName;
      if (heroTitle !== undefined) profile.heroTitle = heroTitle;
      if (bio !== undefined) profile.bio = bio;
      if (avatar_url !== undefined) profile.avatar_url = avatar_url;
      if (socialLinks !== undefined) profile.socialLinks = { ...profile.socialLinks, ...socialLinks };
      
      profile = await profile.save();
    } else {
      profile = new Profile({
        user: req.user.id,
        fullName,
        heroTitle,
        bio,
        avatar_url,
        socialLinks
      });
      profile = await profile.save();
    }
    
    res.json(profile);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
