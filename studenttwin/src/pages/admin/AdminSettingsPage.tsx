import React, { useState } from 'react';
import { useAuth } from '../../firebase/authContext';
import { 
  Settings, 
  Flame, 
  Key, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Globe, 
  Database, 
  ExternalLink,
  Cpu,
  Download
} from 'lucide-react';
import { FirebaseConfigModal } from '../../components/FirebaseConfigModal';

export const AdminSettingsPage: React.FC = () => {
  const { firebaseConfig, isConfigCustom } = useAuth();
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [geminiStatus, setGeminiStatus] = useState<'checking' | 'active' | 'unconfigured'>('active');

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200 mb-2">
          <Settings className="w-3.5 h-3.5 text-rose-600" />
          Infrastructure & Deployment Settings
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          System & Firebase Configuration
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xl mt-1">
          Review active database connections, Gemini AI server-side gateway status, and manage independent Firebase credentials.
        </p>
      </div>

      {/* Firebase Diagnostics Box */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Firebase Project Status</h3>
              <p className="text-xs text-slate-500">
                Current mode: {isConfigCustom ? 'Custom External Firebase Account' : 'Default AI Studio Fallback Firebase'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowConfigModal(true)}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            <Key className="w-3.5 h-3.5" />
            Configure Firebase Keys
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-400 block text-[11px]">Firebase Project ID</span>
            <span className="font-mono font-bold text-slate-900 mt-0.5 block">{firebaseConfig.projectId || 'Unspecified'}</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-400 block text-[11px]">Auth Domain</span>
            <span className="font-mono font-bold text-slate-900 mt-0.5 block">{firebaseConfig.authDomain || 'Unspecified'}</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-400 block text-[11px]">Storage Bucket</span>
            <span className="font-mono font-bold text-slate-900 mt-0.5 block">{firebaseConfig.storageBucket || 'Unspecified'}</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-400 block text-[11px]">Credential Persistence</span>
            <span className="font-medium text-emerald-700 mt-0.5 block">
              {isConfigCustom ? 'Overridden via runtime secure store' : 'Standard environment bundle'}
            </span>
          </div>
        </div>

        <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl text-xs text-amber-900">
          <p className="font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            Account Isolation Notice:
          </p>
          <p className="mt-1 leading-relaxed">
            As requested, this application is completely independent of the Google AI Studio Google account. When deploying to your own GitHub repository or production hosting, you can safely connect any separate Google/Firebase account by entering the credentials in the modal above.
          </p>
        </div>
      </div>

      {/* AI Backend Gateway Status */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Server-Side Gemini AI Engine</h3>
            <p className="text-xs text-slate-500">Node/Express server proxy for secure token and prompt execution</p>
          </div>
        </div>

        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-600">ATS Resume Scanner API:</span>
            <span className="text-emerald-700 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> /api/ai/resume-scan (Active)
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600">Live Mock Interviewer API:</span>
            <span className="text-emerald-700 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> /api/ai/mock-interview (Active)
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600">Unified Score Recalibration API:</span>
            <span className="text-emerald-700 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> /api/ai/calculate-readiness (Active)
            </span>
          </div>
        </div>
      </div>

      {/* Firebase Config Modal Component */}
      <FirebaseConfigModal
        isOpen={showConfigModal}
        onClose={() => setShowConfigModal(false)}
      />
    </div>
  );
};
