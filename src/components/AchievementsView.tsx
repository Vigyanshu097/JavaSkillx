import React from 'react';
import { Achievement } from '../server/types.ts';
import { Award, CheckCircle2, Lock, Sparkles, Compass, Shield, Terminal, Bug, Boxes, Trophy, Flame } from 'lucide-react';

interface AchievementsViewProps {
  achievements: Achievement[];
  onStartAssessment: () => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Sparkles,
  Compass,
  Shield,
  Terminal,
  Bug,
  Boxes,
  Trophy,
  Flame,
};

export const AchievementsView: React.FC<AchievementsViewProps> = ({
  achievements,
  onStartAssessment,
}) => {
  const unlockedCount = achievements.filter((a: any) => a.unlocked).length;
  const percentage = Math.round((unlockedCount / achievements.length) * 100);

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-[#161B22] border border-[#21262D] rounded-xl mb-8">
        <div>
          <div className="text-xs font-mono text-purple-400 mb-1">RECOGNITION &amp; MILESTONES</div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Award className="w-6 h-6 text-purple-400" />
            <span>Developer Badges &amp; Achievements</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Badges are earned dynamically through sequential assessment progression, code challenge passes, and OOP mastery.
          </p>
        </div>

        <div className="text-right">
          <div className="text-xs font-mono text-slate-400">Total Unlocked</div>
          <div className="text-2xl font-bold font-mono text-cyan-400 tabular-nums">
            {unlockedCount} <span className="text-xs text-slate-500 font-normal">/ {achievements.length} ({percentage}%)</span>
          </div>
        </div>
      </div>

      {/* Grid of Badges */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {achievements.map((ach: any) => {
          const IconComponent = ICON_MAP[ach.icon] || Award;
          const isUnlocked = !!ach.unlocked;

          return (
            <div
              key={ach.id}
              className={`p-5 rounded-xl border transition-all flex flex-col justify-between ${
                isUnlocked
                  ? 'bg-[#161B22] border-purple-500/40 shadow-md shadow-purple-950/20'
                  : 'bg-[#090D16] border-[#21262D] opacity-60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      isUnlocked
                        ? 'bg-purple-950/60 border border-purple-700/50 text-cyan-400'
                        : 'bg-[#161B22] border border-[#21262D] text-slate-600'
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                  </div>

                  {isUnlocked ? (
                    <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 font-semibold bg-emerald-950/30 border border-emerald-800/40 px-2 py-0.5 rounded">
                      <CheckCircle2 className="w-3 h-3" /> Unlocked
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[11px] font-mono text-slate-500 bg-[#161B22] border border-[#21262D] px-2 py-0.5 rounded">
                      <Lock className="w-3 h-3" /> Locked
                    </span>
                  )}
                </div>

                <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider mb-1">
                  {ach.category}
                </div>
                <h3 className="text-base font-bold text-white mb-2">{ach.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {ach.description}
                </p>
              </div>

              <div className="text-[11px] font-mono text-purple-400/80">
                {isUnlocked ? 'Earned in assessment' : 'Complete prerequisite questions'}
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Footer */}
      <div className="p-6 bg-[#161B22] border border-[#21262D] rounded-xl text-center">
        <p className="text-xs text-slate-300 mb-3">
          Keep solving questions sequentially to unlock remaining badges and strengthen your DSA profile!
        </p>
        <button
          onClick={onStartAssessment}
          className="px-6 py-2.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-lg shadow-sm transition-colors"
        >
          Continue Assessment
        </button>
      </div>
    </div>
  );
};
