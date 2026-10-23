// Centralized Calculation & Analytics Engine
// All performance metrics, rankings, and statistical distributions are derived here.

export const PARAMETER_KEYS = [
  'subjectKnowledge',
  'clarity',
  'communication',
  'engagement',
  'punctuality',
  'satisfaction'
];

export const PARAMETER_LABELS = {
  subjectKnowledge: 'Subject Knowledge',
  clarity: 'Explanation / Clarity',
  communication: 'Communication',
  engagement: 'Engagement',
  punctuality: 'Punctuality',
  satisfaction: 'Overall Satisfaction'
};

/**
 * Calculates overall average from sum of all 6 rating values divided by total count of ratings
 */
export function calculateOverallAverage(feedbackList) {
  if (!feedbackList || feedbackList.length === 0) return 0;

  let totalRatingSum = 0;
  let totalRatingCount = 0;

  feedbackList.forEach(fb => {
    PARAMETER_KEYS.forEach(key => {
      const val = fb.ratings?.[key];
      if (typeof val === 'number' && !isNaN(val)) {
        totalRatingSum += val;
        totalRatingCount += 1;
      }
    });
  });

  if (totalRatingCount === 0) return 0;
  return Number((totalRatingSum / totalRatingCount).toFixed(2));
}

/**
 * Calculates percentage: (overallAverage / 5) * 100
 */
export function calculatePercentage(overallAverage) {
  if (!overallAverage || isNaN(overallAverage)) return 0;
  return Number(((overallAverage / 5) * 100).toFixed(2));
}

/**
 * Calculates average for a single parameter
 */
export function calculateParameterAverage(feedbackList, paramKey) {
  if (!feedbackList || feedbackList.length === 0) return 0;

  let sum = 0;
  let count = 0;

  feedbackList.forEach(fb => {
    const val = fb.ratings?.[paramKey];
    if (typeof val === 'number' && !isNaN(val)) {
      sum += val;
      count += 1;
    }
  });

  if (count === 0) return 0;
  return Number((sum / count).toFixed(2));
}

/**
 * Resolves performance status based on score, threshold, and minimum feedback requirement
 */
export function getPerformanceStatus(overallAverage, feedbackCount, settings = {}) {
  const minThreshold = settings.minFeedbackThreshold ?? 5;
  const topThreshold = settings.topThreshold ?? 4.0;
  const strongThreshold = settings.strongThreshold ?? 3.5;
  const oppThreshold = settings.opportunityThreshold ?? 3.0;

  if (feedbackCount < minThreshold) {
    return {
      status: 'Insufficient Feedback',
      code: 'insufficient',
      color: 'slate',
      badgeClass: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
    };
  }

  if (overallAverage >= topThreshold) {
    return {
      status: 'Top Performing',
      code: 'top',
      color: 'emerald',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
    };
  } else if (overallAverage >= strongThreshold) {
    return {
      status: 'Strong Performance',
      code: 'strong',
      color: 'blue',
      badgeClass: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800'
    };
  } else if (overallAverage >= oppThreshold) {
    return {
      status: 'Opportunity for Improvement',
      code: 'opportunity',
      color: 'amber',
      badgeClass: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800'
    };
  } else {
    return {
      status: 'Requires Improvement',
      code: 'improvement',
      color: 'rose',
      badgeClass: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800'
    };
  }
}

/**
 * Calculates complete metrics for a single faculty member
 */
export function calculateFacultyStats(faculty, allFeedback, settings = {}) {
  const facultyFeedback = allFeedback.filter(fb => fb.facultyId === faculty.id);
  const feedbackCount = facultyFeedback.length;
  const overallAverage = calculateOverallAverage(facultyFeedback);
  const percentage = calculatePercentage(overallAverage);
  const statusInfo = getPerformanceStatus(overallAverage, feedbackCount, settings);

  const parameterAverages = {};
  PARAMETER_KEYS.forEach(key => {
    parameterAverages[key] = calculateParameterAverage(facultyFeedback, key);
  });

  return {
    facultyId: faculty.id,
    faculty,
    feedbackCount,
    overallAverage,
    percentage,
    statusInfo,
    parameterAverages,
    feedback: facultyFeedback
  };
}

/**
 * Calculates rankings for all faculty members:
 * 1. Overall average descending
 * 2. Feedback count descending
 * Faculty with insufficient feedback are placed at bottom or excluded from top rankings.
 */
export function calculateFacultyRanking(allFaculty, allFeedback, settings = {}) {
  const minThreshold = settings.minFeedbackThreshold ?? 5;

  const statsList = allFaculty.map(fac => calculateFacultyStats(fac, allFeedback, settings));

  // Sort qualified vs insufficient
  const qualified = statsList.filter(s => s.feedbackCount >= minThreshold);
  const insufficient = statsList.filter(s => s.feedbackCount < minThreshold);

  const sortFn = (a, b) => {
    if (b.overallAverage !== a.overallAverage) {
      return b.overallAverage - a.overallAverage;
    }
    return b.feedbackCount - a.feedbackCount;
  };

  qualified.sort(sortFn);
  insufficient.sort(sortFn);

  // Assign ranks
  let currentRank = 1;
  const rankedQualified = qualified.map(item => ({
    ...item,
    rank: currentRank++
  }));

  const rankedInsufficient = insufficient.map(item => ({
    ...item,
    rank: '-'
  }));

  return [...rankedQualified, ...rankedInsufficient];
}

/**
 * Identifies strongest parameters for a faculty (highest rating averages)
 */
export function getStrongestParameters(parameterAverages) {
  const entries = Object.entries(parameterAverages || {}).map(([key, val]) => ({
    key,
    label: PARAMETER_LABELS[key] || key,
    value: val
  }));

  entries.sort((a, b) => b.value - a.value);
  return entries.slice(0, 2);
}

/**
 * Identifies weakest parameters for a faculty (lowest rating averages)
 */
export function getWeakestParameters(parameterAverages) {
  const entries = Object.entries(parameterAverages || {}).map(([key, val]) => ({
    key,
    label: PARAMETER_LABELS[key] || key,
    value: val
  }));

  entries.sort((a, b) => a.value - b.value);
  return entries.slice(0, 2);
}

/**
 * Calculates Department-wise statistics
 */
export function calculateDepartmentStats(departments, facultyList, feedbackList, settings = {}) {
  return departments.map(dept => {
    const deptFaculty = facultyList.filter(f => f.departmentId === dept.id);
    const deptFeedback = feedbackList.filter(fb => fb.departmentId === dept.id);
    const overallAverage = calculateOverallAverage(deptFeedback);
    const percentage = calculatePercentage(overallAverage);

    const parameterAverages = {};
    PARAMETER_KEYS.forEach(key => {
      parameterAverages[key] = calculateParameterAverage(deptFeedback, key);
    });

    return {
      department: dept,
      facultyCount: deptFaculty.length,
      feedbackCount: deptFeedback.length,
      overallAverage,
      percentage,
      parameterAverages
    };
  });
}

/**
 * Calculates Semester-wise statistics
 */
export function calculateSemesterStats(feedbackList) {
  const semesters = [1, 2, 3, 4, 5, 6, 7, 8];

  return semesters.map(sem => {
    const semFeedback = feedbackList.filter(fb => Number(fb.semester) === sem);
    const feedbackCount = semFeedback.length;
    const overallAverage = calculateOverallAverage(semFeedback);
    const percentage = calculatePercentage(overallAverage);

    const parameterAverages = {};
    PARAMETER_KEYS.forEach(key => {
      parameterAverages[key] = calculateParameterAverage(semFeedback, key);
    });

    const highest = getStrongestParameters(parameterAverages)[0];
    const lowest = getWeakestParameters(parameterAverages)[0];

    return {
      semester: `Semester ${sem}`,
      semNumber: sem,
      feedbackCount,
      overallAverage,
      percentage,
      highestParameter: highest?.value ? highest.label : 'N/A',
      lowestParameter: lowest?.value ? lowest.label : 'N/A',
      parameterAverages
    };
  }).filter(s => s.feedbackCount > 0); // Only include semesters with data
}

/**
 * Calculates monthly feedback trend
 */
export function calculateFeedbackTrend(feedbackList) {
  if (!feedbackList || feedbackList.length === 0) return [];

  const monthMap = {};

  feedbackList.forEach(fb => {
    const date = new Date(fb.createdAt);
    const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    const sortVal = date.getFullYear() * 100 + date.getMonth();

    if (!monthMap[monthKey]) {
      monthMap[monthKey] = { month: monthKey, sortVal, count: 0, totalRatings: 0, ratingCount: 0 };
    }

    monthMap[monthKey].count += 1;
    PARAMETER_KEYS.forEach(key => {
      const val = fb.ratings?.[key];
      if (typeof val === 'number') {
        monthMap[monthKey].totalRatings += val;
        monthMap[monthKey].ratingCount += 1;
      }
    });
  });

  const sortedMonths = Object.values(monthMap).sort((a, b) => a.sortVal - b.sortVal);

  return sortedMonths.map(item => ({
    month: item.month,
    count: item.count,
    average: item.ratingCount > 0 ? Number((item.totalRatings / item.ratingCount).toFixed(2)) : 0
  }));
}

/**
 * Calculates distribution of 1 to 5 star ratings across all evaluations
 */
export function calculateRatingDistribution(feedbackList) {
  const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let total = 0;

  (feedbackList || []).forEach(fb => {
    PARAMETER_KEYS.forEach(key => {
      const val = fb.ratings?.[key];
      if (val >= 1 && val <= 5) {
        counts[val] += 1;
        total += 1;
      }
    });
  });

  return [
    { rating: '5 Stars (Excellent)', stars: 5, count: counts[5], percentage: total ? Number(((counts[5] / total) * 100).toFixed(1)) : 0, color: '#10b981' },
    { rating: '4 Stars (Good)', stars: 4, count: counts[4], percentage: total ? Number(((counts[4] / total) * 100).toFixed(1)) : 0, color: '#3b82f6' },
    { rating: '3 Stars (Average)', stars: 3, count: counts[3], percentage: total ? Number(((counts[3] / total) * 100).toFixed(1)) : 0, color: '#f59e0b' },
    { rating: '2 Stars (Poor)', stars: 2, count: counts[2], percentage: total ? Number(((counts[2] / total) * 100).toFixed(1)) : 0, color: '#f97316' },
    { rating: '1 Star (Very Poor)', stars: 1, count: counts[1], percentage: total ? Number(((counts[1] / total) * 100).toFixed(1)) : 0, color: '#ef4444' }
  ];
}
