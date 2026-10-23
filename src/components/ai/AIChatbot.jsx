import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { calculateStudentLearningAnalytics } from '../../services/quizData';
import { getStudySnippets, getDiagnosticTopics } from '../../services/learningContentService';
import { MessageCircle, X, Send, Bot, User, Loader2, Sparkles, ChevronDown } from 'lucide-react';

// Gemini API key (to be set via environment variable or config)
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

function buildSystemContext(currentUser, analytics, topics, snippets) {
  const studentName = currentUser?.name || 'Student';
  const role = currentUser?.role || 'guest';

  if (role !== 'student') {
    return `You are StudyBot, an AI academic assistant for the StudySnippet educational research platform. 
You help educators and administrators understand the platform's features.
Be concise, friendly, and helpful.`;
  }

  const accuracy = analytics?.overallAccuracy ?? 'N/A';
  const totalAttempts = analytics?.totalAttempts ?? 0;
  const highConfErrors = analytics?.highConfidenceErrorsCount ?? 0;
  const errorCorrectionRate = analytics?.immediateErrorCorrectionRate ?? 'N/A';
  const weakTopics = analytics?.weakTopics?.map(t => `${t.topic} (${t.accuracy}% accuracy)`).join(', ') || 'None identified yet';
  const flaggedMisconceptions = analytics?.flaggedMisconceptions?.map(m => m.tag).join(', ') || 'None yet';
  const activeTopicList = topics?.map(t => `${t.subjectCode}: ${t.topicTitle} (Unit ${t.unitNumber})`).join('; ') || 'None';
  const snippetList = snippets?.slice(0, 5).map(s => s.title).join('; ') || 'None';

  return `You are StudyBot, an intelligent AI learning assistant for the StudySnippet platform. You are talking with ${studentName}, a student in the Computer Science department (Semester 5, Class CSE-A).

## Student's Current Learning Data:
- **Overall Accuracy**: ${accuracy}%
- **Total Quiz Attempts**: ${totalAttempts}
- **High-Confidence Errors (Misconceptions caught)**: ${highConfErrors}
- **Error Correction Rate on Retake**: ${errorCorrectionRate}${typeof errorCorrectionRate === 'number' ? '%' : ''}
- **Weak Topics** (below 75% accuracy): ${weakTopics}
- **Flagged Misconceptions**: ${flaggedMisconceptions}

## Active Syllabus Topics Being Studied:
${activeTopicList}

## Available Study Materials:
${snippetList}

## Your Role:
1. Help ${studentName} understand their progress in the syllabus
2. Explain weak topics and misconceptions in simple terms
3. Suggest which topics to study next based on their performance
4. Answer questions about their quiz results and what they mean
5. Motivate and guide them with their learning journey
6. Answer questions about Database Management Systems (SQL, Relational Algebra, NULL handling), Machine Learning (Bayesian probability, classification), and Data Structures & Algorithms (time complexity, two-pointer technique)

## Guidelines:
- Be friendly, encouraging, and concise
- Use simple language for complex topics
- If asked about progress, refer to their actual data above
- Suggest the "Diagnostic Quiz" for practice and "Study Snippets" for reading
- Keep responses under 200 words unless a detailed explanation is needed
- Use emojis sparingly to make responses feel friendly`;
}

function generateLocalAssistantReply(query, currentUser, analytics, topics, snippets) {
  const q = (query || '').toLowerCase();
  const name = currentUser?.name?.split(' ')[0] || 'there';
  const role = currentUser?.role || 'guest';

  if (role !== 'student') {
    return `Hello! As ${role === 'admin' ? 'an Academic Oversight administrator' : 'an Educator'}, you can review institutional analytics on the Dashboard, author diagnostic items in the Content Studio, and track feedback-to-action loops in Pedagogical Adjustments.`;
  }

  const accuracy = analytics?.overallAccuracy;
  const attempts = analytics?.totalAttempts || 0;
  const highConfErrors = analytics?.highConfidenceErrorsCount || 0;
  const weakTopics = analytics?.weakTopics || [];
  const retakeRate = analytics?.immediateErrorCorrectionRate;

  if (q.includes('how am i doing') || q.includes('progress') || q.includes('score') || q.includes('performance')) {
    if (attempts === 0) {
      return `Hi ${name}! You haven't taken any diagnostic quizzes yet. Head over to the **Diagnostic Quiz** section to test your understanding and uncover any hidden misconceptions.`;
    }
    return `Here is your current diagnostic summary, ${name}:\n\n• **Overall Accuracy**: ${accuracy != null ? accuracy + '%' : 'Pending'}\n• **Completed Quizzes**: ${attempts}\n• **High-Confidence Traps Caught**: ${highConfErrors}\n• **Retake Correction Rate**: ${retakeRate != null ? retakeRate + '%' : 'N/A'}\n\n${accuracy >= 75 ? 'You are performing strongly across core topics!' : 'You have a few high-confidence misconceptions that need remediation. Check your weak topics below.'}`;
  }

  if (q.includes('what topics') || q.includes('study next') || q.includes('recommend') || q.includes('suggest')) {
    if (weakTopics.length > 0) {
      const list = weakTopics.map(w => `• **${w.topic}** (${w.accuracy}% accuracy)`).join('\n');
      return `Based on your recent diagnostic attempts, here are the top topics to focus on next:\n\n${list}\n\nI recommend reading the matching articles in the **Study Snippets Library** before attempting a quiz retake!`;
    }
    const sampleSnippets = (snippets || []).slice(0, 3).map(s => `• **${s.title}** (${s.subjectCode})`).join('\n');
    return `You're currently well-calibrated! To expand your mastery, check out these recommended Study Snippets:\n\n${sampleSnippets || 'Browse the Study Snippets Library for curated concept explanations.'}`;
  }

  if (q.includes('weak') || q.includes('misconception') || q.includes('trap') || q.includes('mistake') || q.includes('wrong')) {
    if (highConfErrors > 0) {
      return `You have **${highConfErrors} high-confidence misconception(s)** flagged in your diagnostic profile. In cognitive science, this happens when you feel 100% sure but selected an engineered distractor trap.\n\nTake advantage of the **Immediate Retake** feature right after completing a quiz to correct flawed mental models while the feedback is fresh!`;
    }
    return `Great news, ${name}: no severe cognitive traps are currently flagged on your account! Remember to always consider boundary conditions, such as NULL handling in SQL or integer overflows in binary search.`;
  }

  if (q.includes('improve') || q.includes('better') || q.includes('tips')) {
    return `Here are 3 research-backed tips to improve your learning:\n\n1. **Use Immediate Retakes**: Retesting right after feedback increases retention significantly via the testing effect.\n2. **Calibrate Your Confidence**: When uncertain, mark 50% or 75% to detect the "illusion of competence".\n3. **Read Study Snippets**: Review the bite-sized concept guides before taking a quiz.`;
  }

  if (q.includes('dbms') || q.includes('sql') || q.includes('database')) {
    return `In Database Management Systems (CS501), pay special attention to:\n\n• **Three-Valued Logic (3VL)**: In SQL, \`NULL = NULL\` yields UNKNOWN, not TRUE.\n• **Relational Algebra**: Understanding Cartesian product vs Natural Join.\n• **Transactions & ACID**: Isolation levels and phantom reads.\n\nCheck the **Study Snippets** for deep dives on these topics!`;
  }

  if (q.includes('machine learning') || q.includes('ml') || q.includes('bayes')) {
    return `In Machine Learning (CS701), watch out for:\n\n• **Base Rate Neglect**: Ignoring prior probability P(Disease) in Bayes' Theorem leads to false intuition.\n• **Data Leakage**: Fitting standard scalers or imputers before train/test split.\n• **Precision vs Recall**: Choosing the right threshold under severe class imbalance.`;
  }

  return `I am StudyBot, your learning guide for StudySnippet! I can help you with:\n\n• Analyzing your quiz performance & misconceptions\n• Guiding you through CS501 (DBMS), CS701 (ML), and CS301 (DSA)\n• Recommending targeted Study Snippets\n\nTry asking: *"How am I doing in my syllabus?"* or *"What topics should I study next?"*`;
}

async function callGeminiAPI(messages, systemContext) {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY not configured.');
  }

  const validMessages = messages.filter(m => !m.isError && m.content);
  if (validMessages.length === 0) {
    throw new Error('No valid conversation messages.');
  }

  const contents = validMessages.map(msg => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }]
  }));

  // Ensure first turn is from user
  while (contents.length > 0 && contents[0].role !== 'user') {
    contents.shift();
  }

  if (contents.length === 0) {
    throw new Error('No user turn found.');
  }

  const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: {
        parts: [{ text: systemContext }]
      },
      contents,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 500,
      }
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.error?.message || `API error: ${response.status}`);
  }

  const data = await response.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate a response.';
}

const QUICK_PROMPTS = [
  'How am I doing in my syllabus?',
  'What topics should I study next?',
  'Explain my weak areas',
  'How can I improve my score?'
];

export function AIChatbot() {
  const { currentUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [, setError] = useState(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);

  const studentId = currentUser?.id || currentUser?.studentId || 'stu-1';

  const analytics = useMemo(() => {
    if (currentUser?.role === 'student') {
      return calculateStudentLearningAnalytics(studentId);
    }
    return null;
  }, [studentId, currentUser?.role]);

  const topics = useMemo(() => getDiagnosticTopics({ status: 'active' }), []);
  const snippets = useMemo(() => getStudySnippets({ status: 'published' }), []);

  const systemContext = useMemo(
    () => buildSystemContext(currentUser, analytics, topics, snippets),
    [currentUser, analytics, topics, snippets]
  );

  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
  };

  useEffect(() => {
    if (isOpen && messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greeting = currentUser?.role === 'student'
        ? `Hi ${currentUser?.name?.split(' ')[0] || 'there'}! 👋 I'm StudyBot, your AI learning assistant.\n\nI can see your learning data and help you with:\n• Your syllabus progress & weak areas\n• Understanding quiz results\n• Topic explanations\n• Study recommendations\n\nWhat would you like to know?`
        : `Hi! 👋 I'm StudyBot, your AI assistant for the StudySnippet platform.\n\nI can help you understand platform features, analytics, and research insights.\n\nWhat would you like to know?`;

      setMessages([{ role: 'assistant', content: greeting, id: Date.now() }]);

      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, currentUser]);

  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
    setShowScrollBtn(!isNearBottom);
  };

  const sendMessage = async (text) => {
    const messageText = (text || input).trim();
    if (!messageText || isLoading) return;

    setInput('');
    setError(null);

    const userMessage = { role: 'user', content: messageText, id: Date.now() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      let reply;
      const hasRealKey = Boolean(GEMINI_API_KEY && !GEMINI_API_KEY.startsWith('AQ.'));

      if (hasRealKey) {
        try {
          const conversationHistory = updatedMessages.filter(
            m => !m.isError && m.content && (m.role === 'user' || (m.role === 'assistant' && updatedMessages.indexOf(m) > 0))
          );
          reply = await callGeminiAPI(conversationHistory, systemContext);
        } catch (apiErr) {
          console.warn('Gemini API call failed, using intelligent local diagnostic reply:', apiErr);
          reply = generateLocalAssistantReply(messageText, currentUser, analytics, topics, snippets);
        }
      } else {
        // Local diagnostic response mode
        reply = generateLocalAssistantReply(messageText, currentUser, analytics, topics, snippets);
      }

      setMessages(prev => [...prev, { role: 'assistant', content: reply, id: Date.now() + 1 }]);
    } catch (err) {
      setError(err.message);
      const fallback = generateLocalAssistantReply(messageText, currentUser, analytics, topics, snippets);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: fallback,
        id: Date.now() + 1
      }]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setError(null);
    setTimeout(() => setIsOpen(true), 50);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-2xl shadow-xl transition-all duration-300 ${
          isOpen
            ? 'bg-slate-700 hover:bg-slate-600 rotate-0 scale-95'
            : 'bg-indigo-600 hover:bg-indigo-500 hover:scale-110 animate-pulse-slow'
        }`}
        aria-label={isOpen ? 'Close AI Assistant' : 'Open AI Assistant'}
        title="StudyBot - AI Learning Assistant"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <div className="relative">
            <MessageCircle className="w-6 h-6 text-white" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-indigo-600 animate-pulse" />
          </div>
        )}
      </button>

      {/* Chat Panel */}
      <div
        className={`fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden transition-all duration-300 ease-out ${
          isOpen
            ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
            : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
        }`}
        style={{ height: '520px' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 dark:from-indigo-700 dark:to-indigo-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-white leading-none">StudyBot</p>
              <p className="text-[10px] text-indigo-200 mt-0.5">AI Learning Assistant</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-400/20 border border-emerald-400/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-semibold text-emerald-300">Live</span>
            </div>
            <button
              onClick={clearChat}
              className="text-[10px] text-indigo-200 hover:text-white px-2 py-0.5 rounded-lg hover:bg-white/10 transition-colors font-medium"
              title="Start new conversation"
            >
              New Chat
            </button>
          </div>
        </div>

        {/* Intelligent Status Notice */}
        {(!GEMINI_API_KEY || GEMINI_API_KEY.startsWith('AQ.')) ? (
          <div className="px-4 py-2 bg-indigo-50/80 dark:bg-indigo-950/40 border-b border-indigo-200 dark:border-indigo-800 text-[11px] text-indigo-700 dark:text-indigo-300 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span>💡</span>
              <span>Local Diagnostic Intelligence Active</span>
            </span>
            <span className="text-[10px] text-slate-400">Offline Ready</span>
          </div>
        ) : (
          <div className="px-4 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 border-b border-emerald-200 dark:border-emerald-800 text-[10px] text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Connected to Google Gemini AI</span>
          </div>
        )}

        {/* Messages Area */}
        <div
          ref={messagesContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scroll-smooth"
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                msg.role === 'user'
                  ? 'bg-indigo-100 dark:bg-indigo-900'
                  : 'bg-slate-100 dark:bg-slate-800'
              }`}>
                {msg.role === 'user' ? (
                  <User className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                ) : (
                  <Bot className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                )}
              </div>

              {/* Bubble */}
              <div
                className={`max-w-[80%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-sm'
                    : msg.isError
                    ? 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 rounded-tl-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-sm'
                }`}
              >
                <MessageContent content={msg.content} />
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-2">
              <div className="w-7 h-7 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                <Bot className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
              </div>
              <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl rounded-tl-sm px-3 py-2 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Scroll to bottom button */}
        {showScrollBtn && (
          <button
            onClick={() => scrollToBottom()}
            className="absolute bottom-20 right-4 w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-md hover:bg-indigo-500 transition-colors"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        )}

        {/* Quick Prompts - show only when few messages */}
        {messages.length <= 1 && !isLoading && (
          <div className="px-4 pb-2">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Quick questions:</p>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  className="px-2.5 py-1 text-[10px] font-medium rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="px-4 pb-4 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 rounded-2xl px-3 py-2 border border-slate-200 dark:border-slate-700 focus-within:border-indigo-400 dark:focus-within:border-indigo-500 transition-colors">
            <Sparkles className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about your progress..."
              rows={1}
              disabled={isLoading}
              className="flex-1 bg-transparent text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none resize-none leading-relaxed disabled:opacity-50"
              style={{ maxHeight: '72px' }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || isLoading}
              className="p-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0 cursor-pointer"
            >
              {isLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
          <p className="text-[9px] text-slate-400 text-center mt-1.5">
            Powered by Google Gemini · Responses may not be 100% accurate
          </p>
        </div>
      </div>
    </>
  );
}

// Component to render message content with basic markdown support
function MessageContent({ content }) {
  const lines = content.split('\n');
  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        if (line.startsWith('## ')) {
          return <p key={i} className="font-bold text-[11px]">{line.replace('## ', '')}</p>;
        }
        if (line.startsWith('• ') || line.startsWith('- ')) {
          return (
            <div key={i} className="flex gap-1.5">
              <span className="shrink-0 mt-0.5">•</span>
              <span>{line.replace(/^[•-] /, '')}</span>
            </div>
          );
        }
        if (line.startsWith('**') && line.endsWith('**')) {
          return <p key={i} className="font-semibold">{line.replace(/\*\*/g, '')}</p>;
        }
        if (line === '') return <div key={i} className="h-1" />;
        // Handle inline bold **text**
        const parts = line.split(/(\*\*[^*]+\*\*)/g);
        return (
          <p key={i}>
            {parts.map((part, j) =>
              part.startsWith('**') && part.endsWith('**')
                ? <strong key={j}>{part.slice(2, -2)}</strong>
                : part
            )}
          </p>
        );
      })}
    </div>
  );
}

export default AIChatbot;
