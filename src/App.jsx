import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { DataProvider } from './context/DataContext';
import { AuthProvider } from './context/AuthContext';
import { AppLayout } from './components/layout/AppLayout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { ResearchOverviewPage } from './pages/ResearchOverviewPage';
import { AssessmentQuizPage } from './pages/AssessmentQuizPage';
import { MisconceptionsAnalyticsPage } from './pages/MisconceptionsAnalyticsPage';
import { HciResearchPage } from './pages/HciResearchPage';
import { PedagogicalAdjustmentsPage } from './pages/PedagogicalAdjustmentsPage';
import { FeedbackPage } from './pages/FeedbackPage';
import { FeedbackSuccessPage } from './pages/FeedbackSuccessPage';
import { DashboardPage } from './pages/DashboardPage';
import { FacultyListPage } from './pages/FacultyListPage';
import { FacultyReportPage } from './pages/FacultyReportPage';
import { SubjectsPage } from './pages/SubjectsPage';
import { FeedbackRecordsPage } from './pages/FeedbackRecordsPage';
import { ComparePage } from './pages/ComparePage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';
import { MyLearningPage } from './pages/MyLearningPage';
import { StudySnippetsPage } from './pages/StudySnippetsPage';
import { EducatorDashboardPage } from './pages/EducatorDashboardPage';
import { EducationalContentStudioPage } from './pages/EducationalContentStudioPage';
import { LearnerDiagnosticAnalyticsPage } from './pages/LearnerDiagnosticAnalyticsPage';
import { UsabilitySurveyPage } from './pages/UsabilitySurveyPage';

export function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <DataProvider>
              <Routes>
                {/* Standalone Login Route */}
                <Route path="/login" element={<LoginPage />} />

                <Route element={<AppLayout />}>
                  {/* Public Landing & Research Pages */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/research" element={<ResearchOverviewPage />} />

                  {/* Student / Learner Diagnostic Learning Studio */}
                  <Route path="/my-learning" element={
                    <ProtectedRoute allowedRoles={['student']}>
                      <MyLearningPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/study-snippets" element={
                    <ProtectedRoute allowedRoles={['student', 'faculty', 'admin']}>
                      <StudySnippetsPage />
                    </ProtectedRoute>
                  } />

                  {/* Diagnostic Quiz & Assessment */}
                  <Route path="/quiz" element={
                    <ProtectedRoute allowedRoles={['student', 'faculty', 'admin']}>
                      <AssessmentQuizPage />
                    </ProtectedRoute>
                  } />

                  {/* Usability Survey for Student & Faculty Participants */}
                  <Route path="/usability-survey" element={
                    <ProtectedRoute allowedRoles={['student', 'faculty']}>
                      <UsabilitySurveyPage />
                    </ProtectedRoute>
                  } />

                  {/* Anonymous Course Feedback Submission */}
                  <Route path="/feedback" element={
                    <ProtectedRoute allowedRoles={['student']}>
                      <FeedbackPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/feedback/success" element={
                    <ProtectedRoute allowedRoles={['student']}>
                      <FeedbackSuccessPage />
                    </ProtectedRoute>
                  } />

                  {/* Shared Authenticated Exploration */}
                  <Route path="/misconceptions" element={
                    <ProtectedRoute allowedRoles={['student', 'faculty', 'admin']}>
                      <MisconceptionsAnalyticsPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/faculty" element={
                    <ProtectedRoute allowedRoles={['student', 'faculty', 'admin']}>
                      <FacultyListPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/subjects" element={
                    <ProtectedRoute allowedRoles={['student', 'faculty', 'admin']}>
                      <SubjectsPage />
                    </ProtectedRoute>
                  } />

                  {/* Educator Research & Diagnostic Studio (Faculty & Admin) */}
                  <Route path="/educator" element={
                    <ProtectedRoute allowedRoles={['faculty', 'admin']}>
                      <EducatorDashboardPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/educator/content" element={
                    <ProtectedRoute allowedRoles={['faculty', 'admin']}>
                      <EducationalContentStudioPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/educator/learner-analytics" element={
                    <ProtectedRoute allowedRoles={['faculty', 'admin']}>
                      <LearnerDiagnosticAnalyticsPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/pedagogical-adjustments" element={
                    <ProtectedRoute allowedRoles={['faculty', 'admin']}>
                      <PedagogicalAdjustmentsPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/feedback-records" element={
                    <ProtectedRoute allowedRoles={['faculty', 'admin']}>
                      <FeedbackRecordsPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/faculty/:id" element={
                    <ProtectedRoute allowedRoles={['student', 'faculty', 'admin']}>
                      <FacultyReportPage />
                    </ProtectedRoute>
                  } />

                  {/* Institutional Academic Oversight (Admin Only) */}
                  <Route path="/dashboard" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <DashboardPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/hci-research" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <HciResearchPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/compare" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <ComparePage />
                    </ProtectedRoute>
                  } />
                  <Route path="/reports" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <ReportsPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/settings" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <SettingsPage />
                    </ProtectedRoute>
                  } />

                  {/* Fallback route */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
              </Routes>
            </DataProvider>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
