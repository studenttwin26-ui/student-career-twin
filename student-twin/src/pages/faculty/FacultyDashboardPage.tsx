import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../firebase/authContext';
import { 
  Building2, 
  Users, 
  UserCheck, 
  AlertCircle, 
  TrendingUp, 
  ArrowRight, 
  Award, 
  CheckCircle2, 
  Clock, 
  FileEdit,
  ShieldCheck
} from 'lucide-react';

export const FacultyDashboardPage: React.FC = () => {
  const { currentUser, allStudents, pendingStudentsCount } = useAuth();

  // Filter students scoped to this faculty / department
  const scopedStudents = allStudents.filter((s) => {
    if (s.assignedFacultyUid && currentUser?.uid && s.assignedFacultyUid === currentUser.uid) return true;
    if (s.department && currentUser?.department && s.department.toLowerCase() === currentUser.department.toLowerCase()) return true;
    return false;
  });

  const approvedStudents = scopedStudents.filter((s) => s.status === 'approved');
  const pendingStudents = scopedStudents.filter((s) => s.status === 'pending');

  // Distribution
  const highReadiness = approvedStudents.filter((s) => (s.readinessScore || 0) >= 80);
  const moderateReadiness = approvedStudents.filter((s) => (s.readinessScore || 0) >= 60 && (s.readinessScore || 0) < 80);
  const needsAttention = approvedStudents.filter((s) => (s.readinessScore || 0) < 60);

  const avgScore = approvedStudents.length > 0
    ? Math.round(approvedStudents.reduce((acc, s) => acc + (s.readinessScore || 0), 0) / approvedStudents.length)
    : 0;

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-white/10 text-amber-200 backdrop-blur-xs">
            <Building2 className="w-3.5 h-3.5 text-amber-300" />
            Department Mentorship & Placement Oversight
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Welcome, {currentUser?.fullName}!
          </h1>
          <p className="text-xs sm:text-sm text-amber-200 max-w-xl">
            Department Scope: <strong>{currentUser?.department}</strong>. Monitor your student cohort's placement trajectory, review registration requests, and guide skill interventions.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
          <Link
            to="/faculty/requests"
            className="px-5 py-2.5 rounded-xl bg-white text-slate-900 hover:bg-amber-50 text-xs font-bold shadow-sm flex items-center gap-2 transition"
          >
            Review Requests ({pendingStudents.length}) <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/faculty/students"
            className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center gap-2 transition border border-amber-400/40"
          >
            View My Students
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Scoped Students</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-black text-slate-900">{scopedStudents.length}</h3>
            <p className="text-xs text-slate-500 mt-1">{approvedStudents.length} approved active mentees</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Requests</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-black text-amber-700">{pendingStudents.length}</h3>
            <p className="text-xs text-slate-500 mt-1">Awaiting your approval</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Avg Readiness</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-black text-emerald-700">{avgScore} / 100</h3>
            <p className="text-xs text-slate-500 mt-1">Cohort weighted mean</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Placement Ready</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-black text-blue-700">{highReadiness.length}</h3>
            <p className="text-xs text-slate-500 mt-1">Score ≥ 80 (Tier-1 Eligible)</p>
          </div>
        </div>
      </div>

      {/* Distribution & Urgent Attention Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Readiness Distribution Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-5">
          <div>
            <h3 className="text-base font-bold text-slate-900">Cohort Readiness Distribution</h3>
            <p className="text-xs text-slate-500">Categorization across approved mentees</p>
          </div>

          <div className="space-y-4">
            {/* High */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-emerald-700">Placement Ready (≥ 80)</span>
                <span className="font-bold text-slate-900">{highReadiness.length} Students</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-600 h-full rounded-full" 
                  style={{ width: `${approvedStudents.length ? (highReadiness.length / approvedStudents.length) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Moderate */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-indigo-700">Moderate / Competitive (60 - 79)</span>
                <span className="font-bold text-slate-900">{moderateReadiness.length} Students</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-indigo-600 h-full rounded-full" 
                  style={{ width: `${approvedStudents.length ? (moderateReadiness.length / approvedStudents.length) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Needs Attention */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-rose-700">Needs Attention (&lt; 60)</span>
                <span className="font-bold text-slate-900">{needsAttention.length} Students</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-rose-600 h-full rounded-full" 
                  style={{ width: `${approvedStudents.length ? (needsAttention.length / approvedStudents.length) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 text-xs text-slate-500">
            <p>Target Goal: 85% of cohort achieving score ≥ 75 prior to campus placement season.</p>
          </div>
        </div>

        {/* Students Needing Attention (Mandated by prompt) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                Students Needing Immediate Faculty Intervention
              </h3>
              <p className="text-xs text-slate-500">Mentees with readiness score &lt; 70 or standing backlogs</p>
            </div>
            <Link to="/faculty/mentoring" className="text-xs font-semibold text-amber-700 hover:underline">
              Add Mentoring Note &rarr;
            </Link>
          </div>

          {needsAttention.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {needsAttention.map((student) => (
                <div key={student.uid} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-bold text-slate-900">{student.fullName}</h4>
                    <p className="text-slate-500">{student.rollNumber} • CGPA: {student.cgpa} • {student.backlogs} Backlogs</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-rose-700 font-extrabold bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                      Score: {student.readinessScore || 0}
                    </span>
                    <Link
                      to="/faculty/mentoring"
                      className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-semibold"
                    >
                      Mentor
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <p className="font-bold text-slate-800">All assigned mentees are in good standing!</p>
              <p className="mt-1">No mentees currently fall into the critical readiness bracket.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
