import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PrivacyPolicy from './pages/PrivacyPolicy';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        
        {/* Privacy Policy Routes */}
        <Route path="/perfect-bridge-privacy" element={<PrivacyPolicy appKey="perfect-bridge" />} />
        <Route path="/bold-solter-privacy" element={<PrivacyPolicy appKey="bold-solter" />} />
        <Route path="/math-orbit-hero-privacy" element={<PrivacyPolicy appKey="math-orbit-hero" />} />
        <Route path="/math-tower-privacy" element={<PrivacyPolicy appKey="math-tower" />} />
        <Route path="/todolist-privacy" element={<PrivacyPolicy appKey="todolist" />} />
        <Route path="/filmlist-privacy" element={<PrivacyPolicy appKey="filmlist" />} />
        <Route path="/cuzdan-privacy" element={<PrivacyPolicy appKey="cuzdan" />} />
      </Routes>
    </Router>
  );
}

export default App;