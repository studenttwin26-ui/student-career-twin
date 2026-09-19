import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../firebase/authContext';
import { 
  Sparkles, 
  GraduationCap, 
  Building2, 
  ShieldCheck, 
  ArrowRight, 
  Target, 
  Cpu, 
  FileCheck2, 
  CheckCircle2, 
  Award, 
  TrendingUp, 
  BarChart3,
  Layers,
  Lock
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { currentUser } = useAuth();

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 pb-8 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center px-4 sm:px-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-50 border border-indigo-200 text-indigo-700 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            AI-Powered Career Intelligence & Placement Readiness Engine
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
            Student Twin
            <span className="block text-indigo-600 mt-1 text-3xl sm:text-4xl lg:text-5xl font-extrabold">
              Your Future, Smarter
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            A comprehensive placement intelligence system connecting students, faculty mentors, and placement directors with continuous readiness tracking, digital twins, and AI mentorship.
          </p>

          {/* Quick status if already logged in */}
          {currentUser && (
            <div className="mt-6 inline-flex items-center gap-3 p-2.5 px-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>You are logged in as <strong>{currentUser.fullName}</strong> ({currentUser.role.toUpperCase()})</span>
              <Link
                to={
                  currentUser.role === 'admin'
                    ? '/admin/dashboard'
                    : currentUser.role === 'faculty'
                    ? '/faculty/dashboard'
                    : '/student/dashboard'
                }
                className="ml-2 font-bold underline hover:text-emerald-950"
              >
                Go to Dashboard &rarr;
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* 3 Portal Entry Cards */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-slate-900">Choose Your Dedicated Portal</h2>
          <p className="text-sm text-slate-500 mt-1">
            Access credentials and permissions are verified against authoritative backend roles
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Student Card */}
          <div className="bg-white rounded-2xl p-7 border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-5">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-semibold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2.5 py-1 rounded-md">
                Role 01: Student
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-3">Student Twin Portal</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Build your Digital Career Twin, take core assessments (Java, Python, SQL, DSA, Aptitude), analyze resumes for ATS score, conduct AI mock interviews, and simulate placement readiness.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500 space-y-1.5">
                <p className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  Self-registration with college credentials
                </p>
                <p className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  Subject to Faculty/HOD approval workflow
                </p>
              </div>
            </div>

            <div className="mt-8 space-y-2">
              <Link
                to="/student-login"
                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 shadow-xs transition"
              >
                Enter Student Login <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/student-register"
                className="w-full py-2.5 px-4 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 border border-slate-200 transition"
              >
                New Student Self-Registration
              </Link>
            </div>
          </div>

          {/* Faculty Card */}
          <div className="bg-white rounded-2xl p-7 border border-slate-200 shadow-sm hover:shadow-md hover:border-amber-300 transition flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-5">
                <Building2 className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider bg-amber-50 px-2.5 py-1 rounded-md">
                Role 02: Faculty / HOD
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-3">Faculty Mentorship Portal</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Approve or reject student registration requests, track assigned students, inspect career twins, monitor readiness distributions, and record mentoring notes and action items.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500 space-y-1.5">
                <p className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  Scoped student visibility only
                </p>
                <p className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  Accounts provisioned strictly by Admin
                </p>
              </div>
            </div>

            <div className="mt-8">
              <Link
                to="/faculty-login"
                className="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 shadow-xs transition"
              >
                Enter Faculty Login <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="text-[11px] text-center text-slate-400 mt-2">
                No public registration (Admin created only)
              </p>
            </div>
          </div>

          {/* Admin Card */}
          <div className="bg-white rounded-2xl p-7 border border-slate-200 shadow-sm hover:shadow-md hover:border-rose-300 transition flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mb-5">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-semibold text-rose-700 uppercase tracking-wider bg-rose-50 px-2.5 py-1 rounded-md">
                Role 03: Administration
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-3">Placement Directorate</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Provision and deactivate Faculty accounts, assign student cohorts to mentors, manage corporate recruiters and eligibility criteria, and review tamper-evident audit logs.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500 space-y-1.5">
                <p className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  Campus-wide placement orchestration
                </p>
                <p className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  Pre-provisioned administrator identity
                </p>
              </div>
            </div>

            <div className="mt-8">
              <Link
                to="/admin-login"
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 shadow-xs transition"
              >
                Enter Directorate Login <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="text-[11px] text-center text-slate-400 mt-2">
                Restricted to authorized Placement Officers
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl">
          <div className="max-w-2xl mb-10">
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest">
              Core Capabilities
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-2">
              The 6 Pillars of the Unified Readiness Score
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2">
              Student Twin eliminates guesswork with an objective 0–100 composite index calculated by trusted logic across every critical dimension.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700">
              <div className="flex items-center justify-between">
                <Award className="w-6 h-6 text-indigo-400" />
                <span className="text-xs font-bold text-indigo-300 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-800">20% Weight</span>
              </div>
              <h4 className="font-bold text-base text-white mt-3">Academics & CGPA</h4>
              <p className="text-xs text-slate-300 mt-1">Calculates baseline scholastic discipline, semester progression, and backlog compliance.</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700">
              <div className="flex items-center justify-between">
                <Cpu className="w-6 h-6 text-blue-400" />
                <span className="text-xs font-bold text-blue-300 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800">25% Weight</span>
              </div>
              <h4 className="font-bold text-base text-white mt-3">Technical Skills & DSA</h4>
              <p className="text-xs text-slate-300 mt-1">Verified via timed skill assessments in Java, Python, SQL, DSA, and Quantitative Aptitude.</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700">
              <div className="flex items-center justify-between">
                <Layers className="w-6 h-6 text-emerald-400" />
                <span className="text-xs font-bold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">15% Weight</span>
              </div>
              <h4 className="font-bold text-base text-white mt-3">Production Projects</h4>
              <p className="text-xs text-slate-300 mt-1">Evaluates complexity, modern tech stack adoption, and real-world system architecture.</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700">
              <div className="flex items-center justify-between">
                <CheckCircle2 className="w-6 h-6 text-amber-400" />
                <span className="text-xs font-bold text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800">10% Weight</span>
              </div>
              <h4 className="font-bold text-base text-white mt-3">Industry Certifications</h4>
              <p className="text-xs text-slate-300 mt-1">Recognizes industry-standard cloud and developer credentials (AWS, Oracle, Google Cloud).</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700">
              <div className="flex items-center justify-between">
                <FileCheck2 className="w-6 h-6 text-rose-400" />
                <span className="text-xs font-bold text-rose-300 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-800">15% Weight</span>
              </div>
              <h4 className="font-bold text-base text-white mt-3">Resume ATS Calibration</h4>
              <p className="text-xs text-slate-300 mt-1">Automated screening against top recruiter ATS parsers, keyword density, and formatting.</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700">
              <div className="flex items-center justify-between">
                <Target className="w-6 h-6 text-purple-400" />
                <span className="text-xs font-bold text-purple-300 bg-purple-950/80 px-2 py-0.5 rounded border border-purple-800">15% Weight</span>
              </div>
              <h4 className="font-bold text-base text-white mt-3">AI Mock Interview</h4>
              <p className="text-xs text-slate-300 mt-1">Simulates real technical and behavioral rounds powered by server-side Gemini intelligence.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
