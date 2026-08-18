function Hero({ story }) {
  return (
    <section className="hero container">
      <div className="hero-media" aria-hidden="true">
        <img
          src={story.image}
          alt="Featured story image"
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      </div>
      <div className="hero-content">
        <span className="tag">{story.tag}</span>
        <h2>{story.headline}</h2>
        <p className="dek">{story.dek}</p>
        <p className="byline">{story.byline}</p>
      </div>
    </section>
  );
}

export default Hero;
