import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  Sun,
  Moon,
  User,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export function Header({ onToggleSidebar }) {
  const { theme, setTheme } = useTheme();
  const { settings } = useData();
  const { currentUser, role, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [isEntityMenuOpen, setIsEntityMenuOpen] = useState(false);

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'StudySnippet';
    if (path === '/research') return 'Research Overview';
    if (path === '/login') return 'Sign In';
    if (path === '/my-learning') return 'My Learning & Diagnostics';
    if (path === '/study-snippets') return 'Study Snippets Library';
    if (path === '/educator') return 'Educator Research Studio';
    if (path === '/educator/content') return 'Educational Content Studio';
    if (path === '/educator/learner-analytics') return 'Learner Diagnostic Analytics';
    if (path === '/quiz') return 'Diagnostic Misconception Quiz';
    if (path === '/misconceptions') return 'Misconception Analytics';
    if (path === '/hci-research') return 'HCI & Usability Study (SUS)';
    if (path === '/pedagogical-adjustments') return 'Feedback-to-Action Research Loop';
    if (path === '/dashboard') return 'Institutional Analytics';
    if (path === '/feedback') return 'Course Feedback';
    if (path === '/feedback/success') return 'Feedback Submitted';
    if (path.startsWith('/faculty/')) return 'Faculty Teaching Dossier';
    if (path === '/faculty') return 'Faculty Directory';
    if (path === '/subjects') return 'Course Directory';
    if (path === '/feedback-records') return 'Feedback Records Audit';
    if (path === '/compare') return 'Comparative Analytics';
    if (path === '/reports') return 'Institutional Reports';
    if (path === '/settings') return 'Platform Settings';
    return 'StudySnippet';
  };

  const handleLogout = () => {
    logout();
    setIsEntityMenuOpen(false);
    addToast('Signed out', 'info');
    navigate('/login');
  };

  const roleLabel = role === 'admin' ? 'Academic Oversight' : role === 'faculty' ? 'Educator' : 'Learner';

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between transition-colors">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 lg:hidden rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
            {getPageTitle()}
          </h1>
          <p className="text-[11px] text-slate-400 hidden sm:block">
            {settings?.institutionName || 'Educational Technology Research Prototype'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Theme Toggle Button */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1 border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setTheme('light')}
            className={`p-1.5 rounded-lg transition-colors ${
              theme === 'light'
                ? 'bg-white dark:bg-slate-700 text-amber-500 shadow-xs'
                : 'text-slate-400 hover:text-slate-600'
            }`}
            title="Light Theme"
          >
            <Sun className="w-4 h-4" />
          </button>
          <button
            onClick={() => setTheme('dark')}
            className={`p-1.5 rounded-lg transition-colors ${
              theme === 'dark'
                ? 'bg-white dark:bg-slate-700 text-indigo-400 shadow-xs'
                : 'text-slate-400 hover:text-slate-600'
            }`}
            title="Dark Theme"
          >
            <Moon className="w-4 h-4" />
          </button>
        </div>

        {/* User Card & Dropdown */}
        {isAuthenticated && currentUser ? (
          <div className="relative">
            <button
              onClick={() => setIsEntityMenuOpen(!isEntityMenuOpen)}
              className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 transition-all text-left shadow-xs cursor-pointer"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-7 h-7 rounded-lg object-cover"
              />
              <div className="hidden sm:block text-left leading-tight">
                <span className="text-xs font-bold text-slate-900 dark:text-white block truncate max-w-[100px]">
                  {currentUser.name}
                </span>
                <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                  {roleLabel}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Dropdown Menu */}
            {isEntityMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsEntityMenuOpen(false)} />
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl z-50 p-2 space-y-1">
                  <div className="p-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{currentUser.name}</p>
                    <p className="text-[10px] text-slate-400">{currentUser.email}</p>
                  </div>

                  <div className="p-1 space-y-1">
                    <button
                      onClick={() => {
                        logout();
                        setIsEntityMenuOpen(false);
                        addToast('Signed out to switch account', 'info');
                        navigate('/login');
                      }}
                      className="w-full text-left px-2 py-1.5 rounded-lg text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 text-slate-700 dark:text-slate-300 transition-colors"
                      title="Requires new login with target role credentials"
                    >
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>Switch Account</span>
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-2 py-1.5 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2 transition-colors border-t border-slate-100 dark:border-slate-800 pt-1.5"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold"
          >
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
}
