import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../firebase/authContext';
import { 
  ShieldCheck, 
  Building2, 
  Users, 
  Briefcase, 
  Award, 
  TrendingUp, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Clock,
  Zap
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const { allStudents, allFaculty } = useAuth();

  const approvedStudents = allStudents.filter((s) => s.status === 'approved');
  const pendingStudents = allStudents.filter((s) => s.status === 'pending');
  const activeFaculty = allFaculty.filter((f) => f.active);

  const avgReadiness = approvedStudents.length > 0
    ? Math.round(approvedStudents.reduce((acc, s) => acc + (s.readinessScore || 0), 0) / approvedStudents.length)
    : 0;

  const placementReadyCount = approvedStudents.filter((s) => (s.readinessScore || 0) >= 80).length;

  return (
    <div className="space-y-8">
      {/* Directorate Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-white/10 text-rose-200 backdrop-blur-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-rose-300" />
            Central Campus Placement Directorate
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Placement Directorate Operations
          </h1>
          <p className="text-xs sm:text-sm text-rose-200 max-w-xl">
            Institutional oversight across academic departments, mentor appointments, corporate recruiter criteria, and security audit logs.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
          <Link
            to="/admin/faculty"
            className="px-5 py-2.5 rounded-xl bg-white text-slate-900 hover:bg-rose-50 text-xs font-bold shadow-sm flex items-center gap-2 transition"
          >
            Provision Faculty <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/admin/companies"
            className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-2 transition border border-rose-400/40"
          >
            Recruiter Criteria
          </Link>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Faculty</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-black text-slate-900">{allFaculty.length}</h3>
            <p className="text-xs text-slate-500 mt-1">{activeFaculty.length} actively mentoring</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Enrolled Students</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-black text-slate-900">{allStudents.length}</h3>
            <p className="text-xs text-slate-500 mt-1">{approvedStudents.length} approved • {pendingStudents.length} pending</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Campus Mean Score</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-black text-emerald-700">{avgReadiness} / 100</h3>
            <p className="text-xs text-slate-500 mt-1">Across all departments</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Placement Ready</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-black text-rose-700">{placementReadyCount}</h3>
            <p className="text-xs text-slate-500 mt-1">Score ≥ 80 (Eligible for Tier-1 drives)</p>
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/admin/faculty"
          className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:border-rose-300 hover:shadow-md transition group"
        >
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4 group-hover:bg-amber-600 group-hover:text-white transition">
            <Building2 className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900">Faculty Provisioning</h3>
          <p className="text-xs text-slate-500 mt-1">
            Create new faculty credentials, edit departmental appointments, and manage active/deactivated statuses.
          </p>
          <span className="mt-4 text-xs font-bold text-rose-600 flex items-center gap-1">
            Manage Faculty &rarr;
          </span>
        </Link>

        <Link
          to="/admin/students"
          className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:border-rose-300 hover:shadow-md transition group"
        >
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900">Campus-Wide Student Roster</h3>
          <p className="text-xs text-slate-500 mt-1">
            Inspect all registered students, filter by department and status, and view individual career twins.
          </p>
          <span className="mt-4 text-xs font-bold text-rose-600 flex items-center gap-1">
            View All Students &rarr;
          </span>
        </Link>

        <Link
          to="/admin/audit-logs"
          className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:border-rose-300 hover:shadow-md transition group"
        >
          <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center mb-4 group-hover:bg-rose-600 group-hover:text-white transition">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900">Security Audit Logs</h3>
          <p className="text-xs text-slate-500 mt-1">
            Review tamper-evident logs for approvals, deactivations, assignments, and authorization events.
          </p>
          <span className="mt-4 text-xs font-bold text-rose-600 flex items-center gap-1">
            Inspect Audit Logs &rarr;
          </span>
        </Link>
      </div>
    </div>
  );
};
