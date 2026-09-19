import React from 'react';
import { useAuth } from '../../firebase/authContext';
import { TrendingUp, Users, Award, BookOpen, Cpu, Briefcase, CheckCircle2, FileText, MessagesSquare } from 'lucide-react';

export const CohortProgressPage: React.FC = () => {
  const { currentUser, allStudents } = useAuth();

  // Scoped strictly to faculty's mentees or department
  const scopedStudents = allStudents.filter((s) => {
    if (s.status !== 'approved') return false;
    if (s.assignedFacultyUid && currentUser?.uid && s.assignedFacultyUid === currentUser.uid) return true;
    if (s.department && currentUser?.department && s.department.toLowerCase() === currentUser.department.toLowerCase()) return true;
    return false;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 mb-2">
          <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
          Comparative Mentorship Matrix
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          Cohort Progress & Pillar Matrix
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xl mt-1">
          Compare the 6 weighted readiness pillars across all {scopedStudents.length} approved students in your department cohort.
        </p>
      </div>

      {/* Comparative Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900">Department Mentee Pillar Breakdown</h3>
          <span className="text-xs text-slate-500">{scopedStudents.length} Records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Student</th>
                <th className="p-4">Roll No</th>
                <th className="p-4 text-center">Academics (20%)</th>
                <th className="p-4 text-center">Tech Skills (25%)</th>
                <th className="p-4 text-center">Projects (15%)</th>
                <th className="p-4 text-center">Certs (10%)</th>
                <th className="p-4 text-center">ATS (15%)</th>
                <th className="p-4 text-center">Interview (15%)</th>
                <th className="p-4 text-center font-black text-slate-900">Total (100)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {scopedStudents.map((s) => {
                const b = s.scoreBreakdown || {
                  academics: 16,
                  technicalSkills: 18,
                  projects: 11,
                  certifications: 6,
                  resumeAts: 11,
                  mockInterview: 10
                };
                const total = s.readinessScore || 0;
                return (
                  <tr key={s.uid} className="hover:bg-slate-50/80 transition">
                    <td className="p-4 font-bold text-slate-900">{s.fullName}</td>
                    <td className="p-4 font-mono text-slate-500">{s.rollNumber}</td>
                    <td className="p-4 text-center font-semibold text-indigo-700">{b.academics}/20</td>
                    <td className="p-4 text-center font-semibold text-blue-700">{b.technicalSkills}/25</td>
                    <td className="p-4 text-center font-semibold text-emerald-700">{b.projects}/15</td>
                    <td className="p-4 text-center font-semibold text-amber-700">{b.certifications}/10</td>
                    <td className="p-4 text-center font-semibold text-rose-700">{b.resumeAts}/15</td>
                    <td className="p-4 text-center font-semibold text-purple-700">{b.mockInterview}/15</td>
                    <td className="p-4 text-center">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-black border ${
                        total >= 80 ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}>
                        {total}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
