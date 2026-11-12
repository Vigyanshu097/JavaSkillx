import express, { Request, Response } from 'express';
import * as path from 'path';
import * as crypto from 'crypto';
import dotenv from 'dotenv';
import { StorageService, ACHIEVEMENTS_LIST } from './src/server/storage.ts';
import { QUESTIONS_DATABASE, getSanitizedQuestion } from './src/server/questionsData.ts';
import { JavaRunnerService } from './src/server/javaRunner.ts';
import { INTERVIEW_QUESTIONS_DATABASE } from './src/server/interviewsData.ts';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 3000);
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '1mb' }));

// Helper to extract session context
function getSessionContext(req: Request): { userId?: string; guestToken?: string } {
  const userId = req.headers['x-user-id'] as string;
  const guestToken = req.headers['x-guest-token'] as string;
  return { userId, guestToken };
}

// ==========================================
// AUTHENTICATION ROUTES
// ==========================================
app.post('/api/auth/guest-init', (req: Request, res: Response) => {
  const incomingToken = req.body?.guestToken;
  if (incomingToken && typeof incomingToken === 'string') {
    return res.json({ guestToken: incomingToken });
  }
  const newToken = 'guest_' + crypto.randomUUID();
  res.json({ guestToken: newToken });
});

app.post('/api/auth/register', (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Username, email, and password are required.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
  }

  try {
    const user = StorageService.registerUser(username, email, password);
    res.json({
      user: { id: user.id, username: user.username, email: user.email },
      message: 'Registration successful!',
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { usernameOrEmail, password } = req.body;
  if (!usernameOrEmail || !password) {
    return res.status(400).json({ error: 'Username/email and password are required.' });
  }

  const user = StorageService.authenticateUser(usernameOrEmail, password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid username/email or password.' });
  }

  res.json({
    user: { id: user.id, username: user.username, email: user.email },
    message: 'Login successful!',
  });
});

app.get('/api/auth/me', (req: Request, res: Response) => {
  const { userId } = getSessionContext(req);
  if (!userId) {
    return res.json({ user: null });
  }
  const user = StorageService.getUserById(userId);
  if (!user) {
    return res.json({ user: null });
  }
  res.json({ user: { id: user.id, username: user.username, email: user.email } });
});

// ==========================================
// ASSESSMENT ENGINE ROUTES
// ==========================================
app.post('/api/assessments/start', (req: Request, res: Response) => {
  const { userId, guestToken } = getSessionContext(req);
  if (!userId && !guestToken) {
    return res.status(400).json({ error: 'Either userId or guestToken is required.' });
  }

  const assessment = StorageService.startOrGetAssessment(userId, guestToken);
  res.json({ assessment });
});

app.get('/api/assessments/:id', (req: Request, res: Response) => {
  const assessment = StorageService.getAssessmentById(req.params.id);
  if (!assessment) {
    return res.status(404).json({ error: 'Assessment not found.' });
  }
  res.json({ assessment });
});

app.get('/api/assessments/:id/current-question', (req: Request, res: Response) => {
  const assessment = StorageService.getAssessmentById(req.params.id);
  if (!assessment) {
    return res.status(404).json({ error: 'Assessment not found.' });
  }

  if (assessment.status === 'COMPLETED' || assessment.currentQuestionIndex > 50) {
    return res.json({
      isCompleted: true,
      currentQuestionIndex: 50,
      totalQuestions: 50,
    });
  }

  const question = QUESTIONS_DATABASE.find((q) => q.id === assessment.currentQuestionIndex);
  if (!question) {
    return res.status(404).json({ error: 'Question not found in database.' });
  }

  // Anti-leak: sanitize question so client never sees hidden answers, expected output, or explanations
  const sanitized = getSanitizedQuestion(question);
  res.json({
    isCompleted: false,
    question: sanitized,
    currentQuestionIndex: assessment.currentQuestionIndex,
    totalQuestions: 50,
  });
});

app.post('/api/assessments/:id/submit', async (req: Request, res: Response) => {
  const { questionId, submittedAnswer } = req.body;
  if (!questionId || submittedAnswer === undefined) {
    return res.status(400).json({ error: 'questionId and submittedAnswer are required.' });
  }

  try {
    const result = await StorageService.submitAnswer(
      req.params.id,
      Number(questionId),
      String(submittedAnswer)
    );
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/assessments/:id/completed-questions', (req: Request, res: Response) => {
  const assessment = StorageService.getAssessmentById(req.params.id);
  if (!assessment) {
    return res.status(404).json({ error: 'Assessment not found.' });
  }

  const completedList = Object.entries(assessment.answers)
    .map(([qIdStr, answerRecord]) => {
      const qId = Number(qIdStr);
      const question = QUESTIONS_DATABASE.find((q) => q.id === qId);
      if (!question) return null;
      return {
        id: question.id,
        stage: question.stage,
        stageIndex: question.stageIndex,
        category: question.category,
        topic: question.topic,
        title: question.title,
        prompt: question.prompt,
        codeSnippet: question.codeSnippet,
        marks: question.marks,
        submittedAnswer: answerRecord.submittedAnswer,
        isCorrect: answerRecord.isCorrect,
        marksAwarded: answerRecord.marksAwarded,
        feedback: answerRecord.feedback,
        testResults: answerRecord.testResults,
        explanation: question.explanation,
        commonMistakes: question.commonMistakes,
        takeaway: question.takeaway,
        expectedAnswer: question.expectedAnswer || question.expectedOutput,
      };
    })
    .filter(Boolean);

  res.json({ completedQuestions: completedList });
});

app.post('/api/assessments/:id/restart', (req: Request, res: Response) => {
  try {
    const restarted = StorageService.restartAssessment(req.params.id);
    res.json({ assessment: restarted, message: 'Assessment restarted from Question 1.' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/assessments/:id/report', (req: Request, res: Response) => {
  const assessment = StorageService.getAssessmentById(req.params.id);
  if (!assessment) {
    return res.status(404).json({ error: 'Assessment not found.' });
  }

  const dsaReport = StorageService.calculateDsaReadiness(assessment);
  const weaknessData = StorageService.getWeaknessAnalysis(assessment);

  res.json({
    assessment,
    dsaReport,
    weaknessData,
  });
});

// ==========================================
// CODE RUNNER ROUTE (Independent Sandbox)
// ==========================================
app.post('/api/code/run', async (req: Request, res: Response) => {
  const { code, input } = req.body;
  if (!code || typeof code !== 'string') {
    return res.status(400).json({ error: 'Java code string is required.' });
  }

  try {
    const runResult = await JavaRunnerService.runCode(code, input || '');
    res.json(runResult);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Execution failed.' });
  }
});

// ==========================================
// ACHIEVEMENTS ROUTES
// ==========================================
app.get('/api/achievements', (req: Request, res: Response) => {
  const { userId, guestToken } = getSessionContext(req);
  const userToken = userId || guestToken || '';
  const achievements = StorageService.getUserAchievements(userToken);
  res.json({ achievements });
});

// ==========================================
// MOCK TECHNICAL INTERVIEW ROUTES
// ==========================================
app.get('/api/interviews/tracks', (req: Request, res: Response) => {
  const tracks = [
    {
      id: 'FUNDAMENTALS',
      name: 'Java Fundamentals',
      description: 'Platform independence, JVM architecture, class loading, memory boundaries, and pass-by-value.',
      icon: 'Cpu',
      questionCount: 2,
    },
    {
      id: 'OOP',
      name: 'Object-Oriented Design',
      description: 'Polymorphism, abstraction vs interfaces, Liskov substitution, encapsulation, and inheritance.',
      icon: 'Boxes',
      questionCount: 2,
    },
    {
      id: 'COLLECTIONS',
      name: 'Collections Framework',
      description: 'HashMap bucket treeification, fail-fast iterators, rehashing, and equals/hashCode contract.',
      icon: 'Layers',
      questionCount: 1,
    },
    {
      id: 'EXCEPTIONS',
      name: 'Exception Architecture',
      description: 'Checked vs unchecked exceptions, anti-patterns, and try-with-resources lifecycle.',
      icon: 'AlertCircle',
      questionCount: 1,
    },
    {
      id: 'CODING',
      name: 'Coding & System Design',
      description: 'LRU cache design, thread-safe structures, and optimal time-space algorithmic trade-offs.',
      icon: 'Terminal',
      questionCount: 1,
    },
    {
      id: 'MIXED',
      name: 'Full Technical Interview',
      description: 'Comprehensive senior-style technical interview spanning JVM, GC algorithms, and design.',
      icon: 'Award',
      questionCount: 4,
    },
  ];
  res.json({ tracks });
});

app.post('/api/interviews/start', (req: Request, res: Response) => {
  const { track } = req.body;
  const { userId, guestToken } = getSessionContext(req);

  try {
    const session = StorageService.startInterviewSession(
      track || 'FUNDAMENTALS',
      userId,
      guestToken
    );
    res.json({ session });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/interviews/:sessionId/current', (req: Request, res: Response) => {
  const session = StorageService.getInterviewSession(req.params.sessionId);
  if (!session) {
    return res.status(404).json({ error: 'Interview session not found.' });
  }

  if (session.status === 'COMPLETED' || session.currentQuestionIndex >= session.questions.length) {
    return res.json({ isCompleted: true, session });
  }

  const currentQ = session.questions[session.currentQuestionIndex];
  res.json({
    isCompleted: false,
    questionIndex: session.currentQuestionIndex + 1,
    totalQuestions: session.questions.length,
    question: {
      id: currentQ.id,
      track: currentQ.track,
      title: currentQ.title,
      prompt: currentQ.prompt,
      codeSnippet: currentQ.codeSnippet,
      rubric: currentQ.rubric,
    },
  });
});

app.post('/api/interviews/:sessionId/submit', (req: Request, res: Response) => {
  const { questionId, response: userResponse } = req.body;
  if (!questionId || !userResponse) {
    return res.status(400).json({ error: 'questionId and response are required.' });
  }

  try {
    const evalResult = StorageService.submitInterviewResponse(
      req.params.sessionId,
      questionId,
      userResponse
    );
    res.json(evalResult);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// ==========================================
// STATIC ASSETS & VITE INTEGRATION
// ==========================================
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`JavaSkillX Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
