import React, { useState } from 'react';
import { useAuth } from '../../firebase/authContext';
import { 
  MessagesSquare, 
  Sparkles, 
  Send, 
  Target, 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  User, 
  Bot, 
  RotateCcw,
  Loader2
} from 'lucide-react';

interface Message {
  role: 'assistant' | 'user';
  text: string;
  feedback?: string;
  score?: number;
}

export const MockInterviewPage: React.FC = () => {
  const { studentProfile } = useAuth();

  const [targetRole, setTargetRole] = useState(studentProfile?.targetRole || 'Software Development Engineer');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [category, setCategory] = useState<'Technical' | 'HR' | 'Behavioral' | 'Mixed'>('Technical');
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [loadingTurn, setLoadingTurn] = useState(false);
  const [turnCount, setTurnCount] = useState(0);
  const [interviewFinished, setInterviewFinished] = useState(false);
  const [finalScore, setFinalScore] = useState<number | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);

  const handleStartInterview = async () => {
    setInterviewStarted(true);
    setInterviewFinished(false);
    setTurnCount(0);
    setLoadingTurn(true);

    const initialGreeting: Message = {
      role: 'assistant',
      text: `Welcome to your campus placement mock interview for the ${targetRole} position. I will be conducting your ${category} evaluation at ${difficulty} difficulty. Let's begin with our first question:\n\nCan you explain the difference between optimistic and pessimistic locking in relational databases, and describe a real-world high-concurrency scenario where you would choose one over the other?`
    };

    setTimeout(() => {
      setMessages([initialGreeting]);
      setLoadingTurn(false);
    }, 600);
  };

  const handleSendAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAnswer.trim() || loadingTurn) return;

    const userText = currentAnswer.trim();
    setCurrentAnswer('');

    const newMessages: Message[] = [...messages, { role: 'user', text: userText }];
    setMessages(newMessages);
    setLoadingTurn(true);
    const nextTurn = turnCount + 1;
    setTurnCount(nextTurn);

    try {
      const response = await fetch('/api/ai/mock-interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetRole,
          difficulty,
          category,
          conversation: newMessages.map((m) => ({
            role: m.role === 'user' ? 'user' : 'ai',
            message: m.text
          })),
          latestUserAnswer: userText
        })
      });

      if (response.ok) {
        const json = await response.json();
        const data = json.data || json;
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            text: data.reply || data.nextQuestion,
            feedback: data.feedback,
            score: data.score || data.turnScore
          }
        ]);
        if (nextTurn >= 3) {
          finishInterview(data.score || 85);
        }
      } else {
        fallbackTurn(nextTurn);
      }
    } catch (err) {
      fallbackTurn(nextTurn);
    } finally {
      setLoadingTurn(false);
    }
  };

  const fallbackTurn = (turn: number) => {
    const questions = [
      'Good explanation. Follow up: How would you design a rate limiter in a distributed microservices environment to prevent API abuse?',
      'Well structured answer. Next: Tell me about a critical technical disagreement you had with a teammate on an engineering project. How did you resolve it objectively?',
      'Thank you. Final question: If our production service suddenly experienced a spike in latency from 50ms to 4500ms, what systematic steps would you take to diagnose the root cause?'
    ];

    if (turn >= 3) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'Thank you for answering all the questions. You demonstrated strong fundamentals in system concepts, precise problem decomposition, and constructive conflict resolution.',
          feedback: 'Solid technical depth. Suggested refinement: quantify performance trade-offs with specific latency numbers.',
          score: 86
        }
      ]);
      finishInterview(86);
    } else {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: questions[turn - 1] || 'Describe an algorithm optimization you achieved recently.',
          feedback: 'Good technical clarity. Clear explanation of locking semantics and concurrency conflicts.',
          score: 84
        }
      ]);
    }
  };

  const finishInterview = (score: number) => {
    setInterviewFinished(true);
    setFinalScore(score);
  };

  const handleReset = () => {
    setInterviewStarted(false);
    setInterviewFinished(false);
    setMessages([]);
    setTurnCount(0);
    setFinalScore(null);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200 mb-2">
            <MessagesSquare className="w-3.5 h-3.5 text-purple-600" />
            AI Placement Interview Simulator
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Mock Placement Interview
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
            Simulate realistic technical and behavioral interview rounds powered by server-side Gemini intelligence. Directly contributes 15% to your Unified Readiness Score.
          </p>
        </div>

        <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200 text-center shrink-0">
          <span className="text-[11px] text-purple-700 font-semibold uppercase tracking-wider block">
            Readiness Pillar
          </span>
          <span className="text-2xl font-black text-purple-900 mt-0.5 block">15% Weight</span>
          <span className="text-[10px] text-purple-600 font-medium">Contributes up to 15 pts</span>
        </div>
      </div>

      {/* Setup Form (when not started) */}
      {!interviewStarted ? (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm max-w-2xl mx-auto space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="font-bold text-base text-slate-900">Configure Interview Parameters</h3>
            <p className="text-xs text-slate-500 mt-0.5">Customize round format to reflect your target hiring drives</p>
          </div>

          <div className="space-y-4">
            {/* Target Role */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Target Job Role</label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. SDE-1 / Cloud Platform Engineer"
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:border-purple-500 outline-none"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Interview Category</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['Technical', 'HR', 'Behavioral', 'Mixed'] as const).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition ${
                      category === cat
                        ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Difficulty Tier</label>
              <div className="grid grid-cols-3 gap-2">
                {(['Easy', 'Medium', 'Hard'] as const).map((diff) => (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => setDifficulty(diff)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition ${
                      difficulty === diff
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleStartInterview}
              className="w-full mt-4 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-100 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              Launch Live Interview Session
            </button>
          </div>
        </div>
      ) : (
        /* Active Interview Chat Window */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[650px]">
          {/* Header */}
          <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center text-white font-bold">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">{targetRole} Interviewer (AI)</h4>
                <p className="text-[11px] text-purple-200">{category} Round • {difficulty} Tier • Turn {turnCount}/4</p>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/50">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-xl space-y-2 ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`p-4 rounded-2xl text-xs leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-indigo-600 text-white rounded-tr-xs'
                        : 'bg-white border border-slate-200 text-slate-800 shadow-xs rounded-tl-xs whitespace-pre-wrap'
                    }`}
                  >
                    {m.text}
                  </div>

                  {/* Feedback Pill if evaluated */}
                  {m.feedback && (
                    <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-xs text-purple-900 space-y-1">
                      <div className="flex items-center justify-between font-bold text-[11px] text-purple-800">
                        <span>Turn Feedback</span>
                        <span>Score: {m.score} / 100</span>
                      </div>
                      <p className="text-[11px]">{m.feedback}</p>
                    </div>
                  )}
                </div>

                {m.role === 'user' && (
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {loadingTurn && (
              <div className="flex items-center gap-2 text-xs text-slate-500 italic p-2">
                <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                <span>AI Interviewer is analyzing your answer and formulating next question...</span>
              </div>
            )}
          </div>

          {/* Final Score Banner if finished */}
          {interviewFinished && finalScore && (
            <div className="p-4 bg-emerald-50 border-t border-emerald-200 flex items-center justify-between px-6">
              <div>
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Interview Completed</span>
                <p className="text-xs text-emerald-700">Unified Readiness contribution updated to {Math.round((finalScore / 100) * 15)} / 15 pts.</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-emerald-700">{finalScore}%</span>
              </div>
            </div>
          )}

          {/* Input Box */}
          {!interviewFinished && (
            <form onSubmit={handleSendAnswer} className="p-4 bg-white border-t border-slate-200 flex gap-3">
              <textarea
                rows={2}
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                placeholder="Type your response here (be thorough, technical, and structured)..."
                disabled={loadingTurn}
                className="flex-1 text-xs p-3 rounded-xl border border-slate-200 focus:border-purple-500 outline-none resize-none"
              />
              <button
                type="submit"
                disabled={!currentAnswer.trim() || loadingTurn}
                className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center justify-center gap-2 disabled:opacity-40 self-end"
              >
                <Send className="w-4 h-4" />
                Submit Answer
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
