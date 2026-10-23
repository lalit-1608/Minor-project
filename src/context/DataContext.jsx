import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { dataService, subscribeToDataChanges } from '../services/dataService';
import {
  calculateFacultyRanking,
  calculateDepartmentStats,
  calculateSemesterStats,
  calculateFeedbackTrend,
  calculateRatingDistribution,
  calculateOverallAverage,
  getWeakestParameters,
  calculatePercentage
} from '../utils/calculations';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [settings, setSettings] = useState({});
  const [classes, setClasses] = useState({});
  const [adjustments, setAdjustments] = useState([]);

  const reloadAll = useCallback(async () => {
    try {
      await dataService.initialize();
      const [d, f, s, fb, st, cl, adj] = await Promise.all([
        dataService.getDepartments(),
        dataService.getFaculty(),
        dataService.getSubjects(),
        dataService.getFeedback(),
        dataService.getSettings(),
        dataService.getClasses(),
        dataService.getAdjustments()
      ]);
      setDepartments(d);
      setFaculty(f);
      setSubjects(s);
      setFeedback(fb);
      setSettings(st);
      setClasses(cl);
      setAdjustments(adj);
    } catch (err) {
      console.error('Failed to load StudySnippet data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reloadAll();
    const unsubscribe = subscribeToDataChanges((type) => {
      // Whenever feedback is submitted or settings changed or reset, re-fetch
      reloadAll();
    });
    return () => unsubscribe();
  }, [reloadAll]);

  // Derived calculations (instant reactive updates when feedback or settings change)
  const rankedFaculty = useMemo(() => {
    return calculateFacultyRanking(faculty, feedback, settings);
  }, [faculty, feedback, settings]);

  const departmentStats = useMemo(() => {
    return calculateDepartmentStats(departments, faculty, feedback, settings);
  }, [departments, faculty, feedback, settings]);

  const semesterStats = useMemo(() => {
    return calculateSemesterStats(feedback);
  }, [feedback]);

  const feedbackTrend = useMemo(() => {
    return calculateFeedbackTrend(feedback);
  }, [feedback]);

  const ratingDistribution = useMemo(() => {
    return calculateRatingDistribution(feedback);
  }, [feedback]);

  const overallMetrics = useMemo(() => {
    const totalFaculty = faculty.length;
    const totalSubjects = subjects.length;
    const totalFeedback = feedback.length;
    const collectedFeedbackCount = feedback.filter(f => f.dataProvenance === 'collected').length;
    const demoFeedbackCount = feedback.filter(f => f.dataProvenance === 'demo' || f.isDemo).length;
    const averageRating = calculateOverallAverage(feedback);
    const overallPercentage = calculatePercentage(averageRating);

    return {
      totalFaculty,
      totalSubjects,
      totalFeedback,
      collectedFeedbackCount,
      demoFeedbackCount,
      averageRating,
      overallPercentage
    };
  }, [faculty, subjects, feedback]);

  // Top Performing Faculty (qualified with >= minThreshold and status 'Top Performing')
  const topPerformingFaculty = useMemo(() => {
    const minThreshold = settings.minFeedbackThreshold ?? 5;
    return rankedFaculty
      .filter(item => item.feedbackCount >= minThreshold && item.statusInfo.code === 'top')
      .slice(0, 5);
  }, [rankedFaculty, settings]);

  // Faculty Requiring Improvement (overallAverage < 3.0 or lowest parameters)
  const improvementFaculty = useMemo(() => {
    const minThreshold = settings.minFeedbackThreshold ?? 5;
    // Ranked list already sorted desc; take bottom items with sufficient feedback or status improvement/opportunity
    return rankedFaculty
      .filter(item => item.feedbackCount >= minThreshold && (item.statusInfo.code === 'improvement' || item.statusInfo.code === 'opportunity'))
      .sort((a, b) => a.overallAverage - b.overallAverage) // lowest first
      .map(item => ({
        ...item,
        lowestParameter: getWeakestParameters(item.parameterAverages)[0] || { label: 'N/A', value: 0 }
      }))
      .slice(0, 5);
  }, [rankedFaculty, settings]);

  const submitFeedback = async (formData) => {
    const created = await dataService.submitFeedback(formData);
    await reloadAll();
    return created;
  };

  const updateSettings = async (newSettings) => {
    const updated = await dataService.saveSettings(newSettings);
    setSettings(updated);
    return updated;
  };

  const resetDemoData = async () => {
    await dataService.resetDemoData();
    await reloadAll();
  };

  const saveAdjustment = async (adjData) => {
    const created = await dataService.saveAdjustment(adjData);
    await reloadAll();
    return created;
  };

  const updateAdjustmentReview = async (id, reviewData) => {
    const updated = await dataService.updateAdjustmentReview(id, reviewData);
    await reloadAll();
    return updated;
  };

  const value = {
    loading,
    departments,
    faculty,
    subjects,
    feedback,
    settings,
    classes,
    adjustments,
    rankedFaculty,
    departmentStats,
    semesterStats,
    feedbackTrend,
    ratingDistribution,
    overallMetrics,
    topPerformingFaculty,
    improvementFaculty,
    submitFeedback,
    saveAdjustment,
    updateAdjustmentReview,
    updateSettings,
    resetDemoData,
    reloadAll
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
}
