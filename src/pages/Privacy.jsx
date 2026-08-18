import React from 'react';
import { useScrollMemory } from '../hooks/useScrollMemory.js';

export default function Privacy() {
  useScrollMemory('privacy');

  return (
    <main id="main">
      <section className="page-intro container">
        <span className="tag">Legal</span>
        <h2>Privacy Policy</h2>
        <p className="lead">
          How Today.news collects, uses, and protects the information you share with us.
        </p>
      </section>

      <section className="block">
        <div className="container legal-copy">
          <h4>Information we collect</h4>
          <p>
            When you create an account we store your name, email address, and any profile details you choose
            to add. If you subscribe to our newsletter, we store the email address you provide for that purpose.
          </p>

          <h4>How we use it</h4>
          <p>
            We use your information to run your account, deliver the newsletter you signed up for, and improve
            the stories and features we publish. We do not sell your personal information to third parties.
          </p>

          <h4>Your choices</h4>
          <p>
            You can update your profile at any time from your account, unsubscribe from the newsletter using the
            link in any email, or contact us to request that your account be deleted.
          </p>

          <h4>Contact</h4>
          <p>Questions about this policy can be sent through our <a href="/contact">Contact</a> page.</p>
        </div>
      </section>
    </main>
  );
}
