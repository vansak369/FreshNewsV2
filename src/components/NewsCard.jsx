function NewsCard({ story }) {
  const { image, mark, colors, tag, tagVariant, headline, excerpt, byline } = story;

  return (
    <article className="card">
      <div
        className="card-thumb"
        data-mark={mark}
        style={{ "--c1": colors.c1, "--c2": colors.c2 }}
      >
        <img
          src={image}
          alt={tag}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      </div>
      <span className={`tag${tagVariant === "gold" ? " gold" : ""}`}>{tag}</span>
      <h4>{headline}</h4>
      <p>{excerpt}</p>
      <p className="byline">{byline}</p>
    </article>
  );
}

export default NewsCard;
