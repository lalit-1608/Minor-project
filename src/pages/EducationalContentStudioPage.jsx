import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';
import {
  getStudySnippets,
  saveStudySnippet,
  archiveStudySnippet,
  deleteDraftStudySnippet,
  canDeleteStudySnippet,
  getDiagnosticQuestions,
  saveDiagnosticQuestion,
  archiveDiagnosticQuestion,
  deleteDraftDiagnosticQuestion,
  canDeleteDiagnosticQuestion,
  getDiagnosticTopics,
  saveDiagnosticTopic,
  archiveDiagnosticTopic,
  deleteDraftDiagnosticTopic,
  canDeleteDiagnosticTopic,
  validateDiagnosticQuestion,
  validateStudySnippet
} from '../services/learningContentService';
import { COURSE_CURRICULA } from '../services/courseCurriculum';
import {
  BookOpen,
  Brain,
  Plus,
  Edit2,
  Archive,
  Trash2,
  Eye,
  X,
  ExternalLink,
  Layers,
  BookMarked,
  AlertTriangle
} from 'lucide-react';

export function EducationalContentStudioPage() {
  const { currentUser, role } = useAuth();
  const { subjects = [] } = useData();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const isFaculty = role === 'faculty';
  const isAdmin = role === 'admin';
  const facultyId = currentUser?.facultyId || currentUser?.id;
  const facultyName = currentUser?.name || 'Mr. Ashok Rathi';

  // Dynamic assigned courses strictly from subjects dataset
  const assignedCourses = useMemo(() => {
    if (isFaculty && facultyId) {
      const assigned = subjects.filter(s => s.facultyIds && s.facultyIds.includes(facultyId));
      if (assigned.length > 0) return assigned;
      // Fallback for demo faculty fac-1
      return subjects.filter(s => ['CS501', 'CS701'].includes(s.code));
    }
    // Admin oversight sees all courses
    return subjects;
  }, [isFaculty, facultyId, subjects]);

  const defaultCourse = assignedCourses[0] || { code: 'CS501', name: 'Database Management Systems', id: 'sub-cs501' };

  // Active Tab: 'topics' | 'snippets' | 'questions'
  const [activeTab, setActiveTab] = useState('topics');

  // Filter by subject
  const [subjectFilter, setSubjectFilter] = useState('ALL');

  // Reload trigger for local storage updates
  const [version, setVersion] = useState(0);

  // Load content
  const topics = useMemo(() => {
    if (version < 0) return [];
    return getDiagnosticTopics();
  }, [version]);

  const snippets = useMemo(() => {
    if (version < 0) return [];
    return getStudySnippets();
  }, [version]);

  const questions = useMemo(() => {
    if (version < 0) return [];
    return getDiagnosticQuestions();
  }, [version]);

  // Filtered lists
  const filteredTopics = useMemo(() => {
    return topics.filter(t => {
      if (subjectFilter !== 'ALL' && t.subjectCode !== subjectFilter) return false;
      return true;
    });
  }, [topics, subjectFilter]);

  const filteredSnippets = useMemo(() => {
    return snippets.filter(s => {
      if (subjectFilter !== 'ALL' && s.subjectCode !== subjectFilter) return false;
      return true;
    });
  }, [snippets, subjectFilter]);

  const filteredQuestions = useMemo(() => {
    return questions.filter(q => {
      if (subjectFilter !== 'ALL' && q.subjectCode !== subjectFilter) return false;
      return true;
    });
  }, [questions, subjectFilter]);

  // Helper to retrieve official curriculum for a given subject code
  const getCurriculumForCode = (code) => {
    if (!code) return null;
    return Object.values(COURSE_CURRICULA).find(c => c.code === code) || null;
  };

  // Syllabus units for the currently selected subject filter or default
  const activeSyllabus = useMemo(() => {
    const targetCode = subjectFilter !== 'ALL' ? subjectFilter : defaultCourse.code;
    return getCurriculumForCode(targetCode);
  }, [subjectFilter, defaultCourse.code]);

  // Modal states for Diagnostic Topic Authoring
  const [topicModalOpen, setTopicModalOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState(null);
  const [topicForm, setTopicForm] = useState({
    subjectCode: defaultCourse.code,
    subjectName: defaultCourse.name,
    subjectId: defaultCourse.id,
    unitNumber: 1,
    officialUnitTitle: '',
    topicTitle: '',
    shortDescription: '',
    learningObjective: '',
    status: 'active'
  });

  // Modal states for Snippet Authoring
  const [snippetModalOpen, setSnippetModalOpen] = useState(false);
  const [editingSnippet, setEditingSnippet] = useState(null);
  const [snippetForm, setSnippetForm] = useState({
    title: '',
    subjectCode: defaultCourse.code,
    subjectName: defaultCourse.name,
    subjectId: defaultCourse.id,
    topicId: '',
    unitNumber: null,
    officialUnitTitle: '',
    topic: '',
    shortContent: '',
    keyPoints: ['', '', ''],
    status: 'published'
  });

  // Modal states for Question Authoring
  const [questionModalOpen, setQuestionModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [questionForm, setQuestionForm] = useState({
    subjectCode: defaultCourse.code,
    subjectName: defaultCourse.name,
    subjectId: defaultCourse.id,
    topicId: '',
    unitNumber: null,
    officialUnitTitle: '',
    topic: '',
    question: '',
    questionText: '',
    options: [
      { text: '', isCorrect: true, isTrap: false, trapType: '', misconceptionTag: '', cognitiveFallacy: '', explanation: '' },
      { text: '', isCorrect: false, isTrap: true, trapType: 'Misconception Trap', misconceptionTag: 'Misconception Trap', cognitiveFallacy: '', explanation: '' },
      { text: '', isCorrect: false, isTrap: true, trapType: 'Cognitive Shortcut', misconceptionTag: 'Cognitive Shortcut', cognitiveFallacy: '', explanation: '' },
      { text: '', isCorrect: false, isTrap: false, trapType: '', misconceptionTag: '', cognitiveFallacy: '', explanation: '' }
    ],
    status: 'published'
  });

  // Preview Question Modal state
  const [previewQuestionModal, setPreviewQuestionModal] = useState(null);

  // Handle open topic editor
  const handleOpenTopicModal = (topic = null) => {
    if (isAdmin) {
      addToast('Academic oversight is read-only. Authoring is reserved for faculty educators.', 'error');
      return;
    }
    if (topic) {
      if (topic.createdByFacultyId !== facultyId) {
        addToast('You may only edit your own authored diagnostic topics.', 'error');
        return;
      }
      setEditingTopic(topic);
      setTopicForm({
        id: topic.id,
        subjectCode: topic.subjectCode || defaultCourse.code,
        subjectName: topic.subjectName || defaultCourse.name,
        subjectId: topic.subjectId || defaultCourse.id,
        unitNumber: topic.unitNumber || 1,
        officialUnitTitle: topic.officialUnitTitle || '',
        topicTitle: topic.topicTitle || '',
        shortDescription: topic.shortDescription || '',
        learningObjective: topic.learningObjective || '',
        status: topic.status || 'active'
      });
    } else {
      const curr = getCurriculumForCode(defaultCourse.code);
      const firstUnit = curr?.units?.[0];
      setEditingTopic(null);
      setTopicForm({
        subjectCode: defaultCourse.code,
        subjectName: defaultCourse.name,
        subjectId: defaultCourse.id,
        unitNumber: firstUnit ? firstUnit.unitNumber : 1,
        officialUnitTitle: firstUnit ? firstUnit.title : '',
        topicTitle: '',
        shortDescription: '',
        learningObjective: '',
        status: 'active'
      });
    }
    setTopicModalOpen(true);
  };

  // Handle save topic
  const handleSaveTopic = (e) => {
    e.preventDefault();
    if (isAdmin) {
      addToast('Academic oversight is read-only.', 'error');
      return;
    }
    if (!topicForm.topicTitle.trim()) {
      addToast('Topic title is required.', 'error');
      return;
    }
    if (!topicForm.learningObjective.trim()) {
      addToast('Learning objective is required.', 'error');
      return;
    }

    const candidate = {
      ...topicForm,
      topicTitle: topicForm.topicTitle.trim(),
      shortDescription: topicForm.shortDescription.trim(),
      learningObjective: topicForm.learningObjective.trim(),
      createdByFacultyId: facultyId,
      createdByFacultyName: facultyName
    };

    try {
      saveDiagnosticTopic(candidate, currentUser);
      addToast(editingTopic ? 'Diagnostic Topic Plan updated.' : 'Diagnostic Topic Plan created successfully.', 'success');
      setTopicModalOpen(false);
      setVersion(v => v + 1);
    } catch (err) {
      addToast(err.message || 'Failed to save diagnostic topic.', 'error');
    }
  };

  // Handle archive topic
  const handleArchiveTopic = (topic) => {
    if (isAdmin) {
      addToast('Academic oversight is read-only.', 'error');
      return;
    }
    if (topic.createdByFacultyId !== facultyId) {
      addToast('You may only archive your own authored topics.', 'error');
      return;
    }
    if (window.confirm('Are you sure you want to archive this Diagnostic Topic Plan? Active learning content will retain historical references.')) {
      try {
        archiveDiagnosticTopic(topic.id, currentUser);
        addToast('Diagnostic Topic archived.', 'info');
        setVersion(v => v + 1);
      } catch (err) {
        addToast(err.message || 'Failed to archive topic.', 'error');
      }
    }
  };

  // Handle delete draft topic
  const handleDeleteDraftTopic = (topic) => {
    if (isAdmin) {
      addToast('Academic oversight is read-only.', 'error');
      return;
    }
    if (topic.createdByFacultyId !== facultyId) {
      addToast('You may only delete your own draft topics.', 'error');
      return;
    }
    if (!canDeleteDiagnosticTopic(topic.id)) {
      addToast('Cannot delete topic: It is referenced by learning content or active attempts. Use Archive instead.', 'error');
      return;
    }
    if (window.confirm('Permanently delete this unreferenced draft topic?')) {
      try {
        deleteDraftDiagnosticTopic(topic.id, currentUser);
        addToast('Draft topic deleted.', 'info');
        setVersion(v => v + 1);
      } catch (err) {
        addToast(err.message || 'Failed to delete draft topic.', 'error');
      }
    }
  };

  // Handle open snippet editor
  const handleOpenSnippetModal = (snippet = null) => {
    if (isAdmin) {
      addToast('Academic oversight is read-only. Authoring is reserved for faculty educators.', 'error');
      return;
    }
    if (snippet) {
      if (snippet.createdByFacultyId !== facultyId) {
        addToast('You may only edit your own authored snippets.', 'error');
        return;
      }
      setEditingSnippet(snippet);
      setSnippetForm({
        id: snippet.id,
        title: snippet.title || '',
        subjectCode: snippet.subjectCode || defaultCourse.code,
        subjectName: snippet.subjectName || defaultCourse.name,
        subjectId: snippet.subjectId || defaultCourse.id,
        topicId: snippet.topicId || '',
        unitNumber: snippet.unitNumber || null,
        officialUnitTitle: snippet.officialUnitTitle || '',
        topic: snippet.topic || '',
        shortContent: snippet.shortContent || '',
        keyPoints: snippet.keyPoints && snippet.keyPoints.length > 0 ? [...snippet.keyPoints] : ['', '', ''],
        status: snippet.status || 'published'
      });
    } else {
      setEditingSnippet(null);
      setSnippetForm({
        title: '',
        subjectCode: defaultCourse.code,
        subjectName: defaultCourse.name,
        subjectId: defaultCourse.id,
        topicId: '',
        unitNumber: null,
        officialUnitTitle: '',
        topic: '',
        shortContent: '',
        keyPoints: ['', '', ''],
        status: 'published'
      });
    }
    setSnippetModalOpen(true);
  };

  // Handle save snippet
  const handleSaveSnippet = (e) => {
    e.preventDefault();
    if (isAdmin) {
      addToast('Academic oversight is read-only.', 'error');
      return;
    }
    const cleanKeyPoints = snippetForm.keyPoints.filter(kp => kp.trim().length > 0);
    const candidate = {
      ...snippetForm,
      keyPoints: cleanKeyPoints,
      createdByFacultyId: facultyId,
      createdByFacultyName: facultyName
    };

    const validation = validateStudySnippet(candidate);
    if (!validation.isValid) {
      addToast(validation.errors[0], 'error');
      return;
    }

    try {
      saveStudySnippet(candidate, currentUser);
      addToast(editingSnippet ? 'Study snippet updated.' : 'Study snippet created successfully.', 'success');
      setSnippetModalOpen(false);
      setVersion(v => v + 1);
    } catch (err) {
      addToast(err.message || 'Failed to save study snippet.', 'error');
    }
  };

  // Handle archive snippet
  const handleArchiveSnippet = (snippet) => {
    if (isAdmin) {
      addToast('Academic oversight is read-only.', 'error');
      return;
    }
    if (snippet.createdByFacultyId !== facultyId) {
      addToast('You may only archive your own authored snippets.', 'error');
      return;
    }
    if (window.confirm('Are you sure you want to archive this study snippet? It will no longer be visible to students in active practice.')) {
      try {
        archiveStudySnippet(snippet.id, currentUser);
        addToast('Snippet archived.', 'info');
        setVersion(v => v + 1);
      } catch (err) {
        addToast(err.message || 'Failed to archive snippet.', 'error');
      }
    }
  };

  // Handle delete draft snippet
  const handleDeleteDraftSnippet = (snippet) => {
    if (isAdmin) {
      addToast('Academic oversight is read-only.', 'error');
      return;
    }
    if (snippet.createdByFacultyId !== facultyId) {
      addToast('You may only delete your own draft snippets.', 'error');
      return;
    }
    if (!canDeleteStudySnippet(snippet.id)) {
      addToast('Cannot delete snippet: It has recorded learner interactions. Use Archive instead.', 'error');
      return;
    }
    if (window.confirm('Permanently delete this draft study snippet?')) {
      try {
        deleteDraftStudySnippet(snippet.id, currentUser);
        addToast('Draft snippet deleted.', 'info');
        setVersion(v => v + 1);
      } catch (err) {
        addToast(err.message || 'Failed to delete draft snippet.', 'error');
      }
    }
  };

  // Handle open question editor
  const handleOpenQuestionModal = (question = null) => {
    if (isAdmin) {
      addToast('Academic oversight is read-only. Authoring is reserved for faculty educators.', 'error');
      return;
    }
    if (question) {
      if (question.createdByFacultyId !== facultyId) {
        addToast('You may only edit your own authored questions.', 'error');
        return;
      }
      setEditingQuestion(question);
      setQuestionForm({
        id: question.id,
        subjectCode: question.subjectCode || defaultCourse.code,
        subjectName: question.subjectName || defaultCourse.name,
        subjectId: question.subjectId || defaultCourse.id,
        topicId: question.topicId || '',
        unitNumber: question.unitNumber || null,
        officialUnitTitle: question.officialUnitTitle || '',
        topic: question.topic || '',
        question: question.question || question.questionText || '',
        questionText: question.question || question.questionText || '',
        options: question.options ? question.options.map(opt => ({
          text: opt.text || '',
          isCorrect: !!opt.isCorrect,
          isTrap: !opt.isCorrect && (opt.isTrap || !!opt.misconceptionTag || !!opt.trapType),
          trapType: opt.trapType || opt.misconceptionTag || '',
          misconceptionTag: opt.misconceptionTag || opt.trapType || '',
          cognitiveFallacy: opt.cognitiveFallacy || '',
          explanation: opt.explanation || ''
        })) : [
          { text: '', isCorrect: true, isTrap: false, trapType: '', misconceptionTag: '', cognitiveFallacy: '', explanation: '' },
          { text: '', isCorrect: false, isTrap: true, trapType: 'Misconception Trap', misconceptionTag: 'Misconception Trap', cognitiveFallacy: '', explanation: '' },
          { text: '', isCorrect: false, isTrap: true, trapType: 'Cognitive Shortcut', misconceptionTag: 'Cognitive Shortcut', cognitiveFallacy: '', explanation: '' },
          { text: '', isCorrect: false, isTrap: false, trapType: '', misconceptionTag: '', cognitiveFallacy: '', explanation: '' }
        ],
        status: question.status || 'published'
      });
    } else {
      setEditingQuestion(null);
      setQuestionForm({
        subjectCode: defaultCourse.code,
        subjectName: defaultCourse.name,
        subjectId: defaultCourse.id,
        topicId: '',
        unitNumber: null,
        officialUnitTitle: '',
        topic: '',
        question: '',
        questionText: '',
        options: [
          { text: '', isCorrect: true, isTrap: false, trapType: '', misconceptionTag: '', cognitiveFallacy: '', explanation: '' },
          { text: '', isCorrect: false, isTrap: true, trapType: 'Misconception Trap', misconceptionTag: 'Misconception Trap', cognitiveFallacy: '', explanation: '' },
          { text: '', isCorrect: false, isTrap: true, trapType: 'Cognitive Shortcut', misconceptionTag: 'Cognitive Shortcut', cognitiveFallacy: '', explanation: '' },
          { text: '', isCorrect: false, isTrap: false, trapType: '', misconceptionTag: '', cognitiveFallacy: '', explanation: '' }
        ],
        status: 'published'
      });
    }
    setQuestionModalOpen(true);
  };

  // Handle save question
  const handleSaveQuestion = (e) => {
    e.preventDefault();
    if (isAdmin) {
      addToast('Academic oversight is read-only.', 'error');
      return;
    }
    const qText = (questionForm.question || questionForm.questionText || '').trim();
    const candidate = {
      ...questionForm,
      question: qText,
      questionText: qText,
      createdByFacultyId: facultyId,
      createdByFacultyName: facultyName,
      options: questionForm.options.map(opt => {
        const isTrap = !opt.isCorrect && (!!opt.misconceptionTag || !!opt.trapType);
        return {
          text: opt.text.trim(),
          isCorrect: !!opt.isCorrect,
          isTrap,
          trapType: isTrap ? (opt.trapType || opt.misconceptionTag || 'Misconception Trap') : null,
          misconceptionTag: isTrap ? (opt.misconceptionTag || opt.trapType || 'Misconception Trap') : null,
          cognitiveFallacy: isTrap ? (opt.cognitiveFallacy || 'Conceptual Bias') : null,
          explanation: opt.explanation?.trim() || (opt.isCorrect ? 'Correct choice.' : 'Incorrect option.')
        };
      })
    };

    const validation = validateDiagnosticQuestion(candidate);
    if (!validation.isValid) {
      addToast(validation.errors[0], 'error');
      return;
    }

    try {
      saveDiagnosticQuestion(candidate, currentUser);
      addToast(editingQuestion ? 'Diagnostic question updated.' : 'Diagnostic question created.', 'success');
      setQuestionModalOpen(false);
      setVersion(v => v + 1);
    } catch (err) {
      addToast(err.message || 'Failed to save diagnostic question.', 'error');
    }
  };

  // Handle archive question
  const handleArchiveQuestion = (question) => {
    if (isAdmin) {
      addToast('Academic oversight is read-only.', 'error');
      return;
    }
    if (question.createdByFacultyId !== facultyId) {
      addToast('You may only archive your own authored questions.', 'error');
      return;
    }
    if (window.confirm('Are you sure you want to archive this diagnostic question? It will no longer be included in published student assessments.')) {
      try {
        archiveDiagnosticQuestion(question.id, currentUser);
        addToast('Diagnostic question archived.', 'info');
        setVersion(v => v + 1);
      } catch (err) {
        addToast(err.message || 'Failed to archive diagnostic question.', 'error');
      }
    }
  };

  // Handle delete draft question
  const handleDeleteDraftQuestion = (question) => {
    if (isAdmin) {
      addToast('Academic oversight is read-only.', 'error');
      return;
    }
    if (question.createdByFacultyId !== facultyId) {
      addToast('You may only delete your own draft questions.', 'error');
      return;
    }
    if (!canDeleteDiagnosticQuestion(question.id)) {
      addToast('Cannot delete question: It is referenced by student test attempts. Use Archive instead.', 'error');
      return;
    }
    if (window.confirm('Permanently delete this unreferenced draft question?')) {
      try {
        deleteDraftDiagnosticQuestion(question.id, currentUser);
        addToast('Draft question deleted.', 'info');
        setVersion(v => v + 1);
      } catch (err) {
        addToast(err.message || 'Failed to delete draft question.', 'error');
      }
    }
  };

  // Subject dropdown handler for generic forms
  const handleSubjectSelect = (code, formSetter) => {
    const found = assignedCourses.find(c => c.code === code);
    if (found) {
      const curr = getCurriculumForCode(found.code);
      const firstUnit = curr?.units?.[0];
      formSetter(prev => ({
        ...prev,
        subjectCode: found.code,
        subjectName: found.name,
        subjectId: found.id,
        unitNumber: firstUnit ? firstUnit.unitNumber : 1,
        officialUnitTitle: firstUnit ? firstUnit.title : ''
      }));
    }
  };

  // When a topic is picked in Snippet or Question modals
  const handleTopicSelectInContentForm = (topicId, formSetter) => {
    if (!topicId) {
      formSetter(prev => ({
        ...prev,
        topicId: '',
        unitNumber: null,
        officialUnitTitle: ''
      }));
      return;
    }
    const selected = topics.find(t => t.id === topicId);
    if (selected) {
      formSetter(prev => ({
        ...prev,
        topicId: selected.id,
        topic: selected.topicTitle,
        unitNumber: selected.unitNumber,
        officialUnitTitle: selected.officialUnitTitle
      }));
    }
  };

  // Empty state if faculty educator has zero assigned courses
  if (isFaculty && assignedCourses.length === 0) {
    return (
      <div className="p-8 max-w-2xl mx-auto my-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-4 shadow-sm">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-black text-slate-900 dark:text-white">
          No Courses Assigned to Profile
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Your faculty account ({facultyName}) does not have active course teaching assignments in the current semester records. Educational content authoring requires at least one assigned academic course.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-bold mb-1.5">
            <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
            <span>Educational Content Studio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Diagnostic Content & Misconception Authoring
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Organize Diagnostic Topic Plans within official syllabus units, create concise Study Snippets, and author diagnostic questions with structured distractor taxonomies.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isAdmin ? (
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-bold">
              <span>Academic Oversight Mode (Read-Only)</span>
            </div>
          ) : activeTab === 'topics' ? (
            <button
              onClick={() => handleOpenTopicModal()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Diagnostic Topic</span>
            </button>
          ) : activeTab === 'snippets' ? (
            <button
              onClick={() => handleOpenSnippetModal()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Study Snippet</span>
            </button>
          ) : (
            <button
              onClick={() => handleOpenQuestionModal()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Diagnostic Question</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs and Course Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setActiveTab('topics')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'topics'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Diagnostic Topic Plan ({topics.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('snippets')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'snippets'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Study Snippets ({snippets.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('questions')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'questions'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Brain className="w-4 h-4" />
            <span>Diagnostic Questions ({questions.length})</span>
          </button>
        </div>

        {/* Course Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400">Course Filter:</span>
          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="text-xs font-bold px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">All Assigned Courses</option>
            {assignedCourses.map(c => (
              <option key={c.code || c.id} value={c.code}>
                {c.code} ({c.name})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tab 0: Diagnostic Topic Plan View */}
      {activeTab === 'topics' && (
        <div className="space-y-6">
          {/* Official University Syllabus Reference Card */}
          <div className="p-5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/40 space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <BookMarked className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-xs font-black uppercase tracking-wider text-blue-900 dark:text-blue-200">
                    Official University Syllabus (Read-Only Reference)
                  </span>
                </div>
                <p className="text-xs text-blue-800/90 dark:text-blue-300/80 leading-relaxed max-w-3xl">
                  University curriculum units are fixed academic references. Educators define focused <strong>Diagnostic Topic Plans</strong> within these units to target and remediate persistent student misconceptions without administrative curriculum alterations.
                </p>
              </div>
              {activeSyllabus && (
                <div className="shrink-0 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-800 text-right">
                  <span className="text-[10px] font-black text-blue-600 block">{activeSyllabus.code}</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{activeSyllabus.credits}</span>
                </div>
              )}
            </div>

            {activeSyllabus && activeSyllabus.units && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-2 border-t border-blue-200/50 dark:border-blue-900/40">
                {activeSyllabus.units.map(u => (
                  <div key={u.unitNumber} className="p-3 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-blue-100 dark:border-blue-900/60 text-xs space-y-1">
                    <span className="text-[10px] font-black text-blue-700 dark:text-blue-300 block">
                      Unit {u.unitNumber} • {u.duration}
                    </span>
                    <p className="font-bold text-slate-900 dark:text-white line-clamp-1">{u.title}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">{u.summary}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Diagnostic Topics List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-blue-600" />
                  <span>Educator Diagnostic Topic Plans</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Targeted misconception focus areas linking study snippets, questions, and calibration analytics
                </p>
              </div>
              <span className="text-xs font-bold text-slate-400">
                {filteredTopics.length} Configured Topics
              </span>
            </div>

            {filteredTopics.length === 0 ? (
              <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400 text-sm">
                No diagnostic topic plans found for this course filter. Click "New Diagnostic Topic" to create one.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredTopics.map((topic) => {
                  const linkedSnippetsCount = snippets.filter(s => s.topicId === topic.id).length;
                  const linkedQuestionsCount = questions.filter(q => q.topicId === topic.id).length;
                  const isOwner = isFaculty && topic.createdByFacultyId === facultyId;
                  const canDelete = isOwner && topic.status === 'draft' && canDeleteDiagnosticTopic(topic.id);

                  return (
                    <div
                      key={topic.id}
                      className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-3.5 flex flex-col justify-between"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                              {topic.subjectCode}
                            </span>
                            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                              Unit {topic.unitNumber || 1}
                            </span>
                          </div>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              topic.status === 'active'
                                ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                                : topic.status === 'draft'
                                ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                            }`}
                          >
                            {topic.status}
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                          {topic.topicTitle}
                        </h3>

                        {topic.officialUnitTitle && (
                          <p className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold line-clamp-1">
                            Aligned Syllabus: {topic.officialUnitTitle}
                          </p>
                        )}

                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                          {topic.shortDescription}
                        </p>

                        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs space-y-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                            Learning Objective:
                          </span>
                          <p className="text-slate-700 dark:text-slate-300 text-xs">
                            {topic.learningObjective}
                          </p>
                        </div>

                        {/* Linked Content Counters */}
                        <div className="flex items-center gap-3 pt-1 text-xs text-slate-500">
                          <span className="inline-flex items-center gap-1 font-semibold">
                            <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                            {linkedSnippetsCount} Snippets
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="inline-flex items-center gap-1 font-semibold">
                            <Brain className="w-3.5 h-3.5 text-purple-500" />
                            {linkedQuestionsCount} Questions
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                        <span className="text-[11px] text-slate-400">
                          Author: {topic.createdByFacultyName || 'Faculty Author'}
                        </span>

                        {isOwner ? (
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleOpenTopicModal(topic)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                              title="Edit Topic"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            {topic.status === 'active' && (
                              <button
                                onClick={() => handleArchiveTopic(topic)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                title="Archive Topic"
                              >
                                <Archive className="w-4 h-4" />
                              </button>
                            )}
                            {canDelete && (
                              <button
                                onClick={() => handleDeleteDraftTopic(topic)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                title="Delete Draft Topic"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        ) : (
                          <span className="text-[10px] font-semibold text-slate-400 italic">Read-only</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 1: Study Snippets View */}
      {activeTab === 'snippets' && (
        <div className="space-y-4">
          {filteredSnippets.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400 text-sm">
              No study snippets match the selected course filter. Click "New Study Snippet" to author one.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredSnippets.map((snp) => {
                const isOwner = isFaculty && snp.createdByFacultyId === facultyId;
                const canDelete = isOwner && snp.status === 'draft' && canDeleteStudySnippet(snp.id);

                return (
                  <div
                    key={snp.id}
                    className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2 py-0.5 rounded text-[10px] font-black bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                            {snp.subjectCode}
                          </span>
                          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                            {snp.topic}
                          </span>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            snp.status === 'published'
                              ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                              : snp.status === 'draft'
                              ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          {snp.status}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                        {snp.title}
                      </h3>

                      {snp.officialUnitTitle && (
                        <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold line-clamp-1">
                          Aligned Syllabus: {snp.officialUnitTitle}
                        </p>
                      )}

                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                        {snp.shortContent}
                      </p>

                      {snp.keyPoints && snp.keyPoints.length > 0 && (
                        <div className="space-y-1 pt-1 border-t border-slate-100 dark:border-slate-800">
                          <span className="text-[11px] font-bold text-slate-400 block">Key Diagnostic Points:</span>
                          <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-0.5 pl-3 list-disc">
                            {snp.keyPoints.slice(0, 2).map((kp, idx) => (
                              <li key={idx} className="line-clamp-1">{kp}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                      <span className="text-[11px] text-slate-400">
                        Author: {snp.createdByFacultyName || 'Faculty Author'}
                      </span>
                      {isOwner ? (
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenSnippetModal(snp)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                            title="Edit Snippet"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          {snp.status === 'published' && (
                            <button
                              onClick={() => handleArchiveSnippet(snp)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                              title="Archive Snippet"
                            >
                              <Archive className="w-4 h-4" />
                            </button>
                          )}
                          {canDelete && (
                            <button
                              onClick={() => handleDeleteDraftSnippet(snp)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                              title="Delete Draft Snippet"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ) : (
                        <span className="text-[10px] font-semibold text-slate-400 italic">Read-only</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Diagnostic Questions View */}
      {activeTab === 'questions' && (
        <div className="space-y-4">
          {filteredQuestions.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400 text-sm">
              No diagnostic questions match the selected course filter. Click "New Diagnostic Question" to author one.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredQuestions.map((q) => {
                const isOwner = isFaculty && q.createdByFacultyId === facultyId;
                const canDelete = isOwner && q.status === 'draft' && canDeleteDiagnosticQuestion(q.id);

                return (
                  <div
                    key={q.id}
                    className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2 py-0.5 rounded text-[10px] font-black bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                            {q.subjectCode}
                          </span>
                          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                            {q.topic}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
                            ID: {q.id}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              q.status === 'published'
                                ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                                : q.status === 'draft'
                                ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                            }`}
                          >
                            {q.status}
                          </span>
                        </div>
                        <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white pt-1">
                          {q.question || q.questionText}
                        </h3>
                        {q.officialUnitTitle && (
                          <p className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold">
                            Aligned Syllabus: {q.officialUnitTitle}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => setPreviewQuestionModal(q)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer"
                          title="Interactive Preview"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Preview</span>
                        </button>

                        <button
                          onClick={() => {
                            navigate('/quiz', {
                              state: {
                                previewQuestion: q,
                                previewQuestionId: q.id,
                                isPreview: true
                              }
                            });
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950 hover:bg-purple-100 dark:hover:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-xs font-bold transition-all cursor-pointer"
                          title="Preview in full Diagnostic Quiz Runner"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Test in Quiz</span>
                        </button>

                        {isOwner && (
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleOpenQuestionModal(q)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-purple-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                              title="Edit Question"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>

                            {q.status === 'published' && (
                              <button
                                onClick={() => handleArchiveQuestion(q)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                title="Archive Question"
                              >
                                <Archive className="w-4 h-4" />
                              </button>
                            )}

                            {canDelete && (
                              <button
                                onClick={() => handleDeleteDraftQuestion(q)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                title="Delete Draft Question"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 4 Distractor Options Taxonomy */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                      {q.options && q.options.map((opt, oIdx) => (
                        <div
                          key={oIdx}
                          className={`p-3 rounded-xl border ${
                            opt.isCorrect
                              ? 'bg-emerald-50/60 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                              : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-bold">
                              {String.fromCharCode(65 + oIdx)}. {opt.text}
                            </span>
                            {opt.isCorrect ? (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 shrink-0">
                                CORRECT
                              </span>
                            ) : (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 shrink-0">
                                MISCONCEPTION
                              </span>
                            )}
                          </div>
                          {opt.explanation && (
                            <p className="text-[11px] opacity-80 mt-1 italic">
                              {opt.explanation}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Diagnostic Topic Authoring Modal */}
      {topicModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-xl w-full p-6 shadow-2xl my-8 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {editingTopic ? 'Edit Diagnostic Topic Plan' : 'Create Diagnostic Topic Plan'}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Organize learning snippets and trap questions within official syllabus units
                </p>
              </div>
              <button
                onClick={() => setTopicModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTopic} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Course / Subject *
                  </label>
                  <select
                    value={topicForm.subjectCode}
                    onChange={(e) => handleSubjectSelect(e.target.value, setTopicForm)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                  >
                    {assignedCourses.map(c => (
                      <option key={c.code || c.id} value={c.code}>
                        {c.code} - {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Official Syllabus Unit *
                  </label>
                  <select
                    value={topicForm.unitNumber}
                    onChange={(e) => {
                      const uNum = parseInt(e.target.value, 10);
                      const curr = getCurriculumForCode(topicForm.subjectCode);
                      const matchedUnit = curr?.units?.find(u => u.unitNumber === uNum);
                      setTopicForm({
                        ...topicForm,
                        unitNumber: uNum,
                        officialUnitTitle: matchedUnit ? matchedUnit.title : `Unit ${uNum}`
                      });
                    }}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                  >
                    {(() => {
                      const curr = getCurriculumForCode(topicForm.subjectCode);
                      if (curr && curr.units) {
                        return curr.units.map(u => (
                          <option key={u.unitNumber} value={u.unitNumber}>
                            {u.title}
                          </option>
                        ));
                      }
                      return [1, 2, 3, 4, 5].map(n => (
                        <option key={n} value={n}>Unit {n}</option>
                      ));
                    })()}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Diagnostic Topic Title *
                </label>
                <input
                  type="text"
                  value={topicForm.topicTitle}
                  onChange={(e) => setTopicForm({ ...topicForm, topicTitle: e.target.value })}
                  placeholder="e.g. Three-Valued Logic & NULL Predicates"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Learning Objective *
                </label>
                <input
                  type="text"
                  value={topicForm.learningObjective}
                  onChange={(e) => setTopicForm({ ...topicForm, learningObjective: e.target.value })}
                  placeholder="e.g. Distinguish UNKNOWN from FALSE in SQL relational calculus and WHERE evaluations."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Diagnostic Misconception Scope / Description
                </label>
                <textarea
                  rows={2}
                  value={topicForm.shortDescription}
                  onChange={(e) => setTopicForm({ ...topicForm, shortDescription: e.target.value })}
                  placeholder="Briefly describe the specific cognitive trap or misconception targeted..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Status:</label>
                  <select
                    value={topicForm.status}
                    onChange={(e) => setTopicForm({ ...topicForm, status: e.target.value })}
                    className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                  >
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setTopicModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md"
                  >
                    Save Topic
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Snippet Authoring Modal */}
      {snippetModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-2xl w-full p-6 shadow-2xl my-8 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {editingSnippet ? 'Edit Study Snippet' : 'Create Study Snippet'}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Author bite-sized, high-density diagnostic study notes
                </p>
              </div>
              <button
                onClick={() => setSnippetModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSnippet} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Course / Subject *
                  </label>
                  <select
                    value={snippetForm.subjectCode}
                    onChange={(e) => handleSubjectSelect(e.target.value, setSnippetForm)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                  >
                    {assignedCourses.map(c => (
                      <option key={c.code || c.id} value={c.code}>
                        {c.code} - {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Link to Diagnostic Topic Plan
                  </label>
                  <select
                    value={snippetForm.topicId || ''}
                    onChange={(e) => handleTopicSelectInContentForm(e.target.value, setSnippetForm)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                  >
                    <option value="">-- Custom Topic (No Topic Plan Link) --</option>
                    {topics
                      .filter(t => t.subjectCode === snippetForm.subjectCode && t.status !== 'archived')
                      .map(t => (
                        <option key={t.id} value={t.id}>
                          [Unit {t.unitNumber}] {t.topicTitle}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Topic / Concept Name *
                </label>
                <input
                  type="text"
                  value={snippetForm.topic}
                  onChange={(e) => setSnippetForm({ ...snippetForm, topic: e.target.value })}
                  placeholder="e.g. Three-Valued Logic NULL Comparisons"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Snippet Title *
                </label>
                <input
                  type="text"
                  value={snippetForm.title}
                  onChange={(e) => setSnippetForm({ ...snippetForm, title: e.target.value })}
                  placeholder="e.g. SQL Three-Valued Logic: Why NULL is Not Boolean False"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Core Diagnostic Concept Explanation *
                </label>
                <textarea
                  rows={3}
                  value={snippetForm.shortContent}
                  onChange={(e) => setSnippetForm({ ...snippetForm, shortContent: e.target.value })}
                  placeholder="Concise explanation directly addressing the underlying misconception..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Key Diagnostic Points (Bullet points for quick recall)
                </label>
                {snippetForm.keyPoints.map((kp, idx) => (
                  <div key={idx} className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-slate-400 w-4">{idx + 1}.</span>
                    <input
                      type="text"
                      value={kp}
                      onChange={(e) => {
                        const next = [...snippetForm.keyPoints];
                        next[idx] = e.target.value;
                        setSnippetForm({ ...snippetForm, keyPoints: next });
                      }}
                      placeholder={`Key point #${idx + 1}`}
                      className="flex-1 p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs"
                    />
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Status:</label>
                  <select
                    value={snippetForm.status}
                    onChange={(e) => setSnippetForm({ ...snippetForm, status: e.target.value })}
                    className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSnippetModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md"
                  >
                    Save Snippet
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Diagnostic Question Authoring Modal */}
      {questionModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-3xl w-full p-6 shadow-2xl my-8 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {editingQuestion ? 'Edit Diagnostic Question' : 'Create Diagnostic Question'}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Formulate 4 options with 1 verified correct answer and 3 intentional cognitive distractors
                </p>
              </div>
              <button
                onClick={() => setQuestionModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuestion} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Course / Subject *
                  </label>
                  <select
                    value={questionForm.subjectCode}
                    onChange={(e) => handleSubjectSelect(e.target.value, setQuestionForm)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                  >
                    {assignedCourses.map(c => (
                      <option key={c.code || c.id} value={c.code}>
                        {c.code} - {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Link to Diagnostic Topic Plan
                  </label>
                  <select
                    value={questionForm.topicId || ''}
                    onChange={(e) => handleTopicSelectInContentForm(e.target.value, setQuestionForm)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                  >
                    <option value="">-- Custom Topic (No Topic Plan Link) --</option>
                    {topics
                      .filter(t => t.subjectCode === questionForm.subjectCode && t.status !== 'archived')
                      .map(t => (
                        <option key={t.id} value={t.id}>
                          [Unit {t.unitNumber}] {t.topicTitle}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Target Concept / Topic Name *
                </label>
                <input
                  type="text"
                  value={questionForm.topic}
                  onChange={(e) => setQuestionForm({ ...questionForm, topic: e.target.value })}
                  placeholder="e.g. Three-Valued Logic in Relational Predicates"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Question Prompt (Diagnostic Item Text) *
                </label>
                <textarea
                  rows={3}
                  value={questionForm.questionText}
                  onChange={(e) => setQuestionForm({ ...questionForm, questionText: e.target.value })}
                  placeholder="State the technical scenario clearly with minimal confounding noise..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  required
                />
              </div>

              {/* 4 Distractor Options */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    4 Options (Select exactly ONE correct answer; document distractors):
                  </label>
                  <span className="text-[11px] text-slate-400">Distractor taxonomy required</span>
                </div>

                {questionForm.options.map((opt, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-2xl border ${
                      opt.isCorrect
                        ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/20'
                    } space-y-2`}
                  >
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold">
                        <input
                          type="radio"
                          name="correctOptionRadio"
                          checked={opt.isCorrect}
                          onChange={() => {
                            const next = questionForm.options.map((o, i) => ({
                              ...o,
                              isCorrect: i === idx
                            }));
                            setQuestionForm({ ...questionForm, options: next });
                          }}
                          className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className={opt.isCorrect ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-600 dark:text-slate-400'}>
                          Option {String.fromCharCode(65 + idx)} {opt.isCorrect && '(Correct Answer)'}
                        </span>
                      </label>
                    </div>

                    <input
                      type="text"
                      value={opt.text}
                      onChange={(e) => {
                        const next = [...questionForm.options];
                        next[idx].text = e.target.value;
                        setQuestionForm({ ...questionForm, options: next });
                      }}
                      placeholder={`Option ${String.fromCharCode(65 + idx)} text`}
                      className="w-full p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                      required
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <input
                        type="text"
                        value={opt.misconceptionTag || ''}
                        onChange={(e) => {
                          const next = [...questionForm.options];
                          next[idx].misconceptionTag = e.target.value;
                          setQuestionForm({ ...questionForm, options: next });
                        }}
                        placeholder="Misconception Tag (e.g. null_equals_false_trap)"
                        className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px]"
                      />

                      <input
                        type="text"
                        value={opt.explanation || ''}
                        onChange={(e) => {
                          const next = [...questionForm.options];
                          next[idx].explanation = e.target.value;
                          setQuestionForm({ ...questionForm, options: next });
                        }}
                        placeholder="Distractor Explanation / Why this is a cognitive trap"
                        className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px]"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Status:</label>
                  <select
                    value={questionForm.status}
                    onChange={(e) => setQuestionForm({ ...questionForm, status: e.target.value })}
                    className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setQuestionModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md"
                  >
                    Save Question
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Interactive Question Preview Modal */}
      {previewQuestionModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                  {previewQuestionModal.subjectCode}
                </span>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  Teacher Preview Mode
                </span>
              </div>
              <button
                onClick={() => setPreviewQuestionModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                {previewQuestionModal.question || previewQuestionModal.questionText}
              </h3>

              <div className="space-y-2">
                {previewQuestionModal.options.map((opt, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-xl border text-xs ${
                      opt.isCorrect
                        ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">
                        {String.fromCharCode(65 + i)}. {opt.text}
                      </span>
                      {opt.isCorrect && (
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                          ✓ Correct
                        </span>
                      )}
                    </div>
                    {opt.explanation && (
                      <p className="text-[11px] opacity-75 mt-1">
                        Reason: {opt.explanation}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
              <span className="text-slate-400 text-[11px]">
                Preview mode does not save test attempts.
              </span>
              <button
                onClick={() => setPreviewQuestionModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EducationalContentStudioPage;
