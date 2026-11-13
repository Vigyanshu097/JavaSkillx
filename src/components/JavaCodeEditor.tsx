import React, { useState, useRef, useEffect } from 'react';
import { Play, RotateCcw, Copy, Check, Terminal, Clock, CheckCircle2, XCircle } from 'lucide-react';

interface JavaCodeEditorProps {
  code: string;
  onChange: (newCode: string) => void;
  starterCode?: string;
  onRun: () => void;
  onSubmit: () => void;
  isRunning: boolean;
  isSubmitting: boolean;
  runResult?: {
    success: boolean;
    stage: 'COMPILATION' | 'RUNTIME' | 'COMPLETED';
    error?: string;
    output: string;
    executionTimeMs?: number;
  } | null;
  sampleTestCases?: Array<{ input: string; expectedOutput: string }>;
}

export const JavaCodeEditor: React.FC<JavaCodeEditorProps> = ({
  code,
  onChange,
  starterCode,
  onRun,
  onSubmit,
  isRunning,
  isSubmitting,
  runResult,
  sampleTestCases,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'console' | 'sampleTests'>('console');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Line count calculation
  const lines = code.split('\n');

  // Handle Tab key for clean 4-space indent
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      const updated = code.substring(0, start) + '    ' + code.substring(end);
      onChange(updated);

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 4;
      }, 0);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    if (starterCode && window.confirm('Reset code to initial starter template?')) {
      onChange(starterCode);
    }
  };

  useEffect(() => {
    if (runResult) {
      setActiveTab('console');
    }
  }, [runResult]);

  return (
    <div className="flex flex-col h-full bg-[#0D1117] border border-[#21262D] rounded-xl overflow-hidden shadow-xl">
      {/* Editor Header Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#161B22] border-b border-[#21262D] select-none">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-mono font-medium text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500/80"></span>
            <span>Solution.java</span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-400">OpenJDK 17</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {starterCode && (
            <button
              onClick={handleReset}
              title="Reset to starter boilerplate"
              className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-400 hover:text-white hover:bg-[#21262D] rounded transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}

          <button
            onClick={handleCopy}
            title="Copy code"
            className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-400 hover:text-white hover:bg-[#21262D] rounded transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Editor Body: Line numbers + Textarea */}
      <div className="relative flex-1 min-h-[320px] flex bg-[#0D1117] overflow-hidden">
        {/* Line Numbers Column */}
        <div className="w-12 py-3 bg-[#090D16] border-r border-[#21262D] text-right pr-3 select-none text-xs font-mono text-slate-600 overflow-hidden">
          {lines.map((_, i) => (
            <div key={i} className="leading-6">
              {i + 1}
            </div>
          ))}
        </div>

        {/* Code Input Area */}
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          className="flex-1 p-3 bg-transparent text-slate-100 font-mono text-xs sm:text-sm leading-6 outline-none resize-none overflow-y-auto whitespace-pre selection:bg-purple-600/30 selection:text-purple-200"
          placeholder="// Write your Java solution here..."
        />
      </div>

      {/* Bottom Action Strip */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#161B22] border-t border-[#21262D]">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('console')}
            className={`px-2.5 py-1 text-xs font-mono rounded transition-colors flex items-center gap-1.5 ${
              activeTab === 'console'
                ? 'bg-[#21262D] text-cyan-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Sandbox Console</span>
          </button>

          {sampleTestCases && sampleTestCases.length > 0 && (
            <button
              type="button"
              onClick={() => setActiveTab('sampleTests')}
              className={`px-2.5 py-1 text-xs font-mono rounded transition-colors ${
                activeTab === 'sampleTests'
                  ? 'bg-[#21262D] text-cyan-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sample Tests ({sampleTestCases.length})
            </button>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onRun}
            disabled={isRunning || isSubmitting}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-cyan-200 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-800/60 rounded-lg transition-all disabled:opacity-50"
          >
            <Play className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
            <span>{isRunning ? 'Compiling...' : 'Run Code'}</span>
          </button>

          <button
            onClick={onSubmit}
            disabled={isSubmitting || isRunning}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-lg shadow-sm shadow-purple-900/30 transition-all disabled:opacity-50"
          >
            <span>{isSubmitting ? 'Evaluating...' : 'Submit Answer'}</span>
          </button>
        </div>
      </div>

      {/* Console & Test Cases Drawer */}
      <div className="bg-[#090D16] border-t border-[#21262D] p-3 text-xs font-mono max-h-48 overflow-y-auto">
        {activeTab === 'console' ? (
          <div>
            {runResult ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400 pb-1 border-b border-[#21262D]">
                  <div className="flex items-center gap-2">
                    {runResult.success ? (
                      <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Execution Successful
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-rose-400 font-semibold">
                        <XCircle className="w-3.5 h-3.5" /> {runResult.stage} Error
                      </span>
                    )}
                  </div>
                  {runResult.executionTimeMs !== undefined && (
                    <span className="flex items-center gap-1 text-slate-500">
                      <Clock className="w-3 h-3" /> {runResult.executionTimeMs}ms
                    </span>
                  )}
                </div>

                {runResult.error ? (
                  <pre className="text-rose-300 bg-rose-950/30 border border-rose-900/40 p-2.5 rounded whitespace-pre-wrap">
                    {runResult.error}
                  </pre>
                ) : (
                  <div>
                    <span className="text-slate-500 text-[11px]">Program Output:</span>
                    <pre className="text-emerald-300 p-2 bg-[#161B22] rounded mt-1 whitespace-pre-wrap">
                      {runResult.output || '(No output printed to standard out)'}
                    </pre>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-slate-500 italic">
                Click &quot;Run Code&quot; to compile and execute your Java code in the isolated OpenJDK 17 sandbox.
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {sampleTestCases &&
              sampleTestCases.map((tc, idx) => (
                <div key={idx} className="p-2 bg-[#161B22] border border-[#21262D] rounded">
                  <div className="text-[11px] text-slate-400 font-semibold mb-1">
                    Sample Case #{idx + 1}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-slate-500">Input:</span>
                      <pre className="text-slate-300 bg-[#090D16] p-1.5 rounded mt-0.5 whitespace-pre-wrap">
                        {tc.input.trim()}
                      </pre>
                    </div>
                    <div>
                      <span className="text-slate-500">Expected Output:</span>
                      <pre className="text-cyan-300 bg-[#090D16] p-1.5 rounded mt-0.5 whitespace-pre-wrap">
                        {tc.expectedOutput.trim()}
                      </pre>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};
