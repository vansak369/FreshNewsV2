import { useState } from "react";

function Newsletter({ idSuffix = "" }) {
  const [email, setEmail] = useState("");
  const inputId = `newsletter-email${idSuffix ? `-${idSuffix}` : ""}`;

  function handleSubmit(e) {
    e.preventDefault();
   
    setEmail("");
  }

  return (
    <section className="block ink">
      <div className="container newsletter">
        <div>
          <h3>Get the morning COFFEE WITH FRESH NEWS</h3>
          <p>
            Five stories, zero fluff, delivered to your inbox before 7am. Cancel any time — no
            hard feelings.
          </p>
        </div>
        <form className="newsletter-form" onSubmit={handleSubmit}>
          <label htmlFor={inputId} style={{ position: "absolute", left: "-9999px" }}>
            Email address
          </label>
          <input
            id={inputId}
            type="email"
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Subscribe</button>
        </form>
      </div>
    </section>
  );
}

export default Newsletter;
