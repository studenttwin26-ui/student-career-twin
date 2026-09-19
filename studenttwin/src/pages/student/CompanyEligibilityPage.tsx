import React, { useState } from 'react';
import { useAuth } from '../../firebase/authContext';
import { MOCK_COMPANIES } from '../../data/mockData';
import { CompanyCriteria } from '../../types';
import { 
  Building, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Search, 
  DollarSign, 
  Award, 
  ExternalLink,
  ChevronRight,
  Filter
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const CompanyEligibilityPage: React.FC = () => {
  const { studentProfile } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTier, setFilterTier] = useState<string>('all');

  if (!studentProfile) return null;

  const studentSkills = (studentProfile.skills || []).map((s) => s.name.toLowerCase());
  const studentCgpa = studentProfile.cgpa;
  const studentBacklogs = studentProfile.backlogs;
  const studentDept = studentProfile.department;

  // Evaluate eligibility function
  const evaluateEligibility = (company: CompanyCriteria) => {
    const reasons: string[] = [];
    let eligible = true;

    // CGPA
    if (studentCgpa < company.minCgpa) {
      eligible = false;
      reasons.push(`CGPA is ${studentCgpa}, but ${company.name} requires at least ${company.minCgpa}`);
    }

    // Backlogs
    if (studentBacklogs > company.maxBacklogs) {
      eligible = false;
      reasons.push(`You have ${studentBacklogs} standing backlogs (maximum permitted is ${company.maxBacklogs})`);
    }

    // Department
    const deptMatch = company.eligibleDepartments.some((d) =>
      studentDept.toLowerCase().includes(d.toLowerCase()) || d.toLowerCase().includes(studentDept.toLowerCase())
    );
    if (!deptMatch) {
      eligible = false;
      reasons.push(`Your department (${studentDept}) is not among eligible streams (${company.eligibleDepartments.join(', ')})`);
    }

    // Skills match
    const missingSkills = company.requiredSkills.filter(
      (req) => !studentSkills.some((s) => s.includes(req.toLowerCase()))
    );

    let status: 'Eligible' | 'Not Eligible' | 'Needs Improvement' = 'Eligible';
    if (!eligible) {
      status = 'Not Eligible';
    } else if (missingSkills.length > 0) {
      status = 'Needs Improvement';
      reasons.push(`Missing key target skills: ${missingSkills.join(', ')}`);
    } else {
      reasons.push('Meets all academic, backlog, department, and core skill requirements.');
    }

    return { status, reasons, missingSkills };
  };

  const filteredCompanies = MOCK_COMPANIES.filter((comp) => {
    const matchesSearch = comp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          comp.roles.some((r) => r.toLowerCase().includes(searchTerm.toLowerCase()));
    if (!matchesSearch) return false;
    if (filterTier !== 'all' && comp.tier !== filterTier) return false;
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-2">
            <Building className="w-3.5 h-3.5 text-emerald-600" />
            Campus Hiring Directory & Policy Verification
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Company Placement Eligibility
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
            Live compliance verification of your CGPA, active backlogs, department, and technical skills against top recruiting partners.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/student/placement-simulator"
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition"
          >
            Launch Placement Simulator &rarr;
          </Link>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search company or job role..."
            className="w-full text-xs pl-10 pr-3.5 py-2 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 font-medium">Filter Tier:</span>
          <select
            value={filterTier}
            onChange={(e) => setFilterTier(e.target.value)}
            className="text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white focus:border-indigo-500 outline-none"
          >
            <option value="all">All Tiers</option>
            <option value="Tier-1 Product">Tier-1 Product</option>
            <option value="Tier-2 Product">Tier-2 Product</option>
            <option value="Mass IT">Mass IT Recruiter</option>
          </select>
        </div>
      </div>

      {/* Company Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCompanies.map((company) => {
          const evalResult = evaluateEligibility(company);
          const isEligible = evalResult.status === 'Eligible';
          const isNeedsImprovement = evalResult.status === 'Needs Improvement';

          return (
            <div
              key={company.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-indigo-200 transition"
            >
              <div>
                {/* Top Company Info */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {company.tier}
                    </span>
                    <h3 className="font-bold text-lg text-slate-900 mt-1">{company.name}</h3>
                    <p className="text-xs text-slate-500">Package: <strong className="text-slate-800">{company.package}</strong></p>
                  </div>

                  {/* Status Badge strictly from requirements */}
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${
                    isEligible
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : isNeedsImprovement
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : 'bg-rose-50 text-rose-800 border-rose-200'
                  }`}>
                    {isEligible ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : isNeedsImprovement ? (
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-rose-600" />
                    )}
                    {evalResult.status}
                  </span>
                </div>

                {/* Criteria Specifications */}
                <div className="mt-4 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600 grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Min CGPA:</span>
                    <span className="font-semibold text-slate-800">{company.minCgpa} / 10.0</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Max Backlogs:</span>
                    <span className="font-semibold text-slate-800">{company.maxBacklogs}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400 block text-[11px]">Eligible Branches:</span>
                    <span className="font-medium text-slate-800 truncate block">
                      {company.eligibleDepartments.join(', ')}
                    </span>
                  </div>
                </div>

                {/* Required Skills */}
                <div className="mt-4">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
                    Required Competencies:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {company.requiredSkills.map((sk, idx) => {
                      const hasSkill = studentSkills.some((s) => s.includes(sk.toLowerCase()));
                      return (
                        <span
                          key={idx}
                          className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
                            hasSkill
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}
                        >
                          {sk} {hasSkill && '✓'}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Explanation of Why Student is or is not Eligible */}
                <div className="mt-4 p-3 rounded-xl border text-xs bg-slate-50/70 border-slate-200 space-y-1">
                  <p className="font-bold text-slate-700">Eligibility Explanation:</p>
                  {evalResult.reasons.map((reason, i) => (
                    <p key={i} className="text-slate-600 flex items-start gap-1.5">
                      <span className="text-indigo-600 font-bold">•</span>
                      <span>{reason}</span>
                    </p>
                  ))}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">Roles: {company.roles.join(', ')}</span>
                <Link
                  to="/student/placement-simulator"
                  className="text-xs font-bold text-indigo-600 hover:underline inline-flex items-center gap-1"
                >
                  Simulate Drive &rarr;
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
