import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { StepIndicator } from '../components/feedback/StepIndicator';
import { Step1CourseSelect } from '../components/feedback/Step1CourseSelect';
import { Step2Ratings } from '../components/feedback/Step2Ratings';
import { Step3Comment } from '../components/feedback/Step3Comment';
import { Step4Review } from '../components/feedback/Step4Review';
import { hasSubmittedFeedback } from '../utils/session';
import confetti from 'canvas-confetti';

export function FeedbackPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { departments, faculty, subjects, classes, submitFeedback } = useData();
  const { currentUser, isStudent } = useAuth();
  const { addToast } = useToast();

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State - pre-populated and locked for active student persona
  const studentDept = currentUser?.departmentId || 'dept-cse';
  const studentSem = currentUser?.semester ? String(currentUser.semester) : '5';
  const studentClass = currentUser?.className || 'CSE-A';

  const preDept = location.state?.preselectedDept || (isStudent ? studentDept : '');
  const preSem = location.state?.preselectedSemester
    ? String(location.state.preselectedSemester)
    : (isStudent ? studentSem : '');
  const preClass = isStudent ? studentClass : '';
  const preSubject = location.state?.preselectedSubject || '';
  const preFaculty = preSubject
    ? (subjects.find(s => s.id === preSubject)?.facultyIds?.[0] || '')
    : '';

  const [formData, setFormData] = useState({
    departmentId: preDept,
    semester: preSem,
    className: preClass,
    facultyId: preFaculty,
    subjectId: preSubject
  });

  const [ratings, setRatings] = useState({
    subjectKnowledge: 0,
    clarity: 0,
    communication: 0,
    engagement: 0,
    punctuality: 0,
    satisfaction: 0
  });

  const [comment, setComment] = useState('');

  const handleRatingChange = (paramKey, value) => {
    setRatings(prev => ({
      ...prev,
      [paramKey]: value
    }));
  };

  const handleSubmit = async () => {
    // Check duplicate prevention before sending
    if (hasSubmittedFeedback(formData.facultyId, formData.subjectId, formData.semester)) {
      addToast('You have already submitted feedback for this faculty and subject.', 'error', 6000);
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await submitFeedback({
        facultyId: formData.facultyId,
        subjectId: formData.subjectId,
        departmentId: formData.departmentId,
        semester: Number(formData.semester),
        className: formData.className,
        ratings,
        comment
      });

      // Celebration burst
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // Confetti optional
      }

      const selectedFaculty = faculty.find(f => f.id === formData.facultyId);
      const selectedSubject = subjects.find(s => s.id === formData.subjectId);

      addToast('Feedback submitted! Student identity is not stored with this record.', 'success');

      // Navigate to success screen
      navigate('/feedback/success', {
        state: {
          facultyName: selectedFaculty?.name || 'Faculty Member',
          facultyDesignation: selectedFaculty?.designation || '',
          subjectName: selectedSubject?.name || 'Course',
          subjectCode: selectedSubject?.code || '',
          semester: formData.semester,
          className: formData.className,
          ratings
        }
      });
    } catch (err) {
      console.error('Submission failed:', err);
      addToast(err.message || 'Failed to submit feedback. Please try again.', 'error', 6000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Step Indicator */}
      <StepIndicator
        currentStep={currentStep}
        onStepClick={(step) => setCurrentStep(step)}
      />

      {/* Step 1: Course and Faculty Selection */}
      {currentStep === 1 && (
        <Step1CourseSelect
          formData={formData}
          setFormData={setFormData}
          departments={departments}
          facultyList={faculty}
          subjectsList={subjects}
          classesMap={classes}
          isStudentLocked={isStudent}
          onContinue={() => setCurrentStep(2)}
        />
      )}

      {/* Step 2: 6 Criteria Ratings */}
      {currentStep === 2 && (
        <Step2Ratings
          ratings={ratings}
          onRatingChange={handleRatingChange}
          onBack={() => setCurrentStep(1)}
          onContinue={() => setCurrentStep(3)}
        />
      )}

      {/* Step 3: Constructive Comment */}
      {currentStep === 3 && (
        <Step3Comment
          comment={comment}
          onChange={setComment}
          onBack={() => setCurrentStep(2)}
          onContinue={() => setCurrentStep(4)}
        />
      )}

      {/* Step 4: Final Review & Submit */}
      {currentStep === 4 && (
        <Step4Review
          formData={formData}
          ratings={ratings}
          comment={comment}
          departments={departments}
          facultyList={faculty}
          subjectsList={subjects}
          onBack={() => setCurrentStep(3)}
          onEditStep={(step) => setCurrentStep(step)}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}
