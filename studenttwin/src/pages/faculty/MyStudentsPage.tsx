import React, { useState } from 'react';
import { useAuth } from '../../firebase/authContext';
import { StudentProfile } from '../../types';
import { 
  Users, 
  Search, 
  Award, 
  BookOpen, 
  Cpu, 
  FileText, 
  MessagesSquare, 
  ExternalLink, 
  CheckCircle2, 
  X,
  Briefcase,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const MyStudentsPage: React.FC = () => {
  const { currentUser, allStudents } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null);

  // Scoped strictly to faculty's mentees or department
  const scopedStudents = allStudents.filter((s) => {
    if (s.status !== 'approved') return false;
    if (s.assignedFacultyUid && currentUser?.uid && s.assignedFacultyUid === currentUser.uid) return true;
    if (s.department && currentUser?.department && s.department.toLowerCase() === currentUser.department.toLowerCase()) return true;
    return false;
  });

  const filtered = scopedStudents.filter((s) =>
    s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.targetRole?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 mb-2">
            <Users className="w-3.5 h-3.5 text-amber-600" />
            Active Mentee Roster ({scopedStudents.length} Assigned)
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            My Assigned Students
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
            Inspect live Digital Career Twins, skill mastery levels, project portfolios, and interview performance for all students under your direct mentorship.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/faculty/mentoring"
            className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs transition"
          >
            Add Mentoring Notes &rarr;
          </Link>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search mentee by name, roll number, or target role..."
            className="w-full text-xs pl-10 pr-3.5 py-2 rounded-xl border border-slate-200 focus:border-amber-500 outline-none"
          />
        </div>
        <span className="text-xs text-slate-500 font-medium hidden sm:inline">
          {filtered.length} active students
        </span>
      </div>

      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((student) => {
          const score = student.readinessScore || 0;
          return (
            <div
              key={student.uid}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:border-amber-300 hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm">
                      {student.fullName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">{student.fullName}</h3>
                      <p className="text-[11px] text-slate-500">{student.rollNumber} • Year {student.year}</p>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-xs font-black border ${
                    score >= 80 ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}>
                    {score}/100
                  </span>
                </div>

                <div className="mt-4 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">CGPA:</span>
                    <span className="font-bold text-slate-800">{student.cgpa} / 10.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Target Role:</span>
                    <span className="font-medium text-slate-800 truncate max-w-[150px]">{student.targetRole}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Skills Tracked:</span>
                    <span className="font-semibold text-indigo-700">{student.skills?.length || 0} Competencies</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Mentor: {currentUser?.fullName?.split(' ')[1] || 'Assigned'}</span>
                <button
                  onClick={() => setSelectedStudent(student)}
                  className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
                >
                  Inspect Career Twin <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Student Career Twin Drawer / Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 animate-fade-in max-h-[85vh] flex flex-col">
            {/* Header */}
            <div className="px-6 py-5 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-lg font-bold text-white">{selectedStudent.fullName}'s Digital Career Twin</h3>
                <p className="text-xs text-amber-200">{selectedStudent.rollNumber} • {selectedStudent.department} • Readiness: {selectedStudent.readinessScore || 0}/100</p>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* 6 Score Pillars */}
              <div>
                <h4 className="font-bold text-xs text-slate-700 uppercase tracking-wider mb-3">
                  Score Contribution Breakdown:
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Academics (20%)</span>
                    <span className="font-bold text-slate-900">{selectedStudent.scoreBreakdown?.academics || 16} / 20 pts</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Technical Skills (25%)</span>
                    <span className="font-bold text-slate-900">{selectedStudent.scoreBreakdown?.technicalSkills || 18} / 25 pts</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Projects (15%)</span>
                    <span className="font-bold text-slate-900">{selectedStudent.scoreBreakdown?.projects || 11} / 15 pts</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Certifications (10%)</span>
                    <span className="font-bold text-slate-900">{selectedStudent.scoreBreakdown?.certifications || 6} / 10 pts</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Resume / ATS (15%)</span>
                    <span className="font-bold text-slate-900">{selectedStudent.scoreBreakdown?.resumeAts || 11} / 15 pts</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Mock Interview (15%)</span>
                    <span className="font-bold text-slate-900">{selectedStudent.scoreBreakdown?.mockInterview || 10} / 15 pts</span>
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div>
                <h4 className="font-bold text-xs text-slate-700 uppercase tracking-wider mb-2">
                  Tracked Skills & Verification:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedStudent.skills?.map((sk, idx) => (
                    <span key={idx} className="px-2.5 py-1 bg-slate-100 text-slate-800 text-xs font-semibold rounded-lg border border-slate-200 flex items-center gap-1">
                      {sk.name} ({sk.level}) {sk.verified && <CheckCircle2 className="w-3 h-3 text-blue-600" />}
                    </span>
                  ))}
                </div>
              </div>

              {/* Projects */}
              <div>
                <h4 className="font-bold text-xs text-slate-700 uppercase tracking-wider mb-2">
                  Documented Projects:
                </h4>
                <div className="space-y-2">
                  {selectedStudent.projects?.map((proj) => (
                    <div key={proj.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                      <p className="font-bold text-slate-900">{proj.title}</p>
                      <p className="text-slate-600 mt-0.5">{proj.description}</p>
                      <p className="text-slate-400 text-[11px] mt-1">Tech: {proj.techStack.join(', ')}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl"
              >
                Close Twin View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
