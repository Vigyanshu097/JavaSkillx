import React, { useState, useEffect } from 'react';
import { ApiService } from '../services/api.ts';
import { CheckCircle2, XCircle, BookOpen, Code2, ArrowLeft } from 'lucide-react';

interface ReviewGalleryViewProps {
  assessmentId: string;
  onBackToAssessment: () => void;
}

export const ReviewGalleryView: React.FC<ReviewGalleryViewProps> = ({
  assessmentId,
  onBackToAssessment,
}) => {
  const [completedList, setCompletedList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStage, setFilterStage] = useState<'ALL' | 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'>('ALL');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'CORRECT' | 'INCORRECT'>('ALL');

  useEffect(() => {
    loadCompletedQuestions();
  }, [assessmentId]);

  const loadCompletedQuestions = async () => {
    setLoading(true);
    try {
      const data = await ApiService.getCompletedQuestions(assessmentId);
      setCompletedList(data);
    } catch {
      setCompletedList([]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = completedList.filter((item) => {
    if (filterStage !== 'ALL' && item.stage !== filterStage) return false;
    if (filterStatus === 'CORRECT' && !item.isCorrect) return false;
    if (filterStatus === 'INCORRECT' && item.isCorrect) return false;
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-[#161B22] border border-[#21262D] rounded-xl mb-8">
        <div>
          <button
            onClick={onBackToAssessment}
            className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400 hover:underline mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Assessment</span>
          </button>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-purple-400" />
            <span>Completed Questions Review Gallery</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Review your previously submitted answers, model solutions, test cases, and core takeaways.
          </p>
        </div>

        <div className="text-right">
          <div className="text-xs font-mono text-slate-400">Total Reviewed</div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">
            {completedList.length} <span className="text-xs text-slate-500 font-normal">/ 50</span>
          </div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-1 bg-[#161B22] p-1 rounded-lg border border-[#21262D]">
          {(['ALL', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED'] as const).map((stage) => (
            <button
              key={stage}
              onClick={() => setFilterStage(stage)}
              className={`px-3 py-1.5 text-xs font-mono font-medium rounded-md transition-colors ${
                filterStage === stage
                  ? 'bg-purple-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {stage === 'ALL' ? 'All Tiers' : stage}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 bg-[#161B22] p-1 rounded-lg border border-[#21262D]">
          {(['ALL', 'CORRECT', 'INCORRECT'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 text-xs font-mono font-medium rounded-md transition-colors ${
                filterStatus === status
                  ? 'bg-cyan-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {status === 'ALL' ? 'All Results' : status}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs font-mono text-slate-400">Loading gallery...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center bg-[#161B22] border border-[#21262D] rounded-xl text-slate-400">
          <BookOpen className="w-8 h-8 mx-auto mb-3 text-slate-600" />
          <p className="text-sm font-semibold text-slate-300">No completed questions match this filter.</p>
          <p className="text-xs text-slate-500 mt-1">
            Answer questions in the assessment to populate your review library.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-6 bg-[#161B22] border border-[#21262D] rounded-xl shadow-sm"
            >
              {/* Question Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#21262D] mb-4">
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="font-bold text-white">Q{item.id}.</span>
                  <span className="text-purple-400 font-semibold">{item.stage}</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-slate-400">{item.topic}</span>
                </div>

                <div className="flex items-center gap-2">
                  {item.isCorrect ? (
                    <span className="inline-flex items-center gap-1 text-xs font-mono font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-0.5 rounded">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Correct ({item.marksAwarded}/{item.marks})
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-mono font-semibold text-rose-400 bg-rose-950/40 border border-rose-800/40 px-2.5 py-0.5 rounded">
                      <XCircle className="w-3.5 h-3.5" /> {item.marksAwarded > 0 ? `Partial (${item.marksAwarded}/${item.marks})` : `0/${item.marks}`}
                    </span>
                  )}
                </div>
              </div>

              {/* Title & Prompt */}
              <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line mb-4">
                {item.prompt}
              </p>

              {/* Code Snippet if present */}
              {item.codeSnippet && (
                <div className="mb-4">
                  <pre className="p-3 bg-[#0D1117] border border-[#21262D] rounded-lg text-xs font-mono text-purple-200 overflow-x-auto leading-5">
                    {item.codeSnippet}
                  </pre>
                </div>
              )}

              {/* Submitted Answer vs Expected Answer */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="p-3 bg-[#090D16] border border-[#21262D] rounded-lg">
                  <div className="text-[11px] font-mono text-slate-500 mb-1">Your Submission:</div>
                  <pre className="text-xs font-mono text-slate-200 whitespace-pre-wrap">
                    {item.submittedAnswer}
                  </pre>
                </div>

                <div className="p-3 bg-[#090D16] border border-[#21262D] rounded-lg">
                  <div className="text-[11px] font-mono text-cyan-400 mb-1">Expected / Criteria:</div>
                  <pre className="text-xs font-mono text-cyan-200 whitespace-pre-wrap">
                    {item.expectedAnswer || 'Satisfies all test cases'}
                  </pre>
                </div>
              </div>

              {/* Explanation & Takeaway */}
              <div className="p-4 bg-[#0D1117] border border-[#21262D] rounded-lg text-xs text-slate-300 space-y-2">
                <div>
                  <span className="font-mono text-cyan-400 font-semibold">Explanation: </span>
                  <span>{item.explanation}</span>
                </div>
                <div>
                  <span className="font-mono text-purple-400 font-semibold">Key Takeaway: </span>
                  <span>{item.takeaway}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
