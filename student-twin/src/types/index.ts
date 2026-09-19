export type UserRole = 'student' | 'faculty' | 'admin';

export type StudentApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface UserAccount {
  uid: string;
  email: string;
  role: UserRole;
  fullName: string;
  department: string;
  phoneNumber?: string;
  active: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface ScoreBreakdown {
  academics: number; // Max 20%
  technicalSkills: number; // Max 25%
  projects: number; // Max 15%
  certifications: number; // Max 10%
  resumeAts: number; // Max 15%
  mockInterview: number; // Max 15%
}

export interface StudentProfileData {
  uid: string;
  rollNumber: string;
  fullName: string;
  email: string;
  department: string;
  year: number;
  cgpa: number;
  backlogs: number;
  phone: string;
  status: StudentApprovalStatus;
  approved: boolean;
  active: boolean;
  rejectionReason?: string;
  approvedBy?: string;
  approvedAt?: string;
  assignedFacultyUid?: string;
  assignedFacultyName?: string;
  
  // Readiness and Career Twin
  readinessScore: number; // 0 to 100
  scoreBreakdown: ScoreBreakdown;
  targetRole?: string;
  targetRoles: string[];
  careerInterests: string[];
  skills: { name: string; level: 'Beginner' | 'Intermediate' | 'Advanced'; verified: boolean }[];
  projects: { id: string; title: string; techStack: string[]; description: string; githubUrl?: string }[];
  certifications: { id: string; title: string; issuer: string; date: string; credentialUrl?: string }[];
  
  createdAt: string;
  updatedAt: string;
}

export interface FacultyProfileData {
  uid: string;
  facultyId: string;
  fullName: string;
  email: string;
  department: string;
  designation: string;
  active: boolean;
  assignedStudentCount?: number;
  createdAt: string;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  type?: 'mcq' | 'code';
  codeSnippet?: string;
}

export interface Assessment {
  id: string;
  title: string;
  topic: 'Java' | 'Python' | 'SQL' | 'DSA' | 'Aptitude';
  durationMinutes: number;
  totalQuestions: number;
  questions: Question[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface AssessmentAttempt {
  id: string;
  userId: string;
  assessmentId: string;
  assessmentTitle: string;
  topic: string;
  score: number;
  totalScore: number;
  percentage: number;
  passed: boolean;
  answers: Record<string, number>;
  completedAt: string;
}

export interface Company {
  id: string;
  name: string;
  logo?: string;
  category: 'Dream' | 'Super Dream' | 'Core' | 'Mass Recruiter';
  packageRange: string;
  minCgpa: number;
  maxBacklogs: number;
  eligibleDepartments: string[];
  requiredSkills: string[];
  roleTitle: string;
  description: string;
  location: string;
  deadline?: string;
  hiringProcess: string[];
}

export interface CompanyEligibilityResult {
  company: Company;
  status: 'Eligible' | 'Not Eligible' | 'Needs Improvement';
  matchPercentage: number;
  reasons: string[];
  unmetCriteria: string[];
  recommendations: string[];
}

export interface ResumeAnalysis {
  id: string;
  userId: string;
  atsScore: number; // 0-100
  skillsIdentified: string[];
  missingKeywords: string[];
  formatScore: number;
  educationScore: number;
  projectScore: number;
  experienceScore: number;
  strengths: string[];
  improvements: string[];
  analyzedAt: string;
}

export interface MockInterviewSession {
  id: string;
  userId: string;
  targetRole: string;
  category: 'Technical' | 'HR' | 'Behavioral' | 'Mixed';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  overallScore: number;
  status: 'in-progress' | 'completed';
  conversation: {
    role: 'ai' | 'user';
    message: string;
    score?: number;
    feedback?: string;
    timestamp: string;
  }[];
  summaryFeedback?: string;
  weakAreas?: string[];
  strengths?: string[];
  recommendedImprovements?: string[];
  createdAt: string;
  completedAt?: string;
}

export interface RoadmapStep {
  id: string;
  title: string;
  description: string;
  category: 'Skill Building' | 'Project' | 'Certification' | 'Interview Prep' | 'ATS Resume';
  status: 'pending' | 'in_progress' | 'completed';
  resources: { name: string; url: string }[];
  targetWeek: number;
}

export interface LearningRoadmap {
  id: string;
  userId: string;
  targetRole: string;
  generatedAt: string;
  progressPercentage: number;
  steps: RoadmapStep[];
}

export interface FacultyNote {
  id: string;
  studentUid: string;
  facultyUid: string;
  facultyName: string;
  note: string;
  category: 'Praise' | 'Improvement' | 'Action Item' | 'General';
  createdAt: string;
}

export interface AuditLog {
  id: string;
  action: string;
  performedByUid: string;
  performedByEmail: string;
  performedByRole: UserRole;
  targetUid?: string;
  details: string;
  timestamp: string;
}

export type StudentProfile = StudentProfileData;
export type FacultyProfile = FacultyProfileData;

export interface CompanyCriteria {
  id: string;
  name: string;
  tier: string;
  minCgpa: number;
  maxBacklogs: number;
  package: string;
  requiredSkills: string[];
  eligibleDepartments: string[];
  roles: string[];
}

export interface AuditLogEntry {
  id: string;
  actorName: string;
  actorRole: string;
  action: string;
  details: string;
  timestamp: string;
}
