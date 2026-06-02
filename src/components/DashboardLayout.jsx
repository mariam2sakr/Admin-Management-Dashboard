import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Dashboard from '../Pages/Dashboard';
import Users from '../Pages/Users';
import Products from '../Pages/Products';
import Orders from '../Pages/Orders';
import Analytics from '../Pages/Analytics';
import Support from '../Pages/Support';
import Settings from '../Pages/Settings';
import './DashboardLayout.css';
import { Menu, Bell, Search, Sun, Moon } from 'lucide-react';
import adminDefault from '/assets/images/admin.webp';

export default function DashboardLayout({ children, onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    return window.innerWidth >= 1024;
  });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [settingsSection, setSettingsSection] = useState('profile');
  const [theme, setTheme] = useState('light'); // 'light' is default

  const loggedInEmail = localStorage.getItem('admin_authenticated_email') || '';
  const settingsKey = loggedInEmail ? `dashboard_settings_v2_${loggedInEmail}` : 'dashboard_settings_v2';

  // Shared avatar state — reads from saved settings, falls back to default
  const [profileAvatar, setProfileAvatar] = useState(() => {
    try {
      const saved = localStorage.getItem(settingsKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed?.profile?.avatar || adminDefault;
      }
    } catch {}
    return adminDefault;
  });

  // Shared user name — reads from saved settings first, then login data
  const [profileName, setProfileName] = useState(() => {
    try {
      const saved = localStorage.getItem(settingsKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.profile?.name) return parsed.profile.name;
      }
    } catch {}
    return localStorage.getItem('admin_authenticated_name') || 'Admin';
  });

  // Shared user email — reads from saved settings first, then login data
  const [profileEmail, setProfileEmail] = useState(() => {
    try {
      const saved = localStorage.getItem(settingsKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.profile?.email) return parsed.profile.email;
      }
    } catch {}
    return loggedInEmail || '';
  });

  // Listen for profile changes saved by Settings page
  useEffect(() => {
    const syncProfile = (e) => {
      if (e && e.key && e.key !== settingsKey) return;
      try {
        const saved = localStorage.getItem(settingsKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed?.profile?.avatar) setProfileAvatar(parsed.profile.avatar);
          if (parsed?.profile?.name)   setProfileName(parsed.profile.name);
          if (parsed?.profile?.email)  setProfileEmail(parsed.profile.email);
        }
      } catch {}
    };
    window.addEventListener('storage', syncProfile);
    return () => window.removeEventListener('storage', syncProfile);
  }, [settingsKey]);

  // Inject class to documentElement for global styles access
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('light-mode');
    } else {
      root.classList.remove('light-mode');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard theme={theme} />
        );
      case 'users':
        return (
          <Users />
        );
      case 'products':
        return (
          <Products />
        );
      case 'orders':
        return (
          <Orders />
        );
      case 'analytics':
        return (
          <Analytics theme={theme} />
        );
      case 'support':
        return (
          <Support />
        );
      case 'settings':
        return (
          <Settings
            activeSection={settingsSection}
            setActiveSection={setSettingsSection}
            onAvatarChange={setProfileAvatar}
            onNameChange={setProfileName}
            onEmailChange={setProfileEmail}
          />
        );
      default:
        return (
          <div className="tab-placeholder">
            <h2>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Page</h2>
            <p>This content is coming soon! Under construction.</p>
          </div>
        );
    }
  };

  return (
    <div className={`dashboard-layout ${theme}-mode`}>
      {/* Sidebar Component */}
      <Sidebar 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        theme={theme}
        toggleTheme={toggleTheme}
        onLogout={onLogout}
        profileAvatar={profileAvatar}
        profileName={profileName}
      />

      {/* Main Content Wrapper (LTR Layout Offsets) */}
      <div className={`main-wrapper ${sidebarOpen ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
        
        {/* Top Navbar */}
        <header className="dashboard-header">
          <button className="mobile-menu-trigger" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu size={22} />
          </button>

          <div className="header-search">
            <Search size={18} className="search-icon" />
            <input type="text" placeholder="Search anything..." dir="ltr" />
          </div>

          <div className="header-actions">
            {/* Header Theme Toggle (Sun/Moon switch) */}
            <button className="header-action-btn theme-toggle-header-btn" onClick={toggleTheme} title="Toggle Theme">
              {theme === 'dark' ? <Sun size={20} className="sun-icon" /> : <Moon size={20} className="moon-icon" />}
            </button>

            <button
              className="header-action-btn"
              aria-label="Notifications"
              onClick={() => {
                setActiveTab('settings');
                setSettingsSection('notifications');
              }}
            >
              <span className="notification-dot"></span>
              <Bell size={20} />
            </button>
            <div className="header-divider"></div>
            <div
              className="header-user"
              onClick={() => {
                setActiveTab('settings');
                setSettingsSection('profile');
              }}
            >
              <span className="header-username">{profileName.split(' ')[0]}</span>
              <img 
                src={profileAvatar} 
                alt="Profile" 
                className="header-avatar"
              />
            </div>
          </div>
        </header>

        {/* Dashboard Main Content Area */}
        <main className="dashboard-content">
          <div className="content-container">
            {children || renderTabContent()}
          </div>
        </main>
      </div>
    </div>
  );
}