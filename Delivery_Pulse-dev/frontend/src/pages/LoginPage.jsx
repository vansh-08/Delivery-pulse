import React from 'react';
 
 const LoginPage = () => {
  const handleMicrosoftLogin = () => {
    // Redirect to backend OAuth endpoint
    window.location.href = 'http://localhost:3000/auth/login';
  };
  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen flex flex-col font-sans">
      {/* Header */}
      <header className="w-full h-16 px-6 flex items-center bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="bg-primary p-2 flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-xl block">description</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Delivery Pulse</span>
        </div>
      </header>
 
      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 py-12">
        {/* Title Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-slate-900 dark:text-white tracking-tight">
            Daily Status Report
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 font-medium">
            Professional monitoring for high-performance teams.
          </p>
        </div>
 
        {/* Login Card */}
        <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-none shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 p-8 md:p-10 transform transition-all hover:scale-[1.01]">
          <div className="flex flex-col items-center text-center">
            {/* Icon with Badge */}
            <div className="mb-8 relative">
              <div className="w-24 h-24 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center border-4 border-white dark:border-slate-800 shadow-inner">
                <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 text-5xl">shield</span>
              </div>
              <div className="absolute -bottom-1 -right-1 bg-primary w-8 h-8 rounded-full border-4 border-white dark:border-slate-800 flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-[16px]">lock</span>
              </div>
            </div>
 
            {/* Text */}
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">
              Secure Authentication
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mb-10 leading-relaxed text-sm">
              Log in using your corporate credentials to sync reports and access your dashboard.
            </p>
 
            {/* Microsoft Login Button */}
            <button
              onClick={handleMicrosoftLogin}
              className="w-full bg-primary hover:bg-[#052d52] text-white font-semibold py-4 px-6 rounded-none flex items-center justify-center gap-3 transition-colors duration-200 shadow-lg shadow-primary/20"
            >
              <svg className="w-5 h-5" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
                <rect fill="#f25022" height="10" width="10" x="0" y="0"></rect>
                <rect fill="#7fbb00" height="10" width="10" x="11" y="0"></rect>
                <rect fill="#00a1f1" height="10" width="10" x="0" y="11"></rect>
                <rect fill="#ffbb00" height="10" width="10" x="11" y="11"></rect>
              </svg>
              <span>Continue with Microsoft</span>
            </button>
 
            <p className="mt-8 text-xs text-slate-400 dark:text-slate-500">
              Managed by your organization's IT policy.
            </p>
          </div>
        </div>
 
        {/* Footer Links */}
        <div className="mt-12 flex items-center gap-6 text-sm">
          <a className="text-slate-400 dark:text-slate-500 hover:text-primary transition-colors underline decoration-slate-200 dark:decoration-slate-800 underline-offset-4" href="#">
            Privacy Policy
          </a>
          <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
          <a className="text-slate-400 dark:text-slate-500 hover:text-primary transition-colors underline decoration-slate-200 dark:decoration-slate-800 underline-offset-4" href="#">
            Terms of Service
          </a>
          <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
          <a className="text-slate-400 dark:text-slate-500 hover:text-primary transition-colors underline decoration-slate-200 dark:decoration-slate-800 underline-offset-4" href="#">
            Support
          </a>
        </div>
      </main>
 
      {/* Footer */}
      <footer className="py-8 text-center text-xs text-slate-400 dark:text-slate-500 font-sans">
        © 2026 Delivery Pulse. All rights reserved.
      </footer>
    </div>
  );
};
 
export default LoginPage;