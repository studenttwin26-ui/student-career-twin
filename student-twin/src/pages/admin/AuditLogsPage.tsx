import React, { useState } from 'react';
import { useAuth } from '../../firebase/authContext';
import { AuditLogEntry } from '../../types';
import { 
  FileSearch, 
  ShieldCheck, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  UserPlus, 
  UserCheck, 
  Power, 
  Calendar 
} from 'lucide-react';

export const AuditLogsPage: React.FC = () => {
  const { auditLogs } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('all');

  const filteredLogs = auditLogs.filter((log) => {
    const actor = (log as any).actorName || log.performedByEmail || 'System';
    const matchesSearch = actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.details.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    if (filterAction !== 'all' && !log.action.toLowerCase().includes(filterAction.toLowerCase())) return false;
    return true;
  });

  const getActionBadge = (action: string) => {
    if (action.includes('Approved')) {
      return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    }
    if (action.includes('Rejected') || action.includes('Deactivated')) {
      return 'bg-rose-50 text-rose-800 border-rose-200';
    }
    if (action.includes('Assigned')) {
      return 'bg-indigo-50 text-indigo-800 border-indigo-200';
    }
    return 'bg-slate-100 text-slate-800 border-slate-200';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200 mb-2">
            <FileSearch className="w-3.5 h-3.5 text-rose-600" />
            Immutable Institutional Audit Log
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            System Security & Action Logs
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
            Chronological audit trail tracking student approvals, faculty provisioning, cohort reassignments, and administrative actions.
          </p>
        </div>

        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center shrink-0">
          <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider block">
            Recorded Events
          </span>
          <span className="text-2xl font-black text-slate-900 mt-0.5 block">{auditLogs.length} Entries</span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by actor, action description, or details..."
            className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-slate-200 focus:border-rose-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-slate-500 font-medium">Filter Action:</span>
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white focus:border-rose-500 outline-none"
          >
            <option value="all">All Actions</option>
            <option value="Approved">Approvals</option>
            <option value="Rejected">Rejections</option>
            <option value="Assigned">Assignments</option>
            <option value="Created">Creations</option>
          </select>
        </div>
      </div>

      {/* Logs Timeline */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
        {filteredLogs.map((log) => (
          <div key={log.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition text-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getActionBadge(log.action)}`}>
                  {log.action}
                </span>
                <span className="font-bold text-slate-900">{(log as any).actorName || log.performedByEmail || 'System'}</span>
                <span className="text-[10px] text-slate-400 font-mono">({((log as any).actorRole || log.performedByRole || 'ADMIN').toUpperCase()})</span>
              </div>
              <p className="text-slate-600">{log.details}</p>
            </div>

            <div className="text-slate-400 text-[11px] shrink-0 font-mono">
              {new Date(log.timestamp).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
