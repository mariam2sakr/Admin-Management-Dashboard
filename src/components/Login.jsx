import React, { useState, useEffect } from 'react';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, ShieldAlert } from 'lucide-react';
import './Login.css';
import logo from '../assets/images/logo.png';

export default function Login({ onLoginSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Seed default admin credentials in localStorage if not already present
  useEffect(() => {
    const saved = localStorage.getItem('registered_admins');
    if (!saved) {
      const defaultAdmin = [
        {
          name: 'Mariam Sakr',
          email: 'admin@example.com',
          password: 'admin123'
        }
      ];
      localStorage.setItem('registered_admins', JSON.stringify(defaultAdmin));
    }
  }, []);

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError('');
    setSuccessMessage('');
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  const handleValidate = () => {
    if (isSignUp && !name.trim()) {
      setError("Please enter your full name");
      return false;
    }
    if (!email.trim()) {
      setError("Please enter your Email Address");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return false;
    }
    if (!password) {
      setError('Please enter your password.');
      return false;
    }
    if (password.length < 6) {
      setError('Your password must be at least 6 characters long.');
      return false;
    }
    if (isSignUp && password !== confirmPassword) {
      setError('Passwords do not match.');
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!handleValidate()) return;

    setLoading(true);

    setTimeout(() => {
      // Fetch registered users
      const saved = localStorage.getItem('registered_admins');
      const registeredAdmins = saved ? JSON.parse(saved) : [];

      if (isSignUp) {
        // Sign Up Logic
        const userExists = registeredAdmins.some(
          (admin) => admin.email.toLowerCase() === email.toLowerCase()
        );

        if (userExists) {
          setError("This email address is already registered. Please log in or use another email address.");
          setLoading(false);
          return;
        }

        const newAdmin = { name, email, password };
        const updatedAdmins = [...registeredAdmins, newAdmin];
        localStorage.setItem('registered_admins', JSON.stringify(updatedAdmins));

        setSuccessMessage("Account created successfully! You can now log in.");
        setLoading(false);
        setIsSignUp(false);
        setPassword('');
        setConfirmPassword('');
      } else {
        // Sign In Logic
        const foundAdmin = registeredAdmins.find(
          (admin) => admin.email.toLowerCase() === email.toLowerCase()
        );

        if (!foundAdmin) {
          setError("This email address is not registered. Please create an account first.");
          setLoading(false);
          return;
        }

        if (foundAdmin.password !== password) {
          setError("Incorrect password. Please try again.");
          setLoading(false);
          return;
        }

        // Authentication Success
        localStorage.setItem('admin_authenticated_name', foundAdmin.name);
        localStorage.setItem('admin_authenticated_email', foundAdmin.email);
        setLoading(false);
        onLoginSuccess();
      }
    }, 1200);
  };

  return (
    <div className="login-page-container">
      {/* Background charts image with dark violet visual overlays */}
      <div className="login-bg-overlay"></div>
      
      <div className="login-card-wrapper">
        <div className={`login-glass-card ${isSignUp ? 'signup-mode' : ''}`}>
          <div className="login-header">
            <div className="login-logo-container">
              <img src={logo} alt="Logo" className="login-logo-img" />
              <span className="login-logo-text">AdminDashboard</span>
            </div>
            <h2>{isSignUp ? 'Create your Account' : 'Welcome Back'}</h2>
            <p className="login-subtitle">
              {isSignUp 
                ? 'Get started with your admin access panel' 
                : 'Enter your credentials to access the admin panel'}
            </p>
          </div>

          {error && (
            <div className="login-error-alert animate-fade-in">
              <ShieldAlert size={18} className="alert-icon" />
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="login-success-alert animate-fade-in">
              <span className="success-icon-badge">✓</span>
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            {isSignUp && (
              <div className="login-input-group">
                <label htmlFor="name-input">Full Name</label>
                <div className="input-with-icon">
                  <User size={18} className="input-field-icon" />
                  <input
                    id="name-input"
                    type="text"
                    placeholder=" EX: Mariam Sakr "
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={loading}
                    autoComplete="name"
                  />
                </div>
              </div>
            )}

            <div className="login-input-group">
              <label htmlFor="email-input">Email Address</label>
              <div className="input-with-icon">
                <Mail size={18} className="input-field-icon" />
                <input
                  id="email-input"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="login-input-group">
              <div className="label-row">
                <label htmlFor="password-input">Password</label>
                {!isSignUp && (
                  <a href="#forgot" className="forgot-password-link" onClick={(e) => e.preventDefault()}>
                    Forgot Password?
                  </a>
                )}
              </div>
              <div className="input-with-icon">
                <Lock size={18} className="input-field-icon" />
                <input
                  id="password-input"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  autoComplete={isSignUp ? 'new-password' : 'current-password'}
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex="-1"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {isSignUp && (
              <div className="login-input-group">
                <label htmlFor="confirm-password-input">Confirm Password</label>
                <div className="input-with-icon">
                  <Lock size={18} className="input-field-icon" />
                  <input
                    id="confirm-password-input"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="********"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={loading}
                    autoComplete="new-password"
                  />
                </div>
              </div>
            )}

            {!isSignUp && (
              <div className="login-options-row">
                <label className="remember-me-checkbox">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={loading}
                  />
                  <span>Keep me logged in</span>
                </label>
              </div>
            )}

            <button type="submit" className="login-submit-btn" disabled={loading}>
              {loading ? (
                <div className="spinner-loader"></div>
              ) : (
                <>
                  <span>{isSignUp ? 'Sign Up Now' : 'Sign In'}</span>
                  <ArrowRight size={18} className="submit-btn-arrow" />
                </>
              )}
            </button>
          </form>

          <div className="login-footer">
            <span>
              {isSignUp ? 'Already have an admin account?' : 'New administrator?'}
            </span>
            <button type="button" className="login-toggle-btn" onClick={toggleMode} disabled={loading}>
              {isSignUp ? 'Sign In' : 'Request Access (Sign Up)'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
