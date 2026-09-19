import React, { useState } from 'react';
import { useAuth } from '../../firebase/authContext';
import { Compass, CheckCircle2, Circle, Sparkles, BookOpen, ExternalLink, Calendar, ArrowRight } from 'lucide-react';

interface WeekMilestone {
  week: number;
  title: string;
  focusArea: string;
  description: string;
  tasks: { id: string; text: string; completed: boolean }[];
  recommendedResources: { title: string; url: string }[];
}

export const LearningRoadmapPage: React.FC = () => {
  const { studentProfile } = useAuth();

  const [roadmap, setRoadmap] = useState<WeekMilestone[]>([
    {
      week: 1,
      title: 'Advanced DSA: Trees, Graphs & Dynamic Programming',
      focusArea: 'Technical Core',
      description: 'Master non-linear data structures frequently encountered in Tier-1 technical screens (BST, Trie, Dijkstra, Memoization).',
      tasks: [
        { id: 'w1-1', text: 'Solve 15 Tree/Graph problems on LeetCode/HackerRank', completed: true },
        { id: 'w1-2', text: 'Implement Dijkstra and Topological Sort from scratch', completed: true },
        { id: 'w1-3', text: 'Complete Student Twin DSA assessment with >80% score', completed: false }
      ],
      recommendedResources: [
        { title: 'NeetCode 150 - Trees & Graphs Pattern Guide', url: 'https://neetcode.io' },
        { title: 'MIT OpenCourseWare 6.006: Introduction to Algorithms', url: 'https://ocw.mit.edu' }
      ]
    },
    {
      week: 2,
      title: 'Relational Database Optimization & Distributed SQL',
      focusArea: 'Backend Systems',
      description: 'Deep dive into query execution plans, indexing strategies, ACID guarantees, and connection pooling.',
      tasks: [
        { id: 'w2-1', text: 'Write EXPLAIN ANALYZE queries to debug slow Postgres joins', completed: true },
        { id: 'w2-2', text: 'Implement Redis caching tier with TTL invalidation', completed: false },
        { id: 'w2-3', text: 'Pass Student Twin SQL Assessment with 100% score', completed: true }
      ],
      recommendedResources: [
        { title: 'Use The Index, Luke! - SQL Indexing Guide', url: 'https://use-the-index-luke.com' },
        { title: 'PostgreSQL Official Documentation: Index Types', url: 'https://www.postgresql.org/docs/' }
      ]
    },
    {
      week: 3,
      title: 'Microservices, Docker Containers & Cloud Architecture',
      focusArea: 'System Architecture',
      description: 'Containerize multi-service applications and deploy automated CI/CD pipelines.',
      tasks: [
        { id: 'w3-1', text: 'Containerize a React + Express + Postgres app with docker-compose', completed: false },
        { id: 'w3-2', text: 'Set up automated GitHub Actions workflow for linting & tests', completed: false },
        { id: 'w3-3', text: 'Document system architecture diagram in project README', completed: false }
      ],
      recommendedResources: [
        { title: 'Docker Official Getting Started Guide', url: 'https://docs.docker.com/get-started/' },
        { title: 'System Design Primer (GitHub / donnemartin)', url: 'https://github.com/donnemartin/system-design-primer' }
      ]
    },
    {
      week: 4,
      title: 'Resume Calibration & STAR Project Transformation',
      focusArea: 'Placement Preparedness',
      description: 'Calibrate your resume against ATS benchmarks and refine technical bullets.',
      tasks: [
        { id: 'w4-1', text: 'Rewrite project bullets using STAR framework with metrics', completed: true },
        { id: 'w4-2', text: 'Run ATS Resume Scanner and achieve score >= 85', completed: false },
        { id: 'w4-3', text: 'Share updated resume with Faculty Mentor for verification', completed: false }
      ],
      recommendedResources: [
        { title: 'Google Tech Resume Guide & Formatting Standards', url: 'https://careers.google.com' }
      ]
    },
    {
      week: 5,
      title: 'Full-Scale AI Mock Interview Sprints',
      focusArea: 'Behavioral & Technical Rounds',
      description: 'Complete 3 full mock interviews across Technical and HR competencies.',
      tasks: [
        { id: 'w5-1', text: 'Complete Technical Mock Interview at Hard difficulty', completed: false },
        { id: 'w5-2', text: 'Complete Behavioral/HR Mock Interview and review feedback', completed: false },
        { id: 'w5-3', text: 'Achieve interview score >= 80 in Student Twin', completed: false }
      ],
      recommendedResources: [
        { title: 'The Tech Interview Handbook - Behavioral Rounds', url: 'https://www.techinterviewhandbook.org' }
      ]
    },
    {
      week: 6,
      title: 'Target Company Placement Simulation & Final Polish',
      focusArea: 'Hiring Drives',
      description: 'Simulate company-specific cutoffs and participate in campus hiring drives.',
      tasks: [
        { id: 'w6-1', text: 'Run Placement Simulator for top 3 dream companies', completed: false },
        { id: 'w6-2', text: 'Confirm eligibility status across all campus partner visits', completed: false },
        { id: 'w6-3', text: 'Verify Unified Readiness Score >= 85', completed: false }
      ],
      recommendedResources: [
        { title: 'Campus Placement Portal Guidelines', url: '#' }
      ]
    }
  ]);

  const toggleTask = (weekIdx: number, taskId: string) => {
    setRoadmap((prev) => {
      const next = [...prev];
      const targetWeek = { ...next[weekIdx] };
      targetWeek.tasks = targetWeek.tasks.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t));
      next[weekIdx] = targetWeek;
      return next;
    });
  };

  const totalTasks = roadmap.reduce((acc, w) => acc + w.tasks.length, 0);
  const completedTasks = roadmap.reduce((acc, w) => acc + w.tasks.filter((t) => t.completed).length, 0);
  const progressPercent = Math.round((completedTasks / totalTasks) * 100);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 mb-2">
            <Compass className="w-3.5 h-3.5 text-indigo-600" />
            AI-Personalized Learning Roadmap
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            6-Week Placement Accelerator
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
            Tailored sprint schedule designed to bridge identified skill gaps and elevate your Unified Readiness Score to Tier-1 placement standards.
          </p>
        </div>

        <div className="p-5 bg-indigo-50 rounded-2xl border border-indigo-200 text-center shrink-0 min-w-[180px]">
          <span className="text-[11px] text-indigo-600 font-semibold uppercase tracking-wider block">
            Roadmap Progress
          </span>
          <span className="text-3xl font-black text-indigo-900 mt-0.5 block">{progressPercent}%</span>
          <span className="text-[11px] text-indigo-700 font-medium">
            {completedTasks} of {totalTasks} milestones completed
          </span>
        </div>
      </div>

      {/* Week-by-Week Timeline */}
      <div className="space-y-6">
        {roadmap.map((weekData, wIdx) => {
          const weekCompleted = weekData.tasks.every((t) => t.completed);
          return (
            <div
              key={weekData.week}
              className={`bg-white rounded-3xl p-6 sm:p-8 border transition ${
                weekCompleted ? 'border-emerald-200 bg-emerald-50/20' : 'border-slate-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-xl bg-indigo-600 text-white font-black text-sm flex items-center justify-center">
                    W{weekData.week}
                  </span>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                      {weekData.focusArea}
                    </span>
                    <h3 className="font-bold text-base text-slate-900 mt-1">{weekData.title}</h3>
                  </div>
                </div>

                <span className="text-xs text-slate-500 font-medium">
                  {weekData.tasks.filter((t) => t.completed).length} / {weekData.tasks.length} Done
                </span>
              </div>

              <p className="text-xs text-slate-600 mt-4 leading-relaxed">{weekData.description}</p>

              {/* Tasks Checklist */}
              <div className="mt-4 space-y-2.5">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Action Milestones:</h4>
                {weekData.tasks.map((task) => (
                  <button
                    key={task.id}
                    onClick={() => toggleTask(wIdx, task.id)}
                    className={`w-full text-left p-3 rounded-xl border text-xs flex items-center gap-3 transition ${
                      task.completed
                        ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950 font-medium'
                        : 'bg-slate-50/60 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                    <span className={task.completed ? 'line-through text-slate-500' : ''}>{task.text}</span>
                  </button>
                ))}
              </div>

              {/* Recommended Resources */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-4">
                <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" /> Curated Guides:
                </span>
                {weekData.recommendedResources.map((res, i) => (
                  <a
                    key={i}
                    href={res.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:underline font-medium"
                  >
                    {res.title} <ExternalLink className="w-3 h-3" />
                  </a>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
