import React, { useState } from 'react';
import { ApiService, UserSession } from '../services/api.ts';
import { X, Lock, Mail, User, AlertCircle, CheckCircle2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: UserSession) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuthSuccess }) => {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (tab === 'register') {
        if (!email.includes('@')) throw new Error('Please enter a valid email address.');
        const user = await ApiService.register(username, email, password);
        setSuccess('Account created successfully!');
        setTimeout(() => {
          onAuthSuccess(user);
          onClose();
        }, 500);
      } else {
        const user = await ApiService.login(username, password);
        setSuccess('Logged in successfully!');
        setTimeout(() => {
          onAuthSuccess(user);
          onClose();
        }, 500);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-[#161B22] border border-[#30363D] rounded-xl shadow-2xl p-6 text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <h2 className="text-xl font-bold tracking-tight text-white">
            {tab === 'login' ? 'Sign In to JavaSkillX' : 'Create Free Account'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {tab === 'login'
              ? 'Access your saved progress, detailed DSA analysis, and badges.'
              : 'Save your 50-question assessment history and sync across devices.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#21262D] mb-5">
          <button
            type="button"
            onClick={() => {
              setTab('login');
              setError(null);
            }}
            className={`pb-2.5 px-4 text-xs font-semibold tracking-wide transition-colors border-b-2 ${
              tab === 'login'
                ? 'border-purple-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('register');
              setError(null);
            }}
            className={`pb-2.5 px-4 text-xs font-semibold tracking-wide transition-colors border-b-2 ${
              tab === 'register'
                ? 'border-purple-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Register
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 mb-4 text-xs text-rose-300 bg-rose-950/40 border border-rose-800/50 rounded-lg">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 p-3 mb-4 text-xs text-emerald-300 bg-emerald-950/40 border border-emerald-800/50 rounded-lg">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              {tab === 'login' ? 'Username or Email' : 'Username'}
            </label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={tab === 'login' ? 'e.g. dev_jane' : 'Choose a unique username'}
                className="w-full pl-9 pr-3 py-2 text-sm bg-[#090D16] border border-[#30363D] focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-lg text-slate-100 placeholder-slate-600 outline-none transition-colors"
              />
            </div>
          </div>

          {tab === 'register' && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-[#090D16] border border-[#30363D] focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-lg text-slate-100 placeholder-slate-600 outline-none transition-colors"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="•••••••• (min 6 characters)"
                className="w-full pl-9 pr-3 py-2 text-sm bg-[#090D16] border border-[#30363D] focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-lg text-slate-100 placeholder-slate-600 outline-none transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-lg shadow-md shadow-purple-900/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : tab === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-[#21262D] text-center">
          <p className="text-xs text-slate-500">
            Or continue in{' '}
            <button
              onClick={onClose}
              className="text-cyan-400 hover:underline font-medium"
            >
              Guest Mode
            </button>{' '}
            with automatic browser persistence.
          </p>
        </div>
      </div>
    </div>
  );
};
