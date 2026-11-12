import React, { useState } from 'react';
import { AssessmentRecord, Achievement } from '../server/types.ts';
import { ArrowRight, RotateCcw, Award, CheckCircle2, TrendingUp, Layers, AlertTriangle } from 'lucide-react';

interface DashboardViewProps {
  assessment: AssessmentRecord | null;
  achievements: Achievement[];
  onResume: () => void;
  onRestart: () => void;
  onViewReport: () => void;
  onStartInterview: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  assessment,
  achievements,
  onResume,
  onRestart,
  onViewReport,
  onStartInterview,
}) => {
  const [showRestartModal, setShowRestartModal] = useState(false);

  const completedCount = assessment ? Object.keys(assessment.answers).length : 0;
  const totalQuestions = 50;
  const remainingCount = totalQuestions - completedCount;
  const currentScore = assessment ? assessment.totalScore : 0;
  const isCompleted = assessment?.status === 'COMPLETED' || completedCount >= 50;

  // Determine current stage
  let currentStage = 'Stage 1: Beginner';
  let stageColor = 'text-purple-400';
  if (completedCount >= 35) {
    currentStage = 'Stage 3: Advanced';
    stageColor = 'text-purple-400';
  } else if (completedCount >= 15) {
    currentStage = 'Stage 2: Intermediate';
    stageColor = 'text-cyan-400';
  }

  // DSA readiness preview calculation
  let dsaBadge = 'Evaluating Progress...';
  let dsaSubtext = 'Complete questions to establish baseline';
  if (completedCount > 10) {
    const accuracy = (currentScore / (completedCount * 2)) * 100;
    if (accuracy >= 80) {
      dsaBadge = 'On Track: Strong Foundation';
      dsaSubtext = `${Math.round(accuracy)}% accuracy across evaluated topics`;
    } else if (accuracy >= 60) {
      dsaBadge = 'On Track: Good Foundation';
      dsaSubtext = `${Math.round(accuracy)}% accuracy — keep practicing coding challenges`;
    } else {
      dsaBadge = 'Needs Targeted Practice';
      dsaSubtext = 'Focus on core syntax and OOP logic';
    }
  }

  const unlockedCount = achievements.filter((a: any) => a.unlocked).length;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-[#161B22] border border-[#21262D] rounded-xl mb-8 shadow-sm">
        <div>
          <div className="text-xs font-mono text-cyan-400 mb-1">CANDIDATE ASSESSMENT CONSOLE</div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Java Skill Assessment Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track your progress across 50 sequential challenges and benchmark your algorithmic DSA readiness.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isCompleted ? (
            <button
              onClick={onViewReport}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-lg shadow-md shadow-emerald-950 transition-all flex items-center gap-2"
            >
              <span>View Final Report</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onResume}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-lg shadow-md shadow-purple-950 transition-all flex items-center gap-2"
            >
              <span>Resume (Question {assessment ? assessment.currentQuestionIndex : 1})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => setShowRestartModal(true)}
            title="Restart assessment from scratch"
            className="p-2.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/20 border border-[#30363D] rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Primary KPI Metric Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {/* Metric 1: Overall Progress */}
        <div className="p-5 bg-[#161B22] border border-[#21262D] rounded-xl">
          <div className="text-xs font-medium text-slate-400 mb-1">Assessment Progress</div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono tabular-nums">
              {completedCount}
            </span>
            <span className="text-xs font-mono text-slate-500">/ 50 Questions</span>
          </div>
          <div className="w-full bg-[#090D16] h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-500 to-cyan-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${(completedCount / 50) * 100}%` }}
            ></div>
          </div>
          <div className="text-[11px] font-mono text-slate-500 mt-2">
            {remainingCount} questions remaining
          </div>
        </div>

        {/* Metric 2: Current Score */}
        <div className="p-5 bg-[#161B22] border border-[#21262D] rounded-xl">
          <div className="text-xs font-medium text-slate-400 mb-1">Total Marks Earned</div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono tabular-nums">
              {currentScore}
            </span>
            <span className="text-xs font-mono text-slate-500">/ 100 Max</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-3 font-mono">
            <span>Accuracy:</span>
            <span className="text-cyan-400 font-bold">
              {completedCount > 0 ? Math.round((currentScore / (completedCount * 2)) * 100) : 0}%
            </span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">2 marks per question</div>
        </div>

        {/* Metric 3: Current Stage */}
        <div className="p-5 bg-[#161B22] border border-[#21262D] rounded-xl">
          <div className="text-xs font-medium text-slate-400 mb-1">Current Tier</div>
          <div className={`text-xl font-bold font-mono ${stageColor} mt-1`}>
            {isCompleted ? 'All Stages Complete' : currentStage}
          </div>
          <div className="space-y-1 text-xs text-slate-400 mt-2">
            <div className="flex justify-between text-[11px]">
              <span>Stage 1 (1–15):</span>
              <span className="font-mono text-slate-300">
                {Math.min(15, completedCount)}/15
              </span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span>Stage 2 (16–35):</span>
              <span className="font-mono text-slate-300">
                {Math.max(0, Math.min(20, completedCount - 15))}/20
              </span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span>Stage 3 (36–50):</span>
              <span className="font-mono text-slate-300">
                {Math.max(0, completedCount - 35)}/15
              </span>
            </div>
          </div>
        </div>

        {/* Metric 4: DSA Readiness Indicator */}
        <div className="p-5 bg-[#161B22] border border-[#21262D] rounded-xl">
          <div className="text-xs font-medium text-slate-400 mb-1">DSA Readiness Projection</div>
          <div className="text-sm font-bold text-white mt-1 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <span>{dsaBadge}</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
            {dsaSubtext}
          </p>
          <div className="mt-2 text-[11px] font-mono text-purple-400">
            Weighted algorithm active
          </div>
        </div>
      </div>

      {/* Stage Breakdown Bars */}
      <div className="p-6 bg-[#161B22] border border-[#21262D] rounded-xl mb-8">
        <h3 className="text-sm font-bold text-white mb-4">Stage Completion Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Stage 1 Progress */}
          <div className="p-4 bg-[#090D16] border border-[#21262D] rounded-lg">
            <div className="flex justify-between text-xs font-mono text-slate-300 mb-2">
              <span className="font-bold text-purple-400">Stage 1: Beginner</span>
              <span>{Math.min(15, completedCount)} / 15</span>
            </div>
            <div className="w-full bg-[#161B22] h-2 rounded-full overflow-hidden">
              <div
                className="bg-purple-500 h-full rounded-full transition-all"
                style={{ width: `${(Math.min(15, completedCount) / 15) * 100}%` }}
              ></div>
            </div>
            <div className="text-[11px] text-slate-500 mt-2">
              Score: {assessment ? assessment.stageScores.beginner : 0} / 30 marks
            </div>
          </div>

          {/* Stage 2 Progress */}
          <div className="p-4 bg-[#090D16] border border-[#21262D] rounded-lg">
            <div className="flex justify-between text-xs font-mono text-slate-300 mb-2">
              <span className="font-bold text-cyan-400">Stage 2: Intermediate</span>
              <span>{Math.max(0, Math.min(20, completedCount - 15))} / 20</span>
            </div>
            <div className="w-full bg-[#161B22] h-2 rounded-full overflow-hidden">
              <div
                className="bg-cyan-500 h-full rounded-full transition-all"
                style={{
                  width: `${(Math.max(0, Math.min(20, completedCount - 15)) / 20) * 100}%`,
                }}
              ></div>
            </div>
            <div className="text-[11px] text-slate-500 mt-2">
              Score: {assessment ? assessment.stageScores.intermediate : 0} / 40 marks
            </div>
          </div>

          {/* Stage 3 Progress */}
          <div className="p-4 bg-[#090D16] border border-[#21262D] rounded-lg">
            <div className="flex justify-between text-xs font-mono text-slate-300 mb-2">
              <span className="font-bold text-purple-400">Stage 3: Advanced</span>
              <span>{Math.max(0, completedCount - 35)} / 15</span>
            </div>
            <div className="w-full bg-[#161B22] h-2 rounded-full overflow-hidden">
              <div
                className="bg-purple-400 h-full rounded-full transition-all"
                style={{ width: `${(Math.max(0, completedCount - 35) / 15) * 100}%` }}
              ></div>
            </div>
            <div className="text-[11px] text-slate-500 mt-2">
              Score: {assessment ? assessment.stageScores.advanced : 0} / 30 marks
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Grid: Achievements & Mock Interview Callout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Achievements Preview */}
        <div className="p-6 bg-[#161B22] border border-[#21262D] rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-bold text-white">Achievements & Badges</h3>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {unlockedCount} / {achievements.length} Unlocked
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {achievements.slice(0, 4).map((ach: any) => (
              <div
                key={ach.id}
                className={`p-3 rounded-lg border text-xs transition-all ${
                  ach.unlocked
                    ? 'bg-purple-950/20 border-purple-800/40 text-purple-200'
                    : 'bg-[#090D16] border-[#21262D] text-slate-500 opacity-60'
                }`}
              >
                <div className="font-semibold flex items-center gap-1.5 mb-1">
                  {ach.unlocked ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-full border border-slate-600 shrink-0"></div>
                  )}
                  <span className="truncate">{ach.title}</span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-tight">
                  {ach.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Mock Interview Teaser */}
        <div className="p-6 bg-gradient-to-br from-[#161B22] to-purple-950/30 border border-[#21262D] rounded-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 mb-2">
              <Layers className="w-4 h-4" />
              <span className="text-xs font-mono uppercase font-bold tracking-wider">
                Practice Module
              </span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Mock Technical Interview Suite</h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Prepare for senior developer screenings with authentic Java interview prompts covering JVM internals, OOP principles, Collections, and garbage collection tuning.
            </p>
          </div>

          <button
            onClick={onStartInterview}
            className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-[#090D16] hover:bg-[#21262D] border border-cyan-500/40 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <span>Launch Mock Interview Room</span>
            <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
          </button>
        </div>
      </div>

      {/* Confirmation Modal for Restart */}
      {showRestartModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="max-w-md w-full bg-[#161B22] border border-[#30363D] rounded-xl p-6 text-slate-100 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400 mb-3">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-lg font-bold">Restart Assessment?</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-6">
              This will reset your current progress back to Question 1 and clear your score. This action cannot be undone. Are you sure you wish to restart?
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowRestartModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-[#090D16] hover:bg-[#21262D] border border-[#30363D] rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowRestartModal(false);
                  onRestart();
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg shadow-sm transition-colors"
              >
                Yes, Restart From Question 1
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
