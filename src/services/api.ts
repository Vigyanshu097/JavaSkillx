// Client API Service for JavaSkillX

const STORAGE_KEY_GUEST = 'javaskillx_guest_token';
const STORAGE_KEY_USER = 'javaskillx_user_session';

export interface UserSession {
  id: string;
  username: string;
  email: string;
}

export class ApiService {
  private static guestToken: string | null = null;
  private static userSession: UserSession | null = null;

  public static initSession(): { guestToken: string; user: UserSession | null } {
    // 1. Check user session
    const storedUser = localStorage.getItem(STORAGE_KEY_USER);
    if (storedUser) {
      try {
        this.userSession = JSON.parse(storedUser);
      } catch {
        this.userSession = null;
      }
    }

    // 2. Check guest token
    let gToken = localStorage.getItem(STORAGE_KEY_GUEST);
    if (!gToken) {
      gToken = 'guest_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
      localStorage.setItem(STORAGE_KEY_GUEST, gToken);
    }
    this.guestToken = gToken;

    return { guestToken: gToken, user: this.userSession };
  }

  public static getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (this.userSession?.id) {
      headers['x-user-id'] = this.userSession.id;
    }
    if (this.guestToken) {
      headers['x-guest-token'] = this.guestToken;
    }
    return headers;
  }

  public static setUserSession(user: UserSession | null) {
    this.userSession = user;
    if (user) {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY_USER);
    }
  }

  public static getUserSession(): UserSession | null {
    return this.userSession;
  }

  public static getGuestToken(): string {
    if (!this.guestToken) {
      this.initSession();
    }
    return this.guestToken!;
  }

  // --- Auth APIs ---
  public static async register(username: string, email: string, password: string) {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registration failed');
    this.setUserSession(data.user);
    return data.user;
  }

  public static async login(usernameOrEmail: string, password: string) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usernameOrEmail, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    this.setUserSession(data.user);
    return data.user;
  }

  public static logout() {
    this.setUserSession(null);
  }

  // --- Assessment APIs ---
  public static async startAssessment() {
    const res = await fetch('/api/assessments/start', {
      method: 'POST',
      headers: this.getHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to start assessment');
    return data.assessment;
  }

  public static async getAssessment(id: string) {
    const res = await fetch(`/api/assessments/${id}`, {
      headers: this.getHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch assessment');
    return data.assessment;
  }

  public static async getCurrentQuestion(id: string) {
    const res = await fetch(`/api/assessments/${id}/current-question`, {
      headers: this.getHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch question');
    return data;
  }

  public static async submitAnswer(id: string, questionId: number, submittedAnswer: string) {
    const res = await fetch(`/api/assessments/${id}/submit`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ questionId, submittedAnswer }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to submit answer');
    return data;
  }

  public static async getCompletedQuestions(id: string) {
    const res = await fetch(`/api/assessments/${id}/completed-questions`, {
      headers: this.getHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch completed questions');
    return data.completedQuestions;
  }

  public static async restartAssessment(id: string) {
    const res = await fetch(`/api/assessments/${id}/restart`, {
      method: 'POST',
      headers: this.getHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to restart assessment');
    return data.assessment;
  }

  public static async getReport(id: string) {
    const res = await fetch(`/api/assessments/${id}/report`, {
      headers: this.getHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to load report');
    return data;
  }

  // --- Code Runner ---
  public static async runCode(code: string, input = '') {
    const res = await fetch('/api/code/run', {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ code, input }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Execution failed');
    return data;
  }

  // --- Achievements ---
  public static async getAchievements() {
    const res = await fetch('/api/achievements', {
      headers: this.getHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to load achievements');
    return data.achievements;
  }

  // --- Mock Technical Interviews ---
  public static async getInterviewTracks() {
    const res = await fetch('/api/interviews/tracks', {
      headers: this.getHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to load tracks');
    return data.tracks;
  }

  public static async startInterview(track: string) {
    const res = await fetch('/api/interviews/start', {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ track }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to start interview');
    return data.session;
  }

  public static async getCurrentInterviewQuestion(sessionId: string) {
    const res = await fetch(`/api/interviews/${sessionId}/current`, {
      headers: this.getHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch interview question');
    return data;
  }

  public static async submitInterviewResponse(sessionId: string, questionId: string, response: string) {
    const res = await fetch(`/api/interviews/${sessionId}/submit`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ questionId, response }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to submit interview response');
    return data;
  }
}
