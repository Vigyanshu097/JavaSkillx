import React from 'react';
import { Terminal, ShieldCheck, Cpu, ArrowRight, Layers, CheckCircle2 } from 'lucide-react';

interface LandingViewProps {
  onStart: () => void;
  onOpenAuth: () => void;
  isResumable?: boolean;
}

export const LandingView: React.FC<LandingViewProps> = ({ onStart, onOpenAuth, isResumable }) => {
  return (
    <div className="min-h-screen py-12 px-6 max-w-7xl mx-auto flex flex-col justify-center">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 text-xs font-mono text-purple-400 mb-4 px-3 py-1 rounded-full bg-purple-950/40 border border-purple-800/40">
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span>50 Sequential Questions · OpenJDK 17 Sandbox · DSA Diagnostics</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight mb-6">
          Assess Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-400">Java Mastery</span> for DSA Readiness
        </h1>

        <p className="text-base sm:text-lg text-slate-400 leading-relaxed mb-8 max-w-2xl mx-auto">
          An interactive, 50-question sequential evaluation platform that tests your Java programming fundamentals, OOP design, Collections Framework, concurrency, and real coding ability.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onStart}
            className="w-full sm:w-auto px-8 py-3.5 text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl shadow-lg shadow-purple-900/30 transition-all flex items-center justify-center gap-2"
          >
            <span>{isResumable ? 'Resume Assessment' : 'Start Assessment (Guest Mode)'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenAuth}
            className="w-full sm:w-auto px-6 py-3.5 text-sm font-semibold text-slate-300 hover:text-white bg-[#161B22] hover:bg-[#21262D] border border-[#30363D] rounded-xl transition-colors"
          >
            Sign In to Save History
          </button>
        </div>

        <div className="mt-4 text-xs text-slate-500">
          No registration required to begin · Automatically saves progress across browser refreshes
        </div>
      </div>

      {/* 3-Stage Curriculum Grid */}
      <div className="mb-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-white tracking-tight">Structured 3-Stage Curriculum</h2>
          <p className="text-sm text-slate-400 mt-1">
            Questions must be completed sequentially — unlock each question as you prove your skills.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Stage 1: Beginner */}
          <div className="p-6 bg-[#161B22] border border-[#21262D] rounded-xl hover:border-purple-500/40 transition-all group">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-3">
              <span className="text-purple-400 font-semibold">STAGE 01</span>
              <span>15 Questions · 30 Marks</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
              Beginner Fundamentals
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Core primitives, memory sizing, operator precedence, conditional control flow, loops, arrays, String immutability, pass-by-value semantics, and foundational problem solving.
            </p>
            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Memory boundaries & type casting</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>String Pool vs Heap allocation</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Live coding: Anagrams & Array Reversals</span>
              </div>
            </div>
          </div>

          {/* Stage 2: Intermediate */}
          <div className="p-6 bg-[#161B22] border border-[#21262D] rounded-xl hover:border-cyan-500/40 transition-all group">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-3">
              <span className="text-cyan-400 font-semibold">STAGE 02</span>
              <span>20 Questions · 40 Marks</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
              Intermediate & OOP
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Classes, constructors, dynamic method dispatch, method hiding vs overriding, exception hierarchies, try-with-resources, Collections (ArrayList, HashMap, HashSet), and recursion.
            </p>
            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Polymorphism & Liskov Substitution</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>HashMap treeification & equals/hashCode</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Live coding: Two Sum & Custom Stack</span>
              </div>
            </div>
          </div>

          {/* Stage 3: Advanced */}
          <div className="p-6 bg-[#161B22] border border-[#21262D] rounded-xl hover:border-purple-500/40 transition-all group">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-3">
              <span className="text-purple-400 font-semibold">STAGE 03</span>
              <span>15 Questions · 30 Marks</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
              Advanced & JVM
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Generics wildcards (PECS), Streams API pipelines, multithreading, synchronization, memory model & volatile visibility, JVM memory layout, and complex algorithmic coding challenges.
            </p>
            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span>Streams lazy evaluation & Collectors</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span>Thread coordination & happen-before</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span>Live coding: Merge Intervals & Sliding Window</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Pillar Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8 border-t border-[#21262D]">
        <div className="flex items-start gap-4">
          <div className="p-2.5 rounded-lg bg-purple-950/50 border border-purple-800/40 shrink-0">
            <Cpu className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white mb-1">Real OpenJDK 17 Sandbox</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              No simulated results or keyword match hacks. Submissions are compiled with javac and executed in an isolated process sandbox with strict CPU, memory, and timeout bounds.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="p-2.5 rounded-lg bg-cyan-950/50 border border-cyan-800/40 shrink-0">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white mb-1">DSA Readiness Diagnostics</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Multi-factor assessment evaluates both conceptual knowledge and coding test-case completion to determine whether you are ready to transition into Data Structures & Algorithms.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="p-2.5 rounded-lg bg-indigo-950/50 border border-indigo-800/40 shrink-0">
            <Layers className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white mb-1">Mock Technical Interview</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Separate interview preparation room covering Java architecture, OOP design, Collections, and garbage collection algorithms with comprehensive model explanations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
