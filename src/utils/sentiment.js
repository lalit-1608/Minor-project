// Transparent Rule-Based Sentiment Prototype (Keyword-Based Feedback Categorisation)
// Note: This is an interpretable rule-based prototype, NOT an AI/ML/BERT model.
// Evaluates qualitative comments into: Positive, Neutral, or Needs Attention using deterministic keyword matching.

const POSITIVE_KEYWORDS = [
  'excellent', 'great', 'best', 'good', 'phenomenal', 'engaging', 'approachable',
  'clear', 'helpful', 'structured', 'patient', 'inspiring', 'thorough', 'encourages',
  'enthusiasm', 'rewarding', 'timely', 'organized', 'friendly', 'dedicated', 'insightful',
  'practical', 'appreciate', 'love', 'interactive', 'effective', 'supportive'
];

const ATTENTION_KEYWORDS = [
  'slow down', 'too fast', 'rushed', 'starts late', 'unclear', 'struggle', 'confusing',
  'improve', 'boring', 'monotone', 'audio', 'sound', 'late', 'tough', 'harsh',
  'theoretical', 'slide heavy', 'needs work', 'difficult to follow', 'disorganized',
  'unapproachable', 'strict', 'delayed', 'burden', 'problematic'
];

/**
 * Categorizes a comment using a transparent keyword matching algorithm.
 * Returns: { sentiment: 'positive' | 'neutral' | 'attention', label: string, score: number, matchedTerms: string[] }
 */
export function analyzeSentiment(comment) {
  if (!comment || typeof comment !== 'string' || comment.trim().length === 0) {
    return { sentiment: 'neutral', label: 'Neutral', score: 0, matchedTerms: [] };
  }

  const normalized = comment.toLowerCase();
  
  const positiveMatches = POSITIVE_KEYWORDS.filter(word => normalized.includes(word));
  const attentionMatches = ATTENTION_KEYWORDS.filter(word => normalized.includes(word));

  const score = positiveMatches.length - attentionMatches.length;

  if (attentionMatches.length > positiveMatches.length || (attentionMatches.length > 0 && score <= 0)) {
    return {
      sentiment: 'attention',
      label: 'Needs Attention',
      score,
      matchedTerms: attentionMatches
    };
  } else if (positiveMatches.length > attentionMatches.length) {
    return {
      sentiment: 'positive',
      label: 'Positive',
      score,
      matchedTerms: positiveMatches
    };
  } else {
    return {
      sentiment: 'neutral',
      label: 'Neutral',
      score: 0,
      matchedTerms: []
    };
  }
}
