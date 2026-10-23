import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { saveQuizAttempt } from '../services/quizData';
import { learningContentService } from '../services/learningContentService';
import {
  Brain,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  RotateCcw,
  Sparkles,
  ChevronRight,
  Eye,
  BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';

export function AssessmentQuizPage() {
  const { currentUser } = useAuth();
  const { addToast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  // Check if opened in faculty preview mode
  const isPreviewMode = !!location.state?.isPreview;
  const rawPreviewQuestion = location.state?.previewQuestion || (location.state?.previewQuestionId ? learningContentService.getQuestionById(location.state.previewQuestionId) : null);
  const filterSubjectId = location.state?.subjectId;
  const filterSubjectCode = location.state?.filterSubjectCode || location.state?.subjectCode;
  const snippetTitle = location.state?.snippetTitle;

  // Determine question pool
  const [allQuestions] = useState(() => {
    if (rawPreviewQuestion) {
      return [rawPreviewQuestion];
    }
    const filter = {};
    if (filterSubjectId) filter.subjectId = filterSubjectId;
    if (filterSubjectCode) filter.subjectCode = filterSubjectCode;
    const published = learningContentService.getPublishedQuestions(filter);
    return published; // Strict: if none published, returns empty array, triggering empty state
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [confidence, setConfidence] = useState('75'); // '50' | '75' | '100'
  const [showFeedback, setShowFeedback] = useState(false);
  const [answersLog, setAnswersLog] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isRetakePhase, setIsRetakePhase] = useState(false);
  const [retakeQuestions, setRetakeQuestions] = useState([]);
  const [initialAttemptSnapshot, setInitialAttemptSnapshot] = useState(null);

  // Reference to original attempt ID for paired retake linkage
  const lastInitialAttemptIdRef = useRef(null);

  // Per-question timing and total timer
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timerRef = useRef(null);
  const questionStartTimeRef = useRef(0);

  useEffect(() => {
    questionStartTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  const activeQuestionSet = isRetakePhase ? retakeQuestions : allQuestions;
  const currentQuestion = activeQuestionSet[currentIndex];

  const handleSelectOption = (optionId) => {
    if (showFeedback) return;
    setSelectedOptionId(optionId);
  };

  const handleConfirmAnswer = () => {
    if (!selectedOptionId) {
      addToast('Please pick an answer before confirming!', 'error');
      return;
    }

    const chosenOption = currentQuestion.options.find(o => o.id === selectedOptionId);
    const isCorrect = chosenOption.isCorrect;
    const isTrap = chosenOption.isTrap;

    // Measure discrete time spent strictly on THIS question
    const timeSpentOnThisQuestion = Math.max(1, Math.round((Date.now() - questionStartTimeRef.current) / 1000));

    const record = {
      questionId: currentQuestion.id,
      questionVersion: currentQuestion.version || 1,
      questionTopic: currentQuestion.topic || 'General',
      questionSubjectId: currentQuestion.subjectId || '',
      questionSubjectCode: currentQuestion.subjectCode || '',
      questionText: currentQuestion.question || currentQuestion.questionText || '',
      selectedOptionId: chosenOption.id,
      selectedOptionText: chosenOption.text,
      selectedOption: chosenOption,
      isCorrect,
      isTrap,
      confidence: `${confidence}%`,
      isHighConfidenceError: !isCorrect && confidence === '100',
      questionTimeSeconds: timeSpentOnThisQuestion
    };

    setAnswersLog(prev => [...prev, record]);
    setShowFeedback(true);

    if (isCorrect) {
      try {
        confetti({ particleCount: 35, spread: 55, origin: { y: 0.7 } });
      } catch (_e) {
        // Confetti optional
      }
    }
  };

  const handleNextQuestion = () => {
    setShowFeedback(false);
    setSelectedOptionId(null);
    setConfidence('75');
    // Reset individual question start timestamp for the next question
    questionStartTimeRef.current = Date.now();

    if (currentIndex + 1 < activeQuestionSet.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      handleCompleteQuiz();
    }
  };

  const handleCompleteQuiz = () => {
    setIsCompleted(true);
    clearInterval(timerRef.current);

    if (isPreviewMode) {
      addToast('Preview completed. No student research attempt was created.', 'info');
      return;
    }

    if (!currentUser || currentUser.role !== 'student') {
      addToast('Only authenticated students may record diagnostic quiz attempts.', 'error');
      return;
    }

    if (!isRetakePhase) {
      // Save initial attempt
      const result = saveQuizAttempt({
        studentId: currentUser.id,
        studentName: currentUser.name,
        rollNumber: currentUser.rollNumber || 'STU-PROTOTYPE',
        isRetake: false,
        originalAttemptId: null,
        totalQuestions: activeQuestionSet.length,
        answers: answersLog,
        totalDurationSeconds: elapsedSeconds,
        dataProvenance: 'collected'
      });

      if (result.success && result.attempt) {
        lastInitialAttemptIdRef.current = result.attempt.id;
        const initialCorrect = answersLog.filter(a => a.isCorrect).length;
        setInitialAttemptSnapshot({
          id: result.attempt.id,
          total: answersLog.length,
          correct: initialCorrect,
          accuracy: Math.round((initialCorrect / answersLog.length) * 100)
        });
      }
      addToast('Diagnostic quiz finished! Results logged to your learning record.', 'success');
    } else {
      // Save retake attempt: contains ONLY the retake answers and points to originalAttemptId
      saveQuizAttempt({
        studentId: currentUser.id,
        studentName: currentUser.name,
        rollNumber: currentUser.rollNumber || 'STU-PROTOTYPE',
        isRetake: true,
        originalAttemptId: lastInitialAttemptIdRef.current,
        totalQuestions: activeQuestionSet.length,
        answers: answersLog, // Contains strictly retake responses
        totalDurationSeconds: elapsedSeconds,
        dataProvenance: 'collected'
      });
      addToast('Immediate retake completed! Paired improvement updated.', 'success');
    }
  };

  const startTestingEffectRetake = () => {
    const missedQuestionIds = answersLog.filter(a => !a.isCorrect).map(a => a.questionId);
    const missedQuestions = allQuestions.filter(q => missedQuestionIds.includes(q.id));

    if (missedQuestions.length === 0) {
      addToast('You got everything right! No retake needed.', 'info');
      return;
    }

    // Capture initial attempt snapshot if not already stored
    if (!initialAttemptSnapshot) {
      const initCorrect = answersLog.filter(a => a.isCorrect).length;
      setInitialAttemptSnapshot({
        total: answersLog.length,
        correct: initCorrect,
        accuracy: Math.round((initCorrect / answersLog.length) * 100)
      });
    }

    // STRICT ISOLATION: Clear answersLog to record strictly retake responses
    setAnswersLog([]);
    setRetakeQuestions(missedQuestions);
    setIsRetakePhase(true);
    setIsCompleted(false);
    setCurrentIndex(0);
    setSelectedOptionId(null);
    setShowFeedback(false);
    setConfidence('75');
    setElapsedSeconds(0);
    questionStartTimeRef.current = Date.now();
    timerRef.current = setInterval(() => setElapsedSeconds(prev => prev + 1), 1000);
    addToast('Retrying missed questions — testing immediate error correction!', 'info');
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}:${rem < 10 ? '0' : ''}${rem}`;
  };

  // If user is faculty but didn't come via preview mode, show dedicated educator guidance
  if (currentUser?.role === 'faculty' && !isPreviewMode) {
    return (
      <div className="max-w-lg mx-auto py-12 px-4 text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-50 dark:bg-amber-950 flex items-center justify-center text-amber-600 dark:text-amber-400">
          <Eye className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Teacher Preview Mode Required
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
          Standard diagnostic quiz completion is reserved for enrolled student learners. To preview your diagnostic questions, inspect cognitive distractors, or author new items, please use the Educational Content Studio.
        </p>
        <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
          <button
            onClick={() => navigate('/educator/content')}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs cursor-pointer"
          >
            Go to Educational Content Studio
          </button>
          <button
            onClick={() => navigate('/educator')}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer"
          >
            Educator Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Completion Screen
  if (isCompleted) {
    const total = answersLog.length;
    const correctCount = answersLog.filter(a => a.isCorrect).length;
    const trapCount = answersLog.filter(a => a.isTrap).length;
    const accuracy = total > 0 ? Math.round((correctCount / total) * 100) : 0;

    const immediateImprovement = (isRetakePhase && initialAttemptSnapshot)
      ? accuracy - initialAttemptSnapshot.accuracy
      : null;

    return (
      <div className="max-w-xl mx-auto py-8 px-4 space-y-6 text-center animate-in fade-in duration-200">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-3xl shadow-sm">
          {accuracy >= 80 ? '🎉' : '💪'}
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {isRetakePhase ? 'Retake Completed!' : accuracy >= 80 ? 'Diagnostic Assessment Complete!' : 'Assessment Complete!'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {isPreviewMode ? (
              <span className="text-amber-600 font-semibold">Teacher Preview Mode — No Student Data Recorded</span>
            ) : isRetakePhase ? (
              <span>Immediate active-recall retake finished in <strong>{formatTime(elapsedSeconds)}</strong>.</span>
            ) : (
              <span>Finished diagnostic questions in <strong>{formatTime(elapsedSeconds)}</strong>.</span>
            )}
          </p>
        </div>

        {/* Big Score Cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400">{accuracy}%</span>
            <p className="text-[11px] font-bold text-slate-400 mt-1">
              {isRetakePhase ? 'Retake Accuracy' : 'Initial Accuracy'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{correctCount} / {total}</span>
            <p className="text-[11px] font-bold text-slate-400 mt-1">Correct</p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <span className="text-3xl font-black text-amber-600 dark:text-amber-400">{trapCount}</span>
            <p className="text-[11px] font-bold text-slate-400 mt-1">Traps Hit</p>
          </div>
        </div>

        {/* Paired Retake Analytics Banner */}
        {isRetakePhase && immediateImprovement !== null && (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-left space-y-1">
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 block">
              Immediate Retake Improvement: {immediateImprovement >= 0 ? `+${immediateImprovement}%` : `${immediateImprovement}%`}
            </span>
            <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
              Compared paired initial attempt ({initialAttemptSnapshot?.accuracy}%) against immediate post-feedback recall ({accuracy}%). Note: Represents immediate error correction, not long-term retention.
            </p>
          </div>
        )}

        {/* Research Context & Metacognitive Tip */}
        <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-xs text-indigo-900 dark:text-indigo-200 text-left border border-indigo-200 dark:border-indigo-800 space-y-2">
          <div className="flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <p>
              <strong>Misconception-Aware Diagnostic Assessment:</strong> Encountering plausible cognitive traps and receiving immediate explanatory feedback exposes hidden false mental models.
            </p>
          </div>
          {answersLog.some(a => a.isHighConfidenceError) && (
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-900 dark:text-amber-200 flex items-start gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
              <p>
                <strong>High-Confidence False Belief Detected:</strong> You indicated 100% confidence on an incorrect choice. This may indicate a strongly held conceptual misconception and is therefore prioritised for targeted review.
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          {!isRetakePhase && trapCount > 0 && !isPreviewMode && (
            <button
              onClick={startTestingEffectRetake}
              className="flex-1 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry Missed Questions (Immediate Retake)</span>
            </button>
          )}

          <Link
            to={currentUser?.role === 'faculty' ? '/educator' : '/my-learning'}
            className="flex-1 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 font-bold text-xs sm:text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
          >
            <span>{currentUser?.role === 'faculty' ? 'Return to Educator Dashboard' : 'View My Learning Dashboard'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <Brain className="w-12 h-12 text-slate-400 mx-auto" />
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">No Diagnostic Questions Available</h2>
        <p className="text-xs text-slate-500">
          No published diagnostic questions were found for the selected subject criteria.
        </p>
        <button
          onClick={() => navigate('/my-learning')}
          className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl"
        >
          Return to My Learning
        </button>
      </div>
    );
  }

  const selectedOpt = currentQuestion?.options?.find(o => o.id === selectedOptionId);

  return (
    <div className="max-w-2xl mx-auto space-y-4 py-4 transition-all">
      {/* Teacher Preview Banner */}
      {isPreviewMode && (
        <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-amber-600" />
            <span className="font-bold">Faculty Preview Mode:</span>
            <span>Interactions are simulated and will NOT record student research attempts.</span>
          </div>
          <button
            onClick={() => navigate('/educator/content')}
            className="text-[11px] font-bold text-amber-700 underline"
          >
            Exit Preview
          </button>
        </div>
      )}

      {/* Linked Study Snippet context if provided */}
      {snippetTitle && (
        <div className="p-2.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-[11px] text-indigo-700 dark:text-indigo-300 flex items-center gap-2">
          <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
          <span>Diagnostic assessment for Study Snippet: <strong>{snippetTitle}</strong></span>
        </div>
      )}

      {/* Top Question Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
            {isRetakePhase ? 'Retake Item' : 'Question'} {currentIndex + 1} of {activeQuestionSet.length}
          </span>
          <span className="text-xs text-slate-400 font-medium truncate max-w-[250px]">
            {currentQuestion?.subjectCode}: {currentQuestion?.topic}
          </span>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold">
          <Clock className="w-3.5 h-3.5 text-indigo-500" />
          <span>{formatTime(elapsedSeconds)}</span>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-sm space-y-5">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
          {currentQuestion.question || currentQuestion.questionText}
        </h2>

        {/* Code snippet if any */}
        {currentQuestion.codeSnippet && (
          <div className="rounded-2xl bg-slate-950 text-slate-100 p-4 font-mono text-xs overflow-x-auto border border-slate-800">
            <pre>{currentQuestion.codeSnippet}</pre>
          </div>
        )}

        {/* Options */}
        <div className="space-y-2.5">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedOptionId === option.id;
            let optionStyle = 'border-slate-200 dark:border-slate-800 hover:border-indigo-400 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200';

            if (isSelected && !showFeedback) {
              optionStyle = 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 ring-2 ring-indigo-500';
            } else if (showFeedback) {
              if (option.isCorrect) {
                optionStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500 font-bold';
              } else if (isSelected && !option.isCorrect) {
                optionStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 ring-2 ring-rose-500';
              } else {
                optionStyle = 'opacity-40 border-slate-200 dark:border-slate-800';
              }
            }

            return (
              <div
                key={option.id || idx}
                onClick={() => handleSelectOption(option.id)}
                className={`p-3.5 sm:p-4 rounded-2xl border text-xs sm:text-sm font-medium transition-all cursor-pointer flex items-start gap-3 ${optionStyle}`}
              >
                <div
                  className={`w-6 h-6 rounded-lg shrink-0 flex items-center justify-center font-bold text-xs ${
                    isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}
                >
                  {String.fromCharCode(65 + idx)}
                </div>
                <div className="flex-1 pt-0.5 leading-snug">
                  {option.text}
                </div>
              </div>
            );
          })}
        </div>

        {/* Confidence Selector */}
        {!showFeedback && (
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              Confidence Calibration: How certain are you of this answer?
            </span>

            <div className="grid grid-cols-3 gap-2 text-xs">
              {[
                { val: '50', label: '🤔 50% (Guess)' },
                { val: '75', label: '🙂 75% (Likely)' },
                { val: '100', label: '🚀 100% (Certain)' }
              ].map(item => (
                <button
                  key={item.val}
                  type="button"
                  onClick={() => setConfidence(item.val)}
                  className={`py-2 px-2 font-bold rounded-xl border transition-all text-center ${
                    confidence === item.val
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Feedback Banner */}
        {showFeedback && selectedOpt && (
          <div
            className={`p-4 rounded-2xl border text-xs leading-relaxed space-y-1.5 animate-in fade-in duration-150 ${
              selectedOpt.isCorrect
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 text-emerald-900 dark:text-emerald-200'
                : selectedOpt.isTrap
                ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 text-amber-900 dark:text-amber-200'
                : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 text-rose-900 dark:text-rose-200'
            }`}
          >
            <div className="font-bold text-xs flex items-center gap-1.5">
              {selectedOpt.isCorrect ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Correct! Misconception avoided.</span>
                </>
              ) : selectedOpt.isTrap ? (
                <>
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Cognitive Trap Triggered: {selectedOpt.trapType || 'Misconception Trap'}</span>
                </>
              ) : (
                <span>Incorrect Answer</span>
              )}
            </div>

            <p>{selectedOpt.explanation}</p>
          </div>
        )}

        {/* Next / Submit Button */}
        <div className="flex justify-end pt-1">
          {!showFeedback ? (
            <button
              onClick={handleConfirmAnswer}
              disabled={!selectedOptionId}
              className="py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Check Answer</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>{currentIndex + 1 < activeQuestionSet.length ? 'Next Question' : 'See Diagnostic Results'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default AssessmentQuizPage;
