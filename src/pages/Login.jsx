import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError('Could not sign in — check your email and password.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main id="main">
      <section className="page-intro container">
        <span className="tag">Account</span>
        <h2>Log In</h2>
        <p className="lead">Welcome back — sign in to manage stories from the newsroom dashboard.</p>
      </section>

      <section className="block">
        <div className="container auth-container">
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-field">
              <label htmlFor="email">Email address</label>
              <input
                type="email" id="email" required autoComplete="email"
                value={email} onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-field">
              <label htmlFor="password">Password</label>
              <input
                type="password" id="password" required autoComplete="current-password"
                value={password} onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && <p className="form-note form-note-error">{error}</p>}

            <button type="submit" className="btn" disabled={loading}>
              {loading ? 'Signing in…' : 'Log In'}
            </button>

            <p className="auth-links">
              <Link to="/forgot-password">Forgot password?</Link>
              <span>Need an account? <Link to="/register">Register</Link></span>
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}
