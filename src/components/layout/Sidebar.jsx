import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  MessageSquarePlus,
  Users,
  BookOpen,
  Scale,
  Settings,
  GraduationCap,
  X,
  MessageSquare,
  Brain,
  Star,
  FileCheck2,
  Sparkles,
  FlaskConical,
  BarChart3,
  LogOut,
  LogIn
} from 'lucide-react';

export function Sidebar({ isOpen, onClose }) {
  const { role, currentUser, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  // Role-specific research-oriented navigation structure
  const getNavSections = () => {
    if (role === 'student') {
      return [
        {
          heading: 'My Learning & Diagnostics',
          items: [
            { path: '/my-learning', label: 'My Learning Dashboard', icon: GraduationCap, highlight: true, badge: 'Home' },
            { path: '/study-snippets', label: 'Study Snippets', icon: BookOpen },
            { path: '/quiz', label: 'Diagnostic Quiz', icon: Brain },
            { path: '/misconceptions', label: 'My Misconceptions & Traps', icon: Sparkles },
            { path: '/feedback', label: 'Course Feedback Form', icon: MessageSquarePlus },
            { path: '/usability-survey', label: 'Usability / SUS Survey', icon: Star }
          ]
        },
        {
          heading: 'Research Reference',
          items: [
            { path: '/research', label: 'Research Overview', icon: FlaskConical },
            { path: '/subjects', label: 'Course Directory', icon: BookOpen }
          ]
        }
      ];
    }

    if (role === 'faculty') {
      return [
        {
          heading: 'Educator Research Studio',
          items: [
            { path: '/educator', label: 'Educator Dashboard', icon: LayoutDashboard, highlight: true, badge: 'Home' },
            { path: '/educator/content', label: 'Educational Content Studio', icon: BookOpen, badge: 'Author' },
            { path: '/educator/learner-analytics', label: 'Learner Diagnostics', icon: Brain },
            { path: '/misconceptions', label: 'Misconception Analytics', icon: Sparkles },
            { path: '/feedback-records', label: 'My Feedback Insights', icon: MessageSquare },
            { path: '/pedagogical-adjustments', label: 'Feedback-to-Action Loop', icon: FileCheck2 },
            { path: `/faculty/${currentUser?.facultyId || 'fac-1'}`, label: 'My Teaching Dossier', icon: GraduationCap }
          ]
        },
        {
          heading: 'Supporting Tools',
          items: [
            { path: '/research', label: 'Research Overview', icon: FlaskConical },
            { path: '/study-snippets', label: 'Study Snippets Library', icon: BookOpen },
            { path: '/usability-survey', label: 'Usability / SUS Survey', icon: Star },
            { path: '/subjects', label: 'Course Directory', icon: BookOpen }
          ]
        }
      ];
    }

    // Principal / Academic Oversight (Admin)
    return [
      {
        heading: 'Academic Oversight',
        items: [
          { path: '/dashboard', label: 'Institutional Dashboard', icon: LayoutDashboard, highlight: true, badge: 'Home' },
          { path: '/misconceptions', label: 'Misconception Analytics', icon: Sparkles },
          { path: '/educator/learner-analytics', label: 'Learner Diagnostics', icon: Brain },
          { path: '/educator/content', label: 'Educational Content Oversight', icon: BookOpen },
          { path: '/feedback-records', label: 'All Feedback Audit', icon: MessageSquare },
          { path: '/pedagogical-adjustments', label: 'Interventions Oversight', icon: FileCheck2 },
          { path: '/compare', label: 'Comparative Analytics', icon: Scale },
          { path: '/hci-research', label: 'HCI / Usability (SUS)', icon: Star }
        ]
      },
      {
        heading: 'Research Support & Oversight',
        items: [
          { path: '/research', label: 'Research Overview', icon: FlaskConical },
          { path: '/study-snippets', label: 'Study Snippets Library', icon: BookOpen },
          { path: '/faculty', label: 'Faculty Directory', icon: Users },
          { path: '/subjects', label: 'Course Directory', icon: BookOpen },
          { path: '/settings', label: 'Platform Settings', icon: Settings }
        ]
      }
    ];
  };

  const navSections = getNavSections();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo Section */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
          <NavLink to="/" className="flex items-center gap-2.5 focus:outline-none" onClick={onClose}>
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                Study<span className="text-indigo-600">Snippet</span>
              </span>
              <span className="block text-[9px] font-bold text-slate-400 uppercase -mt-1">
                Educational Research Platform
              </span>
            </div>
          </NavLink>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 lg:hidden rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Persona Card */}
        {currentUser && (
          <div className="px-4 pt-3 pb-1">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 flex items-center gap-2.5">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {currentUser.name}
                </p>
                <span className="inline-block text-[10px] font-extrabold uppercase px-1.5 py-0.2 rounded-md bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                  {role === 'admin' ? 'Academic Oversight' : role === 'faculty' ? 'Educator' : 'Learner'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
          {navSections.map((sec, secIdx) => (
            <div key={secIdx} className="space-y-1">
              <div className="px-3 mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {sec.heading}
              </div>

              {sec.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 shadow-2xs'
                          : item.highlight
                          ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/30 hover:bg-indigo-50'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                      <span className="ml-auto text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-600 text-white shrink-0">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </div>

        {/* Authentication Account State in Sidebar Footer */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
          {isAuthenticated && currentUser ? (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Active Session:
                </span>
                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                  role === 'admin'
                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                    : role === 'faculty'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                    : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                }`}>
                  {role === 'admin' ? 'Oversight' : role === 'faculty' ? 'Educator' : 'Learner'}
                </span>
              </div>
              <div className="text-[11px] font-medium text-slate-600 dark:text-slate-300 px-1 truncate">
                {currentUser.name}
              </div>
              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="w-full flex items-center justify-center gap-2 py-1.5 px-3 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors shadow-xs"
                title="Sign out and log in with different role credentials"
              >
                <LogOut className="w-3.5 h-3.5 text-slate-500" />
                <span>Switch Account</span>
              </button>
            </div>
          ) : (
            <div className="space-y-1.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">
                Guest Session
              </div>
              <button
                onClick={() => navigate('/login')}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-xs"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In with Credentials</span>
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
