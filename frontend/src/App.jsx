import { useState } from 'react';
import './App.css';

import Login from './pages/Login.jsx';
import DonorDashboard from './pages/donor/DonorDashboard.jsx';
import NGODashboard from './pages/ngo/NGODashboard.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';

function App() {
  const [currentRole, setCurrentRole] = useState(() => {
  try {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    return token && user?.role ? user.role : null;
  } catch {
    return null;
  }
});

  const handleLogin = (role) => {
    setCurrentRole(role);
  };

  const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  setCurrentRole(null);
};

  if (!currentRole) {
    return <Login onLogin={handleLogin} />;
  }

  if (currentRole === 'donor') {
    return <DonorDashboard onLogout={handleLogout} />;
  }

  if (currentRole === 'ngo') {
    return <NGODashboard onLogout={handleLogout} />;
  }

  if (currentRole === 'admin') {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  return <Login onLogin={handleLogin} />;
}

export default App;