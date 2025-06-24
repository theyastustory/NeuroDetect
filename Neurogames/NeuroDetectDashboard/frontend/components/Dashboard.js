import React, { useEffect, useState } from 'react';
import HealthProfileForm from './HealthProfileForm';
import NeuroGames from './NeuroGames'; // Your games component

const Dashboard = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [playingGame, setPlayingGame] = useState(false);

  // Fetch profile on mount
  useEffect(() => {
    fetch('/api/profile', { headers: { Authorization: 'Bearer ' + localStorage.getItem('token') } })
      .then(res => res.status === 404 ? null : res.json())
      .then(data => {
        if (!data) setShowProfileForm(true);
        else setUserInfo(data);
      });
  }, []);

  // Save health profile handler
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

  // When game is done, save brain age
  const handleGameComplete = (brainAge) => {
    fetch('/api/profile/brain-age', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + localStorage.getItem('token') },
      body: JSON.stringify({ brainAge }),
    })
      .then(res => res.json())
      .then(updatedProfile => {
        setUserInfo(updatedProfile); // update dashboard with new brain age
        setPlayingGame(false);       // return to dashboard
      });
  };

  if (showProfileForm) return <HealthProfileForm onSave={handleProfileSave} />;
  if (!userInfo) return <div>Loading...</div>;
  if (playingGame) return <NeuroGames onComplete={handleGameComplete} />;

  return (
    <div>
      <h1>Welcome to Neuro Detect</h1>
      <div>
        <h2>User Information</h2>
        <p><strong>Name:</strong> {userInfo.name}</p>
        <p><strong>Age:</strong> {userInfo.age}</p>
        <p><strong>Blood Group:</strong> {userInfo.bloodGroup}</p>
        <p><strong>Height:</strong> {userInfo.height}</p>
        <p><strong>Weight:</strong> {userInfo.weight}</p>
        {userInfo.brainAge ? (
          <p><strong>Brain Age:</strong> {userInfo.brainAge} years</p>
        ) : (
          <button onClick={() => setPlayingGame(true)}>Play Neuro Games</button>
        )}
      </div>
      {/* Add more dashboard features/buttons here if you want */}
    </div>
  );
};

export default Dashboard;
