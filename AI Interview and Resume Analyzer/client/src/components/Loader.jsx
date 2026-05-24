import React from 'react';
import { Sparkles } from 'lucide-react';

const Loader = ({ message = 'AI is processing details...', fullScreen = false }) => {
  const content = (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="relative mb-6 flex h-16 w-16 items-center justify-center">
        {/* Ring Glows */}
        <div className="absolute inset-0 animate-ping rounded-full bg-indigo-500/10 opacity-75"></div>
        <div className="absolute -inset-1 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent opacity-80"></div>
        <div className="absolute -inset-3 animate-spin rounded-full border border-dashed border-purple-500/30 opacity-55 [animation-duration:6s]"></div>
        
        {/* Sparkles Icon */}
        <div className="z-10 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-neon shadow-lg shadow-indigo-500/30">
          <Sparkles className="h-6 w-6 text-white animate-pulse" />
        </div>
      </div>
      
      <h3 className="font-extrabold text-lg text-slate-100 tracking-tight">{message}</h3>
      <p className="mt-2 max-w-xs text-xs font-medium text-slate-400 leading-relaxed animate-pulse">
        This might take a moment. Our specialized neural network is mapping patterns and rendering insights.
      </p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-darkBg/95 backdrop-blur-md">
        {content}
      </div>
    );
  }

  return (
    <div className="flex h-64 items-center justify-center rounded-3xl border border-darkBorder bg-darkCard/50 backdrop-blur-sm">
      {content}
    </div>
  );
};

export default Loader;
