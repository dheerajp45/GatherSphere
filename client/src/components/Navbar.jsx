import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function navLinkClass(active) {
  return active
    ? "text-sm font-semibold text-white"
    : "text-sm font-medium text-zinc-400 hover:text-white transition-colors duration-200";
}

function Navbar() {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const logoPath = token ? "/dashboard" : "/";
  const isBrowseActive =
    location.pathname === "/eventlisting" ||
    location.pathname.startsWith("/event/");

  function handleLogOut() {
    logout();
    setMenuOpen(false);
    navigate("/");
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  const guestLinks = (
    <>
      <Link
        to="/eventlisting"
        className={navLinkClass(isBrowseActive)}
        onClick={closeMenu}
      >
        Browse events
      </Link>
      <Link
        to="/login"
        className={navLinkClass(location.pathname === "/login")}
        onClick={closeMenu}
      >
        Log in
      </Link>
      <Link
        to="/register"
        className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-500 transition-colors shadow-lg shadow-violet-600/20"
        onClick={closeMenu}
      >
        Create account
      </Link>
    </>
  );

  const authLinks = (
    <>
      <span className="text-sm text-zinc-400">
        Hi, <span className="font-semibold text-zinc-200">{user?.name}</span>
      </span>
      <Link
        to="/eventlisting"
        className={navLinkClass(isBrowseActive)}
        onClick={closeMenu}
      >
        Events
      </Link>
      <Link
        to="/events/create"
        className={navLinkClass(location.pathname === "/events/create")}
        onClick={closeMenu}
      >
        Create event
      </Link>

      <button
        type="button"
        onClick={handleLogOut}
        className="rounded-lg border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
      >
        Logout
      </button>
    </>
  );

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-zinc-800/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <Link
          to={logoPath}
          className="font-display text-xl font-bold text-gradient"
          onClick={closeMenu}
        >
          GatherSphere
        </Link>

        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-6 md:flex"
        >
          {token ? authLinks : guestLinks}
        </nav>

        <button
          type="button"
          className="rounded-lg border border-zinc-700 p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors md:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            {menuOpen ? (
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M4 7h16M4 12h16M4 17h16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <nav
          aria-label="Mobile navigation"
          className="flex flex-col gap-4 border-t border-zinc-800 px-6 py-4 md:hidden bg-zinc-950/95 backdrop-blur-md"
        >
          {token ? authLinks : guestLinks}
        </nav>
      )}
    </header>
  );
}

export default Navbar;
