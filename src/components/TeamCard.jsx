function TeamCard({ member }) {
  return (
    <div className="team-card">
      <div
        className="avatar"
        style={{ "--c1": member.colors.c1, "--c2": member.colors.c2 }}
      >
        <img
          src={member.image}
          alt={member.name}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      </div>
      <h4>{member.name}</h4>
      <span className="role">{member.role}</span>
    </div>
  );
}

export default TeamCard;
