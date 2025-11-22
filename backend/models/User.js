const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  googleId: { type: String, unique: true, sparse: true },
  profile: {
    name: String,
    position: String,
    bio: String,
    profilePicture: String,
    themeColor: { type: String, default: '#4caf50' },
    skills: {
      language: [String],
      programming: [String],
      other: [String]
    },
    experience: [{
      title: String,
      company: String,
      duration: String,
      description: String
    }],
    education: [{
      level: String,
      degree: String,
      institution: String,
      startDate: String,
      endDate: String
    }],
    projects: [{
      title: String,
      description: String,
      link: String
    }],
    contact: {
      phone: String,
      email: String,
      linkedin: String,
      github: String
    }
  },
  cvFile: String, // path to uploaded CV
  portfolioUrl: String, // generated portfolio URL
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);