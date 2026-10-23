import React from 'react';
import { RatingInput } from '../common/RatingInput';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { PARAMETER_KEYS, PARAMETER_LABELS } from '../../utils/calculations';

const DESCRIPTIONS = {
  subjectKnowledge: 'Depth of technical command, syllabus mastery, and relevant real-world applications.',
  clarity: 'Ability to unpack complex theories and make concepts easily comprehensible.',
  communication: 'Articulation, responsiveness to student questions, and classroom approachability.',
  engagement: 'Encouraging participation, discussions, active problem solving, and student interest.',
  punctuality: 'Timely lecture start, adherence to syllabus timeline, and consistent schedule respect.',
  satisfaction: 'Overall academic value, course experience, and educational mentorship provided.'
};

export function Step2Ratings({ ratings, onRatingChange, onBack, onContinue }) {
  const allRated = PARAMETER_KEYS.every(key => typeof ratings[key] === 'number' && ratings[key] >= 1 && ratings[key] <= 5);

  const ratedCount = PARAMETER_KEYS.filter(key => typeof ratings[key] === 'number' && ratings[key] >= 1).length;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (allRated) {
      onContinue();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Evaluate Academic Criteria
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Please rate all 6 dimensions truthfully on a scale from 1 (Very Poor) to 5 (Excellent).
          </p>
        </div>
        <div className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 self-start sm:self-auto">
          Completed: {ratedCount} / 6
        </div>
      </div>

      <div className="space-y-4">
        {PARAMETER_KEYS.map((key) => (
          <RatingInput
            key={key}
            label={PARAMETER_LABELS[key]}
            description={DESCRIPTIONS[key]}
            value={ratings[key]}
            onChange={(val) => onRatingChange(key, val)}
            required
          />
        ))}
      </div>

      <div className="flex items-center justify-between pt-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          type="submit"
          disabled={!allRated}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-sm shadow-md shadow-indigo-200 dark:shadow-none transition-all cursor-pointer disabled:cursor-not-allowed"
        >
          <span>Continue to Comments</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}
