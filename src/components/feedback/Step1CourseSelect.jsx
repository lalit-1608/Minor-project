import React, { useMemo } from 'react';
import { BookOpen, GraduationCap, Building2, Calendar, Users, ArrowRight, CheckCircle2 } from 'lucide-react';

export function Step1CourseSelect({
  formData,
  setFormData,
  onContinue,
  departments = [],
  facultyList = [],
  subjectsList = [],
  classesMap = {},
  isStudentLocked = false
}) {
  const { departmentId, semester, className, facultyId, subjectId } = formData;

  // Selected entities for the Summary Card and dependencies
  const selectedDept = departments.find(d => d.id === departmentId);
  const selectedSubject = subjectsList.find(s => s.id === subjectId);

  // Filter available classes based on department
  const availableClasses = useMemo(() => {
    if (!departmentId) return [];
    return classesMap[departmentId] || ['Section-A', 'Section-B'];
  }, [departmentId, classesMap]);

  // Filter available subjects strictly based on department and semester
  const selectableSubjects = useMemo(() => {
    return subjectsList.filter(sub => {
      const matchesDept = !departmentId || sub.departmentId === departmentId;
      const matchesSem = !semester || Number(sub.semester) === Number(semester);
      return matchesDept && matchesSem;
    });
  }, [departmentId, semester, subjectsList]);

  // Filter available faculty strictly based on the chosen subject's facultyIds
  const availableFaculty = useMemo(() => {
    if (selectedSubject && selectedSubject.facultyIds && selectedSubject.facultyIds.length > 0) {
      return facultyList.filter(f => selectedSubject.facultyIds.includes(f.id));
    }
    if (departmentId) {
      return facultyList.filter(f => f.departmentId === departmentId);
    }
    return facultyList;
  }, [selectedSubject, departmentId, facultyList]);

  const selectedFaculty = facultyList.find(f => f.id === facultyId);

  const isComplete = departmentId && semester && className && facultyId && subjectId;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isComplete) {
      onContinue();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-5">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Select Course & Faculty
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Choose your academic parameters. All evaluations remain strictly anonymous.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Department Select */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                Department <span className="text-rose-500">*</span>
              </span>
              {isStudentLocked && (
                <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">Enrolled</span>
              )}
            </label>
            <select
              value={departmentId}
              disabled={isStudentLocked}
              onChange={(e) => {
                const newDept = e.target.value;
                setFormData(prev => ({
                  ...prev,
                  departmentId: newDept,
                  className: '',
                  facultyId: '',
                  subjectId: ''
                }));
              }}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-75 disabled:bg-slate-50 dark:disabled:bg-slate-800/60"
            >
              <option value="">Select Department...</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name} ({dept.code})
                </option>
              ))}
            </select>
          </div>

          {/* Semester Select */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                Semester <span className="text-rose-500">*</span>
              </span>
              {isStudentLocked && (
                <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">Current</span>
              )}
            </label>
            <select
              value={semester}
              disabled={isStudentLocked}
              onChange={(e) => {
                setFormData(prev => ({
                  ...prev,
                  semester: e.target.value,
                  subjectId: '',
                  facultyId: ''
                }));
              }}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-75 disabled:bg-slate-50 dark:disabled:bg-slate-800/60"
            >
              <option value="">Select Semester...</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                <option key={sem} value={sem}>
                  Semester {sem}
                </option>
              ))}
            </select>
          </div>

          {/* Class Select */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-indigo-600" />
                Class / Section <span className="text-rose-500">*</span>
              </span>
              {isStudentLocked && (
                <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">Assigned</span>
              )}
            </label>
            <select
              value={className}
              disabled={isStudentLocked || !departmentId}
              onChange={(e) => setFormData(prev => ({ ...prev, className: e.target.value }))}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-75 disabled:bg-slate-50 dark:disabled:bg-slate-800/60"
            >
              <option value="">Select Class Section...</option>
              {availableClasses.map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
          </div>

          {/* Subject Select (Prioritized so faculty is filtered accurately) */}
          <div className="space-y-1.5 sm:col-span-2 lg:col-span-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
              Subject / Course <span className="text-rose-500">*</span>
            </label>
            <select
              value={subjectId}
              onChange={(e) => {
                const newSubId = e.target.value;
                const sub = subjectsList.find(s => s.id === newSubId);
                let newFacId = '';
                if (sub && sub.facultyIds && sub.facultyIds.length > 0) {
                  if (sub.facultyIds.includes(facultyId)) {
                    newFacId = facultyId;
                  } else if (sub.facultyIds.length === 1) {
                    newFacId = sub.facultyIds[0];
                  }
                }
                setFormData(prev => ({
                  ...prev,
                  subjectId: newSubId,
                  facultyId: newFacId
                }));
              }}
              required
              disabled={!semester || !departmentId}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              <option value="">Select Subject for Semester {semester}...</option>
              {selectableSubjects.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.code}: {sub.name} (Sem {sub.semester})
                </option>
              ))}
            </select>
          </div>

          {/* Faculty Select (Filtered strictly by selected subject) */}
          <div className="space-y-1.5 sm:col-span-2 lg:col-span-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
              Faculty Member <span className="text-rose-500">*</span>
            </label>
            <select
              value={facultyId}
              onChange={(e) => {
                const newFac = e.target.value;
                setFormData(prev => ({
                  ...prev,
                  facultyId: newFac
                }));
              }}
              required
              disabled={!subjectId}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              <option value="">{subjectId ? 'Select Faculty for this Course...' : 'Select Course first...'}</option>
              {availableFaculty.map((fac) => (
                <option key={fac.id} value={fac.id}>
                  {fac.name} — {fac.designation}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Selected Course Summary Card */}
      <div className={`p-5 rounded-2xl border transition-all ${
        isComplete
          ? 'bg-indigo-50/60 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800'
          : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800'
      }`}>
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle2 className={`w-4 h-4 ${isComplete ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Selected Course Information Summary
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Department</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block">
              {selectedDept ? selectedDept.name : '—'}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Semester</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 block">
              {semester ? `Semester ${semester}` : '—'}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Class Section</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 block">
              {className || '—'}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Faculty</span>
            <span className="font-semibold text-indigo-700 dark:text-indigo-300 truncate block">
              {selectedFaculty ? selectedFaculty.name : '—'}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Subject</span>
            <span className="font-semibold text-indigo-700 dark:text-indigo-300 truncate block">
              {selectedSubject ? `${selectedSubject.code} ${selectedSubject.name}` : '—'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={!isComplete}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-sm shadow-md shadow-indigo-200 dark:shadow-none transition-all cursor-pointer disabled:cursor-not-allowed"
        >
          <span>Continue to Ratings</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}
