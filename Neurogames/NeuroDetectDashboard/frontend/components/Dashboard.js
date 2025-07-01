import React, { useEffect, useState, useRef } from 'react';
import HealthProfileForm from './HealthProfileForm';
import NeuroGames from './NeuroGames';

import neuroGamesIcon from '../assets/icons/neuro-games.png';
import alzheimerDetectorIcon from '../assets/icons/alzheimer-detector.png';
import healthProfileIcon from '../assets/icons/health-profile.png';

import './Dashboard.css';

const Dashboard = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [playingGame, setPlayingGame] = useState(false);
  const [showAlzheimerDetector, setShowAlzheimerDetector] = useState(false);

  // Alzheimer Detector states
  const fileInputRef = useRef();
  const [adResult, setAdResult] = useState('');

  useEffect(() => {
    fetch('/api/profile', { headers: { Authorization: 'Bearer ' + localStorage.getItem('token') } })
      .then(res => res.status === 404 ? null : res.json())
      .then(data => {
        if (!data) setShowProfileForm(true);
        else setUserInfo(data);
      });
  }, []);

  const handleProfileSave = (profile) => {
    fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + localStorage.getItem('token') },
      body: JSON.stringify(profile),
    })
      .then(res => res.json())
      .then(data => {
        setUserInfo(data);
        setShowProfileForm(false);
      });
  };

  const handleGameComplete = (brainAge) => {
    fetch('/api/profile/brain-age', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + localStorage.getItem('token') },
      body: JSON.stringify({ brainAge }),
    })
      .then(res => res.json())
      .then(updatedProfile => {
        setUserInfo(updatedProfile);
        setPlayingGame(false);
      });
  };

  // Handlers for showing different UI views
  const handleNeuroGamesClick = () => setPlayingGame(true);
  const handleAlzheimerDetectorClick = () => {
    setShowAlzheimerDetector(true);
    setAdResult('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };
  const handleHealthProfileClick = () => setShowProfileForm(true);
  const handleBackToDashboard = () => {
    setShowAlzheimerDetector(false);
    setPlayingGame(false);
    setShowProfileForm(false);
    setAdResult('');
  };

  // Alzheimer Detector logic (inlined)
  const predictAD = async () => {
    const file = fileInputRef.current?.files[0];
    if (!file) {
      setAdResult("Please upload a brain MRI scan.");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);

    setAdResult("Processing... Please wait.");

    try {
      const response = await fetch("http://127.0.0.1:8000/predict/", {
        method: "POST",
        body: formData
      });
      if (!response.ok) {
        throw new Error("Server error. Try again.");
      }
      const data = await response.json();
      setAdResult(`Result: ${data.prediction}`);
    } catch (err) {
      setAdResult("Error during prediction. Please check your connection or try again.");
      console.error(err);
    }
  };

  // Conditional rendering
  if (showProfileForm) return <HealthProfileForm onSave={handleProfileSave} />;
  if (!userInfo) return <div>Loading...</div>;
  if (playingGame) return <NeuroGames onComplete={handleGameComplete} />;
  if (showAlzheimerDetector)
    return (
      <div style={{
        background: '#eef2f5',
        minHeight: '100vh',
        fontFamily: "'Segoe UI', sans-serif",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        margin: 0,
        padding: 0
      }}>
        <header style={{
          background: '#34495e',
          width: '100%',
          padding: '20px 0',
          color: 'white',
          textAlign: 'center',
          fontSize: 24,
          fontWeight: 600
        }}>
          🧠 Alzheimer MRI Detector
        </header>
        <div style={{
          background: 'white',
          marginTop: 40,
          padding: 40,
          borderRadius: 10,
          boxShadow: '0 0 15px rgba(0, 0, 0, 0.1)',
          maxWidth: 500,
          width: '90%'
        }}>
          <h2 style={{ marginBottom: 20, color: '#2c3e50' }}>Upload Brain MRI Scan</h2>
          <input type="file" ref={fileInputRef} accept="image/*" style={{ padding: 10, width: '100%', marginBottom: 20 }} />
          <button
            onClick={predictAD}
            style={{
              padding: '12px 25px',
              background: '#27ae60',
              color: 'white',
              border: 'none',
              borderRadius: 5,
              fontSize: 16,
              cursor: 'pointer'
            }}
            onMouseOver={e => e.target.style.background = '#219150'}
            onMouseOut={e => e.target.style.background = '#27ae60'}
          >
            Run Prediction
          </button>
          <button
            onClick={handleBackToDashboard}
            style={{
              marginLeft: 20,
              padding: '12px 25px',
              background: '#34495e',
              color: 'white',
              border: 'none',
              borderRadius: 5,
              fontSize: 16,
              cursor: 'pointer'
            }}
            onMouseOver={e => e.target.style.background = '#222e3c'}
            onMouseOut={e => e.target.style.background = '#34495e'}
          >
            Back to Dashboard
          </button>
          <div id="result" style={{ marginTop: 25, fontSize: 18, fontWeight: 'bold', color: '#2c3e50' }}>
            {adResult}
          </div>
        </div>
      </div>
    );

  // Main Dashboard view
  return (
    <div className="dashboard-outer-container">
      <div className="user-info-card">
        <h2>User Information</h2>
        <p><strong>Name:</strong> {userInfo.name}</p>
        <p><strong>Age:</strong> {userInfo.age}</p>
        <p><strong>Height:</strong> {userInfo.height} cm</p>
        <p><strong>Weight:</strong> {userInfo.weight} kg</p>
        <p><strong>Blood Group:</strong> {userInfo.bloodGroup}</p>
        <p><strong>Brain Age:</strong> {userInfo.brainAge || '-'}</p>
      </div>
      <div className="dashboard-tab-grid">
        <div className="dashboard-tab" onClick={handleNeuroGamesClick}>
          <img src={neuroGamesIcon} alt="Neuro Games" />
          <div className="tab-label">Neuro Games</div>
        </div>
        <div className="dashboard-tab" onClick={handleAlzheimerDetectorClick}>
          <img src={alzheimerDetectorIcon} alt="Alzheimer Detector" />
          <div className="tab-label">Alzheimer Detector</div>
        </div>
        <div className="dashboard-tab" onClick={handleHealthProfileClick} style={{ gridColumn: '1 / span 2', margin: '0 auto' }}>
          <img src={healthProfileIcon} alt="Health Profile" />
          <div className="tab-label">Health Profile</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;