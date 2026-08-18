import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password);
      navigate('/');
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('An account with that email already exists.');
      } else {
        setError('Could not create your account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main id="main">
      <section className="page-intro container">
        <span className="tag">Account</span>
        <h2>Create Your Account</h2>
        <p className="lead">Register to save stories and, for the newsroom team, to publish and edit them.</p>
      </section>

      <section className="block">
        <div className="container auth-container">
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-field">
              <label htmlFor="name">Full name</label>
              <input
                type="text" id="name" required autoComplete="name"
                value={name} onChange={(e) => setName(e.target.value)}
              />
            </div>
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
                type="password" id="password" required autoComplete="new-password"
                value={password} onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="form-field">
              <label htmlFor="confirm">Confirm password</label>
              <input
                type="password" id="confirm" required autoComplete="new-password"
                value={confirm} onChange={(e) => setConfirm(e.target.value)}
              />
            </div>

            {error && <p className="form-note form-note-error">{error}</p>}

            <button type="submit" className="btn" disabled={loading}>
              {loading ? 'Creating account…' : 'Register'}
            </button>

            <p className="auth-links">
              <span>Already have an account? <Link to="/login">Log in</Link></span>
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}
