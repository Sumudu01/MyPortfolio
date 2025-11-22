import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Portfolio from './components/Portfolio';
import './App.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (newToken) => {
    console.log('handleLogin called with token');
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setIsAuthenticated(true);
    console.log('isAuthenticated set to true');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setIsAuthenticated(false);
  };

  const handleRegister = () => {
    // After registration, perhaps redirect to login or auto-login
    // For now, just alert or handle as needed
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={isAuthenticated ? <Portfolio token={token} onLogout={handleLogout} /> : <Navigate to="/login" />} />
          <Route path="/login" element={<Login onLogin={handleLogin} onSwitchToRegister={() => window.location.href = '/register'} />} />
          <Route path="/register" element={<Register onRegister={handleRegister} />} />
          <Route path="/dashboard" element={isAuthenticated ? <Dashboard token={token} onLogout={handleLogout} /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
