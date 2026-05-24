import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  FileText, 
  MessageSquareCode, 
  User, 
  Settings, 
  LogOut,
  Sparkles
} from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'ATS Resume Analyzer', path: '/upload', icon: FileText },
    { name: 'AI Mock Interview', path: '/interview', icon: MessageSquareCode },
    { name: 'Profile Analytics', path: '/profile', icon: User },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 md:hidden backdrop-blur-sm"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-64 flex-col border-r border-darkBorder bg-darkCard/90 backdrop-blur-md transition-transform duration-300 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo Section */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-darkBorder">
          <div className="flex items-center gap-2" onClick={() => navigate('/dashboard')}>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-neon shadow-lg shadow-indigo-500/20">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white font-sans">
              Elevate<span className="text-indigo-400">AI</span>
            </span>
          </div>
        </div>

        {/* User Card */}
        {user && (
          <div className="p-4 mx-4 mt-6 rounded-2xl border border-darkBorder bg-darkBg/50">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-400 font-bold border border-indigo-500/25">
                {user.name ? user.name[0].toUpperCase() : 'U'}
              </div>
              <div className="overflow-hidden">
                <p className="font-semibold text-sm text-slate-100 truncate">{user.name}</p>
                <p className="text-xs text-slate-400 truncate">{user.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1.5 px-4 py-6 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => {
                  if (window.innerWidth < 768) toggleSidebar();
                }}
                className={({ isActive }) =>
                  `flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/15'
                      : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-100'
                  }`
                }
              >
                <Icon className="h-4.5 w-4.5 shrink-0" />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        {/* Logout Trigger */}
        <div className="p-4 border-t border-darkBorder">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-medium text-red-400 transition-all duration-200 hover:bg-red-500/10 hover:text-red-300"
          >
            <LogOut className="h-4.5 w-4.5 shrink-0" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
