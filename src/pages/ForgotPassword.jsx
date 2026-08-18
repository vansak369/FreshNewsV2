import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function ForgotPassword() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); 
  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('sending');
    try {
      await resetPassword(email);
      setStatus('sent');
    } catch (err) {
      setStatus('error');
    }
  }

  return (
    <main id="main">
      <section className="page-intro container">
        <span className="tag">Account</span>
        <h2>Reset Your Password</h2>
        <p className="lead">Enter the email on your account and we'll send a link to reset your password.</p>
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

            {status === 'sent' && (
              <p className="form-note">Check your inbox — a reset link is on its way.</p>
            )}
            {status === 'error' && (
              <p className="form-note form-note-error">Could not send the reset email. Check the address and try again.</p>
            )}

            <button type="submit" className="btn" disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending…' : 'Send Reset Link'}
            </button>

            <p className="auth-links">
              <Link to="/login">Back to log in</Link>
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}
