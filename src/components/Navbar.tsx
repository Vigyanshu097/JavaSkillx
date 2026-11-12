import React from 'react';
import { UserSession } from '../services/api.ts';
import { Terminal, Award, BookOpen, Layers, User, LogOut } from 'lucide-react';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  user: UserSession | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  assessmentProgress?: { current: number; total: number; score: number };
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  user,
  onOpenAuth,
  onLogout,
  assessmentProgress,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#21262D] bg-[#090D16]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-6 py-3.5">
        {/* Zone 1: Single Brand Wordmark with subtle tag */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2.5 text-left group transition-transform focus:outline-none"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Terminal className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-lg font-extrabold tracking-tight text-white group-hover:text-purple-300 transition-colors">
                JavaSkill<span className="text-cyan-400">X</span>
              </span>
            </div>
          </button>

          <span className="hidden sm:inline-block text-xs font-mono text-slate-500 border border-[#21262D] px-2 py-0.5 rounded bg-[#161B22]">
            {user ? user.username : 'Guest Mode'}
          </span>
        </div>

        {/* Zone 2: 4-5 Clean Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
          <button
            onClick={() => onNavigate('dashboard')}
            className={`whitespace-nowrap transition-colors hover:text-white ${
              currentView === 'dashboard' ? 'text-cyan-400 font-semibold' : ''
            }`}
          >
            Dashboard
          </button>

          <button
            onClick={() => onNavigate('assessment')}
            className={`whitespace-nowrap transition-colors hover:text-white flex items-center gap-1.5 ${
              currentView === 'assessment' ? 'text-cyan-400 font-semibold' : ''
            }`}
          >
            <span>Assessment</span>
            {assessmentProgress && assessmentProgress.current > 1 && (
              <span className="text-[11px] font-mono text-purple-400 bg-purple-950/60 border border-purple-800/40 px-1.5 py-0.2 rounded">
                Q{assessmentProgress.current}/50
              </span>
            )}
          </button>

          <button
            onClick={() => onNavigate('review')}
            className={`whitespace-nowrap transition-colors hover:text-white flex items-center gap-1 ${
              currentView === 'review' ? 'text-cyan-400 font-semibold' : ''
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Review Gallery</span>
          </button>

          <button
            onClick={() => onNavigate('interview')}
            className={`whitespace-nowrap transition-colors hover:text-white flex items-center gap-1 ${
              currentView === 'interview' ? 'text-cyan-400 font-semibold' : ''
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Mock Interview</span>
          </button>

          <button
            onClick={() => onNavigate('achievements')}
            className={`whitespace-nowrap transition-colors hover:text-white flex items-center gap-1 ${
              currentView === 'achievements' ? 'text-cyan-400 font-semibold' : ''
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Badges</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action & Profile */}
        <div className="flex items-center gap-3 shrink-0">
          {user ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#161B22] border border-[#21262D] text-xs font-mono text-slate-300">
                <User className="w-3.5 h-3.5 text-purple-400" />
                <span className="truncate max-w-[120px]">{user.username}</span>
              </div>
              <button
                onClick={onLogout}
                title="Log Out"
                className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors rounded-md hover:bg-rose-500/10"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-200 hover:text-white bg-[#161B22] hover:bg-[#21262D] border border-[#30363D] rounded-lg transition-colors whitespace-nowrap"
            >
              Sign In / Register
            </button>
          )}

          <button
            onClick={() => onNavigate('assessment')}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-lg shadow-sm shadow-purple-900/30 transition-all whitespace-nowrap"
          >
            {assessmentProgress && assessmentProgress.current > 1 ? 'Resume' : 'Start'}
          </button>
        </div>
      </div>
    </header>
  );
};
