
import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import brainIcon from '../assets/icons/neuro-games.png';
import detectorIcon from '../assets/icons/alzheimer-detector.png';
import profileIcon from '../assets/icons/health-profile.png';

const Dashboard = () => {
  const [userInfo, setUserInfo] = useState({
    name: "Yastika Joshi",
    age: 25,
    bloodGroup: "B+",
    height: "167 cm",
    weight: "60 kg",
    brainAge: null
  });

  return (
    <div className="dashboard-container">
      <h1>Welcome to Neuro Detect</h1>

      <div className="user-info-card">
        <img src={profileIcon} alt="Profile" />
        <h2>User Information</h2>
        <p><strong>Name:</strong> {userInfo.name}</p>
        <p><strong>Age:</strong> {userInfo.age}</p>
        <p><strong>Blood Group:</strong> {userInfo.bloodGroup}</p>
        <p><strong>Height:</strong> {userInfo.height}</p>
        <p><strong>Weight:</strong> {userInfo.weight}</p>
        {userInfo.brainAge ? (
          <p><strong>Brain Age:</strong> {userInfo.brainAge} years</p>
        ) : (
          <button className="play-button">Play Neuro Games</button>
        )}
      </div>

      <div className="dashboard-buttons">
        <div className="dashboard-button">
          <img src={brainIcon} alt="Neuro Games" />
          <button>Neuro Games</button>
        </div>
        <div className="dashboard-button">
          <img src={detectorIcon} alt="Alzheimer Detector" />
          <button>Alzheimer Detector</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
