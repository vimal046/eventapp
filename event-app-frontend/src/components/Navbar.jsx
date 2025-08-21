import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:supports-[backdrop-filter]:bg-gray-900/60 bg-white dark:bg-gray-900 shadow sticky top-0 z-10 border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold">
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Event Booking
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <NavLink
            to="/events"
            className={({ isActive }) => (isActive ? "underline" : "")}
          >
            Events
          </NavLink>
          {user?.role === "ADMIN" && (
            <NavLink
              to="/admin"
              className={({ isActive }) => (isActive ? "underline" : "")}
            >
              Admin
            </NavLink>
          )}
          {user ? (
            <>
              <NavLink
                to="/bookings"
                className={({ isActive }) => (isActive ? "underline" : "")}
              >
                My Bookings
              </NavLink>
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Hi, {user.name}
              </span>
              <button
                className="btn btn-danger"
                onClick={() => {
                  logout();
                  navigate("/");
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) => (isActive ? "underline" : "")}
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) => (isActive ? "underline" : "")}
              >
                Register
              </NavLink>
            </>
          )}
          <button
            aria-label="Toggle theme"
            className="btn border border-gray-200 dark:border-gray-700"
            onClick={toggleTheme}
            title={theme === "dark" ? "Switch to light" : "Switch to dark"}
          >
            {theme === "dark" ? "🌙" : "☀️"}
          </button>
        </div>
      </div>
    </nav>
  );
}
