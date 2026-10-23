// Unified Data Service Abstraction Layer
// Default implementation uses robust localStorage persistence.
// Designed with a pure Promise-based API for seamless plug-in to Supabase or any REST API backend.

import {
  INITIAL_DEPARTMENTS,
  INITIAL_FACULTY,
  INITIAL_SUBJECTS,
  INITIAL_FEEDBACK,
  INITIAL_SETTINGS,
  INITIAL_CLASSES,
  INITIAL_ADJUSTMENTS
} from './seedData.js';
import {
  hasSubmittedFeedback,
  recordSubmissionKey,
  clearSubmissionsRegistry
} from '../utils/session.js';

const STORAGE_KEYS = {
  DEPARTMENTS: 'studysnippet_departments_v1',
  FACULTY: 'studysnippet_faculty_v1',
  SUBJECTS: 'studysnippet_subjects_v1',
  FEEDBACK: 'studysnippet_feedback_v1',
  SETTINGS: 'studysnippet_settings_v1',
  CLASSES: 'studysnippet_classes_v1',
  ADJUSTMENTS: 'studysnippet_adjustments_v1'
};

// Event emitter to notify active listeners of state mutations across tabs / components
const listeners = new Set();

export function subscribeToDataChanges(callback) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function notifySubscribers(eventType, payload) {
  listeners.forEach(cb => {
    try {
      cb(eventType, payload);
    } catch (e) {
      console.error('Subscriber error:', e);
    }
  });
}

function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.warn(`Failed reading ${key}, falling back to initial seed data`, err);
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

export const dataService = {
  /**
   * Initializes storage with seed data if keys are not present
   */
  async initialize() {
    if (!localStorage.getItem(STORAGE_KEYS.FEEDBACK)) {
      writeStorage(STORAGE_KEYS.DEPARTMENTS, INITIAL_DEPARTMENTS);
      writeStorage(STORAGE_KEYS.FACULTY, INITIAL_FACULTY);
      writeStorage(STORAGE_KEYS.SUBJECTS, INITIAL_SUBJECTS);
      writeStorage(STORAGE_KEYS.FEEDBACK, INITIAL_FEEDBACK);
      writeStorage(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
      writeStorage(STORAGE_KEYS.CLASSES, INITIAL_CLASSES);
      writeStorage(STORAGE_KEYS.ADJUSTMENTS, INITIAL_ADJUSTMENTS);
    }
    return true;
  },

  async getDepartments() {
    return readStorage(STORAGE_KEYS.DEPARTMENTS, INITIAL_DEPARTMENTS);
  },

  async getFaculty() {
    return readStorage(STORAGE_KEYS.FACULTY, INITIAL_FACULTY);
  },

  async getFacultyById(id) {
    const faculty = await this.getFaculty();
    return faculty.find(f => f.id === id) || null;
  },

  async getSubjects() {
    return readStorage(STORAGE_KEYS.SUBJECTS, INITIAL_SUBJECTS);
  },

  async getClasses() {
    return readStorage(STORAGE_KEYS.CLASSES, INITIAL_CLASSES);
  },

  async getFeedback() {
    const raw = readStorage(STORAGE_KEYS.FEEDBACK, INITIAL_FEEDBACK);
    // Safe identification: ensure all records carry explicit dataProvenance property and strip session hashes
    return raw.map(item => {
      const isDemo = item.isDemo !== undefined
        ? item.isDemo
        : (String(item.id).startsWith('fb-1') ||
           String(item.id).startsWith('seed-') ||
           (item.anonymousSessionHash && String(item.anonymousSessionHash).startsWith('seed-hash-')));

      const { anonymousSessionHash, ...cleanItem } = item;
      return {
        ...cleanItem,
        dataProvenance: isDemo ? 'demo' : 'collected',
        isDemo
      };
    });
  },

  async getAdjustments() {
    const raw = readStorage(STORAGE_KEYS.ADJUSTMENTS, INITIAL_ADJUSTMENTS);
    // Safe identification: ensure all records carry explicit dataProvenance property
    return raw.map(item => {
      if (item.dataProvenance) return item;
      const isDemo = item.id === 'adj-1' || item.id === 'adj-2' || item.id === 'adj-3';
      return {
        ...item,
        dataProvenance: isDemo ? 'demo' : 'collected',
        isDemo
      };
    });
  },

  async saveAdjustment(adjustmentData) {
    const adjustments = await this.getAdjustments();
    const newRecord = {
      id: `adj-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
      status: 'Implemented',
      hodReviewed: false,
      hodNotes: '',
      dataProvenance: 'collected',
      isDemo: false,
      ...adjustmentData
    };
    adjustments.unshift(newRecord);
    writeStorage(STORAGE_KEYS.ADJUSTMENTS, adjustments);
    notifySubscribers('ADJUSTMENT_CREATED', newRecord);
    return newRecord;
  },

  async updateAdjustmentReview(id, { hodNotes, status = 'Implemented' }) {
    const adjustments = await this.getAdjustments();
    const index = adjustments.findIndex(a => a.id === id);
    if (index !== -1) {
      adjustments[index] = {
        ...adjustments[index],
        hodReviewed: true,
        hodNotes,
        status
      };
      writeStorage(STORAGE_KEYS.ADJUSTMENTS, adjustments);
      notifySubscribers('ADJUSTMENT_UPDATED', adjustments[index]);
      return adjustments[index];
    }
    throw new Error('Adjustment not found');
  },

  async getSettings() {
    return readStorage(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
  },

  async saveSettings(updated) {
    const current = await this.getSettings();
    const merged = { ...current, ...updated };
    writeStorage(STORAGE_KEYS.SETTINGS, merged);
    notifySubscribers('SETTINGS_UPDATED', merged);
    return merged;
  },

  /**
   * Submits anonymous feedback with strict duplicate detection
   */
  async submitFeedback(submission) {
    const { facultyId, subjectId, semester, departmentId, className, ratings, comment } = submission;

    if (!facultyId || !subjectId || !semester || !departmentId || !className) {
      throw new Error('All course selection fields are required.');
    }

    const requiredRatings = ['subjectKnowledge', 'clarity', 'communication', 'engagement', 'punctuality', 'satisfaction'];
    for (const key of requiredRatings) {
      const val = ratings?.[key];
      if (typeof val !== 'number' || val < 1 || val > 5) {
        throw new Error(`Rating for ${key} is required (1-5).`);
      }
    }

    // Duplicate protection check
    if (hasSubmittedFeedback(facultyId, subjectId, semester)) {
      throw new Error('You have already submitted feedback for this faculty and subject.');
    }

    const feedbackList = await this.getFeedback();
    const newRecord = {
      id: `fb-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      facultyId,
      subjectId,
      departmentId,
      semester: Number(semester),
      className,
      ratings: {
        subjectKnowledge: Number(ratings.subjectKnowledge),
        clarity: Number(ratings.clarity),
        communication: Number(ratings.communication),
        engagement: Number(ratings.engagement),
        punctuality: Number(ratings.punctuality),
        satisfaction: Number(ratings.satisfaction)
      },
      comment: (comment || '').trim().substring(0, 500),
      createdAt: new Date().toISOString(),
      dataProvenance: 'collected',
      isDemo: false
    };

    feedbackList.unshift(newRecord);
    writeStorage(STORAGE_KEYS.FEEDBACK, feedbackList);

    // Record submission key in browser registry
    recordSubmissionKey(facultyId, subjectId, semester);

    notifySubscribers('FEEDBACK_SUBMITTED', newRecord);
    return newRecord;
  },

  /**
   * Restores clean seed data and clears duplicate prevention registry
   */
  async resetDemoData() {
    writeStorage(STORAGE_KEYS.DEPARTMENTS, INITIAL_DEPARTMENTS);
    writeStorage(STORAGE_KEYS.FACULTY, INITIAL_FACULTY);
    writeStorage(STORAGE_KEYS.SUBJECTS, INITIAL_SUBJECTS);
    writeStorage(STORAGE_KEYS.FEEDBACK, INITIAL_FEEDBACK);
    writeStorage(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
    writeStorage(STORAGE_KEYS.CLASSES, INITIAL_CLASSES);
    writeStorage(STORAGE_KEYS.ADJUSTMENTS, INITIAL_ADJUSTMENTS);
    clearSubmissionsRegistry();

    notifySubscribers('DATA_RESET', null);
    return true;
  }
};
