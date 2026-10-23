import React from 'react';
import { Search, X, Filter } from 'lucide-react';

export function FilterBar({
  search,
  onSearchChange,
  department,
  onDepartmentChange,
  subject,
  onSubjectChange,
  semester,
  onSemesterChange,
  ratingFilter,
  onRatingFilterChange,
  statusFilter,
  onStatusFilterChange,
  onClearFilters,
  departments = [],
  subjects = [],
  hasActiveFilters,
  isAdmin = false
}) {
  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative w-full sm:flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search faculty name or designation..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {search && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            <span>Clear Filters</span>
          </button>
        )}
      </div>

      {/* Filter Selects */}
      <div className={`grid ${isAdmin ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5' : 'grid-cols-1 sm:grid-cols-3'} gap-2.5 pt-1 text-xs`}>
        {/* Department filter */}
        <div>
          <select
            value={department}
            onChange={(e) => onDepartmentChange(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 truncate"
          >
            <option value="">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>

        {/* Subject filter */}
        <div>
          <select
            value={subject}
            onChange={(e) => onSubjectChange(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 truncate"
          >
            <option value="">All Subjects</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>{s.code} - {s.name}</option>
            ))}
          </select>
        </div>

        {/* Semester filter */}
        <div>
          <select
            value={semester}
            onChange={(e) => onSemesterChange(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Semesters</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
              <option key={sem} value={sem}>Semester {sem}</option>
            ))}
          </select>
        </div>

        {/* Rating filter - Principal only */}
        {isAdmin && (
          <div>
            <select
              value={ratingFilter}
              onChange={(e) => onRatingFilterChange(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Ratings</option>
              <option value="4.5">4.5 & Above (Exceptional)</option>
              <option value="4.0">4.0 & Above (Top)</option>
              <option value="3.5">3.5 & Above (Strong)</option>
              <option value="3.0">3.0 & Above (Average)</option>
              <option value="below3">Below 3.0 (Needs Improvement)</option>
            </select>
          </div>
        )}

        {/* Status filter - Principal only */}
        {isAdmin && (
          <div className="col-span-2 sm:col-span-1">
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 truncate"
            >
              <option value="">All Statuses</option>
              <option value="top">Top Performing</option>
              <option value="strong">Strong Performance</option>
              <option value="opportunity">Opportunity for Improvement</option>
              <option value="improvement">Requires Improvement</option>
              <option value="insufficient">Insufficient Feedback</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
}
