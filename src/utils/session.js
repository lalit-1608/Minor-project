// Session & Duplicate Check Utility
// Student identity is not stored with submitted feedback in this prototype.
// Provides client-side duplicate prevention via an anonymous local session token.

const SESSION_KEY = 'studysnippet_anon_session_token';
const SUBMISSIONS_KEY = 'studysnippet_anon_submissions_registry';

/**
 * Retrieves or initializes an anonymous random session token in localStorage.
 * Student personal identification is never associated with this token.
 */
export function getAnonymousSessionId() {
  let sessionId = localStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      sessionId = crypto.randomUUID();
    } else {
      sessionId = 'anon_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    }
    localStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
}

/**
 * Computes a composite key for client-side duplicate submission prevention:
 * anonymousSessionId + facultyId + subjectId + semester
 */
export function generateSubmissionKey(facultyId, subjectId, semester) {
  const sessionId = getAnonymousSessionId();
  return `${sessionId}::${facultyId}::${subjectId}::${semester}`;
}

/**
 * Checks if this browser session has already submitted feedback for this faculty+subject+semester.
 */
export function hasSubmittedFeedback(facultyId, subjectId, semester) {
  try {
    const raw = localStorage.getItem(SUBMISSIONS_KEY);
    const registry = raw ? JSON.parse(raw) : [];
    const key = generateSubmissionKey(facultyId, subjectId, semester);
    return registry.includes(key);
  } catch (err) {
    console.error('Error checking duplicate submission:', err);
    return false;
  }
}

/**
 * Records a successful submission key to prevent future duplicates.
 */
export function recordSubmissionKey(facultyId, subjectId, semester) {
  try {
    const raw = localStorage.getItem(SUBMISSIONS_KEY);
    const registry = raw ? JSON.parse(raw) : [];
    const key = generateSubmissionKey(facultyId, subjectId, semester);
    if (!registry.includes(key)) {
      registry.push(key);
      localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(registry));
    }
  } catch (err) {
    console.error('Error saving submission key:', err);
  }
}

/**
 * Clears submission registry (for Demo Reset)
 */
export function clearSubmissionsRegistry() {
  try {
    localStorage.removeItem(SUBMISSIONS_KEY);
  } catch (err) {
    console.error('Error clearing registry:', err);
  }
}
