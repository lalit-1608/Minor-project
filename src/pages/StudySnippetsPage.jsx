import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getStudySnippets } from '../services/learningContentService';
import { DataProvenanceBadge } from '../components/research/DataProvenanceBadge';
import {
  BookOpen,
  Brain,
  Search,
  Filter,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  GraduationCap,
  FlaskConical,
  Edit2
} from 'lucide-react';

export function StudySnippetsPage() {
  const { role } = useAuth();
  const navigate = useNavigate();

  const [selectedSubject, setSelectedSubject] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Load published snippets
  const snippets = useMemo(() => {
    return getStudySnippets({ status: 'published' });
  }, []);

  // Filter snippets
  const filteredSnippets = useMemo(() => {
    return snippets.filter(s => {
      if (selectedSubject !== 'ALL' && s.subjectCode !== selectedSubject) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = s.title && s.title.toLowerCase().includes(q);
        const matchesTopic = s.topic && s.topic.toLowerCase().includes(q);
        const matchesContent = s.shortContent && s.shortContent.toLowerCase().includes(q);
        const matchesCode = s.subjectCode && s.subjectCode.toLowerCase().includes(q);
        if (!matchesTitle && !matchesTopic && !matchesContent && !matchesCode) {
          return false;
        }
      }
      return true;
    });
  }, [snippets, selectedSubject, searchQuery]);

  // Unique subjects
  const subjectsList = ['ALL', 'CS501', 'CS701', 'IT401'];

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-bold mb-1.5">
            <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
            <span>Targeted Conceptual Remediation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Study Snippets Library
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Bite-sized diagnostic study materials designed by faculty researchers. Each snippet addresses specific cognitive pitfalls and formalizes nuanced technical concepts.
          </p>
        </div>

        {role === 'faculty' && (
          <Link
            to="/educator/content"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all self-start sm:self-auto"
          >
            <Edit2 className="w-4 h-4" />
            <span>Author New Snippet</span>
          </Link>
        )}
      </div>

      {/* Search & Subject Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        {/* Subject Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {subjectsList.map((code) => (
            <button
              key={code}
              onClick={() => setSelectedSubject(code)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                selectedSubject === code
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {code === 'ALL' ? 'All Courses' : code}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search concept or topic..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Snippets Grid */}
      {filteredSnippets.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
          <BookOpen className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">
            No Study Snippets Found
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            No snippets matched your search criteria. Try selecting another course or clearing your search query.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredSnippets.map((snp) => (
            <div
              key={snp.id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4 flex flex-col justify-between hover:border-indigo-300 dark:hover:border-indigo-800 transition-all"
            >
              <div className="space-y-3">
                {/* Course Header */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-black bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                      {snp.subjectCode}
                    </span>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                      {snp.subjectName}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400">
                    Topic: {snp.topic}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                  {snp.title}
                </h2>

                {/* Content */}
                <div className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60">
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                    {snp.shortContent}
                  </p>
                </div>

                {/* Key Diagnostic Points */}
                {snp.keyPoints && snp.keyPoints.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Key Takeaways for Diagnostic Calibration:
                    </span>
                    <ul className="space-y-1.5">
                      {snp.keyPoints.map((point, pIdx) => (
                        <li
                          key={pIdx}
                          className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Bottom Actions & Provenance */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between flex-wrap gap-2 text-xs">
                <span className="text-[11px] text-slate-400">
                  Curated by {snp.createdByFacultyName || 'Mr. Ashok Rathi'}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      navigate('/quiz', {
                        state: {
                          filterSubjectCode: snp.subjectCode,
                          subjectCode: snp.subjectCode,
                          snippetTitle: snp.title
                        }
                      });
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-bold transition-all cursor-pointer"
                  >
                    <Brain className="w-3.5 h-3.5" />
                    <span>Test This Concept</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Point 4 Research Note */}
      <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-900/60 text-xs space-y-2">
        <div className="flex items-center gap-1.5 font-bold text-indigo-900 dark:text-indigo-200">
          <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
          <span>Pedagogical Remediation Loop</span>
        </div>
        <p className="text-indigo-800/80 dark:text-indigo-300/80 text-[11px] leading-relaxed">
          Study Snippets provide targeted micro-learning interventions mapped directly to cognitive trap taxonomies, enabling learners to reconstruct mental models before assessment. This closes the feedback-to-learning loop in fulfillment of University Point 4.
        </p>
      </div>
    </div>
  );
}

export default StudySnippetsPage;
