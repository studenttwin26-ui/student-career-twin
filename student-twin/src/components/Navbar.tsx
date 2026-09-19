import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../firebase/authContext';
import { FirebaseConfigModal } from './FirebaseConfigModal';
import { 
  Sparkles, 
  LogOut, 
  User, 
  ShieldCheck, 
  GraduationCap, 
  Building2, 
  Database,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentUser, studentProfile, logout, isFirebaseActive } = useAuth();
  const navigate = useNavigate();
  const [showConfigModal, setShowConfigModal] = useState(false);

  const handleLogout = async () => {
    const role = currentUser?.role;
    await logout();
    if (role === 'admin') navigate('/admin-login');
    else if (role === 'faculty') navigate('/faculty-login');
    else navigate('/student-login');
  };

  const getRoleBadge = () => {
    if (!currentUser) return null;
    switch (currentUser.role) {
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <ShieldCheck className="w-3.5 h-3.5" /> Placement Admin
          </span>
        );
      case 'faculty':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Building2 className="w-3.5 h-3.5" /> Faculty / HOD
          </span>
        );
      case 'student':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <GraduationCap className="w-3.5 h-3.5" /> Student ({studentProfile?.status || 'Active'})
          </span>
        );
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 tracking-tight text-lg">Student Twin</span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-slate-100 text-slate-600 rounded-md border border-slate-200">
                  Career Intelligence
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium -mt-0.5">Your Future, Smarter</p>
            </div>
          </Link>

          {/* Right Action Bar */}
          <div className="flex items-center gap-3">
            {/* Firebase Connection Pill */}
            <button
              id="btn-firebase-settings"
              onClick={() => setShowConfigModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition cursor-pointer"
              title="Configure external Firebase project"
            >
              <Database className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden md:inline">Firebase:</span>
              {isFirebaseActive ? (
                <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                  <CheckCircle2 className="w-3 h-3" /> Live
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-amber-600 font-semibold">
                  <AlertCircle className="w-3 h-3" /> Ready
                </span>
              )}
            </button>

            {currentUser ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200">
                  {getRoleBadge()}
                  <div className="text-right">
                    <p className="text-xs font-semibold text-slate-900 leading-tight">{currentUser.fullName}</p>
                    <p className="text-[11px] text-slate-500 truncate max-w-[150px]">{currentUser.email}</p>
                  </div>
                </div>

                <button
                  id="btn-logout"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/student-login"
                  className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition"
                >
                  Student Login
                </Link>
                <Link
                  to="/student-register"
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Modal */}
      <FirebaseConfigModal isOpen={showConfigModal} onClose={() => setShowConfigModal(false)} />
    </>
  );
};
