export type Difficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

export type QuestionCategory = 
  | 'MCQ' 
  | 'OUTPUT' 
  | 'ERROR_DETECTION' 
  | 'DEBUGGING' 
  | 'CODING' 
  | 'CONCEPTUAL';

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isHidden: boolean;
  explanation?: string;
}

export interface Question {
  id: number;
  stage: Difficulty;
  stageIndex: number; // 1 to 15, 1 to 20, 1 to 15
  category: QuestionCategory;
  topic: string;
  title: string;
  prompt: string;
  codeSnippet?: string;
  starterCode?: string;
  options?: string[]; // For MCQs
  expectedAnswer?: string; // Exact answer for MCQ / short output
  expectedOutput?: string; // For predict the output
  testCases?: TestCase[]; // For coding and debugging challenges
  marks: number; // 2 marks each
  hints?: string[];
  explanation: string;
  commonMistakes: string;
  takeaway: string;
}

export interface SanitizedQuestion {
  id: number;
  stage: Difficulty;
  stageIndex: number;
  category: QuestionCategory;
  topic: string;
  title: string;
  prompt: string;
  codeSnippet?: string;
  starterCode?: string;
  options?: string[];
  marks: number;
  hints?: string[];
  sampleTestCases?: Array<{ input: string; expectedOutput: string }>;
}

export interface UserAnswerRecord {
  questionId: number;
  submittedAnswer: string;
  isCorrect: boolean;
  marksAwarded: number;
  feedback: string;
  testResults?: Array<{
    testCaseId: string;
    passed: boolean;
    input: string;
    expected: string;
    actual: string;
    isHidden: boolean;
  }>;
  submittedAt: string;
}

export interface DsaReadinessReport {
  score: number; // 0 to 100
  classification: 'STRONG_FOUNDATION' | 'GOOD_FOUNDATION' | 'DEVELOPING' | 'NEEDS_PRACTICE';
  badgeTitle: string;
  summary: string;
  codingCompetencyPercentage: number;
  dsaTopicsReady: string[];
  dsaTopicsToImprove: string[];
}

export interface AssessmentRecord {
  id: string;
  userId?: string;
  guestToken?: string;
  status: 'IN_PROGRESS' | 'COMPLETED';
  currentQuestionIndex: number; // 1 to 50
  answers: Record<number, UserAnswerRecord>;
  totalScore: number; // 0 to 100
  stageScores: {
    beginner: number; // max 30 (15 * 2)
    intermediate: number; // max 40 (20 * 2)
    advanced: number; // max 30 (15 * 2)
  };
  topicScores: Record<string, { total: number; earned: number; count: number }>;
  dsaReadiness?: DsaReadinessReport;
  startedAt: string;
  lastActivityAt: string;
  completedAt?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  salt: string;
  createdAt: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'PROGRESS' | 'MASTERY' | 'CODING' | 'CONSISTENCY';
  icon: string;
}

export interface InterviewQuestion {
  id: string;
  track: 'FUNDAMENTALS' | 'OOP' | 'COLLECTIONS' | 'EXCEPTIONS' | 'CODING' | 'MIXED';
  title: string;
  prompt: string;
  codeSnippet?: string;
  rubric: string[];
  modelAnswer: string;
  keyPoints: string[];
}

export interface InterviewSession {
  id: string;
  userId?: string;
  guestToken?: string;
  track: 'FUNDAMENTALS' | 'OOP' | 'COLLECTIONS' | 'EXCEPTIONS' | 'CODING' | 'MIXED';
  currentQuestionIndex: number;
  questions: InterviewQuestion[];
  responses: Array<{
    questionId: string;
    userResponse: string;
    score: number; // 0 to 10
    feedback: string;
    submittedAt: string;
  }>;
  status: 'IN_PROGRESS' | 'COMPLETED';
  startedAt: string;
  completedAt?: string;
}
