import { useState } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ChatNegosiasi from './pages/ChatNegosiasi';
import TrackerProyek from './pages/TrackerProyek';
import AmbilGaji from './pages/AmbilGaji';

function App() {
  const [currentPage, setCurrentPage] = useState('login'); // 'login', 'dashboard', 'chat', 'tracker', 'gaji'

  const handleLogout = () => {
    setCurrentPage('login');
  };

  const handleLoginSuccess = () => {
    setCurrentPage('dashboard');
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  if (currentPage === 'login') {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  if (currentPage === 'chat') {
    return <ChatNegosiasi onLogout={handleLogout} onNavigate={handleNavigate} />;
  }

  if (currentPage === 'tracker') {
    return <TrackerProyek onLogout={handleLogout} onNavigate={handleNavigate} />;
  }

  if (currentPage === 'gaji') {
    return <AmbilGaji onLogout={handleLogout} onNavigate={handleNavigate} />;
  }

  return <Dashboard onLogout={handleLogout} onNavigate={handleNavigate} />;
}

export default App;
