import React, { useState, useEffect } from 'react';
import API from '../services/api';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import toast, { Toaster } from 'react-hot-toast';
import { 
  Settings as SettingsIcon, 
  Database, 
  Trash2, 
  Sparkles,
  ShieldCheck,
  Check,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

const Settings = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dbMode, setDbMode] = useState('Checking...');
  const [darkMode, setDarkMode] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    const checkDb = async () => {
      try {
        const res = await API.get('/');
        setDbMode(res.data.mode || 'MERN Database Mode');
      } catch (err) {
        setDbMode('Local Offline Fallback Mode');
      }
    };
    checkDb();
  }, []);

  const handleToggleTheme = () => {
    setDarkMode(!darkMode);
    toast.success('System theme settings updated! Dark mode remains default for optimal contrast.');
  };

  const handleClearCache = () => {
    if (!window.confirm('WARNING: Wiping cache details will delete mock scores if using the local fallback. Proceed?')) {
      return;
    }
    
    // Simulating clear cache trigger or let local storage be wiped
    localStorage.removeItem('resume');
    localStorage.removeItem('interview');
    toast.success('Local browser diagnostic storage cleared successfully!');
  };

  return (
    <div className="flex min-h-screen bg-darkBg">
      <Toaster position="top-right" toastOptions={{
        style: { background: '#121829', color: '#f8fafc', border: '1px solid #1f293d' }
      }} />

      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="flex flex-1 flex-col md:pl-64">
        <Navbar toggleSidebar={toggleSidebar} />

        <main className="flex-grow p-6 max-w-4xl w-full mx-auto space-y-6 flex flex-col justify-center">
          
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <SettingsIcon className="h-7 w-7 text-indigo-400" />
            Account Settings
          </h1>
          <p className="text-sm font-semibold text-slate-400 mt-1">Configure workspace preferences and database connections.</p>

          <div className="glass-panel rounded-3xl p-8 space-y-8 max-w-2xl w-full mx-auto">
            
            {/* Setting item 1: Theme */}
            <div className="flex items-center justify-between border-b border-darkBorder pb-6">
              <div>
                <h3 className="font-extrabold text-base text-slate-100">Premium Dark Mode</h3>
                <p className="text-xs text-slate-400 mt-1 font-medium max-w-sm">
                  Utilize Slate backgrounds with glowing indigo buttons. Highly recommended to reduce eye strain.
                </p>
              </div>
              <button onClick={handleToggleTheme} className="text-indigo-400 hover:text-indigo-300 transition">
                {darkMode ? <ToggleRight className="h-10 w-10" /> : <ToggleLeft className="h-10 w-10 text-slate-500" />}
              </button>
            </div>

            {/* Setting item 2: DB Connection */}
            <div className="flex items-start justify-between border-b border-darkBorder pb-6 gap-4">
              <div className="space-y-1">
                <h3 className="font-extrabold text-base text-slate-100 flex items-center gap-2">
                  <Database className="h-4.5 w-4.5 text-indigo-400" />
                  Database Diagnostics Status
                </h3>
                <p className="text-xs text-slate-400 font-medium max-w-sm">
                  Detects active Mongo Atlas connection strings. Switched to offline file stores automatically when credentials are missing.
                </p>
              </div>
              
              <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border shrink-0 ${
                dbMode.includes('Fallback')
                  ? 'text-yellow-400 bg-yellow-500/10 border-yellow-500/25'
                  : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25'
              }`}>
                {dbMode}
              </span>
            </div>

            {/* Setting item 3: Clear Fallback database */}
            <div className="flex items-center justify-between pb-2">
              <div>
                <h3 className="font-extrabold text-base text-slate-100">Clear Cache Details</h3>
                <p className="text-xs text-slate-400 mt-1 font-medium max-w-sm">
                  Wipes browser storage markers. Useful to recalibrate baseline capability indicators.
                </p>
              </div>
              <button 
                onClick={handleClearCache}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-400 hover:text-red-300 bg-red-500/10 px-4 py-2.5 rounded-xl border border-red-500/20"
              >
                <Trash2 className="h-4.5 w-4.5" />
                Clear Cache
              </button>
            </div>

          </div>

        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export default Settings;
