import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

export interface QuizAttempt {
  quizId: string;
  topicId: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  timestamp: string;
}

export interface TopicPerformance {
  attempts: number;
  totalCorrect: number;
  totalQuestions: number;
  accuracyPercentage: number;
}

export interface StudentCertificate {
  id: string;
  topicId: string;
  topicTitle: string;
  issueDate: string;
  scorePercentage: number;
  certificateCode: string;
}

export interface UserProgress {
  userId: string;
  xp: number;
  level: number;
  streak: number;
  lastActiveDate: string;
  completedModules: string[];
  currentModuleId: string | null;
  quizHistory: QuizAttempt[];
  topicPerformance: Record<string, TopicPerformance>;
  unlockedBadges: string[];
  certificates: StudentCertificate[];
}

const STORAGE_KEY = 'polaris_student_learning_progress';
const LISTENERS: Array<() => void> = [];

export function subscribeStudentProgress(listener: () => void): () => void {
  LISTENERS.push(listener);
  return () => {
    const idx = LISTENERS.indexOf(listener);
    if (idx >= 0) LISTENERS.splice(idx, 1);
  };
}

function notifyListeners() {
  LISTENERS.forEach((fn) => {
    try {
      fn();
    } catch (e) {
      console.error('Error notifying student progress listener:', e);
    }
  });
}

function getDefaultProgress(userId = 'guest'): UserProgress {
  return {
    userId,
    xp: 450,
    level: 3,
    streak: 4,
    lastActiveDate: new Date().toISOString().split('T')[0],
    completedModules: ['ice-core-past-climate', 'sea-ice-formation'],
    currentModuleId: 'southern-ocean-circulation',
    quizHistory: [
      {
        quizId: 'quiz-climate-1',
        topicId: 'climate-environment',
        score: 8,
        totalQuestions: 10,
        percentage: 80,
        timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
      {
        quizId: 'quiz-cryosphere-1',
        topicId: 'cryosphere',
        score: 9,
        totalQuestions: 10,
        percentage: 90,
        timestamp: new Date(Date.now() - 86400000).toISOString(),
      },
    ],
    topicPerformance: {
      'climate-environment': { attempts: 1, totalCorrect: 8, totalQuestions: 10, accuracyPercentage: 80 },
      'cryosphere': { attempts: 1, totalCorrect: 9, totalQuestions: 10, accuracyPercentage: 90 },
    },
    unlockedBadges: ['badge-first-lesson', 'badge-ice-core-master', 'badge-quiz-novice'],
    certificates: [
      {
        id: 'cert-101',
        topicId: 'cryosphere',
        topicTitle: 'Cryosphere & Sea Ice Dynamics',
        issueDate: '2026-09-28',
        scorePercentage: 90,
        certificateCode: 'YUKI-CERT-CRY-8849',
      },
    ],
  };
}

export function getStudentProgress(userId?: string): UserProgress {
  const effectiveId = userId || 'guest';
  try {
    const local = localStorage.getItem(`${STORAGE_KEY}_${effectiveId}`);
    if (local) {
      return JSON.parse(local);
    }
  } catch (e) {
    console.warn('Failed reading student progress from localStorage:', e);
  }
  const defaultProg = getDefaultProgress(effectiveId);
  try {
    localStorage.setItem(`${STORAGE_KEY}_${effectiveId}`, JSON.stringify(defaultProg));
  } catch {}
  return defaultProg;
}

export function saveStudentProgress(userId: string | undefined, progress: UserProgress) {
  const effectiveId = userId || 'guest';
  // Compute level from XP
  progress.level = Math.max(1, Math.floor(progress.xp / 200) + 1);

  // Update streak logic
  const today = new Date().toISOString().split('T')[0];
  if (progress.lastActiveDate !== today) {
    const last = new Date(progress.lastActiveDate);
    const now = new Date(today);
    const diffDays = Math.round((now.getTime() - last.getTime()) / (1000 * 3600 * 24));
    if (diffDays === 1) {
      progress.streak += 1;
    } else if (diffDays > 1) {
      progress.streak = 1;
    }
    progress.lastActiveDate = today;
  }

  // Check badges
  if (progress.completedModules.length >= 1 && !progress.unlockedBadges.includes('badge-first-lesson')) {
    progress.unlockedBadges.push('badge-first-lesson');
  }
  if (progress.completedModules.length >= 5 && !progress.unlockedBadges.includes('badge-[#183647]-scholar')) {
    progress.unlockedBadges.push('badge-[#183647]-scholar');
  }
  if (progress.xp >= 1000 && !progress.unlockedBadges.includes('badge-1000-xp')) {
    progress.unlockedBadges.push('badge-1000-xp');
  }

  // Local Storage update
  try {
    localStorage.setItem(`${STORAGE_KEY}_${effectiveId}`, JSON.stringify(progress));
  } catch (e) {
    console.error('Failed saving to localStorage:', e);
  }

  // Firestore update if logged in
  if (userId && db) {
    const docRef = doc(db, 'users', userId, 'learning_progress', 'state');
    setDoc(docRef, progress, { merge: true }).catch((e) => {
      console.warn('Firestore learning progress sync notice:', e.message);
    });
  }

  notifyListeners();
}

export function recordModuleCompletion(userId: string | undefined, moduleId: string, topicId: string): UserProgress {
  const prog = getStudentProgress(userId);
  if (!prog.completedModules.includes(moduleId)) {
    prog.completedModules.push(moduleId);
    prog.xp += 150; // Award 150 XP per completed interactive module
  }
  prog.currentModuleId = moduleId;
  saveStudentProgress(userId, prog);
  return prog;
}

export function recordQuizAttempt(
  userId: string | undefined,
  quizId: string,
  topicId: string,
  score: number,
  totalQuestions: number
): UserProgress {
  const prog = getStudentProgress(userId);
  const percentage = Math.round((score / totalQuestions) * 100);

  prog.quizHistory.unshift({
    quizId,
    topicId,
    score,
    totalQuestions,
    percentage,
    timestamp: new Date().toISOString(),
  });

  // Award XP based on percentage
  const earnedXp = Math.round((percentage / 100) * 100) + 20; // 20 base XP for attempt
  prog.xp += earnedXp;

  // Topic performance map update
  const existingTopic = prog.topicPerformance[topicId] || {
    attempts: 0,
    totalCorrect: 0,
    totalQuestions: 0,
    accuracyPercentage: 0,
  };

  existingTopic.attempts += 1;
  existingTopic.totalCorrect += score;
  existingTopic.totalQuestions += totalQuestions;
  existingTopic.accuracyPercentage = Math.round((existingTopic.totalCorrect / existingTopic.totalQuestions) * 100);

  prog.topicPerformance[topicId] = existingTopic;

  // Quiz Badges
  if (percentage >= 90 && !prog.unlockedBadges.includes('badge-quiz-ace')) {
    prog.unlockedBadges.push('badge-quiz-ace');
  }

  saveStudentProgress(userId, prog);
  return prog;
}

export function issueCertificate(userId: string | undefined, topicId: string, topicTitle: string, scorePercentage: number): StudentCertificate {
  const prog = getStudentProgress(userId);
  const existing = prog.certificates.find((c) => c.topicId === topicId);
  if (existing) {
    if (scorePercentage > existing.scorePercentage) {
      existing.scorePercentage = scorePercentage;
      saveStudentProgress(userId, prog);
    }
    return existing;
  }

  const cert: StudentCertificate = {
    id: `cert-${Date.now()}`,
    topicId,
    topicTitle,
    issueDate: new Date().toISOString().split('T')[0],
    scorePercentage,
    certificateCode: `YUKI-CERT-${topicId.toUpperCase().slice(0, 3)}-${Math.floor(1000 + Math.random() * 9000)}`,
  };

  prog.certificates.push(cert);
  prog.xp += 250; // Bonus XP for earning certificate
  saveStudentProgress(userId, prog);
  return cert;
}
