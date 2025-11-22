import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  AppBar,
  Toolbar,
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
import Description from '@mui/icons-material/Description';
import Web from '@mui/icons-material/Web';
import DashboardIcon from '@mui/icons-material/Dashboard';
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
  const [cvFile, setCvFile] = useState(null);
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
    const response = await fetch('http://localhost:5000/api/users/profile', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.ok) {
      const data = await response.json();
      setProfile(data?.profile || {});
      setUser({ username: data.username, email: data.email, password: '' });
    }
  }, [token]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

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
        contact: (portfolioData.contact.phone.trim() || portfolioData.contact.email.trim() || portfolioData.contact.linkedin.trim() || portfolioData.contact.github.trim()) ? portfolioData.contact : null
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
      const response = await fetch('http://localhost:5000/api/users/profile', {
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

  const handleCvUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('cv', cvFile);
    const response = await fetch('http://localhost:5000/api/users/upload-cv', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    if (response.ok) {
      alert('CV uploaded and parsed');
      fetchProfile();
    }
  };

  const generatePortfolio = async () => {
    const response = await fetch('http://localhost:5000/api/portfolios/generate', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.ok) {
      const data = await response.json();
      alert(`Portfolio generated: http://localhost:5000${data.url}`);
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
          <Container maxWidth="lg" className="py-8">
            <Card className="shadow-lg" sx={{ background: '#f9f9f9' }}>
              <CardContent>
                <Typography variant="h5" component="div" className="mb-4">
                  User Information
                </Typography>
                <TextField
                  fullWidth
                  margin="normal"
                  name="username"
                  label="Username"
                  value={user.username}
                  onChange={handleUserChange}
                  sx={{ '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#4caf50' } }}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  name="email"
                  label="Email"
                  value={user.email}
                  onChange={handleUserChange}
                  sx={{ '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#4caf50' } }}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  name="password"
                  label="New Password (leave empty to keep current)"
                  type="password"
                  value={user.password}
                  onChange={handleUserChange}
                  sx={{ '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#4caf50' } }}
                />
                <Typography variant="h5" component="div" className="mb-4 mt-6">
                  Profile Information
                </Typography>
                <TextField
                  fullWidth
                  margin="normal"
                  name="name"
                  label="Name"
                  value={profile.name || ''}
                  onChange={handleProfileChange}
                  sx={{ '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#4caf50' } }}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  name="bio"
                  label="Bio"
                  multiline
                  rows={4}
                  value={profile.bio || ''}
                  onChange={handleProfileChange}
                  sx={{ '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#4caf50' } }}
                />
                <Button
                  variant="contained"
                  sx={{ backgroundColor: '#4caf50', '&:hover': { backgroundColor: '#388e3c' }, mt: 3 }}
                  onClick={updateProfile}
                >
                  Update Profile
                </Button>
              </CardContent>
            </Card>
          </Container>
        );
      case 'new-portfolio':
        return (
          <Container maxWidth="lg" className="py-8">
            <Card className="shadow-lg" sx={{ background: '#f9f9f9' }}>
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
      <Box sx={{ background: 'linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%)', minHeight: '100vh', padding: 3 }}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          {renderContent()}
        </Container>
      </Box>
    </div>
  );
}

export default Dashboard;