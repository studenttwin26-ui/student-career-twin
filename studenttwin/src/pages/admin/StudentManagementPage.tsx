import React, { useState } from 'react';
import { useAuth } from '../../firebase/authContext';
import { StudentProfile } from '../../types';
import { 
  Users, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Award, 
  ChevronRight, 
  X,
  ShieldCheck,
  Building
} from 'lucide-react';

export const StudentManagementPage: React.FC = () => {
  const { allStudents, approveStudent, rejectStudent } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null);

  const departments = Array.from(new Set(allStudents.map((s) => s.department).filter(Boolean)));

  const filtered = allStudents.filter((s) => {
    const matchesSearch = s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.email.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    if (filterDepartment !== 'all' && s.department !== filterDepartment) return false;
    if (filterStatus !== 'all' && s.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200 mb-2">
            <Users className="w-3.5 h-3.5 text-rose-600" />
            Central Student Database ({allStudents.length} Registered)
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Student Lifecycle & Readiness Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
            Campus-wide registry of all enrolled students. Filter by academic stream, status, and inspect readiness diagnostics.
          </p>
        </div>

        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center shrink-0">
          <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider block">
            Institutional Roster
          </span>
          <span className="text-2xl font-black text-slate-900 mt-0.5 block">{allStudents.length} Students</span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by student name, roll number, or email..."
            className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-slate-200 focus:border-rose-500 outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Department:</span>
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-white focus:border-rose-500 outline-none"
            >
              <option value="all">All Departments</option>
              {departments.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-white focus:border-rose-500 outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Student</th>
                <th className="p-4">Roll Number</th>
                <th className="p-4">Department & Year</th>
                <th className="p-4">CGPA / Backlogs</th>
                <th className="p-4 text-center">Readiness</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((s) => {
                const score = s.readinessScore || 0;
                return (
                  <tr key={s.uid} className="hover:bg-slate-50/80 transition">
                    <td className="p-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold text-xs">
                          {s.fullName.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block">{s.fullName}</span>
                          <span className="text-[11px] text-slate-400">{s.email}</span>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 font-mono font-bold text-slate-700">{s.rollNumber}</td>

                    <td className="p-4">
                      <span className="font-medium text-slate-800 block">{s.department}</span>
                      <span className="text-[11px] text-slate-500">Year {s.year}</span>
                    </td>

                    <td className="p-4">
                      <span className="font-bold text-slate-800">{s.cgpa} / 10.0</span>
                      <span className={`block text-[11px] ${s.backlogs === 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                        {s.backlogs} Backlogs
                      </span>
                    </td>

                    <td className="p-4 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full font-black text-xs border ${
                        score >= 80 ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-slate-100 text-slate-800 border-slate-200'
                      }`}>
                        {score} / 100
                      </span>
                    </td>

                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        s.status === 'approved'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : s.status === 'pending'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}>
                        {s.status === 'approved' ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        ) : s.status === 'pending' ? (
                          <Clock className="w-3 h-3 text-amber-600" />
                        ) : (
                          <XCircle className="w-3 h-3 text-rose-600" />
                        )}
                        {s.status.toUpperCase()}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedStudent(s)}
                        className="text-xs font-bold text-rose-600 hover:text-rose-700 inline-flex items-center gap-0.5 cursor-pointer"
                      >
                        Inspect <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Detail Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 space-y-5 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900">{selectedStudent.fullName}</h3>
                <p className="text-xs text-slate-500">{selectedStudent.rollNumber} • {selectedStudent.department}</p>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between">
                <span className="text-slate-500">Lifecycle Status:</span>
                <span className="font-bold text-slate-900 uppercase">{selectedStudent.status}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between">
                <span className="text-slate-500">Assigned Faculty Mentor:</span>
                <span className="font-bold text-slate-900">{selectedStudent.assignedFacultyName || 'Unassigned'}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between">
                <span className="text-slate-500">Unified Readiness Score:</span>
                <span className="font-extrabold text-emerald-700">{selectedStudent.readinessScore || 0} / 100</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between">
                <span className="text-slate-500">Target Role:</span>
                <span className="font-medium text-slate-900">{selectedStudent.targetRole || 'Not Specified'}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
