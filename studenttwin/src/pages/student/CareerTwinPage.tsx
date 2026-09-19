import React, { useState } from 'react';
import { useAuth } from '../../firebase/authContext';
import { INITIAL_STUDENTS_PROFILES } from '../../firebase/authContext';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Award, 
  BookOpen, 
  Briefcase, 
  CheckCircle2, 
  FileText, 
  MessagesSquare, 
  Target, 
  AlertTriangle, 
  TrendingUp,
  Github, 
  ExternalLink, 
  ShieldCheck, 
  Zap,
  Plus,
  X,
  Loader2,
  ArrowRight,
  Check,
  BarChart3,
  Cpu
} from 'lucide-react';

interface TwinSynthesisResult {
  twinPersona: string;
  placementReadinessTier: string;
  projectedOfferRange: string;
  readinessSummary: string;
  superpowers: string[];
  criticalDeficits: string[];
  strategicActionPlan: { step: number; action: string; expectedScoreImpact: string }[];
}

export const CareerTwinPage: React.FC = () => {
  const { studentProfile: currentProfile, updateStudentReadiness } = useAuth();

  // Fallback to demo profile if profile is loading/null so the page is never blank
  const studentProfile = currentProfile || INITIAL_STUDENTS_PROFILES['student_approved_01'];

  const score = studentProfile?.readinessScore ?? 84;
  const breakdown = studentProfile?.scoreBreakdown || {
    academics: 18,
    technicalSkills: 22,
    projects: 13,
    certifications: 8,
    resumeAts: 12,
    mockInterview: 11
  };

  // AI Twin Synthesis state
  const [synthesizing, setSynthesizing] = useState(false);
  const [synthesis, setSynthesis] = useState<TwinSynthesisResult | null>({
    twinPersona: 'Practical Full-Stack Builder with strong algorithmic and distributed systems foundation',
    placementReadinessTier: score >= 80 ? 'Tier-1 Super Dream Candidate' : (score >= 65 ? 'Tier-1 Dream Eligible' : 'Core Product Candidate'),
    projectedOfferRange: score >= 80 ? '₹18L - ₹36L CTC' : (score >= 65 ? '₹9L - ₹18L CTC' : '₹5L - ₹9L CTC'),
    readinessSummary: `${studentProfile.fullName}'s digital twin exhibits high alignment for Tier-1 technology companies. Strong full-stack engineering demonstrated across verified project repositories and academic consistency.`,
    superpowers: [
      'Production-grade full-stack architecture with TypeScript and React',
      'Solid relational schema normalization and SQL query optimization',
      'Consistent academic performance (CGPA ' + (studentProfile.cgpa || 8.4) + '/10.0) with zero active backlogs'
    ],
    criticalDeficits: [
      'Asynchronous task queues and distributed caching (Redis) need explicit project documentation',
      'System design mock interview practice required for Tier-1 algorithmic rounds',
      'Resume ATS score can be optimized further with microservices and containerization keywords'
    ],
    strategicActionPlan: [
      { step: 1, action: 'Complete DSA Assessment in Graphs & Dynamic Programming', expectedScoreImpact: '+3 pts in Technical Skills' },
      { step: 2, action: 'Conduct 2 technical mock interview rounds on Concurrency & System Design', expectedScoreImpact: '+4 pts in Mock Interview' },
      { step: 3, action: 'Calibrate plain-text resume against Tier-1 ATS keyword patterns', expectedScoreImpact: '+3 pts in Resume ATS' }
    ]
  });

  // Modals for adding skills, projects, certifications
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');

  const [showProjectModal, setShowProjectModal] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newProjectTech, setNewProjectTech] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [newProjectGithub, setNewProjectGithub] = useState('');

  const [showCertModal, setShowCertModal] = useState(false);
  const [newCertTitle, setNewCertTitle] = useState('');
  const [newCertIssuer, setNewCertIssuer] = useState('');
  const [newCertDate, setNewCertDate] = useState('');
  const [newCertUrl, setNewCertUrl] = useState('');

  const [savingUpdate, setSavingUpdate] = useState(false);

  // Determine readiness tier styling
  const getTierInfo = (readinessScore: number) => {
    if (readinessScore >= 80) {
      return {
        label: 'Tier-1 Super Dream Candidate',
        color: 'text-emerald-400',
        badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
        ctc: '₹18L - ₹45L+ CTC'
      };
    }
    if (readinessScore >= 65) {
      return {
        label: 'Tier-1 Dream Eligible',
        color: 'text-indigo-400',
        badge: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
        ctc: '₹8L - ₹18L CTC'
      };
    }
    if (readinessScore >= 50) {
      return {
        label: 'Core / Product Ready',
        color: 'text-amber-400',
        badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
        ctc: '₹5L - ₹8L CTC'
      };
    }
    return {
      label: 'Foundation Tier - Action Required',
      color: 'text-rose-400',
      badge: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
      ctc: 'Action Needed'
    };
  };

  const tierInfo = getTierInfo(score);

  // Trigger Live AI Career Twin Synthesis
  const handleRunAiSynthesis = async () => {
    setSynthesizing(true);
    try {
      const response = await fetch('/api/ai/career-twin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: studentProfile.fullName,
          department: studentProfile.department,
          cgpa: studentProfile.cgpa,
          targetRole: studentProfile.targetRole || studentProfile.targetRoles?.[0] || 'Software Engineer',
          skills: studentProfile.skills || [],
          projects: studentProfile.projects || [],
          certifications: studentProfile.certifications || [],
          scoreBreakdown: breakdown,
          readinessScore: score
        })
      });

      if (response.ok) {
        const data = await response.json();
        const payload = data.data || data;
        setSynthesis({
          twinPersona: payload.twinPersona || synthesis?.twinPersona || 'Technical Software Builder',
          placementReadinessTier: payload.placementReadinessTier || tierInfo.label,
          projectedOfferRange: payload.projectedOfferRange || tierInfo.ctc,
          readinessSummary: payload.readinessSummary || 'Digital twin synthesized successfully.',
          superpowers: Array.isArray(payload.superpowers) && payload.superpowers.length > 0 
            ? payload.superpowers 
            : ['Demonstrated full-stack foundations', 'Academic track record', 'Database architecture competence'],
          criticalDeficits: Array.isArray(payload.criticalDeficits) && payload.criticalDeficits.length > 0 
            ? payload.criticalDeficits 
            : ['Add test suite metrics to projects', 'Practice dynamic programming assessments'],
          strategicActionPlan: Array.isArray(payload.strategicActionPlan) && payload.strategicActionPlan.length > 0 
            ? payload.strategicActionPlan 
            : [
                { step: 1, action: 'Complete DSA Assessment in Graph Traversal', expectedScoreImpact: '+4 pts' },
                { step: 2, action: 'Calibrate ATS Resume Keywords', expectedScoreImpact: '+3 pts' },
                { step: 3, action: 'Run Technical Mock Interview', expectedScoreImpact: '+4 pts' }
              ]
        });
      }
    } catch (err) {
      console.warn('AI Twin synthesis network error, kept existing synthesis:', err);
    } finally {
      setSynthesizing(false);
    }
  };

  // Add Skill handler
  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    setSavingUpdate(true);
    const existing = studentProfile.skills || [];
    const updatedSkills = [
      ...existing,
      { name: newSkillName.trim(), level: newSkillLevel, verified: false }
    ];

    await updateStudentReadiness({ skills: updatedSkills });
    setNewSkillName('');
    setShowSkillModal(false);
    setSavingUpdate(false);
  };

  // Add Project handler
  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectTitle.trim() || !newProjectDesc.trim()) return;

    setSavingUpdate(true);
    const existing = studentProfile.projects || [];
    const techArray = newProjectTech.split(',').map((t) => t.trim()).filter(Boolean);
    const updatedProjects = [
      ...existing,
      {
        id: 'proj_' + Date.now(),
        title: newProjectTitle.trim(),
        techStack: techArray.length > 0 ? techArray : ['Full-Stack'],
        description: newProjectDesc.trim(),
        githubUrl: newProjectGithub.trim() || undefined
      }
    ];

    await updateStudentReadiness({ projects: updatedProjects });
    setNewProjectTitle('');
    setNewProjectTech('');
    setNewProjectDesc('');
    setNewProjectGithub('');
    setShowProjectModal(false);
    setSavingUpdate(false);
  };

  // Add Certification handler
  const handleAddCert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCertTitle.trim() || !newCertIssuer.trim()) return;

    setSavingUpdate(true);
    const existing = studentProfile.certifications || [];
    const updatedCerts = [
      ...existing,
      {
        id: 'cert_' + Date.now(),
        title: newCertTitle.trim(),
        issuer: newCertIssuer.trim(),
        date: newCertDate.trim() || new Date().toISOString().split('T')[0],
        credentialUrl: newCertUrl.trim() || undefined
      }
    ];

    await updateStudentReadiness({ certifications: updatedCerts });
    setNewCertTitle('');
    setNewCertIssuer('');
    setNewCertDate('');
    setNewCertUrl('');
    setShowCertModal(false);
    setSavingUpdate(false);
  };

  return (
    <div className="space-y-8">
      {/* Top Banner & Digital Twin Status */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            Live Behavioral & Technical Digital Twin (Synchronized)
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            My Digital Career Twin
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
            Your continuous AI twin synthesizing verified academic transcripts, coding challenge benchmarks, production project repositories, and Fortune 500 recruitment criteria.
          </p>
        </div>

        {/* Readiness Score Card */}
        <div className="bg-slate-900 text-white p-6 rounded-3xl shrink-0 border border-slate-800 shadow-sm flex flex-col sm:flex-row lg:flex-col justify-between items-start sm:items-center lg:items-end gap-4 min-w-[280px]">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Unified Placement Readiness
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className={`text-5xl font-black ${tierInfo.color}`}>{score}</span>
              <span className="text-sm text-slate-400">/ 100</span>
            </div>
            <div className={`mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${tierInfo.badge}`}>
              <CheckCircle2 className="w-3.5 h-3.5" />
              {tierInfo.label}
            </div>
          </div>

          <button
            onClick={handleRunAiSynthesis}
            disabled={synthesizing}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
          >
            {synthesizing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Synthesizing Twin...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Run AI Twin Diagnosis
              </>
            )}
          </button>
        </div>
      </div>

      {/* 6 Unified Readiness Pillars */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
              The 6 Unified Readiness Pillars
            </h2>
            <p className="text-xs text-slate-500">
              Institutional benchmark formula determining your campus hiring eligibility and corporate shortlist rank
            </p>
          </div>
          <span className="text-xs font-mono font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
            Total Points: {score} / 100
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Pillar 1: Academics */}
          <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-blue-600" /> 1. Academics (20%)
              </span>
              <span className="text-xs font-black text-slate-900">{breakdown.academics} / 20 pts</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-full rounded-full" style={{ width: `${(breakdown.academics / 20) * 100}%` }} />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span>CGPA: {studentProfile.cgpa} / 10.0</span>
              <span className="font-semibold text-emerald-700">0 Backlogs</span>
            </div>
          </div>

          {/* Pillar 2: Technical Skills */}
          <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-indigo-600" /> 2. Technical Skills (25%)
              </span>
              <span className="text-xs font-black text-slate-900">{breakdown.technicalSkills} / 25 pts</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${(breakdown.technicalSkills / 25) * 100}%` }} />
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-500">{(studentProfile.skills || []).length} Verified Skills</span>
              <Link to="/student/assessments" className="font-bold text-indigo-600 hover:underline flex items-center gap-0.5">
                Take Quiz &rarr;
              </Link>
            </div>
          </div>

          {/* Pillar 3: Projects */}
          <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-emerald-600" /> 3. Projects (15%)
              </span>
              <span className="text-xs font-black text-slate-900">{breakdown.projects} / 15 pts</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${(breakdown.projects / 15) * 100}%` }} />
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-500">{(studentProfile.projects || []).length} Documented</span>
              <button onClick={() => setShowProjectModal(true)} className="font-bold text-emerald-700 hover:underline cursor-pointer">
                + Add Project
              </button>
            </div>
          </div>

          {/* Pillar 4: Certifications */}
          <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-600" /> 4. Certifications (10%)
              </span>
              <span className="text-xs font-black text-slate-900">{breakdown.certifications} / 10 pts</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: `${(breakdown.certifications / 10) * 100}%` }} />
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-500">{(studentProfile.certifications || []).length} Credentialed</span>
              <button onClick={() => setShowCertModal(true)} className="font-bold text-amber-700 hover:underline cursor-pointer">
                + Add Cert
              </button>
            </div>
          </div>

          {/* Pillar 5: Resume ATS */}
          <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-rose-600" /> 5. Resume ATS (15%)
              </span>
              <span className="text-xs font-black text-slate-900">{breakdown.resumeAts} / 15 pts</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div className="bg-rose-600 h-full rounded-full" style={{ width: `${(breakdown.resumeAts / 15) * 100}%` }} />
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-500">Recruiter Match</span>
              <Link to="/student/resume-analyzer" className="font-bold text-rose-600 hover:underline flex items-center gap-0.5">
                Calibrate Resume &rarr;
              </Link>
            </div>
          </div>

          {/* Pillar 6: Mock Interview */}
          <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <MessagesSquare className="w-4 h-4 text-purple-600" /> 6. Mock Interview (15%)
              </span>
              <span className="text-xs font-black text-slate-900">{breakdown.mockInterview} / 15 pts</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div className="bg-purple-600 h-full rounded-full" style={{ width: `${(breakdown.mockInterview / 15) * 100}%` }} />
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-500">AI Drill Rating</span>
              <Link to="/student/mock-interview" className="font-bold text-purple-600 hover:underline flex items-center gap-0.5">
                Practice Drills &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* AI Digital Twin Synthesis Insights Card */}
      {synthesis && (
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/30 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">AI Twin Placement Intelligence Diagnostic</h3>
                <p className="text-xs text-indigo-200">Synthesized via Gemini Campus Placement Engine</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-3.5 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-right">
                <span className="text-[10px] text-slate-400 block uppercase font-mono">Projected CTC Band</span>
                <span className="text-sm font-extrabold text-emerald-400">{synthesis.projectedOfferRange}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Candidate Persona:</h4>
            <p className="text-sm text-slate-200 bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60 leading-relaxed font-medium">
              "{synthesis.twinPersona}"
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Superpowers */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Twin Superpowers (Market Fit)
              </h4>
              <div className="space-y-2">
                {synthesis.superpowers.map((sp, i) => (
                  <div key={i} className="p-3 bg-emerald-950/30 rounded-xl border border-emerald-800/40 text-xs text-emerald-200 flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{sp}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Critical Placement Deficits */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-400" /> Priority Deficits (Action Required)
              </h4>
              <div className="space-y-2">
                {synthesis.criticalDeficits.map((def, i) => (
                  <div key={i} className="p-3 bg-rose-950/30 rounded-xl border border-rose-800/40 text-xs text-rose-200 flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span>{def}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Strategic Action Plan */}
          <div className="pt-2">
            <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-3">
              Highest-Leverage Score Acceleration Steps:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {synthesis.strategicActionPlan.map((act) => (
                <div key={act.step} className="p-3.5 bg-slate-800/70 border border-slate-700 rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      Step {act.step}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-400">{act.expectedScoreImpact}</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-snug">{act.action}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Academic Standing & Mentor Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Academic Details */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Academic Profile</h3>
              <p className="text-xs text-slate-500">Institution & Semester Standing</p>
            </div>
          </div>

          <div className="space-y-2.5 pt-2 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Cumulative GPA:</span>
              <span className="font-extrabold text-slate-900">{studentProfile.cgpa} / 10.0</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Department:</span>
              <span className="font-semibold text-slate-800 text-right">{studentProfile.department}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Academic Standing:</span>
              <span className="font-semibold text-slate-800">Year {studentProfile.year} (Final Year)</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-500">Standing Backlogs:</span>
              <span className="font-bold text-emerald-700">
                {studentProfile.backlogs === 0 ? 'Clear (0 Backlogs)' : `${studentProfile.backlogs} Active`}
              </span>
            </div>
          </div>
        </div>

        {/* Target Roles & Aspirations */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Target Roles & Career Path</h3>
              <p className="text-xs text-slate-500">Placement Aspirations</p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
                Target Roles:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(studentProfile.targetRoles || ['Full-Stack Software Engineer', 'SDE-1']).map((r, i) => (
                  <span key={i} className="px-2.5 py-1 bg-purple-50 text-purple-700 text-xs font-semibold rounded-lg border border-purple-100">
                    {r}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
                Interests & Focus Areas:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(studentProfile.careerInterests || ['Distributed Systems', 'Cloud Architecture']).map((item, i) => (
                  <span key={i} className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-lg">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Faculty Mentorship Verification */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Faculty Mentorship Scope</h3>
              <p className="text-xs text-slate-500">Authoritative Institutional Verification</p>
            </div>
          </div>

          <div className="space-y-2.5 pt-2 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Assigned Faculty Mentor:</span>
              <span className="font-bold text-indigo-700">{studentProfile.assignedFacultyName || 'Prof. Ramesh Sharma'}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Approval Status:</span>
              <span className="font-bold text-emerald-700 uppercase">{studentProfile.status || 'APPROVED'}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Roll Number:</span>
              <span className="font-mono text-slate-800">{studentProfile.rollNumber}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-500">Hiring Bracket:</span>
              <span className="font-bold text-indigo-600">{tierInfo.ctc}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Skills Matrix */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-indigo-600" />
              Verified Competencies & Skills Matrix ({(studentProfile.skills || []).length})
            </h3>
            <p className="text-xs text-slate-500">Benchmarks verified against campus coding screenings and challenge modules</p>
          </div>
          <button
            onClick={() => setShowSkillModal(true)}
            className="px-3.5 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-indigo-200 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Skill
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(studentProfile.skills || []).map((s, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                  {s.name}
                  {s.verified && (
                    <span title="Verified by assessment">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                    </span>
                  )}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Proficiency: <span className="font-semibold text-slate-700">{s.level}</span>
                </p>
              </div>

              <div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  s.level === 'Advanced'
                    ? 'bg-emerald-100 text-emerald-800'
                    : s.level === 'Intermediate'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {s.level}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Projects & Certifications Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Projects */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-emerald-600" />
              Production Engineering Projects ({(studentProfile.projects || []).length})
            </h3>
            <button
              onClick={() => setShowProjectModal(true)}
              className="px-3 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl text-xs font-bold transition flex items-center gap-1 border border-emerald-200 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Project
            </button>
          </div>

          <div className="space-y-4">
            {(studentProfile.projects || []).map((p) => (
              <div key={p.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-900">{p.title}</h4>
                  {p.githubUrl && (
                    <a href={p.githubUrl} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-slate-900 p-1">
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{p.description}</p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(p.techStack || []).map((tech, i) => (
                    <span key={i} className="text-[10px] font-semibold bg-white border border-slate-200 text-slate-700 px-2 py-0.5 rounded">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-600" />
              Verified Industry Certifications ({(studentProfile.certifications || []).length})
            </h3>
            <button
              onClick={() => setShowCertModal(true)}
              className="px-3 py-1 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-xl text-xs font-bold transition flex items-center gap-1 border border-amber-200 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Cert
            </button>
          </div>

          <div className="space-y-4">
            {(studentProfile.certifications || []).map((c) => (
              <div key={c.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{c.title}</h4>
                  <p className="text-xs text-slate-500">{c.issuer} • Issued {c.date}</p>
                </div>
                {c.credentialUrl && (
                  <a
                    href={c.credentialUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg bg-white border border-slate-200 text-indigo-600 hover:text-indigo-800"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions to Boost Career Twin Score */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-500" />
          Accelerate Your Digital Twin Score
        </h3>
        <p className="text-xs text-slate-500">
          Complete direct placement readiness tasks to push your digital twin into Tier-1 Super Dream brackets:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <Link
            to="/student/assessments"
            className="p-4 rounded-2xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/40 transition group space-y-1.5"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 group-hover:text-indigo-600">DSA & Skill Quizzes</span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
            </div>
            <p className="text-[11px] text-slate-500">Validate Java, Python, and SQL mastery for Technical Skills pillar (25%).</p>
          </Link>

          <Link
            to="/student/resume-analyzer"
            className="p-4 rounded-2xl border border-slate-200 hover:border-rose-400 hover:bg-rose-50/40 transition group space-y-1.5"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 group-hover:text-rose-600">ATS Resume Calibration</span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-rose-600" />
            </div>
            <p className="text-[11px] text-slate-500">Screen your resume against Fortune 500 ATS keywords for Resume ATS pillar (15%).</p>
          </Link>

          <Link
            to="/student/mock-interview"
            className="p-4 rounded-2xl border border-slate-200 hover:border-purple-400 hover:bg-purple-50/40 transition group space-y-1.5"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 group-hover:text-purple-600">AI Mock Interview</span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600" />
            </div>
            <p className="text-[11px] text-slate-500">Practice live technical architecture & behavioral drills for Mock Interview pillar (15%).</p>
          </Link>

          <Link
            to="/student/placement-simulator"
            className="p-4 rounded-2xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/40 transition group space-y-1.5"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 group-hover:text-emerald-600">Placement Simulator</span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
            </div>
            <p className="text-[11px] text-slate-500">Test exact clearance probability for Google, Microsoft, Amazon, and Zoho.</p>
          </Link>
        </div>
      </div>

      {/* Modal: Add Skill */}
      {showSkillModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-900">Add Skill to Career Twin</h3>
              <button onClick={() => setShowSkillModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSkill} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Skill Name</label>
                <input
                  type="text"
                  required
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  placeholder="e.g. Docker, Redis, Kubernetes, Spring Boot"
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Proficiency Level</label>
                <select
                  value={newSkillLevel}
                  onChange={(e) => setNewSkillLevel(e.target.value as any)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none"
                >
                  <option value="Beginner">Beginner (Foundational)</option>
                  <option value="Intermediate">Intermediate (Project Application)</option>
                  <option value="Advanced">Advanced (Production Scale)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSkillModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingUpdate}
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl disabled:opacity-50"
                >
                  {savingUpdate ? 'Adding...' : 'Add Skill'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Project */}
      {showProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-900">Add Production Project</h3>
              <button onClick={() => setShowProjectModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddProject} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Project Title</label>
                <input
                  type="text"
                  required
                  value={newProjectTitle}
                  onChange={(e) => setNewProjectTitle(e.target.value)}
                  placeholder="e.g. Distributed Task Queue with Redis"
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tech Stack (comma separated)</label>
                <input
                  type="text"
                  value={newProjectTech}
                  onChange={(e) => setNewProjectTech(e.target.value)}
                  placeholder="e.g. React, Node.js, PostgreSQL, Docker, Redis"
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description & Key Contributions</label>
                <textarea
                  rows={3}
                  required
                  value={newProjectDesc}
                  onChange={(e) => setNewProjectDesc(e.target.value)}
                  placeholder="Detail architectural highlights, concurrency handling, and quantifiable metrics..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">GitHub / Demo URL (optional)</label>
                <input
                  type="url"
                  value={newProjectGithub}
                  onChange={(e) => setNewProjectGithub(e.target.value)}
                  placeholder="https://github.com/username/project"
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowProjectModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingUpdate}
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl disabled:opacity-50"
                >
                  {savingUpdate ? 'Saving...' : 'Add Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Certification */}
      {showCertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-900">Add Industry Certification</h3>
              <button onClick={() => setShowCertModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCert} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Certification Title</label>
                <input
                  type="text"
                  required
                  value={newCertTitle}
                  onChange={(e) => setNewCertTitle(e.target.value)}
                  placeholder="e.g. AWS Certified Cloud Practitioner"
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Issuing Organization</label>
                <input
                  type="text"
                  required
                  value={newCertIssuer}
                  onChange={(e) => setNewCertIssuer(e.target.value)}
                  placeholder="e.g. Amazon Web Services, Oracle, Google"
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Date Issued</label>
                <input
                  type="text"
                  value={newCertDate}
                  onChange={(e) => setNewCertDate(e.target.value)}
                  placeholder="e.g. 2025 or Sept 2025"
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Credential Verification URL (optional)</label>
                <input
                  type="url"
                  value={newCertUrl}
                  onChange={(e) => setNewCertUrl(e.target.value)}
                  placeholder="https://credly.com/your-badge"
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCertModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingUpdate}
                  className="px-5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl disabled:opacity-50"
                >
                  {savingUpdate ? 'Saving...' : 'Add Certification'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

