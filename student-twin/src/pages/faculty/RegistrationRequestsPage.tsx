import React, { useState } from 'react';
import { useAuth } from '../../firebase/authContext';
import { 
  UserCheck, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  User, 
  Mail, 
  Hash, 
  Award, 
  Building, 
  Search,
  Check,
  X
} from 'lucide-react';

export const RegistrationRequestsPage: React.FC = () => {
  const { currentUser, allStudents, approveStudent, rejectStudent } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [rejectingStudentUid, setRejectingStudentUid] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionSuccessMessage, setActionSuccessMessage] = useState('');
  const [processingUid, setProcessingUid] = useState<string | null>(null);

  // Filter pending students in faculty's department scope
  const pendingStudents = allStudents.filter((s) => {
    if (s.status !== 'pending') return false;
    // Check department match or unassigned
    if (currentUser?.department && s.department) {
      return s.department.toLowerCase() === currentUser.department.toLowerCase();
    }
    return true;
  });

  const filtered = pendingStudents.filter((s) =>
    s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApprove = async (studentUid: string, studentName: string) => {
    setProcessingUid(studentUid);
    const res = await approveStudent(studentUid);
    setProcessingUid(null);
    if (res.success) {
      setActionSuccessMessage(`Successfully approved ${studentName}. Account is now fully active!`);
      setTimeout(() => setActionSuccessMessage(''), 4000);
    } else {
      alert(`Approval error: ${res.error}`);
    }
  };

  const handleOpenRejectModal = (studentUid: string) => {
    setRejectingStudentUid(studentUid);
    setRejectionReason('Academic registration details could not be verified with college registrar records.');
  };

  const handleConfirmReject = async () => {
    if (!rejectingStudentUid) return;
    setProcessingUid(rejectingStudentUid);
    const res = await rejectStudent(rejectingStudentUid, rejectionReason);
    setProcessingUid(null);
    setRejectingStudentUid(null);
    if (res.success) {
      setActionSuccessMessage(`Registration request rejected and reason logged.`);
      setTimeout(() => setActionSuccessMessage(''), 4000);
    } else {
      alert(`Rejection error: ${res.error}`);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 mb-2">
            <UserCheck className="w-3.5 h-3.5 text-amber-600" />
            Verification Queue ({pendingStudents.length} Pending)
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Student Registration Requests
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
            Review incoming student credentials from your department. Verification unlocks Student Twin access and assigns you as their primary mentor.
          </p>
        </div>

        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-center shrink-0">
          <span className="text-[11px] text-amber-700 font-semibold uppercase tracking-wider block">
            Department Queue
          </span>
          <span className="text-2xl font-black text-amber-900 mt-0.5 block">{pendingStudents.length} Students</span>
        </div>
      </div>

      {actionSuccessMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{actionSuccessMessage}</span>
        </div>
      )}

      {/* Filter / Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by student name, roll number, or email..."
            className="w-full text-xs pl-10 pr-3.5 py-2 rounded-xl border border-slate-200 focus:border-amber-500 outline-none"
          />
        </div>
        <span className="text-xs text-slate-500 font-medium hidden sm:inline">
          Showing {filtered.length} pending records
        </span>
      </div>

      {/* Pending Requests List */}
      {filtered.length > 0 ? (
        <div className="space-y-4">
          {filtered.map((student) => {
            const isProcessing = processingUid === student.uid;
            return (
              <div
                key={student.uid}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:border-amber-300 transition flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                {/* Student Info */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-base shadow-xs">
                      {student.fullName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-base text-slate-900">{student.fullName}</h3>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 uppercase">
                          Pending Review
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">{student.email} • Registered {student.createdAt ? new Date(student.createdAt).toLocaleDateString() : 'Recently'}</p>
                    </div>
                  </div>

                  {/* Academic Details Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Roll Number:</span>
                      <span className="font-mono font-bold text-slate-800">{student.rollNumber}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Academic Year:</span>
                      <span className="font-semibold text-slate-800">Year {student.year}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Reported CGPA:</span>
                      <span className="font-bold text-slate-900">{student.cgpa} / 10.0</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Standing Backlogs:</span>
                      <span className={`font-bold ${student.backlogs === 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                        {student.backlogs} Backlogs
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600">
                    Target Role: <strong className="text-slate-800">{student.targetRole || 'Software Engineer'}</strong>
                  </p>
                </div>

                {/* Actions strictly mandated by prompt */}
                <div className="flex items-center gap-3 shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                  <button
                    onClick={() => handleOpenRejectModal(student.uid)}
                    disabled={isProcessing}
                    className="px-4 py-2.5 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-bold transition flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <X className="w-4 h-4" /> Reject Request
                  </button>

                  <button
                    onClick={() => handleApprove(student.uid, student.fullName)}
                    disabled={isProcessing}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <Check className="w-4 h-4" /> Approve Student
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900">All Registration Requests Resolved!</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            There are currently no unverified student registrations waiting for review in your department.
          </p>
        </div>
      )}

      {/* Reject Modal with Reason Prompt (Mandated by Section 9) */}
      {rejectingStudentUid && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 animate-fade-in">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Reject Registration Request</h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Please specify the official reason for rejecting this student's registration. The student will be able to view this remark when checking their approval status.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Official Rejection Reason *
              </label>
              <textarea
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g. Roll number does not match current semester enrollment records..."
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:border-rose-500 outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRejectingStudentUid(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
