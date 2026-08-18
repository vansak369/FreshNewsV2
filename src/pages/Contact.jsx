import React, { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase.js';
import { useScrollMemory } from '../hooks/useScrollMemory.js';

export default function Contact() {
  useScrollMemory('contact');

  const [form, setForm] = useState({ name: '', email: '', topic: 'General inquiry', message: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('sending');
    try {
      await addDoc(collection(db, 'messages'), { ...form, createdAt: serverTimestamp() });
      setStatus('sent');
      setForm({ name: '', email: '', topic: 'General inquiry', message: '' });
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  }

  return (
    <main id="main">
      <section className="page-intro container">
        <span className="tag">Contact</span>
        <h2>Have a tip, a correction, or just a question?</h2>
        <p className="lead">
          Reach the desk that fits — or send a general note and we'll route it. We read everything; we can't
          promise a reply to everything.
        </p>
      </section>

      <section className="contact-grid container">
        <div>
          <div className="section-head" style={{ marginBottom: 0 }}>
            <h3>Reach The Newsroom</h3>
          </div>
          <div className="info-list">
            <div className="row">
              <span className="label">General Inquiries</span>
              <a className="value" href="mailto:hello@freshnews.example">hello@freshnews.example</a>
            </div>
            <div className="row">
              <span className="label">News Tips</span>
              <a className="value" href="mailto:tips@freshnews.example">tips@freshnews.example</a>
            </div>
            <div className="row">
              <span className="label">Advertising</span>
              <a className="value" href="mailto:ads@freshnews.example">ads@freshnews.example</a>
            </div>
            <div className="row">
              <span className="label">Phone</span>
              <a className="value" href="tel:+855123456789">+855 12 345 6789</a>
            </div>
            <div className="row">
              <span className="label">Newsroom Address</span>
              <span className="value">14 Street 240, Phnom Penh, Cambodia</span>
            </div>
            <div className="row">
              <span className="label">Desk Hours</span>
              <span className="value">Mon – Fri, 7:00 — 19:00 (ICT)</span>
            </div>
          </div>
        </div>

        <div>
          <div className="section-head" style={{ marginBottom: 0 }}>
            <h3>Send a Message</h3>
          </div>
          <form style={{ marginTop: 24 }} onSubmit={handleSubmit}>
            <div className="form-field">
              <label htmlFor="name">Full name</label>
              <input
                type="text" id="name" name="name" autoComplete="name" required
                value={form.name} onChange={(e) => update('name', e.target.value)}
              />
            </div>
            <div className="form-field">
              <label htmlFor="email">Email address</label>
              <input
                type="email" id="email" name="email" autoComplete="email" required
                value={form.email} onChange={(e) => update('email', e.target.value)}
              />
            </div>
            <div className="form-field">
              <label htmlFor="topic">This is about</label>
              <select id="topic" name="topic" value={form.topic} onChange={(e) => update('topic', e.target.value)}>
                <option>General inquiry</option>
                <option>News tip</option>
                <option>Correction request</option>
                <option>Advertising</option>
              </select>
            </div>
            <div className="form-field">
              <label htmlFor="message">Message</label>
              <textarea
                id="message" name="message" required
                value={form.message} onChange={(e) => update('message', e.target.value)}
              />
            </div>

            {status === 'sent' && <p className="form-note">Thanks — your message was sent to the newsroom.</p>}
            {status === 'error' && <p className="form-note">Something went wrong. Please try again.</p>}

            <button type="submit" className="btn" disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending…' : 'Send Message'}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
