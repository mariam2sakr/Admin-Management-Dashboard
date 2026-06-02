import React, { useState, useEffect } from 'react';
import DashboardLayout from './components/DashboardLayout';
import Login from './components/Login';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('admin_authenticated') === 'true';
  });

  const handleLoginSuccess = () => {
    localStorage.setItem('admin_authenticated', 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated');
    localStorage.removeItem('admin_authenticated_name');
    localStorage.removeItem('admin_authenticated_email');
    setIsAuthenticated(false);
  };

  return isAuthenticated ? (
    <DashboardLayout onLogout={handleLogout} />
  ) : (
    <Login onLoginSuccess={handleLoginSuccess} />
  );
}

export default App;

