import React, { useState, useEffect } from 'react';

function Dashboard({ token, onLogout }) {
  const [profile, setProfile] = useState({});
  const [cvFile, setCvFile] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const response = await fetch('http://localhost:5000/api/users/profile', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.ok) {
      const data = await response.json();
      setProfile(data.profile || {});
    }
  };

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const updateProfile = async () => {
    const response = await fetch('http://localhost:5000/api/users/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profile),
    });
    if (response.ok) {
      alert('Profile updated');
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

  return (
    <div>
      <h2>Dashboard</h2>
      <button onClick={onLogout}>Logout</button>
      
      <h3>Profile</h3>
      <input name="name" placeholder="Name" value={profile.name || ''} onChange={handleProfileChange} />
      <textarea name="bio" placeholder="Bio" value={profile.bio || ''} onChange={handleProfileChange} />
      <input name="skills" placeholder="Skills (comma separated)" value={profile.skills?.join(', ') || ''} onChange={(e) => setProfile({ ...profile, skills: e.target.value.split(', ') })} />
      <button onClick={updateProfile}>Update Profile</button>
      
      <h3>Upload CV</h3>
      <form onSubmit={handleCvUpload}>
        <input type="file" onChange={(e) => setCvFile(e.target.files[0])} required />
        <button type="submit">Upload</button>
      </form>
      
      <h3>Generate Portfolio</h3>
      <button onClick={generatePortfolio}>Generate</button>
    </div>
  );
}

export default Dashboard;