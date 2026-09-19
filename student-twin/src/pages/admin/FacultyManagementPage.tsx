import React, { useState } from 'react';
import { useAuth } from '../../firebase/authContext';
import { FacultyProfile } from '../../types';
import { 
  Building2, 
  UserPlus, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Edit3, 
  Power, 
  Mail, 
  ShieldCheck,
  X
} from 'lucide-react';

export const FacultyManagementPage: React.FC = () => {
  const { allFaculty, createFaculty, updateFacultyStatus } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // New Faculty Form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [designation, setDesignation] = useState('Associate Professor & Placement Mentor');
  const [initialPassword, setInitialPassword] = useState('Faculty@123');

  const filtered = allFaculty.filter((f) =>
    f.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateFaculty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) return;

    const res = await createFaculty({
      fullName,
      email,
      department,
      designation
    });

    if (res.success) {
      setSuccessMessage(`Faculty account for ${fullName} provisioned successfully! Credentials logged.`);
      setShowCreateModal(false);
      setFullName('');
      setEmail('');
      setTimeout(() => setSuccessMessage(''), 4000);
    } else {
      alert(`Error creating faculty: ${res.error}`);
    }
  };

  const handleToggleStatus = async (facultyUid: string, currentActive: boolean) => {
    const res = await updateFacultyStatus(facultyUid, !currentActive);
    if (res.success) {
      setSuccessMessage(`Faculty account status updated to ${!currentActive ? 'Active' : 'Deactivated'}.`);
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200 mb-2">
            <Building2 className="w-3.5 h-3.5 text-rose-600" />
            Institutional Governance & Appointments
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Faculty & HOD Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
            Faculty accounts are strictly provisioned by Admin. Faculty cannot self-register. Manage departmental appointments and active mentoring permissions.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <UserPlus className="w-4 h-4" /> Provision New Faculty Account
        </button>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search faculty by name, email, or department..."
            className="w-full text-xs pl-10 pr-3.5 py-2 rounded-xl border border-slate-200 focus:border-rose-500 outline-none"
          />
        </div>
        <span className="text-xs text-slate-500 font-medium hidden sm:inline">
          {filtered.length} faculty records
        </span>
      </div>

      {/* Faculty Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Faculty Member</th>
                <th className="p-4">Official Email</th>
                <th className="p-4">Department & Title</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((faculty) => (
                <tr key={faculty.uid} className="hover:bg-slate-50/80 transition">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm">
                        {faculty.fullName.charAt(0)}
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block">{faculty.fullName}</span>
                        <span className="text-[11px] text-slate-400">UID: {faculty.uid.slice(0, 10)}...</span>
                      </div>
                    </div>
                  </td>

                  <td className="p-4 font-medium text-slate-700">{faculty.email}</td>

                  <td className="p-4">
                    <span className="font-semibold text-slate-800 block">{faculty.department}</span>
                    <span className="text-[11px] text-slate-500">{faculty.designation}</span>
                  </td>

                  <td className="p-4 text-center">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      faculty.active ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                    }`}>
                      {faculty.active ? 'Active' : 'Deactivated'}
                    </span>
                  </td>

                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleToggleStatus(faculty.uid, faculty.active)}
                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                        faculty.active
                          ? 'border border-rose-200 text-rose-700 hover:bg-rose-50'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                      }`}
                    >
                      <Power className="w-3.5 h-3.5" />
                      {faculty.active ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Provision Faculty Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 space-y-5 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5 text-rose-600">
                <Building2 className="w-5 h-5" />
                <h3 className="font-bold text-base text-slate-900">Provision Faculty / HOD Account</h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateFaculty} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Faculty Full Name *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Dr. K. Radhakrishnan"
                  className="w-full p-3 rounded-xl border border-slate-200 focus:border-rose-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Institutional Email *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. k.radhakrishnan@university.edu"
                  className="w-full p-3 rounded-xl border border-slate-200 focus:border-rose-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Department Major *</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 bg-white focus:border-rose-500 outline-none"
                  >
                    <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Electronics & Communication">Electronics & Communication</option>
                    <option value="Electrical & Electronics">Electrical & Electronics</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Academic Designation</label>
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="e.g. Professor & Head of Dept"
                    className="w-full p-3 rounded-xl border border-slate-200 focus:border-rose-500 outline-none"
                  >
                  </input>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Temporary Initial Password</label>
                <input
                  type="text"
                  value={initialPassword}
                  onChange={(e) => setInitialPassword(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 font-mono focus:border-rose-500 outline-none bg-slate-50"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Default password for initial sign-in</span>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs"
                >
                  Create Faculty Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
