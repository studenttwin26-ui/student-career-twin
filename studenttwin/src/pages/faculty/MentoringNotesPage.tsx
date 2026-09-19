import React, { useState } from 'react';
import { useAuth } from '../../firebase/authContext';
import { FileEdit, Plus, CheckCircle2, User, Clock, ArrowRight, AlertCircle, Trash2 } from 'lucide-react';

interface NoteItem {
  id: string;
  studentUid: string;
  studentName: string;
  facultyName: string;
  note: string;
  actionItems: string[];
  priority: 'Normal' | 'High' | 'Critical';
  createdAt: string;
}

export const MentoringNotesPage: React.FC = () => {
  const { currentUser, allStudents } = useAuth();

  // Scoped students
  const scopedStudents = allStudents.filter((s) => {
    if (s.status !== 'approved') return false;
    if (s.assignedFacultyUid && currentUser?.uid && s.assignedFacultyUid === currentUser.uid) return true;
    if (s.department && currentUser?.department && s.department.toLowerCase() === currentUser.department.toLowerCase()) return true;
    return false;
  });

  const [selectedStudentUid, setSelectedStudentUid] = useState<string>(scopedStudents[0]?.uid || '');
  const [noteContent, setNoteContent] = useState('');
  const [actionItemInput, setActionItemInput] = useState('');
  const [priority, setPriority] = useState<'Normal' | 'High' | 'Critical'>('Normal');
  const [actionSuccess, setActionSuccess] = useState(false);

  const [notesList, setNotesList] = useState<NoteItem[]>([
    {
      id: 'n1',
      studentUid: 'student_alex',
      studentName: 'Alex Varun',
      facultyName: currentUser?.fullName || 'Prof. Ramesh Sharma',
      note: 'Conducted 1-on-1 career review. Alex demonstrates high algorithmic mastery but needs to emphasize AWS cloud metrics in project section for Tier-1 product roles.',
      actionItems: [
        'Deploy Student Twin project to a live public URL',
        'Solve 15 Graph Traversal problems before next review'
      ],
      priority: 'Normal',
      createdAt: '2 days ago'
    },
    {
      id: 'n2',
      studentUid: 'student_3',
      studentName: 'Rohan Mehta',
      facultyName: currentUser?.fullName || 'Prof. Ramesh Sharma',
      note: 'Identified deficit in SQL queries and low ATS match for SDE roles. Recommended retaking assessment track.',
      actionItems: [
        'Retake SQL Assessment and achieve >85%',
        'Schedule mock interview with AI simulator'
      ],
      priority: 'High',
      createdAt: '4 days ago'
    }
  ]);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim()) return;

    const targetStudent = scopedStudents.find((s) => s.uid === selectedStudentUid) || scopedStudents[0];
    const newNote: NoteItem = {
      id: `n_${Date.now()}`,
      studentUid: selectedStudentUid,
      studentName: targetStudent ? targetStudent.fullName : 'Assigned Student',
      facultyName: currentUser?.fullName || 'Faculty Mentor',
      note: noteContent.trim(),
      actionItems: actionItemInput ? actionItemInput.split('\n').filter((x) => x.trim().length > 0) : [],
      priority,
      createdAt: 'Just now'
    };

    setNotesList([newNote, ...notesList]);
    setNoteContent('');
    setActionItemInput('');
    setActionSuccess(true);
    setTimeout(() => setActionSuccess(false), 3000);
  };

  const handleDeleteNote = (id: string) => {
    setNotesList((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 mb-2">
          <FileEdit className="w-3.5 h-3.5 text-amber-600" />
          Mentorship & Placement Action Engine
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          Faculty Mentoring Notes & Action Items
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xl mt-1">
          Record persistent mentoring observations, feedback, and assigned preparation milestones for your students.
        </p>
      </div>

      {actionSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Mentoring note and assigned action items successfully recorded in student record!</span>
        </div>
      )}

      {/* Add Note Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
        <h3 className="font-bold text-base text-slate-900">Record Mentorship Session</h3>

        <form onSubmit={handleAddNote} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Select Mentee *</label>
              <select
                value={selectedStudentUid}
                onChange={(e) => setSelectedStudentUid(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:border-amber-500 outline-none"
              >
                {scopedStudents.map((s) => (
                  <option key={s.uid} value={s.uid}>
                    {s.fullName} ({s.rollNumber}) — Score: {s.readinessScore || 0}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Intervention Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:border-amber-500 outline-none"
              >
                <option value="Normal">Normal Guidance</option>
                <option value="High">High Priority Intervention</option>
                <option value="Critical">Critical (Pre-Placement Cutoff)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Mentoring Feedback & Observation *</label>
            <textarea
              rows={3}
              required
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="Record feedback discussed during review session..."
              className="w-full text-xs p-3.5 rounded-xl border border-slate-200 focus:border-amber-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Assigned Action Items (One item per line)
            </label>
            <textarea
              rows={2}
              value={actionItemInput}
              onChange={(e) => setActionItemInput(e.target.value)}
              placeholder="e.g. Complete DSA track\nUpdate LinkedIn profile"
              className="w-full text-xs p-3.5 rounded-xl border border-slate-200 focus:border-amber-500 outline-none font-mono text-[11px]"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Save Mentoring Record
            </button>
          </div>
        </form>
      </div>

      {/* Historical Notes Feed */}
      <div className="space-y-4">
        <h3 className="font-bold text-base text-slate-900">Recorded Mentorship Feed ({notesList.length})</h3>

        {notesList.map((note) => (
          <div key={note.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-900">{note.studentName}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  note.priority === 'Critical'
                    ? 'bg-rose-100 text-rose-800'
                    : note.priority === 'High'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-slate-100 text-slate-700'
                }`}>
                  {note.priority} Priority
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[11px] text-slate-400">{note.createdAt}</span>
                <button
                  onClick={() => handleDeleteNote(note.id)}
                  className="text-slate-400 hover:text-rose-600 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
              {note.note}
            </p>

            {note.actionItems && note.actionItems.length > 0 && (
              <div className="space-y-1 pt-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Assigned Action Items:
                </span>
                {note.actionItems.map((ai, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                    <ArrowRight className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>{ai}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
