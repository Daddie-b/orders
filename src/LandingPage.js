// LandingPage.js
import React from 'react';
import { Link } from 'react-router-dom';
//import AdminDashboard from './AdminDashBoard';
import './LandingPage.css'; 

function LandingPage() {
  return (
    <div>
      <h1>Welcome to the MugoMarbles </h1>
      <p>Click on the links below to navigate:</p>
      <ul>
        <li><Link to="/order">Order Form</Link></li>
        <li><Link to="/admin">Admin Dashboard</Link></li>
      </ul>
    </div>
  );
}

export default LandingPage;
  