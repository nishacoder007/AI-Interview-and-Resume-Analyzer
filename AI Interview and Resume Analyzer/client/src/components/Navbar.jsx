import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Menu, Sparkles, User, LogOut } from 'lucide-react';

const Navbar = ({ toggleSidebar }) => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const isDashboardArea = isAuthenticated && location.pathname !== '/';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className={`sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-darkBorder bg-darkBg/80 px-6 backdrop-blur-md`}>
      <div className="flex items-center gap-4">
        {/* Toggle Hamburger on Dashboard Mobile view */}
        {isDashboardArea && (
          <button 
            onClick={toggleSidebar} 
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-200 md:hidden"
            aria-label="Toggle menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        )}

        {/* Public Logo */}
        {!isDashboardArea && (
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-neon shadow-lg shadow-indigo-500/20">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white">
              Elevate<span className="text-indigo-400">AI</span>
            </span>
          </Link>
        )}

        {/* Dynamic Section Title on Dashboard */}
        {isDashboardArea && (
          <h2 className="text-lg font-bold text-slate-100 hidden sm:block">
            {location.pathname === '/dashboard' && 'Candidate Dashboard'}
            {location.pathname === '/upload' && 'ATS Resume Analyzer'}
            {location.pathname.startsWith('/resume-result') && 'ATS Analysis Report'}
            {location.pathname === '/interview' && 'AI Mock Interview'}
            {location.pathname === '/profile' && 'Analytics Profile'}
            {location.pathname === '/settings' && 'Account Settings'}
          </h2>
        )}
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center gap-4">
        {!isDashboardArea ? (
          // Public Navigation Links
          <>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
              <Link to="/" className="hover:text-white transition">Home</Link>
              <a href="#features" className="hover:text-white transition">Features</a>
              <a href="#about" className="hover:text-white transition">About</a>
            </nav>
            
            {!isAuthPage && (
              <div className="flex items-center gap-3">
                {isAuthenticated ? (
                  <Link 
                    to="/dashboard" 
                    className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-600/10 hover:bg-indigo-500 transition button-glow"
                  >
                    Go to Dashboard
                  </Link>
                ) : (
                  <>
                    <Link to="/login" className="text-sm font-semibold text-slate-300 hover:text-white transition px-3 py-2">
                      Sign In
                    </Link>
                    <Link 
                      to="/register" 
                      className="rounded-xl bg-gradient-neon px-4 py-2 text-sm font-semibold text-white shadow-lg hover:opacity-95 transition button-glow"
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            )}
          </>
        ) : (
          // Dashboard Right controls
          <div className="flex items-center gap-4">
            <span className="hidden lg:block text-xs font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/25 px-2.5 py-1 rounded-full">
              PRO ACCOUNT
            </span>
            
            <div className="flex items-center gap-2 border-l border-darkBorder pl-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-slate-300 border border-darkBorder font-medium text-xs">
                {user?.name ? user.name[0].toUpperCase() : 'U'}
              </div>
              <span className="hidden sm:block text-xs font-medium text-slate-300 truncate max-w-[100px]">
                {user?.name}
              </span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
