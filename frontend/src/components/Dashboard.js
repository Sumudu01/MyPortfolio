import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Divider,
  Fab,
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Web from '@mui/icons-material/Web';
import MenuIcon from '@mui/icons-material/Menu';

const skillOptions = {
  language: ['English', 'Sinhala', 'Tamil', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Korean', 'Arabic'],
  programming: ['Java', 'Python', 'JavaScript', 'R', 'C++', 'C#', 'PHP', 'Ruby', 'Go', 'Swift', 'Kotlin', 'TypeScript', 'SQL', 'HTML', 'CSS'],
  other: ['Project Management', 'Data Analysis', 'Communication', 'Leadership', 'Teamwork', 'Problem Solving', 'Creativity', 'Time Management', 'Adaptability', 'Critical Thinking']
};

const educationLevels = [
  'Ordinary Level',
  'Advanced Level',
  "Bachelor's",
  "Master's",
  'PhD',
  'Diploma',
  'Higher Diploma',
  'Certificate',
  'Associate Degree',
  'Doctorate'
];

function Dashboard({ token, onLogout }) {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({});
  const [selectedSection, setSelectedSection] = useState('profile');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [user, setUser] = useState({ username: '', email: '', password: '' });
  const [portfolioData, setPortfolioData] = useState({
    name: '',
    position: '',
    bio: '',
    profilePicture: null,
    themeColor: '#4caf50',
    skills: { language: [], programming: [], other: [] },
    experience: [{ title: '', company: '', duration: '', description: '' }],
    education: [{ level: '', degree: '', institution: '', startDate: '', endDate: '' }],
    contact: { phone: '', email: '', linkedin: '', github: '' }
  });

  const fetchProfile = useCallback(async () => {
    try {
      const response = await fetch('/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setProfile(data?.profile || {});
        setUser({ username: data.username, email: data.email, password: '' });
      } else {
        console.error('Failed to fetch profile:', response.status);
      }
    } catch (error) {
      console.error('Network error fetching profile:', error);
    }
  }, [token]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (profile.name) {
      setPortfolioData({ ...profile });
    }
  }, [profile]);

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleUserChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const addEducation = () => {
    setPortfolioData({ ...portfolioData, education: [...portfolioData.education, { level: '', degree: '', institution: '', startDate: '', endDate: '' }] });
  };

  const addExperience = () => {
    setPortfolioData({ ...portfolioData, experience: [...portfolioData.experience, { title: '', company: '', duration: '', description: '' }] });
  };

  const updateEducation = (index, field, value) => {
    const newEducation = [...portfolioData.education];
    newEducation[index][field] = value;
    setPortfolioData({ ...portfolioData, education: newEducation });
  };

  const updateExperience = (index, field, value) => {
    const newExperience = [...portfolioData.experience];
    newExperience[index][field] = value;
    setPortfolioData({ ...portfolioData, experience: newExperience });
  };

  const updateProfile = async () => {
    try {
      // Clean the data: remove empty entries
      const cleanedData = {
        ...portfolioData,
        experience: portfolioData.experience.filter(exp => exp.title.trim() || exp.company.trim() || exp.description.trim()),
        education: portfolioData.education.filter(edu => edu.degree.trim() || edu.institution.trim()),
        contact: (portfolioData.contact?.phone?.trim() || portfolioData.contact?.email?.trim() || portfolioData.contact?.linkedin?.trim() || portfolioData.contact?.github?.trim()) ? portfolioData.contact : null
      };

      let body;
      let headers = { Authorization: `Bearer ${token}` };
      if (cleanedData.profilePicture) {
        const formData = new FormData();
        formData.append('profile', JSON.stringify(cleanedData));
        formData.append('profilePicture', cleanedData.profilePicture);
        body = formData;
      } else {
        headers['Content-Type'] = 'application/json';
        body = JSON.stringify(cleanedData);
      }
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers,
        body,
      });
      if (response.ok) {
        navigate('/');
      } else {
        const errorData = await response.json();
        if (errorData.error === 'Token expired') {
          alert('Session expired. Please login again.');
          onLogout();
        } else {
          alert('Update failed: ' + errorData.error);
        }
      }
    } catch (error) {
      alert('Network error: ' + error.message);
    }
  };



  const renderContent = () => {
    switch (selectedSection) {
      case 'dashboard':
        return (
          <Container maxWidth="lg" className="py-8">
            <Typography variant="h4" component="h1" gutterBottom>
              Welcome to MyPortfolio Dashboard
            </Typography>
            <Typography variant="body1" paragraph>
              Manage your profile, upload your CV, and generate your professional portfolio.
            </Typography>
          </Container>
        );
      case 'profile':
        return (
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            py: 4
          }}>

            <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              >
                <Card sx={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(15px)',
                  borderRadius: 4,
                  boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  overflow: 'hidden'
                }}>
                  <Box sx={{
                    background: 'linear-gradient(135deg, #4caf50, #66bb6a)',
                    color: 'white',
                    p: 3,
                    textAlign: 'center'
                  }}>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                    >
                      <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
                        User Profile
                      </Typography>
                      <Typography variant="subtitle1">
                        Manage your account and portfolio information
                      </Typography>
                    </motion.div>
                  </Box>

                  <CardContent sx={{ p: 4 }}>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                    >
                      <Typography variant="h6" sx={{ color: '#2e7d32', fontWeight: 'bold', mb: 3, textAlign: 'center' }}>
                        Account Details
                      </Typography>
                    </motion.div>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
                      <motion.div
                        initial={{ x: -30, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                      >
                        <TextField
                          fullWidth
                          label="Username"
                          name="username"
                          value={user.username}
                          onChange={handleUserChange}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              background: 'rgba(76, 175, 80, 0.05)',
                              '&:hover': { background: 'rgba(76, 175, 80, 0.1)' },
                              '&.Mui-focused': { background: 'rgba(76, 175, 80, 0.05)' }
                            }
                          }}
                        />
                      </motion.div>

                      <motion.div
                        initial={{ x: -30, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                      >
                        <TextField
                          fullWidth
                          label="Email"
                          name="email"
                          value={user.email}
                          onChange={handleUserChange}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              background: 'rgba(76, 175, 80, 0.05)',
                              '&:hover': { background: 'rgba(76, 175, 80, 0.1)' },
                              '&.Mui-focused': { background: 'rgba(76, 175, 80, 0.05)' }
                            }
                          }}
                        />
                      </motion.div>

                      <motion.div
                        initial={{ x: -30, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 1.0 }}
                      >
                        <TextField
                          fullWidth
                          label="New Password (leave empty to keep current)"
                          name="password"
                          type="password"
                          value={user.password}
                          onChange={handleUserChange}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              background: 'rgba(76, 175, 80, 0.05)',
                              '&:hover': { background: 'rgba(76, 175, 80, 0.1)' },
                              '&.Mui-focused': { background: 'rgba(76, 175, 80, 0.05)' }
                            }
                          }}
                        />
                      </motion.div>
                    </Box>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.6, delay: 1.2 }}
                    >
                      <Typography variant="h6" sx={{ color: '#2e7d32', fontWeight: 'bold', mb: 3, textAlign: 'center' }}>
                        Portfolio Information
                      </Typography>
                    </motion.div>

                    {/* Profile Picture Upload/Display */}
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.6, delay: 1.3 }}
                      style={{ textAlign: 'center', marginBottom: '20px' }}
                    >
                      <Box sx={{ display: 'inline-block', p: 2, borderRadius: 2, background: 'rgba(76, 175, 80, 0.1)' }}>
                        <Typography variant="subtitle2" sx={{ mb: 1, color: '#2e7d32' }}>Profile Picture</Typography>
                        {profile.profilePicture && (
                          <img
                            src={`/${profile.profilePicture}`}
                            alt="Profile"
                            style={{
                              width: '100px',
                              height: '100px',
                              borderRadius: '50%',
                              border: '3px solid #4caf50',
                              objectFit: 'cover',
                              marginBottom: '10px'
                            }}
                          />
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setPortfolioData({ ...portfolioData, profilePicture: e.target.files[0] })}
                          style={{ display: 'block', margin: '0 auto' }}
                        />
                      </Box>
                    </motion.div>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
                      <motion.div
                        initial={{ x: 30, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 1.4 }}
                      >
                        <TextField
                          fullWidth
                          label="Full Name"
                          value={portfolioData.name || ''}
                          onChange={(e) => setPortfolioData({ ...portfolioData, name: e.target.value })}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              background: 'rgba(76, 175, 80, 0.05)',
                              '&:hover': { background: 'rgba(76, 175, 80, 0.1)' },
                              '&.Mui-focused': { background: 'rgba(76, 175, 80, 0.05)' }
                            }
                          }}
                        />
                      </motion.div>

                      <motion.div
                        initial={{ x: 30, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 1.5 }}
                      >
                        <TextField
                          fullWidth
                          label="Position/Title"
                          value={portfolioData.position || ''}
                          onChange={(e) => setPortfolioData({ ...portfolioData, position: e.target.value })}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              background: 'rgba(76, 175, 80, 0.05)',
                              '&:hover': { background: 'rgba(76, 175, 80, 0.1)' },
                              '&.Mui-focused': { background: 'rgba(76, 175, 80, 0.05)' }
                            }
                          }}
                        />
                      </motion.div>

                      <motion.div
                        initial={{ x: 30, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 1.6 }}
                      >
                        <TextField
                          fullWidth
                          label="Bio"
                          multiline
                          rows={4}
                          value={portfolioData.bio || ''}
                          onChange={(e) => setPortfolioData({ ...portfolioData, bio: e.target.value })}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              background: 'rgba(76, 175, 80, 0.05)',
                              '&:hover': { background: 'rgba(76, 175, 80, 0.1)' },
                              '&.Mui-focused': { background: 'rgba(76, 175, 80, 0.05)' }
                            }
                          }}
                        />
                      </motion.div>

                      <motion.div
                        initial={{ x: 30, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 1.7 }}
                      >
                        <TextField
                          fullWidth
                          label="Theme Color"
                          type="color"
                          value={portfolioData.themeColor || '#4caf50'}
                          onChange={(e) => setPortfolioData({ ...portfolioData, themeColor: e.target.value })}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              background: 'rgba(76, 175, 80, 0.05)',
                              '&:hover': { background: 'rgba(76, 175, 80, 0.1)' },
                              '&.Mui-focused': { background: 'rgba(76, 175, 80, 0.05)' }
                            }
                          }}
                        />
                      </motion.div>
                    </Box>

                    {/* Skills Editing */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 1.8 }}
                    >
                      <Typography variant="subtitle1" sx={{ color: '#2e7d32', fontWeight: 'bold', mb: 2 }}>
                        Skills
                      </Typography>
                      <Box sx={{ pl: 2, mb: 3 }}>
                        <Autocomplete
                          multiple
                          options={skillOptions.language}
                          value={portfolioData.skills?.language || []}
                          onChange={(event, newValue) => setPortfolioData({ ...portfolioData, skills: { ...portfolioData.skills, language: newValue } })}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Language Skills"
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  background: 'rgba(76, 175, 80, 0.05)',
                                  '&:hover': { background: 'rgba(76, 175, 80, 0.1)' },
                                  '&.Mui-focused': { background: 'rgba(76, 175, 80, 0.05)' }
                                }
                              }}
                            />
                          )}
                          sx={{ mb: 2 }}
                        />
                        <Autocomplete
                          multiple
                          options={skillOptions.programming}
                          value={portfolioData.skills?.programming || []}
                          onChange={(event, newValue) => setPortfolioData({ ...portfolioData, skills: { ...portfolioData.skills, programming: newValue } })}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Programming Skills"
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  background: 'rgba(76, 175, 80, 0.05)',
                                  '&:hover': { background: 'rgba(76, 175, 80, 0.1)' },
                                  '&.Mui-focused': { background: 'rgba(76, 175, 80, 0.05)' }
                                }
                              }}
                            />
                          )}
                          sx={{ mb: 2 }}
                        />
                        <Autocomplete
                          multiple
                          options={skillOptions.other}
                          value={portfolioData.skills?.other || []}
                          onChange={(event, newValue) => setPortfolioData({ ...portfolioData, skills: { ...portfolioData.skills, other: newValue } })}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Other Skills"
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  background: 'rgba(76, 175, 80, 0.05)',
                                  '&:hover': { background: 'rgba(76, 175, 80, 0.1)' },
                                  '&.Mui-focused': { background: 'rgba(76, 175, 80, 0.05)' }
                                }
                              }}
                            />
                          )}
                        />
                      </Box>
                    </motion.div>

                    {/* Contact Editing */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 1.9 }}
                    >
                      <Typography variant="subtitle1" sx={{ color: '#2e7d32', fontWeight: 'bold', mb: 2 }}>
                        Contact Information
                      </Typography>
                      <Box sx={{ pl: 2, mb: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                          fullWidth
                          label="Phone"
                          value={portfolioData.contact?.phone || ''}
                          onChange={(e) => setPortfolioData({ ...portfolioData, contact: { ...portfolioData.contact, phone: e.target.value } })}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              background: 'rgba(76, 175, 80, 0.05)',
                              '&:hover': { background: 'rgba(76, 175, 80, 0.1)' },
                              '&.Mui-focused': { background: 'rgba(76, 175, 80, 0.05)' }
                            }
                          }}
                        />
                        <TextField
                          fullWidth
                          label="Email"
                          value={portfolioData.contact?.email || ''}
                          onChange={(e) => setPortfolioData({ ...portfolioData, contact: { ...portfolioData.contact, email: e.target.value } })}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              background: 'rgba(76, 175, 80, 0.05)',
                              '&:hover': { background: 'rgba(76, 175, 80, 0.1)' },
                              '&.Mui-focused': { background: 'rgba(76, 175, 80, 0.05)' }
                            }
                          }}
                        />
                        <TextField
                          fullWidth
                          label="LinkedIn"
                          value={portfolioData.contact?.linkedin || ''}
                          onChange={(e) => setPortfolioData({ ...portfolioData, contact: { ...portfolioData.contact, linkedin: e.target.value } })}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              background: 'rgba(76, 175, 80, 0.05)',
                              '&:hover': { background: 'rgba(76, 175, 80, 0.1)' },
                              '&.Mui-focused': { background: 'rgba(76, 175, 80, 0.05)' }
                            }
                          }}
                        />
                        <TextField
                          fullWidth
                          label="GitHub"
                          value={portfolioData.contact?.github || ''}
                          onChange={(e) => setPortfolioData({ ...portfolioData, contact: { ...portfolioData.contact, github: e.target.value } })}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              background: 'rgba(76, 175, 80, 0.05)',
                              '&:hover': { background: 'rgba(76, 175, 80, 0.1)' },
                              '&.Mui-focused': { background: 'rgba(76, 175, 80, 0.05)' }
                            }
                          }}
                        />
                      </Box>
                    </motion.div>

                    {/* Experience Editing */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 1.9 }}
                    >
                      <Typography variant="subtitle1" sx={{ color: '#2e7d32', fontWeight: 'bold', mb: 2 }}>
                        Experience
                      </Typography>
                      {portfolioData.experience.map((exp, idx) => (
                        <Box key={idx} sx={{ mb: 2, p: 2, background: 'rgba(76, 175, 80, 0.05)', borderRadius: 1, border: '1px solid rgba(76, 175, 80, 0.1)' }}>
                          <TextField
                            label="Job Title"
                            value={exp.title}
                            onChange={(e) => updateExperience(idx, 'title', e.target.value)}
                            sx={{ mr: 1, mb: 1, width: '48%' }}
                          />
                          <TextField
                            label="Company"
                            value={exp.company}
                            onChange={(e) => updateExperience(idx, 'company', e.target.value)}
                            sx={{ mr: 1, mb: 1, width: '48%' }}
                          />
                          <TextField
                            label="Duration"
                            value={exp.duration}
                            onChange={(e) => updateExperience(idx, 'duration', e.target.value)}
                            sx={{ mr: 1, mb: 1, width: '48%' }}
                          />
                          <TextField
                            label="Description"
                            multiline
                            rows={2}
                            value={exp.description}
                            onChange={(e) => updateExperience(idx, 'description', e.target.value)}
                            sx={{ width: '100%' }}
                          />
                        </Box>
                      ))}
                      <Button
                        variant="outlined"
                        onClick={addExperience}
                        sx={{ mb: 3, color: '#4caf50', borderColor: '#4caf50', '&:hover': { borderColor: '#388e3c', color: '#388e3c' } }}
                      >
                        Add Experience
                      </Button>
                    </motion.div>

                    {/* Education Editing */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 2.0 }}
                    >
                      <Typography variant="subtitle1" sx={{ color: '#2e7d32', fontWeight: 'bold', mb: 2 }}>
                        Education
                      </Typography>
                      {portfolioData.education.map((edu, idx) => (
                        <Box key={idx} sx={{ mb: 2, p: 2, background: 'rgba(76, 175, 80, 0.05)', borderRadius: 1, border: '1px solid rgba(76, 175, 80, 0.1)' }}>
                          <FormControl fullWidth margin="normal">
                            <InputLabel>Education Level</InputLabel>
                            <Select
                              value={edu.level}
                              onChange={(e) => updateEducation(idx, 'level', e.target.value)}
                              sx={{ mb: 1 }}
                            >
                              {educationLevels.map((level) => (
                                <MenuItem key={level} value={level}>
                                  {level}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                          <TextField
                            label="Program"
                            value={edu.degree}
                            onChange={(e) => updateEducation(idx, 'degree', e.target.value)}
                            sx={{ mr: 1, mb: 1, width: '48%' }}
                          />
                          <TextField
                            label="Institution"
                            value={edu.institution}
                            onChange={(e) => updateEducation(idx, 'institution', e.target.value)}
                            sx={{ mr: 1, mb: 1, width: '48%' }}
                          />
                          <TextField
                            label="Start Date"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            value={edu.startDate}
                            onChange={(e) => updateEducation(idx, 'startDate', e.target.value)}
                            sx={{ mr: 1, mb: 1, width: '48%' }}
                          />
                          <TextField
                            label="End Date"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            value={edu.endDate}
                            onChange={(e) => updateEducation(idx, 'endDate', e.target.value)}
                            sx={{ width: '48%' }}
                          />
                        </Box>
                      ))}
                      <Button
                        variant="outlined"
                        onClick={addEducation}
                        sx={{ mb: 3, color: '#4caf50', borderColor: '#4caf50', '&:hover': { borderColor: '#388e3c', color: '#388e3c' } }}
                      >
                        Add Education
                      </Button>
                    </motion.div>

                    <motion.div
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.6, delay: 1.8 }}
                    >
                      <Box sx={{ textAlign: 'center' }}>
                        <Button
                          variant="contained"
                          size="large"
                          onClick={updateProfile}
                          sx={{
                            background: 'linear-gradient(45deg, #4caf50, #66bb6a)',
                            color: 'white',
                            fontWeight: 'bold',
                            px: 6,
                            py: 1.5,
                            borderRadius: 3,
                            '&:hover': {
                              background: 'linear-gradient(45deg, #388e3c, #4caf50)',
                              transform: 'translateY(-2px)',
                              boxShadow: '0 10px 25px rgba(76, 175, 80, 0.3)'
                            },
                            transition: 'all 0.3s ease'
                          }}
                        >
                          Update Profile
                        </Button>
                      </Box>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            </Container>
          </Box>
        );
      case 'new-portfolio':
        return (
          <Container maxWidth="lg" sx={{ py: 4 }}>
            <Card sx={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(15px)',
              borderRadius: 4,
              boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
              border: '1px solid rgba(255,255,255,0.2)',
              overflow: 'hidden'
            }}>
              <CardContent>
                <Typography variant="h5" component="div" className="mb-4">
                  Create Your Portfolio
                </Typography>
                <Typography variant="body2" className="mb-4">
                  Fill in your details to create a professional portfolio.
                </Typography>
                <form onSubmit={(e) => { e.preventDefault(); updateProfile(); }}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Name"
                    value={portfolioData.name}
                    onChange={(e) => setPortfolioData({ ...portfolioData, name: e.target.value })}
                    sx={{ '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#4caf50' } }}
                  />
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Position"
                    value={portfolioData.position}
                    onChange={(e) => setPortfolioData({ ...portfolioData, position: e.target.value })}
                    sx={{ '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#4caf50' } }}
                  />
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Bio"
                    multiline
                    rows={4}
                    value={portfolioData.bio}
                    onChange={(e) => setPortfolioData({ ...portfolioData, bio: e.target.value })}
                    sx={{ '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#4caf50' } }}
                  />
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Theme Color"
                    type="color"
                    value={portfolioData.themeColor}
                    onChange={(e) => setPortfolioData({ ...portfolioData, themeColor: e.target.value })}
                    sx={{ '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#4caf50' } }}
                  />
                  <Typography variant="h6" className="mt-4">Headshot (Optional)</Typography>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setPortfolioData({ ...portfolioData, profilePicture: e.target.files[0] })}
                    className="mb-4"
                  />
                  <Typography variant="h6" className="mt-4">Skills</Typography>
                  <Autocomplete
                    multiple
                    options={skillOptions.language}
                    value={portfolioData.skills.language}
                    onChange={(event, newValue) => setPortfolioData({ ...portfolioData, skills: { ...portfolioData.skills, language: newValue } })}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Language Skills"
                        sx={{ '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#4caf50' } }}
                      />
                    )}
                    sx={{ mb: 2 }}
                  />
                  <Autocomplete
                    multiple
                    options={skillOptions.programming}
                    value={portfolioData.skills.programming}
                    onChange={(event, newValue) => setPortfolioData({ ...portfolioData, skills: { ...portfolioData.skills, programming: newValue } })}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Programming Skills"
                        sx={{ '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#4caf50' } }}
                      />
                    )}
                    sx={{ mb: 2 }}
                  />
                  <Autocomplete
                    multiple
                    options={skillOptions.other}
                    value={portfolioData.skills.other}
                    onChange={(event, newValue) => setPortfolioData({ ...portfolioData, skills: { ...portfolioData.skills, other: newValue } })}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Other Skills"
                        sx={{ '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#4caf50' } }}
                      />
                    )}
                    sx={{ mb: 2 }}
                  />
                  <Typography variant="h6" className="mt-4">Education</Typography>
                  {portfolioData.education.map((edu, index) => (
                    <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
                      <Typography variant="subtitle1">Education {index + 1}</Typography>
                      <FormControl fullWidth margin="normal">
                        <InputLabel>Education Level</InputLabel>
                        <Select
                          value={edu.level}
                          onChange={(e) => updateEducation(index, 'level', e.target.value)}
                          displayEmpty
                          sx={{ '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#4caf50' } }}
                        >
                          <MenuItem value="" disabled>
                            <em>Select Education Level</em>
                          </MenuItem>
                          {educationLevels.map((level) => (
                            <MenuItem key={level} value={level}>
                              {level}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <TextField
                        fullWidth
                        margin="normal"
                        label="Program"
                        value={edu.degree}
                        onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                        sx={{ '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#4caf50' } }}
                      />
                      <TextField
                        fullWidth
                        margin="normal"
                        label="Institution"
                        value={edu.institution}
                        onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                        sx={{ '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#4caf50' } }}
                      />
                      <TextField
                        fullWidth
                        margin="normal"
                        label="Start Date"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={edu.startDate}
                        onChange={(e) => updateEducation(index, 'startDate', e.target.value)}
                        sx={{ '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#4caf50' } }}
                      />
                      <FormControl fullWidth margin="normal">
                        <InputLabel>End Date Type</InputLabel>
                        <Select
                          value={edu.endDate === 'Present' ? 'present' : 'date'}
                          onChange={(e) => updateEducation(index, 'endDate', e.target.value === 'present' ? 'Present' : '')}
                          sx={{ '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#4caf50' } }}
                        >
                          <MenuItem value="present">Present</MenuItem>
                          <MenuItem value="date">Select Date</MenuItem>
                        </Select>
                      </FormControl>
                      {edu.endDate !== 'Present' && (
                        <TextField
                          fullWidth
                          margin="normal"
                          label="End Date"
                          type="date"
                          InputLabelProps={{ shrink: true }}
                          value={edu.endDate}
                          onChange={(e) => updateEducation(index, 'endDate', e.target.value)}
                          sx={{ '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#4caf50' } }}
                        />
                      )}
                    </Box>
                  ))}
                  <Button
                    variant="outlined"
                    sx={{ mt: 2, color: '#4caf50', borderColor: '#4caf50', '&:hover': { borderColor: '#388e3c', color: '#388e3c' } }}
                    onClick={addEducation}
                  >
                    Add Another Education
                  </Button>
                  <Typography variant="h6" className="mt-4">Experience (Optional)</Typography>
                  {portfolioData.experience.map((exp, index) => (
                    <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
                      <Typography variant="subtitle1">Experience {index + 1}</Typography>
                      <TextField
                        fullWidth
                        margin="normal"
                        label="Job Title"
                        value={exp.title}
                        onChange={(e) => updateExperience(index, 'title', e.target.value)}
                        sx={{ '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#4caf50' } }}
                      />
                      <TextField
                        fullWidth
                        margin="normal"
                        label="Company"
                        value={exp.company}
                        onChange={(e) => updateExperience(index, 'company', e.target.value)}
                        sx={{ '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#4caf50' } }}
                      />
                      <TextField
                        fullWidth
                        margin="normal"
                        label="Duration"
                        value={exp.duration}
                        onChange={(e) => updateExperience(index, 'duration', e.target.value)}
                        sx={{ '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#4caf50' } }}
                      />
                      <TextField
                        fullWidth
                        margin="normal"
                        label="Description"
                        multiline
                        rows={3}
                        value={exp.description}
                        onChange={(e) => updateExperience(index, 'description', e.target.value)}
                        sx={{ '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#4caf50' } }}
                      />
                    </Box>
                  ))}
                  <Button
                    variant="outlined"
                    sx={{ mt: 2, color: '#4caf50', borderColor: '#4caf50', '&:hover': { borderColor: '#388e3c', color: '#388e3c' } }}
                    onClick={addExperience}
                  >
                    Add Another Experience
                  </Button>
                  <Typography variant="h6" className="mt-4">Contact</Typography>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Phone"
                    value={portfolioData.contact.phone}
                    onChange={(e) => setPortfolioData({ ...portfolioData, contact: { ...portfolioData.contact, phone: e.target.value } })}
                    sx={{ '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#4caf50' } }}
                  />
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Email"
                    value={portfolioData.contact.email}
                    onChange={(e) => setPortfolioData({ ...portfolioData, contact: { ...portfolioData.contact, email: e.target.value } })}
                    sx={{ '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#4caf50' } }}
                  />
                  <TextField
                    fullWidth
                    margin="normal"
                    label="LinkedIn"
                    value={portfolioData.contact.linkedin}
                    onChange={(e) => setPortfolioData({ ...portfolioData, contact: { ...portfolioData.contact, linkedin: e.target.value } })}
                    sx={{ '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#4caf50' } }}
                  />
                  <TextField
                    fullWidth
                    margin="normal"
                    label="GitHub"
                    value={portfolioData.contact.github}
                    onChange={(e) => setPortfolioData({ ...portfolioData, contact: { ...portfolioData.contact, github: e.target.value } })}
                    sx={{ '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#4caf50' } }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{ backgroundColor: '#4caf50', '&:hover': { backgroundColor: '#388e3c' }, mt: 3 }}
                  >
                    Create Portfolio
                  </Button>
                </form>
              </CardContent>
            </Card>
          </Container>
        );
      default:
        return null;
    }
  };

  const navigationItems = [
    { text: 'Profile', icon: <AccountCircle />, key: 'profile' },
    { text: 'New Portfolio', icon: <Web />, key: 'new-portfolio' },
  ];

  const pageNavigationItems = [
    { text: 'View Portfolio', icon: <Web />, path: '/' },
  ];

  return (
    <div>
      <Fab
        aria-label="menu"
        sx={{
          position: 'fixed',
          top: 16,
          left: 16,
          zIndex: 1000,
          backgroundColor: 'transparent',
          color: '#000000',
          boxShadow: 'none',
          '&:hover': {
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
            boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)',
          },
        }}
        onClick={() => setDrawerOpen(true)}
      >
        <MenuIcon />
      </Fab>
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: 280,
            background: 'linear-gradient(180deg, #ffffff 0%, #f5f5f5 100%)',
            borderRight: '1px solid #e0e0e0',
            boxShadow: '4px 0 20px rgba(0,0,0,0.1)',
          },
        }}
      >
        <Box sx={{ padding: 2, borderBottom: '1px solid #e0e0e0', background: 'linear-gradient(135deg, #4caf50, #81c784)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', color: 'white' }}>
            <WorkIcon sx={{ fontSize: 32, mr: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              MyPortfolio
            </Typography>
          </Box>
        </Box>
        <Box sx={{ flexGrow: 1, paddingTop: 1 }}>
          <List>
            {navigationItems.map((item) => (
              <ListItem
                button
                key={item.key}
                onClick={() => { setSelectedSection(item.key); setDrawerOpen(false); }}
                sx={{
                  margin: '4px 8px',
                  borderRadius: 2,
                  transition: 'all 0.3s',
                  '&:hover': {
                    background: '#4caf50',
                    color: 'white',
                    transform: 'translateX(5px)',
                    boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)',
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'inherit' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} sx={{ '& .MuiTypography-root': { fontWeight: 500 } }} />
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            {pageNavigationItems.map((item) => (
              <ListItem
                button
                key={item.path}
                onClick={() => { window.location.href = item.path; setDrawerOpen(false); }}
                sx={{
                  margin: '4px 8px',
                  borderRadius: 2,
                  transition: 'all 0.3s',
                  '&:hover': {
                    background: '#4caf50',
                    color: 'white',
                    transform: 'translateX(5px)',
                    boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)',
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'inherit' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} sx={{ '& .MuiTypography-root': { fontWeight: 500 } }} />
              </ListItem>
            ))}
          </List>
        </Box>
        <Box sx={{ borderTop: '1px solid #e0e0e0' }}>
          <List>
            <ListItem
              button
              onClick={() => { onLogout(); setDrawerOpen(false); }}
              sx={{
                margin: '4px 8px',
                borderRadius: 2,
                transition: 'all 0.3s',
                '&:hover': {
                  background: '#f44336',
                  color: 'white',
                  transform: 'translateX(5px)',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'inherit' }}>
                <AccountCircle />
              </ListItemIcon>
              <ListItemText primary="Logout" sx={{ '& .MuiTypography-root': { fontWeight: 500 } }} />
            </ListItem>
          </List>
        </Box>
      </Drawer>
         {/* Animated background elements */}
         {[...Array(15)].map((_, i) => (
           <motion.div
             key={i}
             style={{
               position: 'absolute',
               width: `${Math.random() * 60 + 20}px`,
               height: `${Math.random() * 60 + 20}px`,
               background: 'rgba(255, 255, 255, 0.4)',
               borderRadius: '50%',
               top: `${Math.random() * 100}%`,
               left: `${Math.random() * 100}%`,
             }}
             animate={{
               y: [0, -40, 0],
               x: [0, Math.random() * 10 - 5, 0],
               scale: [0.8, 1.2, 0.8],
               opacity: [0.4, 0.7, 0.4],
             }}
             transition={{
               duration: 5 + Math.random() * 3,
               repeat: Infinity,
               ease: 'easeInOut',
               delay: Math.random() * 2,
             }}
           />
         ))}
      <Box sx={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)', minHeight: '100vh', padding: 3, position: 'relative', overflow: 'hidden' }}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          {renderContent()}
        </Container>
      </Box>
    </div>
  );
}

export default Dashboard;