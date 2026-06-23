import { useState, useRef, useEffect } from "react";
import { Link } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo / App Name – unchanged */}
        <Link to="/dsr" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <div className="bg-primary h-8 w-8 flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-xl leading-none">description</span>
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-800 dark:text-white font-sans">
            Delivery Pulse
          </span>
        </Link>

        {/* User dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center gap-3 px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <div className="h-8 w-8 bg-slate-200 dark:bg-slate-700 flex items-center justify-center overflow-hidden border border-slate-300 dark:border-slate-600">
              <span className="material-symbols-outlined text-slate-500 dark:text-slate-400 text-xl">person</span>
            </div>
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              {user?.name || 'User'}
            </span>
            <svg
              className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg overflow-hidden z-50">
              {/* <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700">
                <p className="text-xs text-slate-500 dark:text-slate-400">Signed in as</p>
                <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">
                  {user?.name || 'User'}
                </p>
              </div> */}
                {/* Go to Admin */}
  <Link
    to="/admin"
    onClick={() => setDropdownOpen(false)}
    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
  >
    <span className="material-symbols-outlined text-lg">admin_panel_settings</span>
    Go to Admin
  </Link>
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  onLogout?.();
                }}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <span className="material-symbols-outlined text-lg">logout</span>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;