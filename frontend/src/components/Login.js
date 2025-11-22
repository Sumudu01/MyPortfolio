import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Container, Box, Link, Card, CardContent } from '@mui/material';
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
      const response = await fetch('http://localhost:5000/api/auth/login', {
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
    <Container component="main" maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#ffffff' }}>
      <Card className="shadow-lg" sx={{ maxWidth: 400, width: '100%', background: '#f9f9f9' }}>
        <CardContent sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <WorkIcon sx={{ fontSize: 48, mr: 2 }} />
          <Typography component="h1" variant="h4">
            MyPortfolio
          </Typography>
        </Box>
        <Typography component="h1" variant="h5" className="mb-4">
          Sign In
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
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
              '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#4caf50' },
              '& .MuiInputLabel-root.Mui-focused': { color: '#4caf50' }
            }}
          />
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
              '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#4caf50' },
              '& .MuiInputLabel-root.Mui-focused': { color: '#4caf50' }
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, backgroundColor: '#4caf50', '&:hover': { backgroundColor: '#388e3c' } }}
          >
            Sign In
          </Button>
          <Button
            fullWidth
            variant="outlined"
            sx={{ mb: 2, borderColor: '#4caf50', color: '#4caf50', '&:hover': { borderColor: '#388e3c', backgroundColor: 'rgba(76, 175, 80, 0.1)' } }}
            onClick={() => window.location.href = 'http://localhost:5000/api/auth/google'}
          >
            Sign In with Google
          </Button>
          <Box className="text-center">
            <Link href="#" variant="body2" onClick={onSwitchToRegister} sx={{ color: '#4caf50', '&:hover': { color: '#388e3c' } }}>
              {"Don't have an account? Sign Up"}
            </Link>
          </Box>
        </Box>
        </CardContent>
      </Card>
    </Container>
  );
}

export default Login;