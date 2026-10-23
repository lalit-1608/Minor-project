import React from 'react';
import { Link } from 'react-router-dom';
import { PerformanceBadge } from '../common/PerformanceBadge';
import { Star, ChevronRight, Award, MessageSquare, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function FacultyCard({ item, rankBadge = false }) {
  const { isAdmin } = useAuth();
  if (!item) return null;
  const { faculty, overallAverage, feedbackCount, statusInfo, rank, lowestParameter } = item;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative group">
      {isAdmin && rankBadge && rank && typeof rank === 'number' && (
        <div className="absolute top-4 right-4 flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 text-xs font-bold">
          <Award className="w-3.5 h-3.5" />
          <span>Rank #{rank}</span>
        </div>
      )}

      <div>
        <div className="flex items-start gap-3.5 mb-4">
          <img
            src={faculty.avatar}
            alt={faculty.name}
            className="w-12 h-12 rounded-2xl object-cover ring-2 ring-indigo-500/10 shrink-0"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=128';
            }}
          />
          <div className="min-w-0 pr-12">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
              {faculty.name}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {faculty.designation}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/70 mb-4 text-xs">
          {isAdmin ? (
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Average Rating</span>
              <div className="flex items-center gap-1 font-extrabold text-slate-900 dark:text-white text-base">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{overallAverage.toFixed(2)}</span>
              </div>
            </div>
          ) : (
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Department</span>
              <span className="font-bold text-slate-700 dark:text-slate-300 text-xs block truncate mt-1">
                {faculty.departmentName || 'Academic'}
              </span>
            </div>
          )}
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Evaluations</span>
            <div className="flex items-center gap-1 font-bold text-slate-700 dark:text-slate-300 text-base">
              <MessageSquare className="w-4 h-4 text-indigo-500" />
              <span>{feedbackCount}</span>
            </div>
          </div>
        </div>

        {isAdmin && lowestParameter && (
          <div className="mb-4 text-xs">
            <span className="text-[10px] uppercase font-bold text-rose-500 tracking-wider">Opportunity Area:</span>
            <p className="text-slate-600 dark:text-slate-300 font-medium truncate mt-0.5">
              {lowestParameter.label} ({lowestParameter.value.toFixed(2)}/5)
            </p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
        {isAdmin ? (
          <PerformanceBadge statusInfo={statusInfo} size="sm" />
        ) : (
          <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 inline-flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
            <span>Ratings Confidential</span>
          </span>
        )}
        <Link
          to={`/faculty/${faculty.id}`}
          className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1"
        >
          <span>{isAdmin ? 'Report' : 'Profile'}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
