const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  fullName: {
    type: String,
    default: 'Vipul Yadav'
  },
  heroTitle: {
    type: String,
    default: 'Crafting Exceptional Digital Experiences'
  },
  bio: {
    type: String,
    default: 'Modern Technology and Creative Problem Solving.'
  },
  avatar_url: {
    type: String
  },
  socialLinks: {
    github: { type: String, default: '' },
    instagram: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    email: { type: String, default: '' }
  }
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);
