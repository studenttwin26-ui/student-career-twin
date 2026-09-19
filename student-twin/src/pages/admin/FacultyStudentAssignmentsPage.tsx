import React, { useState } from 'react';
import { useAuth } from '../../firebase/authContext';
import { UserPlus, Building2, Users, CheckCircle2, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';

export const FacultyStudentAssignmentsPage: React.FC = () => {
  const { allStudents, allFaculty, assignStudentToFaculty } = useAuth();

  const [selectedStudentUid, setSelectedStudentUid] = useState<string>(allStudents[0]?.uid || '');
  const [selectedFacultyUid, setSelectedFacultyUid] = useState<string>(allFaculty[0]?.uid || '');
  const [successMessage, setSuccessMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentUid || !selectedFacultyUid) return;

    setIsProcessing(true);
    const facultyObj = allFaculty.find((f) => f.uid === selectedFacultyUid);
    const facultyName = facultyObj?.fullName || 'Faculty Mentor';
    const res = await assignStudentToFaculty(selectedStudentUid, selectedFacultyUid, facultyName);
    setIsProcessing(false);

    if (res.success) {
      setSuccessMessage('Student successfully assigned/reassigned to mentor!');
      setTimeout(() => setSuccessMessage(''), 3500);
    } else {
      alert(`Assignment failed: ${res.error}`);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200 mb-2">
          <UserPlus className="w-3.5 h-3.5 text-rose-600" />
          Mentorship Cohort Allocation
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          Faculty-Student Assignment Engine
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xl mt-1">
          Assign or reassign students to authorized faculty mentors. Enforces faculty-scoped data access boundaries across the institution.
        </p>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Assignment Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm max-w-2xl mx-auto space-y-6">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="font-bold text-base text-slate-900">Assign / Reassign Mentee</h3>
          <p className="text-xs text-slate-500">Pair any student with an active faculty mentor</p>
        </div>

        <form onSubmit={handleAssign} className="space-y-5 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Select Student *</label>
            <select
              value={selectedStudentUid}
              onChange={(e) => setSelectedStudentUid(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 bg-white focus:border-rose-500 outline-none"
            >
              {allStudents.map((s) => (
                <option key={s.uid} value={s.uid}>
                  {s.fullName} ({s.rollNumber}) — {s.department} [Current Mentor: {s.assignedFacultyName || 'Unassigned'}]
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Select Target Faculty Mentor *</label>
            <select
              value={selectedFacultyUid}
              onChange={(e) => setSelectedFacultyUid(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 bg-white focus:border-rose-500 outline-none"
            >
              {allFaculty.map((f) => (
                <option key={f.uid} value={f.uid}>
                  {f.fullName} — {f.department} ({f.active ? 'Active' : 'Deactivated'})
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-xs transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
            Confirm Cohort Assignment
          </button>
        </form>
      </div>

      {/* Active Assignment Matrix Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900">Current Institutional Allocation Overview</h3>
          <span className="text-xs text-slate-500">{allStudents.length} Students</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Student</th>
                <th className="p-4">Roll Number</th>
                <th className="p-4">Department</th>
                <th className="p-4">Assigned Faculty Mentor</th>
                <th className="p-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {allStudents.map((s) => (
                <tr key={s.uid} className="hover:bg-slate-50/80 transition">
                  <td className="p-4 font-bold text-slate-900">{s.fullName}</td>
                  <td className="p-4 font-mono text-slate-600">{s.rollNumber}</td>
                  <td className="p-4 text-slate-700">{s.department}</td>
                  <td className="p-4">
                    <span className="font-semibold text-rose-700">
                      {s.assignedFacultyName || 'Pending Assignment'}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      s.assignedFacultyUid ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'
                    }`}>
                      {s.assignedFacultyUid ? 'Assigned' : 'Unassigned'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
