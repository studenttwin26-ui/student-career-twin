import React, { useState } from 'react';
import { MOCK_COMPANIES } from '../../data/mockData';
import { CompanyCriteria } from '../../types';
import { Briefcase, Plus, Edit3, Trash2, CheckCircle2, Search, Building } from 'lucide-react';

export const CompanyManagementPage: React.FC = () => {
  const [companies, setCompanies] = useState<CompanyCriteria[]>(MOCK_COMPANIES);
  const [showAddModal, setShowAddModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // New Company form
  const [name, setName] = useState('');
  const [tier, setTier] = useState<'Tier-1 Product' | 'Tier-2 Product' | 'Mass IT'>('Tier-1 Product');
  const [minCgpa, setMinCgpa] = useState<number>(7.5);
  const [maxBacklogs, setMaxBacklogs] = useState<number>(0);
  const [packageAmount, setPackageAmount] = useState('18 - 24 LPA');
  const [skillsInput, setSkillsInput] = useState('Data Structures, System Design, React');
  const [deptsInput, setDeptsInput] = useState('CSE, IT, ECE');

  const handleAddCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newCompany: CompanyCriteria = {
      id: `comp_${Date.now()}`,
      name: name.trim(),
      tier,
      minCgpa,
      maxBacklogs,
      package: packageAmount,
      requiredSkills: skillsInput.split(',').map((s) => s.trim()).filter(Boolean),
      eligibleDepartments: deptsInput.split(',').map((d) => d.trim()).filter(Boolean),
      roles: ['Software Engineer', 'Associate Developer']
    };

    setCompanies([newCompany, ...companies]);
    setShowAddModal(false);
    setName('');
    setSuccessMessage(`Recruiter criteria for ${newCompany.name} registered successfully!`);
    setTimeout(() => setSuccessMessage(''), 3500);
  };

  const handleDelete = (id: string) => {
    setCompanies((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200 mb-2">
            <Briefcase className="w-3.5 h-3.5 text-rose-600" />
            Corporate Placement Policy Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Company Placement Criteria
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
            Configure screening cutoffs, minimum CGPA thresholds, allowable backlogs, and mandatory skills for campus hiring partners.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Corporate Recruiter
        </button>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Recruiter Criteria Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map((comp) => (
          <div
            key={comp.id}
            className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-rose-300 transition"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {comp.tier}
                  </span>
                  <h3 className="font-bold text-base text-slate-900 mt-1">{comp.name}</h3>
                </div>
                <button
                  onClick={() => handleDelete(comp.id)}
                  className="text-slate-400 hover:text-rose-600 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-4 p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Compensation:</span>
                  <span className="font-bold text-emerald-700">{comp.package}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Min CGPA:</span>
                  <span className="font-bold text-slate-800">{comp.minCgpa} / 10.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Max Backlogs:</span>
                  <span className="font-bold text-slate-800">{comp.maxBacklogs}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Branches:</span>
                  <span className="font-medium text-slate-700 truncate max-w-[150px]">{comp.eligibleDepartments.join(', ')}</span>
                </div>
              </div>

              <div className="mt-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Required Skills:
                </span>
                <div className="flex flex-wrap gap-1">
                  {comp.requiredSkills.map((sk, i) => (
                    <span key={i} className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
              Active Placement Criteria
            </div>
          </div>
        ))}
      </div>

      {/* Add Recruiter Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 space-y-5 animate-fade-in">
            <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-3">
              Add Campus Recruiting Partner
            </h3>

            <form onSubmit={handleAddCompany} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Company Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Cisco Systems"
                  className="w-full p-3 rounded-xl border border-slate-200 focus:border-rose-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Company Tier</label>
                  <select
                    value={tier}
                    onChange={(e) => setTier(e.target.value as any)}
                    className="w-full p-3 rounded-xl border border-slate-200 bg-white focus:border-rose-500 outline-none"
                  >
                    <option value="Tier-1 Product">Tier-1 Product</option>
                    <option value="Tier-2 Product">Tier-2 Product</option>
                    <option value="Mass IT">Mass IT</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">CTC Package</label>
                  <input
                    type="text"
                    value={packageAmount}
                    onChange={(e) => setPackageAmount(e.target.value)}
                    placeholder="e.g. 15 - 18 LPA"
                    className="w-full p-3 rounded-xl border border-slate-200 focus:border-rose-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Min CGPA</label>
                  <input
                    type="number"
                    step="0.1"
                    value={minCgpa}
                    onChange={(e) => setMinCgpa(parseFloat(e.target.value))}
                    className="w-full p-3 rounded-xl border border-slate-200 focus:border-rose-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Max Allowable Backlogs</label>
                  <input
                    type="number"
                    value={maxBacklogs}
                    onChange={(e) => setMaxBacklogs(parseInt(e.target.value))}
                    className="w-full p-3 rounded-xl border border-slate-200 focus:border-rose-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mandatory Skills (Comma separated)</label>
                <input
                  type="text"
                  value={skillsInput}
                  onChange={(e) => setSkillsInput(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:border-rose-500 outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs"
                >
                  Save Recruiter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
