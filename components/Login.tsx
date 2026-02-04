import React, { useState } from 'react';
import { Layout, Lock } from 'lucide-react';

interface LoginProps {
  onLogin: (password: string) => Promise<boolean>;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const success = await onLogin(password);

    setIsLoading(false);
    if (!success) {
      setError('Invalid password. Please try again.');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="bg-slate-900 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-slate-800">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="bg-blue-600 p-3 rounded-xl">
            <Layout className="text-white" size={28} />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Gaming KPI Dashboard
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-400 mb-2">
              Enter Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter your password"
                autoFocus
              />
            </div>
          </div>

          {error && (
            <div className="text-rose-400 text-sm bg-rose-950/30 border border-rose-900/50 rounded-lg p-3">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors shadow-lg shadow-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Verifying...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-center text-slate-500 text-sm">
          Internal dashboard access only
        </p>
      </div>
    </div>
  );
};

export default Login;
