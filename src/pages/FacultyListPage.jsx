import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { FacultyTable } from '../components/faculty/FacultyTable';
import { FilterBar } from '../components/faculty/FilterBar';
import { Users, UserCheck, AlertCircle } from 'lucide-react';

export function FacultyListPage() {
  const { rankedFaculty, departments, subjects } = useData();
  const { isAdmin } = useAuth();

  // Filter states
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [subject, setSubject] = useState('');
  const [semester, setSemester] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const hasActiveFilters = Boolean(
    search || department || subject || semester || ratingFilter || statusFilter
  );

  const handleClearFilters = () => {
    setSearch('');
    setDepartment('');
    setSubject('');
    setSemester('');
    setRatingFilter('');
    setStatusFilter('');
  };

  // Filtered faculty list
  const filteredFaculty = useMemo(() => {
    return rankedFaculty.filter((item) => {
      const { faculty, overallAverage, statusInfo } = item;

      // Search
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesName = faculty.name.toLowerCase().includes(q);
        const matchesDesig = faculty.designation.toLowerCase().includes(q);
        if (!matchesName && !matchesDesig) return false;
      }

      // Department
      if (department && faculty.departmentId !== department) {
        return false;
      }

      // Subject
      if (subject) {
        const teachesSubject = subjects.some(
          s => s.id === subject && s.facultyIds && s.facultyIds.includes(faculty.id)
        );
        if (!teachesSubject) return false;
      }

      // Semester
      if (semester) {
        const teachesSemester = subjects.some(
          s => Number(s.semester) === Number(semester) && s.facultyIds && s.facultyIds.includes(faculty.id)
        );
        if (!teachesSemester) return false;
      }

      // Rating Filter
      if (ratingFilter) {
        if (ratingFilter === '4.5' && overallAverage < 4.5) return false;
        if (ratingFilter === '4.0' && overallAverage < 4.0) return false;
        if (ratingFilter === '3.5' && overallAverage < 3.5) return false;
        if (ratingFilter === '3.0' && overallAverage < 3.0) return false;
        if (ratingFilter === 'below3' && overallAverage >= 3.0) return false;
      }

      // Status Filter
      if (statusFilter && statusInfo.code !== statusFilter) {
        return false;
      }

      return true;
    });
  }, [rankedFaculty, search, department, subject, semester, ratingFilter, statusFilter, subjects]);

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {isAdmin ? 'Faculty Directory & Performance Rankings' : 'Faculty Directory'}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {isAdmin
              ? 'Complete academic roster with dynamic evaluation ranks, parameter scores, and granular filters.'
              : 'Complete academic roster with departments, designations, and assigned courses.'}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>Showing <strong className="text-slate-900 dark:text-white">{filteredFaculty.length}</strong> of {rankedFaculty.length} faculty</span>
        </div>
      </div>

      {/* Filter toolbar */}
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        department={department}
        onDepartmentChange={setDepartment}
        subject={subject}
        onSubjectChange={setSubject}
        semester={semester}
        onSemesterChange={setSemester}
        ratingFilter={ratingFilter}
        onRatingFilterChange={setRatingFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onClearFilters={handleClearFilters}
        departments={departments}
        subjects={subjects}
        hasActiveFilters={hasActiveFilters}
        isAdmin={isAdmin}
      />

      {/* Faculty Table */}
      <FacultyTable
        rankedFaculty={filteredFaculty}
        departments={departments}
        subjects={subjects}
        isAdmin={isAdmin}
      />
    </div>
  );
}
