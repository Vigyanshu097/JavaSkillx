import React, { useState, useEffect } from 'react';
import { SanitizedQuestion, UserAnswerRecord } from '../server/types.ts';
import { JavaCodeEditor } from './JavaCodeEditor.tsx';
import { ApiService } from '../services/api.ts';
import { CheckCircle2, XCircle, ArrowRight, HelpCircle, Code2, AlertCircle } from 'lucide-react';

interface AssessmentViewProps {
  assessmentId: string;
  onAssessmentCompleted: () => void;
  onOpenReviewGallery: () => void;
}

export const AssessmentView: React.FC<AssessmentViewProps> = ({
  assessmentId,
  onAssessmentCompleted,
  onOpenReviewGallery,
}) => {
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState<SanitizedQuestion | null>(null);
  const [questionIndex, setQuestionIndex] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(50);
  const [userAnswer, setUserAnswer] = useState('');
  const [codeAnswer, setCodeAnswer] = useState('');

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{
    answerRecord: UserAnswerRecord;
    questionExplanation: string;
    commonMistakes: string;
    takeaway: string;
    correctAnswerDisplay?: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Live code runner state
  const [isRunning, setIsRunning] = useState(false);
  const [runResult, setRunResult] = useState<any>(null);

  // Stage milestone alert
  const [stageMilestone, setStageMilestone] = useState<string | null>(null);

  // Timer
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  useEffect(() => {
    loadCurrentQuestion();
    const timer = setInterval(() => setSecondsElapsed((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, [assessmentId]);

  const loadCurrentQuestion = async () => {
    setLoading(true);
    setError(null);
    setSubmissionResult(null);
    setUserAnswer('');
    setRunResult(null);
    setSecondsElapsed(0);

    try {
      const data = await ApiService.getCurrentQuestion(assessmentId);
      if (data.isCompleted) {
        onAssessmentCompleted();
        return;
      }

      setCurrentQuestion(data.question);
      setQuestionIndex(data.currentQuestionIndex);
      setTotalQuestions(data.totalQuestions);

      if (data.question.category === 'CODING' || data.question.category === 'DEBUGGING') {
        setCodeAnswer(data.question.starterCode || '');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load question.');
    } finally {
      setLoading(false);
    }
  };

  const handleRunCode = async () => {
    if (!codeAnswer.trim()) return;
    setIsRunning(true);
    setRunResult(null);

    try {
      const input = currentQuestion?.sampleTestCases?.[0]?.input || '';
      const result = await ApiService.runCode(codeAnswer, input);
      setRunResult(result);
    } catch (err: any) {
      setRunResult({
        success: false,
        stage: 'RUNTIME',
        error: err.message || 'Execution failed.',
        output: '',
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!currentQuestion) return;

    let finalAnswer = userAnswer;
    if (currentQuestion.category === 'CODING' || currentQuestion.category === 'DEBUGGING') {
      finalAnswer = codeAnswer;
    }

    if (!finalAnswer || finalAnswer.trim() === '') {
      alert('Please provide an answer or write code before submitting.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const result = await ApiService.submitAnswer(
        assessmentId,
        currentQuestion.id,
        finalAnswer
      );
      setSubmissionResult(result);

      // Check stage milestone celebrations
      if (currentQuestion.id === 15) {
        setStageMilestone('Congratulations! You have conquered Stage 1 (Beginner) with 15 questions completed.');
      } else if (currentQuestion.id === 35) {
        setStageMilestone('Stage 2 Complete! You have mastered Intermediate OOP & Collections. Unlocking Stage 3: Advanced.');
      }
    } catch (err: any) {
      setError(err.message || 'Submission failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNextQuestion = () => {
    setStageMilestone(null);
    if (questionIndex >= 50) {
      onAssessmentCompleted();
    } else {
      loadCurrentQuestion();
    }
  };

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-20 text-center">
        <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-sm font-mono text-slate-400">Loading Question {questionIndex}...</p>
      </div>
    );
  }

  if (error && !currentQuestion) {
    return (
      <div className="max-w-xl mx-auto px-6 py-20 text-center">
        <div className="p-6 bg-rose-950/30 border border-rose-800/40 rounded-xl text-rose-300 mb-6">
          <AlertCircle className="w-8 h-8 mx-auto mb-2 text-rose-400" />
          <h2 className="text-lg font-bold mb-1">Failed to Load Question</h2>
          <p className="text-xs text-slate-400">{error}</p>
        </div>
        <button
          onClick={loadCurrentQuestion}
          className="px-5 py-2 text-xs font-semibold text-white bg-purple-600 rounded-lg hover:bg-purple-500 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!currentQuestion) return null;

  return (
    <div className="max-w-6xl mx-auto px-6 py-6 animate-fade-in">
      {/* Top Context & Progress Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-[#161B22] border border-[#21262D] rounded-xl mb-6">
        <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-400 font-mono">
          <span
            className={`font-bold ${
              currentQuestion.stage === 'BEGINNER'
                ? 'text-purple-400'
                : currentQuestion.stage === 'INTERMEDIATE'
                ? 'text-cyan-400'
                : 'text-indigo-400'
            }`}
          >
            {currentQuestion.stage}
          </span>
          <span className="text-slate-600">·</span>
          <span>{currentQuestion.topic}</span>
          <span className="text-slate-600">·</span>
          <span className="text-amber-400 font-bold">{currentQuestion.marks} Marks</span>
          <span className="text-slate-600">·</span>
          <span className="text-slate-400">{currentQuestion.category}</span>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-slate-400">
            <span className="text-slate-500">Timer:</span>
            <span className="tabular-nums font-bold text-slate-200">{formatTimer(secondsElapsed)}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500">Progress:</span>
            <span className="font-bold text-white tabular-nums">
              {questionIndex} <span className="text-slate-500 font-normal">/ {totalQuestions}</span>
            </span>
          </div>

          <button
            onClick={onOpenReviewGallery}
            className="text-[11px] text-cyan-400 hover:underline cursor-pointer"
          >
            Past Questions
          </button>
        </div>
      </div>

      {/* Stage Milestone Notification Banner */}
      {stageMilestone && (
        <div className="mb-6 p-4 bg-gradient-to-r from-purple-900/60 to-cyan-900/40 border border-purple-500/50 rounded-xl text-white text-xs flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2.5 font-medium">
            <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />
            <span>{stageMilestone}</span>
          </div>
          <button
            onClick={() => setStageMilestone(null)}
            className="text-slate-400 hover:text-white text-xs ml-4"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Assessment Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Question Prompt & Details (Width: 5 or 6 cols) */}
        <div className={`space-y-6 ${currentQuestion.category === 'CODING' || currentQuestion.category === 'DEBUGGING' ? 'lg:col-span-5' : 'lg:col-span-12'}`}>
          <div className="p-6 bg-[#161B22] border border-[#21262D] rounded-xl shadow-sm">
            <div className="text-xs font-mono text-slate-500 mb-1">
              QUESTION {questionIndex} OF 50
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white mb-3">
              {currentQuestion.title}
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line mb-4">
              {currentQuestion.prompt}
            </p>

            {/* Code Snippet if applicable */}
            {currentQuestion.codeSnippet && (
              <div className="mb-4">
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 mb-1">
                  <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Code Context:</span>
                </div>
                <pre className="p-3 bg-[#0D1117] border border-[#21262D] rounded-lg text-xs font-mono text-purple-200 overflow-x-auto leading-5 selection:bg-purple-500/30">
                  {currentQuestion.codeSnippet}
                </pre>
              </div>
            )}

            {/* Answer Input Area for Non-Coding Categories */}
            {currentQuestion.category !== 'CODING' && currentQuestion.category !== 'DEBUGGING' && !submissionResult && (
              <div className="mt-6 pt-6 border-t border-[#21262D]">
                {/* Options for MCQ / Error Detection */}
                {currentQuestion.options && currentQuestion.options.length > 0 ? (
                  <div className="space-y-3">
                    <label className="block text-xs font-mono font-medium text-slate-400 mb-2">
                      Select Your Answer:
                    </label>
                    {currentQuestion.options.map((opt, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setUserAnswer(opt)}
                        className={`w-full p-3 text-left rounded-lg border text-xs font-mono transition-all flex items-start gap-3 ${
                          userAnswer === opt
                            ? 'bg-purple-950/40 border-purple-500 text-purple-100 shadow-sm shadow-purple-950'
                            : 'bg-[#090D16] border-[#21262D] text-slate-300 hover:border-[#30363D]'
                        }`}
                      >
                        <span className="w-5 h-5 rounded-full border border-slate-600 flex items-center justify-center shrink-0 text-[10px] text-slate-400">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="leading-5">{opt}</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-mono font-medium text-slate-400 mb-2">
                      Enter Expected Output (exact console text):
                    </label>
                    <textarea
                      rows={3}
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="e.g. 19 7"
                      className="w-full p-3 text-xs font-mono bg-[#090D16] border border-[#30363D] focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-lg text-slate-100 outline-none placeholder-slate-600 leading-relaxed"
                    />
                  </div>
                )}

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={handleSubmit}
                    disabled={submitting || !userAnswer.trim()}
                    className="px-6 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-lg shadow-md shadow-purple-950 transition-all disabled:opacity-50"
                  >
                    {submitting ? 'Evaluating...' : 'Submit Answer'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Code Editor (if coding / debugging question) */}
        {(currentQuestion.category === 'CODING' || currentQuestion.category === 'DEBUGGING') && (
          <div className="lg:col-span-7 h-[600px]">
            <JavaCodeEditor
              code={codeAnswer}
              onChange={setCodeAnswer}
              starterCode={currentQuestion.starterCode}
              onRun={handleRunCode}
              onSubmit={handleSubmit}
              isRunning={isRunning}
              isSubmitting={submitting}
              runResult={runResult}
              sampleTestCases={currentQuestion.sampleTestCases}
            />
          </div>
        )}
      </div>

      {/* Post-Submission Explanation & Review Drawer */}
      {submissionResult && (
        <div className="mt-8 p-6 bg-[#161B22] border border-[#21262D] rounded-xl shadow-xl animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#21262D]">
            <div className="flex items-center gap-3">
              {submissionResult.answerRecord.isCorrect ? (
                <div className="w-10 h-10 rounded-xl bg-emerald-950/60 border border-emerald-700/50 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-xl bg-rose-950/60 border border-rose-700/50 flex items-center justify-center text-rose-400">
                  <XCircle className="w-6 h-6" />
                </div>
              )}
              <div>
                <h3 className="text-base font-bold text-white">
                  {submissionResult.answerRecord.isCorrect
                    ? 'Correct Answer!'
                    : submissionResult.answerRecord.marksAwarded > 0
                    ? 'Partially Correct'
                    : 'Incorrect Submission'}
                </h3>
                <p className="text-xs text-slate-400">
                  Awarded{' '}
                  <span className="font-mono font-bold text-cyan-400">
                    {submissionResult.answerRecord.marksAwarded} / {currentQuestion.marks} Marks
                  </span>
                  {' · '}
                  {submissionResult.answerRecord.feedback}
                </p>
              </div>
            </div>

            <button
              onClick={handleNextQuestion}
              className="px-6 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-lg shadow-md shadow-purple-950 transition-all flex items-center gap-2 whitespace-nowrap"
            >
              <span>{questionIndex >= 50 ? 'View Final Report' : 'Next Question'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Test Case results for coding questions */}
          {submissionResult.answerRecord.testResults && (
            <div className="mt-4 pt-4 border-b border-[#21262D]">
              <div className="text-xs font-mono font-bold text-slate-300 mb-2">Test Case Results:</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {submissionResult.answerRecord.testResults.map((tr, idx) => (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-lg border text-xs font-mono flex items-center justify-between ${
                      tr.passed
                        ? 'bg-emerald-950/30 border-emerald-800/40 text-emerald-300'
                        : 'bg-rose-950/30 border-rose-800/40 text-rose-300'
                    }`}
                  >
                    <span>{tr.isHidden ? `Hidden Case #${idx + 1}` : `Visible Case #${idx + 1}`}</span>
                    <span className="font-bold">{tr.passed ? 'PASSED' : 'FAILED'}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Explanation breakdown */}
          <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-4 bg-[#090D16] border border-[#21262D] rounded-lg">
              <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-400 font-bold mb-1.5">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Concept Explanation</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {submissionResult.questionExplanation}
              </p>
            </div>

            <div className="p-4 bg-[#090D16] border border-[#21262D] rounded-lg">
              <div className="flex items-center gap-1.5 text-xs font-mono text-rose-400 font-bold mb-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Common Mistakes</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {submissionResult.commonMistakes}
              </p>
            </div>

            <div className="p-4 bg-[#090D16] border border-[#21262D] rounded-lg">
              <div className="flex items-center gap-1.5 text-xs font-mono text-purple-400 font-bold mb-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Key Takeaway</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {submissionResult.takeaway}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
