/**
 * Learning Content Service
 * Manages persistent storage for:
 * 1. Study Snippets (concise, bite-sized learning materials linked to misconceptions)
 * 2. Diagnostic Question Bank (misconception-driven questions with distractor taxonomy)
 *
 * Persisted in browser localStorage for this university prototype.
 */

const SNIPPETS_STORAGE_KEY = 'studysnippet_snippets_v1';
const QUESTIONS_STORAGE_KEY = 'studysnippet_questions_v1';
const TOPICS_STORAGE_KEY = 'studysnippet_diagnostic_topics_v1';

// Initial Seed Diagnostic Topics (Mapped to read-only official syllabus units)
export const INITIAL_DIAGNOSTIC_TOPICS = [
  {
    id: 'dt-1',
    subjectId: 'sub-cs501',
    subjectCode: 'CS501',
    subjectName: 'Database Management Systems',
    unitNumber: 2,
    officialUnitTitle: 'Unit 2: Relational Algebra & Advanced SQL',
    topicTitle: 'Three-Valued Logic & NULL Predicates',
    shortDescription: 'Investigating truth-value degradation in WHERE predicates with NULL values.',
    learningObjective: 'Distinguish UNKNOWN from FALSE in SQL relational calculus and WHERE evaluations.',
    createdByFacultyId: 'fac-1',
    createdByFacultyName: 'Mr. Ashok Rathi',
    status: 'active',
    createdAt: '2026-03-01T09:00:00Z',
    updatedAt: '2026-03-01T09:00:00Z'
  },
  {
    id: 'dt-2',
    subjectId: 'sub-cs701',
    subjectCode: 'CS701',
    subjectName: 'Machine Learning',
    unitNumber: 2,
    officialUnitTitle: 'Unit 2: Classification & Regularization',
    topicTitle: 'Base Rate Neglect in Classifier Evaluation',
    shortDescription: 'Bayesian posterior probability shifts when test sensitivity confronts rare positive prevalence.',
    learningObjective: 'Calculate Bayesian posterior probabilities incorporating prior prevalence.',
    createdByFacultyId: 'fac-1',
    createdByFacultyName: 'Mr. Ashok Rathi',
    status: 'active',
    createdAt: '2026-03-02T10:30:00Z',
    updatedAt: '2026-03-02T10:30:00Z'
  },
  {
    id: 'dt-3',
    subjectId: 'sub-cs301',
    subjectCode: 'CS301',
    subjectName: 'Data Structures & Algorithms',
    unitNumber: 1,
    officialUnitTitle: 'Unit 1: Asymptotic Analysis & Algorithmic Complexity',
    topicTitle: 'Time Complexity & Asymptotic Two-Pointer Progress',
    shortDescription: 'Overcoming the heuristic assumption that element pair inspection requires O(N^2) complexity.',
    learningObjective: 'Demonstrate monotonic two-pointer progression bounds operations to O(N).',
    createdByFacultyId: 'fac-2',
    createdByFacultyName: 'Prof. Amit Kulkarni',
    status: 'active',
    createdAt: '2026-03-03T11:00:00Z',
    updatedAt: '2026-03-03T11:00:00Z'
  }
];

// Initial Seed Study Snippets
export const INITIAL_STUDY_SNIPPETS = [
  {
    id: 'snp-1',
    subjectId: 'sub-cs501',
    subjectCode: 'CS501',
    subjectName: 'Database Management Systems',
    topicId: 'dt-1',
    unitNumber: 2,
    officialUnitTitle: 'Unit 2: Relational Algebra & Advanced SQL',
    topic: 'Three-Valued Logic & NULL Comparisons',
    title: 'SQL Three-Valued Logic: Why NULL is Not Boolean False',
    shortContent: 'In SQL relational calculus, boolean comparisons evaluate to TRUE, FALSE, or UNKNOWN (Three-Valued Logic). A common misconception is treating NULL as equivalent to boolean FALSE or zero. In WHERE clauses, only rows evaluating strictly to TRUE are retained.',
    keyPoints: [
      'Expressions like `NULL = NULL` or `column != "val"` evaluate to UNKNOWN when column is NULL.',
      '`WHERE status != "active"` filters out rows where status is NULL because UNKNOWN is non-truth.',
      'Always use `IS NULL` or `COALESCE()` when inspecting optional attributes in relational queries.'
    ],
    createdByFacultyId: 'fac-1',
    createdByFacultyName: 'Mr. Ashok Rathi',
    status: 'published',
    createdAt: '2026-03-01T09:00:00Z',
    updatedAt: '2026-03-01T09:00:00Z',
    relatedQuestionIds: ['cq-3']
  },
  {
    id: 'snp-2',
    subjectId: 'sub-cs701',
    subjectCode: 'CS701',
    subjectName: 'Machine Learning',
    topicId: 'dt-2',
    unitNumber: 2,
    officialUnitTitle: 'Unit 2: Classification & Regularization',
    topic: 'Base Rate Fallacy & Medical Diagnostic Classifiers',
    title: 'Bayes Theorem & Base Rate Neglect in Classifier Evaluation',
    shortContent: 'When screening for rare events (prevalence < 1%), false positives from the large healthy population easily swamp true positives, even with 99% test sensitivity. This cognitive error is known as Base Rate Neglect.',
    keyPoints: [
      'Prior prevalence strongly anchors the true posterior probability.',
      'Test accuracy alone is an insufficient metric for imbalanced classes.',
      'Precision (Positive Predictive Value) requires calculating total positives including false alarms.'
    ],
    createdByFacultyId: 'fac-1',
    createdByFacultyName: 'Mr. Ashok Rathi',
    status: 'published',
    createdAt: '2026-03-02T10:30:00Z',
    updatedAt: '2026-03-02T10:30:00Z',
    relatedQuestionIds: ['cq-2']
  },
  {
    id: 'snp-3',
    subjectId: 'sub-cs301',
    subjectCode: 'CS301',
    subjectName: 'Data Structures & Algorithms',
    topicId: 'dt-3',
    unitNumber: 1,
    officialUnitTitle: 'Unit 1: Asymptotic Analysis & Algorithmic Complexity',
    topic: 'Time Complexity & Asymptotic Analysis',
    title: 'Two-Pointer Monotonic Progress: Why Not All Pairs Are O(N²)',
    shortContent: 'Inspecting array pairs does not inherently require quadratic time. When an array is sorted, converging two pointers from both ends inspects each element at most once, yielding linear O(N) complexity.',
    keyPoints: [
      'Avoid heuristic pattern matching: seeing a "pair search" problem does not guarantee nested loops.',
      'Left and right pointers move inward monotonically, shrinking the search boundary by 1 per step.',
      'Total pointer operations are bounded strictly by array length N.'
    ],
    createdByFacultyId: 'fac-2',
    createdByFacultyName: 'Prof. Amit Kulkarni',
    status: 'published',
    createdAt: '2026-03-03T11:00:00Z',
    updatedAt: '2026-03-03T11:00:00Z',
    relatedQuestionIds: ['cq-1']
  },
  {
    id: 'snp-4',
    subjectId: 'sub-cs301',
    subjectCode: 'CS301',
    subjectName: 'Data Structures & Algorithms',
    topicId: null,
    unitNumber: 1,
    officialUnitTitle: 'Unit 1: Asymptotic Analysis & Algorithmic Complexity',
    topic: 'Binary Search Integer Overflow',
    title: 'Preventing 32-Bit Signed Arithmetic Overflow in Binary Search',
    shortContent: 'Writing `int mid = (low + high) / 2;` in 32-bit signed environments causes runtime exceptions when array indices sum to greater than 2^31 - 1 (Integer.MAX_VALUE). The 32-bit signed integer addition wraps around modulo 2^32 into negative values, producing a negative midpoint that triggers an ArrayIndexOutOfBoundsException.',
    keyPoints: [
      'Maximum 32-bit signed integer is 2,147,483,647 (Integer.MAX_VALUE).',
      'When low + high exceeds this boundary, signed 32-bit addition wraps modulo 2^32 into negative values.',
      'Safe formulation: `int mid = low + (high - low) / 2;` or unsigned right-shift `(low + high) >>> 1`.'
    ],
    createdByFacultyId: 'fac-11',
    createdByFacultyName: 'Dr. Arvind Mishra',
    status: 'published',
    createdAt: '2026-03-04T14:15:00Z',
    updatedAt: '2026-03-04T14:15:00Z',
    relatedQuestionIds: ['cq-5']
  }
];

// Initial Seed Diagnostic Questions with corrected CS501 DBMS misconception
export const INITIAL_DIAGNOSTIC_QUESTIONS = [
  {
    id: 'cq-1',
    subjectId: 'sub-cs301',
    subjectCode: 'CS301',
    subjectName: 'Data Structures & Algorithms',
    topicId: 'dt-3',
    unitNumber: 1,
    officialUnitTitle: 'Unit 1: Asymptotic Analysis & Algorithmic Complexity',
    topic: 'Time Complexity & Asymptotic Analysis',
    difficulty: 'Intermediate',
    question: 'Analyze the worst-case asymptotic time complexity of the following code snippet:',
    codeSnippet: `function findPair(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  while (left < right) {
    let sum = arr[left] + arr[right];
    if (sum === target) return [left, right];
    else if (sum < target) left++;
    else right--;
  }
  return null;
}`,
    status: 'published',
    createdByFacultyId: 'fac-2',
    createdByFacultyName: 'Prof. Amit Kulkarni',
    version: 1,
    source: 'seed',
    createdAt: '2026-03-01T09:00:00Z',
    updatedAt: '2026-03-01T09:00:00Z',
    options: [
      {
        id: 'opt-1a',
        text: 'O(N^2) because inspecting pairs in an array mathematically requires comparing all combinations',
        isCorrect: false,
        isTrap: true,
        trapType: 'Superficial Pattern Matching',
        cognitiveFallacy: 'Heuristic Assumption of Pairwise Permutation',
        explanation: 'TRAP: Learners often instinctively associate "pair finding" with nested loops and O(N^2). However, this monotonic two-pointer progression increments `left` or decrements `right` strictly once per step, visiting each element at most once.'
      },
      {
        id: 'opt-1b',
        text: 'O(N) linear time because each iteration shrinks the search window by exactly one element',
        isCorrect: true,
        isTrap: false,
        explanation: 'CORRECT: The two pointers start at opposite ends and move toward each other. The distance `right - left` decreases strictly by 1 at each step, yielding exactly O(N) operations in the worst case.'
      },
      {
        id: 'opt-1c',
        text: 'O(log N) because pointers are positioned at boundaries similar to binary search',
        isCorrect: false,
        isTrap: true,
        trapType: 'False Structural Analogy',
        cognitiveFallacy: 'Binary Search Visual Resemblance',
        explanation: 'TRAP: Having `left = 0` and `right = length - 1` visually resembles binary search, prompting an O(log N) intuition. But unlike binary search, the search interval shrinks linearly by 1, not logarithmically by half.'
      },
      {
        id: 'opt-1d',
        text: 'O(1) because pointers update synchronously',
        isCorrect: false,
        isTrap: false,
        explanation: 'INCORRECT: The loop executes proportional to the input size N.'
      }
    ]
  },
  {
    id: 'cq-2',
    subjectId: 'sub-cs701',
    subjectCode: 'CS701',
    subjectName: 'Machine Learning',
    topicId: 'dt-2',
    unitNumber: 2,
    officialUnitTitle: 'Unit 2: Classification & Regularization',
    topic: 'Bayesian Probability & Medical Diagnostic Classifiers',
    difficulty: 'Advanced',
    question: 'A rare condition affects 0.1% (1 in 1,000) of a population. A diagnostic machine learning classifier exhibits 99% Sensitivity (True Positive Rate) and 98% Specificity (2% False Positive Rate). If a randomly screened individual tests positive, what is the approximate probability that they actually have the condition?',
    codeSnippet: null,
    status: 'published',
    createdByFacultyId: 'fac-1',
    createdByFacultyName: 'Mr. Ashok Rathi',
    version: 1,
    source: 'seed',
    createdAt: '2026-03-01T09:00:00Z',
    updatedAt: '2026-03-01T09:00:00Z',
    options: [
      {
        id: 'opt-2a',
        text: 'Approximately 98%–99% because the model test accuracy is over 98%',
        isCorrect: false,
        isTrap: true,
        trapType: 'Base Rate Fallacy (Base Rate Neglect)',
        cognitiveFallacy: 'Representativeness Heuristic & High-Confidence Error',
        explanation: 'TRAP: In probabilistic reasoning experiments (e.g. Kahneman & Tversky), learners frequently exhibit Base Rate Neglect. The intuition focuses on the test\'s high sensitivity (99%) and overlooks the low prior prevalence (0.1%). Out of 100,000 people: 100 have the disease (99 test positive), while 99,900 do not (2% = ~1,998 false positives). Thus, true positives / all positives is 99 / (99 + 1,998) ≈ 4.7%.'
      },
      {
        id: 'opt-2b',
        text: 'Approximately 4.5% to 5.0% due to the overwhelming volume of false positives from the healthy majority',
        isCorrect: true,
        isTrap: false,
        explanation: 'CORRECT: Bayes theorem demonstrates that when prior probability is 0.001, even a 2% false positive rate produces ~20 times more false positives than true positives, keeping the posterior around 4.7%.'
      },
      {
        id: 'opt-2c',
        text: 'Exactly 50% because the test either correctly identifies or errs',
        isCorrect: false,
        isTrap: true,
        trapType: 'Equiprobability Fallacy',
        cognitiveFallacy: '50-50 Binary Probability Bias',
        explanation: 'TRAP: Assuming a binary outcome implies equal 50% likelihood. Probabilities must be weighted by prior population distribution.'
      },
      {
        id: 'opt-2d',
        text: 'Insufficient information without knowing the ROC-AUC curve',
        isCorrect: false,
        isTrap: false,
        explanation: 'INCORRECT: Sensitivity, Specificity, and Prior Prevalence are sufficient to compute exact Bayesian posterior.'
      }
    ]
  },
  {
    id: 'cq-3',
    subjectId: 'sub-cs501',
    subjectCode: 'CS501',
    subjectName: 'Database Management Systems',
    topicId: 'dt-1',
    unitNumber: 2,
    officialUnitTitle: 'Unit 2: Relational Algebra & Advanced SQL',
    topic: 'Three-Valued Logic & NULL Comparisons',
    difficulty: 'Intermediate',
    question: 'A database table `enrollments` contains 100 rows: 60 rows have status = "active", 30 have status = "completed", and 10 have status = NULL. A developer executes: `SELECT COUNT(*) FROM enrollments WHERE status != "active";`. What count is returned by the SQL engine?',
    codeSnippet: `SELECT COUNT(*) 
FROM enrollments 
WHERE status != 'active';`,
    status: 'published',
    createdByFacultyId: 'fac-1',
    createdByFacultyName: 'Mr. Ashok Rathi',
    version: 1,
    source: 'seed',
    createdAt: '2026-03-01T09:00:00Z',
    updatedAt: '2026-03-01T09:00:00Z',
    options: [
      {
        id: 'opt-3a',
        text: '40 rows because 100 total rows minus 60 active rows equals 40 non-active rows',
        isCorrect: false,
        isTrap: true,
        trapType: 'Two-Valued Boolean Logic Assumption',
        cognitiveFallacy: 'Law of Excluded Middle Fallacy in SQL 3VL',
        explanation: 'TRAP: In standard two-valued boolean logic, (NOT A) includes everything other than A. But SQL operates under Three-Valued Logic (3VL): for the 10 NULL rows, `NULL != "active"` evaluates to UNKNOWN. Predicates in a WHERE clause discard rows evaluating to UNKNOWN, returning only the 30 "completed" rows.'
      },
      {
        id: 'opt-3b',
        text: '30 rows because in SQL three-valued logic, NULL != "active" evaluates to UNKNOWN, which is treated as false in WHERE clauses',
        isCorrect: true,
        isTrap: false,
        explanation: 'CORRECT: In SQL, comparing any value to NULL using comparison operators (=, !=, <, >) yields UNKNOWN. Since WHERE filters accept strictly TRUE, the 10 NULL rows are omitted alongside the 60 "active" rows, returning exactly 30.'
      },
      {
        id: 'opt-3c',
        text: '0 rows because presence of NULL in an inequality comparison throws an unhandled SQL exception',
        isCorrect: false,
        isTrap: true,
        trapType: 'Null Pointer Exception Analogy',
        cognitiveFallacy: 'Object-Oriented Runtime Exception Generalization',
        explanation: 'TRAP: SQL does not throw null pointer errors during standard equality comparisons; it evaluates gracefully to UNKNOWN.'
      },
      {
        id: 'opt-3d',
        text: '70 rows because COUNT(*) counts all rows unless explicitly grouped',
        isCorrect: false,
        isTrap: false,
        explanation: 'INCORRECT: The WHERE filter is evaluated prior to the COUNT aggregation.'
      }
    ]
  },
  {
    id: 'cq-4',
    subjectId: 'sub-cs701',
    subjectCode: 'CS701',
    subjectName: 'Machine Learning',
    topicId: 'dt-2',
    unitNumber: 2,
    officialUnitTitle: 'Unit 2: Classification & Regularization',
    topic: 'Overfitting & Cross-Validation Leakage',
    difficulty: 'Advanced',
    question: 'A data scientist performs Min-Max Normalization on the complete dataset (features scaled to [0,1]) before performing 5-fold cross-validation. The validation accuracy is 96%, but test accuracy on unseen customer data drops to 78%. What primary methodological flaw occurred?',
    codeSnippet: null,
    status: 'published',
    createdByFacultyId: 'fac-1',
    createdByFacultyName: 'Mr. Ashok Rathi',
    version: 1,
    source: 'seed',
    createdAt: '2026-03-01T09:00:00Z',
    updatedAt: '2026-03-01T09:00:00Z',
    options: [
      {
        id: 'opt-4a',
        text: 'Information leakage (Data snooping): The test folds global min and max influenced training preprocessing',
        isCorrect: true,
        isTrap: false,
        explanation: 'CORRECT: Normalizing before splitting leaks global distribution statistics (min/max or mean/variance) from the validation/test folds into the training data, producing over-optimistic validation metrics that fail in production.'
      },
      {
        id: 'opt-4b',
        text: 'Underfitting caused by compressing feature range into [0, 1]',
        isCorrect: false,
        isTrap: true,
        trapType: 'Inverse Attribute Blame',
        cognitiveFallacy: 'Premature Variance Blame',
        explanation: 'TRAP: Min-max scaling does not cause underfitting; in fact, neural nets and gradient descent require normalized scale.'
      },
      {
        id: 'opt-4c',
        text: 'K-Fold cross-validation inherently reduces generalizability compared to train-test splits',
        isCorrect: false,
        isTrap: true,
        trapType: 'Algorithm Skepticism Bias',
        cognitiveFallacy: 'Flawed Core Mechanism Assumption',
        explanation: 'TRAP: K-Fold cross validation is mathematically sound. The fault lies exclusively in preprocessing before splitting.'
      },
      {
        id: 'opt-4d',
        text: 'Curse of dimensionality occurring during normalization',
        isCorrect: false,
        isTrap: false,
        explanation: 'INCORRECT: Normalization does not change feature dimension.'
      }
    ]
  },
  {
    id: 'cq-5',
    subjectId: 'sub-cs301',
    subjectCode: 'CS301',
    subjectName: 'Data Structures & Algorithms',
    topicId: null,
    unitNumber: 1,
    officialUnitTitle: 'Unit 1: Asymptotic Analysis & Algorithmic Complexity',
    topic: 'Binary Search Integer Overflow',
    difficulty: 'Intermediate',
    question: 'Why is calculating midpoint as `int mid = (low + high) / 2;` prone to critical runtime failure in massive integer arrays?',
    codeSnippet: `int binarySearch(int[] arr, int target) {
  int low = 0;
  int high = arr.length - 1;
  while (low <= high) {
    int mid = (low + high) / 2; // Critical line
    if (arr[mid] == target) return mid;
    else if (arr[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return -1;
}`,
    status: 'published',
    createdByFacultyId: 'fac-11',
    createdByFacultyName: 'Dr. Arvind Mishra',
    version: 1,
    source: 'seed',
    createdAt: '2026-03-01T09:00:00Z',
    updatedAt: '2026-03-01T09:00:00Z',
    options: [
      {
        id: 'opt-5a',
        text: 'It fails only if the array contains negative numbers',
        isCorrect: false,
        isTrap: true,
        trapType: 'Special Case Fixation',
        cognitiveFallacy: 'Domain Restriction Assumption',
        explanation: 'TRAP: Even if all array elements and indices are strictly positive, if `low + high` exceeds 2^31 - 1 (Integer.MAX_VALUE), 32-bit signed integer arithmetic wraps around modulo 2^32 into negative numbers.'
      },
      {
        id: 'opt-5b',
        text: 'When low + high exceeds maximum 32-bit signed integer (2^31 - 1), it overflows into a negative value, causing ArrayIndexOutOfBoundsException',
        isCorrect: true,
        isTrap: false,
        explanation: 'CORRECT: In Java and C++, `(low + high)` overflows when the sum exceeds 2^31 - 1 (Integer.MAX_VALUE), wrapping modulo 2^32 into a negative value and causing an ArrayIndexOutOfBoundsException. The correct formulation is `low + (high - low) / 2` or unsigned right-shift `(low + high) >>> 1`.'
      },
      {
        id: 'opt-5c',
        text: 'It produces a floating-point truncation error that skips prime indices',
        isCorrect: false,
        isTrap: true,
        trapType: 'Spurious Numeric Theory',
        cognitiveFallacy: 'Over-Complicated Mathematical Mystification',
        explanation: 'TRAP: Integer division truncates cleanly; there is no mystery regarding prime indices.'
      },
      {
        id: 'opt-5d',
        text: 'Binary search does not require midpoint calculation when pointers are adjacent',
        isCorrect: false,
        isTrap: false,
        explanation: 'INCORRECT: Midpoint calculation is essential to binary divide-and-conquer.'
      }
    ]
  },
  {
    id: 'cq-6',
    subjectId: 'sub-it401',
    subjectCode: 'IT401',
    subjectName: 'Web Application Development',
    topic: 'Memory References & Mutation Aliasing',
    difficulty: 'Intermediate',
    question: 'Consider the following JavaScript function parameter reassignment. What is printed to the console?',
    codeSnippet: `function updateScores(student) {
  student.score += 10;
  student = { name: "Bob", score: 100 };
  return student.score;
}

let alice = { name: "Alice", score: 80 };
updateScores(alice);
console.log(alice.score);`,
    status: 'published',
    createdByFacultyId: 'fac-4',
    createdByFacultyName: 'Prof. Neha Gupta',
    version: 1,
    source: 'seed',
    createdAt: '2026-03-01T09:00:00Z',
    updatedAt: '2026-03-01T09:00:00Z',
    options: [
      {
        id: 'opt-6a',
        text: '100 because the student parameter was reassigned to Bob with score 100',
        isCorrect: false,
        isTrap: true,
        trapType: 'Pointer Reassignment vs Object Mutation Confusion',
        cognitiveFallacy: 'Pass-by-Reference Misconception',
        explanation: 'TRAP: Reassigning `student = { ... }` changes the local parameter identifier inside the function scope. It does NOT mutate the original object referenced by `alice` in the caller stack frame.'
      },
      {
        id: 'opt-6b',
        text: '90 because property mutation affected the heap object, while local reference reassignment had no caller effect',
        isCorrect: true,
        isTrap: false,
        explanation: 'CORRECT: In JavaScript, arguments are passed by value (where the value is an object reference). Mutating `student.score += 10` modifies the shared object in heap memory (80 -> 90). The subsequent reassignment `student = ...` only rebinds the local parameter identifier and does not affect the caller variable.'
      },
      {
        id: 'opt-6c',
        text: '80 because primitives and objects in modern languages are immutable when passed into functions',
        isCorrect: false,
        isTrap: true,
        trapType: 'Universal Immutability Assumption',
        cognitiveFallacy: 'Functional Programming Generalization',
        explanation: 'TRAP: JavaScript objects passed into functions are mutable reference values unless explicitly shallow-frozen with Object.freeze().'
      },
      {
        id: 'opt-6d',
        text: 'TypeError: Assignment to constant parameter',
        isCorrect: false,
        isTrap: false,
        explanation: 'INCORRECT: Function parameters declared without `const` can be reassigned locally without syntax error.'
      }
    ]
  }
];

function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.warn(`Failed reading ${key}`, err);
    return fallback;
  }
}

function writeStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Failed writing to ${key}:`, err);
  }
}

export const learningContentService = {
  // --- STUDY SNIPPETS ---
  getSnippets() {
    return readStorage(SNIPPETS_STORAGE_KEY, INITIAL_STUDY_SNIPPETS);
  },

  getPublishedSnippets(subjectFilter = null) {
    const snippets = this.getSnippets();
    return snippets.filter(s => {
      if (s.status !== 'published') return false;
      if (subjectFilter && s.subjectId !== subjectFilter && s.subjectCode !== subjectFilter) {
        return false;
      }
      return true;
    });
  },

  getFacultySnippets(facultyId) {
    const snippets = this.getSnippets();
    return snippets.filter(s => s.createdByFacultyId === facultyId);
  },

  getSnippetById(id) {
    const snippets = this.getSnippets();
    return snippets.find(s => s.id === id) || null;
  },

  saveSnippet(snippetData, facultyUser) {
    if (!facultyUser || !facultyUser.id) {
      throw new Error('Authenticated faculty credentials required to author study snippets.');
    }

    if (!snippetData.title?.trim() || !snippetData.shortContent?.trim() || !snippetData.topic?.trim()) {
      throw new Error('Title, topic, and summary content are required for a Study Snippet.');
    }

    const snippets = this.getSnippets();
    const newSnippet = {
      id: `snp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      subjectId: snippetData.subjectId,
      subjectCode: snippetData.subjectCode,
      subjectName: snippetData.subjectName,
      topicId: snippetData.topicId || null,
      unitNumber: snippetData.unitNumber ? Number(snippetData.unitNumber) : null,
      officialUnitTitle: snippetData.officialUnitTitle || null,
      topic: snippetData.topic.trim(),
      title: snippetData.title.trim(),
      shortContent: snippetData.shortContent.trim(),
      keyPoints: Array.isArray(snippetData.keyPoints)
        ? snippetData.keyPoints.filter(p => p && p.trim().length > 0)
        : [],
      createdByFacultyId: facultyUser.facultyId || facultyUser.id,
      createdByFacultyName: facultyUser.name,
      status: snippetData.status || 'published', // 'draft' | 'published'
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      relatedQuestionIds: snippetData.relatedQuestionIds || []
    };

    snippets.unshift(newSnippet);
    writeStorage(SNIPPETS_STORAGE_KEY, snippets);
    return newSnippet;
  },

  updateSnippet(id, updatedData, facultyUser) {
    if (!facultyUser || facultyUser.role === 'admin') {
      throw new Error('Academic oversight is read-only. Content edits are restricted to faculty.');
    }
    const snippets = this.getSnippets();
    const idx = snippets.findIndex(s => s.id === id);
    if (idx === -1) throw new Error('Study Snippet not found.');

    const existing = snippets[idx];
    if (existing.createdByFacultyId !== (facultyUser.facultyId || facultyUser.id)) {
      throw new Error('Unauthorized: Faculty may only edit their own authored Study Snippets.');
    }

    snippets[idx] = {
      ...existing,
      ...updatedData,
      id: existing.id,
      createdByFacultyId: existing.createdByFacultyId,
      createdByFacultyName: existing.createdByFacultyName,
      topicId: updatedData.topicId !== undefined ? updatedData.topicId : existing.topicId,
      unitNumber: updatedData.unitNumber !== undefined ? (updatedData.unitNumber ? Number(updatedData.unitNumber) : null) : existing.unitNumber,
      officialUnitTitle: updatedData.officialUnitTitle !== undefined ? updatedData.officialUnitTitle : existing.officialUnitTitle,
      updatedAt: new Date().toISOString()
    };

    writeStorage(SNIPPETS_STORAGE_KEY, snippets);
    return snippets[idx];
  },

  archiveSnippet(id, facultyUser) {
    if (!facultyUser || facultyUser.role === 'admin') {
      throw new Error('Academic oversight is read-only. Content archiving is restricted to faculty.');
    }
    const snippets = this.getSnippets();
    const idx = snippets.findIndex(s => s.id === id);
    if (idx === -1) throw new Error('Study Snippet not found.');

    const existing = snippets[idx];
    if (existing.createdByFacultyId !== (facultyUser.facultyId || facultyUser.id)) {
      throw new Error('Unauthorized: Faculty may only archive their own authored Study Snippets.');
    }

    snippets[idx].status = 'archived';
    snippets[idx].updatedAt = new Date().toISOString();
    writeStorage(SNIPPETS_STORAGE_KEY, snippets);
    return snippets[idx];
  },

  canDeleteSnippet(id) {
    const s = this.getSnippetById(id);
    if (!s) return false;
    return s.status === 'draft';
  },

  deleteDraftSnippet(id, facultyUser) {
    if (!facultyUser || facultyUser.role === 'admin') {
      throw new Error('Unauthorized: Only authoring faculty can delete draft snippets.');
    }
    const snippets = this.getSnippets();
    const idx = snippets.findIndex(s => s.id === id);
    if (idx === -1) throw new Error('Study Snippet not found.');
    const s = snippets[idx];
    if (s.createdByFacultyId !== (facultyUser.facultyId || facultyUser.id)) {
      throw new Error('Unauthorized: Faculty may only delete their own draft snippets.');
    }
    if (!this.canDeleteSnippet(id)) {
      throw new Error('Cannot delete: Snippet has already been published. Use Archive instead.');
    }
    snippets.splice(idx, 1);
    writeStorage(SNIPPETS_STORAGE_KEY, snippets);
    return { success: true, id };
  },

  // --- DIAGNOSTIC QUESTION BANK ---
  getQuestions() {
    const raw = readStorage(QUESTIONS_STORAGE_KEY, INITIAL_DIAGNOSTIC_QUESTIONS);
    return raw.map(q => {
      const canonicalQ = q.question || q.questionText || '';
      return {
        ...q,
        question: canonicalQ,
        questionText: canonicalQ,
        options: (q.options || []).map(opt => ({
          ...opt,
          isCorrect: !!opt.isCorrect,
          isTrap: !opt.isCorrect && (opt.isTrap || !!opt.misconceptionTag || !!opt.trapType),
          trapType: !opt.isCorrect && (opt.isTrap || opt.misconceptionTag || opt.trapType) ? (opt.trapType || opt.misconceptionTag || 'Misconception Trap') : null,
          misconceptionTag: !opt.isCorrect && (opt.isTrap || opt.misconceptionTag || opt.trapType) ? (opt.misconceptionTag || opt.trapType || 'Misconception Trap') : null,
          cognitiveFallacy: !opt.isCorrect && (opt.isTrap || opt.cognitiveFallacy) ? (opt.cognitiveFallacy || 'Conceptual Bias') : null,
          explanation: opt.explanation || (opt.isCorrect ? 'Correct choice.' : 'Incorrect option.')
        }))
      };
    });
  },

  getPublishedQuestions(filter = {}) {
    const questions = this.getQuestions();
    return questions.filter(q => {
      if (q.status !== 'published') return false;
      if (filter.subjectId && q.subjectId !== filter.subjectId) return false;
      if (filter.subjectCode && q.subjectCode !== filter.subjectCode) return false;
      if (filter.topic && q.topic !== filter.topic) return false;
      return true;
    });
  },

  getFacultyQuestions(facultyId) {
    const questions = this.getQuestions();
    return questions.filter(q => q.createdByFacultyId === facultyId);
  },

  getQuestionById(id) {
    const questions = this.getQuestions();
    return questions.find(q => q.id === id) || null;
  },

  validateQuestionData(data) {
    const qText = (data.question || data.questionText || '').trim();
    if (!qText) return 'Question text is required.';
    if (!data.topic?.trim()) return 'Topic is required.';
    if (!data.subjectId || !data.subjectCode) return 'Assigned subject is required.';
    if (!Array.isArray(data.options) || data.options.length !== 4) {
      return 'Exactly four answer options are required for diagnostic distractor analysis.';
    }

    const texts = data.options.map(o => (o.text || '').trim());
    if (texts.some(t => t.length === 0)) {
      return 'All four answer options must contain text.';
    }

    // Check for duplicates
    const unique = new Set(texts.map(t => t.toLowerCase()));
    if (unique.size !== texts.length) {
      return 'Answer options must be distinct; duplicate options are rejected.';
    }

    const correctCount = data.options.filter(o => o.isCorrect).length;
    if (correctCount !== 1) {
      return 'Exactly ONE option must be designated as the correct answer.';
    }

    return null;
  },

  saveQuestion(questionData, facultyUser) {
    if (!facultyUser || !facultyUser.id || facultyUser.role === 'admin') {
      throw new Error('Authenticated faculty credentials required to author diagnostic questions.');
    }

    const validationError = this.validateQuestionData(questionData);
    if (validationError) throw new Error(validationError);

    const questions = this.getQuestions();
    const qText = (questionData.question || questionData.questionText || '').trim();
    const newQuestion = {
      id: `cq-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      subjectId: questionData.subjectId,
      subjectCode: questionData.subjectCode,
      subjectName: questionData.subjectName,
      topicId: questionData.topicId || null,
      unitNumber: questionData.unitNumber ? Number(questionData.unitNumber) : null,
      officialUnitTitle: questionData.officialUnitTitle || null,
      topic: questionData.topic.trim(),
      difficulty: questionData.difficulty || 'Intermediate',
      question: qText,
      questionText: qText,
      codeSnippet: questionData.codeSnippet?.trim() || null,
      status: questionData.status || 'published', // 'draft' | 'published'
      createdByFacultyId: facultyUser.facultyId || facultyUser.id,
      createdByFacultyName: facultyUser.name,
      version: 1,
      source: 'faculty',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      options: questionData.options.map((opt, i) => {
        const isTrap = !opt.isCorrect && (opt.isTrap || !!opt.misconceptionTag || !!opt.trapType);
        return {
          id: opt.id || `opt-${Date.now()}-${i}`,
          text: opt.text.trim(),
          isCorrect: !!opt.isCorrect,
          isTrap: !!isTrap,
          trapType: isTrap ? (opt.trapType || opt.misconceptionTag || 'Misconception Trap') : null,
          misconceptionTag: isTrap ? (opt.misconceptionTag || opt.trapType || 'Misconception Trap') : null,
          cognitiveFallacy: isTrap ? (opt.cognitiveFallacy || 'Conceptual Bias') : null,
          explanation: opt.explanation?.trim() || (opt.isCorrect ? 'Correct choice.' : 'Incorrect option.')
        };
      })
    };

    questions.unshift(newQuestion);
    writeStorage(QUESTIONS_STORAGE_KEY, questions);
    return newQuestion;
  },

  updateQuestion(id, updatedData, facultyUser) {
    if (!facultyUser || facultyUser.role === 'admin') {
      throw new Error('Academic oversight is read-only. Content edits are restricted to faculty.');
    }
    const questions = this.getQuestions();
    const idx = questions.findIndex(q => q.id === id);
    if (idx === -1) throw new Error('Question not found.');

    const existing = questions[idx];
    if (existing.createdByFacultyId !== (facultyUser.facultyId || facultyUser.id)) {
      throw new Error('Unauthorized: Faculty may only edit their own authored questions.');
    }

    const validationError = this.validateQuestionData({ ...existing, ...updatedData });
    if (validationError) throw new Error(validationError);

    const qText = (updatedData.question || updatedData.questionText || existing.question || existing.questionText || '').trim();

    questions[idx] = {
      ...existing,
      ...updatedData,
      id: existing.id,
      question: qText,
      questionText: qText,
      createdByFacultyId: existing.createdByFacultyId,
      createdByFacultyName: existing.createdByFacultyName,
      topicId: updatedData.topicId !== undefined ? updatedData.topicId : existing.topicId,
      unitNumber: updatedData.unitNumber !== undefined ? (updatedData.unitNumber ? Number(updatedData.unitNumber) : null) : existing.unitNumber,
      officialUnitTitle: updatedData.officialUnitTitle !== undefined ? updatedData.officialUnitTitle : existing.officialUnitTitle,
      version: (existing.version || 1) + 1,
      updatedAt: new Date().toISOString(),
      options: (updatedData.options || existing.options).map((opt, i) => {
        const isTrap = !opt.isCorrect && (opt.isTrap || !!opt.misconceptionTag || !!opt.trapType);
        return {
          id: opt.id || `opt-${Date.now()}-${i}`,
          text: opt.text.trim(),
          isCorrect: !!opt.isCorrect,
          isTrap: !!isTrap,
          trapType: isTrap ? (opt.trapType || opt.misconceptionTag || 'Misconception Trap') : null,
          misconceptionTag: isTrap ? (opt.misconceptionTag || opt.trapType || 'Misconception Trap') : null,
          cognitiveFallacy: isTrap ? (opt.cognitiveFallacy || 'Conceptual Bias') : null,
          explanation: opt.explanation?.trim() || (opt.isCorrect ? 'Correct choice.' : 'Incorrect option.')
        };
      })
    };

    writeStorage(QUESTIONS_STORAGE_KEY, questions);
    return questions[idx];
  },

  archiveQuestion(id, facultyUser) {
    if (!facultyUser || facultyUser.role === 'admin') {
      throw new Error('Academic oversight is read-only. Content archiving is restricted to faculty.');
    }
    const questions = this.getQuestions();
    const idx = questions.findIndex(q => q.id === id);
    if (idx === -1) throw new Error('Question not found.');

    const existing = questions[idx];
    if (existing.createdByFacultyId !== (facultyUser.facultyId || facultyUser.id)) {
      throw new Error('Unauthorized: Faculty may only archive their own authored questions.');
    }

    questions[idx].status = 'archived';
    questions[idx].updatedAt = new Date().toISOString();
    writeStorage(QUESTIONS_STORAGE_KEY, questions);
    return questions[idx];
  },

  canDeleteQuestion(id) {
    const q = this.getQuestionById(id);
    if (!q) return false;
    if (q.status !== 'draft') return false;
    try {
      const raw = localStorage.getItem('studysnippet_quiz_attempts_v1');
      if (raw) {
        const attempts = JSON.parse(raw);
        const isReferenced = attempts.some(a => (a.answers || []).some(ans => ans.questionId === id));
        if (isReferenced) return false;
      }
    } catch (_e) {}
    return true;
  },

  deleteDraftQuestion(id, facultyUser) {
    if (!facultyUser || facultyUser.role === 'admin') {
      throw new Error('Unauthorized: Only authoring faculty can delete draft questions.');
    }
    const questions = this.getQuestions();
    const idx = questions.findIndex(q => q.id === id);
    if (idx === -1) throw new Error('Diagnostic Question not found.');
    const q = questions[idx];
    if (q.createdByFacultyId !== (facultyUser.facultyId || facultyUser.id)) {
      throw new Error('Unauthorized: Faculty may only delete their own draft questions.');
    }
    if (!this.canDeleteQuestion(id)) {
      throw new Error('Cannot delete: Question has already been published or referenced by attempts. Use Archive instead.');
    }
    questions.splice(idx, 1);
    writeStorage(QUESTIONS_STORAGE_KEY, questions);
    return { success: true, id };
  },

  // --- DIAGNOSTIC TOPIC PLAN ---
  getTopics() {
    return readStorage(TOPICS_STORAGE_KEY, INITIAL_DIAGNOSTIC_TOPICS);
  },

  getTopicById(id) {
    const topics = this.getTopics();
    return topics.find(t => t.id === id) || null;
  },

  saveTopic(topicData, facultyUser) {
    if (!facultyUser || !facultyUser.id || facultyUser.role === 'admin') {
      throw new Error('Authenticated faculty credentials required to author diagnostic topics.');
    }
    if (!topicData.topicTitle?.trim()) {
      throw new Error('Topic title is required.');
    }
    if (!topicData.subjectId || !topicData.subjectCode) {
      throw new Error('Assigned course is required.');
    }
    if (!topicData.unitNumber) {
      throw new Error('Official syllabus unit reference is required.');
    }

    const topics = this.getTopics();
    const newTopic = {
      id: `dt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      subjectId: topicData.subjectId,
      subjectCode: topicData.subjectCode,
      unitNumber: Number(topicData.unitNumber),
      officialUnitTitle: topicData.officialUnitTitle || `Unit ${topicData.unitNumber}`,
      topicTitle: topicData.topicTitle.trim(),
      shortDescription: (topicData.shortDescription || '').trim(),
      learningObjective: (topicData.learningObjective || '').trim(),
      createdByFacultyId: facultyUser.facultyId || facultyUser.id,
      createdByFacultyName: facultyUser.name || 'Faculty Member',
      status: topicData.status || 'active', // 'draft' | 'active' | 'archived'
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    topics.unshift(newTopic);
    writeStorage(TOPICS_STORAGE_KEY, topics);
    return newTopic;
  },

  updateTopic(id, updatedData, facultyUser) {
    if (!facultyUser || facultyUser.role === 'admin') {
      throw new Error('Academic oversight is read-only. Topic edits are restricted to faculty.');
    }
    const topics = this.getTopics();
    const idx = topics.findIndex(t => t.id === id);
    if (idx === -1) throw new Error('Diagnostic Topic not found.');

    const existing = topics[idx];
    if (existing.createdByFacultyId !== (facultyUser.facultyId || facultyUser.id)) {
      throw new Error('Unauthorized: Faculty may only edit their own authored diagnostic topics.');
    }

    topics[idx] = {
      ...existing,
      ...updatedData,
      id: existing.id,
      createdByFacultyId: existing.createdByFacultyId,
      createdByFacultyName: existing.createdByFacultyName,
      unitNumber: updatedData.unitNumber ? Number(updatedData.unitNumber) : existing.unitNumber,
      officialUnitTitle: updatedData.officialUnitTitle || existing.officialUnitTitle,
      updatedAt: new Date().toISOString()
    };
    writeStorage(TOPICS_STORAGE_KEY, topics);
    return topics[idx];
  },

  archiveTopic(id, facultyUser) {
    if (!facultyUser || facultyUser.role === 'admin') {
      throw new Error('Academic oversight is read-only. Topic archiving is restricted to faculty.');
    }
    const topics = this.getTopics();
    const idx = topics.findIndex(t => t.id === id);
    if (idx === -1) throw new Error('Diagnostic Topic not found.');

    const existing = topics[idx];
    if (existing.createdByFacultyId !== (facultyUser.facultyId || facultyUser.id)) {
      throw new Error('Unauthorized: Faculty may only archive their own authored diagnostic topics.');
    }

    topics[idx].status = 'archived';
    topics[idx].updatedAt = new Date().toISOString();
    writeStorage(TOPICS_STORAGE_KEY, topics);
    return topics[idx];
  },

  canDeleteTopic(id) {
    const t = this.getTopicById(id);
    if (!t) return false;
    if (t.status !== 'draft') return false;
    const snippets = this.getSnippets();
    if (snippets.some(s => s.topicId === id)) return false;
    const questions = this.getQuestions();
    if (questions.some(q => q.topicId === id)) return false;
    return true;
  },

  deleteDraftTopic(id, facultyUser) {
    if (!facultyUser || facultyUser.role === 'admin') {
      throw new Error('Unauthorized: Only authoring faculty can delete draft topics.');
    }
    const topics = this.getTopics();
    const idx = topics.findIndex(t => t.id === id);
    if (idx === -1) throw new Error('Diagnostic Topic not found.');
    const t = topics[idx];
    if (t.createdByFacultyId !== (facultyUser.facultyId || facultyUser.id)) {
      throw new Error('Unauthorized: Faculty may only delete their own draft topics.');
    }
    if (!this.canDeleteTopic(id)) {
      throw new Error('Cannot delete: Topic is either active/archived or referenced by learning content. Use Archive instead.');
    }
    topics.splice(idx, 1);
    writeStorage(TOPICS_STORAGE_KEY, topics);
    return { success: true, id };
  },

  // Reset to initial seed content if requested
  resetLearningContent() {
    writeStorage(SNIPPETS_STORAGE_KEY, INITIAL_STUDY_SNIPPETS);
    writeStorage(QUESTIONS_STORAGE_KEY, INITIAL_DIAGNOSTIC_QUESTIONS);
    writeStorage(TOPICS_STORAGE_KEY, INITIAL_DIAGNOSTIC_TOPICS);
    return true;
  }
};

export function getStudySnippets(filter = {}) {
  const snippets = learningContentService.getSnippets();
  return snippets.filter(s => {
    if (filter.status && s.status !== filter.status) return false;
    if (filter.facultyId && s.createdByFacultyId !== filter.facultyId) return false;
    if (filter.subjectCode && s.subjectCode !== filter.subjectCode) return false;
    if (filter.subjectId && s.subjectId !== filter.subjectId) return false;
    if (filter.topicId && s.topicId !== filter.topicId) return false;
    return true;
  });
}

export function saveStudySnippet(snippetData, facultyUser = {}) {
  const user = facultyUser.id ? facultyUser : {
    id: snippetData.createdByFacultyId || 'fac-1',
    facultyId: snippetData.createdByFacultyId || 'fac-1',
    name: snippetData.createdByFacultyName || 'Mr. Ashok Rathi',
    role: 'faculty'
  };
  if (snippetData.id && learningContentService.getSnippetById(snippetData.id)) {
    return learningContentService.updateSnippet(snippetData.id, snippetData, user);
  }
  return learningContentService.saveSnippet(snippetData, user);
}

export function archiveStudySnippet(id, facultyUser) {
  return learningContentService.archiveSnippet(id, facultyUser || { role: 'faculty', facultyId: 'fac-1', id: 'fac-1' });
}

export function deleteStudySnippet(id, facultyUser) {
  return archiveStudySnippet(id, facultyUser);
}

export function deleteDraftStudySnippet(id, facultyUser) {
  return learningContentService.deleteDraftSnippet(id, facultyUser || { role: 'faculty', facultyId: 'fac-1', id: 'fac-1' });
}

export function canDeleteStudySnippet(id) {
  return learningContentService.canDeleteSnippet(id);
}

export function getDiagnosticQuestions(filter = {}) {
  const questions = learningContentService.getQuestions();
  return questions.filter(q => {
    if (filter.status && q.status !== filter.status) return false;
    if (filter.facultyId && q.createdByFacultyId !== filter.facultyId) return false;
    if (filter.subjectCode && q.subjectCode !== filter.subjectCode) return false;
    if (filter.subjectId && q.subjectId !== filter.subjectId) return false;
    if (filter.topicId && q.topicId !== filter.topicId) return false;
    return true;
  });
}

export function saveDiagnosticQuestion(questionData, facultyUser = {}) {
  const user = facultyUser.id ? facultyUser : {
    id: questionData.createdByFacultyId || 'fac-1',
    facultyId: questionData.createdByFacultyId || 'fac-1',
    name: questionData.createdByFacultyName || 'Mr. Ashok Rathi',
    role: 'faculty'
  };
  if (questionData.id && learningContentService.getQuestionById(questionData.id)) {
    return learningContentService.updateQuestion(questionData.id, questionData, user);
  }
  return learningContentService.saveQuestion(questionData, user);
}

export function archiveDiagnosticQuestion(id, facultyUser) {
  return learningContentService.archiveQuestion(id, facultyUser || { role: 'faculty', facultyId: 'fac-1', id: 'fac-1' });
}

export function deleteDiagnosticQuestion(id, facultyUser) {
  return archiveDiagnosticQuestion(id, facultyUser);
}

export function deleteDraftDiagnosticQuestion(id, facultyUser) {
  return learningContentService.deleteDraftQuestion(id, facultyUser || { role: 'faculty', facultyId: 'fac-1', id: 'fac-1' });
}

export function canDeleteDiagnosticQuestion(id) {
  return learningContentService.canDeleteQuestion(id);
}

export function getDiagnosticTopics(filter = {}) {
  const topics = learningContentService.getTopics();
  return topics.filter(t => {
    if (filter.status && t.status !== filter.status) return false;
    if (filter.facultyId && t.createdByFacultyId !== filter.facultyId) return false;
    if (filter.subjectCode && t.subjectCode !== filter.subjectCode) return false;
    if (filter.subjectId && t.subjectId !== filter.subjectId) return false;
    return true;
  });
}

export function saveDiagnosticTopic(topicData, facultyUser = {}) {
  const user = facultyUser.id ? facultyUser : {
    id: topicData.createdByFacultyId || 'fac-1',
    facultyId: topicData.createdByFacultyId || 'fac-1',
    name: topicData.createdByFacultyName || 'Mr. Ashok Rathi',
    role: 'faculty'
  };
  if (topicData.id && learningContentService.getTopicById(topicData.id)) {
    return learningContentService.updateTopic(topicData.id, topicData, user);
  }
  return learningContentService.saveTopic(topicData, user);
}

export function archiveDiagnosticTopic(id, facultyUser) {
  return learningContentService.archiveTopic(id, facultyUser || { role: 'faculty', facultyId: 'fac-1', id: 'fac-1' });
}

export function deleteDraftDiagnosticTopic(id, facultyUser) {
  return learningContentService.deleteDraftTopic(id, facultyUser || { role: 'faculty', facultyId: 'fac-1', id: 'fac-1' });
}

export function canDeleteDiagnosticTopic(id) {
  return learningContentService.canDeleteTopic(id);
}

export function validateStudySnippet(snippetData) {
  const errors = [];
  if (!snippetData.title || !snippetData.title.trim()) errors.push('Title is required.');
  if (!snippetData.topic || !snippetData.topic.trim()) errors.push('Topic is required.');
  if (!snippetData.shortContent || !snippetData.shortContent.trim()) errors.push('Content explanation is required.');
  return { isValid: errors.length === 0, errors };
}

export function validateDiagnosticQuestion(questionData) {
  const errors = [];
  const err = learningContentService.validateQuestionData(questionData);
  if (err) errors.push(err);
  return { isValid: errors.length === 0, errors };
}

export default learningContentService;
