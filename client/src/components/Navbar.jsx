import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function navLinkClass(active) {
  return active
    ? "text-sm font-medium text-neutral-900"
    : "text-sm font-medium text-neutral-600 hover:text-neutral-900";
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
        className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
        onClick={closeMenu}
      >
        Create account
      </Link>
    </>
  );

  const authLinks = (
    <>
      <span className="text-sm text-neutral-600">Hi, {user?.name}</span>
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
        className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-800 hover:bg-neutral-50"
      >
        Logout
      </button>
    </>
  );

  return (
    <header className="border-b border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <Link
          to={logoPath}
          className="text-lg font-bold text-neutral-900"
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
          className="rounded-lg border border-neutral-300 p-2 text-neutral-700 md:hidden"
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
          className="flex flex-col gap-4 border-t border-neutral-200 px-6 py-4 md:hidden"
        >
          {token ? authLinks : guestLinks}
        </nav>
      )}
    </header>
  );
}

export default Navbar;
