import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Box, Link, Card, CardContent } from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';

function Register({ onRegister }) {
  const [form, setForm] = useState({ username: '', email: '', password: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (response.ok) {
      alert('Registered successfully');
      onRegister();
      window.location.href = '/login';
    } else {
      alert('Registration failed');
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
          Sign Up
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={form.username}
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
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
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
            autoComplete="new-password"
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
            Sign Up
          </Button>
          <Box className="text-center">
            <Link href="/login" variant="body2" sx={{ color: '#4caf50', '&:hover': { color: '#388e3c' } }}>
              {"Already have an account? Sign In"}
            </Link>
          </Box>
        </Box>
        </CardContent>
      </Card>
    </Container>
  );
}

export default Register;