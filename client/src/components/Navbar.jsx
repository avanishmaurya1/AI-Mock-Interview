 import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [token, setToken] = useState(
    localStorage.getItem("token")
  );

  // Update navbar whenever route changes
  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);

    navigate("/login", { replace: true });
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/95 px-4 py-4 text-white backdrop-blur sm:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between">

        {/* Brand */}
        <Link
          to="/"
          className="text-xl font-bold tracking-tight text-white transition hover:text-blue-400 sm:text-2xl"
        >
          AI Mock Interview
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-3 sm:gap-6">

          {/* Home */}
          <Link
            to="/"
            className="text-sm font-medium text-slate-400 transition hover:text-blue-400 sm:text-base"
          >
            Home
          </Link>

          {token ? (
            <>
              {/* Dashboard */}
              <Link
                to="/dashboard"
                className="text-sm font-medium text-slate-400 transition hover:text-blue-400 sm:text-base"
              >
                Dashboard
              </Link>

              {/* Interview */}
              <Link
                to="/interview"
                className="text-sm font-medium text-slate-400 transition hover:text-blue-400 sm:text-base"
              >
                Interview
              </Link>

              {/* Profile */}
              <Link
                to="/profile"
                className="text-sm font-medium text-slate-400 transition hover:text-blue-400 sm:text-base"
              >
                Profile
              </Link>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm font-medium text-slate-300 transition hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400 sm:px-4"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              {/* Login */}
              <Link
                to="/login"
                className="text-sm font-medium text-slate-400 transition hover:text-blue-400 sm:text-base"
              >
                Login
              </Link>

              {/* Register */}
              <Link
                to="/register"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500"
              >
                Register
              </Link>
            </>
          )}

        </div>
      </div>
    </nav>
  );
}

export default Navbar;