function ValueCard({ value }) {
  return (
    <div className="col-item">
      <span className="num">{value.num}</span>
      <h4>{value.title}</h4>
      <p>{value.body}</p>
    </div>
  );
}

export default ValueCard;
