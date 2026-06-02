import React, { useState, useEffect } from 'react';
import './Sidebar.css';
import logo from '../assets/images/logo.png';
import {  LayoutDashboard,  BarChart3,  Users,  Settings,  HelpCircle,  LogOut,  X,  ChevronLeft,  ChevronRight,  Package,  ShoppingCart,  Sun,  Moon } from 'lucide-react';

export default function Sidebar({ isOpen, setIsOpen, activeTab, setActiveTab, theme, toggleTheme, onLogout, profileAvatar, profileName }) {
  const [isMobile, setIsMobile] = useState(false);

  // Monitor viewport size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', name: 'Users', icon: Users },
    { id: 'products', name: 'Products', icon: Package },
    { id: 'orders', name: 'Orders', icon: ShoppingCart, badge: '12' },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 },
    { id: 'settings', name: 'Settings', icon: Settings },
    { id: 'support', name: 'Support', icon: HelpCircle },
  ];

  const handleToggle = () => setIsOpen(!isOpen);

  const handleItemClick = (id) => {
    setActiveTab(id);
    if (isMobile) setIsOpen(false); // Close sidebar on click when in mobile viewport
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobile && isOpen && (
        <div className="sidebar-overlay" onClick={() => setIsOpen(false)} />
      )}

      {/* LTR Sidebar Container */}
      <aside className={`sidebar-container ${isOpen ? 'expanded' : 'collapsed'} ${isMobile ? 'mobile' : ''} ${isMobile && isOpen ? 'mobile-open' : ''}`}>
        
        {/* Header Section */}
        <div className="sidebar-header">
          <div className="brand-logo">
            <img src={logo} alt="AdminDashboard Logo" className="logo-img" />
            {isOpen && <span className="brand-name">AdminDashboard</span>}
          </div>
          
          {/* Collapse/Expand toggle for Desktop */}
          {!isMobile && (
            <button className="sidebar-toggle-btn" onClick={handleToggle} aria-label="Toggle Sidebar">
              {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
            </button>
          )}

          {/* Close button for Mobile screen */}
          {isMobile && (
            <button className="sidebar-close-btn" onClick={() => setIsOpen(false)} aria-label="Close Sidebar">
              <X size={20} />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="sidebar-nav">
          <ul className="nav-list">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <li key={item.id} className="nav-item-wrapper">
                  <button 
                    onClick={() => handleItemClick(item.id)}
                    className={`nav-item ${isActive ? 'active' : ''}`}
                    title={!isOpen && !isMobile ? item.name : undefined}
                  >
                    <div className="nav-item-icon-wrapper">
                      <IconComponent className="nav-item-icon" size={20} />
                    </div>
                    {isOpen && <span className="nav-item-text">{item.name}</span>}
                    
                    {/* Badge alert */}
                    {isOpen && item.badge && (
                      <span className={`nav-item-badge ${item.badge === 'New' || item.badge === '12' ? 'badge-new' : ''}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer Area */}
        <div className="sidebar-footer">
          {/* Dynamic Theme Toggle Switch */}
          <button 
            className="theme-toggle-item-btn" 
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            <div className="theme-toggle-icon-wrapper">
              {theme === 'dark' ? <Sun size={18} className="sun-icon" /> : <Moon size={18} className="moon-icon" />}
            </div>
            {isOpen && (
              <span className="theme-toggle-text">
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </span>
            )}
          </button>

          <div className="user-profile-wrapper">
            <img 
              src={profileAvatar} 
              alt="User avatar" 
              className="user-avatar"
            />
            {isOpen && (
              <div className="user-info">
                <span className="user-name">{profileName || 'Admin'}</span>
                <span className="user-role">Administrator</span>
              </div>
            )}
          </div>
          
          <button className="logout-btn" title="Log Out" onClick={onLogout}>
            <LogOut size={18} />
            {isOpen && <span className="logout-text">Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}