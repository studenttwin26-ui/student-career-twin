import React, { useState } from 'react';
import { useAuth } from '../../firebase/authContext';
import { MOCK_COMPANIES } from '../../data/mockData';
import { CompanyCriteria } from '../../types';
import { 
  Crosshair, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ArrowRight, 
  Building, 
  Cpu, 
  Zap, 
  Award,
  BarChart3
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const PlacementSimulatorPage: React.FC = () => {
  const { studentProfile } = useAuth();
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(MOCK_COMPANIES[0].id);

  if (!studentProfile) return null;

  const company = MOCK_COMPANIES.find((c) => c.id === selectedCompanyId) || MOCK_COMPANIES[0];
  const studentSkills = (studentProfile.skills || []).map((s) => s.name.toLowerCase());
  const score = studentProfile.readinessScore || 0;

  // Calculate Match Score based on:
  // 1. CGPA vs minCgpa (30%)
  // 2. Backlogs vs maxBacklogs (20%)
  // 3. Department match (15%)
  // 4. Skills match percentage (35%)
  const cgpaRatio = Math.min(1, studentProfile.cgpa / company.minCgpa);
  const backlogFactor = studentProfile.backlogs <= company.maxBacklogs ? 1 : 0.4;
  const deptMatch = company.eligibleDepartments.some((d) =>
    studentProfile.department.toLowerCase().includes(d.toLowerCase()) || d.toLowerCase().includes(studentProfile.department.toLowerCase())
  ) ? 1 : 0.3;

  const matchedSkills = company.requiredSkills.filter((req) =>
    studentSkills.some((s) => s.includes(req.toLowerCase()))
  );
  const missingSkills = company.requiredSkills.filter(
    (req) => !studentSkills.some((s) => s.includes(req.toLowerCase()))
  );
  const skillRatio = matchedSkills.length / company.requiredSkills.length;

  const matchPercentage = Math.round(
    (cgpaRatio * 30) + (backlogFactor * 20) + (deptMatch * 15) + (skillRatio * 35)
  );

  // Missing criteria list
  const missingCriteria: string[] = [];
  if (studentProfile.cgpa < company.minCgpa) {
    missingCriteria.push(`CGPA is ${studentProfile.cgpa}, below requirement of ${company.minCgpa}`);
  }
  if (studentProfile.backlogs > company.maxBacklogs) {
    missingCriteria.push(`Standing backlogs (${studentProfile.backlogs}) exceed company ceiling (${company.maxBacklogs})`);
  }
  if (deptMatch < 1) {
    missingCriteria.push(`Department (${studentProfile.department}) not listed in eligible branches`);
  }

  // Recommended improvements to crack company drive
  const recommendedImprovements = [
    ...(missingSkills.map((sk) => `Master ${sk} through targeted assessments and integrate into a featured project`)),
    studentProfile.cgpa < company.minCgpa ? `Boost cumulative semester GPA to clear ${company.minCgpa} cutoff` : null,
    score < 80 ? 'Elevate ATS Resume Calibration and AI Mock Interview score above 85' : null,
    `Solve company-specific archives for ${company.name} on campus portal`
  ].filter(Boolean) as string[];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200 mb-2">
            <Crosshair className="w-3.5 h-3.5 text-purple-600" />
            Predictive Campus Placement Match Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Placement Simulator
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
            Simulate your likelihood of clearing screening and technical rounds for any partner company. Identifies exact deficits and actionable bridges.
          </p>
        </div>

        {/* Company Selector Dropdown */}
        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 shrink-0">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Select Recruiter To Simulate:
          </label>
          <select
            value={selectedCompanyId}
            onChange={(e) => setSelectedCompanyId(e.target.value)}
            className="text-xs font-bold text-slate-900 bg-white px-3 py-2 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none w-56"
          >
            {MOCK_COMPANIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.tier})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Simulator Results Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Match Score Gauge */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm flex flex-col justify-between text-center">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Profile Match Probability
            </span>
            <div className="my-5 flex flex-col items-center">
              <div className="relative w-36 h-36 flex items-center justify-center">
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
                    className={matchPercentage >= 80 ? 'text-emerald-500 stroke-current' : matchPercentage >= 65 ? 'text-indigo-500 stroke-current' : 'text-amber-500 stroke-current'}
                    strokeWidth="10"
                    strokeDasharray={`${(matchPercentage / 100) * 251.2} 251.2`}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-4xl font-black text-slate-900">{matchPercentage}%</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Match Score</span>
                </div>
              </div>

              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                matchPercentage >= 80
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : matchPercentage >= 65
                  ? 'bg-indigo-50 text-indigo-800 border-indigo-200'
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}>
                {matchPercentage >= 80 ? 'High Hiring Probability' : matchPercentage >= 65 ? 'Competitive Candidate' : 'Bridge Required'}
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 space-y-1">
            <p>Target Company: <strong className="text-slate-800">{company.name}</strong></p>
            <p>Annual Compensation: <strong className="text-emerald-700">{company.package}</strong></p>
          </div>
        </div>

        {/* Breakdown of Comparison Dimensions */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Student Profile vs Company Criteria</h3>
            <span className="text-xs text-slate-500">Tier: {company.tier}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* CGPA Check */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-600">CGPA Requirement</span>
                {studentProfile.cgpa >= company.minCgpa ? (
                  <span className="text-emerald-700 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Met</span>
                ) : (
                  <span className="text-rose-700 flex items-center gap-1"><XCircle className="w-3.5 h-3.5" /> Deficit</span>
                )}
              </div>
              <p className="text-xs text-slate-800 mt-2">
                Your CGPA: <strong>{studentProfile.cgpa}</strong> (Minimum required: <strong>{company.minCgpa}</strong>)
              </p>
            </div>

            {/* Backlogs Check */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-600">Backlog Tolerance</span>
                {studentProfile.backlogs <= company.maxBacklogs ? (
                  <span className="text-emerald-700 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Met</span>
                ) : (
                  <span className="text-rose-700 flex items-center gap-1"><XCircle className="w-3.5 h-3.5" /> Exceeded</span>
                )}
              </div>
              <p className="text-xs text-slate-800 mt-2">
                Your Backlogs: <strong>{studentProfile.backlogs}</strong> (Max allowed: <strong>{company.maxBacklogs}</strong>)
              </p>
            </div>

            {/* Department Match */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-600">Branch Eligibility</span>
                {deptMatch === 1 ? (
                  <span className="text-emerald-700 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Eligible</span>
                ) : (
                  <span className="text-rose-700 flex items-center gap-1"><XCircle className="w-3.5 h-3.5" /> Not Listed</span>
                )}
              </div>
              <p className="text-xs text-slate-800 mt-2 truncate">
                Branch: <strong>{studentProfile.department}</strong>
              </p>
            </div>

            {/* Skills Match Rate */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-600">Skill Alignment</span>
                <span className="text-indigo-700 font-extrabold">{matchedSkills.length} / {company.requiredSkills.length} Verified</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mt-2.5">
                <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${(matchedSkills.length / company.requiredSkills.length) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Missing Skills & Missing Criteria (Mandated by prompt) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Missing Skills */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2 mb-3">
            <Cpu className="w-4 h-4 text-purple-600" />
            Identified Missing Skills for {company.name} ({missingSkills.length})
          </h4>
          {missingSkills.length > 0 ? (
            <div className="space-y-2">
              {missingSkills.map((sk, idx) => (
                <div key={idx} className="p-3 bg-purple-50/60 border border-purple-200 rounded-xl text-xs flex items-center justify-between">
                  <span className="font-bold text-purple-900">{sk}</span>
                  <Link to="/student/assessments" className="text-[11px] font-semibold text-indigo-600 hover:underline">
                    Practice Now &rarr;
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>You have demonstrated all core technical skills required by this employer!</span>
            </div>
          )}
        </div>

        {/* Missing Criteria */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            Unmet Placement Screening Criteria ({missingCriteria.length})
          </h4>
          {missingCriteria.length > 0 ? (
            <div className="space-y-2">
              {missingCriteria.map((crit, idx) => (
                <div key={idx} className="p-3 bg-amber-50/60 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{crit}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>All baseline academic and backlog eligibility criteria fully satisfied.</span>
            </div>
          )}
        </div>
      </div>

      {/* Recommended Improvements to Become Eligible (Prompt requirement) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Personalized Strategy to Clear {company.name} Placement Drive
            </h3>
            <p className="text-xs text-slate-500">Autonomous actionable roadmaps recommended by Student Twin</p>
          </div>
        </div>

        <div className="space-y-3">
          {recommendedImprovements.map((imp, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <span className="text-xs font-semibold text-slate-800">{imp}</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
