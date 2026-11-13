import React, { useState, useEffect } from 'react';
import { ApiService } from '../services/api.ts';
import { Award, ArrowRight, RotateCcw, AlertTriangle, Lightbulb, BookOpen, Layers } from 'lucide-react';

interface ReportViewProps {
  assessmentId: string;
  onOpenReviewGallery: () => void;
  onStartInterview: () => void;
  onRestart: () => void;
}

export const ReportView: React.FC<ReportViewProps> = ({
  assessmentId,
  onOpenReviewGallery,
  onStartInterview,
  onRestart,
}) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReport();
  }, [assessmentId]);

  const loadReport = async () => {
    setLoading(true);
    try {
      const report = await ApiService.getReport(assessmentId);
      setData(report);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-sm font-mono text-slate-400">Synthesizing Diagnostic Performance Report...</p>
      </div>
    );
  }

  if (!data) return null;

  const { assessment, dsaReport, weaknessData } = data;
  const totalQuestions = 50;
  const answeredCount = Object.keys(assessment.answers).length;

  let correctCount = 0;
  let partialCount = 0;
  let incorrectCount = 0;

  Object.values(assessment.answers).forEach((a: any) => {
    if (a.isCorrect) correctCount++;
    else if (a.marksAwarded > 0) partialCount++;
    else incorrectCount++;
  });

  const accuracy = answeredCount > 0 ? Math.round((assessment.totalScore / (answeredCount * 2)) * 100) : 0;

  // Badge styling
  let badgeBorder = 'border-purple-500/50 bg-purple-950/20 text-purple-300';
  if (dsaReport.classification === 'STRONG_FOUNDATION') {
    badgeBorder = 'border-emerald-500/50 bg-emerald-950/20 text-emerald-300';
  } else if (dsaReport.classification === 'GOOD_FOUNDATION') {
    badgeBorder = 'border-cyan-500/50 bg-cyan-950/20 text-cyan-300';
  } else if (dsaReport.classification === 'DEVELOPING') {
    badgeBorder = 'border-amber-500/50 bg-amber-950/20 text-amber-300';
  } else {
    badgeBorder = 'border-rose-500/50 bg-rose-950/20 text-rose-300';
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 animate-fade-in">
      {/* Report Header */}
      <div className="p-8 bg-[#161B22] border border-[#21262D] rounded-xl mb-8 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-2">
              <Award className="w-4 h-4" />
              <span>Official Assessment Diagnostic Report</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              Java Proficiency &amp; DSA Readiness Scorecard
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              Deterministic evaluation based on real OpenJDK 17 execution, sequential answer verification, and multi-factor algorithmic competency modeling.
            </p>
          </div>

          <div className="flex flex-col items-center p-4 bg-[#090D16] border border-[#21262D] rounded-xl text-center min-w-[160px]">
            <span className="text-xs font-mono text-slate-500 mb-1">FINAL SCORE</span>
            <div className="text-4xl font-extrabold font-mono text-white tabular-nums">
              {assessment.totalScore}
              <span className="text-sm font-normal text-slate-500"> / 100</span>
            </div>
            <span className="text-xs font-mono text-purple-400 mt-1 font-semibold">
              {accuracy}% Accuracy
            </span>
          </div>
        </div>
      </div>

      {/* DSA Readiness Hero Card */}
      <div className={`p-6 rounded-xl border ${badgeBorder} mb-8 shadow-lg`}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-4">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider mb-1">
              DSA Readiness Classification
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              {dsaReport.badgeTitle}
            </h2>
            <div className="text-xs font-mono text-slate-400 mt-1">
              Algorithmic Benchmark Score:{' '}
              <span className="font-bold text-white tabular-nums">{dsaReport.score} / 100</span>
              {' · '}
              Coding Challenge Pass Rate:{' '}
              <span className="font-bold text-cyan-400 tabular-nums">
                {dsaReport.codingCompetencyPercentage}%
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onStartInterview}
              className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-lg shadow-sm transition-all flex items-center gap-1.5"
            >
              <Layers className="w-4 h-4" />
              <span>Practice Mock Interview</span>
            </button>
            <button
              onClick={onOpenReviewGallery}
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-[#161B22] border border-[#30363D] rounded-lg transition-colors flex items-center gap-1.5"
            >
              <BookOpen className="w-4 h-4" />
              <span>Review All Questions</span>
            </button>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed border-t border-slate-700/30 pt-3">
          {dsaReport.summary}
        </p>
      </div>

      {/* Breakdown Grid: Statistics & Stage Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Answer Breakdown */}
        <div className="p-6 bg-[#161B22] border border-[#21262D] rounded-xl">
          <h3 className="text-sm font-bold text-white mb-4">Answer Distribution</h3>
          <div className="grid grid-cols-3 gap-3 text-center mb-6">
            <div className="p-3 bg-[#090D16] border border-[#21262D] rounded-lg">
              <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
                {correctCount}
              </div>
              <div className="text-[11px] font-mono text-slate-400 mt-1">Correct</div>
            </div>

            <div className="p-3 bg-[#090D16] border border-[#21262D] rounded-lg">
              <div className="text-2xl font-bold font-mono text-cyan-400 tabular-nums">
                {partialCount}
              </div>
              <div className="text-[11px] font-mono text-slate-400 mt-1">Partial Marks</div>
            </div>

            <div className="p-3 bg-[#090D16] border border-[#21262D] rounded-lg">
              <div className="text-2xl font-bold font-mono text-rose-400 tabular-nums">
                {incorrectCount}
              </div>
              <div className="text-[11px] font-mono text-slate-400 mt-1">Incorrect</div>
            </div>
          </div>

          <div className="text-xs text-slate-400 space-y-2">
            <div className="flex justify-between py-1 border-b border-[#21262D]">
              <span>Total Questions Evaluated:</span>
              <span className="font-mono text-white">{answeredCount} / {totalQuestions}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#21262D]">
              <span>Marks Allocated per Question:</span>
              <span className="font-mono text-white">2.0 Marks</span>
            </div>
            <div className="flex justify-between py-1">
              <span>Overall Accuracy:</span>
              <span className="font-mono text-cyan-400 font-bold">{accuracy}%</span>
            </div>
          </div>
        </div>

        {/* Stage Performance */}
        <div className="p-6 bg-[#161B22] border border-[#21262D] rounded-xl">
          <h3 className="text-sm font-bold text-white mb-4">Stage-Wise Performance</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-purple-400 font-semibold">Stage 1: Beginner</span>
                <span className="text-white tabular-nums">
                  {assessment.stageScores.beginner} / 30 marks ({Math.round((assessment.stageScores.beginner / 30) * 100)}%)
                </span>
              </div>
              <div className="w-full bg-[#090D16] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-purple-500 h-full rounded-full"
                  style={{ width: `${(assessment.stageScores.beginner / 30) * 100}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-cyan-400 font-semibold">Stage 2: Intermediate</span>
                <span className="text-white tabular-nums">
                  {assessment.stageScores.intermediate} / 40 marks ({Math.round((assessment.stageScores.intermediate / 40) * 100)}%)
                </span>
              </div>
              <div className="w-full bg-[#090D16] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-cyan-500 h-full rounded-full"
                  style={{ width: `${(assessment.stageScores.intermediate / 40) * 100}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-indigo-400 font-semibold">Stage 3: Advanced</span>
                <span className="text-white tabular-nums">
                  {assessment.stageScores.advanced} / 30 marks ({Math.round((assessment.stageScores.advanced / 30) * 100)}%)
                </span>
              </div>
              <div className="w-full bg-[#090D16] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-500 h-full rounded-full"
                  style={{ width: `${(assessment.stageScores.advanced / 30) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Weakness Detection & Personalized Revision List */}
      <div className="p-6 bg-[#161B22] border border-[#21262D] rounded-xl mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-bold text-white">Targeted Weakness Detection &amp; Revision Plan</h3>
        </div>

        {weaknessData.weakTopics.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {weaknessData.weakTopics.map((item: any, idx: number) => (
              <div
                key={idx}
                className="p-4 bg-[#090D16] border border-amber-900/30 rounded-lg text-xs"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-white">{item.topic}</span>
                  <span className="font-mono text-rose-400 font-semibold">{item.accuracy}% Accuracy</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  <span className="text-amber-400 font-semibold">Study Recommendation: </span>
                  {item.advice}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-emerald-400 bg-emerald-950/20 p-3 rounded-lg border border-emerald-900/30">
            Outstanding mastery across all evaluated topics! You scored 60%+ in every individual topic.
          </p>
        )}
      </div>

      {/* Footer Controls */}
      <div className="flex items-center justify-between p-4 bg-[#161B22] border border-[#21262D] rounded-xl">
        <button
          onClick={onRestart}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-400 hover:text-rose-400 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Retake Assessment</span>
        </button>

        <button
          onClick={onOpenReviewGallery}
          className="px-5 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors flex items-center gap-1.5"
        >
          <span>Open Review Gallery</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
