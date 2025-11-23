import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Container, Box, Link, Card, CardContent } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import WorkIcon from '@mui/icons-material/Work';

function Login({ onLogin, onSwitchToRegister }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
      onLogin(token);
      navigate('/dashboard');
    }
  }, [onLogin, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Sending login request:', form);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      console.log('Response status:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('Login successful:', data);
        onLogin(data.token);
        navigate('/dashboard');
      } else {
        const errorData = await response.json();
        console.log('Login failed:', errorData);
        alert('Login failed: ' + errorData.error);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      alert('Network error');
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #4caf50 0%, #81c784 50%, #a5d6a7 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated background elements */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            width: `${Math.random() * 100 + 50}px`,
            height: `${Math.random() * 100 + 50}px`,
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 4 + Math.random() * 4,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: Math.random() * 2,
          }}
        />
      ))}

      <Container component="main" maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <Card sx={{
            maxWidth: 450,
            width: '100%',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: 4,
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <CardContent sx={{ p: 5, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <WorkIcon sx={{ fontSize: 56, mr: 2, color: '#4caf50' }} />
                  <Typography component="h1" variant="h4" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
                    MyPortfolio
                  </Typography>
                </Box>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Typography component="h1" variant="h5" sx={{ mb: 3, color: '#424242', fontWeight: 500 }}>
                  Welcome Back
                </Typography>
              </motion.div>

              <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
                <motion.div
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    value={form.email}
                    onChange={handleChange}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': { borderColor: '#4caf50' },
                        '&.Mui-focused fieldset': { borderColor: '#4caf50' }
                      },
                      '& .MuiInputLabel-root.Mui-focused': { color: '#4caf50' }
                    }}
                  />
                </motion.div>

                <motion.div
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    value={form.password}
                    onChange={handleChange}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': { borderColor: '#4caf50' },
                        '&.Mui-focused fieldset': { borderColor: '#4caf50' }
                      },
                      '& .MuiInputLabel-root.Mui-focused': { color: '#4caf50' }
                    }}
                  />
                </motion.div>

                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 1.0 }}
                >
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{
                      mt: 3,
                      mb: 2,
                      background: 'linear-gradient(45deg, #4caf50, #66bb6a)',
                      color: 'white',
                      fontWeight: 'bold',
                      py: 1.5,
                      '&:hover': {
                        background: 'linear-gradient(45deg, #388e3c, #4caf50)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(76, 175, 80, 0.3)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Sign In
                  </Button>
                </motion.div>

                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                >
                  <Button
                    fullWidth
                    variant="outlined"
                    sx={{
                      mb: 3,
                      borderColor: '#4caf50',
                      color: '#4caf50',
                      py: 1.5,
                      '&:hover': {
                        borderColor: '#388e3c',
                        backgroundColor: 'rgba(76, 175, 80, 0.1)',
                        transform: 'translateY(-1px)',
                        boxShadow: '0 4px 15px rgba(76, 175, 80, 0.2)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                    onClick={() => window.location.href = 'http://localhost:5000/api/auth/google'}
                  >
                    Sign In with Google
                  </Button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 1.4 }}
                >
                  <Box sx={{ textAlign: 'center' }}>
                    <Link href="#" variant="body2" onClick={onSwitchToRegister} sx={{
                      color: '#4caf50',
                      textDecoration: 'none',
                      fontWeight: 500,
                      '&:hover': {
                        color: '#388e3c',
                        textDecoration: 'underline'
                      }
                    }}>
                      {"Don't have an account? Sign Up"}
                    </Link>
                  </Box>
                </motion.div>
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      </Container>
    </Box>
  );
}

export default Login;