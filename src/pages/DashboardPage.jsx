import React, { useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { StatCard } from '../components/common/StatCard';
import { ChartCard } from '../components/common/ChartCard';
import { FacultyCard } from '../components/faculty/FacultyCard';
import { FacultyBarChart } from '../components/charts/FacultyBarChart';
import { ParameterRadarChart } from '../components/charts/ParameterRadarChart';
import { FeedbackTrendLineChart } from '../components/charts/FeedbackTrendLineChart';
import { RatingDistributionDonut } from '../components/charts/RatingDistributionDonut';
import { DepartmentBarChart } from '../components/charts/DepartmentBarChart';
import { SemesterBarChart } from '../components/charts/SemesterBarChart';
import { DataProvenanceBadge } from '../components/research/DataProvenanceBadge';
import {
  Users,
  BookOpen,
  MessageSquare,
  Star,
  Award,
  AlertTriangle,
  ArrowRight,
  Brain,
  MousePointerClick,
  FileCheck2,
  Sparkles,
  FlaskConical
} from 'lucide-react';
import { PARAMETER_KEYS, calculateParameterAverage } from '../utils/calculations';

export function DashboardPage() {
  const navigate = useNavigate();
  const {
    overallMetrics,
    rankedFaculty,
    departmentStats,
    semesterStats,
    feedbackTrend,
    ratingDistribution,
    topPerformingFaculty,
    improvementFaculty,
    feedback,
    settings
  } = useData();

  // Institution-wide parameter averages for the Radar Chart
  const institutionalParameterAverages = useMemo(() => {
    const averages = {};
    PARAMETER_KEYS.forEach(key => {
      averages[key] = calculateParameterAverage(feedback, key);
    });
    return averages;
  }, [feedback]);

  return (
    <div className="space-y-8 pb-10">
      {/* Top Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-bold mb-1.5">
            <FlaskConical className="w-3.5 h-3.5 text-indigo-600" />
            <span>Supporting Academic Oversight Tool</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Institutional Educational Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Supporting academic oversight interface for aggregate performance metrics, learning patterns, and teaching evaluation benchmarks.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/research"
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-colors flex items-center gap-1.5"
          >
            <FlaskConical className="w-3.5 h-3.5" />
            <span>Research Overview</span>
          </Link>
          <Link
            to="/reports"
            className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-xs"
          >
            Export Reports
          </Link>
        </div>
      </div>

      {/* Data Provenance Badge */}
      <DataProvenanceBadge
        state={overallMetrics.collectedFeedbackCount > 0 ? "collected" : "demo"}
        label={
          overallMetrics.collectedFeedbackCount > 0
            ? "Institutional Evaluation Dataset"
            : "Demo Evaluation Dataset — Not an Experimental Finding"
        }
        sampleSize={
          overallMetrics.collectedFeedbackCount > 0
            ? overallMetrics.collectedFeedbackCount
            : overallMetrics.demoFeedbackCount
        }
      />

      {/* 4 Main KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Faculty"
          value={overallMetrics.totalFaculty}
          subtitle="Across 5 departments"
          icon={Users}
          color="indigo"
        />

        <StatCard
          title="Total Subjects"
          value={overallMetrics.totalSubjects}
          subtitle="All semesters (1–8)"
          icon={BookOpen}
          color="blue"
        />

        <StatCard
          title="Total Feedback"
          value={
            overallMetrics.collectedFeedbackCount > 0
              ? overallMetrics.collectedFeedbackCount
              : "0 Collected"
          }
          subtitle={
            overallMetrics.collectedFeedbackCount > 0
              ? `${overallMetrics.collectedFeedbackCount} collected • ${overallMetrics.demoFeedbackCount} demo records`
              : `0 collected participant records (${overallMetrics.demoFeedbackCount} demo)`
          }
          icon={MessageSquare}
          color="emerald"
        />

        <StatCard
          title="Average Rating"
          value={`${overallMetrics.averageRating.toFixed(2)}`}
          subtitle={`${overallMetrics.overallPercentage.toFixed(1)}% Institutional Satisfaction`}
          icon={Star}
          color="amber"
          badge="/ 5.0"
        />
      </div>

      {/* Connected Research Modules */}
      <div className="bg-slate-100/70 dark:bg-slate-900/60 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Connected Research Modules
            </h2>
          </div>
          <span className="text-xs font-semibold text-slate-400">
            Pillars of the StudySnippet research prototype
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Link
            to="/misconceptions"
            className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 shadow-xs transition-all space-y-1.5 group"
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center">
                <Brain className="w-4 h-4" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white">
              Misconception Analytics
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Analyze engineered cognitive distractors, error rates, and immediate retake testing effect.
            </p>
          </Link>

          <Link
            to="/hci-research"
            className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-400 shadow-xs transition-all space-y-1.5 group"
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
                <MousePointerClick className="w-4 h-4" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white">
              HCI & Usability Study
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              System Usability Scale (SUS) benchmarking, interface efficiency, and cognitive load assessment.
            </p>
          </Link>

          <Link
            to="/pedagogical-adjustments"
            className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-purple-400 shadow-xs transition-all space-y-1.5 group"
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center">
                <FileCheck2 className="w-4 h-4" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white">
              Feedback-to-Action Loop
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Documented pedagogical adjustments closing the loop between student feedback and teaching interventions.
            </p>
          </Link>
        </div>
      </div>

      {/* Top Performing & Faculty Requiring Improvement Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Faculty */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Top Performing Faculty
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Highest aggregate ratings (Min. {settings?.minFeedbackThreshold || 5} evaluations)
                </p>
              </div>
            </div>
            <Link
              to="/faculty"
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>See all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {topPerformingFaculty.slice(0, 2).map((item) => (
              <FacultyCard key={item.faculty.id} item={item} rankBadge={true} />
            ))}
            {topPerformingFaculty.length === 0 && (
              <p className="col-span-2 text-xs text-slate-400 py-6 text-center">
                No faculty meet the Top Performing threshold yet.
              </p>
            )}
          </div>
        </div>

        {/* Faculty Requiring Improvement */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Faculty Requiring Improvement
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Targeted mentoring & pedagogical support focus
                </p>
              </div>
            </div>
            <Link
              to="/faculty"
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>Audit</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {improvementFaculty.slice(0, 2).map((item) => (
              <FacultyCard key={item.faculty.id} item={item} />
            ))}
            {improvementFaculty.length === 0 && (
              <p className="col-span-2 text-xs text-slate-400 py-6 text-center">
                All faculty currently meet or exceed strong performance targets.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 6 Recharts Charts Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Performance Analytics & Trends
          </h2>
          <span className="text-xs text-slate-400">
            Dynamically computed from {overallMetrics.totalFeedback} submissions
          </span>
        </div>

        {/* Chart Row 1: Faculty Rating Bar & Parameter Radar */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard
            title="Faculty Average Rating"
            subtitle="Overall rating score comparison across top evaluated professors"
            action={
              <Link to="/faculty" className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                Full Roster →
              </Link>
            }
          >
            <FacultyBarChart
              data={rankedFaculty}
              onSelectFaculty={(id) => navigate(`/faculty/${id}`)}
            />
          </ChartCard>

          <ChartCard
            title="Parameter Performance Radar"
            subtitle="Campus-wide assessment across the 6 academic criteria"
          >
            <ParameterRadarChart
              parameterAverages={institutionalParameterAverages}
              title="Campus Average"
            />
          </ChartCard>
        </div>

        {/* Chart Row 2: Monthly Feedback Trend & Rating Distribution Donut */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard
            title="Feedback Volume & Rating Trend"
            subtitle="Monthly student participation alongside average rating trajectory"
          >
            <FeedbackTrendLineChart trendData={feedbackTrend} />
          </ChartCard>

          <ChartCard
            title="Rating Distribution Breakdown"
            subtitle="Percentage share of 1 to 5 star scores awarded"
          >
            <RatingDistributionDonut distribution={ratingDistribution} />
          </ChartCard>
        </div>

        {/* Chart Row 3: Department Performance & Semester Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard
            title="Department Performance Benchmark"
            subtitle="Comparative average ratings across academic departments"
            action={
              <Link to="/reports" className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                Department Report →
              </Link>
            }
          >
            <DepartmentBarChart departmentStats={departmentStats} />
          </ChartCard>

          <ChartCard
            title="Semester-Wise Performance"
            subtitle="Average student satisfaction and performance across semesters"
            action={
              <Link to="/reports" className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                Semester Report →
              </Link>
            }
          >
            <SemesterBarChart semesterStats={semesterStats} />
          </ChartCard>
        </div>
      </div>
    </div>
  );
}
