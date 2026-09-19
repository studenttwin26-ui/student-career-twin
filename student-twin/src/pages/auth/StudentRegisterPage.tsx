import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../firebase/authContext';
import { GraduationCap, ArrowRight, AlertCircle, CheckCircle2, User, Mail, Hash, Building, Award, Phone, Lock } from 'lucide-react';

export const StudentRegisterPage: React.FC = () => {
  const { registerStudent, loading } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [year, setYear] = useState('4');
  const [cgpa, setCgpa] = useState('8.2');
  const [backlogs, setBacklogs] = useState('0');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [targetRole, setTargetRole] = useState('Full-Stack Software Engineer');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName || !email || !rollNumber || !phoneNumber || !password) {
      setErrorMessage('Please fill out all required fields.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify your entries.');
      return;
    }

    const numCgpa = parseFloat(cgpa);
    if (isNaN(numCgpa) || numCgpa < 0 || numCgpa > 10) {
      setErrorMessage('CGPA must be a valid numeric value between 0.0 and 10.0');
      return;
    }

    setSubmitting(true);
    const result = await registerStudent({
      fullName,
      email,
      rollNumber,
      department,
      year,
      cgpa,
      backlogs,
      phoneNumber,
      targetRole,
      password,
      skills: ['Java', 'SQL', 'Data Structures']
    });
    setSubmitting(false);

    if (result.success) {
      navigate('/student-pending', { 
        state: { 
          justRegistered: true, 
          email, 
          fullName, 
          rollNumber, 
          department 
        } 
      });
    } else {
      setErrorMessage(result.error || 'Registration failed. Please review your details.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-10 px-4">
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xl">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3 shadow-xs">
            <GraduationCap className="w-6 h-6" />
          </div>
          <span className="text-[11px] font-semibold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2.5 py-1 rounded-md">
            Self-Registration
          </span>
          <h2 className="text-2xl font-black text-slate-900 mt-2">Student Account Registration</h2>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Create your account to establish your Digital Career Twin. Your account will undergo Faculty/HOD verification prior to activation.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Registration Issue</p>
              <p className="mt-0.5">{errorMessage}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  id="reg-fullname"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Kavitha Raman"
                  className="w-full text-xs pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none"
                />
              </div>
            </div>

            {/* College Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">College Email *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  id="reg-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="kavitha.21cs@college.edu"
                  className="w-full text-xs pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none"
                />
              </div>
            </div>

            {/* Roll Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Register / Roll Number *</label>
              <div className="relative">
                <Hash className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  id="reg-roll"
                  type="text"
                  required
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  placeholder="21CS152"
                  className="w-full text-xs pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number *</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  id="reg-phone"
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full text-xs pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none"
                />
              </div>
            </div>

            {/* Department */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Department *</label>
              <select
                id="reg-department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none bg-white"
              >
                <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Electronics & Comm.">Electronics & Comm. Engineering</option>
                <option value="Electrical Eng.">Electrical & Electronics Engineering</option>
                <option value="Mechanical Eng.">Mechanical Engineering</option>
                <option value="Civil Eng.">Civil Engineering</option>
              </select>
            </div>

            {/* Year */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Academic Year</label>
              <select
                id="reg-year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none bg-white"
              >
                <option value="4">Final Year (4th Year / Batch 2026)</option>
                <option value="3">Third Year (3rd Year / Batch 2027)</option>
                <option value="2">Second Year (2nd Year / Batch 2028)</option>
                <option value="1">First Year (1st Year / Batch 2029)</option>
              </select>
            </div>

            {/* CGPA */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Current CGPA (out of 10) *</label>
              <div className="relative">
                <Award className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  id="reg-cgpa"
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  required
                  value={cgpa}
                  onChange={(e) => setCgpa(e.target.value)}
                  placeholder="8.50"
                  className="w-full text-xs pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none"
                />
              </div>
            </div>

            {/* Active Backlogs */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Standing Backlogs</label>
              <input
                id="reg-backlogs"
                type="number"
                min="0"
                value={backlogs}
                onChange={(e) => setBacklogs(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none"
              />
            </div>
          </div>

          {/* Target Role */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Primary Target Job Role</label>
            <input
              id="reg-target-role"
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. SDE-1 / Software Engineer / Cloud Architect"
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Create Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  id="reg-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="w-full text-xs pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none"
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  id="reg-confirm-password"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat password"
                  className="w-full text-xs pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5 mt-2">
            <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p>
              <strong>Approval Workflow Note:</strong> Your account status will initialize as <strong>PENDING</strong>. Your department Faculty / HOD mentor will review and approve your registration before full Student Twin features are accessible.
            </p>
          </div>

          <button
            id="btn-submit-registration"
            type="submit"
            disabled={submitting || loading}
            className="w-full mt-4 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-100 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {submitting ? 'Submitting Registration...' : 'Complete Student Registration'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500">
          Already registered?{' '}
          <Link to="/student-login" className="font-bold text-indigo-600 hover:underline">
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
};
