import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { X, CheckCircle2, Star, ThumbsUp, Info } from 'lucide-react';
import confetti from 'canvas-confetti';

/**
 * Validated 10-Item System Usability Scale (SUS)
 * Reference: Brooke, J. (1996). SUS: A "Quick and Dirty" Usability Scale.
 * 
 * Structure: Alternating positive (odd) and negative (even) statements.
 * Scale: 1 (Strongly Disagree) to 5 (Strongly Agree)
 * 
 * Scoring:
 *   Odd items (1,3,5,7,9):  contribution = response - 1
 *   Even items (2,4,6,8,10): contribution = 5 - response
 *   SUS Score = (sum of contributions) × 2.5
 *   Range: 0 to 100
 */
const SUS_QUESTIONS = [
  // 1 — Positive
  "I think that I would like to use this system frequently.",
  // 2 — Negative
  "I found the system unnecessarily complex.",
  // 3 — Positive
  "I thought the system was easy to use.",
  // 4 — Negative
  "I think that I would need the support of a technical person to be able to use this system.",
  // 5 — Positive
  "I found the various functions in this system were well integrated.",
  // 6 — Negative
  "I thought there was too much inconsistency in this system.",
  // 7 — Positive
  "I would imagine that most people would learn to use this system very quickly.",
  // 8 — Negative
  "I found the system very cumbersome to use.",
  // 9 — Positive
  "I felt very confident using the system.",
  // 10 — Negative
  "I needed to learn a lot of things before I could get going with this system."
];

const SUS_STORAGE_KEY = 'studysnippet_sus_responses_v2';

/**
 * Returns stored SUS responses.
 * Unlike previous version, does NOT fall back to synthetic demo data.
 * Returns only genuine collected responses.
 */
export function getStoredSUSResponses() {
  try {
    const raw = localStorage.getItem(SUS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Filter to only include responses with proper SUS scoring
      return parsed.filter(r => r.scoringMethod === 'sus-standard');
    }
  } catch (e) {
    console.warn('Could not read SUS responses', e);
  }
  return [];
}

/**
 * Returns demo SUS data for presentation purposes only.
 * These are clearly marked as synthetic and must never be combined with collected data.
 */
export function getDemoSUSData() {
  return [
    { id: 'demo-sus-1', score: 82.5, participant: 'Demo Participant A', role: 'student', isDemo: true, submittedAt: '2026-09-20T10:14:00Z' },
    { id: 'demo-sus-2', score: 77.5, participant: 'Demo Participant B', role: 'student', isDemo: true, submittedAt: '2026-09-21T14:32:00Z' },
    { id: 'demo-sus-3', score: 85.0, participant: 'Demo Participant C', role: 'faculty', isDemo: true, submittedAt: '2026-09-22T09:45:00Z' }
  ];
}

export function saveSUSResponse(item) {
  try {
    const responses = getStoredSUSResponses();
    responses.unshift(item);
    localStorage.setItem(SUS_STORAGE_KEY, JSON.stringify(responses));
  } catch (e) {
    console.error('Failed to save SUS response', e);
  }
}

/**
 * Calculate SUS score using the validated standard scoring method.
 * 
 * Odd items (0-indexed: 0,2,4,6,8): contribution = response - 1
 * Even items (0-indexed: 1,3,5,7,9): contribution = 5 - response
 * Total SUS = sum × 2.5
 */
function calculateStandardSUSScore(ratings) {
  let sum = 0;
  for (let i = 0; i < 10; i++) {
    const response = ratings[i] || 3; // Default to neutral if missing
    if (i % 2 === 0) {
      // Odd-numbered items (positive): contribution = response - 1
      sum += (response - 1);
    } else {
      // Even-numbered items (negative): contribution = 5 - response
      sum += (5 - response);
    }
  }
  return Math.round(sum * 2.5 * 10) / 10;
}

/**
 * Standard SUS Scale Reference (Brooke, 1996)
 * SUS is reported as a standardized 0–100 scale score.
 */
export function getSUSScaleDescription(score) {
  if (score === null || score === undefined) return 'No collected responses yet';
  return 'Standardized 0–100 scale score';
}

export function SUSSurveyModal({ isOpen, onClose }) {
  const { currentUser } = useAuth();
  const { addToast } = useToast();

  // Initialize all ratings to null (no pre-selection)
  const [ratings, setRatings] = useState({
    0: null, 1: null, 2: null, 3: null, 4: null,
    5: null, 6: null, 7: null, 8: null, 9: null
  });
  const [calculatedScore, setCalculatedScore] = useState(null);

  if (!isOpen) return null;

  const handleRatingSelect = (questionIndex, value) => {
    setRatings(prev => ({
      ...prev,
      [questionIndex]: value
    }));
  };

  const allAnswered = Object.values(ratings).every(v => v !== null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!allAnswered) {
      addToast('Please answer all 10 questions before submitting.', 'error');
      return;
    }

    const finalScore = calculateStandardSUSScore(ratings);
    setCalculatedScore(finalScore);

    const participantToken = 'p-' + Math.random().toString(36).substring(2, 9);
    saveSUSResponse({
      id: `sus-${Date.now()}`,
      participantId: participantToken,
      score: finalScore,
      participant: `Participant (${currentUser?.role || 'student'})`,
      role: currentUser?.role || 'student',
      ratings,
      scoringMethod: 'sus-standard',
      dataProvenance: 'collected',
      isDemo: false,
      submittedAt: new Date().toISOString()
    });

    addToast(`SUS response recorded: ${finalScore}/100`, 'success');
    try {
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
    } catch {}
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-xl w-full max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              System Usability Scale (SUS)
            </h2>
            <p className="text-xs text-slate-400">
              Validated 10-item usability questionnaire (Brooke, 1996)
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {calculatedScore !== null ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-3xl">
                🌟
              </div>

              <div>
                <span className="text-4xl font-black text-slate-900 dark:text-white">
                  {calculatedScore} <span className="text-lg text-slate-400">/ 100</span>
                </span>
                <p className="text-xs text-slate-500 mt-0.5">Your SUS Scale Score</p>
              </div>

              <div className="inline-block px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
                SUS is reported as a standardized 0–100 scale score
              </div>

              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 text-xs text-blue-800 dark:text-blue-300 flex items-start gap-2 text-left max-w-sm mx-auto">
                <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>Scored using the validated SUS method: odd items (response − 1), even items (5 − response), sum × 2.5. Score range: 0–100.</span>
              </div>

              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Thank you for your response. This contributes to the usability evaluation of the StudySnippet research prototype.
              </p>

              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs"
              >
                Close & Continue
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Methodology note */}
              <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-800 dark:text-indigo-300 flex items-start gap-2">
                <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>Rate each statement from <strong>1 (Strongly Disagree)</strong> to <strong>5 (Strongly Agree)</strong>. This uses the validated 10-item SUS with alternating positive and negative statements.</span>
              </div>

              <div className="space-y-3">
                {SUS_QUESTIONS.map((q, idx) => {
                  const isNegative = idx % 2 === 1;
                  return (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-2xl border space-y-2 ${
                        isNegative
                          ? 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-200/60 dark:border-rose-900/40'
                          : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200/60 dark:border-slate-700/60'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-[10px] font-bold text-slate-400 mt-0.5">{idx + 1}.</span>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 flex-1">
                          {q}
                        </p>
                        {isNegative && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 shrink-0">
                            Negative
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] text-slate-400">Strongly Disagree</span>
                        <div className="flex items-center gap-2">
                          {[1, 2, 3, 4, 5].map((val) => (
                            <label
                              key={val}
                              className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold cursor-pointer transition-all border ${
                                ratings[idx] === val
                                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                              }`}
                            >
                              <input
                                type="radio"
                                name={`sus-${idx}`}
                                value={val}
                                checked={ratings[idx] === val}
                                onChange={() => handleRatingSelect(idx, val)}
                                className="sr-only"
                              />
                              {val}
                            </label>
                          ))}
                        </div>
                        <span className="text-[10px] text-slate-400">Strongly Agree</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                type="submit"
                disabled={!allAnswered}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                {allAnswered ? 'Submit SUS Response' : `Answer all 10 questions (${Object.values(ratings).filter(v => v !== null).length}/10)`}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
