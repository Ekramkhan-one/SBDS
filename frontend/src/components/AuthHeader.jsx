// src/components/AuthHeader.jsx
// Shared branded header for auth pages: heartbeat-in-drop logo, title, tagline.

import { Heart } from 'lucide-react';

export default function AuthHeader() {
  return (
    <div className="text-center mb-6">
      <div className="w-16 h-16 mx-auto bg-brand-red rounded-2xl flex items-center justify-center mb-3 relative">
        <svg viewBox="0 0 24 24" className="w-8 h-8 text-white" fill="currentColor">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
        <svg
          viewBox="0 0 40 16"
          className="absolute w-8 h-3 text-white/90"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M0 8 L10 8 L13 2 L17 14 L21 6 L24 8 L40 8" />
        </svg>
      </div>
      <h1 className="text-xl font-extrabold text-brand-dark leading-tight">
        SMART BLOOD
        <br />
        <span className="text-brand-red">DONATION SYSTEM</span>
      </h1>
      <div className="flex items-center justify-center gap-2 mt-1">
        <span className="h-px w-6 bg-brand-red/40" />
        <p className="text-[11px] font-semibold text-brand-red tracking-widest">FOR PESHAWAR</p>
        <span className="h-px w-6 bg-brand-red/40" />
      </div>
      <p className="text-sm text-gray-500 mt-3 flex items-center justify-center gap-1.5">
        Donate Blood, Save Lives. Be a Hero. <Heart size={13} className="text-brand-red" fill="currentColor" />
      </p>
    </div>
  );
}
