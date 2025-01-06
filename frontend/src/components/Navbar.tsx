import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const Navbar = () => {
  const { isAuthenticated, username, logout } = useAuth();

  return (
    <nav className="bg-secondary py-4 px-6 mb-8">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-accent font-mono text-xl font-bold">
          moositype
        </Link>
        <div className="flex items-center space-x-6 font-mono">
          <Link
            to="/leaderboard"
            className="text-text-darker hover:text-text transition-colors"
          >
            leaderboard
          </Link>
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className="text-text-darker hover:text-text transition-colors"
              >
                dashboard
              </Link>
              <span className="text-accent">{username}</span>
              <button
                onClick={logout}
                className="text-text-darker hover:text-text transition-colors"
              >
                logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/signup"
                className="text-text-darker hover:text-text transition-colors"
              >
                signup
              </Link>
              <Link
                to="/login"
                className="text-text-darker hover:text-text transition-colors"
              >
                login
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
