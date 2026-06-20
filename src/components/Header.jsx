import React from 'react';
import { Sun, Moon, Image as ImageIcon, Zap } from 'lucide-react';

export default function Header({ isDarkMode, setIsDarkMode }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200/80 bg-white/70 backdrop-blur-md dark:border-gray-800/80 dark:bg-darkbg-300/70 transition-colors duration-300">
      <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo and Branding */}
        <div className="flex items-center gap-2">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 text-white shadow-md shadow-brand-500/20">
            <ImageIcon className="h-5 w-5 animate-pulse-slow" />
            <Zap className="absolute -bottom-1 -right-1 h-4.5 w-4.5 rounded-full bg-amber-400 p-0.5 text-slate-900 border-2 border-white dark:border-darkbg-200" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent dark:from-white dark:to-gray-300 tracking-tight font-sans">
            OptiPress <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300 ml-1">v1.0</span>
          </span>
        </div>

        {/* Navigation and Theme toggle */}
        <div className="flex items-center gap-4">
          <span className="hidden md:inline-flex items-center text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full border border-gray-200/50 dark:border-gray-700/50">
            ⚡ Client-Side Compression (No Upload Limits)
          </span>

          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100 dark:border-gray-800 dark:bg-darkbg-200 dark:text-gray-300 dark:hover:bg-darkbg-100 transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5 text-amber-400 transition-transform duration-300 hover:rotate-45" />
            ) : (
              <Moon className="h-5 w-5 text-slate-600 transition-transform duration-300 hover:-rotate-12" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
