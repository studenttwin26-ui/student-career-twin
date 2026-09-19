import React, { useState } from 'react';
import { useAuth } from '../../firebase/authContext';
import { User, Mail, Hash, Building, Award, Phone, ShieldCheck, Plus, Trash2, CheckCircle2 } from 'lucide-react';

export const StudentProfilePage: React.FC = () => {
  const { studentProfile } = useAuth();

  const [newSkill, setNewSkill] = useState('');
  const [skillLevel, setSkillLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [skillsList, setSkillsList] = useState(studentProfile?.skills || []);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!studentProfile) return null;

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    setSkillsList((prev) => [
      ...prev,
      { name: newSkill.trim(), level: skillLevel, verified: false }
    ]);
    setNewSkill('');
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleRemoveSkill = (idx: number) => {
    setSkillsList((prev) => prev.filter((_, i) => i !== idx));
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-2xl shadow-md shadow-indigo-100">
            {studentProfile.fullName?.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900">{studentProfile.fullName}</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {studentProfile.rollNumber} • {studentProfile.department}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                <CheckCircle2 className="w-3 h-3" /> Account Status: {studentProfile.status.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
          <p className="text-slate-500 font-semibold">Faculty Mentor Scope:</p>
          <p className="font-bold text-indigo-700">{studentProfile.assignedFacultyName || 'Assigned Mentor'}</p>
          <p className="text-slate-400 text-[11px]">Approved on: {studentProfile.approvedAt || 'Active'}</p>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Profile and technical skill competencies updated successfully!</span>
        </div>
      )}

      {/* Academic Identity Details */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <h3 className="font-bold text-base text-slate-900">Academic Coordinates</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-400 block text-[11px]">Official Email</span>
            <span className="font-medium text-slate-900 mt-0.5 block">{studentProfile.email}</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-400 block text-[11px]">Registration Number</span>
            <span className="font-medium text-slate-900 mt-0.5 block">{studentProfile.rollNumber}</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-400 block text-[11px]">Department / Major</span>
            <span className="font-medium text-slate-900 mt-0.5 block">{studentProfile.department}</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-400 block text-[11px]">Current Academic Year</span>
            <span className="font-medium text-slate-900 mt-0.5 block">Year {studentProfile.year} (Final Year)</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-400 block text-[11px]">Cumulative GPA</span>
            <span className="font-bold text-slate-900 mt-0.5 block">{studentProfile.cgpa} / 10.0</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-400 block text-[11px]">Active Standing Backlogs</span>
            <span className="font-bold text-emerald-700 mt-0.5 block">{studentProfile.backlogs} Backlogs</span>
          </div>
        </div>
      </div>

      {/* Skills Management */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900">Technical Skills Management</h3>
            <p className="text-xs text-slate-500">Update technical competencies recorded in your Digital Twin</p>
          </div>
          <span className="text-xs text-slate-500 font-semibold">{skillsList.length} Skills Added</span>
        </div>

        {/* Add Skill Form */}
        <form onSubmit={handleAddSkill} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="Add new skill (e.g. Docker, GraphQL, Redis)..."
            className="flex-1 text-xs p-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none"
          />
          <select
            value={skillLevel}
            onChange={(e) => setSkillLevel(e.target.value as any)}
            className="text-xs px-3 py-2.5 rounded-xl border border-slate-200 bg-white focus:border-indigo-500 outline-none"
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add Skill
          </button>
        </form>

        {/* Skills Tag List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {skillsList.map((skill, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <p className="font-bold text-xs text-slate-900 flex items-center gap-1">
                  {skill.name}
                  {skill.verified && <CheckCircle2 className="w-3 h-3 text-blue-600" />}
                </p>
                <span className="text-[10px] text-slate-500">{skill.level}</span>
              </div>
              <button
                onClick={() => handleRemoveSkill(idx)}
                className="text-slate-400 hover:text-rose-600 p-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
