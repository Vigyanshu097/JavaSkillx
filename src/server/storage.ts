import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import {
  User,
  AssessmentRecord,
  UserAnswerRecord,
  DsaReadinessReport,
  Achievement,
  InterviewSession,
  InterviewQuestion,
} from './types.ts';
import { QUESTIONS_DATABASE } from './questionsData.ts';
import { INTERVIEW_QUESTIONS_DATABASE } from './interviewsData.ts';

interface DatabaseSchema {
  users: Record<string, User>;
  assessments: Record<string, AssessmentRecord>;
  userAchievements: Record<string, string[]>; // userId or guestToken -> achievementIds
  interviewSessions: Record<string, InterviewSession>;
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'javaskillx_db.json');

export const ACHIEVEMENTS_LIST: Achievement[] = [
  {
    id: 'first_step',
    title: 'First Step',
    description: 'Submitted your first question in the Java assessment.',
    category: 'PROGRESS',
    icon: 'Sparkles',
  },
  {
    id: 'beginner_explorer',
    title: 'Beginner Explorer',
    description: 'Conquered Stage 1 (Beginner) by completing the first 15 questions.',
    category: 'PROGRESS',
    icon: 'Compass',
  },
  {
    id: 'intermediate_navigator',
    title: 'Intermediate Navigator',
    description: 'Completed Stage 2 (Intermediate) with OOP and Collections mastery.',
    category: 'PROGRESS',
    icon: 'Shield',
  },
  {
    id: 'code_runner',
    title: 'Code Runner',
    description: 'Compiled and passed 100% of test cases on a Java coding challenge.',
    category: 'CODING',
    icon: 'Terminal',
  },
  {
    id: 'debugger',
    title: 'Master Debugger',
    description: 'Diagnosed and solved a complex Java debugging puzzle.',
    category: 'MASTERY',
    icon: 'Bug',
  },
  {
    id: 'oop_architect',
    title: 'OOP Architect',
    description: 'Achieved high accuracy on Inheritance, Polymorphism, and Encapsulation.',
    category: 'MASTERY',
    icon: 'Boxes',
  },
  {
    id: 'java_champion',
    title: 'Java Champion',
    description: 'Completed all 50 questions across all three stages of JavaSkillX.',
    category: 'MASTERY',
    icon: 'Trophy',
  },
  {
    id: 'consistency',
    title: 'Consistency',
    description: 'Resumed an in-progress assessment and continued your journey.',
    category: 'CONSISTENCY',
    icon: 'Flame',
  },
];

export class StorageService {
  private static db: DatabaseSchema = {
    users: {},
    assessments: {},
    userAchievements: {},
    interviewSessions: {},
  };

  public static initialize(): void {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.db = JSON.parse(raw);
      } else {
        this.save();
      }
    } catch (err) {
      console.error('Error initializing database file, using memory storage:', err);
    }
  }

  private static save(): void {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(this.db, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to persist database file:', err);
    }
  }

  // ==========================================
  // AUTHENTICATION
  // ==========================================
  public static hashPassword(password: string, salt: string): string {
    return crypto.scryptSync(password, salt, 64).toString('hex');
  }

  public static registerUser(username: string, email: string, password: string): User {
    const existing = Object.values(this.db.users).find(
      (u) => u.username.toLowerCase() === username.toLowerCase() || u.email.toLowerCase() === email.toLowerCase()
    );
    if (existing) {
      throw new Error('Username or email already in use.');
    }

    const salt = crypto.randomBytes(16).toString('hex');
    const passwordHash = this.hashPassword(password, salt);
    const user: User = {
      id: crypto.randomUUID(),
      username,
      email,
      passwordHash,
      salt,
      createdAt: new Date().toISOString(),
    };

    this.db.users[user.id] = user;
    this.save();
    return user;
  }

  public static authenticateUser(usernameOrEmail: string, password: string): User | null {
    const user = Object.values(this.db.users).find(
      (u) =>
        u.username.toLowerCase() === usernameOrEmail.toLowerCase() ||
        u.email.toLowerCase() === usernameOrEmail.toLowerCase()
    );
    if (!user) return null;

    const testHash = this.hashPassword(password, user.salt);
    if (crypto.timingSafeEqual(Buffer.from(testHash), Buffer.from(user.passwordHash))) {
      return user;
    }
    return null;
  }

  public static getUserById(userId: string): User | null {
    return this.db.users[userId] || null;
  }

  // ==========================================
  // ASSESSMENT PROGRESSION & SUBMISSION
  // ==========================================
  public static startOrGetAssessment(userId?: string, guestToken?: string): AssessmentRecord {
    // Look for existing unfinished or latest assessment
    const existing = Object.values(this.db.assessments).find((a) => {
      if (userId && a.userId === userId) return true;
      if (guestToken && a.guestToken === guestToken) return true;
      return false;
    });

    if (existing) {
      // Award consistency achievement if resumed
      if (existing.currentQuestionIndex > 1) {
        this.awardAchievement(userId || guestToken || '', 'consistency');
      }
      return existing;
    }

    const newAssessment: AssessmentRecord = {
      id: crypto.randomUUID(),
      userId,
      guestToken,
      status: 'IN_PROGRESS',
      currentQuestionIndex: 1,
      answers: {},
      totalScore: 0,
      stageScores: {
        beginner: 0,
        intermediate: 0,
        advanced: 0,
      },
      topicScores: {},
      startedAt: new Date().toISOString(),
      lastActivityAt: new Date().toISOString(),
    };

    this.db.assessments[newAssessment.id] = newAssessment;
    this.save();
    return newAssessment;
  }

  public static getAssessmentById(id: string): AssessmentRecord | null {
    return this.db.assessments[id] || null;
  }

  public static restartAssessment(id: string): AssessmentRecord {
    const assessment = this.db.assessments[id];
    if (!assessment) throw new Error('Assessment not found');

    assessment.status = 'IN_PROGRESS';
    assessment.currentQuestionIndex = 1;
    assessment.answers = {};
    assessment.totalScore = 0;
    assessment.stageScores = { beginner: 0, intermediate: 0, advanced: 0 };
    assessment.topicScores = {};
    assessment.dsaReadiness = undefined;
    assessment.lastActivityAt = new Date().toISOString();
    assessment.completedAt = undefined;

    this.save();
    return assessment;
  }

  public static async submitAnswer(
    assessmentId: string,
    questionId: number,
    submittedAnswer: string
  ): Promise<{
    answerRecord: UserAnswerRecord;
    assessment: AssessmentRecord;
    questionExplanation: string;
    commonMistakes: string;
    takeaway: string;
    correctAnswerDisplay?: string;
  }> {
    const assessment = this.db.assessments[assessmentId];
    if (!assessment) throw new Error('Assessment not found');

    if (assessment.status === 'COMPLETED') {
      throw new Error('Assessment is already completed.');
    }

    // Integrity Check 1: Prevent Duplicate Submissions / Resubmissions
    if (assessment.answers[questionId]) {
      throw new Error(`Question ${questionId} has already been answered.`);
    }

    // Integrity Check 2: Prevent Question Skipping / Out of Order Submissions
    if (questionId !== assessment.currentQuestionIndex) {
      throw new Error(`Sequential progression violation: Expected Question ${assessment.currentQuestionIndex}, got ${questionId}`);
    }

    const question = QUESTIONS_DATABASE.find((q) => q.id === questionId);
    if (!question) throw new Error(`Question ${questionId} not found in database.`);

    let isCorrect = false;
    let marksAwarded = 0;
    let feedback = '';
    let testResults: any = undefined;

    const userToken = assessment.userId || assessment.guestToken || '';

    // Evaluate based on category
    if (question.category === 'MCQ' || question.category === 'ERROR_DETECTION' || question.category === 'CONCEPTUAL') {
      const trimmedUser = (submittedAnswer || '').trim().toLowerCase();
      const trimmedExpected = (question.expectedAnswer || '').trim().toLowerCase();

      isCorrect = trimmedUser === trimmedExpected;
      marksAwarded = isCorrect ? question.marks : 0;
      feedback = isCorrect
        ? 'Correct! Full marks awarded.'
        : `Incorrect. Expected: "${question.expectedAnswer}"`;
    } else if (question.category === 'OUTPUT') {
      const cleanUser = (submittedAnswer || '').trim().replace(/\r\n/g, '\n');
      const cleanExpected = (question.expectedOutput || '').trim().replace(/\r\n/g, '\n');

      isCorrect = cleanUser === cleanExpected;
      marksAwarded = isCorrect ? question.marks : 0;
      feedback = isCorrect
        ? 'Correct output prediction!'
        : `Output mismatch. Expected:\n${cleanExpected}\nYour output was:\n${cleanUser}`;
    } else if (question.category === 'CODING' || question.category === 'DEBUGGING') {
      throw new Error('Java code execution is temporarily disabled in this public demo.');
    }

    const answerRecord: UserAnswerRecord = {
      questionId,
      submittedAnswer,
      isCorrect,
      marksAwarded,
      feedback,
      testResults,
      submittedAt: new Date().toISOString(),
    };

    assessment.answers[questionId] = answerRecord;
    assessment.totalScore += marksAwarded;
    assessment.lastActivityAt = new Date().toISOString();

    // Track stage score
    if (question.stage === 'BEGINNER') assessment.stageScores.beginner += marksAwarded;
    else if (question.stage === 'INTERMEDIATE') assessment.stageScores.intermediate += marksAwarded;
    else if (question.stage === 'ADVANCED') assessment.stageScores.advanced += marksAwarded;

    // Track topic score
    const topic = question.topic;
    if (!assessment.topicScores[topic]) {
      assessment.topicScores[topic] = { total: 0, earned: 0, count: 0 };
    }
    assessment.topicScores[topic].total += question.marks;
    assessment.topicScores[topic].earned += marksAwarded;
    assessment.topicScores[topic].count += 1;

    // Award Achievements based on progression
    this.awardAchievement(userToken, 'first_step');

    if (questionId === 15) {
      this.awardAchievement(userToken, 'beginner_explorer');
    } else if (questionId === 35) {
      this.awardAchievement(userToken, 'intermediate_navigator');
    }

    // Check OOP Mastery
    if (['Classes and Objects', 'Constructors', 'Inheritance', 'Polymorphism', 'Encapsulation', 'Interfaces'].includes(topic)) {
      const oopEarned = Object.entries(assessment.topicScores)
        .filter(([t]) => ['Classes and Objects', 'Constructors', 'Inheritance', 'Polymorphism', 'Encapsulation', 'Interfaces'].includes(t))
        .reduce((sum, [, data]) => sum + data.earned, 0);
      if (oopEarned >= 8) {
        this.awardAchievement(userToken, 'oop_architect');
      }
    }

    // Advance question index or complete
    if (questionId >= 50) {
      assessment.status = 'COMPLETED';
      assessment.completedAt = new Date().toISOString();
      assessment.dsaReadiness = this.calculateDsaReadiness(assessment);
      this.awardAchievement(userToken, 'java_champion');
    } else {
      assessment.currentQuestionIndex = questionId + 1;
    }

    this.save();

    return {
      answerRecord,
      assessment,
      questionExplanation: question.explanation,
      commonMistakes: question.commonMistakes,
      takeaway: question.takeaway,
      correctAnswerDisplay: question.expectedAnswer || question.expectedOutput,
    };
  }

  // ==========================================
  // DSA READINESS & WEAKNESS ANALYSIS
  // ==========================================
  public static calculateDsaReadiness(assessment: AssessmentRecord): DsaReadinessReport {
    // 1. Coding score
    const codingQuestions = QUESTIONS_DATABASE.filter((q) => q.category === 'CODING');
    const totalCodingMarks = codingQuestions.reduce((s, q) => s + q.marks, 0);
    const earnedCodingMarks = codingQuestions.reduce((s, q) => {
      return s + (assessment.answers[q.id]?.marksAwarded || 0);
    }, 0);
    const codingPercentage = totalCodingMarks > 0 ? (earnedCodingMarks / totalCodingMarks) * 100 : 0;

    // 2. Data Structures & OOP score
    const dsTopics = ['Collections Framework', 'Arrays', 'Strings', 'Recursion', 'Generics'];
    let dsTotal = 0;
    let dsEarned = 0;
    for (const [topic, data] of Object.entries(assessment.topicScores)) {
      if (dsTopics.some((t) => topic.toLowerCase().includes(t.toLowerCase()))) {
        dsTotal += data.total;
        dsEarned += data.earned;
      }
    }
    const dsPercentage = dsTotal > 0 ? (dsEarned / dsTotal) * 100 : 0;

    // 3. Overall score percentage
    const overallPercentage = (assessment.totalScore / 100) * 100;

    // Multi-factor weighted DSA score: 40% coding, 35% DS/Collections, 25% fundamentals
    const weightedDsaScore = Math.round(
      0.4 * codingPercentage + 0.35 * dsPercentage + 0.25 * overallPercentage
    );

    let classification: 'STRONG_FOUNDATION' | 'GOOD_FOUNDATION' | 'DEVELOPING' | 'NEEDS_PRACTICE';
    let badgeTitle: string;
    let summary: string;

    if (weightedDsaScore >= 80 && codingPercentage >= 70) {
      classification = 'STRONG_FOUNDATION';
      badgeTitle = 'Ready for Advanced DSA';
      summary =
        'Exceptional Java proficiency with solid coding problem-solving. You are fully equipped to dive straight into Trees, Graphs, Dynamic Programming, and complex algorithmic techniques.';
    } else if (weightedDsaScore >= 65) {
      classification = 'GOOD_FOUNDATION';
      badgeTitle = 'Ready for Foundational DSA';
      summary =
        'Strong Java base. You can begin learning Data Structures & Algorithms, focusing initially on Arrays, Two Pointers, Linked Lists, Stacks, and Queues while revising weak Java topics.';
    } else if (weightedDsaScore >= 45) {
      classification = 'DEVELOPING';
      badgeTitle = 'Developing Foundation';
      summary =
        'Good fundamental effort, but hands-on coding problem-solving and Collections need strengthening before starting heavy algorithmic problem sets.';
    } else {
      classification = 'NEEDS_PRACTICE';
      badgeTitle = 'More Java Practice Recommended';
      summary =
        'Recommend spending additional time mastering core Java syntax, loops, arrays, OOP, and debugging before transitioning to Data Structures and Algorithms.';
    }

    const dsaTopicsReady: string[] = [];
    const dsaTopicsToImprove: string[] = [];

    for (const [topic, data] of Object.entries(assessment.topicScores)) {
      const ratio = data.total > 0 ? data.earned / data.total : 0;
      if (ratio >= 0.75) {
        dsaTopicsReady.push(topic);
      } else {
        dsaTopicsToImprove.push(topic);
      }
    }

    return {
      score: weightedDsaScore,
      classification,
      badgeTitle,
      summary,
      codingCompetencyPercentage: Math.round(codingPercentage),
      dsaTopicsReady,
      dsaTopicsToImprove,
    };
  }

  public static getWeaknessAnalysis(assessment: AssessmentRecord): {
    weakTopics: Array<{ topic: string; accuracy: number; count: number; advice: string }>;
    strongTopics: Array<{ topic: string; accuracy: number; count: number }>;
  } {
    const weakTopics: Array<{ topic: string; accuracy: number; count: number; advice: string }> = [];
    const strongTopics: Array<{ topic: string; accuracy: number; count: number }> = [];

    const adviceMap: Record<string, string> = {
      'Variables and Data Types': 'Review two\'s complement representation, primitive ranges, and implicit widening rules.',
      'Operators': 'Practice operator precedence, short-circuit boolean logic, and pre/post increment mechanics.',
      'Arrays': 'Focus on two-pointer patterns, boundary index checks, and in-place array transformations.',
      'Strings': 'Master String Constant Pool immutability versus StringBuilder mutable buffers.',
      'Classes and Objects': 'Review class loading order, static variables vs instance state, and memory allocation.',
      'Inheritance': 'Revisit dynamic method dispatch, method overriding rules, and super constructor chaining.',
      'Polymorphism': 'Practice casting object references and understanding runtime vtable method lookups.',
      'Collections Framework': 'Deep-dive into HashMap internal bucket trees, equals/hashCode contract, and ArrayList resizing.',
      'Streams API': 'Practice map-filter-reduce operations, Collector groupingBy, and lazy evaluation semantics.',
      'Multithreading': 'Understand the Java Memory Model, volatile visibility, synchronized intrinsic locks, and thread coordination.',
      'Generics': 'Study bounded wildcards and the PECS rule (Producer Extends, Consumer Super).',
    };

    for (const [topic, data] of Object.entries(assessment.topicScores)) {
      const accuracy = data.total > 0 ? Math.round((data.earned / data.total) * 100) : 0;
      if (accuracy < 60) {
        weakTopics.push({
          topic,
          accuracy,
          count: data.count,
          advice: adviceMap[topic] || 'Review fundamental concepts and implement hands-on code examples.',
        });
      } else {
        strongTopics.push({
          topic,
          accuracy,
          count: data.count,
        });
      }
    }

    return { weakTopics, strongTopics };
  }

  // ==========================================
  // ACHIEVEMENTS
  // ==========================================
  public static awardAchievement(userOrGuestToken: string, achievementId: string): void {
    if (!userOrGuestToken) return;
    if (!this.db.userAchievements[userOrGuestToken]) {
      this.db.userAchievements[userOrGuestToken] = [];
    }
    if (!this.db.userAchievements[userOrGuestToken].includes(achievementId)) {
      this.db.userAchievements[userOrGuestToken].push(achievementId);
      this.save();
    }
  }

  public static getUserAchievements(userOrGuestToken: string): Achievement[] {
    const ids = this.db.userAchievements[userOrGuestToken] || [];
    return ACHIEVEMENTS_LIST.map((ach) => ({
      ...ach,
      unlocked: ids.includes(ach.id),
    })) as any;
  }

  // ==========================================
  // MOCK INTERVIEW SESSIONS
  // ==========================================
  public static startInterviewSession(
    track: InterviewQuestion['track'],
    userId?: string,
    guestToken?: string
  ): InterviewSession {
    const questions = INTERVIEW_QUESTIONS_DATABASE.filter((q) => q.track === track || track === 'MIXED');
    const session: InterviewSession = {
      id: crypto.randomUUID(),
      userId,
      guestToken,
      track,
      currentQuestionIndex: 0,
      questions,
      responses: [],
      status: 'IN_PROGRESS',
      startedAt: new Date().toISOString(),
    };

    this.db.interviewSessions[session.id] = session;
    this.save();
    return session;
  }

  public static getInterviewSession(id: string): InterviewSession | null {
    return this.db.interviewSessions[id] || null;
  }

  public static submitInterviewResponse(
    sessionId: string,
    questionId: string,
    userResponse: string
  ): {
    score: number;
    feedback: string;
    modelAnswer: string;
    keyPoints: string[];
    isCompleted: boolean;
  } {
    const session = this.db.interviewSessions[sessionId];
    if (!session) throw new Error('Interview session not found');

    const currentQuestion = session.questions[session.currentQuestionIndex];
    if (!currentQuestion || currentQuestion.id !== questionId) {
      throw new Error('Invalid interview question in sequence.');
    }

    // Intelligent rubric evaluation matching key concepts
    let matchedCount = 0;
    const lowerResponse = userResponse.toLowerCase();

    for (const kp of currentQuestion.keyPoints) {
      // Check significant words
      const words = kp.toLowerCase().split(/\s+/).filter((w) => w.length > 3);
      const matches = words.filter((w) => lowerResponse.includes(w));
      if (matches.length >= Math.max(1, Math.floor(words.length * 0.4))) {
        matchedCount++;
      }
    }

    const totalKeyPoints = currentQuestion.keyPoints.length;
    const score = Math.max(3, Math.min(10, Math.round((matchedCount / totalKeyPoints) * 10)));

    let feedback = '';
    if (score >= 8) {
      feedback = 'Outstanding response! You demonstrated strong technical depth and hit all key architectural nuances.';
    } else if (score >= 5) {
      feedback = 'Solid explanation. You covered the main concepts, but review the model answer below for edge cases and precision.';
    } else {
      feedback = 'Adequate start, but missed several core architectural details. Carefully study the model answer and key points.';
    }

    session.responses.push({
      questionId,
      userResponse,
      score,
      feedback,
      submittedAt: new Date().toISOString(),
    });

    session.currentQuestionIndex++;
    const isCompleted = session.currentQuestionIndex >= session.questions.length;
    if (isCompleted) {
      session.status = 'COMPLETED';
      session.completedAt = new Date().toISOString();
    }

    this.save();

    return {
      score,
      feedback,
      modelAnswer: currentQuestion.modelAnswer,
      keyPoints: currentQuestion.keyPoints,
      isCompleted,
    };
  }
}

StorageService.initialize();
