import { useState } from "react";
import { contactRows, topicOptions } from "../data/contact";

const emptyForm = { name: "", email: "", topic: topicOptions[0], message: "" };

function ContactPage() {
  const [form, setForm] = useState(emptyForm);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    
    setForm(emptyForm);
  }

  return (
    <main id="main">
      <section className="page-intro container">
        <span className="tag">Contact</span>
        <h2>Have a tip, a correction, or just a question?</h2>
        <p className="lead">
          Reach the desk that fits — or send a general note and we'll route it. We read
          everything; we can't promise a reply to everything.
        </p>
      </section>

      <section className="contact-grid container">
        <div>
          <div className="section-head" style={{ marginBottom: 0 }}>
            <h3>Reach The Newsroom</h3>
          </div>
          <div className="info-list">
            {contactRows.map((row) => (
              <div className="row" key={row.label}>
                <span className="label">{row.label}</span>
                {row.href ? (
                  <a className="value" href={row.href}>
                    {row.value}
                  </a>
                ) : (
                  <span className="value">{row.value}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="section-head" style={{ marginBottom: 0 }}>
            <h3>Send a Message</h3>
          </div>
          <form style={{ marginTop: 24 }} onSubmit={handleSubmit} noValidate>
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
              <label htmlFor="topic">This is about</label>
              <select id="topic" name="topic" value={form.topic} onChange={handleChange}>
                {topicOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </div>
            <div className="form-field">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={form.message}
                onChange={handleChange}
                required
              />
            </div>
            <p className="form-note">
              This form is for demonstration only — no message is sent. Email us directly using
              the addresses on the left.
            </p>
            <button type="submit" className="btn">
              Send Message
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

export default ContactPage;
