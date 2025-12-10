import { IoJournal } from "react-icons/io5";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../redux/slices/authSlice";

import "./head.css";

export default function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);
  const user = useSelector((state) => state.auth.user); //  Redux user state
  const logoutHandler = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      dispatch(logoutUser()); //  clear Redux + localStorage
      navigate("/login");
    }
  };
  return (
    <header className="main-header">
      <nav className="navbar">
        {/* Logo */}
        <h2 className="logo"><IoJournal className="logo-icon" /> Jobs_P</h2>
        {/* Hamburger Icon */}
        <div className={`hamburger ${menuOpen ? "active" : ""}`} onClick={() => setMenuOpen(!menuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </div>
        {/* Navigation Links */}
        <ul className={`nav-links ${menuOpen ? "open" : ""}`} onClick={() => setMenuOpen(false)}>
          {!user && <li><NavLink to="/">Home</NavLink></li>}

          <li><NavLink to="/about">About</NavLink></li>
          {!user ? (
            <li><NavLink to="/contact">Contact</NavLink></li>
          ) : (
            <li><NavLink to={`/${user.role}/home`}>Dashboard</NavLink></li>
          )}
          {!user ? (
            <li><NavLink to="/login">Login</NavLink></li>
          ) : (
            <li className="user-menu">
              <NavLink className="user-name" to={`/${user.role}/profile`}>
                {user.username || user.email}
              </NavLink>
              <button className="dropdown" onClick={logoutHandler}>Logout</button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}
