// Seed data for StudySnippet

export const INITIAL_DEPARTMENTS = [
  { id: 'dept-cse', name: 'Computer Science & Engineering', code: 'CSE', head: 'Mr. Ashok Rathi' },
  { id: 'dept-it', name: 'Information Technology', code: 'IT', head: 'Dr. Rajesh Verma' },
  { id: 'dept-ece', name: 'Electronics & Communication Engineering', code: 'ECE', head: 'Dr. Anita Roy' },
  { id: 'dept-me', name: 'Mechanical Engineering', code: 'ME', head: 'Dr. Suresh Nair' },
  { id: 'dept-ce', name: 'Civil Engineering', code: 'CE', head: 'Dr. Vikram Patel' },
];

export const INITIAL_FACULTY = [
  {
    id: 'fac-1',
    name: 'Mr. Ashok Rathi',
    departmentId: 'dept-cse',
    designation: 'Professor & Head',
    active: true,
    experience: '16 Years',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=256'
  },
  {
    id: 'fac-2',
    name: 'Prof. Amit Kulkarni',
    departmentId: 'dept-cse',
    designation: 'Associate Professor',
    active: true,
    experience: '11 Years',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'
  },
  {
    id: 'fac-3',
    name: 'Dr. Rajesh Verma',
    departmentId: 'dept-it',
    designation: 'Professor',
    active: true,
    experience: '14 Years',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256'
  },
  {
    id: 'fac-4',
    name: 'Prof. Neha Gupta',
    departmentId: 'dept-it',
    designation: 'Assistant Professor',
    active: true,
    experience: '6 Years',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=256'
  },
  {
    id: 'fac-5',
    name: 'Dr. Anita Roy',
    departmentId: 'dept-ece',
    designation: 'Professor & Head',
    active: true,
    experience: '18 Years',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256'
  },
  {
    id: 'fac-6',
    name: 'Prof. Rohan Sen',
    departmentId: 'dept-ece',
    designation: 'Associate Professor',
    active: true,
    experience: '9 Years',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256'
  },
  {
    id: 'fac-7',
    name: 'Dr. Suresh Nair',
    departmentId: 'dept-me',
    designation: 'Professor & Head',
    active: true,
    experience: '20 Years',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=256'
  },
  {
    id: 'fac-8',
    name: 'Prof. Manoj Pandey',
    departmentId: 'dept-me',
    designation: 'Assistant Professor',
    active: true,
    experience: '5 Years',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=256'
  },
  {
    id: 'fac-9',
    name: 'Dr. Vikram Patel',
    departmentId: 'dept-ce',
    designation: 'Professor & Head',
    active: true,
    experience: '17 Years',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=256'
  },
  {
    id: 'fac-10',
    name: 'Prof. Sneha Das',
    departmentId: 'dept-ce',
    designation: 'Assistant Professor',
    active: true,
    experience: '4 Years',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'
  },
  {
    id: 'fac-11',
    name: 'Dr. Arvind Mishra',
    departmentId: 'dept-cse',
    designation: 'Associate Professor',
    active: true,
    experience: '10 Years',
    avatar: 'https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?auto=format&fit=crop&q=80&w=256'
  },
  {
    id: 'fac-12',
    name: 'Prof. Pooja Mehra',
    departmentId: 'dept-it',
    designation: 'Assistant Professor',
    active: true,
    experience: '3 Years',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=256'
  }
];

export const INITIAL_SUBJECTS = [
  // CSE
  { id: 'sub-cs701', code: 'CS701', name: 'Machine Learning', departmentId: 'dept-cse', semester: 7, facultyIds: ['fac-1'] },
  { id: 'sub-cs501', code: 'CS501', name: 'Database Management Systems', departmentId: 'dept-cse', semester: 5, facultyIds: ['fac-2', 'fac-1'] },
  { id: 'sub-cs301', code: 'CS301', name: 'Data Structures & Algorithms', departmentId: 'dept-cse', semester: 3, facultyIds: ['fac-2', 'fac-11'] },
  { id: 'sub-cs601', code: 'CS601', name: 'Compiler Design', departmentId: 'dept-cse', semester: 6, facultyIds: ['fac-11'] },
  // IT
  { id: 'sub-it601', code: 'IT601', name: 'Cloud Computing Architecture', departmentId: 'dept-it', semester: 6, facultyIds: ['fac-3'] },
  { id: 'sub-it401', code: 'IT401', name: 'Web Application Development', departmentId: 'dept-it', semester: 4, facultyIds: ['fac-4'] },
  { id: 'sub-it701', code: 'IT701', name: 'Information & Network Security', departmentId: 'dept-it', semester: 7, facultyIds: ['fac-3', 'fac-12'] },
  { id: 'sub-it501', code: 'IT501', name: 'Software Engineering & Agile', departmentId: 'dept-it', semester: 5, facultyIds: ['fac-12'] },
  // ECE
  { id: 'sub-ec401', code: 'EC401', name: 'Signals & Systems', departmentId: 'dept-ece', semester: 4, facultyIds: ['fac-5'] },
  { id: 'sub-ec601', code: 'EC601', name: 'Digital Signal Processing', departmentId: 'dept-ece', semester: 6, facultyIds: ['fac-5', 'fac-6'] },
  { id: 'sub-ec501', code: 'EC501', name: 'VLSI Circuit Design', departmentId: 'dept-ece', semester: 5, facultyIds: ['fac-6'] },
  { id: 'sub-ec701', code: 'EC701', name: 'Embedded IoT Systems', departmentId: 'dept-ece', semester: 7, facultyIds: ['fac-6'] },
  // ME
  { id: 'sub-me301', code: 'ME301', name: 'Thermodynamics & Heat Transfer', departmentId: 'dept-me', semester: 3, facultyIds: ['fac-7'] },
  { id: 'sub-me501', code: 'ME501', name: 'Fluid Mechanics & Turbomachinery', departmentId: 'dept-me', semester: 5, facultyIds: ['fac-7', 'fac-8'] },
  { id: 'sub-me701', code: 'ME701', name: 'Robotics & Automation', departmentId: 'dept-me', semester: 7, facultyIds: ['fac-8'] },
  // CE
  { id: 'sub-ce401', code: 'CE401', name: 'Structural Analysis', departmentId: 'dept-ce', semester: 4, facultyIds: ['fac-9'] },
  { id: 'sub-ce601', code: 'CE601', name: 'Geotechnical Engineering', departmentId: 'dept-ce', semester: 6, facultyIds: ['fac-9', 'fac-10'] },
  { id: 'sub-ce501', code: 'CE501', name: 'Transportation & Highway Design', departmentId: 'dept-ce', semester: 5, facultyIds: ['fac-10'] }
];

export const INITIAL_CLASSES = {
  'dept-cse': ['CSE-A', 'CSE-B', 'CSE-C'],
  'dept-it': ['IT-A', 'IT-B'],
  'dept-ece': ['ECE-A', 'ECE-B'],
  'dept-me': ['ME-A', 'ME-B'],
  'dept-ce': ['CE-A', 'CE-B']
};

export const INITIAL_SETTINGS = {
  institutionName: 'Apex Institute of Technology & Science',
  minFeedbackThreshold: 5,
  topThreshold: 4.0,
  strongThreshold: 3.5,
  opportunityThreshold: 3.0,
  theme: 'light',
  academicYear: '2025-2026',
  currentSemester: 'Even Semester (Jan-May 2026)'
};

// Generate 115 realistic seed feedback records
const realisticComments = {
  positive: [
    "Mr. Ashok Rathi explains complex ML concepts with phenomenal real-world case studies and Kaggle datasets. Always very approachable during office hours.",
    "Very engaging lecture style! Uses live coding demonstrations instead of dry slides, which makes the algorithms intuitive.",
    "Remarkable subject knowledge. Clarifies every doubt thoroughly and encourages students to publish research papers.",
    "Consistently on time and very well structured lectures. The assignments are challenging yet very rewarding.",
    "Best professor this semester. Provides comprehensive lecture notes, timely feedback on assignments, and industry context.",
    "Great communication and enthusiasm for the subject. Made VLSI design feel exciting rather than intimidating.",
    "Very structured course delivery. Clear grading criteria and always available to discuss project ideas.",
    "Exceptional clarity when explaining mathematical derivations. Patient with students who struggle with core concepts."
  ],
  neutral: [
    "Good subject grasp, though lectures could incorporate more hands-on practical lab sessions.",
    "Punctual and follows the syllabus systematically. More real-life industry examples would make it even better.",
    "Explanations are clear, but the pacing can sometimes feel a bit fast in the second half of the lecture.",
    "Decent teaching style. Would appreciate more timely assignment returns and detailed grading rubrics.",
    "Good coverage of theoretical fundamentals, though the lecture slides have too much text."
  ],
  constructive: [
    "Please slow down during complex mathematical derivations. More practice problem sheets would really help.",
    "Class starts late occasionally and pace at the end feels rushed. Would benefit from more interactive Q&A.",
    "Subject knowledge is solid, but communication needs improvement. More student engagement would keep everyone focused.",
    "Assignments are too theoretical. We need more coding and practical implementation exercises in the lab.",
    "Needs more interactive sessions and better microphone audio in the lecture hall."
  ]
};

function generateSeedFeedback() {
  const records = [];
  const now = new Date();
  
  // Faculty configurations to give realistic performance profiles
  const profiles = {
    'fac-1': { base: 4.7, variance: 0.4, dept: 'dept-cse', sub: 'sub-cs701', sem: 7, cls: 'CSE-A', count: 18 },
    'fac-2': { base: 4.2, variance: 0.6, dept: 'dept-cse', sub: 'sub-cs501', sem: 5, cls: 'CSE-B', count: 14 },
    'fac-3': { base: 4.5, variance: 0.5, dept: 'dept-it', sub: 'sub-it601', sem: 6, cls: 'IT-A', count: 16 },
    'fac-4': { base: 3.8, variance: 0.7, dept: 'dept-it', sub: 'sub-it401', sem: 4, cls: 'IT-B', count: 12 },
    'fac-5': { base: 4.6, variance: 0.4, dept: 'dept-ece', sub: 'sub-ec401', sem: 4, cls: 'ECE-A', count: 15 },
    'fac-6': { base: 3.3, variance: 0.8, dept: 'dept-ece', sub: 'sub-ec501', sem: 5, cls: 'ECE-B', count: 11 },
    'fac-7': { base: 4.1, variance: 0.6, dept: 'dept-me', sub: 'sub-me301', sem: 3, cls: 'ME-A', count: 13 },
    'fac-8': { base: 2.8, variance: 0.9, dept: 'dept-me', sub: 'sub-me701', sem: 7, cls: 'ME-B', count: 9 }, // Improvement profile
    'fac-9': { base: 4.4, variance: 0.5, dept: 'dept-ce', sub: 'sub-ce401', sem: 4, cls: 'CE-A', count: 14 },
    'fac-10': { base: 3.6, variance: 0.7, dept: 'dept-ce', sub: 'sub-ce601', sem: 6, cls: 'CE-B', count: 10 },
    'fac-11': { base: 3.9, variance: 0.6, dept: 'dept-cse', sub: 'sub-cs301', sem: 3, cls: 'CSE-A', count: 8 },
    'fac-12': { base: 3.7, variance: 0.6, dept: 'dept-it', sub: 'sub-it501', sem: 5, cls: 'IT-A', count: 3 } // Insufficient feedback (<5)
  };

  let idCounter = 1000;

  Object.entries(profiles).forEach(([facId, config]) => {
    for (let i = 0; i < config.count; i++) {
      idCounter++;
      // Distribute timestamps over last 6 months
      const daysAgo = Math.floor(Math.random() * 160);
      const createdAt = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000).toISOString();

      const clampRating = (val) => Math.max(1, Math.min(5, Math.round(val)));
      const genRating = (boost = 0) => {
        const jitter = (Math.random() - 0.5) * config.variance * 2;
        return clampRating(config.base + boost + jitter);
      };

      const ratings = {
        subjectKnowledge: genRating(0.2),
        clarity: genRating(-0.1),
        communication: genRating(0),
        engagement: genRating(-0.2),
        punctuality: genRating(0.1),
        satisfaction: genRating(-0.1)
      };

      // Select comment based on average score
      const avg = Object.values(ratings).reduce((a, b) => a + b, 0) / 6;
      let comment = '';
      if (Math.random() > 0.15) { // 85% have comments
        if (avg >= 4.2) {
          comment = realisticComments.positive[Math.floor(Math.random() * realisticComments.positive.length)];
        } else if (avg >= 3.4) {
          comment = realisticComments.neutral[Math.floor(Math.random() * realisticComments.neutral.length)];
        } else {
          comment = realisticComments.constructive[Math.floor(Math.random() * realisticComments.constructive.length)];
        }
      }

      records.push({
        id: `fb-${idCounter}`,
        facultyId: facId,
        subjectId: config.sub,
        departmentId: config.dept,
        semester: config.sem,
        className: config.cls,
        ratings,
        comment,
        createdAt,
        anonymousSessionHash: `seed-hash-${idCounter}`,
        dataProvenance: 'demo',
        isDemo: true
      });
    }
  });

  return records;
}

export const INITIAL_FEEDBACK = generateSeedFeedback();

export const INITIAL_ADJUSTMENTS = [
  {
    id: 'adj-1',
    facultyId: 'fac-1',
    facultyName: 'Mr. Ashok Rathi',
    subjectId: 'sub-cs701',
    subjectName: 'Machine Learning (CS701)',
    thematicCategory: 'Pacing & Derivation Clarity',
    feedbackPattern: 'Student qualitative feedback noted complex backpropagation and gradient derivations were rushed in the 2nd half of lectures.',
    intervention: 'Split Backpropagation into a two-part lecture series. Created step-by-step vector calculus cheat sheets and dedicated 20 minutes to live PyTorch computational graph tracing.',
    term: 'Spring 2026',
    week: 'Week 5',
    status: 'Implemented',
    hodReviewed: true,
    hodNotes: 'Pedagogical adjustment verified under academic oversight. Student feedback reflects improved derivation clarity in subsequent sessions.',
    dataProvenance: 'demo',
    isDemo: true,
    createdAt: '2026-02-14T10:00:00Z'
  },
  {
    id: 'adj-2',
    facultyId: 'fac-2',
    facultyName: 'Prof. Amit Kulkarni',
    subjectId: 'sub-cs501',
    subjectName: 'Database Management Systems (CS501)',
    thematicCategory: 'Hands-on Practical Lab Sessions',
    feedbackPattern: 'Students requested more real-world SQL schema optimization and query profiling rather than pure relational algebra proofs.',
    intervention: 'Introduced live PostgreSQL query plan analysis (EXPLAIN ANALYZE) and index optimization in weekly lab checkpoints.',
    term: 'Spring 2026',
    week: 'Week 6',
    status: 'Implemented',
    hodReviewed: true,
    hodNotes: 'Strong alignment with industry competencies. HOD approves lab curriculum enhancement.',
    dataProvenance: 'demo',
    isDemo: true,
    createdAt: '2026-02-21T11:30:00Z'
  },
  {
    id: 'adj-3',
    facultyId: 'fac-8',
    facultyName: 'Prof. Manoj Pandey',
    subjectId: 'sub-me701',
    subjectName: 'Robotics & Automation (ME701)',
    thematicCategory: 'Lecture Engagement & Communication',
    feedbackPattern: 'Students noted lectures felt overly slide-heavy with insufficient interactive Q&A and doubt resolution.',
    intervention: 'Integrating ROS (Robot Operating System) 3D simulation demonstrations and active pause-and-reflect checkpoints every 15 minutes.',
    term: 'Spring 2026',
    week: 'Week 7',
    status: 'In Progress',
    hodReviewed: true,
    hodNotes: 'Discussed during Department Review. Progress will be monitored via anonymous mid-term pulse.',
    dataProvenance: 'demo',
    isDemo: true,
    createdAt: '2026-03-02T09:15:00Z'
  }
];
