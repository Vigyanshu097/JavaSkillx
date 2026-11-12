import React, { useState, useEffect } from 'react';
import { ApiService } from '../services/api.ts';
import { Layers, ArrowRight, CheckCircle2, RotateCcw } from 'lucide-react';

export const InterviewView: React.FC = () => {
  const [tracks, setTracks] = useState<any[]>([]);
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null);
  const [session, setSession] = useState<any>(null);
  const [currentQuestionData, setCurrentQuestionData] = useState<any>(null);
  const [userResponse, setUserResponse] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [evaluation, setEvaluation] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTracks();
  }, []);

  const loadTracks = async () => {
    try {
      const data = await ApiService.getInterviewTracks();
      setTracks(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleStartSession = async (trackId: string) => {
    setLoading(true);
    setSelectedTrack(trackId);
    setEvaluation(null);
    setUserResponse('');
    try {
      const sess = await ApiService.startInterview(trackId);
      setSession(sess);
      await loadCurrentQuestion(sess.id);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadCurrentQuestion = async (sessionId: string) => {
    try {
      const qData = await ApiService.getCurrentInterviewQuestion(sessionId);
      setCurrentQuestionData(qData);
      setUserResponse('');
      setEvaluation(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitResponse = async () => {
    if (!userResponse.trim() || !session || !currentQuestionData?.question) return;

    setSubmitting(true);
    try {
      const evalResult = await ApiService.submitInterviewResponse(
        session.id,
        currentQuestionData.question.id,
        userResponse
      );
      setEvaluation(evalResult);
    } catch (err: any) {
      alert(err.message || 'Failed to submit response');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = () => {
    if (evaluation?.isCompleted) {
      setCurrentQuestionData({ isCompleted: true });
    } else if (session) {
      loadCurrentQuestion(session.id);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-[#161B22] border border-[#21262D] rounded-xl mb-8">
        <div>
          <div className="text-xs font-mono text-cyan-400 mb-1">MOCK TECHNICAL INTERVIEW MODULE</div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Layers className="w-6 h-6 text-purple-400" />
            <span>Interactive Technical Interview Room</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Simulate realistic developer interviews with rubric-based instant feedback, model answers, and architectural key points.
          </p>
        </div>

        {selectedTrack && (
          <button
            onClick={() => {
              setSelectedTrack(null);
              setSession(null);
              setCurrentQuestionData(null);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-[#090D16] border border-[#30363D] rounded-lg transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Change Track</span>
          </button>
        )}
      </div>

      {/* Track Selector (if no session active) */}
      {!selectedTrack && (
        <div>
          <h2 className="text-sm font-bold text-white mb-4">Choose Interview Track:</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {tracks.map((t) => (
              <div
                key={t.id}
                onClick={() => handleStartSession(t.id)}
                className="p-5 bg-[#161B22] border border-[#21262D] hover:border-purple-500/50 rounded-xl cursor-pointer transition-all hover:-translate-y-0.5 group"
              >
                <div className="text-xs font-mono text-purple-400 mb-2 font-bold">
                  {t.questionCount} {t.questionCount === 1 ? 'Prompt' : 'Prompts'}
                </div>
                <h3 className="text-base font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                  {t.name}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {t.description}
                </p>
                <div className="text-xs font-semibold text-cyan-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Start Track</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Interview Session */}
      {selectedTrack && currentQuestionData && !currentQuestionData.isCompleted && (
        <div className="space-y-6 animate-fade-in">
          {/* Question Prompt Card */}
          <div className="p-6 bg-[#161B22] border border-[#21262D] rounded-xl shadow-sm">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-3 border-b border-[#21262D] mb-4">
              <span className="text-purple-400 font-bold uppercase tracking-wider">
                {currentQuestionData.question.track} Track
              </span>
              <span>
                Prompt {currentQuestionData.questionIndex} of {currentQuestionData.totalQuestions}
              </span>
            </div>

            <h2 className="text-lg font-bold text-white mb-3">
              {currentQuestionData.question.title}
            </h2>

            <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-line mb-6">
              {currentQuestionData.question.prompt}
            </p>

            {/* Rubric Criteria Checklist */}
            <div className="p-4 bg-[#090D16] border border-[#21262D] rounded-lg mb-6">
              <span className="text-xs font-mono text-cyan-400 font-bold block mb-2">
                Evaluation Rubric Checklist (Key Areas Expected):
              </span>
              <ul className="space-y-1.5 text-xs text-slate-400">
                {currentQuestionData.question.rubric.map((r: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-purple-400 font-mono">▸</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Answer Input */}
            {!evaluation && (
              <div>
                <label className="block text-xs font-mono font-medium text-slate-400 mb-2">
                  Your Technical Answer / Architectural Explanation:
                </label>
                <textarea
                  rows={8}
                  value={userResponse}
                  onChange={(e) => setUserResponse(e.target.value)}
                  placeholder="Provide your in-depth technical explanation, code scenarios, and rationale here..."
                  className="w-full p-4 text-xs font-mono bg-[#090D16] border border-[#30363D] focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-lg text-slate-100 outline-none leading-relaxed placeholder-slate-600"
                />

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={handleSubmitResponse}
                    disabled={submitting || !userResponse.trim()}
                    className="px-6 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-lg shadow-md transition-all disabled:opacity-50"
                  >
                    {submitting ? 'Evaluating Rubric...' : 'Submit Answer for Feedback'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Evaluation & Model Answer Drawer */}
          {evaluation && (
            <div className="p-6 bg-[#161B22] border border-[#21262D] rounded-xl shadow-xl animate-fade-in space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#21262D]">
                <div>
                  <div className="text-xs font-mono text-slate-400">RUBRIC SCORE</div>
                  <div className="text-2xl font-extrabold font-mono text-cyan-400 tabular-nums">
                    {evaluation.score} <span className="text-sm font-normal text-slate-500">/ 10</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">{evaluation.feedback}</p>
                </div>

                <button
                  onClick={handleNext}
                  className="px-6 py-2.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-lg shadow-md transition-all flex items-center gap-2"
                >
                  <span>{evaluation.isCompleted ? 'Complete Session' : 'Next Question'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Key Points Covered */}
              <div className="p-4 bg-[#090D16] border border-[#21262D] rounded-lg">
                <span className="text-xs font-mono text-purple-400 font-bold block mb-2">
                  Essential Architectural Points:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                  {evaluation.keyPoints.map((kp: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{kp}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Comprehensive Model Answer */}
              <div className="p-5 bg-[#090D16] border border-[#21262D] rounded-lg">
                <span className="text-xs font-mono text-cyan-400 font-bold block mb-2">
                  Authoritative Model Answer:
                </span>
                <div className="text-xs text-slate-300 whitespace-pre-line leading-relaxed font-mono">
                  {evaluation.modelAnswer}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Session Completed State */}
      {currentQuestionData?.isCompleted && (
        <div className="p-10 bg-[#161B22] border border-[#21262D] rounded-xl text-center max-w-xl mx-auto animate-fade-in">
          <div className="w-12 h-12 rounded-xl bg-purple-950/60 border border-purple-800/50 flex items-center justify-center text-purple-400 mx-auto mb-4">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Interview Session Completed</h2>
          <p className="text-xs text-slate-400 mb-6 leading-relaxed">
            Great practice session! You have worked through this track&apos;s architectural scenarios and compared your reasoning against the authoritative model solutions.
          </p>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => {
                setSelectedTrack(null);
                setCurrentQuestionData(null);
                setSession(null);
              }}
              className="px-5 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors"
            >
              Practice Another Track
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
