import { IoJournal } from "react-icons/io5";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout as logoutAction } from "../../redux/slices/authSlice"; // Rename import
import { userApi } from "../../api/api";

export default function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);
  const user = useSelector((state) => state.auth.user);

  // Renamed to avoid collision
  const handleLogout = async () => {
    if (!window.confirm("Are you sure you want to logout?")) return;
    
    try {
      await userApi.post("/logout");
      dispatch(logoutAction()); // Now calls Redux action
      // Clear specific auth items only
      localStorage.removeItem('token'); // Adjust key as per your storage
      sessionStorage.removeItem('token'); // Adjust key as per your storage
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      navigate("/login");
    }
  };

  return (
    <header className="bg-gray-900 shadow-sm fixed top-0 left-0 w-full z-50">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2 text-2xl font-bold text-gray-100">
          <IoJournal className="text-3xl" /> Jobs_P
        </NavLink>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden flex flex-col gap-1.5"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className={`w-6 h-0.5 bg-gray-100 transition ${menuOpen ? "rotate-45 translate-y-1.5" : ""}`} />
          <span className={`w-6 h-0.5 bg-gray-100 transition ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`w-6 h-0.5 bg-gray-100 transition ${menuOpen ? "-rotate-45 -translate-y-1.5" : ""}`} />
        </button>

        {/* Links - Close menu only on link clicks via event bubbling control */}
        <ul
          className={`md:flex md:static absolute top-full left-0 w-full md:w-auto bg-gray-900 md:bg-transparent
            flex-col md:flex-row gap-5 px-6 py-4 md:p-0 transition-all duration-300
            ${menuOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2 md:opacity-100 md:visible md:translate-y-0"}`}
        >
          <li>
            <NavLink 
              to="/" 
              className="text-gray-100 hover:text-blue-600 block py-2"
              onClick={() => setMenuOpen(false)} // Close on specific link clicks only
            >
              Home
            </NavLink>
          </li>

          <li>
            <NavLink to="/about" className="text-gray-100 hover:text-blue-600 block py-2" onClick={() => setMenuOpen(false)}>
              About
            </NavLink>
          </li>

          <li>
            <NavLink to="/jobs" className="text-gray-100 hover:text-blue-600 block py-2" onClick={() => setMenuOpen(false)}>
              Jobs
            </NavLink>
          </li>

          {!user ? (
            <li>
              <NavLink to="/contact" className="text-gray-100 hover:text-blue-600 block py-2" onClick={() => setMenuOpen(false)}>
                Contact
              </NavLink>
            </li>
          ) : (
            <li>
              <NavLink to={`/${user.role}/home`} className="text-gray-100 hover:text-blue-600 block py-2" onClick={() => setMenuOpen(false)}>
                Dashboard
              </NavLink>
            </li>
          )}

          {!user ? (
            <li>
              <NavLink to="/login" className="text-gray-100 font-semibold block py-2" onClick={() => setMenuOpen(false)}>
                Login
              </NavLink>
            </li>
          ) : (
            <li className="flex flex-col sm:flex-row items-start sm:items-center gap-3 py-2">
              <NavLink
                to={`/${user.role}/profile`}
                className="text-gray-100 font-semibold hover:text-blue-600"
                onClick={() => setMenuOpen(false)}
              >
                {user.username || user.email}
              </NavLink>
              <button
                onClick={handleLogout}
                className="text-sm px-3 py-1 rounded-md text-white hover:bg-red-700 bg-red-600"
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
