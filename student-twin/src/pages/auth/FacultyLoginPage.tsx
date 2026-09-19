import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../firebase/authContext';
import { Building2, Lock, Mail, ArrowRight, AlertCircle, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

export const FacultyLoginPage: React.FC = () => {
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
      setErrorMessage('Please enter your official faculty email and password.');
      return;
    }

    setSubmitting(true);
    const result = await loginUser(email, password, 'faculty');
    setSubmitting(false);

    if (result.success) {
      navigate('/faculty/dashboard');
    } else {
      setErrorMessage(result.error || 'Authentication failed. Please verify credentials.');
    }
  };

  const handleQuickFill = (testEmail: string, testPass: string = 'Faculty@12345') => {
    setEmail(testEmail);
    setPassword(testPass);
    setErrorMessage('');
  };

  return (
    <div className="max-w-md mx-auto my-12 px-4">
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3 shadow-xs">
            <Building2 className="w-6 h-6" />
          </div>
          <span className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider bg-amber-50 px-2.5 py-1 rounded-md">
            Faculty & HOD Mentorship
          </span>
          <h2 className="text-2xl font-black text-slate-900 mt-2">Faculty Portal Login</h2>
          <p className="text-xs text-slate-500 mt-1">
            Access assigned student cohorts, review registration requests & provide guidance
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
            <label className="block text-xs font-semibold text-slate-700 mb-1">Official Faculty Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                id="input-faculty-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="faculty.cs@college.edu"
                className="w-full text-xs pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                id="input-faculty-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full text-xs pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none transition"
              />
            </div>
          </div>

          <button
            id="btn-faculty-submit"
            type="submit"
            disabled={submitting || loading}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md shadow-amber-100 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {submitting ? 'Authenticating Faculty...' : 'Sign In as Faculty'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Faculty accounts are provisioned exclusively by the Placement Directorate / Administration. Public self-registration is strictly disabled.
          </p>
        </div>

        {/* Quick Test Accounts */}
        <div className="mt-6 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setShowTestAccounts(!showTestAccounts)}
            className="w-full flex items-center justify-between text-xs text-slate-500 hover:text-slate-800 font-medium py-1"
          >
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              Pre-provisioned Faculty Accounts
            </span>
            {showTestAccounts ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showTestAccounts && (
            <div className="mt-3 space-y-2 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => handleQuickFill('faculty.cs@college.edu')}
                className="w-full text-left p-2 rounded-lg bg-white border border-slate-200 hover:border-amber-400 hover:bg-amber-50/40 transition"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800">Prof. Ramesh Sharma</span>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                    CS HOD
                  </span>
                </div>
                <span className="text-[11px] text-slate-500">faculty.cs@college.edu</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('faculty.it@college.edu')}
                className="w-full text-left p-2 rounded-lg bg-white border border-slate-200 hover:border-amber-400 hover:bg-amber-50/40 transition"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800">Dr. Ananya Ray</span>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                    IT Coordinator
                  </span>
                </div>
                <span className="text-[11px] text-slate-500">faculty.it@college.edu</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
