import React, { useState } from 'react';
import { useNavigate, useLocation, useSearchParams, Link } from 'react-router-dom';
import { useAuth, DEMO_USERS, DEMO_CREDENTIALS } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import {
  GraduationCap,
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  ArrowLeft,
  Sun,
  Moon,
  KeyRound,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { loginWithCredentials } = useAuth();
  const { theme, setTheme } = useTheme();
  const { addToast } = useToast();

  const queryRole = searchParams.get('role');
  const initialRole = ['student', 'faculty', 'admin'].includes(queryRole) ? queryRole : 'student';

  const [activeTab, setActiveTab] = useState(initialRole);
  const [email, setEmail] = useState(DEMO_USERS[initialRole]?.email || '');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [prevQueryRole, setPrevQueryRole] = useState(queryRole);

  // Synchronize when query parameter changes without cascading effect warning
  if (queryRole !== prevQueryRole) {
    setPrevQueryRole(queryRole);
    if (queryRole && ['student', 'faculty', 'admin'].includes(queryRole)) {
      setActiveTab(queryRole);
      setEmail(DEMO_USERS[queryRole]?.email || '');
      setPassword('');
      setErrorMessage('');
    }
  }

  const handleTabChange = (role) => {
    setActiveTab(role);
    setEmail(DEMO_USERS[role]?.email || '');
    setPassword('');
    setErrorMessage('');
  };

  const getRedirectPath = (role) => {
    const from = location.state?.from?.pathname;
    if (from && from !== '/login') return from;
    if (role === 'student') return '/my-learning';
    if (role === 'faculty') return '/educator';
    return '/dashboard';
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email) {
      setErrorMessage('Please enter your email address.');
      addToast('Please enter your email.', 'error');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password.');
      addToast('Please enter your password.', 'error');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const result = loginWithCredentials(email, password, activeTab);
      setIsLoading(false);
      if (result.success) {
        addToast(`Authenticated as ${result.user.name} (${result.user.roleLabel})`, 'success');
        navigate(getRedirectPath(result.user.role), { replace: true });
      } else {
        const errorText = result.error || 'Authentication failed. Please verify credentials.';
        setErrorMessage(errorText);
        addToast(errorText, 'error');
      }
    }, 200);
  };

  const expectedPassword = DEMO_CREDENTIALS[activeTab]?.password || '••••••••';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors flex flex-col justify-between">
      {/* Top Header */}
      <header className="h-16 px-4 sm:px-8 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
        <Link to="/" className="flex items-center gap-2 focus:outline-none">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
            <GraduationCap className="w-5 h-5" />
          </div>
          <span className="text-lg font-black text-slate-900 dark:text-white">
            Study<span className="text-indigo-600">Snippet</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-indigo-600 inline-flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>

          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
          </button>
        </div>
      </header>

      {/* Main Login Box */}
      <div className="flex-1 flex flex-col justify-center py-6 px-4 sm:px-6 max-w-4xl mx-auto w-full">
        <div className="mb-6 text-center space-y-1.5">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Role Authentication
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Select your role profile and authenticate with credentials to access research portals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Left Column: Role Profiles for Demo Verification */}
          <div className="md:col-span-6 space-y-3">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
              Select Your Role Profile:
            </div>

            {/* Student Card */}
            <div
              onClick={() => handleTabChange('student')}
              className={`p-4 rounded-2xl bg-white dark:bg-slate-900 border transition-all cursor-pointer space-y-2 group shadow-xs ${
                activeTab === 'student'
                  ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/20 dark:bg-emerald-950/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-emerald-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={DEMO_USERS.student.avatar}
                    alt="Rahul"
                    className="w-11 h-11 rounded-xl object-cover ring-2 ring-emerald-500/20"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                        Rahul Chauhan
                      </h3>
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        Student
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">5th Sem • Computer Science</p>
                  </div>
                </div>

                <span className={`p-2 rounded-xl text-emerald-600 ${
                  activeTab === 'student' ? 'bg-emerald-100 dark:bg-emerald-950' : 'bg-emerald-50 dark:bg-emerald-950/40'
                }`}>
                  {activeTab === 'student' ? <CheckCircle2 className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
                <span>Email: <code className="text-slate-700 dark:text-slate-300 font-mono">rahul.chauhan@apex.edu</code></span>
                <span className="font-medium text-emerald-600">Pwd: <code className="font-mono">Student@123</code></span>
              </div>
            </div>

            {/* Teacher Card */}
            <div
              onClick={() => handleTabChange('faculty')}
              className={`p-4 rounded-2xl bg-white dark:bg-slate-900 border transition-all cursor-pointer space-y-2 group shadow-xs ${
                activeTab === 'faculty'
                  ? 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/20 dark:bg-blue-950/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-blue-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={DEMO_USERS.faculty.avatar}
                    alt="Mr. Ashok"
                    className="w-11 h-11 rounded-xl object-cover ring-2 ring-blue-500/20"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                        Mr. Ashok Rathi
                      </h3>
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                        Teacher
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">Computer Science Teacher & HOD</p>
                  </div>
                </div>

                <span className={`p-2 rounded-xl text-blue-600 ${
                  activeTab === 'faculty' ? 'bg-blue-100 dark:bg-blue-950' : 'bg-blue-50 dark:bg-blue-950/40'
                }`}>
                  {activeTab === 'faculty' ? <CheckCircle2 className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
                <span>Email: <code className="text-slate-700 dark:text-slate-300 font-mono">ashok.rathi@apex.edu</code></span>
                <span className="font-medium text-blue-600">Pwd: <code className="font-mono">Faculty@123</code></span>
              </div>
            </div>

            {/* Principal Card */}
            <div
              onClick={() => handleTabChange('admin')}
              className={`p-4 rounded-2xl bg-white dark:bg-slate-900 border transition-all cursor-pointer space-y-2 group shadow-xs ${
                activeTab === 'admin'
                  ? 'border-purple-500 ring-2 ring-purple-500/20 bg-purple-50/20 dark:bg-purple-950/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-purple-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={DEMO_USERS.admin.avatar}
                    alt="Dr. Rajesh"
                    className="w-11 h-11 rounded-xl object-cover ring-2 ring-purple-500/20"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-purple-600 transition-colors">
                        Dr. Rajesh Verma
                      </h3>
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                        Principal / Dean
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">Academic Oversight & Principal</p>
                  </div>
                </div>

                <span className={`p-2 rounded-xl text-purple-600 ${
                  activeTab === 'admin' ? 'bg-purple-100 dark:bg-purple-950' : 'bg-purple-50 dark:bg-purple-950/40'
                }`}>
                  {activeTab === 'admin' ? <CheckCircle2 className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
                <span>Email: <code className="text-slate-700 dark:text-slate-300 font-mono">rajesh.verma@apex.edu</code></span>
                <span className="font-medium text-purple-600">Pwd: <code className="font-mono">Principal@123</code></span>
              </div>
            </div>
          </div>

          {/* Right Column: Credential Entry Form */}
          <div className="md:col-span-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Enter Credentials:
              </div>
              <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                {activeTab === 'admin' ? 'Principal Role' : activeTab === 'faculty' ? 'Teacher Role' : 'Student Role'}
              </span>
            </div>

            {/* Tabs */}
            <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700">
              {['student', 'faculty', 'admin'].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => handleTabChange(r)}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all capitalize ${
                    activeTab === r
                      ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                  }`}
                >
                  {r === 'admin' ? 'Principal' : r === 'faculty' ? 'Teacher' : 'Student'}
                </button>
              ))}
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@apex.edu"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Demo: {expectedPassword}
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 mt-2"
              >
                {isLoading ? (
                  <span>Verifying credentials...</span>
                ) : (
                  <>
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Sign In with Credentials</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>

            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] flex items-center gap-2 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Role authentication requires valid credentials. Switching roles requires re-login.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Simple Footer */}
      <footer className="py-4 text-center text-xs text-slate-400 border-t border-slate-200 dark:border-slate-800">
        StudySnippet — Misconception-Aware Learning & Educational Feedback Analytics Research Platform
      </footer>
    </div>
  );
}

export default LoginPage;
