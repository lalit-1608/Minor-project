import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { saveSUSResponse } from '../components/hci/SUSSurveyModal';
import { DataProvenanceBadge } from '../components/research/DataProvenanceBadge';
import {
  Sparkles,
  Info,
  CheckCircle2,
  ArrowLeft,
  ShieldCheck,
  Send
} from 'lucide-react';
import confetti from 'canvas-confetti';

/**
 * Validated 10-Item System Usability Scale (SUS)
 * Reference: Brooke, J. (1996). SUS: A "Quick and Dirty" Usability Scale.
 */
const SUS_QUESTIONS = [
  "I think that I would like to use this system frequently.",
  "I found the system unnecessarily complex.",
  "I thought the system was easy to use.",
  "I think that I would need the support of a technical person to be able to use this system.",
  "I found the various functions in this system were well integrated.",
  "I thought there was too much inconsistency in this system.",
  "I would imagine that most people would learn to use this system very quickly.",
  "I found the system very cumbersome to use.",
  "I felt very confident using the system.",
  "I needed to learn a lot of things before I could get going with this system."
];

function calculateStandardSUSScore(ratings) {
  let sum = 0;
  for (let i = 0; i < 10; i++) {
    const response = ratings[i] || 3;
    if (i % 2 === 0) {
      sum += (response - 1);
    } else {
      sum += (5 - response);
    }
  }
  return Math.round(sum * 2.5 * 10) / 10;
}

export function UsabilitySurveyPage() {
  const { currentUser, role } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [ratings, setRatings] = useState({
    0: null, 1: null, 2: null, 3: null, 4: null,
    5: null, 6: null, 7: null, 8: null, 9: null
  });
  const [submittedScore, setSubmittedScore] = useState(null);
  const [assignedParticipantId, setAssignedParticipantId] = useState(null);

  const handleRatingSelect = (questionIndex, value) => {
    setRatings(prev => ({
      ...prev,
      [questionIndex]: value
    }));
  };

  const answeredCount = Object.values(ratings).filter(v => v !== null).length;
  const allAnswered = answeredCount === 10;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!allAnswered) {
      addToast(`Please answer all 10 questions (${answeredCount}/10 completed).`, 'error');
      return;
    }

    const finalScore = calculateStandardSUSScore(ratings);
    const participantToken = 'p-' + Math.random().toString(36).substring(2, 9);
    const participantRole = role || currentUser?.role || 'student';

    saveSUSResponse({
      id: `sus-${Date.now()}`,
      participantId: participantToken,
      participant: `Participant (${participantRole})`,
      role: participantRole,
      score: finalScore,
      ratings,
      scoringMethod: 'sus-standard',
      dataProvenance: 'collected',
      isDemo: false,
      submittedAt: new Date().toISOString()
    });

    setSubmittedScore(finalScore);
    setAssignedParticipantId(participantToken);
    addToast(`SUS survey submitted successfully: ${finalScore}/100`, 'success');

    try {
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
    } catch {}
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Usability & HCI Evaluation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            System Usability Scale (SUS) Survey
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Standardized 10-item usability questionnaire (Brooke, 1996) for empirical platform assessment.
          </p>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold transition-all cursor-pointer w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
      </div>

      {/* Non-identifying protocol notice */}
      <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/60 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
        <div className="text-xs text-indigo-950 dark:text-indigo-200 space-y-1">
          <p className="font-bold">Participant Privacy & Research Ethics Protocol</p>
          <p className="opacity-90">
            This survey records non-identifying research observations. Responses are stored under a pseudonymous
            participant token (<code className="font-mono text-[11px] bg-indigo-100 dark:bg-indigo-900/60 px-1 py-0.5 rounded">participantId: p-...</code>).
            No personal names, roll numbers, or academic records are attached.
          </p>
        </div>
      </div>

      {submittedScore !== null ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-xs text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              Thank You for Participating!
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              Your evaluation contributes to the empirical HCI research benchmark for StudySnippet.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 max-w-md mx-auto space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Calculated Standard SUS Score
            </span>
            <div className="text-4xl font-black text-emerald-600 dark:text-emerald-400">
              {submittedScore} <span className="text-lg text-slate-400">/ 100</span>
            </div>
            <p className="text-xs text-slate-500">
              Assigned Participant Identifier: <code className="font-mono font-bold text-slate-700 dark:text-slate-300">{assignedParticipantId}</code>
            </p>
            <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-center">
              <DataProvenanceBadge state="collected" label="Empirical Participant Response" />
            </div>
          </div>

          <div className="pt-4 flex justify-center gap-3">
            <button
              onClick={() => navigate('/my-learning')}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
            >
              Return to Learning Portal
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Progress bar */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-700 dark:text-slate-300">Survey Progress</span>
              <span className="text-indigo-600 dark:text-indigo-400">{answeredCount} of 10 answered</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(answeredCount / 10) * 100}%` }}
              />
            </div>
          </div>

          {/* 10 Items */}
          <div className="space-y-3">
            {SUS_QUESTIONS.map((q, idx) => {
              const isNegative = idx % 2 === 1;
              return (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border transition-all ${
                    ratings[idx] !== null
                      ? 'border-indigo-300 dark:border-indigo-800 bg-white dark:bg-slate-900 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40'
                  }`}
                >
                  <div className="flex items-start gap-2 mb-3">
                    <span className="text-xs font-black text-slate-400 mt-0.5">{idx + 1}.</span>
                    <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex-1">
                      {q}
                    </p>
                    {isNegative && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 shrink-0">
                        Negative Scale Item
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80">
                    <span className="text-[10px] sm:text-xs text-slate-400 font-medium">Strongly Disagree</span>
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      {[1, 2, 3, 4, 5].map((val) => (
                        <label
                          key={val}
                          className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-xs font-bold cursor-pointer transition-all border ${
                            ratings[idx] === val
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs scale-105'
                              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`sus-page-${idx}`}
                            value={val}
                            checked={ratings[idx] === val}
                            onChange={() => handleRatingSelect(idx, val)}
                            className="sr-only"
                          />
                          {val}
                        </label>
                      ))}
                    </div>
                    <span className="text-[10px] sm:text-xs text-slate-400 font-medium">Strongly Agree</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="submit"
              disabled={!allAnswered}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{allAnswered ? 'Submit Usability Survey' : `Complete All Questions (${answeredCount}/10)`}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default UsabilitySurveyPage;
