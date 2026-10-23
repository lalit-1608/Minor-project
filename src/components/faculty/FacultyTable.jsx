import React from 'react';
import { Link } from 'react-router-dom';
import { PerformanceBadge } from '../common/PerformanceBadge';
import { Star, ChevronRight, ExternalLink } from 'lucide-react';

export function FacultyTable({ rankedFaculty = [], departments = [], subjects = [], isAdmin = false }) {
  if (rankedFaculty.length === 0) {
    return (
      <div className="p-8 text-center text-xs text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
        No faculty match the selected criteria.
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {isAdmin && <th className="py-3.5 px-4 text-center w-14">Rank</th>}
              <th className="py-3.5 px-4">Faculty Member</th>
              <th className="py-3.5 px-4">Department</th>
              <th className="py-3.5 px-4">Subjects Taught</th>
              <th className="py-3.5 px-4 text-center">Evaluations</th>
              {isAdmin && <th className="py-3.5 px-4 text-center">Avg Rating</th>}
              {isAdmin && <th className="py-3.5 px-4 text-center">Score %</th>}
              {isAdmin && <th className="py-3.5 px-4 text-center">Status</th>}
              <th className="py-3.5 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {rankedFaculty.map((item) => {
              const dept = departments.find(d => d.id === item.faculty.departmentId);
              const facultySubjects = subjects.filter(s => s.facultyIds && s.facultyIds.includes(item.faculty.id));

              return (
                <tr
                  key={item.faculty.id}
                  className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors"
                >
                  {/* Rank */}
                  {isAdmin && (
                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg font-bold text-xs ${
                        item.rank === 1
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-extrabold ring-1 ring-amber-400'
                          : item.rank === 2
                          ? 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200 font-bold'
                          : item.rank === 3
                          ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 font-bold'
                          : 'text-slate-500 dark:text-slate-400'
                      }`}>
                        {item.rank}
                      </span>
                    </td>
                  )}

                  {/* Faculty info */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.faculty.avatar}
                        alt={item.faculty.name}
                        className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=128';
                        }}
                      />
                      <div>
                        <Link
                          to={`/faculty/${item.faculty.id}`}
                          className="font-bold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-sm"
                        >
                          {item.faculty.name}
                        </Link>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500">
                          {item.faculty.designation}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Department */}
                  <td className="py-3.5 px-4 font-medium text-slate-700 dark:text-slate-300">
                    {dept ? dept.name : '—'}
                  </td>

                  {/* Subjects */}
                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {facultySubjects.length > 0 ? (
                        facultySubjects.map(s => (
                          <span
                            key={s.id}
                            className="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                            title={s.name}
                          >
                            {s.code}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-400 text-[11px]">General</span>
                      )}
                    </div>
                  </td>

                  {/* Feedback Count */}
                  <td className="py-3.5 px-4 text-center font-semibold text-slate-700 dark:text-slate-300">
                    {item.feedbackCount}
                  </td>

                  {/* Average Rating - Principal only */}
                  {isAdmin && (
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex items-center gap-1 font-bold text-slate-900 dark:text-white">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{item.overallAverage.toFixed(2)}</span>
                      </div>
                    </td>
                  )}

                  {/* Percentage - Principal only */}
                  {isAdmin && (
                    <td className="py-3.5 px-4 text-center font-bold text-slate-600 dark:text-slate-300">
                      {item.percentage.toFixed(1)}%
                    </td>
                  )}

                  {/* Status - Principal only */}
                  {isAdmin && (
                    <td className="py-3.5 px-4 text-center">
                      <PerformanceBadge statusInfo={item.statusInfo} size="sm" />
                    </td>
                  )}

                  {/* Action */}
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      to={`/faculty/${item.faculty.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-semibold text-xs transition-colors"
                    >
                      <span>{isAdmin ? 'View Report' : 'View Profile'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
