import React from 'react';
import { useScrollMemory } from '../hooks/useScrollMemory.js';
const images = import.meta.glob('../assets/*.{webp,jpg,png}', { eager: true, import: 'default' });
const TEAM = [
  { name: 'Kimheng Lim', role: 'Editor-in-Chief', img: images['../assets/Kraaaa.webp'], c1: '#2a2b33' },
  { name: 'Vansak Vong', role: 'World Desk', img: images['../assets/rizz.jpg'], c1: '#33282a' },
  { name: 'Vannak Thanuk', role: 'Business Desk', img: images['../assets/Punch.webp'], c1: '#2b3328' },
  { name: 'Vibol Sok', role: 'Sport Desk', img: images['../assets/download.jpg'], c1: '#282f33' },
];

export default function About() {
  useScrollMemory('about');

  return (
    <main id="main">
      <section className="page-intro container">
        <span className="tag">About Us</span>
        <h2>A small newsroom that reads the news before it cools.</h2>
        <p className="lead">
          Fresh News started as a five-person morning briefing in 2022. Today we're a daily digital edition
          covering technology, business, culture, sport and the world — written by reporters who still pick up
          the phone.
        </p>
      </section>

      <section className="block">
        <div className="container">
          <div className="section-head">
            <h3>What We Stand For</h3>
            <span className="count">Editorial values</span>
          </div>
          <div className="columns-3">
            <div className="col-item">
              <span className="num">Value 01</span>
              <h4>Verify before we publish</h4>
              <p>Every claim gets a second source. If we can't confirm it, we say so plainly instead of hedging in vague language.</p>
            </div>
            <div className="col-item">
              <span className="num">Value 02</span>
              <h4>Write for the reader's morning</h4>
              <p>Five minutes, no jargon. We trim the story down to what actually changes your day, not what pads a word count.</p>
            </div>
            <div className="col-item">
              <span className="num">Value 03</span>
              <h4>Correct loudly, not quietly</h4>
              <p>Mistakes happen. When they do, the correction runs as visibly as the original story — not buried in a footnote.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="block dim">
        <div className="container">
          <div className="section-head">
            <h3>Our Story So Far</h3>
            <span className="count">2022 — present</span>
          </div>
          <div className="timeline">
            <div className="t-item">
              <span className="yr">2022</span>
              <h4>Five reporters, one shared inbox</h4>
              <p>Fresh News launched as a free email briefing sent to a few hundred neighbors and colleagues.</p>
            </div>
            <div className="t-item">
              <span className="yr">2023</span>
              <h4>The first daily edition goes live</h4>
              <p>We moved off email and onto the web, adding a dedicated business and technology desk.</p>
            </div>
            <div className="t-item">
              <span className="yr">2024</span>
              <h4>Readership passes 25,000</h4>
              <p>A sports desk and a weekend culture section joined the lineup, alongside our first regional correspondents.</p>
            </div>
            <div className="t-item">
              <span className="yr">2026</span>
              <h4>40,000 readers, every weekday morning</h4>
              <p>Same small-newsroom standards, just more hands on deck — and still no stale leads.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="block">
        <div className="container">
          <div className="section-head">
            <h3>The Newsroom</h3>
            <span className="count">8 staff, 3 desks</span>
          </div>
          <div className="team-grid">
            {TEAM.map((member) => (
              <div className="team-card" key={member.name}>
                <div className="avatar" style={{ '--c1': member.c1, '--c2': '#1B1B1F' }}>
                  <img
                    src={member.img}
                    alt={member.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </div>
                <h4>{member.name}</h4>
                <span className="role">{member.role}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="block ink">
        <div className="container newsletter">
          <div>
            <h3>Get the morning COFFEE WITH FRESH NEWS</h3>
            <p>Five stories, zero fluff, delivered to your inbox before 7am. Cancel any time — no hard feelings.</p>
          </div>
          <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="newsletter-email-about" style={{ position: 'absolute', left: '-9999px' }}>
              Email address
            </label>
            <input id="newsletter-email-about" type="email" placeholder="you@email.com" required />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </section>
    </main>
  );
}
