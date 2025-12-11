import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaPinterest,
  FaLinkedin,
  FaYoutube,
  FaGithub,
  FaWhatsapp,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Footer() {
  const user = useSelector((state) => state.auth.user);

  const homeLink = user
    ? user.role === "candidate"
      ? "/candidate/home"
      : "/recruiter/home"
    : "/";

  return (
    <footer className="bg-gray-900 text-gray-300 py-10 mt-10">
      <div className="max-w-7xl mx-auto px-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        
        {/* About */}
        <div>
          <h5 className="text-lg font-semibold text-white mb-3">About Us</h5>
          <p className="text-sm leading-relaxed">
            Jobs_Placements has been serving Job lovers since 1995.
            We're passionate about connecting workers with great Jobs.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h5 className="text-lg font-semibold text-white mb-3">Quick Links</h5>
          <ul className="space-y-2 text-sm">
            <li><NavLink to={homeLink} className="hover:text-white">Home</NavLink></li>
            <li><NavLink to="/jobs" className="hover:text-white">Jobs</NavLink></li>
            <li><NavLink to="/about" className="hover:text-white">About</NavLink></li>
            <li><NavLink to="/contact" className="hover:text-white">Contact</NavLink></li>
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h5 className="text-lg font-semibold text-white mb-3">Customer Service</h5>
          <ul className="space-y-2 text-sm">
            <li><NavLink to="/faq" className="hover:text-white">FAQs</NavLink></li>
            <li><NavLink to="/privacy-policy" className="hover:text-white">Privacy Policy</NavLink></li>
            <li><NavLink to="/blogs" className="hover:text-white">Blogs</NavLink></li>
          </ul>
        </div>

        {/* Social + Contact */}
        <div>
          <h5 className="text-lg font-semibold text-white mb-3">Connect With Us</h5>
          <div className="flex items-center flex-wrap gap-4 text-xl mb-4">
            <NavLink to="#" className="hover:text-white"><FaFacebook /></NavLink>
            <NavLink to="#" className="hover:text-white"><FaInstagram /></NavLink>
            <NavLink to="#" className="hover:text-white"><FaTwitter /></NavLink>
            <NavLink to="#" className="hover:text-white"><FaPinterest /></NavLink>
            <NavLink to="#" className="hover:text-white"><FaLinkedin /></NavLink>
            <NavLink to="#" className="hover:text-white"><FaYoutube /></NavLink>
            <NavLink to="#" className="hover:text-white"><FaGithub /></NavLink>
            <NavLink to="#" className="hover:text-white"><FaWhatsapp /></NavLink>
          </div>

          <p className="text-sm">
            123 Company Street <br />
            Literary City, LC 12345 <br />
            Phone: (123) 456-7890
          </p>
        </div>

      </div>

      {/* Bottom */}
      <div className="text-center text-gray-500 text-sm mt-10 border-t border-gray-700 pt-4">
        © {new Date().getFullYear()} Jobs_Placements. All rights reserved.
      </div>
    </footer>
  );
}
