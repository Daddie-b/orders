// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './LandingPage';
import OrderForm from './OrderForm';
import AdminDashboard from './AdminDashBoard.js';
import Orders from './Orders';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} /> {/* Landing page */}
        <Route path="/order" element={<OrderForm />} /> {/* Order form */}
        <Route path="/admin" element={<AdminDashboard />} /> {/* Admin dashboard */}
        <Route path="/orders" component={Orders} />
      </Routes>
    </Router>
  );
}

export default App;
