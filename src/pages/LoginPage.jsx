import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  
  if (user) {
    return <Navigate to="/" replace />;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const result = login(form);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    navigate(from, { replace: true });
  }

  return (
    <main id="main">
      <section className="page-intro container">
        <span className="tag">Sign In</span>
        <h2>Welcome back to your morning edition.</h2>
        <p className="lead">Log in to read today's stories.</p>
      </section>

      <section className="contact-grid container" style={{ gridTemplateColumns: "1fr" }}>
        <div style={{ maxWidth: "420px" }}>
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-field">
              <label htmlFor="email">Email address</label>
              <input
                type="email"
                id="email"
                name="email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-field">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                autoComplete="current-password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            {error && (
              <p className="form-note" style={{ color: "var(--signal)" }}>
                {error}
              </p>
            )}

            <button type="submit" className="btn">
              Log In
            </button>

            <p className="form-note" style={{ marginTop: "18px" }}>
              New here? <Link to="/register">Create an account</Link>.
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}

export default LoginPage;
