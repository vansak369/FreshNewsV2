import { Link } from "react-router-dom";

function AuthBrandHeader() {
  return (
    <Link to="/" className="auth-brand">
      Today<span className="auth-brand-dot">●</span>NEWS
    </Link>
  );
}

export default AuthBrandHeader;
