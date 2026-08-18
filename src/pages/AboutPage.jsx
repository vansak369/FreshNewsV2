import ValueCard from "../components/ValueCard";
import TimelineItem from "../components/TimelineItem";
import TeamCard from "../components/TeamCard";
import Newsletter from "../components/Newsletter";
import { values, timeline, team } from "../data/about";

function AboutPage() {
  return (
    <main id="main">
      <section className="page-intro container">
        <span className="tag">About Us</span>
        <h2>A small newsroom that reads the news before it cools.</h2>
        <p className="lead">
          Fresh News started as a five-person morning briefing in 2022. Today we're a daily
          digital edition covering technology, business, culture, sport and the world — written
          by reporters who still pick up the phone.
        </p>
      </section>

      <section className="block">
        <div className="container">
          <div className="section-head">
            <h3>What We Stand For</h3>
            <span className="count">Editorial values</span>
          </div>
          <div className="columns-3">
            {values.map((value) => (
              <ValueCard key={value.num} value={value} />
            ))}
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
            {timeline.map((item) => (
              <TimelineItem key={item.year} item={item} />
            ))}
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
            {team.map((member) => (
              <TeamCard key={member.name} member={member} />
            ))}
          </div>
        </div>
      </section>

      <Newsletter idSuffix="about" />
    </main>
  );
}

export default AboutPage;
