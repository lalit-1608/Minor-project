import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getCourseCurriculum } from '../../services/courseCurriculum';
import {
  X,
  BookOpen,
  Layers,
  Award,
  BookMarked,
  Users,
  Star,
  CheckCircle2,
  Clock,
  FlaskConical,
  MessageSquare,
  ArrowRight,
  Sparkles,
  ChevronDown,
  ChevronRight,
  GraduationCap
} from 'lucide-react';

export function CourseDetailModal({
  subject,
  department,
  assignedFaculty = [],
  feedback = [],
  isOpen,
  onClose
}) {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('syllabus');
  const [expandedUnit, setExpandedUnit] = useState(1);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !subject) return null;

  const curriculum = getCourseCurriculum(subject);
  const subjectFeedback = feedback.filter(fb => fb.subjectId === subject.id);
  const avgRating = subjectFeedback.length > 0
    ? (subjectFeedback.reduce((acc, curr) => {
        const ratings = Object.values(curr.ratings);
        return acc + ratings.reduce((a, b) => a + b, 0) / ratings.length;
      }, 0) / subjectFeedback.length).toFixed(2)
    : '4.50';

  const handleRateTeacher = () => {
    onClose();
    navigate('/feedback', {
      state: {
        preselectedDept: subject.departmentId,
        preselectedSubject: subject.id,
        preselectedSemester: subject.semester
      }
    });
  };

  const handleTakeQuiz = () => {
    onClose();
    navigate('/quiz');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white dark:bg-slate-900 w-full max-w-4xl lg:max-w-5xl rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="p-5 sm:p-6 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between gap-4 shrink-0">
          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-indigo-600 text-white tracking-wide shadow-xs">
                {subject.code}
              </span>
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
                Semester {subject.semester}
              </span>
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                {curriculum.credits}
              </span>
              <span className="text-xs text-slate-400 hidden sm:inline">
                • {department?.name || 'Department'}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight break-words">
              {subject.name}
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2">
              {curriculum.description}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Assigned Teachers Bar */}
        <div className="px-5 sm:px-6 py-2.5 bg-indigo-50/50 dark:bg-indigo-950/30 border-b border-indigo-100 dark:border-indigo-900/50 flex flex-wrap items-center justify-between gap-2 text-xs shrink-0">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-600" />
            <span className="font-bold text-slate-700 dark:text-slate-300">Faculty In-Charge:</span>
            <div className="flex flex-wrap items-center gap-2">
              {assignedFaculty.map(f => (
                <button
                  key={f.id}
                  onClick={() => {
                    onClose();
                    navigate(`/faculty/${f.id}`);
                  }}
                  className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 font-medium text-slate-800 dark:text-slate-200 transition-colors"
                >
                  <img src={f.avatar} alt={f.name} className="w-4 h-4 rounded-full object-cover" />
                  <span>{f.name}</span>
                  <span className="text-[10px] text-indigo-500">Profile →</span>
                </button>
              ))}
              {assignedFaculty.length === 0 && (
                <span className="text-slate-400 italic">Faculty team assignment pending</span>
              )}
            </div>
          </div>

          {isAdmin ? (
            <div className="flex items-center gap-1 font-bold text-slate-700 dark:text-slate-300">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{avgRating} / 5.0</span>
              <span className="text-[11px] text-slate-400 font-normal">({subjectFeedback.length} ratings)</span>
            </div>
          ) : (
            <div className="text-xs text-slate-500 font-medium">
              {subjectFeedback.length} student comment{subjectFeedback.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="px-5 sm:px-6 py-2.5 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-2 shrink-0 bg-slate-50/50 dark:bg-slate-900/50">
          <button
            type="button"
            onClick={() => setActiveTab('syllabus')}
            className={`px-3.5 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center gap-2 shrink-0 border ${
              activeTab === 'syllabus'
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                : 'bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700/80 hover:bg-slate-100 dark:hover:bg-slate-700/60 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4 shrink-0" />
            <span>Units & Chapters (Syllabus)</span>
            <span
              className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${
                activeTab === 'syllabus'
                  ? 'bg-indigo-500 text-white'
                  : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-200'
              }`}
            >
              5
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('exam')}
            className={`px-3.5 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center gap-2 shrink-0 border ${
              activeTab === 'exam'
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                : 'bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700/80 hover:bg-slate-100 dark:hover:bg-slate-700/60 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Award className="w-4 h-4 shrink-0" />
            <span>Marks & Exam Scheme</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('books')}
            className={`px-3.5 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center gap-2 shrink-0 border ${
              activeTab === 'books'
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                : 'bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700/80 hover:bg-slate-100 dark:hover:bg-slate-700/60 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BookMarked className="w-4 h-4 shrink-0" />
            <span>Textbooks & Notes</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('reviews')}
            className={`px-3.5 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center gap-2 shrink-0 border ${
              activeTab === 'reviews'
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                : 'bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700/80 hover:bg-slate-100 dark:hover:bg-slate-700/60 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4 shrink-0" />
            <span>Student Comments</span>
            <span
              className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${
                activeTab === 'reviews'
                  ? 'bg-indigo-500 text-white'
                  : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
              }`}
            >
              {subjectFeedback.length}
            </span>
          </button>
        </div>

        {/* Tab Contents: Scrollable */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 min-h-0 space-y-4">
          {/* TAB 1: SYLLABUS & UNITS */}
          {activeTab === 'syllabus' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Click any Unit to view its full chapter breakdown and practical lab.</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Total: {curriculum.totalHours}
                </span>
              </div>

              <div className="space-y-2.5">
                {curriculum.units.map((unit) => {
                  const isExpanded = expandedUnit === unit.unitNumber;

                  return (
                    <div
                      key={unit.unitNumber}
                      className={`rounded-2xl border transition-all ${
                        isExpanded
                          ? 'border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/20 shadow-xs'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300'
                      }`}
                    >
                      {/* Unit Header Bar (Clickable) */}
                      <button
                        type="button"
                        onClick={() => setExpandedUnit(isExpanded ? null : unit.unitNumber)}
                        className="w-full p-4 text-left flex items-center justify-between gap-3 focus:outline-none"
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black ${
                              isExpanded
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                            }`}
                          >
                            {unit.unitNumber}
                          </span>
                          <div>
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                              {unit.title}
                            </h3>
                            <p className="text-[11px] text-slate-500 line-clamp-1">
                              {unit.summary}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs font-bold text-slate-500 inline-flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {unit.duration}
                          </span>
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-indigo-600" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                      </button>

                      {/* Expanded Unit Details */}
                      {isExpanded && (
                        <div className="px-4 pb-4 pt-1 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
                          {/* Chapters List */}
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                              Chapters & Topics Included:
                            </span>
                            <div className="space-y-1.5">
                              {unit.chapters.map((chapter, cIdx) => (
                                <div
                                  key={cIdx}
                                  className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800/80 p-2 rounded-xl border border-slate-100 dark:border-slate-800"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                                  <span>{chapter}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Key Topics Badges */}
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                              Important Focus Concepts:
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {unit.keyConcepts.map((concept, kIdx) => (
                                <span
                                  key={kIdx}
                                  className="px-2 py-0.5 rounded-lg text-[11px] font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
                                >
                                  {concept}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Practical Lab Highlight */}
                          {unit.labPractice && (
                            <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 flex items-start gap-2.5">
                              <FlaskConical className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                              <div className="text-xs">
                                <span className="font-bold text-amber-900 dark:text-amber-200 block">
                                  Lab Practical / Coding Task:
                                </span>
                                <span className="text-amber-800 dark:text-amber-300">
                                  {unit.labPractice}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: MARKS & EXAM SCHEME */}
          {activeTab === 'exam' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                  Marks & Evaluation Breakdown
                </h3>
                <p className="text-xs text-slate-500">
                  Official college distribution for semester grading out of 100 marks total.
                </p>
              </div>

              {/* Visual Percentage Bar */}
              <div className="h-4 rounded-full overflow-hidden flex shadow-inner">
                {curriculum.gradingScheme.map((item, idx) => {
                  const colors = ['bg-indigo-600', 'bg-emerald-500', 'bg-amber-500', 'bg-purple-600'];
                  return (
                    <div
                      key={idx}
                      style={{ width: `${item.weight}%` }}
                      className={`${colors[idx % colors.length]} relative group`}
                      title={`${item.component}: ${item.weight}%`}
                    />
                  );
                })}
              </div>

              {/* Scheme Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {curriculum.gradingScheme.map((item, idx) => {
                  const colorBorders = ['border-indigo-500', 'border-emerald-500', 'border-amber-500', 'border-purple-500'];
                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-2xl bg-white dark:bg-slate-800/80 border-l-4 ${colorBorders[idx % colorBorders.length]} border-y border-r border-slate-200 dark:border-slate-700 shadow-xs space-y-1`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {item.component}
                        </span>
                        <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">
                          {item.weight}%
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {item.description}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Learning Outcomes */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-indigo-600" />
                  What You Will Master by Course Completion:
                </span>
                <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  {curriculum.learningOutcomes.map((outcome, oIdx) => (
                    <li key={oIdx} className="flex items-start gap-2">
                      <span className="text-indigo-500 font-bold">•</span>
                      <span>{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* TAB 3: TEXTBOOKS & STUDY MATERIAL */}
          {activeTab === 'books' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                  Prescribed Textbooks & Reading
                </h3>
                <p className="text-xs text-slate-500">
                  University library and standard reference recommendations.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">
                    ⭐ Primary Prescribed Textbook:
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {curriculum.books.primary}
                  </h4>
                  <p className="text-xs text-slate-500">
                    Follows university syllabus outline directly. Available in college physical & digital library.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 block">
                    📖 Recommended Reference Book:
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {curriculum.books.reference}
                  </h4>
                  <p className="text-xs text-slate-500">
                    Great for deep industry perspective, advanced problem solving, and research projects.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs space-y-1">
                  <span className="font-bold text-indigo-900 dark:text-indigo-200 block">
                    Course Prerequisites:
                  </span>
                  <span className="text-indigo-700 dark:text-indigo-300">
                    {curriculum.prerequisites}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: STUDENT REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-0.5">
                    Anonymous Student Opinions
                  </h3>
                  <p className="text-xs text-slate-500">
                    Anonymous feedback submitted by classmates for this course (student identity is not stored).
                  </p>
                </div>
                <button
                  onClick={handleRateTeacher}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors"
                >
                  + Add Your Review
                </button>
              </div>

              {subjectFeedback.length === 0 ? (
                <div className="p-8 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 text-xs text-slate-400">
                  No written comments submitted for this course yet. Be the first student to review!
                </div>
              ) : (
                <div className="space-y-2.5">
                  {subjectFeedback.map((fb, idx) => {
                    const avg = (Object.values(fb.ratings).reduce((a, b) => a + b, 0) / 6).toFixed(1);
                    return (
                      <div
                        key={fb.id || idx}
                        className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs space-y-1.5 shadow-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-slate-500">
                            Verified Student Review • {fb.className || 'Class'}
                          </span>
                          {isAdmin && (
                            <span className="inline-flex items-center gap-1 font-bold text-amber-500 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-md">
                              <Star className="w-3 h-3 fill-amber-400" />
                              {avg}
                            </span>
                          )}
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 italic">
                          "{fb.comment || (isAdmin ? 'Ratings provided across all 6 core instructional parameters.' : 'Student feedback submitted anonymously.')}"
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Bottom Action Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500 hidden sm:block">
            Course ID: <code className="font-mono text-slate-700 dark:text-slate-300">{subject.id}</code>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={handleTakeQuiz}
              className="px-3.5 py-2 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-bold hover:bg-indigo-100 transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Practice Quiz</span>
            </button>

            <button
              onClick={handleRateTeacher}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
            >
              <span>Submit Course Feedback</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
