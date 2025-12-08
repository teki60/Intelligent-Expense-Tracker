import React, { useState, useContext, useEffect } from 'react';
import { GlobalContext } from '../context/GlobalContext';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, user } = useContext(GlobalContext);
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    if (!password.trim()) {
      setError('Password is required');
      return;
    }

    // Simple validation - in a real app, this would be an API call
    // For demo purposes, accept any email/password combination
    if (email && password) {
      const username = email.split('@')[0] || email;
      login(username);
      navigate('/');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>ProTracker</h2>
        <p>Manage your finances with precision.</p>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="admin@company.com"
              required 
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" 
              required
            />
          </div>
          <button type="submit" className="btn-primary">Sign In</button>
          <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-light)', textAlign: 'center' }}>
            Demo: Enter any email and password to continue
          </p>
        </form>
      </div>
    </div>
  );
};