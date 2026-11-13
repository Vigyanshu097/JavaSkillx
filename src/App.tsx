import { useState, useEffect } from 'react';
import { ApiService, UserSession } from './services/api.ts';
import { AssessmentRecord, Achievement } from './server/types.ts';
import { Navbar } from './components/Navbar.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { LandingView } from './components/LandingView.tsx';
import { DashboardView } from './components/DashboardView.tsx';
import { AssessmentView } from './components/AssessmentView.tsx';
import { ReviewGalleryView } from './components/ReviewGalleryView.tsx';
import { ReportView } from './components/ReportView.tsx';
import { InterviewView } from './components/InterviewView.tsx';
import { AchievementsView } from './components/AchievementsView.tsx';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('landing');
  const [user, setUser] = useState<UserSession | null>(null);
  const [assessment, setAssessment] = useState<AssessmentRecord | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initApp();
  }, []);

  const initApp = async () => {
    setLoading(true);
    try {
      const { user: initialUser } = ApiService.initSession();
      setUser(initialUser);

      // Start or fetch active assessment
      const activeAssessment = await ApiService.startAssessment();
      setAssessment(activeAssessment);

      // If user has answered at least 1 question, land them on dashboard by default
      if (Object.keys(activeAssessment.answers || {}).length > 0) {
        setCurrentView('dashboard');
      }

      // Fetch achievements
      const achs = await ApiService.getAchievements();
      setAchievements(achs);
    } catch (err) {
      console.error('Failed to initialize app state:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshAssessment = async () => {
    if (!assessment) return;
    try {
      const updated = await ApiService.getAssessment(assessment.id);
      setAssessment(updated);
      const achs = await ApiService.getAchievements();
      setAchievements(achs);
    } catch (err) {
      console.error(err);
    }
  };

  const handleStartOrResume = () => {
    if (!assessment) return;
    if (assessment.status === 'COMPLETED') {
      setCurrentView('report');
    } else {
      setCurrentView('assessment');
    }
  };

  const handleRestart = async () => {
    if (!assessment) return;
    try {
      const restarted = await ApiService.restartAssessment(assessment.id);
      setAssessment(restarted);
      const achs = await ApiService.getAchievements();
      setAchievements(achs);
      setCurrentView('assessment');
    } catch (err) {
      console.error(err);
    }
  };

  const handleAuthSuccess = async (authUser: UserSession) => {
    setUser(authUser);
    // Refresh assessment to associate with user
    const updated = await ApiService.startAssessment();
    setAssessment(updated);
    const achs = await ApiService.getAchievements();
    setAchievements(achs);
    setCurrentView('dashboard');
  };

  const handleLogout = async () => {
    ApiService.logout();
    setUser(null);
    const updated = await ApiService.startAssessment();
    setAssessment(updated);
    setCurrentView('landing');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090D16] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm font-mono text-slate-400">Loading JavaSkillX...</p>
        </div>
      </div>
    );
  }

  const assessmentProgress = assessment
    ? {
        current: assessment.currentQuestionIndex,
        total: 50,
        score: assessment.totalScore,
      }
    : undefined;

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col font-sans selection:bg-purple-600/30 selection:text-purple-200">
      <Navbar
        currentView={currentView}
        onNavigate={(view) => {
          refreshAssessment();
          setCurrentView(view);
        }}
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        assessmentProgress={assessmentProgress}
      />

      <main className="flex-1">
        {currentView === 'landing' && (
          <LandingView
            onStart={handleStartOrResume}
            onOpenAuth={() => setIsAuthOpen(true)}
            isResumable={assessment ? Object.keys(assessment.answers).length > 0 : false}
          />
        )}

        {currentView === 'dashboard' && (
          <DashboardView
            assessment={assessment}
            achievements={achievements}
            onResume={handleStartOrResume}
            onRestart={handleRestart}
            onViewReport={() => setCurrentView('report')}
            onStartInterview={() => setCurrentView('interview')}
          />
        )}

        {currentView === 'assessment' && assessment && (
          <AssessmentView
            assessmentId={assessment.id}
            onAssessmentCompleted={() => {
              refreshAssessment();
              setCurrentView('report');
            }}
            onOpenReviewGallery={() => setCurrentView('review')}
          />
        )}

        {currentView === 'review' && assessment && (
          <ReviewGalleryView
            assessmentId={assessment.id}
            onBackToAssessment={() => setCurrentView('assessment')}
          />
        )}

        {currentView === 'report' && assessment && (
          <ReportView
            assessmentId={assessment.id}
            onOpenReviewGallery={() => setCurrentView('review')}
            onStartInterview={() => setCurrentView('interview')}
            onRestart={handleRestart}
          />
        )}

        {currentView === 'interview' && <InterviewView />}

        {currentView === 'achievements' && (
          <AchievementsView
            achievements={achievements}
            onStartAssessment={handleStartOrResume}
          />
        )}
      </main>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Clean, Non-slop Minimal Footer */}
      <footer className="border-t border-[#21262D] py-6 px-6 bg-[#090D16] text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="font-mono text-slate-400">
            JavaSkill<span className="text-cyan-400">X</span> · Java Programming Skill Assessment Platform
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            <span>50 Questions</span>
            <span>·</span>
            <span>OpenJDK 17 Execution</span>
            <span>·</span>
            <span>DSA Readiness</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
