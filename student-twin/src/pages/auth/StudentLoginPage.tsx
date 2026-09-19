import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../firebase/authContext';
import { GraduationCap, Lock, Mail, ArrowRight, AlertCircle, Sparkles, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';

export const StudentLoginPage: React.FC = () => {
  const { loginUser, loading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showTestAccounts, setShowTestAccounts] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!email || !password) {
      setErrorMessage('Please enter both your college email and password.');
      return;
    }

    setSubmitting(true);
    const result = await loginUser(email, password, 'student');
    setSubmitting(false);

    if (result.success) {
      navigate('/student/dashboard');
    } else {
      setErrorMessage(result.error || 'Authentication failed. Please verify credentials.');
    }
  };

  const handleQuickFill = (testEmail: string, testPass: string = 'Student@12345') => {
    setEmail(testEmail);
    setPassword(testPass);
    setErrorMessage('');
  };

  return (
    <div className="max-w-md mx-auto my-12 px-4">
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3 shadow-xs">
            <GraduationCap className="w-6 h-6" />
          </div>
          <span className="text-[11px] font-semibold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2.5 py-1 rounded-md">
            Student Twin Access
          </span>
          <h2 className="text-2xl font-black text-slate-900 mt-2">Student Portal Login</h2>
          <p className="text-xs text-slate-500 mt-1">
            Sign in to access your Career Twin, assessments, and readiness metrics
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Access Error</p>
              <p className="mt-0.5">{errorMessage}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">College Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                id="input-student-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student.alex@college.edu"
                className="w-full text-xs pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">Password</label>
              <Link to="/student-pending" className="text-[11px] text-indigo-600 hover:underline">
                Check Approval Status?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                id="input-student-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full text-xs pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition"
              />
            </div>
          </div>

          <button
            id="btn-student-submit"
            type="submit"
            disabled={submitting || loading}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-100 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {submitting ? 'Verifying Identity...' : 'Sign In as Student'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-600">
            Don't have an account?{' '}
            <Link to="/student-register" className="font-bold text-indigo-600 hover:underline">
              Register here
            </Link>
          </p>
        </div>

        {/* Quick Test Accounts Accordion */}
        <div className="mt-6 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setShowTestAccounts(!showTestAccounts)}
            className="w-full flex items-center justify-between text-xs text-slate-500 hover:text-slate-800 font-medium py-1"
          >
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              One-Click Test Accounts
            </span>
            {showTestAccounts ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showTestAccounts && (
            <div className="mt-3 space-y-2 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => handleQuickFill('student.alex@college.edu')}
                className="w-full text-left p-2 rounded-lg bg-white border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/40 transition"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800">Alex Varun</span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                    Approved (Score: 84)
                  </span>
                </div>
                <span className="text-[11px] text-slate-500">student.alex@college.edu</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('student.pending@college.edu')}
                className="w-full text-left p-2 rounded-lg bg-white border border-slate-200 hover:border-amber-400 hover:bg-amber-50/40 transition"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800">Priya Sundaram</span>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                    Pending Approval
                  </span>
                </div>
                <span className="text-[11px] text-slate-500">student.pending@college.edu</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
