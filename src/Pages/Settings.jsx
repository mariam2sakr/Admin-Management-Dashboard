import React, { useState, useEffect, useRef } from 'react';
import { User, Mail, Phone, Lock, Bell, Globe, Shield, Save, Eye, EyeOff, Camera, CheckCircle, Moon, Sun, Monitor, Database, LogOut, Trash2, AlertTriangle} from 'lucide-react';
import './Settings.css';
import admin from '../assets/images/admin.webp';

const DEFAULT_SETTINGS = {
  notifications: {
    emailAlerts: true,
    pushNotifications: false,
    weeklyReport: true,
    newOrderAlert: true,
    lowStockAlert: false,
    loginAlert: true,
  },
  preferences: {
    language: 'English',
    dateFormat: 'MM/DD/YYYY',
    currency: 'USD',
    rowsPerPage: '10',
  },
  security: {
    twoFactor: false,
    sessionTimeout: '30',
  },
};

function Toggle({ checked, onChange }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`toggle-switch ${checked ? 'on' : ''}`}
    >
      <span className="toggle-thumb" />
    </button>
  );
}

export default function Settings({ activeSection: externalActiveSection, setActiveSection: externalSetActiveSection, onAvatarChange, onNameChange, onEmailChange }) {
  const loggedInEmail = localStorage.getItem('admin_authenticated_email') || '';
  const settingsKey = loggedInEmail ? `dashboard_settings_v2_${loggedInEmail}` : 'dashboard_settings_v2';

  const [settings, setSettings] = useState(() => {
    // Always use the currently logged-in user's name & email,
    // but preserve other saved settings (notifications, preferences, security, avatar).
    const loggedInName  = localStorage.getItem('admin_authenticated_name')  || 'Admin';

    const saved = localStorage.getItem(settingsKey);
    const base  = saved ? JSON.parse(saved) : {};

    return {
      notifications: base.notifications || DEFAULT_SETTINGS.notifications,
      preferences:   base.preferences   || DEFAULT_SETTINGS.preferences,
      security:      base.security       || DEFAULT_SETTINGS.security,
      profile: {
        phone:  base.profile?.phone  || '+20 10-0000-0000',
        bio:    base.profile?.bio    || 'Admin & Product Manager at AdminDashboard.',
        avatar: base.profile?.avatar || admin,
        // Always override name & email from the current login session
        name:  loggedInName,
        email: loggedInEmail,
      },
    };
  });

  const [localActiveSection, setLocalActiveSection] = useState('profile');
  const activeSection = externalActiveSection !== undefined ? externalActiveSection : localActiveSection;
  const setActiveSection = externalSetActiveSection !== undefined ? externalSetActiveSection : setLocalActiveSection;
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [passwords, setPasswords] = useState({ old: '', newp: '', confirm: '' });
  const [saved, setSaved] = useState(false);
  const [passError, setPassError] = useState('');

  const fileInputRef = useRef(null);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateProfile('avatar', reader.result);
        // Notify parent (DashboardLayout) so header & sidebar update instantly
        if (onAvatarChange) onAvatarChange(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    localStorage.setItem(settingsKey, JSON.stringify(settings));
  }, [settings, settingsKey]);

  const updateProfile = (field, value) =>
    setSettings(s => ({ ...s, profile: { ...s.profile, [field]: value } }));

  const updateNotif = (field, value) =>
    setSettings(s => ({ ...s, notifications: { ...s.notifications, [field]: value } }));

  const updatePref = (field, value) =>
    setSettings(s => ({ ...s, preferences: { ...s.preferences, [field]: value } }));

  const updateSec = (field, value) =>
    setSettings(s => ({ ...s, security: { ...s.security, [field]: value } }));

  const handleSave = () => {
    const oldEmail = localStorage.getItem('admin_authenticated_email') || '';
    const newEmail = settings.profile.email;
    const newName = settings.profile.name;

    // Update registered_admins
    const savedAdmins = localStorage.getItem('registered_admins');
    const admins = savedAdmins ? JSON.parse(savedAdmins) : [];
    const adminIndex = admins.findIndex(a => a.email.toLowerCase() === oldEmail.toLowerCase());
    if (adminIndex !== -1) {
      admins[adminIndex].name = newName;
      if (newEmail && newEmail !== oldEmail) {
        admins[adminIndex].email = newEmail;
      }
      localStorage.setItem('registered_admins', JSON.stringify(admins));
    }

    // Update session variables
    if (newName) {
      localStorage.setItem('admin_authenticated_name', newName);
    }

    if (newEmail && newEmail !== oldEmail) {
      // Migrate settings to the new email-scoped key
      const oldKey = `dashboard_settings_v2_${oldEmail}`;
      const newKey = `dashboard_settings_v2_${newEmail}`;
      const oldSettings = localStorage.getItem(oldKey);
      if (oldSettings) {
        localStorage.setItem(newKey, oldSettings);
        localStorage.removeItem(oldKey);
      }
      localStorage.setItem('admin_authenticated_email', newEmail);
    }

    // Notify parent layout so header/sidebar update instantly
    if (onNameChange)  onNameChange(newName);
    if (onEmailChange) onEmailChange(newEmail);

    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    setPassError('');
    if (!passwords.old) { setPassError('Current password is required.'); return; }
    if (passwords.newp.length < 6) { setPassError('New password must be at least 6 characters.'); return; }
    if (passwords.newp !== passwords.confirm) { setPassError('Passwords do not match.'); return; }

    const curEmail = localStorage.getItem('admin_authenticated_email') || '';
    const savedAdmins = localStorage.getItem('registered_admins');
    const admins = savedAdmins ? JSON.parse(savedAdmins) : [];
    const adminIndex = admins.findIndex(a => a.email.toLowerCase() === curEmail.toLowerCase());

    if (adminIndex === -1) {
      setPassError('User session not found.');
      return;
    }

    if (admins[adminIndex].password !== passwords.old) {
      setPassError('Incorrect current password.');
      return;
    }

    // Update password in database
    admins[adminIndex].password = passwords.newp;
    localStorage.setItem('registered_admins', JSON.stringify(admins));

    setPasswords({ old: '', newp: '', confirm: '' });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const SECTIONS = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'preferences', label: 'Preferences', icon: Globe },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  return (
    <div className="settings-container">
      {/* Header */}
      <div className="settings-header">
        <div>
          <h1>Settings</h1>
          <p>Manage your account preferences and system configuration.</p>
        </div>
        {saved && (
          <div className="save-toast">
            <CheckCircle size={16} /> Changes saved!
          </div>
        )}
      </div>

      <div className="settings-layout">
        {/* Sidebar Nav */}
        <nav className="settings-nav">
          {SECTIONS.map(s => {
            const Icon = s.icon;
            return (
              <button
                key={s.id}
                className={`settings-nav-btn ${activeSection === s.id ? 'active' : ''}`}
                onClick={() => setActiveSection(s.id)}
              >
                <Icon size={18} />
                <span>{s.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Content Panel */}
        <div className="settings-panel">

          {/* ── PROFILE ─────────────────────────────── */}
          {activeSection === 'profile' && (
            <div className="settings-section">
              <h2 className="section-title">Profile Information</h2>
              <p className="section-sub">Update your name, contact info, and profile picture.</p>

              {/* Avatar */}
              <div className="avatar-row">
                <div className="avatar-wrap" onClick={() => fileInputRef.current?.click()}>
                  <img src={settings.profile.avatar} alt="Avatar" className="settings-avatar" />
                  <div className="avatar-overlay">
                    <Camera size={18} />
                  </div>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
                <div className="avatar-info">
                  <strong>{settings.profile.name}</strong>
                  <span>{settings.profile.email}</span>
                  <span className="role-chip">Administrator</span>
                </div>
              </div>

              <div className="form-grid-two">
                <div className="form-field">
                  <label><User size={13} /> Full Name</label>
                  <input
                    type="text"
                    value={settings.profile.name}
                    onChange={e => updateProfile('name', e.target.value)}
                    className="s-input"
                  />
                </div>
                <div className="form-field">
                  <label><Mail size={13} /> Email Address</label>
                  <input
                    type="email"
                    value={settings.profile.email}
                    onChange={e => updateProfile('email', e.target.value)}
                    className="s-input"
                  />
                </div>
                <div className="form-field">
                  <label><Phone size={13} /> Phone Number</label>
                  <input
                    type="text"
                    value={settings.profile.phone}
                    onChange={e => updateProfile('phone', e.target.value)}
                    className="s-input"
                  />
                </div>
              </div>

              <div className="form-field">
                <label>Bio</label>
                <textarea
                  rows={3}
                  value={settings.profile.bio}
                  onChange={e => updateProfile('bio', e.target.value)}
                  className="s-input s-textarea"
                />
              </div>

              <button className="s-save-btn" onClick={handleSave}>
                <Save size={16} /> Save Profile
              </button>
            </div>
          )}

          {/* ── NOTIFICATIONS ───────────────────────── */}
          {activeSection === 'notifications' && (
            <div className="settings-section">
              <h2 className="section-title">Notification Preferences</h2>
              <p className="section-sub">Choose which events trigger notifications for your account.</p>

              <div className="notif-list">
                {[
                  { key: 'emailAlerts', label: 'Email Alerts', desc: 'Receive system and account alerts via email.' },
                  { key: 'pushNotifications', label: 'Push Notifications', desc: 'Enable browser push notifications.' },
                  { key: 'weeklyReport', label: 'Weekly Report', desc: 'Get a weekly analytics summary every Monday.' },
                  { key: 'newOrderAlert', label: 'New Order Alert', desc: 'Notify when a new order is placed.' },
                  { key: 'lowStockAlert', label: 'Low Stock Alert', desc: 'Alert when a product stock drops below 10 units.' },
                  { key: 'loginAlert', label: 'Login Activity Alert', desc: 'Notify on new device login to your account.' },
                ].map(item => (
                  <div key={item.key} className="notif-row">
                    <div className="notif-info">
                      <span className="notif-label">{item.label}</span>
                      <span className="notif-desc">{item.desc}</span>
                    </div>
                    <Toggle
                      checked={settings.notifications[item.key]}
                      onChange={v => updateNotif(item.key, v)}
                    />
                  </div>
                ))}
              </div>

              <button className="s-save-btn" onClick={handleSave}>
                <Save size={16} /> Save Preferences
              </button>
            </div>
          )}

          {/* ── PREFERENCES ─────────────────────────── */}
          {activeSection === 'preferences' && (
            <div className="settings-section">
              <h2 className="section-title">App Preferences</h2>
              <p className="section-sub">Customize display, localization, and default behaviors.</p>

              <div className="form-grid-two">
                <div className="form-field">
                  <label><Globe size={13} /> Language</label>
                  <select
                    className="s-input"
                    value={settings.preferences.language}
                    onChange={e => updatePref('language', e.target.value)}
                  >
                    <option>English</option>
                    <option>Arabic</option>
                    <option>French</option>
                    <option>Spanish</option>
                    <option>German</option>
                  </select>
                </div>

                <div className="form-field">
                  <label><Database size={13} /> Rows Per Page</label>
                  <select
                    className="s-input"
                    value={settings.preferences.rowsPerPage}
                    onChange={e => updatePref('rowsPerPage', e.target.value)}
                  >
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>
                </div>

                <div className="form-field">
                  <label>Date Format</label>
                  <select
                    className="s-input"
                    value={settings.preferences.dateFormat}
                    onChange={e => updatePref('dateFormat', e.target.value)}
                  >
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>

                <div className="form-field">
                  <label>Currency</label>
                  <select
                    className="s-input"
                    value={settings.preferences.currency}
                    onChange={e => updatePref('currency', e.target.value)}
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="EGP">EGP (ج.م)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>
              </div>

              <button className="s-save-btn" onClick={handleSave}>
                <Save size={16} /> Save Preferences
              </button>
            </div>
          )}

          {/* ── SECURITY ────────────────────────────── */}
          {activeSection === 'security' && (
            <div className="settings-section">
              <h2 className="section-title">Security Settings</h2>
              <p className="section-sub">Manage your password and account security options.</p>

              {/* 2FA Toggle */}
              <div className="security-row">
                <div>
                  <span className="notif-label">Two-Factor Authentication</span>
                  <span className="notif-desc">Add a second layer of security to your account via email OTP.</span>
                </div>
                <Toggle
                  checked={settings.security.twoFactor}
                  onChange={v => updateSec('twoFactor', v)}
                />
              </div>

              {settings.security.twoFactor && (
                <div className="twofa-info-box">
                  <Shield size={16} />
                  <span>Two-Factor Authentication is <strong>enabled</strong>. You will receive a code via email on each login.</span>
                </div>
              )}

              <div className="form-field" style={{ maxWidth: 260, marginTop: 8 }}>
                <label>Session Timeout (minutes)</label>
                <select
                  className="s-input"
                  value={settings.security.sessionTimeout}
                  onChange={e => updateSec('sessionTimeout', e.target.value)}
                >
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="120">2 hours</option>
                </select>
              </div>

              {/* Password Change */}
              <div className="password-change-box">
                <h3>Change Password</h3>
                <form onSubmit={handlePasswordChange} className="password-form">
                  <div className="form-field">
                    <label>Current Password</label>
                    <div className="pass-input-wrap">
                      <input
                        type={showOldPass ? 'text' : 'password'}
                        placeholder="Enter current password"
                        className="s-input"
                        value={passwords.old}
                        onChange={e => setPasswords(p => ({ ...p, old: e.target.value }))}
                      />
                      <button type="button" className="pass-eye" onClick={() => setShowOldPass(v => !v)}>
                        {showOldPass ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div className="form-grid-two">
                    <div className="form-field">
                      <label>New Password</label>
                      <div className="pass-input-wrap">
                        <input
                          type={showNewPass ? 'text' : 'password'}
                          placeholder="Min 8 characters"
                          className="s-input"
                          value={passwords.newp}
                          onChange={e => setPasswords(p => ({ ...p, newp: e.target.value }))}
                        />
                        <button type="button" className="pass-eye" onClick={() => setShowNewPass(v => !v)}>
                          {showNewPass ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                    <div className="form-field">
                      <label>Confirm Password</label>
                      <input
                        type="password"
                        placeholder="Repeat new password"
                        className="s-input"
                        value={passwords.confirm}
                        onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))}
                      />
                    </div>
                  </div>
                  {passError && <p className="pass-error">{passError}</p>}
                  <button type="submit" className="s-save-btn">
                    <Lock size={16} /> Update Password
                  </button>
                </form>
              </div>

              {/* Danger Zone */}
              <div className="danger-zone">
                <div className="danger-header">
                  <AlertTriangle size={16} />
                  <h4>Danger Zone</h4>
                </div>
                <p>These actions are permanent and cannot be undone.</p>
                <div className="danger-actions">
                  <button className="danger-btn outline">
                    <LogOut size={15} /> Sign Out All Devices
                  </button>
                  <button className="danger-btn fill">
                    <Trash2 size={15} /> Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
