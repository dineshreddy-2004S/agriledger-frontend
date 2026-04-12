import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import AdminDashboard from './components/AdminDashboard';
import FarmerDashboard from './components/FarmerDashboard';

export default function App() {
  const [history, setHistory] = useState(['landing']);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('agri_user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      const view = parsedUser.role === 'admin' ? 'admin-dashboard' : 'farmer-dashboard';
      setHistory([view]);
      setHistoryIndex(0);
    }
  }, []);

  const handleNavigate = (view) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(view);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleAuthenticate = (userData) => {
    setUser(userData);
    localStorage.setItem('agri_user', JSON.stringify(userData));
    const view = userData.role === 'admin' ? 'admin-dashboard' : 'farmer-dashboard';
    handleNavigate(view);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('agri_user');
    setUser(null);
    handleNavigate('landing');
  };

  const goBack = () => {
    if (historyIndex > 0) setHistoryIndex(historyIndex - 1);
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) setHistoryIndex(historyIndex + 1);
  };

  const currentView = history[historyIndex];

  return (
    <>
      {currentView === 'landing' && <LandingPage onNavigate={handleNavigate} />}
      
      {['signin', 'signup', 'forgot-password', 'forgot-user'].includes(currentView) && (
        <AuthPage type={currentView} onAuthenticate={handleAuthenticate} onNavigate={handleNavigate} />
      )}
      
      {currentView === 'admin-dashboard' && user?.role === 'admin' && (
        <AdminDashboard onLogout={handleLogout} />
      )}
      
      {currentView === 'farmer-dashboard' && user && (
        <FarmerDashboard user={user} onLogout={handleLogout} />
      )}
    </>
  );
}