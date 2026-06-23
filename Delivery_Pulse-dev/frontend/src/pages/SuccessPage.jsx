import React from 'react';
import { useNavigate } from 'react-router-dom';

const SuccessPage = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen flex flex-col transition-colors duration-200 font-sans">

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 py-12 max-w-4xl mx-auto w-full">
        {/* Success Icon */}
        <div className="mb-6">
          <div className="bg-[#063968]/10 dark:bg-[#063968]/20 p-6 rounded-full inline-flex items-center justify-center">
            <div className="bg-[#063968] text-white p-2 rounded-full flex items-center justify-center shadow-lg shadow-[#063968]/30">
              <span className="material-icons-round text-3xl">check</span>
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-10 text-center font-sans">
          DSR submitted for the day
        </h1>

        {/* Content Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-none p-8 md:p-12 w-full shadow-sm">
          {/* Image Container */}
          <div className="w-full aspect-video flex flex-col items-center justify-center mb-10 overflow-hidden bg-slate-50 dark:bg-slate-800/50">
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#063968] via-transparent to-transparent"></div>
              <img 
                alt="3D Document with Checkmark in Brand Colors" 
                className="w-full h-full object-contain p-4" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZChrAF-uIiAYvbKI5Bdr7vq85JmmlQRPb-HHFlZegLGiZGY5ZKDnTFB1OMQHqZ4XkhYc14VmrG6A_c_wnxSsBiFi0qiV3ARZTOEm65dYDfZ5Eb4M9UV2sm2i0_8JFiZjD6xjehGQicDVGbiw8VdQyWhhliH12_oteo4OWKt_99WD2BZ_faba5omgNbzgtv5JnOq6auDEukr0rSPOfd4JWHKzQSYna5E4TZJPj38d6fn3mhCwdHFweLSbkHJeZ8lDl-oh86Q56igM"
              />
            </div>
          </div>

          {/* Message */}
          <div className="text-center max-w-lg mx-auto mb-10">
            <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed font-sans">
              Great job! Your daily status has been logged successfully. Your manager has been notified of your progress.
            </p>
          </div>

          {/* Action Links */}
          <div className="flex flex-col items-center space-y-6">
            <button
              onClick={() => navigate('/history')}
              className="text-[#063968] hover:underline font-semibold text-sm flex items-center space-x-1 group font-sans"
            >
              <span>View Submission History</span>
              <span className="material-icons-round text-base transition-transform group-hover:translate-x-1">arrow_forward</span>
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-200 dark:border-slate-800 text-center font-sans">
        <p className="text-slate-400 dark:text-slate-500 text-sm">
          © 2026 Delivery Pulse. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default SuccessPage;
