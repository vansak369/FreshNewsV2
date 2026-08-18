import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);


  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    function onKeyDown(e) {
      if (e.key === 'Escape') setOpen(false);
    }
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  return (
    <header className="navbar">
      <div className="container navbar-row">
        <Link to="/" className="navbar-brand" onClick={() => setOpen(false)}>
          today<span className="dot">●</span>NEWS
        </Link>

        <button
          type="button"
          className={`navbar-toggle${open ? ' is-open' : ''}`}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="primary-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>

        <div id="primary-menu" className={`navbar-menu${open ? ' is-open' : ''}`}>
          <nav className="navbar-links" aria-label="Primary">
            <ul>
              <li><NavLink to="/" end>Home</NavLink></li>
              <li><NavLink to="/hot-news">Hot News</NavLink></li>
              <li><NavLink to="/about">About</NavLink></li>
              <li><NavLink to="/contact">Contact</NavLink></li>
              {user && <li><NavLink to="/dashboard">Dashboard</NavLink></li>}
            </ul>
          </nav>

          <div className="navbar-actions">
            {user ? (
              <>
                <Link to="/dashboard/new" className="btn btn-outline btn-sm">+ Write</Link>
                <Link to="/profile" className="navbar-user navbar-user-link">
                  {user.displayName || user.email}
                </Link>
                <button className="btn btn-outline btn-sm" onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
                <Link to="/register" className="btn btn-sm">Register</Link>
              </>
            )}
          </div>
        </div>

        {open && <button type="button" className="navbar-backdrop" aria-label="Close menu" onClick={() => setOpen(false)} />}
      </div>
    </header>
  );
}
