import React from 'react';
import { Navigate, useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, ArrowRight, Lock } from 'lucide-react';

export function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, role, currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const getRoleDisplayName = (r) => {
    if (r === 'admin') return 'Principal / Dean';
    if (r === 'faculty') return 'Teacher / Educator';
    if (r === 'student') return 'Student';
    return r;
  };

  if (allowedRoles && !allowedRoles.includes(role)) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-100 dark:bg-amber-950/50 flex items-center justify-center text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 shadow-sm">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {allowedRoles.length === 1 && allowedRoles[0] === 'admin'
              ? 'Academic Oversight Access Required'
              : 'Authorized Role Required'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            This module requires authorization for <span className="font-semibold text-indigo-600 dark:text-indigo-400">{allowedRoles.map(getRoleDisplayName).join(' or ')}</span>. You are currently logged in as <strong className="text-slate-800 dark:text-slate-200">{getRoleDisplayName(role)} ({currentUser?.name})</strong>.
          </p>
        </div>

        {/* Re-authenticate with authorized role */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs max-w-sm mx-auto space-y-3">
          <p className="text-[11px] font-medium text-slate-500">
            To view this section, sign in using an authorized account:
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {allowedRoles.map(targetRole => (
              <button
                key={targetRole}
                onClick={() => {
                  logout();
                  navigate(`/login?role=${targetRole}`);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold capitalize inline-flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Sign In as {getRoleDisplayName(targetRole)}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="pt-2">
          <Link
            to={role === 'student' ? '/quiz' : role === 'faculty' ? `/faculty/${currentUser?.facultyId || 'fac-1'}` : role === 'admin' ? '/dashboard' : '/'}
            className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium inline-flex items-center gap-1"
          >
            <span>Return to your home portal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  return children;
}
