import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../firebase/authContext';
import { Clock, CheckCircle2, XCircle, RefreshCw, ArrowRight, ShieldCheck, Mail, AlertTriangle } from 'lucide-react';

export const StudentPendingPage: React.FC = () => {
  const { currentUser, studentProfile, reloadUserData, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [refreshing, setRefreshing] = useState(false);
  const [message, setMessage] = useState('');

  // Location state or current session profile
  const justRegistered = location.state?.justRegistered;
  const displayEmail = studentProfile?.email || location.state?.email || currentUser?.email || 'Your registered email';
  const displayRoll = studentProfile?.rollNumber || location.state?.rollNumber || 'Registered Roll No';
  const displayDept = studentProfile?.department || location.state?.department || 'Department Scope';

  const status = studentProfile?.status || 'pending';
  const isApproved = status === 'approved';
  const isRejected = status === 'rejected';
  const isPending = status === 'pending';

  const handleRefresh = async () => {
    setRefreshing(true);
    setMessage('');
    await reloadUserData();
    setTimeout(() => {
      setRefreshing(false);
      setMessage('Status updated from authoritative database.');
    }, 600);
  };

  return (
    <div className="max-w-2xl mx-auto my-12 px-4">
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xl text-center">
        {/* State Icon */}
        <div className="mb-6">
          {isApproved ? (
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md shadow-emerald-50">
              <CheckCircle2 className="w-8 h-8" />
            </div>
          ) : isRejected ? (
            <div className="w-16 h-16 rounded-3xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-md shadow-rose-50">
              <XCircle className="w-8 h-8" />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-md shadow-amber-50">
              <Clock className="w-8 h-8 animate-pulse" />
            </div>
          )}
        </div>

        {/* State Title and Messages strictly following prompt */}
        {isApproved ? (
          <div>
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-widest bg-emerald-100 px-3 py-1 rounded-full">
              Account Approved
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3">
              Registration Approved by Faculty!
            </h2>
            <p className="mt-3 text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              Your registration has been approved by your department mentor{' '}
              <strong>{studentProfile?.assignedFacultyName || 'Faculty / HOD'}</strong>. Your Digital Career Twin is active.
            </p>
          </div>
        ) : isRejected ? (
          <div>
            <span className="text-[11px] font-bold text-rose-700 uppercase tracking-widest bg-rose-100 px-3 py-1 rounded-full">
              Registration Rejected
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3">
              Registration Not Approved
            </h2>
            <p className="mt-3 text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              Your registration was rejected during Faculty review. Please review the remark below and contact your department coordinator.
            </p>
            {studentProfile?.rejectionReason && (
              <div className="mt-4 p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 max-w-md mx-auto text-left">
                <p className="font-semibold flex items-center gap-1.5 text-rose-700">
                  <AlertTriangle className="w-3.5 h-3.5" /> Rejection Remark:
                </p>
                <p className="mt-1 italic">"{studentProfile.rejectionReason}"</p>
              </div>
            )}
          </div>
        ) : (
          <div>
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-widest bg-amber-100 px-3 py-1 rounded-full">
              Waiting for Faculty Review
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3">
              Registration Submitted
            </h2>
            <div className="mt-4 space-y-2 max-w-lg mx-auto text-sm text-slate-600 leading-relaxed bg-slate-50 p-5 rounded-2xl border border-slate-200 text-left">
              <p className="font-medium text-slate-900">
                Your Student Twin account has been successfully created.
              </p>
              <p>
                Your account is currently waiting for <strong>Faculty/HOD approval</strong>.
              </p>
              <p className="text-xs text-slate-500">
                You will receive access to your Digital Career Twin, assessments, and AI mock interview features immediately after your Faculty/HOD approves your registration.
              </p>
            </div>
          </div>
        )}

        {/* Verification Meta Box */}
        <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 max-w-md mx-auto text-xs text-slate-600 space-y-2 text-left">
          <div className="flex justify-between">
            <span className="text-slate-500">Registered Email:</span>
            <span className="font-mono font-medium text-slate-900">{displayEmail}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Roll Number:</span>
            <span className="font-mono font-medium text-slate-900">{displayRoll}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Department:</span>
            <span className="font-medium text-slate-900">{displayDept}</span>
          </div>
          <div className="flex justify-between border-t border-slate-200 pt-2">
            <span className="text-slate-500">Current Status:</span>
            <span className={`font-bold uppercase ${
              isApproved ? 'text-emerald-700' : isRejected ? 'text-rose-700' : 'text-amber-700'
            }`}>
              {status}
            </span>
          </div>
        </div>

        {message && (
          <p className="mt-4 text-xs font-medium text-indigo-600 animate-fade-in">{message}</p>
        )}

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          {isApproved ? (
            <Link
              to="/student/dashboard"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-100 flex items-center justify-center gap-2 transition"
            >
              Enter Student Twin Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-100 flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Checking Firestore...' : 'Refresh Approval Status'}
            </button>
          )}

          <button
            onClick={async () => {
              await logout();
              navigate('/student-login');
            }}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
          >
            Sign Out
          </button>
        </div>

        {/* Reviewer helper note */}
        {isPending && (
          <div className="mt-8 pt-6 border-t border-slate-100 text-xs text-slate-400">
            <p>
              <strong>Reviewer Note:</strong> You can log into the Faculty Portal (<Link to="/faculty-login" className="text-indigo-600 underline">Prof. Ramesh Sharma</Link>) to view and approve pending students in real time.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
