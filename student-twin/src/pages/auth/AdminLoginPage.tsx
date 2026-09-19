import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../firebase/authContext';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
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
      setErrorMessage('Please enter your directorate email and master password.');
      return;
    }

    setSubmitting(true);
    const result = await loginUser(email, password, 'admin');
    setSubmitting(false);

    if (result.success) {
      navigate('/admin/dashboard');
    } else {
      setErrorMessage(result.error || 'Authentication failed. Please verify administrative credentials.');
    }
  };

  const handleQuickFill = () => {
    setEmail('admin@placement.edu');
    setPassword('Admin@12345');
    setErrorMessage('');
  };

  return (
    <div className="max-w-md mx-auto my-12 px-4">
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3 shadow-xs">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <span className="text-[11px] font-semibold text-rose-700 uppercase tracking-wider bg-rose-50 px-2.5 py-1 rounded-md">
            Placement Directorate
          </span>
          <h2 className="text-2xl font-black text-slate-900 mt-2">Directorate Administration</h2>
          <p className="text-xs text-slate-500 mt-1">
            Institutional management, faculty provisioning & campus placement governance
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Authorization Error</p>
              <p className="mt-0.5">{errorMessage}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Directorate Official Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                id="input-admin-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@placement.edu"
                className="w-full text-xs pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Master Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                id="input-admin-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full text-xs pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 outline-none transition"
              />
            </div>
          </div>

          <button
            id="btn-admin-submit"
            type="submit"
            disabled={submitting || loading}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md shadow-slate-200 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {submitting ? 'Verifying Directorate Token...' : 'Sign In as Administrator'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Admin accounts are securely pre-provisioned. Self-registration is permanently disabled for administrative portals.
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
              <Sparkles className="w-3.5 h-3.5 text-rose-500" />
              Pre-provisioned Admin Identity
            </span>
            {showTestAccounts ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showTestAccounts && (
            <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <button
                type="button"
                onClick={handleQuickFill}
                className="w-full text-left p-2 rounded-lg bg-white border border-slate-200 hover:border-rose-400 hover:bg-rose-50/40 transition"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800">Dr. Suresh Director</span>
                  <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded">
                    Placement Directorate
                  </span>
                </div>
                <span className="text-[11px] text-slate-500">admin@placement.edu</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
