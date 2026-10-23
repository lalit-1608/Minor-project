import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { exportService } from '../services/exportService';
import {
  Download,
  Printer,
  FileSpreadsheet,
  Building2,
  Calendar,
  Users,
  MessageSquare,
  Star,
  Award
} from 'lucide-react';
import { PerformanceBadge } from '../components/common/PerformanceBadge';

export function ReportsPage() {
  const { rankedFaculty, departmentStats, semesterStats, feedback, faculty, subjects, departments } = useData();

  const [activeTab, setActiveTab] = useState('faculty');

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    if (activeTab === 'faculty') {
      exportService.exportFacultyReport(rankedFaculty, departments);
    } else if (activeTab === 'department') {
      exportService.exportDepartmentReport(departmentStats);
    } else if (activeTab === 'semester') {
      exportService.exportSemesterReport(semesterStats);
    } else {
      exportService.exportFeedbackRecords(feedback, faculty, subjects, departments);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header with Print and Export Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Institutional Evaluation Reports
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Official aggregated audit reports for departments, semesters, and individual faculty performance.
          </p>
        </div>

        <div className="flex items-center gap-2.5 no-print">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 no-print overflow-x-auto">
        <button
          onClick={() => setActiveTab('faculty')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
            activeTab === 'faculty'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Faculty Report</span>
        </button>

        <button
          onClick={() => setActiveTab('department')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
            activeTab === 'department'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Department Report</span>
        </button>

        <button
          onClick={() => setActiveTab('semester')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
            activeTab === 'semester'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Semester Report</span>
        </button>

        <button
          onClick={() => setActiveTab('summary')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
            activeTab === 'summary'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Feedback Summary</span>
        </button>
      </div>

      {/* Tab 1: Faculty Report */}
      {activeTab === 'faculty' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Institutional Faculty Performance Audit
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Ranked descending by overall rating average and evaluation volume.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-4 text-center">Rank</th>
                  <th className="py-3 px-4">Faculty</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4 text-center">Evaluations</th>
                  <th className="py-3 px-4 text-center">Average Rating</th>
                  <th className="py-3 px-4 text-center">Score %</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {rankedFaculty.map(item => {
                  const dept = departments.find(d => d.id === item.faculty.departmentId);
                  return (
                    <tr key={item.faculty.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-4 text-center font-bold">
                        {item.rank}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-900 dark:text-white block">{item.faculty.name}</span>
                        <span className="text-[11px] text-slate-400">{item.faculty.designation}</span>
                      </td>
                      <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                        {dept?.name || '—'}
                      </td>
                      <td className="py-3 px-4 text-center font-semibold text-slate-700 dark:text-slate-300">
                        {item.feedbackCount}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="font-bold text-slate-900 dark:text-white">{item.overallAverage.toFixed(2)}</span>
                        <span className="text-[10px] text-slate-400"> / 5.0</span>
                      </td>
                      <td className="py-3 px-4 text-center font-semibold text-indigo-600 dark:text-indigo-400">
                        {item.percentage.toFixed(1)}%
                      </td>
                      <td className="py-3 px-4 text-center">
                        <PerformanceBadge statusInfo={item.statusInfo} size="sm" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Department Report */}
      {activeTab === 'department' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Department-Wise Benchmark Report
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Department faculty count, feedback volume, average rating, and overall percentage.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Code</th>
                  <th className="py-3 px-4 text-center">Faculty Count</th>
                  <th className="py-3 px-4 text-center">Feedback Count</th>
                  <th className="py-3 px-4 text-center">Average Rating</th>
                  <th className="py-3 px-4 text-center">Percentage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {departmentStats.map(d => (
                  <tr key={d.department.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                      {d.department.name}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-500">
                      {d.department.code}
                    </td>
                    <td className="py-3.5 px-4 text-center font-medium text-slate-700 dark:text-slate-300">
                      {d.facultyCount}
                    </td>
                    <td className="py-3.5 px-4 text-center font-medium text-slate-700 dark:text-slate-300">
                      {d.feedbackCount}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex items-center gap-1 font-extrabold text-slate-900 dark:text-white">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{d.overallAverage.toFixed(2)}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-indigo-600 dark:text-indigo-400">
                      {d.percentage.toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Semester Report */}
      {activeTab === 'semester' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Semester-Wise Academic Report
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Semester cohort ratings, highest-rated parameters, and lowest-rated parameters.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-4">Semester</th>
                  <th className="py-3 px-4 text-center">Feedback Count</th>
                  <th className="py-3 px-4 text-center">Average Rating</th>
                  <th className="py-3 px-4 text-center">Score %</th>
                  <th className="py-3 px-4">Highest-Rated Parameter</th>
                  <th className="py-3 px-4">Lowest-Rated Parameter</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {semesterStats.map(s => (
                  <tr key={s.semNumber} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                      {s.semester}
                    </td>
                    <td className="py-3.5 px-4 text-center font-medium text-slate-700 dark:text-slate-300">
                      {s.feedbackCount}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex items-center gap-1 font-extrabold text-slate-900 dark:text-white">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{s.overallAverage.toFixed(2)}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-indigo-600 dark:text-indigo-400">
                      {s.percentage.toFixed(1)}%
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                        {s.highestParameter}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                        {s.lowestParameter}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Feedback Summary */}
      {activeTab === 'summary' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Institutional Evaluation Summary
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              High-level overview of overall participation and distribution.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-bold">Total Feedback Submissions</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{feedback.length}</p>
              <p className="text-[11px] text-emerald-600 font-medium">Student identity not stored with submissions</p>
            </div>

            <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-bold">Active Teaching Faculty</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{faculty.length}</p>
              <p className="text-[11px] text-slate-500">Across 5 departments</p>
            </div>

            <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-bold">Evaluated Course Subjects</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{subjects.length}</p>
              <p className="text-[11px] text-slate-500">Covering Semesters 1 to 8</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
