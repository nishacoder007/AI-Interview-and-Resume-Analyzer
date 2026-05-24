import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowRight, Sparkles } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const NotFound = () => {
  return (
    <div className="flex min-h-screen flex-col bg-darkBg overflow-hidden">
      <Navbar />

      <main className="flex-grow flex flex-col items-center justify-center px-6 text-center relative z-10">
        
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[350px] w-[350px] rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none"></div>

        <div className="space-y-6 max-w-md">
          {/* Glowing Warning */}
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/25 shadow-lg animate-pulse-slow">
            <ShieldAlert className="h-8 w-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl font-extrabold text-white tracking-tight">404 - Page Out of Bounds</h1>
            <p className="text-sm font-semibold text-slate-400 leading-relaxed max-w-xs mx-auto">
              The neural page coordinates you requested are outside the mapped application routers.
            </p>
          </div>

          <div className="pt-2">
            <Link 
              to="/dashboard" 
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-neon px-6 py-3 font-bold text-white shadow-xl hover:opacity-95 transition button-glow"
            >
              <span>Return to Dashboard</span>
              <ArrowRight className="h-4.5 w-4.5" />
            </Link>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
};

export default NotFound;
