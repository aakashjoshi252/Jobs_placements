import { IoJournal } from "react-icons/io5";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/authSlice";

export default function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);

  const user = useSelector((state) => state.auth.user);

  //  JWT logout (frontend only)
  const handleLogout = () => {
    if (!window.confirm("Are you sure you want to logout?")) return;

    dispatch(logout());
    navigate("/login");
  };

  return (
    <header className="bg-gradient-navy shadow-navy-lg fixed top-0 left-0 w-full z-50">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <NavLink
          to="/"
          className="flex items-center gap-2 text-2xl font-bold text-white hover:text-teal-200 transition-colors"
        >
          <IoJournal className="text-3xl" /> Jobs_P
        </NavLink>

        {/* Mobile Menu */}
        <button
          className="md:hidden flex flex-col gap-1.5"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span
            className={`w-6 h-0.5 bg-white transition ${
              menuOpen ? "rotate-45 translate-y-1.5" : ""
            }`}
          />
          <span
            className={`w-6 h-0.5 bg-white transition ${
              menuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`w-6 h-0.5 bg-white transition ${
              menuOpen ? "-rotate-45 -translate-y-1.5" : ""
            }`}
          />
        </button>

        {/* Links */}
        <ul
          className={`md:flex md:static absolute top-full left-0 w-full md:w-auto bg-navy-600 md:bg-transparent
          flex-col md:flex-row gap-5 px-6 py-4 md:p-0 transition
          ${
            menuOpen
              ? "opacity-100 visible"
              : "opacity-0 invisible md:visible md:opacity-100"
          }`}
          onClick={() => setMenuOpen(false)}
        >
          {!user && (
            <li>
              <NavLink to="/" className="text-white hover:text-teal-300 transition-colors font-medium">
                Home
              </NavLink>
            </li>
          )}

          <li>
            <NavLink to="/about" className="text-white hover:text-teal-300 transition-colors font-medium">
              About
            </NavLink>
          </li>

          <li>
            <NavLink to="/jobs" className="text-white hover:text-teal-300 transition-colors font-medium">
              Jobs
            </NavLink>
          </li>
          
          {!user ? (
            <li>
              <NavLink
                to="/contact"
                className="text-white hover:text-teal-300 transition-colors font-medium"
              >
                Contact
              </NavLink>
            </li>
          ) : (
            <li>
              <NavLink
                to={`/${user.role}/home`}
                className="text-white hover:text-teal-300 transition-colors font-medium"
              >
                Dashboard
              </NavLink>
            </li>
          )}

          {!user ? (
            <li>
              <NavLink 
                to="/login" 
                className="bg-coral-500 hover:bg-coral-600 text-white px-5 py-2 rounded-lg font-semibold shadow-coral transition-all hover:scale-105"
              >
                Login
              </NavLink>
            </li>
          ) : (
            <li className="flex items-center gap-3">
              <NavLink
                to={`/${user.role}/profile`}
                className="text-white font-semibold hover:text-teal-300 transition-colors"
              >
                {user.username || user.email}
              </NavLink>
              <button
                onClick={handleLogout}
                className="text-sm px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium shadow-lg transition-all hover:scale-105"
              >
                Logout
              </button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}
