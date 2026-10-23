// Cognitive Misconceptions & Logical Trap Assessment Data
// Features engineered distractor traps based on intuitive cognitive fallacies and misconceptions

import {
  learningContentService,
  INITIAL_DIAGNOSTIC_QUESTIONS
} from './learningContentService.js';

// Active quiz questions backed by persistent learning content service
export const QUIZ_QUESTIONS = INITIAL_DIAGNOSTIC_QUESTIONS;

export function getActiveQuizQuestions(filter = {}) {
  try {
    return learningContentService.getPublishedQuestions(filter);
  } catch (e) {
    console.warn('Could not read from learningContentService, using default questions', e);
    return INITIAL_DIAGNOSTIC_QUESTIONS;
  }
}

/**
 * Synthetic demonstration dataset — clearly identified as DEMO DATA.
 * Not an experimental finding. Used exclusively for interface visualization.
 */
export const DEMO_RESEARCH_DATA = {
  isDemo: true,
  provenance: 'demo',
  description: 'Synthetic demonstration dataset — not an experimental finding',

  // Testing Effect demonstration: comparing error recurrence between Initial Attempt vs Active-Recall Retake
  testingEffect: [
    { topic: 'Bayesian Base Rate Fallacy', initialErrorRate: 78, retakeErrorRate: 14, sampleSize: 142 },
    { topic: 'SQL Three-Valued Logic NULL', initialErrorRate: 68, retakeErrorRate: 15, sampleSize: 148 },
    { topic: 'Superficial Pattern Matching Big-O', initialErrorRate: 59, retakeErrorRate: 9, sampleSize: 168 },
    { topic: 'Binary Search Integer Overflow', initialErrorRate: 71, retakeErrorRate: 12, sampleSize: 135 },
    { topic: 'Data Leakage in Normalization', initialErrorRate: 53, retakeErrorRate: 8, sampleSize: 120 }
  ],

  // Metacognitive Calibration Matrix: Confidence Level vs Accuracy
  metacognitiveCalibration: [
    { confidence: '100% Certain', correct: 58, highConfidenceTrap: 42, total: 240, label: 'High-Confidence Illusion of Competence' },
    { confidence: '75% Likely', correct: 68, highConfidenceTrap: 32, total: 310, label: 'Moderate Calibration' },
    { confidence: '50% Guess', correct: 44, highConfidenceTrap: 56, total: 180, label: 'Intuitive Uncertainty' }
  ],

  // Cognitive Trap Frequency across students
  fallacyDistribution: [
    { name: 'Base Rate Neglect', frequency: 78, category: 'Probabilistic Fallacy', severity: 'Critical' },
    { name: 'SQL 3VL Law of Excluded Middle', frequency: 68, category: 'Relational Logic Fallacy', severity: 'High' },
    { name: 'Superficial Code Matching', frequency: 59, category: 'Heuristic Shortcut', severity: 'Medium' },
    { name: 'Signed Arithmetic Overflow', frequency: 71, category: 'Boundary Neglect', severity: 'High' },
    { name: 'Preprocessing Leakage', frequency: 53, category: 'Methodological Oversight', severity: 'Medium' }
  ]
};

// Maintained for backward compatibility, explicitly marked as demo
export const EMPIRICAL_RESEARCH_DATA = DEMO_RESEARCH_DATA;

const QUIZ_STORAGE_KEY = 'studysnippet_quiz_attempts_v1';

export function getStoredQuizAttempts() {
  try {
    const raw = localStorage.getItem(QUIZ_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Could not read quiz attempts', e);
  }
  return [];
}

/**
 * Saves a quiz attempt with strict provenance and retake integrity.
 * Teacher preview attempts MUST NOT be saved to student research data.
 * Unauthenticated / guest submissions are strictly rejected.
 */
export function saveQuizAttempt(attempt) {
  // Discard preview executions
  if (attempt.isPreviewMode) {
    return { success: false, isPreview: true };
  }

  // Strictly block guest research data creation
  if (!attempt.studentId || attempt.studentId === 'guest' || attempt.studentId === 'unauthenticated') {
    return { success: false, error: 'Authenticated student credentials required to save attempt.' };
  }

  try {
    const history = getStoredQuizAttempts();
    const newAttempt = {
      ...attempt,
      id: `attempt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      dataProvenance: 'collected',
      isDemo: false,
      isRetake: !!attempt.isRetake,
      originalAttemptId: attempt.originalAttemptId || null
    };

    history.unshift(newAttempt);
    localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(history));
    return { success: true, attempt: newAttempt };
  } catch (e) {
    console.error('Failed saving quiz attempt', e);
    return { success: false, error: e.message };
  }
}

/**
 * Computes learning analytics for an individual student.
 */
export function calculateStudentLearningAnalytics(studentId) {
  const allAttempts = getStoredQuizAttempts();
  const studentAttempts = allAttempts.filter(
    a => a.studentId === studentId && (a.dataProvenance === 'collected' || !a.isDemo)
  );

  if (studentAttempts.length === 0) {
    return {
      hasCollectedData: false,
      totalAttempts: 0,
      retakeAttemptsCount: 0,
      overallAccuracy: null,
      latestAccuracy: null,
      firstAttemptAccuracy: null,
      retakeAccuracy: null,
      highConfidenceErrorsCount: 0,
      highConfidenceErrorCount: 0,
      immediateErrorCorrectionRate: null,
      immediateRetakeDelta: null,
      averageQuestionTimeSeconds: null,
      averageCorrectQuestionTimeSeconds: null,
      averageIncorrectQuestionTimeSeconds: null,
      totalRecentQuizTimeSeconds: 0,
      flaggedMisconceptions: [],
      weakTopics: [],
      suggestedRetakes: [],
      recentAttempts: []
    };
  }

  const firstAttempts = studentAttempts.filter(a => !a.isRetake);
  const retakeAttempts = studentAttempts.filter(a => a.isRetake);

  const allAnswers = studentAttempts.flatMap(a => a.answers || []);
  const firstAnswers = firstAttempts.flatMap(a => a.answers || []);
  const retakeAnswers = retakeAttempts.flatMap(a => a.answers || []);

  const totalAnswers = allAnswers.length;
  const totalCorrect = allAnswers.filter(a => a.isCorrect).length;
  const totalTraps = allAnswers.filter(a => a.isTrap).length;
  const highConfidenceErrors = allAnswers.filter(a => a.isHighConfidenceError).length;

  const overallAccuracy = totalAnswers > 0
    ? Math.round((totalCorrect / totalAnswers) * 100)
    : null;

  const firstCorrect = firstAnswers.filter(a => a.isCorrect).length;
  const firstAccuracy = firstAnswers.length > 0
    ? Math.round((firstCorrect / firstAnswers.length) * 100)
    : null;

  const retakeCorrect = retakeAnswers.filter(a => a.isCorrect).length;
  const retakeAccuracy = retakeAnswers.length > 0
    ? Math.round((retakeCorrect / retakeAnswers.length) * 100)
    : null;

  // Paired immediate retake error-correction rate:
  // Proportion of originally missed questions that were answered correctly on immediate retake
  let totalOriginallyMissedInPaired = 0;
  let totalCorrectedInPaired = 0;

  retakeAttempts.forEach(retake => {
    if (!retake.originalAttemptId) return;
    const original = firstAttempts.find(f => f.id === retake.originalAttemptId);
    if (!original) return;

    const missedQIds = (original.answers || []).filter(a => !a.isCorrect).map(a => a.questionId);
    const retakeAnswersList = retake.answers || [];

    missedQIds.forEach(qId => {
      totalOriginallyMissedInPaired++;
      const rAns = retakeAnswersList.find(a => a.questionId === qId);
      if (rAns && rAns.isCorrect) {
        totalCorrectedInPaired++;
      }
    });
  });

  const immediateErrorCorrectionRate = totalOriginallyMissedInPaired > 0
    ? Math.round((totalCorrectedInPaired / totalOriginallyMissedInPaired) * 100)
    : null;

  const trapRate = totalAnswers > 0
    ? Math.round((totalTraps / totalAnswers) * 100)
    : 0;

  // Response-time metrics
  const getAnsTime = (a) => (typeof a.questionTimeSeconds === 'number' && a.questionTimeSeconds > 0) ? a.questionTimeSeconds : (typeof a.timeSpentSeconds === 'number' && a.timeSpentSeconds > 0 ? a.timeSpentSeconds : null);
  const timedAnswers = allAnswers.filter(a => getAnsTime(a) != null);
  const averageQuestionTimeSeconds = timedAnswers.length > 0
    ? Math.round(timedAnswers.reduce((sum, a) => sum + getAnsTime(a), 0) / timedAnswers.length)
    : null;

  const correctTimed = timedAnswers.filter(a => a.isCorrect);
  const averageCorrectQuestionTimeSeconds = correctTimed.length > 0
    ? Math.round(correctTimed.reduce((sum, a) => sum + getAnsTime(a), 0) / correctTimed.length)
    : null;

  const incorrectTimed = timedAnswers.filter(a => !a.isCorrect);
  const averageIncorrectQuestionTimeSeconds = incorrectTimed.length > 0
    ? Math.round(incorrectTimed.reduce((sum, a) => sum + getAnsTime(a), 0) / incorrectTimed.length)
    : null;

  const totalRecentQuizTimeSeconds = studentAttempts.reduce((sum, att) => {
    if (typeof att.totalDurationSeconds === 'number' && att.totalDurationSeconds > 0) {
      return sum + att.totalDurationSeconds;
    }
    const sumQ = (att.answers || []).reduce((qSum, ans) => qSum + (getAnsTime(ans) || 0), 0);
    return sum + sumQ;
  }, 0);

  // Latest attempt
  const latestAttempt = studentAttempts[0];
  const latestAnswers = latestAttempt.answers || [];
  const latestAccuracy = latestAnswers.length > 0
    ? Math.round((latestAnswers.filter(a => a.isCorrect).length / latestAnswers.length) * 100)
    : 0;

  // Topic performance
  const topicMap = {};
  allAnswers.forEach(ans => {
    const topic = ans.questionTopic || 'General';
    if (!topicMap[topic]) topicMap[topic] = { topic, total: 0, correct: 0, traps: 0 };
    topicMap[topic].total++;
    if (ans.isCorrect) topicMap[topic].correct++;
    if (ans.isTrap) topicMap[topic].traps++;
  });

  const weakTopics = Object.values(topicMap)
    .filter(t => t.total >= 1 && (t.correct / t.total) < 0.75)
    .map(t => ({
      ...t,
      accuracy: Math.round((t.correct / t.total) * 100)
    }))
    .sort((a, b) => a.accuracy - b.accuracy);

  // Group recurring misconceptions caught
  const trapMap = {};
  allAnswers.forEach(ans => {
    if (ans.isTrap) {
      const tag = ans.selectedOption?.trapType || ans.selectedOption?.misconceptionTag || 'General Trap';
      if (!trapMap[tag]) {
        trapMap[tag] = {
          tag,
          description: ans.selectedOption?.cognitiveFallacy || ans.selectedOption?.explanation || 'Conceptual misconception',
          count: 0,
          highConfidenceCount: 0
        };
      }
      trapMap[tag].count++;
      if (ans.isHighConfidenceError) {
        trapMap[tag].highConfidenceCount++;
      }
    }
  });
  const flaggedMisconceptions = Object.values(trapMap).sort((a, b) => b.count - a.count);

  return {
    hasCollectedData: true,
    totalAttempts: studentAttempts.length,
    retakeAttemptsCount: retakeAttempts.length,
    overallAccuracy,
    latestAccuracy,
    firstAttemptAccuracy: firstAccuracy,
    retakeAccuracy,
    highConfidenceErrorsCount: highConfidenceErrors,
    highConfidenceErrorCount: highConfidenceErrors,
    immediateErrorCorrectionRate,
    immediateRetakeDelta: immediateErrorCorrectionRate,
    averageQuestionTimeSeconds,
    averageCorrectQuestionTimeSeconds,
    averageIncorrectQuestionTimeSeconds,
    totalRecentQuizTimeSeconds,
    trapSelectionRate: trapRate,
    flaggedMisconceptions,
    weakTopics,
    suggestedRetakes: [],
    recentAttempts: studentAttempts.slice(0, 10).map(att => ({
      ...att,
      subjectCode: att.subjectCode || att.answers?.[0]?.questionSubjectCode || 'CS501',
      score: att.score != null ? att.score : (att.answers || []).filter(a => a.isCorrect).length,
      maxScore: att.maxScore || att.totalQuestions || (att.answers || []).length
    }))
  };
}

/**
 * Computes diagnostic learning evidence visible to Faculty for assigned courses.
 * Strictly filters to collected data and applies answer-level course scoping.
 */
export function calculateFacultyLearnerAnalytics(facultySubjectCodes = ['CS701', 'CS501']) {
  const allAttempts = getStoredQuizAttempts();

  // Strict research filtering: only collected, non-demo attempts
  const realAttempts = allAttempts.filter(a => a.dataProvenance === 'collected' && !a.isDemo);

  const subjectNameMap = {
    'CS501': 'Database Management Systems',
    'CS701': 'Machine Learning',
    'IT401': 'Cloud Computing & Distributed Systems',
    'CS301': 'Data Structures & Algorithms'
  };

  // Helper to build default subject breakdown
  const buildEmptySubjectBreakdown = () => facultySubjectCodes.map(code => ({
    code,
    name: subjectNameMap[code] || code,
    attemptsCount: 0,
    uniqueLearners: 0,
    averageScore: null,
    highConfidenceErrorsCount: 0,
    averageTimeSeconds: null
  }));

  // Filter and scope attempts at the answer level for assigned courses
  const scopedAttempts = [];
  realAttempts.forEach(attempt => {
    const answers = attempt.answers || [];
    const matchingAnswers = answers.filter(ans => {
      const qCode = ans.questionSubjectCode;
      return !qCode || facultySubjectCodes.includes(qCode);
    });

    if (matchingAnswers.length > 0) {
      scopedAttempts.push({
        ...attempt,
        answers: matchingAnswers,
        scopedTotalQuestions: matchingAnswers.length
      });
    }
  });

  if (scopedAttempts.length === 0) {
    return {
      hasCollectedData: false,
      totalAttempts: 0,
      uniqueLearners: 0,
      totalLearners: 0,
      totalQuestionsAnswered: 0,
      averageAccuracy: null,
      highConfidenceErrorsCount: 0,
      highConfidenceErrorsTotal: 0,
      immediateErrorCorrectionRate: null,
      immediateRetakeDelta: null,
      averageQuestionTimeSeconds: null,
      averageCorrectQuestionTimeSeconds: null,
      averageIncorrectQuestionTimeSeconds: null,
      subjectBreakdown: buildEmptySubjectBreakdown(),
      misconceptionsIdentified: [],
      recurringMisconceptions: [],
      learnerRecords: [],
      recentAttempts: []
    };
  }

  // Group by student
  const learnerMap = {};
  scopedAttempts.forEach(attempt => {
    const sId = attempt.studentId || 'learner-anon';
    const sName = attempt.studentName || 'Student';
    const rollNo = attempt.rollNumber || 'STU-PROTOTYPE';

    if (!learnerMap[sId]) {
      learnerMap[sId] = {
        studentId: sId,
        studentName: sName,
        rollNumber: rollNo,
        attempts: [],
        firstAttempts: [],
        retakes: [],
        allAnswers: []
      };
    }

    learnerMap[sId].attempts.push(attempt);
    if (attempt.isRetake) learnerMap[sId].retakes.push(attempt);
    else learnerMap[sId].firstAttempts.push(attempt);

    (attempt.answers || []).forEach(ans => learnerMap[sId].allAnswers.push(ans));
  });

  let totalMissedPairedAll = 0;
  let totalCorrectedPairedAll = 0;

  const learnerRecords = Object.values(learnerMap).map(l => {
    const totalAns = l.allAnswers.length;
    const correctAns = l.allAnswers.filter(a => a.isCorrect).length;
    const traps = l.allAnswers.filter(a => a.isTrap).length;
    const highConfErrors = l.allAnswers.filter(a => a.isHighConfidenceError).length;

    const firstAnswers = l.firstAttempts.flatMap(a => a.answers || []);
    const firstAccuracy = firstAnswers.length > 0
      ? Math.round((firstAnswers.filter(a => a.isCorrect).length / firstAnswers.length) * 100)
      : 0;

    const retakeAnswers = l.retakes.flatMap(a => a.answers || []);
    const retakeAccuracy = retakeAnswers.length > 0
      ? Math.round((retakeAnswers.filter(a => a.isCorrect).length / retakeAnswers.length) * 100)
      : null;

    // Paired immediate error-correction rate
    let pairedMissed = 0;
    let pairedCorrected = 0;
    l.retakes.forEach(retake => {
      if (!retake.originalAttemptId) return;
      const original = l.firstAttempts.find(f => f.id === retake.originalAttemptId);
      if (!original) return;
      const originalMissedIds = (original.answers || []).filter(a => !a.isCorrect).map(a => a.questionId);
      originalMissedIds.forEach(qId => {
        pairedMissed++;
        totalMissedPairedAll++;
        const rAns = (retake.answers || []).find(a => a.questionId === qId);
        if (rAns && rAns.isCorrect) {
          pairedCorrected++;
          totalCorrectedPairedAll++;
        }
      });
    });

    const immediateErrorCorrectionRate = pairedMissed > 0
      ? Math.round((pairedCorrected / pairedMissed) * 100)
      : null;

    const immediateImprovement = (retakeAccuracy !== null)
      ? retakeAccuracy - firstAccuracy
      : null;

    // Timing metrics for learner
    const getLAnsTime = (a) => (typeof a.questionTimeSeconds === 'number' && a.questionTimeSeconds > 0) ? a.questionTimeSeconds : (typeof a.timeSpentSeconds === 'number' && a.timeSpentSeconds > 0 ? a.timeSpentSeconds : null);
    const timedAnswers = l.allAnswers.filter(a => getLAnsTime(a) != null);
    const avgTime = timedAnswers.length > 0
      ? Math.round(timedAnswers.reduce((sum, a) => sum + getLAnsTime(a), 0) / timedAnswers.length)
      : null;

    const correctTimed = timedAnswers.filter(a => a.isCorrect);
    const avgCorrectTime = correctTimed.length > 0
      ? Math.round(correctTimed.reduce((sum, a) => sum + getLAnsTime(a), 0) / correctTimed.length)
      : null;

    const incorrectTimed = timedAnswers.filter(a => !a.isCorrect);
    const avgIncorrectTime = incorrectTimed.length > 0
      ? Math.round(incorrectTimed.reduce((sum, a) => sum + getLAnsTime(a), 0) / incorrectTimed.length)
      : null;

    // Weakest topic
    const topicCounts = {};
    l.allAnswers.forEach(a => {
      const t = a.questionTopic || 'General';
      if (!topicCounts[t]) topicCounts[t] = { topic: t, total: 0, errors: 0 };
      topicCounts[t].total++;
      if (!a.isCorrect) topicCounts[t].errors++;
    });
    const sortedTopics = Object.values(topicCounts).sort((a, b) => (b.errors / b.total) - (a.errors / a.total));
    const weakestTopic = sortedTopics[0]?.topic || 'N/A';

    return {
      studentId: l.studentId,
      studentName: l.studentName,
      rollNumber: l.rollNumber,
      subjectCode: l.attempts[0]?.answers?.[0]?.questionSubjectCode || facultySubjectCodes[0] || 'CS501',
      attemptCount: l.attempts.length,
      totalAttempts: l.attempts.length,
      accuracy: totalAns > 0 ? Math.round((correctAns / totalAns) * 100) : 0,
      firstAccuracy,
      retakeAccuracy,
      immediateImprovement,
      immediateErrorCorrectionRate,
      highConfidenceErrors: highConfErrors,
      trapRate: totalAns > 0 ? Math.round((traps / totalAns) * 100) : 0,
      averageQuestionTimeSeconds: avgTime,
      averageCorrectQuestionTimeSeconds: avgCorrectTime,
      averageIncorrectQuestionTimeSeconds: avgIncorrectTime,
      weakestTopic,
      lastAttemptAt: l.attempts[0]?.timestamp || null,
      lastAttemptDate: l.attempts[0]?.timestamp || null,
      attempts: l.attempts
    };
  });

  const totalHighConfErrors = learnerRecords.reduce((sum, r) => sum + r.highConfidenceErrors, 0);

  // Group recurring misconceptions across scoped answers
  const trapMap = {};
  scopedAttempts.flatMap(a => a.answers || []).forEach(ans => {
    if (ans.isTrap) {
      const trapName = ans.selectedOption?.trapType || ans.selectedOption?.misconceptionTag || 'General Trap';
      if (!trapMap[trapName]) {
        trapMap[trapName] = {
          tag: trapName,
          description: ans.selectedOption?.cognitiveFallacy || ans.selectedOption?.explanation || 'Conceptual misconception',
          occurrences: 0,
          highConfidenceCount: 0
        };
      }
      trapMap[trapName].occurrences++;
      if (ans.isHighConfidenceError) {
        trapMap[trapName].highConfidenceCount++;
      }
    }
  });

  const misconceptionsIdentified = Object.values(trapMap).sort((a, b) => b.occurrences - a.occurrences);

  const allAnswersScoped = scopedAttempts.flatMap(a => a.answers || []);
  const totalAnswersAll = allAnswersScoped.length;
  const totalCorrectAll = allAnswersScoped.filter(a => a.isCorrect).length;
  const averageAccuracy = totalAnswersAll > 0 ? Math.round((totalCorrectAll / totalAnswersAll) * 100) : 0;

  // Global response timing across all scoped answers
  const getGAnsTime = (a) => (typeof a.questionTimeSeconds === 'number' && a.questionTimeSeconds > 0) ? a.questionTimeSeconds : (typeof a.timeSpentSeconds === 'number' && a.timeSpentSeconds > 0 ? a.timeSpentSeconds : null);
  const timedAnswersAll = allAnswersScoped.filter(a => getGAnsTime(a) != null);
  const averageQuestionTimeSeconds = timedAnswersAll.length > 0
    ? Math.round(timedAnswersAll.reduce((sum, a) => sum + getGAnsTime(a), 0) / timedAnswersAll.length)
    : null;

  const correctTimedAll = timedAnswersAll.filter(a => a.isCorrect);
  const averageCorrectQuestionTimeSeconds = correctTimedAll.length > 0
    ? Math.round(correctTimedAll.reduce((sum, a) => sum + getGAnsTime(a), 0) / correctTimedAll.length)
    : null;

  const incorrectTimedAll = timedAnswersAll.filter(a => !a.isCorrect);
  const averageIncorrectQuestionTimeSeconds = incorrectTimedAll.length > 0
    ? Math.round(incorrectTimedAll.reduce((sum, a) => sum + getGAnsTime(a), 0) / incorrectTimedAll.length)
    : null;

  const globalImmediateErrorCorrectionRate = totalMissedPairedAll > 0
    ? Math.round((totalCorrectedPairedAll / totalMissedPairedAll) * 100)
    : null;

  // Subject breakdown for each assigned subject code
  const subjectBreakdown = facultySubjectCodes.map(code => {
    const subjectAttempts = scopedAttempts.filter(att =>
      (att.answers || []).some(ans => ans.questionSubjectCode === code)
    );
    const subjectAnswers = subjectAttempts.flatMap(att =>
      (att.answers || []).filter(ans => ans.questionSubjectCode === code)
    );
    const subTotal = subjectAnswers.length;
    const subCorrect = subjectAnswers.filter(a => a.isCorrect).length;
    const subHighConf = subjectAnswers.filter(a => a.isHighConfidenceError).length;
    const subTimed = subjectAnswers.filter(a => typeof a.questionTimeSeconds === 'number' && a.questionTimeSeconds > 0);

    const subAvgTime = subTimed.length > 0
      ? Math.round(subTimed.reduce((sum, a) => sum + a.questionTimeSeconds, 0) / subTimed.length)
      : null;

    const subScore = subTotal > 0 ? Math.round((subCorrect / subTotal) * 100) : null;

    return {
      code,
      name: subjectNameMap[code] || code,
      attemptsCount: subjectAttempts.length,
      uniqueLearners: new Set(subjectAttempts.map(a => a.studentId)).size,
      averageScore: subScore,
      highConfidenceErrorsCount: subHighConf,
      averageTimeSeconds: subAvgTime
    };
  });

  return {
    hasCollectedData: true,
    totalAttempts: scopedAttempts.length,
    uniqueLearners: learnerRecords.length,
    totalLearners: learnerRecords.length,
    totalQuestionsAnswered: totalAnswersAll,
    averageAccuracy,
    highConfidenceErrorsCount: totalHighConfErrors,
    highConfidenceErrorsTotal: totalHighConfErrors,
    immediateErrorCorrectionRate: globalImmediateErrorCorrectionRate,
    immediateRetakeDelta: globalImmediateErrorCorrectionRate,
    averageQuestionTimeSeconds,
    averageCorrectQuestionTimeSeconds,
    averageIncorrectQuestionTimeSeconds,
    subjectBreakdown,
    recurringMisconceptions: misconceptionsIdentified.map(m => ({ trapType: m.tag, count: m.occurrences })),
    misconceptionsIdentified,
    learnerRecords,
    recentAttempts: scopedAttempts.map(att => ({
      id: att.id,
      studentId: att.studentId,
      studentName: att.studentName,
      subjectCode: att.answers?.[0]?.questionSubjectCode || 'CS501',
      score: (att.answers || []).filter(a => a.isCorrect).length,
      maxScore: (att.answers || []).length,
      isRetake: att.isRetake,
      highConfidenceErrors: (att.answers || []).filter(a => a.isHighConfidenceError),
      timestamp: att.timestamp,
      dataProvenance: att.dataProvenance || 'collected',
      totalDurationSeconds: att.totalDurationSeconds || null,
      answers: att.answers || []
    }))
  };
}

/**
 * Dynamically computes genuine research analytics from saved quiz attempts.
 * Returns null if no genuine collected attempts exist.
 */
export function calculateCollectedQuizAnalytics(subjectFilter = null) {
  const allAttempts = getStoredQuizAttempts();
  // Filter strictly collected real attempts
  const realAttempts = allAttempts.filter(a => a.dataProvenance === 'collected' && !a.isDemo);

  const attempts = subjectFilter
    ? realAttempts.filter(a => (a.answers || []).some(ans => ans.questionSubjectId === subjectFilter || ans.questionSubjectCode === subjectFilter))
    : realAttempts;

  if (!attempts || attempts.length === 0) {
    return {
      hasCollectedData: false,
      totalAttempts: 0,
      uniqueParticipants: 0,
      firstAttemptsCount: 0,
      retakeAttemptsCount: 0,
      firstAttemptAccuracy: null,
      retakeAccuracy: null,
      immediateRetakeImprovement: null,
      immediateErrorCorrectionRate: null,
      trapSelectionRate: null,
      highConfidenceErrorCount: 0,
      highConfidenceErrorRate: null,
      topicBreakdown: [],
      testingEffectComparison: []
    };
  }

  const firstAttempts = attempts.filter(a => !a.isRetake);
  const retakeAttempts = attempts.filter(a => a.isRetake);

  const allAnswers = attempts.flatMap(a => a.answers || []);
  const firstAttemptAnswers = firstAttempts.flatMap(a => a.answers || []);
  const retakeAnswers = retakeAttempts.flatMap(a => a.answers || []);

  const totalAnswersCount = allAnswers.length;
  const totalCorrect = allAnswers.filter(ans => ans.isCorrect).length;
  const totalTraps = allAnswers.filter(ans => ans.isTrap).length;
  const highConfidenceTotal = allAnswers.filter(ans => ans.confidence === '100%').length;
  const highConfidenceErrors = allAnswers.filter(ans => ans.isHighConfidenceError).length;

  const firstAttemptCorrect = firstAttemptAnswers.filter(ans => ans.isCorrect).length;
  const firstAttemptAccuracy = firstAttemptAnswers.length > 0
    ? Math.round((firstAttemptCorrect / firstAttemptAnswers.length) * 100)
    : null;

  const retakeCorrect = retakeAnswers.filter(ans => ans.isCorrect).length;
  const retakeAccuracy = retakeAnswers.length > 0
    ? Math.round((retakeCorrect / retakeAnswers.length) * 100)
    : null;

  const immediateRetakeImprovement = (retakeAccuracy !== null && firstAttemptAccuracy !== null)
    ? retakeAccuracy - firstAttemptAccuracy
    : null;

  // Paired immediate error correction
  let totalMissedPaired = 0;
  let totalCorrectedPaired = 0;
  retakeAttempts.forEach(retake => {
    if (!retake.originalAttemptId) return;
    const original = firstAttempts.find(f => f.id === retake.originalAttemptId);
    if (!original) return;
    const missedIds = (original.answers || []).filter(a => !a.isCorrect).map(a => a.questionId);
    missedIds.forEach(qId => {
      totalMissedPaired++;
      const rAns = (retake.answers || []).find(a => a.questionId === qId);
      if (rAns && rAns.isCorrect) totalCorrectedPaired++;
    });
  });

  const immediateErrorCorrectionRate = totalMissedPaired > 0
    ? Math.round((totalCorrectedPaired / totalMissedPaired) * 100)
    : null;

  const trapSelectionRate = totalAnswersCount > 0
    ? Math.round((totalTraps / totalAnswersCount) * 100)
    : 0;

  const highConfidenceErrorRate = highConfidenceTotal > 0
    ? Math.round((highConfidenceErrors / highConfidenceTotal) * 100)
    : 0;

  const uniqueParticipants = new Set(attempts.map(a => a.studentId || a.studentName)).size;

  // Topic-level breakdown
  const topicMap = {};
  allAnswers.forEach(ans => {
    const topic = ans.questionTopic || 'General';
    if (!topicMap[topic]) {
      topicMap[topic] = {
        topic,
        firstTotal: 0,
        firstErrors: 0,
        retakeTotal: 0,
        retakeErrors: 0,
        trapCount: 0
      };
    }
    if (ans.isTrap) topicMap[topic].trapCount++;
  });

  firstAttemptAnswers.forEach(ans => {
    const topic = ans.questionTopic || 'General';
    if (topicMap[topic]) {
      topicMap[topic].firstTotal++;
      if (!ans.isCorrect) topicMap[topic].firstErrors++;
    }
  });

  retakeAnswers.forEach(ans => {
    const topic = ans.questionTopic || 'General';
    if (topicMap[topic]) {
      topicMap[topic].retakeTotal++;
      if (!ans.isCorrect) topicMap[topic].retakeErrors++;
    }
  });

  const testingEffectComparison = Object.values(topicMap).map(t => ({
    topic: t.topic,
    initialErrorRate: t.firstTotal > 0 ? Math.round((t.firstErrors / t.firstTotal) * 100) : 0,
    retakeErrorRate: t.retakeTotal > 0 ? Math.round((t.retakeErrors / t.retakeTotal) * 100) : 0,
    sampleSize: t.firstTotal + t.retakeTotal
  }));

  return {
    hasCollectedData: true,
    totalAttempts: attempts.length,
    uniqueParticipants,
    firstAttemptsCount: firstAttempts.length,
    retakeAttemptsCount: retakeAttempts.length,
    firstAttemptAccuracy,
    retakeAccuracy,
    immediateRetakeImprovement,
    immediateErrorCorrectionRate,
    trapSelectionRate,
    highConfidenceErrorCount: highConfidenceErrors,
    highConfidenceErrorRate,
    testingEffectComparison
  };
}
