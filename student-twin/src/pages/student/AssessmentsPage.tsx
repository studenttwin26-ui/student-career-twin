import React, { useState, useEffect } from 'react';
import { useAuth } from '../../firebase/authContext';
import { 
  ClipboardCheck, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Award, 
  ArrowRight, 
  Code2, 
  Database, 
  Terminal, 
  BrainCircuit, 
  BarChart,
  HelpCircle
} from 'lucide-react';

interface Question {
  id: string;
  text: string;
  codeSnippet?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface TrackData {
  id: string;
  name: string;
  category: 'Java' | 'Python' | 'SQL' | 'DSA' | 'Aptitude';
  timeLimitSeconds: number;
  questions: Question[];
}

const TRACKS: TrackData[] = [
  {
    id: 'java-core',
    name: 'Java & Object-Oriented Engineering',
    category: 'Java',
    timeLimitSeconds: 180,
    questions: [
      {
        id: 'j1',
        text: 'What will be the output of the following Java snippet?',
        codeSnippet: `String s1 = new String("StudentTwin");\nString s2 = "StudentTwin";\nSystem.out.println(s1 == s2);\nSystem.out.println(s1.equals(s2));`,
        options: ['true, true', 'false, true', 'false, false', 'true, false'],
        correctIndex: 1,
        explanation: 's1 is explicitly instantiated on the heap, while s2 is interned in the String constant pool. `==` checks reference identity, while `.equals()` checks content equality.'
      },
      {
        id: 'j2',
        text: 'Which collection implementation maintains insertion order while offering O(1) amortized access time?',
        options: ['TreeSet', 'HashSet', 'LinkedHashMap', 'TreeMap'],
        correctIndex: 2,
        explanation: 'LinkedHashMap maintains a doubly-linked list running through all its entries, preserving insertion order with O(1) hash bucket lookups.'
      },
      {
        id: 'j3',
        text: 'What happens when an exception is thrown in a try block that has both a catch block and a finally block containing a return statement?',
        options: [
          'The finally block return statement overrides any return or exception thrown previously.',
          'The compiler throws a fatal compilation error.',
          'The catch block exception is propagated and finally is skipped.',
          'The JVM terminates immediately with an UnhandledException.'
        ],
        correctIndex: 0,
        explanation: 'A return statement inside a finally block silently suppresses any exception thrown in the try or catch blocks.'
      }
    ]
  },
  {
    id: 'python-core',
    name: 'Pythonic Programming & Data Structures',
    category: 'Python',
    timeLimitSeconds: 180,
    questions: [
      {
        id: 'p1',
        text: 'What is the time complexity of looking up a key in a Python dict with average hash distribution?',
        options: ['O(log N)', 'O(1)', 'O(N)', 'O(N log N)'],
        correctIndex: 1,
        explanation: 'Python dictionaries are implemented using sparse hash tables, achieving amortized O(1) time complexity for insertions, updates, and key lookups.'
      },
      {
        id: 'p2',
        text: 'What will the following code output?',
        codeSnippet: `def func(x, lst=[]):\n    lst.append(x)\n    return lst\n\nprint(func(1))\nprint(func(2))`,
        options: ['[1] then [2]', '[1] then [1, 2]', '[1] then []', 'TypeError'],
        correctIndex: 1,
        explanation: 'Default arguments are evaluated once at function definition time, so mutable default arguments like lists persist across multiple calls.'
      },
      {
        id: 'p3',
        text: 'How does Python handle memory management for cyclic object references?',
        options: [
          'It relies exclusively on reference counting.',
          'It uses an automatic cycle-detecting generational garbage collector alongside reference counting.',
          'It forces manual deallocation via del keyword.',
          'Cyclic references always result in an unrecoverable memory leak.'
        ],
        correctIndex: 1,
        explanation: 'CPython uses reference counting as its primary mechanism and a cyclical generational garbage collector (gc module) to detect and resolve circular references.'
      }
    ]
  },
  {
    id: 'sql-db',
    name: 'SQL Relational Queries & Optimization',
    category: 'SQL',
    timeLimitSeconds: 180,
    questions: [
      {
        id: 's1',
        text: 'What is the crucial functional difference between WHERE and HAVING clauses in SQL?',
        options: [
          'WHERE filters rows before aggregation; HAVING filters aggregated groups after GROUP BY.',
          'WHERE is for numeric data; HAVING is for text data.',
          'WHERE only works with JOINs; HAVING only works with SELECT.',
          'There is no semantic difference; they are aliases.'
        ],
        correctIndex: 0,
        explanation: 'The WHERE clause filters rows prior to the GROUP BY aggregation step, whereas HAVING applies filter predicates to the aggregated result sets.'
      },
      {
        id: 's2',
        text: 'Which type of database index is typically best suited for high cardinality columns frequently used in range queries (e.g., date ranges)?',
        options: ['Bitmap Index', 'B-Tree Index', 'Hash Index', 'Spatial Index'],
        correctIndex: 1,
        explanation: 'B-Tree (Balanced Tree) indexes maintain sorted order, making them ideal for high-cardinality values and range scans (`BETWEEN`, `>`, `<`).'
      },
      {
        id: 's3',
        text: 'Which ACID property guarantees that concurrent transactions do not interfere with each other?',
        options: ['Atomicity', 'Consistency', 'Isolation', 'Durability'],
        correctIndex: 2,
        explanation: 'Isolation ensures that concurrent transactions execute independently without reading uncommitted or intermediate states of other transactions.'
      }
    ]
  },
  {
    id: 'dsa-algo',
    name: 'Data Structures & Algorithms (DSA)',
    category: 'DSA',
    timeLimitSeconds: 180,
    questions: [
      {
        id: 'd1',
        text: 'What is the worst-case time complexity of finding an element in a balanced Red-Black Tree or AVL Tree?',
        options: ['O(N)', 'O(1)', 'O(log N)', 'O(N^2)'],
        correctIndex: 2,
        explanation: 'Self-balancing binary search trees maintain a maximum height of O(log N), guaranteeing O(log N) worst-case search, insertion, and deletion.'
      },
      {
        id: 'd2',
        text: 'Which algorithm is optimal for finding the shortest path from a single source vertex to all other vertices in a weighted graph with non-negative edge weights?',
        options: ['Floyd-Warshall Algorithm', 'Dijkstra\'s Algorithm with Min-Heap', 'Kruskal\'s Algorithm', 'Bellman-Ford Algorithm'],
        correctIndex: 1,
        explanation: 'Dijkstra\'s algorithm implemented with a binary min-heap runs in O((V + E) log V) time, which is optimal for non-negative weighted graphs.'
      },
      {
        id: 'd3',
        text: 'Which data structure is fundamentally utilized in depth-first traversal (DFS) of a graph?',
        options: ['FIFO Queue', 'LIFO Stack (or call stack)', 'Priority Queue', 'Disjoint Set (Union-Find)'],
        correctIndex: 1,
        explanation: 'DFS explores as deep as possible along each branch before backtracking, requiring a LIFO Stack (explicitly or via recursion stack).'
      }
    ]
  },
  {
    id: 'aptitude',
    name: 'Quantitative Aptitude & Logical Reasoning',
    category: 'Aptitude',
    timeLimitSeconds: 180,
    questions: [
      {
        id: 'a1',
        text: 'A train 180 meters long is traveling at 72 km/h. How many seconds will it take to pass a stationary telegraph pole?',
        options: ['6 seconds', '9 seconds', '12 seconds', '15 seconds'],
        correctIndex: 1,
        explanation: 'Speed = 72 * (5/18) = 20 m/s. Time = Distance / Speed = 180 / 20 = 9 seconds.'
      },
      {
        id: 'a2',
        text: 'If 6 workers can construct a wall in 10 days, working 8 hours a day, in how many days can 10 workers complete the same wall working 6 hours a day?',
        options: ['8 days', '10 days', '6 days', '7.5 days'],
        correctIndex: 0,
        explanation: 'Total man-hours = 6 * 10 * 8 = 480 hours. New daily output = 10 * 6 = 60 hours/day. Days = 480 / 60 = 8 days.'
      },
      {
        id: 'a3',
        text: 'A product is sold at a 20% discount on marked price, yielding a 25% profit over cost. If the cost price is $240, what was the marked price?',
        options: ['300', '375', '350', '325'],
        correctIndex: 1,
        explanation: 'Selling price = 240 * 1.25 = $300. Since SP is 80% of Marked Price: MP = 300 / 0.8 = $375.'
      }
    ]
  }
];

export const AssessmentsPage: React.FC = () => {
  const { studentProfile } = useAuth();

  const [selectedTrack, setSelectedTrack] = useState<TrackData | null>(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [testActive, setTestActive] = useState(false);
  const [testResult, setTestResult] = useState<{
    trackName: string;
    total: number;
    correct: number;
    scorePercent: number;
    skillLevel: 'Advanced' | 'Intermediate' | 'Needs Improvement';
    timestamp: string;
  } | null>(null);

  const [attemptHistory, setAttemptHistory] = useState([
    { track: 'Java & Object-Oriented Engineering', score: 100, level: 'Advanced', date: 'Yesterday' },
    { track: 'Data Structures & Algorithms', score: 66, level: 'Intermediate', date: '3 days ago' },
    { track: 'SQL Relational Queries', score: 100, level: 'Advanced', date: 'Last week' }
  ]);

  // Timer countdown
  useEffect(() => {
    if (!testActive || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [testActive, timeLeft]);

  const handleStartTrack = (track: TrackData) => {
    setSelectedTrack(track);
    setCurrentQIndex(0);
    setSelectedAnswers({});
    setTimeLeft(track.timeLimitSeconds);
    setTestActive(true);
    setTestResult(null);
  };

  const handleSelectOption = (optIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQIndex]: optIndex
    }));
  };

  const handleSubmitTest = () => {
    if (!selectedTrack) return;
    setTestActive(false);

    let correctCount = 0;
    selectedTrack.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        correctCount++;
      }
    });

    const percent = Math.round((correctCount / selectedTrack.questions.length) * 100);
    let level: 'Advanced' | 'Intermediate' | 'Needs Improvement' = 'Needs Improvement';
    if (percent >= 80) level = 'Advanced';
    else if (percent >= 50) level = 'Intermediate';

    const res = {
      trackName: selectedTrack.name,
      total: selectedTrack.questions.length,
      correct: correctCount,
      scorePercent: percent,
      skillLevel: level,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setTestResult(res);
    setAttemptHistory((prev) => [
      { track: res.trackName, score: res.scorePercent, level: res.skillLevel, date: 'Just now' },
      ...prev
    ]);
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 mb-2">
            <ClipboardCheck className="w-3.5 h-3.5 text-indigo-600" />
            Verified Skill Assessment Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Technical & Aptitude Assessments
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
            Timed technical challenges calibrated to Tier-1 hiring benchmarks. Scores directly calibrate your Unified Readiness Score.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center">
            <span className="text-[11px] text-slate-500 font-medium block">Total Tracks</span>
            <span className="text-xl font-extrabold text-slate-900">5 Tracks</span>
          </div>
          <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-200 text-center">
            <span className="text-[11px] text-indigo-600 font-medium block">Weight</span>
            <span className="text-xl font-extrabold text-indigo-700">25% of Score</span>
          </div>
        </div>
      </div>

      {/* Test Active View */}
      {testActive && selectedTrack && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-indigo-300 shadow-lg space-y-6 animate-fade-in">
          {/* Header with Timer */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                {selectedTrack.category} Assessment in Progress
              </span>
              <h2 className="text-lg font-bold text-slate-900 mt-0.5">{selectedTrack.name}</h2>
            </div>

            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-mono font-bold ${
                timeLeft < 60 ? 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse' : 'bg-slate-50 text-slate-800 border-slate-200'
              }`}>
                <Clock className="w-4 h-4 text-indigo-600" />
                <span>Time Remaining: {formatTimer(timeLeft)}</span>
              </div>
              <button
                onClick={handleSubmitTest}
                className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition"
              >
                Submit Test
              </button>
            </div>
          </div>

          {/* Question Index Progress */}
          <div className="flex items-center gap-2">
            {selectedTrack.questions.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentQIndex(i)}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition flex items-center justify-center ${
                  currentQIndex === i
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : selectedAnswers[i] !== undefined
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          {/* Current Question */}
          {(() => {
            const q = selectedTrack.questions[currentQIndex];
            return (
              <div className="space-y-4">
                <div className="text-sm font-semibold text-slate-900 leading-relaxed">
                  <span className="text-indigo-600 mr-2">Question {currentQIndex + 1} of {selectedTrack.questions.length}:</span>
                  {q.text}
                </div>

                {q.codeSnippet && (
                  <pre className="p-4 rounded-xl bg-slate-900 text-slate-100 text-xs font-mono overflow-x-auto border border-slate-800 leading-relaxed">
                    {q.codeSnippet}
                  </pre>
                )}

                <div className="space-y-2.5 pt-2">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = selectedAnswers[currentQIndex] === optIdx;
                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectOption(optIdx)}
                        className={`w-full text-left p-3.5 rounded-xl text-xs font-medium border transition flex items-center justify-between ${
                          isSelected
                            ? 'bg-indigo-50/80 border-indigo-500 text-indigo-950 font-semibold shadow-xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold ${
                            isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span>{opt}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between pt-4">
                  <button
                    disabled={currentQIndex === 0}
                    onClick={() => setCurrentQIndex((prev) => Math.max(0, prev - 1))}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 disabled:opacity-40"
                  >
                    Previous
                  </button>

                  {currentQIndex < selectedTrack.questions.length - 1 ? (
                    <button
                      onClick={() => setCurrentQIndex((prev) => prev + 1)}
                      className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs"
                    >
                      Next Question
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmitTest}
                      className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs"
                    >
                      Complete & Score
                    </button>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Result Display Card */}
      {testResult && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-300 shadow-lg space-y-6 animate-fade-in">
          <div className="flex items-start justify-between pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-100 px-3 py-1 rounded-full">
                Assessment Completed
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-2">{testResult.trackName}</h2>
              <p className="text-xs text-slate-500">Evaluated at {testResult.timestamp}</p>
            </div>

            <button
              onClick={() => setTestResult(null)}
              className="text-xs font-semibold text-indigo-600 hover:underline"
            >
              Close Result
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-xs text-slate-500">Score Percentage</span>
              <h3 className="text-3xl font-black text-indigo-600 mt-1">{testResult.scorePercent}%</h3>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-xs text-slate-500">Correct Answers</span>
              <h3 className="text-3xl font-black text-emerald-600 mt-1">
                {testResult.correct} / {testResult.total}
              </h3>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-xs text-slate-500">Calibrated Level</span>
              <h3 className="text-xl font-bold text-slate-900 mt-2">{testResult.skillLevel}</h3>
            </div>
          </div>

          {/* Detailed Explanations */}
          {selectedTrack && (
            <div className="space-y-3 pt-2">
              <h4 className="font-bold text-xs text-slate-700 uppercase tracking-wider">
                Question Review & Solutions:
              </h4>
              {selectedTrack.questions.map((q, idx) => {
                const isCorrect = selectedAnswers[idx] === q.correctIndex;
                return (
                  <div key={idx} className={`p-4 rounded-2xl border text-xs ${
                    isCorrect ? 'bg-emerald-50/40 border-emerald-200' : 'bg-rose-50/40 border-rose-200'
                  }`}>
                    <div className="flex items-center gap-2 font-semibold text-slate-900">
                      {isCorrect ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      )}
                      <span>Question {idx + 1}: {q.text}</span>
                    </div>
                    <p className="mt-2 text-slate-600">
                      <strong>Correct Answer:</strong> {q.options[q.correctIndex]}
                    </p>
                    <p className="mt-1 text-slate-500">
                      <strong>Explanation:</strong> {q.explanation}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Track Selection Grid */}
      <div>
        <h3 className="text-base font-bold text-slate-900 mb-4">Select Core Assessment Track</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TRACKS.map((track) => {
            return (
              <div
                key={track.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2.5 py-1 rounded-md">
                      {track.category} Track
                    </span>
                    <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {Math.floor(track.timeLimitSeconds / 60)} mins
                    </span>
                  </div>

                  <h4 className="font-bold text-base text-slate-900">{track.name}</h4>
                  <p className="text-xs text-slate-500 mt-2">
                    {track.questions.length} benchmark questions covering algorithms, edge cases, and industry practices.
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">Calibrated Test</span>
                  <button
                    onClick={() => handleStartTrack(track)}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5"
                  >
                    Start Assessment <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Attempt History */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-900">Attempt History & Audit Trail</h3>
          <span className="text-xs text-slate-500">Persistent Verification Log</span>
        </div>

        <div className="divide-y divide-slate-100">
          {attemptHistory.map((item, i) => (
            <div key={i} className="py-3.5 flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-slate-900">{item.track}</p>
                <p className="text-[11px] text-slate-500">Attempted {item.date}</p>
              </div>

              <div className="flex items-center gap-3">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                  item.level === 'Advanced' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {item.level}
                </span>
                <span className="font-mono font-extrabold text-slate-900 text-sm">{item.score}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
