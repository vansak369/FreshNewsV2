function TimelineItem({ item }) {
  return (
    <div className="t-item">
      <span className="yr">{item.year}</span>
      <h4>{item.title}</h4>
      <p>{item.body}</p>
    </div>
  );
}

export default TimelineItem;
