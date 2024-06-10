// AdminLogin.js
import React, { useState } from 'react';

function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Define the set of admin credentials
  const adminCredentials = [
    { username: 'admin1', password: 'password1' },
    { username: 'admin2', password: 'password2' },
    // Add more admin credentials as needed
  ];

  const handleLogin = () => {
    // Check if the entered credentials match any of the admin credentials
    const isValidAdmin = adminCredentials.some(cred => cred.username === username && cred.password === password);

    if (isValidAdmin) {
      // Call the onLogin function passed from parent component with true to indicate successful login
      onLogin(true);
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div>
      <h2>Admin Login</h2>
      <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <button onClick={handleLogin}>Login</button>
      {error && <p>{error}</p>}
    </div>
  );
}

export default AdminLogin;
