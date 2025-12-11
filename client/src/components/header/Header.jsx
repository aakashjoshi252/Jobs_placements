import { IoJournal } from "react-icons/io5";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../redux/slices/authSlice";

export default function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const company = useSelector((state) => state.auth.company);
  console.log("Company Data in Header:", company);
  const logoutHandler = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      dispatch(logoutUser());
      navigate("/login");
    }
  };

  return (
    <header className="bg-gray-900 shadow-sm fixed top-0 left-0 w-full z-50 ">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        
        {/* Logo */}
        <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-100 cursor-pointer">
          <IoJournal className="text-3xl" /> Jobs_P
        </h2>

        {/* Mobile Hamburger Icon */}
        <button
          className="md:hidden flex flex-col gap-1.5"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className={`w-6 h-0.5 bg-gray-100 transition ${menuOpen ? "rotate-45 translate-y-1.5" : ""}`}></span>
          <span className={`w-6 h-0.5 bg-gray-100 transition ${menuOpen ? "opacity-0" : ""}`}></span>
          <span className={`w-6 h-0.5 bg-gray-100 transition ${menuOpen ? "-rotate-45 -translate-y-1.5" : ""}`}></span>
        </button>

        {/* NAV LINKS */}
        <ul
          className={`md:flex md:static absolute top-full left-0 w-full md:w-auto shadow-md md:shadow-none flex-col md:flex-row items-start md:items-center gap-5 px-6 py-4 md:p-0 transition-all duration-300
          ${menuOpen ? "opacity-100 visible" : "opacity-0 invisible md:visible md:opacity-100"}`}
          onClick={() => setMenuOpen(false)}
        >
          {/* Show Home only if user NOT logged in */}
          {!user && (
            <li>
              <NavLink to="/"
                className="block py-2 text-gray-100 hover:text-blue-600 font-medium"
              >
                Home
              </NavLink>
            </li>
          )}

          <li>
            <NavLink to="/about"
              className="block py-2 text-gray-100 hover:text-blue-600 font-medium"
            >
              About
            </NavLink>
          </li>

          {/* Contact or Dashboard based on login */}
          {!user ? (
            <li>
              <NavLink
                to="/contact"
                className="block py-2 text-gray-100 hover:text-blue-600 font-medium"
              >
                Contact
              </NavLink>
            </li>
          ) : (
            <li>
              <NavLink
                to={`/${user.role}/home`}
                className="block py-2 text-gray-100 hover:text-blue-600 font-medium"
              >
                Dashboard
              </NavLink>
            </li>
          )}

          {/* Login or Profile Dropdown */}
          {!user ? (
            <li>
              <NavLink
                to="/login"
                className="block py-2 text-gray-100 hover:text-blue-600 font-semibold"
              >
                Login
              </NavLink>
            </li>
          ) : (
            <li className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
              <NavLink
                to={`/${user.role}/profile`}
                className="text-gray-100 font-semibold hover:text-blue-600"
              >
                {user.username || user.email}
              </NavLink>
              <button
                onClick={logoutHandler}
                className="text-gray-100 text-sm px-3 py-1 rounded-md hover:bg-red-900"
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
