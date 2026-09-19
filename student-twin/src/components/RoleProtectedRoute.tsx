import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../firebase/authContext';
import { UserRole } from '../types';
import { ShieldAlert, AlertOctagon, ArrowRight, UserX, Loader2 } from 'lucide-react';

interface Props {
  allowedRole?: UserRole;
  allowedRoles?: UserRole[];
  requireApprovedStudent?: boolean;
  children: React.ReactNode;
}

export const RoleProtectedRoute: React.FC<Props> = ({ 
  allowedRole, 
  allowedRoles, 
  requireApprovedStudent, 
  children 
}) => {
  const { currentUser, studentProfile, loading } = useAuth();
  const location = useLocation();

  const effectiveAllowedRoles: UserRole[] = allowedRoles || (allowedRole ? [allowedRole] : ['student', 'faculty', 'admin']);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-3" />
        <p className="text-sm font-medium text-slate-600">Verifying secure Firebase authorization token...</p>
        <p className="text-xs text-slate-400 mt-1">Enforcing role-based access control</p>
      </div>
    );
  }

  // Not authenticated
  if (!currentUser) {
    if (effectiveAllowedRoles.includes('admin')) return <Navigate to="/admin-login" state={{ from: location }} replace />;
    if (effectiveAllowedRoles.includes('faculty')) return <Navigate to="/faculty-login" state={{ from: location }} replace />;
    return <Navigate to="/student-login" state={{ from: location }} replace />;
  }

  // Account deactivated check
  if (!currentUser.active) {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 bg-white border border-rose-200 rounded-2xl shadow-lg text-center">
        <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
          <UserX className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Account Deactivated</h2>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed">
          Your account has been deactivated by the Placement Administration or College Directorate.
          Access to this portal has been revoked.
        </p>
        <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 text-left space-y-1">
          <p className="font-semibold text-slate-700">Account Identity:</p>
          <p>Email: <span className="font-mono text-slate-900">{currentUser.email}</span></p>
          <p>Role: <span className="font-mono text-slate-900 uppercase">{currentUser.role}</span></p>
          <p>Status: <span className="text-rose-600 font-semibold">DEACTIVATED</span></p>
        </div>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            to="/"
            className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  // Wrong-role access protection (403)
  if (!effectiveAllowedRoles.includes(currentUser.role)) {
    const roleDestinations: Record<UserRole, string> = {
      student: '/student/dashboard',
      faculty: '/faculty/dashboard',
      admin: '/admin/dashboard'
    };

    return (
      <div className="max-w-2xl mx-auto my-16 p-8 bg-white border border-amber-200 rounded-2xl shadow-xl">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-700">
              <AlertOctagon className="w-3.5 h-3.5" /> 403 Forbidden
            </div>
            <h2 className="text-xl font-bold text-slate-900">Wrong-Portal Access Denied</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              You are authenticated as <span className="font-semibold text-indigo-600 uppercase">{currentUser.role}</span>, but tried to access a protected portal reserved for <span className="font-semibold text-slate-900 uppercase">{effectiveAllowedRoles.join(', ')}</span>.
            </p>
            <p className="text-xs text-slate-500">
              Security Notice: In accordance with Student Twin architecture, roles are determined strictly from authoritative backend credentials and cannot be modified via URLs, storage, or query parameters.
            </p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1.5">
          <div className="flex justify-between py-1 border-b border-slate-200">
            <span>Authenticated UID:</span>
            <span className="font-mono text-slate-900">{currentUser.uid}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-200">
            <span>Your Authorized Role:</span>
            <span className="font-semibold text-indigo-700 uppercase">{currentUser.role}</span>
          </div>
          <div className="flex justify-between py-1">
            <span>Allowed Portals:</span>
            <span className="font-semibold text-rose-700 uppercase">{effectiveAllowedRoles.join(', ')}</span>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <Link
            to={roleDestinations[currentUser.role]}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition"
          >
            Go to Authorized {currentUser.role.toUpperCase()} Portal <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  // Student-specific approval status check
  if (currentUser.role === 'student' && requireApprovedStudent) {
    if (studentProfile?.status === 'pending' || studentProfile?.status === 'rejected') {
      return <Navigate to="/pending" replace />;
    }
  }

  return <>{children}</>;
};
