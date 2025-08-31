// src/components/Footer.jsx
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <p>
        © {new Date().getFullYear()} EduHaven ·{" "}
        <Link to="/privacy" className="footer-link">
          Privacy Policy
        </Link>
      </p>
    </footer>
  );
}
