import React from 'react';
import { Sparkles } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-darkBorder bg-darkBg px-6 py-8">
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-neon shadow-lg">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="font-extrabold text-md tracking-tight text-white">
            Elevate<span className="text-indigo-400">AI</span>
          </span>
        </div>

        {/* Copy */}
        <p className="text-xs text-slate-500 text-center md:text-left">
          © {new Date().getFullYear()} ElevateAI Platform. Engineered with premium MERN stack architecture. All rights reserved.
        </p>

        {/* Links */}
        <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
          <a href="#" className="hover:text-white transition">Privacy Policy</a>
          <span className="text-slate-700">•</span>
          <a href="#" className="hover:text-white transition">Terms of Service</a>
          <span className="text-slate-700">•</span>
          <a href="#" className="hover:text-white transition">Support</a>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
