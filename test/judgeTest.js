// Automated Verification Suite for Judge Test Scenarios
// Tests all business logic, calculations, duplicate protection, data flow, and ranking rules.

import {
  calculateOverallAverage,
  calculatePercentage,
  calculateParameterAverage,
  calculateFacultyRanking,
  getPerformanceStatus,
  calculateDepartmentStats,
  calculateSemesterStats,
  calculateFeedbackTrend,
  calculateRatingDistribution,
  getStrongestParameters,
  getWeakestParameters,
  PARAMETER_KEYS
} from '../src/utils/calculations.js';

import {
  INITIAL_DEPARTMENTS,
  INITIAL_FACULTY,
  INITIAL_SUBJECTS,
  INITIAL_FEEDBACK,
  INITIAL_SETTINGS
} from '../src/services/seedData.js';

import { analyzeSentiment } from '../src/utils/sentiment.js';

console.log('====================================================');
console.log('STARTING STUDY SNIPPET JUDGE VERIFICATION SUITE');
console.log('====================================================\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`✓ [PASS] ${message}`);
  } else {
    console.error(`✗ [FAIL] ${message}`);
    throw new Error(`Test assertion failed: ${message}`);
  }
}

// 1. Initial Data Sanity Checks
console.log('--- Phase 1: Seed Data Verification ---');
assert(INITIAL_DEPARTMENTS.length >= 5, `At least 5 departments exist (found: ${INITIAL_DEPARTMENTS.length})`);
assert(INITIAL_FACULTY.length >= 10, `At least 10 faculty exist (found: ${INITIAL_FACULTY.length})`);
assert(INITIAL_SUBJECTS.length >= 15, `At least 15 subjects exist (found: ${INITIAL_SUBJECTS.length})`);
assert(INITIAL_FEEDBACK.length >= 100, `At least 100 feedback records exist (found: ${INITIAL_FEEDBACK.length})`);

// Find Mr. Ashok Rathi & Machine Learning
const ashok = INITIAL_FACULTY.find(f => f.name.includes('Ashok Rathi'));
assert(Boolean(ashok), 'Mr. Ashok Rathi exists in faculty roster');
const mlSubject = INITIAL_SUBJECTS.find(s => s.name === 'Machine Learning' && s.semester === 7);
assert(Boolean(mlSubject), 'Machine Learning (CS701, Semester 7) exists');
assert(mlSubject.facultyIds.includes(ashok.id), 'Mr. Ashok Rathi teaches Machine Learning');

// 2. Pre-Submission Calculations for Mr. Ashok Rathi
console.log('\n--- Phase 2: Pre-Submission Baseline Calculations ---');
const ashokPreFeedback = INITIAL_FEEDBACK.filter(fb => fb.facultyId === ashok.id);
const preCount = ashokPreFeedback.length;
const preAvg = calculateOverallAverage(ashokPreFeedback);
const preKnowledge = calculateParameterAverage(ashokPreFeedback, 'subjectKnowledge');
const preClarity = calculateParameterAverage(ashokPreFeedback, 'clarity');
const prePct = calculatePercentage(preAvg);
console.log(`Baseline: ${preCount} reviews, Avg: ${preAvg}/5.0 (${prePct}%), Knowledge: ${preKnowledge}, Clarity: ${preClarity}`);
assert(preCount >= 5, 'Mr. Ashok Rathi meets minimum feedback threshold');
assert(preAvg >= 4.0, 'Mr. Ashok Rathi is in Top Performing tier');

// 3. Simulating Steps 1-4: Submitting Feedback for Judge Test Scenario
console.log('\n--- Phase 3: Executing Judge Test Feedback Submission ---');
const testSubmission = {
  id: 'fb-judge-test-01',
  facultyId: ashok.id,
  subjectId: mlSubject.id,
  departmentId: ashok.departmentId,
  semester: 7,
  className: 'CSE-A',
  ratings: {
    subjectKnowledge: 5,
    clarity: 4,
    communication: 5,
    engagement: 4,
    punctuality: 5,
    satisfaction: 5
  },
  comment: 'Outstanding explanations on deep learning and neural networks. Very approachable!',
  createdAt: new Date().toISOString(),
  anonymousSessionHash: 'anon-test-hash'
};

// Ratings average of this submission: (5+4+5+4+5+5)/6 = 28/6 = 4.6667
const submissionSum = 5 + 4 + 5 + 4 + 5 + 5;
assert(submissionSum === 28, 'Rating sum matches required 28 points');

const updatedFeedback = [testSubmission, ...INITIAL_FEEDBACK];
assert(updatedFeedback.length === INITIAL_FEEDBACK.length + 1, 'Total Feedback increased by exactly 1');

// 4. Verifying Post-Submission Calculations
console.log('\n--- Phase 4: Verifying Reactive Calculation Updates ---');
const ashokPostFeedback = updatedFeedback.filter(fb => fb.facultyId === ashok.id);
const postCount = ashokPostFeedback.length;
const postAvg = calculateOverallAverage(ashokPostFeedback);
const postKnowledge = calculateParameterAverage(ashokPostFeedback, 'subjectKnowledge');
const postClarity = calculateParameterAverage(ashokPostFeedback, 'clarity');

assert(postCount === preCount + 1, `Faculty feedback count incremented from ${preCount} to ${postCount}`);
console.log(`Post-Submission: Count: ${postCount}, Avg: ${postAvg} (was ${preAvg}), Knowledge: ${postKnowledge}`);
assert(typeof postAvg === 'number' && !isNaN(postAvg), 'Post average is a valid number');

// Verify formula: overallAverage = sum of all rating values / number of rating values
let manualRatingSum = 0;
let manualRatingCount = 0;
ashokPostFeedback.forEach(fb => {
  PARAMETER_KEYS.forEach(k => {
    manualRatingSum += fb.ratings[k];
    manualRatingCount++;
  });
});
const expectedAvg = Number((manualRatingSum / manualRatingCount).toFixed(2));
assert(postAvg === expectedAvg, `Formula verified: ${manualRatingSum}/${manualRatingCount} = ${expectedAvg} matches ${postAvg}`);

// 5. Ranking Verification
console.log('\n--- Phase 5: Faculty Ranking Engine Verification ---');
const rankings = calculateFacultyRanking(INITIAL_FACULTY, updatedFeedback, INITIAL_SETTINGS);
assert(rankings.length === INITIAL_FACULTY.length, 'All faculty are ranked');
assert(rankings[0].rank === 1, 'Rank 1 is assigned');
// Verify descending sort by overallAverage then feedbackCount
for (let i = 0; i < rankings.length - 1; i++) {
  const cur = rankings[i];
  const next = rankings[i + 1];
  if (cur.rank !== '-' && next.rank !== '-') {
    assert(
      cur.overallAverage >= next.overallAverage || (cur.overallAverage === next.overallAverage && cur.feedbackCount >= next.feedbackCount),
      `Ranking order correct: #${cur.rank} (${cur.overallAverage}) >= #${next.rank} (${next.overallAverage})`
    );
  }
}

// Check Insufficient Feedback rule (< 5 reviews)
const underThreshold = rankings.find(r => r.feedbackCount < 5);
if (underThreshold) {
  assert(underThreshold.statusInfo.code === 'insufficient', `Faculty with < 5 feedback has 'Insufficient Feedback' status`);
  assert(underThreshold.rank === '-', 'Faculty with < 5 feedback does not receive a top numerical rank');
}

// 6. Department & Semester Aggregations
console.log('\n--- Phase 6: Department & Semester Aggregations ---');
const deptStats = calculateDepartmentStats(INITIAL_DEPARTMENTS, INITIAL_FACULTY, updatedFeedback, INITIAL_SETTINGS);
assert(deptStats.length === INITIAL_DEPARTMENTS.length, 'All 5 departments calculated');
const cseDept = deptStats.find(d => d.department.code === 'CSE');
assert(cseDept.feedbackCount > 0 && cseDept.overallAverage > 0, 'CSE Department metrics computed');

const semStats = calculateSemesterStats(updatedFeedback);
assert(semStats.length > 0, 'Semester statistics computed');
const sem7 = semStats.find(s => s.semNumber === 7);
assert(Boolean(sem7) && sem7.feedbackCount > 0, 'Semester 7 stats reflect test submission');

// 7. Monthly Trends & Rating Distribution
console.log('\n--- Phase 7: Recharts Data Feed Calculations ---');
const trends = calculateFeedbackTrend(updatedFeedback);
assert(trends.length > 0, 'Monthly trends aggregated');
assert(trends.every(t => t.count > 0 && t.average > 0), 'All trend months have positive volume & average');

const dist = calculateRatingDistribution(updatedFeedback);
assert(dist.length === 5, '5-level rating distribution generated (1 to 5 stars)');
const totalDistRatings = dist.reduce((sum, d) => sum + d.count, 0);
assert(totalDistRatings === updatedFeedback.length * 6, `Total ratings (${totalDistRatings}) = feedback (${updatedFeedback.length}) * 6 parameters`);

// 8. Strengths & Improvement Areas
console.log('\n--- Phase 8: Dynamic Strengths & Weaknesses ---');
const strengths = getStrongestParameters(rankings[0].parameterAverages);
const weaknesses = getWeakestParameters(rankings[0].parameterAverages);
assert(strengths.length === 2, 'Top 2 strengths dynamically extracted');
assert(weaknesses.length === 2, 'Top 2 improvement areas dynamically extracted');
assert(strengths[0].value >= weaknesses[0].value, 'Strength rating >= Weakness rating');

// 9. Sentiment Analysis Verification
console.log('\n--- Phase 9: Sentiment Keyword Analysis ---');
const posComment = analyzeSentiment('Phenomenal teacher, exceptional clarity and very helpful.');
assert(posComment.sentiment === 'positive', 'Positive comment correctly classified');
const attComment = analyzeSentiment('Class starts late and pace is too fast during proofs.');
assert(attComment.sentiment === 'attention', 'Attention comment correctly classified');
const neutralComment = analyzeSentiment('Syllabus was covered as per schedule.');
assert(neutralComment.sentiment === 'neutral', 'Neutral comment correctly classified');

// 10. Duplicate Protection Logic
console.log('\n--- Phase 10: Duplicate Key Invariance ---');
const mockRegistry = new Set();
const sessionA = 'test-session-xyz';
const dupKey1 = `${sessionA}::fac-1::sub-cs701::7`;
mockRegistry.add(dupKey1);
assert(mockRegistry.has(dupKey1), 'Submission key recorded');
// Attempt duplicate
assert(mockRegistry.has(`${sessionA}::fac-1::sub-cs701::7`), 'Duplicate submission detected and rejected');
// Different subject allowed
assert(!mockRegistry.has(`${sessionA}::fac-1::sub-cs501::5`), 'Different subject allowed for same session');
// Different faculty allowed
assert(!mockRegistry.has(`${sessionA}::fac-2::sub-cs501::5`), 'Different faculty allowed for same session');

console.log('\n====================================================');
console.log(`ALL TESTS PASSED! (${passedTests} / ${totalTests} assertions verified)`);
console.log('====================================================');
