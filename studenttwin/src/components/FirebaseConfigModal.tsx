import React, { useState } from 'react';
import { 
  getEffectiveFirebaseConfig, 
  saveFirebaseConfig, 
  clearCustomFirebaseConfig, 
  isFirebaseConfigured 
} from '../firebase/config';
import { Database, CheckCircle2, AlertTriangle, Key, ExternalLink, RefreshCw, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const FirebaseConfigModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const currentConfig = getEffectiveFirebaseConfig();
  const [apiKey, setApiKey] = useState(currentConfig?.apiKey || '');
  const [projectId, setProjectId] = useState(currentConfig?.projectId || '');
  const [authDomain, setAuthDomain] = useState(currentConfig?.authDomain || '');
  const [storageBucket, setStorageBucket] = useState(currentConfig?.storageBucket || '');
  const [messagingSenderId, setMessagingSenderId] = useState(currentConfig?.messagingSenderId || '');
  const [appId, setAppId] = useState(currentConfig?.appId || '');
  const [rawJson, setRawJson] = useState('');
  const [parseError, setParseError] = useState('');

  if (!isOpen) return null;

  const handlePasteJson = (text: string) => {
    setRawJson(text);
    setParseError('');
    try {
      // Clean up if copied with "const firebaseConfig = { ... };"
      let cleaned = text.trim();
      if (cleaned.includes('{') && cleaned.includes('}')) {
        const start = cleaned.indexOf('{');
        const end = cleaned.lastIndexOf('}') + 1;
        cleaned = cleaned.substring(start, end);
      }
      
      // Convert JS object format to JSON if keys are unquoted
      const jsonStr = cleaned
        .replace(/([a-zA-Z0-9_]+)\s*:/g, '"$1":')
        .replace(/'/g, '"');
        
      const parsed = JSON.parse(jsonStr);
      if (parsed.apiKey) setApiKey(parsed.apiKey);
      if (parsed.projectId) {
        setProjectId(parsed.projectId);
        if (!parsed.authDomain) setAuthDomain(`${parsed.projectId}.firebaseapp.com`);
      }
      if (parsed.authDomain) setAuthDomain(parsed.authDomain);
      if (parsed.storageBucket) setStorageBucket(parsed.storageBucket);
      if (parsed.messagingSenderId) setMessagingSenderId(parsed.messagingSenderId);
      if (parsed.appId) setAppId(parsed.appId);
    } catch (e: any) {
      setParseError('Could not auto-parse JSON. You can fill the fields manually below.');
    }
  };

  const handleSave = () => {
    if (!apiKey || !projectId) {
      alert('API Key and Project ID are required.');
      return;
    }
    saveFirebaseConfig({
      apiKey: apiKey.trim(),
      authDomain: authDomain.trim() || `${projectId.trim()}.firebaseapp.com`,
      projectId: projectId.trim(),
      storageBucket: storageBucket.trim() || `${projectId.trim()}.appspot.com`,
      messagingSenderId: messagingSenderId.trim(),
      appId: appId.trim()
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Firebase Project Connection</h3>
              <p className="text-xs text-slate-300">Connect any Google account's Firebase project without lock-in</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Status Alert */}
          <div className={`p-4 rounded-xl border flex items-start gap-3 ${
            isFirebaseConfigured 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
              : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}>
            {isFirebaseConfigured ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div className="text-sm">
              <p className="font-semibold">
                {isFirebaseConfigured 
                  ? `Connected to Firebase Project: ${currentConfig?.projectId}`
                  : 'Operating in Self-Contained Local Mode with Standard Fallback'}
              </p>
              <p className="mt-1 text-xs opacity-90">
                {isFirebaseConfigured
                  ? 'All authentication, student approvals, and Firestore records are actively synchronizing with your configured Firebase project.'
                  : 'You can paste your Firebase Web App credentials below from your own Google account. The app works 100% out of the box with realistic seed accounts in either mode.'}
              </p>
            </div>
          </div>

          {/* Quick Paste Box */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Quick Setup: Paste Firebase Config Object
            </label>
            <textarea
              value={rawJson}
              onChange={(e) => handlePasteJson(e.target.value)}
              placeholder={`Paste your firebaseConfig snippet from Firebase Console, e.g.:\nconst firebaseConfig = {\n  apiKey: "AIzaSy...",\n  authDomain: "...",\n  projectId: "..."\n};`}
              rows={4}
              className="w-full text-xs font-mono p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:outline-none"
            />
            {parseError && <p className="text-xs text-rose-600">{parseError}</p>}
          </div>

          {/* Individual inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">API Key (apiKey) *</label>
              <input
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Project ID (projectId) *</label>
              <input
                type="text"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                placeholder="my-student-twin-app"
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Auth Domain (authDomain)</label>
              <input
                type="text"
                value={authDomain}
                onChange={(e) => setAuthDomain(e.target.value)}
                placeholder="my-student-twin-app.firebaseapp.com"
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">App ID (appId)</label>
              <input
                type="text"
                value={appId}
                onChange={(e) => setAppId(e.target.value)}
                placeholder="1:1234567890:web:abcdef..."
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
            <p className="font-semibold text-slate-800 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-indigo-600" />
              Where to find this in Firebase Console:
            </p>
            <p>1. Open <a href="https://console.firebase.google.com" target="_blank" rel="noreferrer" className="text-indigo-600 underline inline-flex items-center gap-0.5">Firebase Console <ExternalLink className="w-2.5 h-2.5" /></a></p>
            <p>2. Select or create your project under your Google account.</p>
            <p>3. Go to Project Settings (Gear icon) → General → Scroll down to "Your apps" → Select Web app (&lt;/&gt;) → Copy config.</p>
            <p>4. In Firebase Authentication: Enable "Email/Password" sign-in provider.</p>
            <p>5. In Firestore Database: Create database in test or production mode and apply the included <code className="bg-slate-200 px-1 py-0.5 rounded text-[11px]">firestore.rules</code>.</p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={clearCustomFirebaseConfig}
            className="text-xs text-rose-600 hover:text-rose-700 font-medium px-3 py-2"
          >
            Reset to Default
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 bg-white border border-slate-200 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Save & Reconnect
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
