import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../firebase/authContext';
import { 
  Award, 
  Sparkles, 
  ArrowRight, 
  TrendingUp, 
  CheckCircle2, 
  BookOpen, 
  FileText, 
  MessagesSquare, 
  Target, 
  Building, 
  Crosshair, 
  ShieldCheck, 
  AlertCircle,
  Briefcase
} from 'lucide-react';

export const StudentDashboardPage: React.FC = () => {
  const { studentProfile } = useAuth();

  if (!studentProfile) return null;

  const score = studentProfile.readinessScore || 0;
  const breakdown = studentProfile.scoreBreakdown || {
    academics: 16,
    technicalSkills: 18,
    projects: 11,
    certifications: 6,
    resumeAts: 11,
    mockInterview: 10
  };

  const getScoreColor = (val: number) => {
    if (val >= 80) return 'text-emerald-600 stroke-emerald-600 bg-emerald-50 border-emerald-200';
    if (val >= 60) return 'text-indigo-600 stroke-indigo-600 bg-indigo-50 border-indigo-200';
    return 'text-amber-600 stroke-amber-600 bg-amber-50 border-amber-200';
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-white/10 text-indigo-200 backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            Autonomous Career Readiness Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Welcome back, {studentProfile.fullName}!
          </h1>
          <p className="text-xs sm:text-sm text-indigo-200 max-w-xl">
            Your Digital Career Twin is actively analyzing campus placement benchmarks. Review your readiness score breakdown and targeted action steps below.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
          <Link
            to="/student/career-twin"
            className="px-5 py-2.5 rounded-xl bg-white text-slate-900 hover:bg-indigo-50 text-xs font-bold shadow-sm flex items-center gap-2 transition"
          >
            Explore Career Twin <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/student/mock-interview"
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 transition border border-indigo-400/40"
          >
            Take AI Mock Interview
          </Link>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Unified Readiness Score Dial Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Unified Readiness Score
              </span>
              <span className={`text-xs font-extrabold px-2.5 py-1 rounded-full border ${getScoreColor(score)}`}>
                {score >= 80 ? 'Placement Ready' : score >= 60 ? 'Competitive' : 'Needs Focus'}
              </span>
            </div>

            {/* Score Visual Dial */}
            <div className="my-6 flex flex-col items-center">
              <div className="relative w-40 h-40 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    className="text-slate-100 stroke-current"
                    strokeWidth="10"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    className={getScoreColor(score)}
                    strokeWidth="10"
                    strokeDasharray={`${(score / 100) * 251.2} 251.2`}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-4xl font-black text-slate-900">{score}</span>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Out of 100</span>
                </div>
              </div>
              <p className="text-xs text-center text-slate-500 mt-2 max-w-xs">
                Computed via verified assessments, ATS calibrations, GPA, and interview evaluations.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Department Mentor:</span>
            <span className="font-semibold text-indigo-700">
              {studentProfile.assignedFacultyName || 'Assigned Faculty'}
            </span>
          </div>
        </div>

        {/* 6 Pillars Breakdown */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-bold text-slate-900">Readiness Score Breakdown</h3>
              <p className="text-xs text-slate-500">Continuous weighted evaluation according to university placement rules</p>
            </div>
            <Link to="/student/career-twin" className="text-xs font-semibold text-indigo-600 hover:underline">
              Detailed Breakdown &rarr;
            </Link>
          </div>

          <div className="space-y-4">
            {/* 1. Academics: 20% */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                  Academics & CGPA ({studentProfile.cgpa} / 10)
                </span>
                <span className="font-bold text-slate-900">{breakdown.academics} / 20 pts</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-indigo-600 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${(breakdown.academics / 20) * 100}%` }}
                />
              </div>
            </div>

            {/* 2. Technical Skills: 25% */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-blue-600" />
                  Technical Skills & Assessments
                </span>
                <span className="font-bold text-slate-900">{breakdown.technicalSkills} / 25 pts</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-blue-600 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${(breakdown.technicalSkills / 25) * 100}%` }}
                />
              </div>
            </div>

            {/* 3. Projects: 15% */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
                  Production Projects ({studentProfile.projects?.length || 0} documented)
                </span>
                <span className="font-bold text-slate-900">{breakdown.projects} / 15 pts</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-600 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${(breakdown.projects / 15) * 100}%` }}
                />
              </div>
            </div>

            {/* 4. Certifications: 10% */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                  Verified Certifications ({studentProfile.certifications?.length || 0} active)
                </span>
                <span className="font-bold text-slate-900">{breakdown.certifications} / 10 pts</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-amber-600 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${(breakdown.certifications / 10) * 100}%` }}
                />
              </div>
            </div>

            {/* 5. Resume / ATS: 15% */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-rose-600" />
                  Resume / ATS Calibration
                </span>
                <span className="font-bold text-slate-900">{breakdown.resumeAts} / 15 pts</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-rose-600 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${(breakdown.resumeAts / 15) * 100}%` }}
                />
              </div>
            </div>

            {/* 6. Mock Interview: 15% */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <MessagesSquare className="w-3.5 h-3.5 text-purple-600" />
                  AI Mock Interview Performance
                </span>
                <span className="font-bold text-slate-900">{breakdown.mockInterview} / 15 pts</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-purple-600 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${(breakdown.mockInterview / 15) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Access Action Hub */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/student/assessments"
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-md transition group"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 group-hover:bg-indigo-600 group-hover:text-white transition">
            <BookOpen className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-sm text-slate-900">Take Assessment</h4>
          <p className="text-xs text-slate-500 mt-1">Timed tests in Java, Python, SQL, DSA & Aptitude.</p>
        </Link>

        <Link
          to="/student/resume-analyzer"
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-rose-400 hover:shadow-md transition group"
        >
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-3 group-hover:bg-rose-600 group-hover:text-white transition">
            <FileText className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-sm text-slate-900">ATS Resume Scanner</h4>
          <p className="text-xs text-slate-500 mt-1">Check keyword density and ATS compatibility score.</p>
        </Link>

        <Link
          to="/student/companies"
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-400 hover:shadow-md transition group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:bg-emerald-600 group-hover:text-white transition">
            <Building className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-sm text-slate-900">Check Eligibility</h4>
          <p className="text-xs text-slate-500 mt-1">Instant criteria verification for Google, TCS, Zoho, etc.</p>
        </Link>

        <Link
          to="/student/placement-simulator"
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-purple-400 hover:shadow-md transition group"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3 group-hover:bg-purple-600 group-hover:text-white transition">
            <Crosshair className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-sm text-slate-900">Placement Simulator</h4>
          <p className="text-xs text-slate-500 mt-1">Simulate hiring probability and bridge skill gaps.</p>
        </Link>
      </div>

      {/* Target Roles & Academic Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
            Target Placement Roles
          </span>
          <div className="flex flex-wrap gap-2 mt-2">
            {studentProfile.targetRoles?.map((role, idx) => (
              <span key={idx} className="px-3 py-1 bg-indigo-50 text-indigo-800 rounded-lg text-xs font-semibold border border-indigo-100">
                {role}
              </span>
            ))}
          </div>
        </div>

        <div className="text-left sm:text-right text-xs text-slate-500">
          <p>Academic Cohort: <strong className="text-slate-800">Year {studentProfile.year}</strong></p>
          <p>Standing Backlogs: <strong className="text-emerald-700">{studentProfile.backlogs}</strong></p>
        </div>
      </div>
    </div>
  );
};
