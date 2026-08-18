import React from 'react';
import { useScrollMemory } from '../hooks/useScrollMemory.js';

export default function Terms() {
  useScrollMemory('terms');

  return (
    <main id="main">
      <section className="page-intro container">
        <span className="tag">Legal</span>
        <h2>Terms of Service</h2>
        <p className="lead">
          The basic rules for using Today.news and publishing on the platform.
        </p>
      </section>

      <section className="block">
        <div className="container legal-copy">
          <h4>Using the site</h4>
          <p>
            Today.news is provided for personal, non-commercial reading and, for registered contributors,
            for publishing original articles. You agree not to misuse the service or attempt to access it in
            ways not permitted by these terms.
          </p>

          <h4>Publishing content</h4>
          <p>
            If you write and publish an article through your Dashboard, you confirm the content is your own
            work and that you have the right to share it. We may remove content that violates our
            <a href="/editorial-guidelines"> Editorial Guidelines</a> or applicable law.
          </p>

          <h4>Accounts</h4>
          <p>
            You're responsible for keeping your login credentials secure and for the activity that happens
            under your account.
          </p>

          <h4>Changes</h4>
          <p>We may update these terms from time to time. Continued use of the site means you accept the current version.</p>
        </div>
      </section>
    </main>
  );
}
