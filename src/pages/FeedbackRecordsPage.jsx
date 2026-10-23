import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { exportService } from '../services/exportService';
import { analyzeSentiment } from '../utils/sentiment';
import { Search, Download, Star, ShieldCheck, Filter, ChevronDown } from 'lucide-react';
import { DataProvenanceBadge } from '../components/research/DataProvenanceBadge';

export function FeedbackRecordsPage() {
  const { feedback, faculty, subjects, departments } = useData();
  const { isAdmin, isFaculty, currentUser } = useAuth();

  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [facultyFilter, setFacultyFilter] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [semesterFilter, setSemesterFilter] = useState('');
  const [sentimentFilter, setSentimentFilter] = useState('');
  const [expandedRecord, setExpandedRecord] = useState(null);

  // If faculty, scope feedback strictly to this faculty's ID
  const effectiveFacultyId = isFaculty ? (currentUser?.facultyId || 'fac-1') : facultyFilter;

  // Feedback scoped by role
  const scopedFeedback = useMemo(() => {
    if (isFaculty && currentUser?.facultyId) {
      return feedback.filter(fb => fb.facultyId === currentUser.facultyId);
    }
    return feedback;
  }, [feedback, isFaculty, currentUser]);

  // Filter records
  const filteredRecords = useMemo(() => {
    return scopedFeedback.map(fb => ({
      ...fb,
      sentimentAnalysis: analyzeSentiment(fb.comment)
    })).filter(fb => {
      const facultyObj = faculty.find(f => f.id === fb.facultyId);
      const subjectObj = subjects.find(s => s.id === fb.subjectId);

      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesComment = fb.comment && fb.comment.toLowerCase().includes(q);
        const matchesFaculty = facultyObj?.name.toLowerCase().includes(q);
        const matchesSubject = subjectObj?.name.toLowerCase().includes(q) || subjectObj?.code.toLowerCase().includes(q);
        if (!matchesComment && !matchesFaculty && !matchesSubject) return false;
      }

      if (departmentFilter && fb.departmentId !== departmentFilter) return false;
      if (!isFaculty && effectiveFacultyId && fb.facultyId !== effectiveFacultyId) return false;
      if (subjectFilter && fb.subjectId !== subjectFilter) return false;
      if (semesterFilter && Number(fb.semester) !== Number(semesterFilter)) return false;
      if (sentimentFilter && fb.sentimentAnalysis.sentiment !== sentimentFilter) return false;

      return true;
    });
  }, [scopedFeedback, faculty, subjects, search, departmentFilter, isFaculty, effectiveFacultyId, subjectFilter, semesterFilter, sentimentFilter]);

  const handleExport = () => {
    exportService.exportFeedbackRecords(filteredRecords, faculty, subjects, departments, isAdmin);
  };

  const collectedCount = useMemo(() => scopedFeedback.filter(f => f.dataProvenance === 'collected').length, [scopedFeedback]);
  const demoCount = useMemo(() => scopedFeedback.filter(f => f.dataProvenance === 'demo' || f.isDemo).length, [scopedFeedback]);

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Anonymous Feedback Records
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Auditable log of student evaluation submissions. Student identity is not stored with feedback records in this prototype.
          </p>
        </div>

        <button
          onClick={handleExport}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all"
        >
          <Download className="w-4 h-4" />
          <span>Export Filtered CSV</span>
        </button>
      </div>

      {isFaculty && (
        <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-700 dark:text-indigo-300 flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
          <span>
            <strong>Educator Scoped View:</strong> Showing anonymous course feedback records submitted for your courses ({currentUser?.name || 'Educator'}).
          </span>
        </div>
      )}

      <DataProvenanceBadge
        state={collectedCount > 0 ? "collected" : "demo"}
        label={
          collectedCount > 0
            ? `Feedback Dataset (${collectedCount} collected, ${demoCount} demo)`
            : `Demo / Synthetic Feedback Dataset (${demoCount} seed records) — Not an Experimental Finding`
        }
        sampleSize={collectedCount > 0 ? collectedCount : undefined}
      />

      {/* Filter toolbar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search keywords in comments or faculty/subject names..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Departments</option>
            {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>

          {isFaculty ? (
            <div className="px-3 py-2 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-bold flex items-center justify-between">
              <span className="truncate">{currentUser?.name || 'My Courses'}</span>
              <span className="text-[10px] opacity-75 shrink-0">(Locked)</span>
            </div>
          ) : (
            <select
              value={facultyFilter}
              onChange={(e) => setFacultyFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Faculty</option>
              {faculty.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
            </select>
          )}

          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Subjects</option>
            {subjects.map(s => <option key={s.id} value={s.id}>{s.code} - {s.name}</option>)}
          </select>

          <select
            value={semesterFilter}
            onChange={(e) => setSemesterFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Semesters</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s}>Semester {s}</option>)}
          </select>

          <select
            value={sentimentFilter}
            onChange={(e) => setSentimentFilter(e.target.value)}
            className="col-span-2 sm:col-span-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Sentiments</option>
            <option value="positive">Positive</option>
            <option value="neutral">Neutral</option>
            <option value="attention">Needs Attention</option>
          </select>
        </div>
      </div>

      {/* Records Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Faculty</th>
                <th className="py-3 px-4">Subject & Class</th>
                <th className="py-3 px-4">Provenance</th>
                {isAdmin && <th className="py-3 px-4 text-center">Average</th>}
                <th className="py-3 px-4">Sentiment</th>
                <th className="py-3 px-4">Comment</th>
                <th className="py-3 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredRecords.map((fb) => {
                const fac = faculty.find(f => f.id === fb.facultyId);
                const sub = subjects.find(s => s.id === fb.subjectId);
                const avg = (Object.values(fb.ratings).reduce((a, b) => a + b, 0) / 6).toFixed(2);
                const isExpanded = expandedRecord === fb.id;

                const sentimentColor = {
                  positive: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
                  neutral: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800',
                  attention: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800'
                };

                return (
                  <React.Fragment key={fb.id}>
                    <tr className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                        {new Date(fb.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                        {fac?.name || 'Faculty'}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                          {sub?.code}: {sub?.name}
                        </span>
                        <span className="text-slate-400 text-[11px]">
                          Sem {fb.semester} • {fb.className}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          fb.dataProvenance === 'collected'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                            : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800'
                        }`}>
                          {fb.dataProvenance === 'collected' ? 'Collected' : 'Demo'}
                        </span>
                      </td>
                      {isAdmin && (
                        <td className="py-3.5 px-4 text-center">
                          <div className="inline-flex items-center gap-1 font-extrabold text-slate-900 dark:text-white">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span>{avg}</span>
                          </div>
                        </td>
                      )}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${sentimentColor[fb.sentimentAnalysis.sentiment]}`}>
                          {fb.sentimentAnalysis.label}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 max-w-xs truncate text-slate-600 dark:text-slate-300 italic">
                        {fb.comment || <span className="text-slate-400 not-italic">No comment</span>}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setExpandedRecord(isExpanded ? null : fb.id)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600"
                        >
                          <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </button>
                      </td>
                    </tr>

                    {/* Expanded Ratings Breakdown */}
                    {isExpanded && (
                      <tr className="bg-slate-50/70 dark:bg-slate-800/30">
                        <td colSpan={isAdmin ? 8 : 7} className="p-4">
                          <div className="space-y-3">
                            {isAdmin && (
                              <>
                                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                  Detailed Parameter Scores
                                </h4>
                                <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center">
                                  <div className="bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-800">
                                    <span className="text-[10px] text-slate-400 block">Knowledge</span>
                                    <span className="font-bold text-slate-900 dark:text-white">{fb.ratings.subjectKnowledge}/5</span>
                                  </div>
                                  <div className="bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-800">
                                    <span className="text-[10px] text-slate-400 block">Clarity</span>
                                    <span className="font-bold text-slate-900 dark:text-white">{fb.ratings.clarity}/5</span>
                                  </div>
                                  <div className="bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-800">
                                    <span className="text-[10px] text-slate-400 block">Communication</span>
                                    <span className="font-bold text-slate-900 dark:text-white">{fb.ratings.communication}/5</span>
                                  </div>
                                  <div className="bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-800">
                                    <span className="text-[10px] text-slate-400 block">Engagement</span>
                                    <span className="font-bold text-slate-900 dark:text-white">{fb.ratings.engagement}/5</span>
                                  </div>
                                  <div className="bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-800">
                                    <span className="text-[10px] text-slate-400 block">Punctuality</span>
                                    <span className="font-bold text-slate-900 dark:text-white">{fb.ratings.punctuality}/5</span>
                                  </div>
                                  <div className="bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-800">
                                    <span className="text-[10px] text-slate-400 block">Satisfaction</span>
                                    <span className="font-bold text-slate-900 dark:text-white">{fb.ratings.satisfaction}/5</span>
                                  </div>
                                </div>
                              </>
                            )}
                            {fb.comment && (
                              <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs italic text-slate-700 dark:text-slate-300">
                                "{fb.comment}"
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
