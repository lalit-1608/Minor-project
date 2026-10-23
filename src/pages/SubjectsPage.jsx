import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { CourseDetailModal } from '../components/courses/CourseDetailModal';
import {
  BookOpen,
  Search,
  Star,
  MessageSquare,
  ArrowRight
} from 'lucide-react';
import { calculateOverallAverage } from '../utils/calculations';

export function SubjectsPage() {
  const { subjects, departments, faculty, feedback } = useData();
  const { isAdmin } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [semesterFilter, setSemesterFilter] = useState('');
  const [selectedSubject, setSelectedSubject] = useState(null);

  // Compute stats per subject
  const subjectsWithStats = useMemo(() => {
    return subjects.map(sub => {
      const subFeedback = feedback.filter(fb => fb.subjectId === sub.id);
      const avg = calculateOverallAverage(subFeedback);
      const dept = departments.find(d => d.id === sub.departmentId);
      const assignedFaculty = faculty.filter(f => sub.facultyIds && sub.facultyIds.includes(f.id));

      return {
        ...sub,
        feedbackCount: subFeedback.length,
        averageRating: avg,
        departmentName: dept?.name || 'Department',
        departmentCode: dept?.code || '',
        assignedFaculty
      };
    });
  }, [subjects, departments, faculty, feedback]);

  // Handle URL deep-linking (?id=sub-cs701)
  useEffect(() => {
    const idParam = searchParams.get('id');
    if (idParam && subjectsWithStats.length > 0) {
      const match = subjectsWithStats.find(s => s.id === idParam || s.code.toLowerCase() === idParam.toLowerCase());
      if (match && selectedSubject?.id !== match.id) {
        setSelectedSubject(match);
      }
    }
  }, [searchParams, subjectsWithStats, selectedSubject]);

  const handleOpenSubject = (sub) => {
    setSelectedSubject(sub);
    setSearchParams({ id: sub.id });
  };

  const handleCloseModal = () => {
    setSelectedSubject(null);
    setSearchParams({});
  };

  const filteredSubjects = useMemo(() => {
    return subjectsWithStats.filter(sub => {
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesName = sub.name.toLowerCase().includes(q);
        const matchesCode = sub.code.toLowerCase().includes(q);
        if (!matchesName && !matchesCode) return false;
      }
      if (departmentFilter && sub.departmentId !== departmentFilter) {
        return false;
      }
      if (semesterFilter && Number(sub.semester) !== Number(semesterFilter)) {
        return false;
      }
      return true;
    });
  }, [subjectsWithStats, search, departmentFilter, semesterFilter]);

  const selectedDepartment = useMemo(() => {
    if (!selectedSubject) return null;
    return departments.find(d => d.id === selectedSubject.departmentId);
  }, [selectedSubject, departments]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-bold mb-1">
            <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
            <span>Course Catalog & Curriculum</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Academic Course Subjects
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Click any course card to inspect all 5 Units, chapters, lab practicals, marks scheme, and teachers!
          </p>
        </div>
        <div className="text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl w-fit">
          Showing <strong className="text-slate-900 dark:text-white">{filteredSubjects.length}</strong> of {subjects.length} subjects
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by subject name or code (e.g. CS701, Machine Learning)..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Departments</option>
            {departments.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>

          <select
            value={semesterFilter}
            onChange={(e) => setSemesterFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Semesters</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
              <option key={sem} value={sem}>Semester {sem}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSubjects.map((sub) => (
          <div
            key={sub.id}
            onClick={() => handleOpenSubject(sub)}
            className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md hover:border-indigo-500 dark:hover:border-indigo-500 transition-all flex flex-col justify-between space-y-4 cursor-pointer group"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="px-2.5 py-0.5 rounded-lg text-xs font-black bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    {sub.code}
                  </span>
                  <span className="text-[11px] font-bold text-slate-500">
                    Semester {sub.semester}
                  </span>
                </div>

                <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  5 Units • 4 Credits
                </span>
              </div>

              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {sub.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {sub.departmentName}
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-1">
              {/* Assigned Faculty */}
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider mb-1">
                  Faculty In-Charge:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {sub.assignedFaculty.map(f => (
                    <span
                      key={f.id}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                    >
                      <img src={f.avatar} alt={f.name} className="w-3.5 h-3.5 rounded-full object-cover" />
                      <span>{f.name}</span>
                    </span>
                  ))}
                  {sub.assignedFaculty.length === 0 && (
                    <span className="text-xs text-slate-400 italic">Unassigned</span>
                  )}
                </div>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-2 gap-2 p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs">
                {isAdmin ? (
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Course Rating</span>
                    <div className="flex items-center gap-1 font-black text-slate-900 dark:text-white text-xs">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{sub.averageRating.toFixed(2)}</span>
                    </div>
                  </div>
                ) : (
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Structure</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300 text-xs block truncate mt-0.5">
                      5 Units • 4 Credits
                    </span>
                  </div>
                )}
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Reviews</span>
                  <div className="flex items-center gap-1 font-bold text-slate-700 dark:text-slate-300 text-xs">
                    <MessageSquare className="w-3 h-3 text-indigo-500" />
                    <span>{sub.feedbackCount} reviews</span>
                  </div>
                </div>
              </div>

              {/* Prominent Action Button */}
              <button
                type="button"
                className="w-full py-2.5 px-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold group-hover:bg-indigo-600 group-hover:text-white transition-all flex items-center justify-center gap-1.5 shadow-xs"
              >
                <span>View Syllabus & Units</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredSubjects.length === 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No subjects match your search</h3>
          <p className="text-xs text-slate-500 mt-1">Try clearing the search text or selecting a different department.</p>
          <button
            onClick={() => { setSearch(''); setDepartmentFilter(''); setSemesterFilter(''); }}
            className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Course Detail Modal (Units, Syllabus, Chapters, Labs, Marks) */}
      <CourseDetailModal
        isOpen={Boolean(selectedSubject)}
        subject={selectedSubject}
        department={selectedDepartment}
        assignedFaculty={selectedSubject?.assignedFaculty || []}
        feedback={feedback}
        onClose={handleCloseModal}
      />
    </div>
  );
}
