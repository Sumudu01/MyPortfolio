const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profile: {
    name: String,
    bio: String,
    skills: [String],
    experience: [{
      title: String,
      company: String,
      duration: String,
      description: String
    }],
    education: [{
      degree: String,
      institution: String,
      year: String
    }],
    projects: [{
      title: String,
      description: String,
      link: String
    }],
    contact: {
      phone: String,
      linkedin: String,
      github: String
    }
  },
  cvFile: String, // path to uploaded CV
  portfolioUrl: String, // generated portfolio URL
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);