import { FaFacebook, FaInstagram, FaTwitter, FaPinterest, FaLinkedin, FaYoutube, FaGithub, FaWhatsapp } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import Jobs from "../../pages/candidates/jobs/Jobs";

import "./foot.css";

export default function Footer() {
  const user = useSelector(state => state.auth.user)
  const homeLink = user
    ? user.role === "candidate"
      ? "/candidate/home"
      : "/recruiter/home"
    : "/";
  
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* About */}
        <div className="footer-section">
          <h5>About Us</h5>
          <p>
            Jobs_Placements has been serving Job lovers since 1995.
            We're passionate about connecting workers with great Jobs.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h5>Quick Links</h5>
          <ul>
            <li><NavLink to={homeLink}>Home</NavLink></li>
            <li><NavLink to="/jobs">Jobs</NavLink></li>
            <li><NavLink to="/about">About</NavLink></li>
            <li><NavLink to="/contact">Contact</NavLink></li>
          </ul>
        </div>

        {/* Customer Service */}
        <div className="footer-section">
          <h5>Customer Service</h5>
          <ul>
            <li><NavLink to="/faq">FAQs</NavLink></li>
            <li><NavLink to="/privacy-policy">Privacy Policy</NavLink></li>
            <li><NavLink to="/blogs">Blogs</NavLink></li>
          
          </ul>
        </div>

        {/* Social + Contact */}
        <div className="footer-section">
          <h5>Connect With Us</h5>
          <div className="footer-social">
            <NavLink to="#"><FaFacebook /></NavLink>
            <NavLink to="#"><FaInstagram /></NavLink>
            <NavLink to="#"><FaTwitter /></NavLink>
            <NavLink to="#"><FaPinterest /></NavLink>
            <NavLink to="#"><FaLinkedin /></NavLink>
            <NavLink to="#"><FaYoutube /></NavLink>
            <NavLink to="#"><FaGithub /></NavLink>
            <NavLink to="#"><FaWhatsapp /></NavLink>
          </div>
          <p>
            123 Company Street <br />
            Literary City, LC 12345 <br />
            Phone: (123) 456-7890
          </p>
        </div>

      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} Jobs_Placements. All rights reserved.
      </div>
    </footer>
  );
}
