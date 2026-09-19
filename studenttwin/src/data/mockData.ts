import { Assessment, Company, CompanyCriteria, ScoreBreakdown, StudentProfileData } from '../types';

export const INITIAL_COMPANIES: Company[] = [
  {
    id: 'comp_google',
    name: 'Google',
    category: 'Super Dream',
    packageRange: '₹32 - 45 LPA',
    minCgpa: 8.5,
    maxBacklogs: 0,
    eligibleDepartments: ['Computer Science', 'Information Technology', 'Electronics & Comm.'],
    requiredSkills: ['DSA', 'Python', 'System Design', 'Algorithms', 'Problem Solving'],
    roleTitle: 'Associate Software Engineer',
    description: 'Build large-scale distributed systems, machine learning pipelines, and global cloud infrastructure.',
    location: 'Bangalore / Hyderabad',
    deadline: '2026-11-15',
    hiringProcess: ['Online Assessment (DSA)', 'Technical Round 1', 'Technical Round 2', 'Googliness / HR Round']
  },
  {
    id: 'comp_microsoft',
    name: 'Microsoft',
    category: 'Super Dream',
    packageRange: '₹28 - 42 LPA',
    minCgpa: 8.0,
    maxBacklogs: 0,
    eligibleDepartments: ['Computer Science', 'Information Technology', 'Electronics & Comm.'],
    requiredSkills: ['DSA', 'Java', 'C++', 'Cloud Basics', 'OOPs'],
    roleTitle: 'Software Development Engineer I',
    description: 'Empower every person and organization on the planet to achieve more through Azure and modern workplace software.',
    location: 'Hyderabad / Noida',
    deadline: '2026-11-20',
    hiringProcess: ['Online Coding Challenge', 'Technical Coding Round', 'Design & Architecture', 'Behavioral Round']
  },
  {
    id: 'comp_amazon',
    name: 'Amazon',
    category: 'Super Dream',
    packageRange: '₹24 - 36 LPA',
    minCgpa: 7.5,
    maxBacklogs: 0,
    eligibleDepartments: ['Computer Science', 'Information Technology', 'Electronics & Comm.', 'Electrical Eng.'],
    requiredSkills: ['DSA', 'Java', 'SQL', 'Leadership Principles', 'System Architecture'],
    roleTitle: 'Software Development Engineer - Intern to FTE',
    description: 'Innovate on behalf of customers across e-commerce, AWS cloud, and smart devices.',
    location: 'Bangalore / Chennai',
    deadline: '2026-11-30',
    hiringProcess: ['Online Aptitude & Coding', 'Technical Interview 1', 'Technical Interview 2', 'Bar Raiser Round']
  },
  {
    id: 'comp_zoho',
    name: 'Zoho Corporation',
    category: 'Dream',
    packageRange: '₹8 - 14 LPA',
    minCgpa: 7.0,
    maxBacklogs: 1,
    eligibleDepartments: ['Computer Science', 'Information Technology', 'Electronics & Comm.', 'Mechanical Eng.', 'Civil Eng.'],
    requiredSkills: ['C', 'Java', 'Python', 'Basic DSA', 'Logical Aptitude'],
    roleTitle: 'Software Developer',
    description: 'Develop enterprise-grade cloud business applications and SaaS products using native engineering stacks.',
    location: 'Chennai / Tenkasi',
    deadline: '2026-10-25',
    hiringProcess: ['Basic Programming', 'Advanced Programming', 'Application Development', 'Technical HR']
  },
  {
    id: 'comp_tcs_digital',
    name: 'TCS (Tata Consultancy Services)',
    category: 'Core',
    packageRange: '₹7 - 9 LPA (Digital) / ₹3.6 LPA (Ninja)',
    minCgpa: 6.5,
    maxBacklogs: 1,
    eligibleDepartments: ['Computer Science', 'Information Technology', 'Electronics & Comm.', 'Electrical Eng.', 'Mechanical Eng.'],
    requiredSkills: ['Aptitude', 'SQL', 'Python', 'Java', 'Web Basics'],
    roleTitle: 'Systems Engineer (Digital Track)',
    description: 'Transform global enterprises with cutting-edge IT services, business solutions, and engineering consulting.',
    location: 'Pan India',
    deadline: '2026-10-18',
    hiringProcess: ['TCS NQT Assessment', 'Technical Interview', 'Managerial Interview', 'HR Interview']
  },
  {
    id: 'comp_infosys',
    name: 'Infosys (Specialist Programmer)',
    category: 'Dream',
    packageRange: '₹9.5 - 12 LPA',
    minCgpa: 7.0,
    maxBacklogs: 0,
    eligibleDepartments: ['Computer Science', 'Information Technology', 'Electronics & Comm.'],
    requiredSkills: ['DSA', 'Algorithms', 'SQL', 'Competitive Coding'],
    roleTitle: 'Specialist Programmer (SP)',
    description: 'Architect next-generation digital services and enterprise transformation software for global fortune 500 clients.',
    location: 'Bangalore / Pune / Mysore',
    deadline: '2026-11-05',
    hiringProcess: ['HackWithInfy Contest', 'Technical In-depth Coding Round', 'HR Discussion']
  },
  {
    id: 'comp_accenture',
    name: 'Accenture',
    category: 'Core',
    packageRange: '₹4.5 - 6.5 LPA',
    minCgpa: 6.5,
    maxBacklogs: 1,
    eligibleDepartments: ['Computer Science', 'Information Technology', 'Electronics & Comm.', 'Electrical Eng.'],
    requiredSkills: ['Aptitude', 'Cloud Fundamentals', 'Python', 'Communication'],
    roleTitle: 'Associate Software Engineer (ASE)',
    description: 'Deliver on the promise of technology and human ingenuity across multi-cloud and enterprise platforms.',
    location: 'Bangalore / Hyderabad / Pune',
    deadline: '2026-10-30',
    hiringProcess: ['Cognitive and Technical Assessment', 'Coding Test', 'Communication Assessment', 'Virtual Interview']
  }
];

export const MOCK_COMPANIES: CompanyCriteria[] = INITIAL_COMPANIES.map((c) => ({
  id: c.id,
  name: c.name,
  tier: c.category === 'Super Dream' ? 'Tier-1 Product' : c.category === 'Dream' ? 'Tier-2 Product' : 'Mass IT',
  minCgpa: c.minCgpa,
  maxBacklogs: c.maxBacklogs,
  package: c.packageRange,
  requiredSkills: c.requiredSkills,
  eligibleDepartments: c.eligibleDepartments,
  roles: [c.roleTitle]
}));

export const INITIAL_ASSESSMENTS: Assessment[] = [
  {
    id: 'assess_java',
    title: 'Java Core & OOPs Engineering',
    topic: 'Java',
    durationMinutes: 15,
    totalQuestions: 5,
    difficulty: 'Intermediate',
    questions: [
      {
        id: 'q_j1',
        text: 'What is the output of the following Java snippet regarding String immutability?',
        type: 'code',
        codeSnippet: `String s1 = "Student";\nString s2 = "Student";\nString s3 = new String("Student");\nSystem.out.println((s1 == s2) + " " + (s1 == s3));`,
        options: ['true false', 'true true', 'false false', 'false true'],
        correctOptionIndex: 0,
        explanation: 's1 and s2 point to the same string in the String Constant Pool (SCP). s3 is created in Heap memory with a distinct object address, so s1 == s3 is false.'
      },
      {
        id: 'q_j2',
        text: 'Which Java 8 feature enables parallel execution of collection transformations on multicore systems?',
        options: ['Parallel Streams', 'Virtual Threads', 'ForkJoinPool ExecutorService', 'CompletableFuture chained async'],
        correctOptionIndex: 0,
        explanation: 'Parallel streams (collection.parallelStream()) partition data into multiple substreams executed simultaneously via the common ForkJoinPool.'
      },
      {
        id: 'q_j3',
        text: 'In Java, what happens if an exception is thrown in both the try block and the finally block?',
        options: [
          'The try exception is propagated and finally exception is lost',
          'The finally exception suppresses or replaces the try exception',
          'Compilation error occurs',
          'Both are thrown as a CombinedException'
        ],
        correctOptionIndex: 1,
        explanation: 'An exception thrown in a finally block takes precedence and suppresses any unhandled exception previously thrown in the try block.'
      },
      {
        id: 'q_j4',
        text: 'Which collection class should be chosen when thread-safe concurrent reads and writes with high throughput are needed without locking the entire map?',
        options: ['Collections.synchronizedMap(new HashMap())', 'Hashtable', 'ConcurrentHashMap', 'TreeMap'],
        correctOptionIndex: 2,
        explanation: 'ConcurrentHashMap utilizes lock-striping / CAS and synchronized buckets rather than locking the entire map.'
      },
      {
        id: 'q_j5',
        text: 'What will happen when you override equals() method but do not override hashCode()?',
        options: [
          'Compile-time error',
          'Objects with equal contents will fail lookups when used as keys in HashMaps or HashSet',
          'Memory leak occurs immediately',
          'No issue as long as equals returns true'
        ],
        correctOptionIndex: 1,
        explanation: 'The contract states that equal objects must have identical hashCodes. Violating this leads to lost entries in hash-based collections.'
      }
    ]
  },
  {
    id: 'assess_python',
    title: 'Python for AI & Systems',
    topic: 'Python',
    durationMinutes: 15,
    totalQuestions: 5,
    difficulty: 'Intermediate',
    questions: [
      {
        id: 'q_p1',
        text: 'What is the output of the following Python list comprehension code?',
        type: 'code',
        codeSnippet: `funcs = [lambda x, n=i: x + n for i in range(3)]\nprint([f(10) for f in funcs])`,
        options: ['[10, 11, 12]', '[12, 12, 12]', '[10, 10, 10]', 'SyntaxError'],
        correctOptionIndex: 0,
        explanation: 'Default arguments are evaluated at function definition time (n=i binds 0, 1, 2). So f(10) yields [10+0, 10+1, 10+2] = [10, 11, 12].'
      },
      {
        id: 'q_p2',
        text: 'What mechanism does Python use to reclaim cyclic references that reference counting alone cannot clear?',
        options: ['Generational Garbage Collector (gc module)', 'Global Interpreter Lock', 'Weakref table', 'Malloc deallocator'],
        correctOptionIndex: 0,
        explanation: 'Python pairs reference counting with a generational cyclic garbage collector that periodically identifies and frees cyclic reference graphs.'
      },
      {
        id: 'q_p3',
        text: 'What does the @property decorator achieve in a Python class?',
        options: [
          'Forces variable to be immutable',
          'Exposes a method as a getter attribute with encapsulation',
          'Runs the method in a separate thread',
          'Registers the class in the global metaclass'
        ],
        correctOptionIndex: 1,
        explanation: 'The @property decorator allows a method to be accessed like an attribute while allowing getter, setter, and deleter logic.'
      },
      {
        id: 'q_p4',
        text: 'What is the time complexity of dictionary lookup and membership test ("key in dict") in Python under average conditions?',
        options: ['O(log n)', 'O(1)', 'O(n)', 'O(n log n)'],
        correctOptionIndex: 1,
        explanation: 'Python dicts are hash tables with open addressing, providing amortized O(1) average-time complexity for lookups and insertions.'
      },
      {
        id: 'q_p5',
        text: 'How does the "yield" keyword differ from "return" in Python functions?',
        options: [
          'Yield terminates execution completely',
          'Yield pauses function state and returns a generator iterator',
          'Yield can only be used with numeric values',
          'Yield executes synchronously in the OS kernel'
        ],
        correctOptionIndex: 1,
        explanation: 'A yield statement turns the function into a generator, suspending its local state and resuming upon the next next() invocation.'
      }
    ]
  },
  {
    id: 'assess_sql',
    title: 'SQL & Relational Database Engineering',
    topic: 'SQL',
    durationMinutes: 15,
    totalQuestions: 5,
    difficulty: 'Intermediate',
    questions: [
      {
        id: 'q_s1',
        text: 'Which SQL window function ranks rows without skipping numbers in the event of ties?',
        options: ['RANK()', 'DENSE_RANK()', 'ROW_NUMBER()', 'NTILE()'],
        correctOptionIndex: 1,
        explanation: 'DENSE_RANK() assigns consecutive rank values (e.g. 1, 2, 2, 3), whereas RANK() skips positions (1, 2, 2, 4).'
      },
      {
        id: 'q_s2',
        text: 'What is the difference between WHERE and HAVING clauses in SQL?',
        options: [
          'WHERE filters rows before aggregation; HAVING filters aggregated groups',
          'HAVING can only be used in subqueries',
          'WHERE works on aggregated aliases; HAVING does not',
          'They are identical and interchangeable'
        ],
        correctOptionIndex: 0,
        explanation: 'WHERE filters individual records prior to the GROUP BY aggregation, while HAVING evaluates post-aggregation conditions.'
      },
      {
        id: 'q_s3',
        text: 'What type of lock prevents concurrent transactions from modifying data read by the current transaction in ACID isolation?',
        options: ['Shared Lock (S-Lock)', 'Exclusive Lock (X-Lock)', 'Intent Lock', 'Deadlock'],
        correctOptionIndex: 0,
        explanation: 'Shared locks allow concurrent readers but prevent other transactions from acquiring exclusive write locks until released.'
      },
      {
        id: 'q_s4',
        text: 'Which normal form eliminates transitive dependencies between non-prime attributes?',
        options: ['1NF', '2NF', '3NF', 'BCNF'],
        correctOptionIndex: 2,
        explanation: 'Third Normal Form (3NF) requires 2NF and mandates that no non-prime attribute is transitively dependent on the primary key.'
      },
      {
        id: 'q_s5',
        text: 'What will happen when you execute DELETE FROM table vs TRUNCATE TABLE?',
        options: [
          'DELETE logs row-by-row deletions and can be rolled back; TRUNCATE deallocates data pages rapidly and resets identities',
          'DELETE is faster than TRUNCATE',
          'TRUNCATE can take a WHERE clause',
          'Both are completely identical in execution'
        ],
        correctOptionIndex: 0,
        explanation: 'DELETE is a DML statement firing triggers and logging each row. TRUNCATE is a DDL statement that deallocates extents with minimal logging.'
      }
    ]
  },
  {
    id: 'assess_dsa',
    title: 'Data Structures & Algorithms Mastery',
    topic: 'DSA',
    durationMinutes: 20,
    totalQuestions: 5,
    difficulty: 'Advanced',
    questions: [
      {
        id: 'q_d1',
        text: 'What is the time and auxiliary space complexity of standard Merge Sort on an array of size n?',
        options: ['O(n log n) time and O(n) auxiliary space', 'O(n^2) time and O(1) space', 'O(n log n) time and O(1) space', 'O(n) time and O(log n) space'],
        correctOptionIndex: 0,
        explanation: 'Merge Sort guarantees O(n log n) time in worst, average, and best cases, requiring O(n) auxiliary space for merging arrays.'
      },
      {
        id: 'q_d2',
        text: 'Which algorithm finds the shortest path in a weighted graph with non-negative edge weights in O((V + E) log V) time with a min-heap?',
        options: ['Dijkstra’s Algorithm', 'Bellman-Ford Algorithm', 'Floyd-Warshall Algorithm', 'Kruskal’s Algorithm'],
        correctOptionIndex: 0,
        explanation: 'Dijkstra’s algorithm with a priority queue/min-heap solves single-source shortest paths on non-negative weighted graphs in O((V + E) log V).'
      },
      {
        id: 'q_d3',
        text: 'Which data structure is optimal for solving the "Next Greater Element" problem in O(n) linear time?',
        options: ['Monotonic Stack', 'Binary Search Tree', 'Min Heap', 'Disjoint Set Union (DSU)'],
        correctOptionIndex: 0,
        explanation: 'A monotonic stack maintains elements in sorted order so each element is pushed and popped at most once, yielding O(n) total time.'
      },
      {
        id: 'q_d4',
        text: 'What is the maximum depth of an AVL tree with n nodes?',
        options: ['~1.44 * log2(n)', 'O(n)', 'O(sqrt(n))', '2 * n'],
        correctOptionIndex: 0,
        explanation: 'Because the balance factor is strictly within {-1, 0, 1}, the worst-case height of an AVL tree is bounded tightly by ~1.44 log2(n).'
      },
      {
        id: 'q_d5',
        text: 'Which Dynamic Programming approach is optimal for the 0/1 Knapsack Problem with capacity W and N items?',
        options: ['O(N * W) 2D/1D table DP', 'O(2^N) Greedy approach', 'O(N log N) Divide and conquer', 'O(W^2) Floyd cycle'],
        correctOptionIndex: 0,
        explanation: 'The 0/1 Knapsack problem uses pseudo-polynomial dynamic programming of O(N * W) time and O(W) space.'
      }
    ]
  },
  {
    id: 'assess_aptitude',
    title: 'Quantitative & Logical Aptitude for Campus Placements',
    topic: 'Aptitude',
    durationMinutes: 15,
    totalQuestions: 5,
    difficulty: 'Intermediate',
    questions: [
      {
        id: 'q_a1',
        text: 'Pipe A can fill a tank in 6 hours and Pipe B in 8 hours. If both pipes are opened together, in how many hours will the tank be full?',
        options: ['3 hours 25 minutes (24/7 hours)', '3 hours 45 minutes', '4 hours', '2 hours 50 minutes'],
        correctOptionIndex: 0,
        explanation: 'Combined rate = 1/6 + 1/8 = 7/24 of the tank per hour. Total time = 24/7 hours = 3 hours and 25.7 minutes.'
      },
      {
        id: 'q_a2',
        text: 'A train 240 m long passes a pole in 24 seconds. How long will it take to pass a platform 650 m long?',
        options: ['89 seconds', '65 seconds', '72 seconds', '80 seconds'],
        correctOptionIndex: 0,
        explanation: 'Speed of train = 240 / 24 = 10 m/s. Total distance for platform = 240 + 650 = 890 m. Time = 890 / 10 = 89 seconds.'
      },
      {
        id: 'q_a3',
        text: 'In an examination, 70% of candidates passed in English, 80% passed in Mathematics, and 10% failed in both subjects. If 144 candidates passed in both, what is the total number of candidates?',
        options: ['240', '200', '300', '280'],
        correctOptionIndex: 0,
        explanation: 'Candidates failing in English = 30%, in Math = 20%, in both = 10%. Union of failures = 30 + 20 - 10 = 40%. Passed in both = 100 - 40 = 60%. 60% of X = 144 -> X = (144 * 100)/60 = 240.'
      },
      {
        id: 'q_a4',
        text: 'Find the next number in the series: 3, 10, 29, 66, 127, ?',
        options: ['218', '216', '198', '224'],
        correctOptionIndex: 0,
        explanation: 'Pattern: 1^3 + 2 = 3; 2^3 + 2 = 10; 3^3 + 2 = 29; 4^3 + 2 = 66; 5^3 + 2 = 127; Next is 6^3 + 2 = 216 + 2 = 218.'
      },
      {
        id: 'q_a5',
        text: 'Pointing to a photograph, Rohit said, "She is the daughter of my grandfather\'s only son." How is Rohit related to the girl in the photograph?',
        options: ['Brother', 'Cousin', 'Uncle', 'Father'],
        correctOptionIndex: 0,
        explanation: 'Grandfather\'s only son is Rohit\'s father. The daughter of Rohit\'s father is Rohit\'s sister. Therefore, Rohit is her brother.'
      }
    ]
  }
];

// Unified Readiness Score calculation strictly following prompt:
// Academics — 20%
// Technical Skills — 25%
// Projects — 15%
// Certifications — 10%
// Resume / ATS — 15%
// Mock Interview — 15%
export function calculateReadinessScore(profile: Partial<StudentProfileData>, latestAssessmentPct: number = 75, atsScore: number = 70, interviewScore: number = 70): { score: number; breakdown: ScoreBreakdown } {
  // 1. Academics (Max 20 pts): based on CGPA out of 10
  const cgpa = profile.cgpa || 7.0;
  const academics = Math.min(20, Math.max(0, Math.round((cgpa / 10) * 20)));

  // 2. Technical Skills (Max 25 pts): assessment performance + verified skills
  const skillsCount = profile.skills ? profile.skills.length : 3;
  const skillFactor = Math.min(1.0, skillsCount / 6);
  const technicalSkills = Math.min(25, Math.max(0, Math.round(((latestAssessmentPct / 100) * 0.7 + skillFactor * 0.3) * 25)));

  // 3. Projects (Max 15 pts): based on documented projects
  const projectsCount = profile.projects ? profile.projects.length : 1;
  const projectFactor = Math.min(1.0, projectsCount / 3);
  const projects = Math.min(15, Math.max(0, Math.round(projectFactor * 15)));

  // 4. Certifications (Max 10 pts):
  const certsCount = profile.certifications ? profile.certifications.length : 1;
  const certFactor = Math.min(1.0, certsCount / 2);
  const certifications = Math.min(10, Math.max(0, Math.round(certFactor * 10)));

  // 5. Resume ATS (Max 15 pts):
  const resumeAts = Math.min(15, Math.max(0, Math.round((atsScore / 100) * 15)));

  // 6. Mock Interview (Max 15 pts):
  const mockInterview = Math.min(15, Math.max(0, Math.round((interviewScore / 100) * 15)));

  const total = Math.min(100, academics + technicalSkills + projects + certifications + resumeAts + mockInterview);

  return {
    score: total,
    breakdown: {
      academics,
      technicalSkills,
      projects,
      certifications,
      resumeAts,
      mockInterview
    }
  };
}
