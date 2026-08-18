import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function RegisterPage() {
  const { user, register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
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

    if (form.password !== form.confirm) {
      setError("Passwords don't match.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    const result = register({ name: form.name, email: form.email, password: form.password });
    if (!result.ok) {
      setError(result.error);
      return;
    }
    navigate("/", { replace: true });
  }

  return (
    <main id="main">
      <section className="page-intro container">
        <span className="tag">Create Account</span>
        <h2>Join 40,000 morning readers.</h2>
        <p className="lead">Register with an email and password to start reading.</p>
      </section>

      <section className="contact-grid container" style={{ gridTemplateColumns: "1fr" }}>
        <div style={{ maxWidth: "420px" }}>
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-field">
              <label htmlFor="name">Full name</label>
              <input
                type="text"
                id="name"
                name="name"
                autoComplete="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
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
                autoComplete="new-password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-field">
              <label htmlFor="confirm">Confirm password</label>
              <input
                type="password"
                id="confirm"
                name="confirm"
                autoComplete="new-password"
                value={form.confirm}
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
              Create Account
            </button>

            <p className="form-note" style={{ marginTop: "18px" }}>
              Already have an account? <Link to="/login">Log in</Link>.
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}

export default RegisterPage;
