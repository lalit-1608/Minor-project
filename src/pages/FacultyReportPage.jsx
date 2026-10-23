import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { PerformanceBadge } from '../components/common/PerformanceBadge';
import { RatingSummary } from '../components/common/RatingSummary';
import { ChartCard } from '../components/common/ChartCard';
import { ParameterRadarChart } from '../components/charts/ParameterRadarChart';
import { FeedbackTrendLineChart } from '../components/charts/FeedbackTrendLineChart';
import {
  PARAMETER_KEYS,
  PARAMETER_LABELS,
  getStrongestParameters,
  getWeakestParameters,
  calculateFeedbackTrend
} from '../utils/calculations';
import { analyzeSentiment } from '../utils/sentiment';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Calendar,
  BookOpen,
  Award,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  MessageSquare,
  Search,
  Filter,
  ShieldCheck,
  CheckCircle2,
  FileCheck2,
  Brain
} from 'lucide-react';

export function FacultyReportPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { faculty, feedback, departments, subjects, rankedFaculty, adjustments } = useData();
  const { isAdmin, isFaculty, isStudent, currentUser } = useAuth();

  const [sentimentFilter, setSentimentFilter] = useState('all');
  const [commentSearch, setCommentSearch] = useState('');

  // Access boundary enforcement
  const isUnauthorized = useMemo(() => {
    if (isAdmin) return false;
    if (isFaculty && currentUser?.facultyId && currentUser.facultyId !== id) {
      return {
        reason: 'faculty_mismatch',
        message: 'Access Restricted: Faculty researchers may only access their own individual teaching feedback dossier.',
        ownDossierPath: `/faculty/${currentUser.facultyId}`
      };
    }
    if (isStudent) {
      return {
        reason: 'student_restricted',
        message: 'Access Restricted: Individual faculty pedagogical dossiers are accessible to assigned educators and academic oversight only.',
        studentDashboardPath: '/my-learning'
      };
    }
    return false;
  }, [isAdmin, isFaculty, isStudent, currentUser, id]);

  // Find faculty details
  const facultyMember = faculty.find(f => f.id === id);
  const rankedItem = rankedFaculty.find(r => r.faculty.id === id);
  const dept = departments.find(d => d.id === facultyMember?.departmentId);
  const taughtSubjects = subjects.filter(s => s.facultyIds && s.facultyIds.includes(id));

  // Feedback records for this faculty
  const facultyFeedback = useMemo(() => {
    return feedback.filter(fb => fb.facultyId === id);
  }, [feedback, id]);

  // Analyzed comments
  const analyzedComments = useMemo(() => {
    return facultyFeedback
      .filter(fb => fb.comment && fb.comment.trim().length > 0)
      .map(fb => ({
        ...fb,
        analysis: analyzeSentiment(fb.comment)
      }));
  }, [facultyFeedback]);

  // Filtered comments
  const filteredComments = useMemo(() => {
    return analyzedComments.filter(item => {
      if (sentimentFilter !== 'all' && item.analysis.sentiment !== sentimentFilter) {
        return false;
      }
      if (commentSearch.trim()) {
        const q = commentSearch.toLowerCase();
        return item.comment.toLowerCase().includes(q);
      }
      return true;
    });
  }, [analyzedComments, sentimentFilter, commentSearch]);

  if (isUnauthorized) {
    return (
      <div className="py-16 max-w-lg mx-auto text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center border border-amber-200 dark:border-amber-800">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Access Restricted
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          {isUnauthorized.message}
        </p>
        <div className="pt-2 flex justify-center gap-3">
          {isUnauthorized.ownDossierPath && (
            <Link
              to={isUnauthorized.ownDossierPath}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-md hover:bg-indigo-500 transition-colors"
            >
              Go to My Teaching Dossier
            </Link>
          )}
          {isUnauthorized.studentDashboardPath && (
            <Link
              to={isUnauthorized.studentDashboardPath}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-md hover:bg-indigo-500 transition-colors"
            >
              Go to My Learning Dashboard
            </Link>
          )}
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold cursor-pointer"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  if (!facultyMember || !rankedItem) {
    return (
      <div className="py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">
          Faculty Member Not Found
        </h2>
        <p className="text-xs text-slate-500">The requested faculty profile does not exist.</p>
        <Link
          to="/faculty"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Faculty Roster</span>
        </Link>
      </div>
    );
  }

  const { overallAverage, percentage, feedbackCount, statusInfo, parameterAverages, rank } = rankedItem;
  const strongest = getStrongestParameters(parameterAverages);
  const weakest = getWeakestParameters(parameterAverages);
  const facultyTrend = calculateFeedbackTrend(facultyFeedback);

  return (
    <div className="space-y-8 pb-12">
      {/* Back Button & Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/faculty')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Faculty Roster</span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/misconceptions"
            className="px-3.5 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/60 dark:bg-indigo-950/40 text-xs font-semibold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 transition-colors inline-flex items-center gap-1.5"
          >
            <Brain className="w-3.5 h-3.5" />
            <span>Course Misconceptions</span>
          </Link>
          <Link
            to="/pedagogical-adjustments"
            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-semibold text-white shadow-xs transition-colors inline-flex items-center gap-1.5"
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Log Teaching Adjustment</span>
          </Link>
          {isAdmin && (
            <Link
              to="/compare"
              className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors"
            >
              Compare with Peers
            </Link>
          )}
        </div>
      </div>

      {/* Faculty Profile Hero Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-5">
            <img
              src={facultyMember.avatar}
              alt={facultyMember.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-4 ring-indigo-500/10 shadow-md shrink-0"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256';
              }}
            />
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {facultyMember.name}
                </h1>
                {isAdmin ? (
                  <PerformanceBadge statusInfo={statusInfo} size="md" />
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Active Faculty</span>
                  </span>
                )}
              </div>
              <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                {facultyMember.designation}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
                <span className="flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  {dept ? dept.name : 'Unknown Department'}
                </span>
                <span>•</span>
                <span>Experience: {facultyMember.experience || '10+ Years'}</span>
                {isAdmin && rank && typeof rank === 'number' && (
                  <>
                    <span>•</span>
                    <span className="font-bold text-amber-600 dark:text-amber-400">
                      Institutional Rank #{rank}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* KPI Triplet - Conditional based on isAdmin */}
          {isAdmin ? (
            <div className="flex items-center gap-4 sm:gap-6 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 self-stretch md:self-auto justify-around">
              <div className="text-center px-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Average Rating</span>
                <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  {overallAverage.toFixed(2)}
                </span>
                <span className="text-[10px] text-slate-400 block">out of 5.0</span>
              </div>

              <div className="w-px h-10 bg-slate-200 dark:bg-slate-700" />

              <div className="text-center px-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Score</span>
                <span className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400">
                  {percentage.toFixed(1)}%
                </span>
                <span className="text-[10px] text-slate-400 block">Performance</span>
              </div>

              <div className="w-px h-10 bg-slate-200 dark:bg-slate-700" />

              <div className="text-center px-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Evaluations</span>
                <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  {feedbackCount}
                </span>
                <span className="text-[10px] text-slate-400 block">Submissions</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4 sm:gap-6 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 self-stretch md:self-auto justify-around">
              <div className="text-center px-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Evaluations</span>
                <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  {feedbackCount}
                </span>
                <span className="text-[10px] text-slate-400 block">Student Reviews</span>
              </div>

              <div className="w-px h-10 bg-slate-200 dark:bg-slate-700" />

              <div className="text-center px-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Assigned Courses</span>
                <span className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400">
                  {taughtSubjects.length}
                </span>
                <span className="text-[10px] text-slate-400 block">Active Subjects</span>
              </div>

              <div className="w-px h-10 bg-slate-200 dark:bg-slate-700" />

              <div className="text-center px-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Ratings</span>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded-lg border border-amber-200 dark:border-amber-800 mt-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Principal Only</span>
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Confidential</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Courses Taught by this Faculty */}
      {taughtSubjects.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span>Assigned Courses & Syllabus</span>
            </h2>
            <Link
              to="/subjects"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1"
            >
              <span>View All College Courses</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {taughtSubjects.map((sub) => (
              <Link
                key={sub.id}
                to={`/subjects?id=${sub.id}`}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 hover:shadow-md transition-all space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-lg text-xs font-black bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                    {sub.code}
                  </span>
                  <span className="text-[11px] font-bold text-slate-400">
                    Sem {sub.semester}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                  {sub.name}
                </h3>
                <span className="text-xs font-bold text-indigo-600 inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  View 5 Units & Chapters →
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Six Educational Parameter Score Cards & Analytical Charts (Principal only) */}
      {isAdmin ? (
        <>
          <div className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Academic Parameter Performance
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {PARAMETER_KEYS.map((key) => {
                const score = parameterAverages[key] || 0;
                const pct = (score / 5) * 100;
                return (
                  <div
                    key={key}
                    className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        {PARAMETER_LABELS[key]}
                      </span>
                      <span className="text-base font-extrabold text-slate-900 dark:text-white">
                        {score.toFixed(2)}
                        <span className="text-xs font-normal text-slate-400"> / 5</span>
                      </span>
                    </div>

                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          score >= 4.0 ? 'bg-emerald-500' : score >= 3.5 ? 'bg-indigo-600' : score >= 3.0 ? 'bg-amber-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>Score: {pct.toFixed(0)}%</span>
                      <span>{score >= 4.0 ? 'Exceeds standard' : score >= 3.0 ? 'Meets standard' : 'Needs attention'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Strengths and Areas for Improvement (Calculated dynamically) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths */}
            <div className="bg-emerald-50/50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-200 dark:border-emerald-900/60 p-6 space-y-4">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
                <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-base font-bold">
                  Pedagogical Strengths
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Top parameters where students reported highest academic satisfaction:
              </p>
              <div className="space-y-2.5">
                {strongest.map((item, idx) => (
                  <div
                    key={item.key}
                    className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-emerald-100 dark:border-emerald-900/40 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center justify-center">
                        #{idx + 1}
                      </span>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {item.label}
                      </span>
                    </div>
                    <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                      {item.value.toFixed(2)} / 5.0
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Areas for Improvement */}
            <div className="bg-amber-50/50 dark:bg-amber-950/20 rounded-2xl border border-amber-200 dark:border-amber-900/60 p-6 space-y-4">
              <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300">
                <TrendingUp className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <h3 className="text-base font-bold">
                  Areas for Improvement
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Parameters identified as the primary opportunity focus for pedagogical growth:
              </p>
              <div className="space-y-2.5">
                {weakest.map((item, idx) => (
                  <div
                    key={item.key}
                    className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-amber-100 dark:border-amber-900/40 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 text-xs font-bold flex items-center justify-center">
                        #{idx + 1}
                      </span>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {item.label}
                      </span>
                    </div>
                    <span className="text-sm font-extrabold text-amber-600 dark:text-amber-400">
                      {item.value.toFixed(2)} / 5.0
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Charts for Faculty */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard
              title="Parameter Radar Profile"
              subtitle={`Detailed 6-criterion signature for ${facultyMember.name}`}
            >
              <ParameterRadarChart
                parameterAverages={parameterAverages}
                title={facultyMember.name}
              />
            </ChartCard>

            <ChartCard
              title="Monthly Feedback & Rating Trajectory"
              subtitle="Evaluation volume and satisfaction over recorded months"
            >
              <FeedbackTrendLineChart trendData={facultyTrend} />
            </ChartCard>
          </div>
        </>
      ) : (
        <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Ratings & Performance Scores Confidential</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
            Numerical star ratings, parameter evaluations, and comparative score rankings are confidential and visible exclusively to the College Principal. Students and teachers can view course details, qualitative comments, and teaching improvements below.
          </p>
        </div>
      )}

      {/* Anonymous Constructive Comments Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Anonymous Constructive Comments
              </h3>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                {analyzedComments.length} total
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Comments are displayed with transparent keyword-based sentiment categorizations. No student identity is recorded.
            </p>
          </div>

          {/* Sentiment Filter Pills */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs">
            <button
              onClick={() => setSentimentFilter('all')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                sentimentFilter === 'all'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              All ({analyzedComments.length})
            </button>
            <button
              onClick={() => setSentimentFilter('positive')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                sentimentFilter === 'positive'
                  ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Positive
            </button>
            <button
              onClick={() => setSentimentFilter('neutral')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                sentimentFilter === 'neutral'
                  ? 'bg-blue-600 text-white shadow-xs font-semibold'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Neutral
            </button>
            <button
              onClick={() => setSentimentFilter('attention')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                sentimentFilter === 'attention'
                  ? 'bg-amber-600 text-white shadow-xs font-semibold'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Needs Attention
            </button>
          </div>
        </div>

        {/* Comment Search Input */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={commentSearch}
            onChange={(e) => setCommentSearch(e.target.value)}
            placeholder="Search within comments..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Comments Grid */}
        <div className="space-y-3">
          {filteredComments.map((item) => {
            const subject = subjects.find(s => s.id === item.subjectId);
            const badgeColors = {
              positive: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
              neutral: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800',
              attention: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
            };

            return (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${badgeColors[item.analysis.sentiment]}`}>
                      {item.analysis.label}
                    </span>
                    <span className="text-slate-400 font-medium">
                      {subject ? `${subject.code} (${subject.name})` : `Semester ${item.semester}`}
                    </span>
                    <span className="text-slate-300 dark:text-slate-600">•</span>
                    <span className="text-slate-400 text-[11px]">{item.className}</span>
                  </div>
                  <span className="text-slate-400 text-[11px]">
                    {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed italic">
                  "{item.comment}"
                </p>
              </div>
            );
          })}

        </div>
      </div>

      {/* Pedagogical Teaching Adjustments Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-indigo-600" />
              <span>What This Teacher Improved in Class</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Real changes made to lectures and labs based on student feedback.
            </p>
          </div>

          <Link
            to="/pedagogical-adjustments"
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-xs transition-all w-fit"
          >
            <span>+ Log New Improvement</span>
          </Link>
        </div>

        <div className="space-y-3 pt-2">
          {(adjustments || []).filter(a => a.facultyId === id).map((adj) => (
            <div
              key={adj.id}
              className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-2"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {adj.subjectName} • {adj.thematicCategory}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  {adj.term} ({adj.week})
                </span>
              </div>

              <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                <p><strong>Feedback Pattern:</strong> <span className="italic text-slate-500 dark:text-slate-400">"{adj.feedbackPattern}"</span></p>
                <p><strong>Implemented Intervention:</strong> {adj.intervention}</p>
              </div>

              {adj.hodReviewed && (
                <div className="pt-1.5 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span><strong>HOD Verified:</strong> {adj.hodNotes}</span>
                </div>
              )}
            </div>
          ))}

          {(adjustments || []).filter(a => a.facultyId === id).length === 0 && (
            <div className="p-6 text-center text-xs text-slate-400 rounded-xl bg-slate-50/50 dark:bg-slate-800/30">
              No pedagogical teaching adjustments logged yet for this semester. Click above to document your first intervention.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
