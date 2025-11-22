import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Chip, Card, CardContent, Link, Drawer, List, ListItem, ListItemIcon, ListItemText, Fab } from '@mui/material';
import { motion } from 'framer-motion';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import Web from '@mui/icons-material/Web';
import AccountCircle from '@mui/icons-material/AccountCircle';
import WorkIcon from '@mui/icons-material/Work';
import DownloadIcon from '@mui/icons-material/Download';

function Portfolio({ token, onLogout }) {
  const [profile, setProfile] = useState({});
  const [drawerOpen, setDrawerOpen] = useState(false);
  const themeColor = profile.themeColor || '#4caf50';

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setProfile(data?.profile || {});
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    if (token) fetchProfile();
  }, [token]);

  const navigationItems = [
    { text: 'Portfolio', icon: <Web />, path: '/' },
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
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
      <Fab
        aria-label="download"
        sx={{
          position: 'fixed',
          top: 16,
          right: 16,
          zIndex: 1000,
          backgroundColor: themeColor,
          color: 'white',
          '&:hover': {
            backgroundColor: `${themeColor}cc`,
          },
        }}
        onClick={async () => {
          try {
            const response = await fetch('http://localhost:5000/portfolios/generate', {
              method: 'POST',
              headers: { Authorization: `Bearer ${token}` },
            });
            if (response.ok) {
              const data = await response.json();
              const link = document.createElement('a');
              link.href = data.url;
              link.download = `${profile.name || 'Portfolio'}.pdf`;
              link.click();
            } else {
              alert('Failed to generate PDF');
            }
          } catch (error) {
            alert('Error generating PDF');
          }
        }}
      >
        <DownloadIcon />
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
        <Box sx={{ padding: 2, borderBottom: '1px solid #e0e0e0', background: `linear-gradient(135deg, ${themeColor}, ${themeColor}aa)` }}>
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
                key={item.path}
                onClick={() => { window.location.href = item.path; setDrawerOpen(false); }}
                sx={{
                  margin: '4px 8px',
                  borderRadius: 2,
                  transition: 'all 0.3s',
                  '&:hover': {
                    background: themeColor,
                    color: 'white',
                    transform: 'translateX(5px)',
                    boxShadow: `0 4px 12px ${themeColor}4d`,
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
    <div>
      <Box sx={{
        background: `linear-gradient(135deg, ${themeColor}, ${themeColor}aa)`,
        color: 'white',
        padding: '60px 20px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(255,255,255,0.1)',
          animation: 'pulse 4s ease-in-out infinite',
        }
      }}>
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              bottom: 0,
              left: `${Math.random() * 100}%`,
              width: `${20 + Math.random() * 30}px`,
              height: `${20 + Math.random() * 30}px`,
              background: `rgba(255,255,255,0.1)`,
              borderRadius: '50%',
              zIndex: 0,
            }}
            animate={{ y: [-100, -window.innerHeight] }}
            transition={{
              duration: 10 + Math.random() * 10,
              ease: 'easeOut',
              repeat: Infinity,
              delay: Math.random() * 10,
            }}
          />
        ))}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, position: 'relative', zIndex: 1, mb: 2 }}>
          {profile.profilePicture && (
            <img src={`/${profile.profilePicture}`} alt="Profile" style={{ width: 150, height: 150, borderRadius: '50%', border: '5px solid white' }} />
          )}
          <Typography variant="h1" component="h1" sx={{
            fontWeight: 300,
            fontSize: '3em',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            animation: 'fadeInUp 1s ease-out'
          }}>
            {profile.name || 'Your Name'}
          </Typography>
        </Box>
        {profile.position && (
          <Typography variant="h4" sx={{
            position: 'relative',
            zIndex: 1,
            animation: 'fadeInUp 1.1s ease-out',
            textAlign: 'center',
            fontStyle: 'italic'
          }}>
            {profile.position}
          </Typography>
        )}
        <Box sx={{ mx: 'auto', position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.5 }}
            viewport={{ once: true }}
          >
            <Typography variant="h5" sx={{
              marginTop: 2,
              textAlign: 'justify'
            }}>
              {profile.bio || 'Your professional bio goes here'}
            </Typography>
          </motion.div>
        </Box>
      </Box>
      <Container maxWidth="lg" sx={{ padding: '40px 20px' }}>
        {profile.skills && (profile.skills.language?.length > 0 || profile.skills.programming?.length > 0 || profile.skills.other?.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Box sx={{ marginBottom: 6, background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)', padding: 4, borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.1)', border: '1px solid #dee2e6' }}>
              <Typography variant="h4" sx={{ color: themeColor, textAlign: 'center', marginBottom: 3, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 }}>
                Skills & Expertise
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {profile.skills.language?.length > 0 && (
                  <Box sx={{ background: 'white', p: 3, borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderLeft: `4px solid ${themeColor}` }}>
                    <Typography variant="h6" sx={{ color: themeColor, fontWeight: 'bold', mb: 2, textAlign: 'center' }}>Language Skills</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, justifyContent: 'center' }}>
                      {profile.skills.language.map((skill, index) => (
                        <motion.div
                          key={`lang-${index}`}
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                          viewport={{ once: true }}
                        >
                          <Chip label={skill} sx={{ background: `linear-gradient(45deg, ${themeColor}, ${themeColor}dd)`, color: 'white', fontWeight: 'medium', fontSize: '0.9rem', padding: '8px 12px', transition: 'all 0.3s', '&:hover': { background: `linear-gradient(45deg, ${themeColor}cc, ${themeColor}aa)`, transform: 'scale(1.1)', boxShadow: '0 4px 8px rgba(0,0,0,0.2)' } }} />
                        </motion.div>
                      ))}
                    </Box>
                  </Box>
                )}
                {profile.skills.programming?.length > 0 && (
                  <Box sx={{ background: 'white', p: 3, borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderLeft: `4px solid #27ae60` }}>
                    <Typography variant="h6" sx={{ color: '#27ae60', fontWeight: 'bold', mb: 2, textAlign: 'center' }}>Programming Skills</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, justifyContent: 'center' }}>
                      {profile.skills.programming.map((skill, index) => (
                        <motion.div
                          key={`prog-${index}`}
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                          viewport={{ once: true }}
                        >
                          <Chip label={skill} sx={{ background: 'linear-gradient(45deg, #27ae60, #2ecc71)', color: 'white', fontWeight: 'medium', fontSize: '0.9rem', padding: '8px 12px', transition: 'all 0.3s', '&:hover': { background: 'linear-gradient(45deg, #229954, #27ae60)', transform: 'scale(1.1)', boxShadow: '0 4px 8px rgba(0,0,0,0.2)' } }} />
                        </motion.div>
                      ))}
                    </Box>
                  </Box>
                )}
                {profile.skills.other?.length > 0 && (
                  <Box sx={{ background: 'white', p: 3, borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderLeft: `4px solid #e67e22` }}>
                    <Typography variant="h6" sx={{ color: '#e67e22', fontWeight: 'bold', mb: 2, textAlign: 'center' }}>Other Skills</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, justifyContent: 'center' }}>
                      {profile.skills.other.map((skill, index) => (
                        <motion.div
                          key={`other-${index}`}
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                          viewport={{ once: true }}
                        >
                          <Chip label={skill} sx={{ background: 'linear-gradient(45deg, #e67e22, #f39c12)', color: 'white', fontWeight: 'medium', fontSize: '0.9rem', padding: '8px 12px', transition: 'all 0.3s', '&:hover': { background: 'linear-gradient(45deg, #d35400, #e67e22)', transform: 'scale(1.1)', boxShadow: '0 4px 8px rgba(0,0,0,0.2)' } }} />
                        </motion.div>
                      ))}
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>
          </motion.div>
        )}

        {profile.experience && profile.experience.length > 0 && (
          <Box sx={{ marginBottom: 6, background: '#f9f9f9', padding: 3, borderRadius: 2, boxShadow: 1 }}>
            <Typography variant="h4" sx={{ color: themeColor, borderBottom: '3px solid #ffeb3b', paddingBottom: 1, marginBottom: 2 }}>
              Experience
            </Typography>
            {profile.experience.map((exp, index) => (
              <Card key={index} sx={{ marginBottom: 2, borderLeft: '5px solid #ff9800' }}>
                <CardContent>
                  <Typography variant="h5">{exp.title} at {exp.company}</Typography>
                  <Typography variant="body2" color="text.secondary">Duration: {exp.duration}</Typography>
                  <Typography>{exp.description}</Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}

        {profile.education && profile.education.length > 0 && (
          <Box sx={{ marginBottom: 6, background: '#f9f9f9', padding: 3, borderRadius: 2, boxShadow: 1 }}>
            <Typography variant="h4" sx={{ color: themeColor, borderBottom: '3px solid #ffeb3b', paddingBottom: 1, marginBottom: 2 }}>
              Education
            </Typography>
            {profile.education.map((edu, index) => (
              <Card key={index} sx={{ marginBottom: 2, borderLeft: '5px solid #ff9800' }}>
                <CardContent>
                  <Typography variant="h5">{edu.level} in {edu.degree}</Typography>
                  <Typography>{edu.institution}</Typography>
                  <Typography>{edu.startDate} - {edu.endDate}</Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}

        {profile.projects && profile.projects.length > 0 && (
          <Box sx={{ marginBottom: 6, background: '#f9f9f9', padding: 3, borderRadius: 2, boxShadow: 1 }}>
            <Typography variant="h4" sx={{ color: '#4caf50', borderBottom: '3px solid #ffeb3b', paddingBottom: 1, marginBottom: 2 }}>
              Projects
            </Typography>
            {profile.projects.map((proj, index) => (
              <Card key={index} sx={{ marginBottom: 2, borderLeft: '5px solid #ff9800' }}>
                <CardContent>
                  <Typography variant="h5">
                    <Link href={proj.link} target="_blank" sx={{ color: themeColor }}>{proj.title}</Link>
                  </Typography>
                  <Typography>{proj.description}</Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}

        {profile.contact && (
          <Box sx={{ marginBottom: 6, background: '#f9f9f9', padding: 3, borderRadius: 2, boxShadow: 1 }}>
            <Typography variant="h4" sx={{ color: themeColor, borderBottom: '3px solid #ffeb3b', paddingBottom: 1, marginBottom: 2 }}>
              Contact
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
              {profile.contact.phone && (
                <Box sx={{ textAlign: 'center', padding: 2, background: '#f9f9f9', borderRadius: 1 }}>
                  <Typography variant="h6">Phone</Typography>
                  <Typography>{profile.contact.phone}</Typography>
                </Box>
              )}
              {profile.contact.linkedin && (
                <Box sx={{ textAlign: 'center', padding: 2, background: '#f9f9f9', borderRadius: 1 }}>
                  <Typography variant="h6">LinkedIn</Typography>
                  <Link href={profile.contact.linkedin} target="_blank" sx={{ color: themeColor }}>{profile.contact.linkedin}</Link>
                </Box>
              )}
              {profile.contact.github && (
                <Box sx={{ textAlign: 'center', padding: 2, background: '#f9f9f9', borderRadius: 1 }}>
                  <Typography variant="h6">GitHub</Typography>
                  <Link href={profile.contact.github} target="_blank" sx={{ color: themeColor }}>{profile.contact.github}</Link>
                </Box>
              )}
            </Box>
          </Box>
        )}
      </Container>
      <Box sx={{ background: '#000000', color: 'white', textAlign: 'center', padding: 2 }}>
        <Typography>&copy; 2024 MyPortfolio. Built with passion.</Typography>
      </Box>
    </div>
    </div>
  );
}

export default Portfolio;