import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as fbSignOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { 
  auth, 
  db, 
  isFirebaseConfigured, 
  getEffectiveFirebaseConfig, 
  getSavedFirebaseConfig, 
  saveFirebaseConfig, 
  clearCustomFirebaseConfig 
} from './config';
import { UserAccount, StudentProfileData, FacultyProfileData, UserRole, StudentApprovalStatus, AuditLog } from '../types';
import { calculateReadinessScore } from '../data/mockData';

// Initial pre-provisioned accounts for testing & seed
const DEV_STORAGE_KEY_USERS = 'student_twin_users_store';
const DEV_STORAGE_KEY_CURRENT = 'student_twin_current_user_uid';

export const PRE_PROVISIONED_USERS: UserAccount[] = [
  {
    uid: 'admin_master_uid',
    email: 'admin@placement.edu',
    role: 'admin',
    fullName: 'Dr. Suresh Director',
    department: 'Placement Directorate & Dean Academics',
    phoneNumber: '+91 98765 43210',
    active: true,
    createdAt: new Date().toISOString()
  },
  {
    uid: 'faculty_cs_01',
    email: 'faculty.cs@college.edu',
    role: 'faculty',
    fullName: 'Prof. Ramesh Sharma',
    department: 'Computer Science & Engineering',
    phoneNumber: '+91 98765 43211',
    active: true,
    createdAt: new Date().toISOString()
  },
  {
    uid: 'faculty_it_02',
    email: 'faculty.it@college.edu',
    role: 'faculty',
    fullName: 'Dr. Ananya Ray',
    department: 'Information Technology',
    phoneNumber: '+91 98765 43212',
    active: true,
    createdAt: new Date().toISOString()
  },
  {
    uid: 'student_approved_01',
    email: 'student.alex@college.edu',
    role: 'student',
    fullName: 'Alex Varun',
    department: 'Computer Science & Engineering',
    phoneNumber: '+91 98765 43213',
    active: true,
    createdAt: new Date().toISOString()
  },
  {
    uid: 'student_pending_02',
    email: 'student.pending@college.edu',
    role: 'student',
    fullName: 'Priya Sundaram',
    department: 'Computer Science & Engineering',
    phoneNumber: '+91 98765 43214',
    active: true,
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_STUDENTS_PROFILES: Record<string, StudentProfileData> = {
  'student_approved_01': {
    uid: 'student_approved_01',
    rollNumber: '21CS104',
    fullName: 'Alex Varun',
    email: 'student.alex@college.edu',
    department: 'Computer Science & Engineering',
    year: 4,
    cgpa: 8.8,
    backlogs: 0,
    phone: '+91 98765 43213',
    status: 'approved',
    approved: true,
    active: true,
    approvedBy: 'faculty_cs_01',
    approvedAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    assignedFacultyUid: 'faculty_cs_01',
    assignedFacultyName: 'Prof. Ramesh Sharma',
    readinessScore: 84,
    scoreBreakdown: {
      academics: 18, // 20 max
      technicalSkills: 22, // 25 max
      projects: 13, // 15 max
      certifications: 8, // 10 max
      resumeAts: 12, // 15 max
      mockInterview: 11 // 15 max
    },
    targetRoles: ['Full-Stack Developer', 'Software Engineer SDE-1', 'Cloud Solutions Engineer'],
    careerInterests: ['Distributed Systems', 'Cloud Architecture', 'Machine Learning'],
    skills: [
      { name: 'Java', level: 'Advanced', verified: true },
      { name: 'Python', level: 'Intermediate', verified: true },
      { name: 'DSA & Algorithms', level: 'Advanced', verified: true },
      { name: 'SQL & Database Design', level: 'Intermediate', verified: true },
      { name: 'React & TypeScript', level: 'Advanced', verified: true },
      { name: 'Docker & Microservices', level: 'Beginner', verified: false }
    ],
    projects: [
      {
        id: 'proj_1',
        title: 'Distributed Real-Time Task Queue',
        techStack: ['Node.js', 'Redis', 'TypeScript', 'Docker'],
        description: 'Built a fault-tolerant message queue supporting at-least-once delivery with exponential backoff and worker pools.',
        githubUrl: 'https://github.com/alex/task-queue'
      },
      {
        id: 'proj_2',
        title: 'Autonomous Campus Placement Portal',
        techStack: ['React', 'Express', 'PostgreSQL'],
        description: 'Designed automated eligibility screening algorithms and student verification workflows.',
        githubUrl: 'https://github.com/alex/placement-sys'
      }
    ],
    certifications: [
      {
        id: 'cert_1',
        title: 'AWS Certified Cloud Practitioner',
        issuer: 'Amazon Web Services',
        date: '2025-08-10',
        credentialUrl: 'https://aws.amazon.com/verify/103982'
      },
      {
        id: 'cert_2',
        title: 'Java SE 17 Developer Certification',
        issuer: 'Oracle Academy',
        date: '2025-02-14',
        credentialUrl: 'https://oracle.com/verify/4892'
      }
    ],
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  'student_pending_02': {
    uid: 'student_pending_02',
    rollNumber: '21CS148',
    fullName: 'Priya Sundaram',
    email: 'student.pending@college.edu',
    department: 'Computer Science & Engineering',
    year: 4,
    cgpa: 8.2,
    backlogs: 0,
    phone: '+91 98765 43214',
    status: 'pending',
    approved: false,
    active: true,
    readinessScore: 68,
    scoreBreakdown: {
      academics: 16,
      technicalSkills: 17,
      projects: 10,
      certifications: 5,
      resumeAts: 10,
      mockInterview: 10
    },
    targetRoles: ['Frontend Developer', 'UI/UX Engineer'],
    careerInterests: ['Web Technologies', 'Human Computer Interaction'],
    skills: [
      { name: 'JavaScript', level: 'Intermediate', verified: true },
      { name: 'React', level: 'Intermediate', verified: true },
      { name: 'HTML/CSS', level: 'Advanced', verified: true }
    ],
    projects: [
      {
        id: 'proj_p1',
        title: 'College Cultural Fest Web Portal',
        techStack: ['React', 'Tailwind CSS'],
        description: 'Created dynamic ticketing and event scheduling web portal.'
      }
    ],
    certifications: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
};

export const INITIAL_FACULTY_PROFILES: Record<string, FacultyProfileData> = {
  'faculty_cs_01': {
    uid: 'faculty_cs_01',
    facultyId: 'FAC-CS-101',
    fullName: 'Prof. Ramesh Sharma',
    email: 'faculty.cs@college.edu',
    department: 'Computer Science & Engineering',
    designation: 'Associate Professor & HOD',
    active: true,
    assignedStudentCount: 1,
    createdAt: new Date().toISOString()
  },
  'faculty_it_02': {
    uid: 'faculty_it_02',
    facultyId: 'FAC-IT-102',
    fullName: 'Dr. Ananya Ray',
    email: 'faculty.it@college.edu',
    department: 'Information Technology',
    designation: 'Assistant Professor & Placement Coordinator',
    active: true,
    assignedStudentCount: 0,
    createdAt: new Date().toISOString()
  }
};

interface AuthContextType {
  currentUser: UserAccount | null;
  studentProfile: StudentProfileData | null;
  facultyProfile: FacultyProfileData | null;
  loading: boolean;
  isFirebaseActive: boolean;
  allStudents: StudentProfileData[];
  allFaculty: FacultyProfileData[];
  pendingStudentsCount: number;
  auditLogs: AuditLog[];
  firebaseConfig: any;
  isConfigCustom: boolean;
  loginUser: (email: string, pass: string, intendedPortal: UserRole) => Promise<{ success: boolean; error?: string; user?: UserAccount }>;
  registerStudent: (formData: any) => Promise<{ success: boolean; error?: string; uid?: string }>;
  logout: () => Promise<void>;
  reloadUserData: () => Promise<void>;
  updateStudentReadiness: (updates: Partial<StudentProfileData>) => Promise<void>;
  createFacultyAccount: (facultyData: Omit<FacultyProfileData, 'uid' | 'createdAt'>, temporaryPassword: string) => Promise<{ success: boolean; error?: string; uid?: string }>;
  toggleFacultyStatus: (facultyUid: string, active: boolean) => Promise<{ success: boolean; error?: string }>;
  approveStudentRequest: (studentUid: string, facultyUid: string, facultyName: string) => Promise<{ success: boolean; error?: string }>;
  rejectStudentRequest: (studentUid: string, facultyUid: string, reason: string) => Promise<{ success: boolean; error?: string }>;
  assignStudentToFaculty: (studentUid: string, facultyUid: string, facultyName: string) => Promise<{ success: boolean; error?: string }>;
  approveStudent: (studentUid: string, reason?: string) => Promise<{ success: boolean; error?: string }>;
  rejectStudent: (studentUid: string, reason?: string) => Promise<{ success: boolean; error?: string }>;
  createFaculty: (facultyData: any, temporaryPassword?: string) => Promise<{ success: boolean; error?: string; uid?: string }>;
  updateFacultyStatus: (facultyUid: string, active: boolean) => Promise<{ success: boolean; error?: string }>;
  saveCustomFirebaseConfig: (config: any) => void;
  clearCustomFirebaseConfig: () => void;
  getAllUsers: () => UserAccount[];
  getAllStudents: () => StudentProfileData[];
  getAllFaculty: () => FacultyProfileData[];
  getAuditLogs: () => AuditLog[];
  addAuditLog: (action: string, details: string, targetUid?: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [studentProfile, setStudentProfile] = useState<StudentProfileData | null>(null);
  const [facultyProfile, setFacultyProfile] = useState<FacultyProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isFirebaseActive, setIsFirebaseActive] = useState<boolean>(isFirebaseConfigured);

  // In-memory / persistent dev store
  const getStoredUsers = (): UserAccount[] => {
    try {
      const stored = localStorage.getItem(DEV_STORAGE_KEY_USERS);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return PRE_PROVISIONED_USERS;
  };

  const saveStoredUsers = (users: UserAccount[]) => {
    localStorage.setItem(DEV_STORAGE_KEY_USERS, JSON.stringify(users));
  };

  const getStoredStudentProfiles = (): Record<string, StudentProfileData> => {
    try {
      const stored = localStorage.getItem('student_twin_student_profiles');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_STUDENTS_PROFILES;
  };

  const saveStoredStudentProfiles = (profiles: Record<string, StudentProfileData>) => {
    localStorage.setItem('student_twin_student_profiles', JSON.stringify(profiles));
  };

  const getStoredFacultyProfiles = (): Record<string, FacultyProfileData> => {
    try {
      const stored = localStorage.getItem('student_twin_faculty_profiles');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_FACULTY_PROFILES;
  };

  const saveStoredFacultyProfiles = (profiles: Record<string, FacultyProfileData>) => {
    localStorage.setItem('student_twin_faculty_profiles', JSON.stringify(profiles));
  };

  const getAuditLogs = (): AuditLog[] => {
    try {
      const stored = localStorage.getItem('student_twin_audit_logs');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: 'log_seed_1',
        action: 'System Initialized',
        performedByUid: 'system',
        performedByEmail: 'system@placement.edu',
        performedByRole: 'admin',
        details: 'Student Twin Career Platform database initialized with secure role boundary verification.',
        timestamp: new Date().toISOString()
      }
    ];
  };

  const addAuditLog = (action: string, details: string, targetUid?: string) => {
    const logs = getAuditLogs();
    const newLog: AuditLog = {
      id: 'log_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      action,
      performedByUid: currentUser?.uid || 'anonymous',
      performedByEmail: currentUser?.email || 'anonymous',
      performedByRole: currentUser?.role || 'student',
      targetUid,
      details,
      timestamp: new Date().toISOString()
    };
    logs.unshift(newLog);
    localStorage.setItem('student_twin_audit_logs', JSON.stringify(logs.slice(0, 200)));
  };

  // Load user data for a given UID
  const loadUserRecord = async (uid: string) => {
    // Only attempt Firestore read if Firebase is configured AND the currentUser in Firebase Auth is authenticated and matches uid
    if (isFirebaseConfigured && db && auth?.currentUser && auth.currentUser.uid === uid) {
      try {
        const userDocRef = doc(db, 'users', uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const uData = userDocSnap.data() as UserAccount;
          setCurrentUser(uData);

          if (uData.role === 'student') {
            const sDocRef = doc(db, 'studentProfiles', uid);
            const sDocSnap = await getDoc(sDocRef);
            if (sDocSnap.exists()) {
              setStudentProfile(sDocSnap.data() as StudentProfileData);
            }
          } else if (uData.role === 'faculty') {
            const fDocRef = doc(db, 'facultyProfiles', uid);
            const fDocSnap = await getDoc(fDocRef);
            if (fDocSnap.exists()) {
              setFacultyProfile(fDocSnap.data() as FacultyProfileData);
            }
          }
          return;
        }
      } catch (err: any) {
        console.warn('Firestore fetch skipped or failed, using local store:', err?.code || err?.message);
      }
    }

    // Fallback or dev store lookup
    const users = getStoredUsers();
    const found = users.find(u => u.uid === uid);
    if (found) {
      setCurrentUser(found);
      if (found.role === 'student') {
        const profiles = getStoredStudentProfiles();
        setStudentProfile(profiles[uid] || null);
      } else if (found.role === 'faculty') {
        const fProfiles = getStoredFacultyProfiles();
        setFacultyProfile(fProfiles[uid] || null);
      }
    } else {
      setCurrentUser(null);
      setStudentProfile(null);
      setFacultyProfile(null);
    }
  };

  // Auth state listener
  useEffect(() => {
    let unsubscribe: () => void = () => {};

    if (isFirebaseConfigured && auth) {
      unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
          await loadUserRecord(firebaseUser.uid);
        } else {
          // Check if user is authenticated via local/pre-provisioned credentials
          const savedUid = localStorage.getItem(DEV_STORAGE_KEY_CURRENT);
          if (savedUid) {
            await loadUserRecord(savedUid);
          } else {
            setCurrentUser(null);
            setStudentProfile(null);
            setFacultyProfile(null);
          }
        }
        setLoading(false);
      });
    } else {
      // Dev mode: check saved active UID in session
      const savedUid = localStorage.getItem(DEV_STORAGE_KEY_CURRENT);
      if (savedUid) {
        loadUserRecord(savedUid).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    }

    return () => unsubscribe();
  }, [isFirebaseConfigured]);

  const reloadUserData = async () => {
    if (currentUser) {
      await loadUserRecord(currentUser.uid);
    }
  };

  // Login handler with strict role verification
  const loginUser = async (email: string, pass: string, intendedPortal: UserRole): Promise<{ success: boolean; error?: string; user?: UserAccount }> => {
    try {
      setLoading(true);
      const cleanEmail = email.trim().toLowerCase();
      const storedUsers = getStoredUsers();
      const matchedLocal = storedUsers.find(u => u.email.toLowerCase() === cleanEmail);

      let firebaseAuthSuccess = false;
      let firebaseUid = '';

      if (isFirebaseConfigured && auth && db) {
        try {
          const cred = await signInWithEmailAndPassword(auth, email.trim(), pass);
          firebaseAuthSuccess = true;
          firebaseUid = cred.user.uid;
        } catch (fbErr: any) {
          const fbCode = fbErr?.code || '';
          const fbMessage = fbErr?.message || '';
          console.warn('Firebase Auth sign-in failed:', fbCode, fbMessage);

          // If this is a pre-provisioned system/demo account or local account, fall through to local verification
          if (!matchedLocal) {
            setLoading(false);
            if (fbCode === 'auth/configuration-not-found' || fbMessage.includes('configuration-not-found')) {
              return {
                success: false,
                error: 'Firebase Email/Password Authentication is not enabled. Go to your Firebase Console -> Authentication -> Sign-in method -> Email/Password and click Enable.'
              };
            }
            if (fbCode === 'auth/user-not-found' || fbCode === 'auth/invalid-credential') {
              return { success: false, error: 'Invalid email or password.' };
            }
            return { success: false, error: fbMessage || 'Authentication failed. Please check credentials.' };
          }
        }
      }

      // 1. If Firebase Auth succeeded and Firestore has the record
      if (firebaseAuthSuccess && firebaseUid && db) {
        try {
          const userDocRef = doc(db, 'users', firebaseUid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const userRecord = userDocSnap.data() as UserAccount;

            if (!userRecord.active) {
              if (auth) await fbSignOut(auth);
              setLoading(false);
              addAuditLog('Deactivated Login Attempt', `User ${email} tried to log in but account is deactivated.`, firebaseUid);
              return { success: false, error: 'Your account has been deactivated. Please contact the administrator.' };
            }

            if (userRecord.role !== intendedPortal) {
              if (auth) await fbSignOut(auth);
              setLoading(false);
              addAuditLog('Wrong Portal Access Attempt', `User ${email} with role '${userRecord.role}' attempted to log into '${intendedPortal}' portal.`, firebaseUid);
              return { 
                success: false, 
                error: `Access Denied: You are authorized as '${userRecord.role.toUpperCase()}', but attempted to access the '${intendedPortal.toUpperCase()}' portal. Please use the appropriate portal.` 
              };
            }

            setCurrentUser(userRecord);
            await loadUserRecord(firebaseUid);
            addAuditLog('User Login', `User ${email} logged into ${intendedPortal} portal successfully.`, firebaseUid);
            setLoading(false);
            return { success: true, user: userRecord };
          }
        } catch (dbErr) {
          console.warn('Failed to retrieve user doc from Firestore, checking local store:', dbErr);
        }
      }

      // 2. Pre-provisioned demo accounts or local storage verification
      if (matchedLocal) {
        // Verify active status
        if (!matchedLocal.active) {
          setLoading(false);
          addAuditLog('Deactivated Login Attempt', `User ${email} tried to log in but account is deactivated.`, matchedLocal.uid);
          return { success: false, error: 'Your account has been deactivated by administration. Contact Placement Directorate.' };
        }

        // Verify role strictly matches intended portal
        if (matchedLocal.role !== intendedPortal) {
          setLoading(false);
          addAuditLog('Wrong Portal Access Attempt', `User ${email} with role '${matchedLocal.role}' attempted to log into '${intendedPortal}' portal.`, matchedLocal.uid);
          return { 
            success: false, 
            error: `Access Denied: You are registered as '${matchedLocal.role.toUpperCase()}'. You cannot log in via the '${intendedPortal.toUpperCase()}' portal.` 
          };
        }

        localStorage.setItem(DEV_STORAGE_KEY_CURRENT, matchedLocal.uid);
        setCurrentUser(matchedLocal);
        await loadUserRecord(matchedLocal.uid);
        addAuditLog('User Login', `User ${email} logged into ${intendedPortal} portal.`, matchedLocal.uid);
        setLoading(false);
        return { success: true, user: matchedLocal };
      }

      setLoading(false);
      return { success: false, error: 'Invalid email or password.' };
    } catch (err: any) {
      setLoading(false);
      const errMsg = err?.message || 'Authentication failed. Check your network or credentials.';
      return { success: false, error: errMsg };
    }
  };

  // Student registration (Role: student, Status: pending, Approved: false)
  const registerStudent = async (formData: any): Promise<{ success: boolean; error?: string; uid?: string }> => {
    try {
      setLoading(true);
      const email = formData.email.trim();
      const password = formData.password;

      let uid = 'student_' + Date.now();

      let firebaseCreated = false;

      if (isFirebaseConfigured && auth && db) {
        try {
          const userCred = await createUserWithEmailAndPassword(auth, email, password);
          uid = userCred.user.uid;
          firebaseCreated = true;

          const userRecord: UserAccount = {
            uid,
            email,
            role: 'student',
            fullName: formData.fullName.trim(),
            department: formData.department,
            phoneNumber: formData.phoneNumber,
            active: true,
            createdAt: new Date().toISOString()
          };

          const initialScoreData = calculateReadinessScore({
            cgpa: parseFloat(formData.cgpa) || 7.0,
            skills: [],
            projects: [],
            certifications: []
          });

          const studentData: StudentProfileData = {
            uid,
            rollNumber: formData.rollNumber.trim(),
            fullName: formData.fullName.trim(),
            email,
            department: formData.department,
            year: parseInt(formData.year) || 4,
            cgpa: parseFloat(formData.cgpa) || 7.0,
            backlogs: parseInt(formData.backlogs) || 0,
            phone: formData.phoneNumber || '',
            status: 'pending',
            approved: false,
            active: true,
            readinessScore: initialScoreData.score,
            scoreBreakdown: initialScoreData.breakdown,
            targetRoles: formData.targetRole ? [formData.targetRole] : ['Software Engineer'],
            careerInterests: ['Software Engineering', 'System Development'],
            skills: formData.skills ? formData.skills.map((s: string) => ({ name: s, level: 'Intermediate', verified: false })) : [],
            projects: [],
            certifications: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };

          try {
            await setDoc(doc(db, 'users', uid), userRecord);
            await setDoc(doc(db, 'studentProfiles', uid), studentData);
          } catch (docErr: any) {
            console.warn('Firestore document write skipped or failed, profile stored locally:', docErr?.code || docErr?.message);
          }

          // Also save in local store as cache
          const localUsers = getStoredUsers();
          if (!localUsers.some(u => u.uid === uid || u.email.toLowerCase() === email.toLowerCase())) {
            localUsers.push(userRecord);
            saveStoredUsers(localUsers);
          }
          const sProfiles = getStoredStudentProfiles();
          sProfiles[uid] = studentData;
          saveStoredStudentProfiles(sProfiles);

          addAuditLog('Student Registered', `Student ${formData.fullName} (${email}) registered. Status: PENDING approval.`, uid);
          setLoading(false);
          return { success: true, uid };
        } catch (fbErr: any) {
          console.warn('Firebase user creation failed, falling back to local registration store:', fbErr?.code || fbErr?.message);
        }
      }

      // Local / Offline store fallback
      const users = getStoredUsers();
      if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        setLoading(false);
        return { success: false, error: 'An account with this email address already exists.' };
      }

      const userRecord: UserAccount = {
        uid,
        email,
        role: 'student',
        fullName: formData.fullName.trim(),
        department: formData.department,
        phoneNumber: formData.phoneNumber,
        active: true,
        createdAt: new Date().toISOString()
      };

      const initialScoreData = calculateReadinessScore({
        cgpa: parseFloat(formData.cgpa) || 7.0,
        skills: [],
        projects: [],
        certifications: []
      });

      const studentData: StudentProfileData = {
        uid,
        rollNumber: formData.rollNumber.trim(),
        fullName: formData.fullName.trim(),
        email,
        department: formData.department,
        year: parseInt(formData.year) || 4,
        cgpa: parseFloat(formData.cgpa) || 7.0,
        backlogs: parseInt(formData.backlogs) || 0,
        phone: formData.phoneNumber || '',
        status: 'pending',
        approved: false,
        active: true,
        readinessScore: initialScoreData.score,
        scoreBreakdown: initialScoreData.breakdown,
        targetRoles: formData.targetRole ? [formData.targetRole] : ['Software Engineer'],
        careerInterests: ['Software Engineering'],
        skills: formData.skills ? formData.skills.map((s: string) => ({ name: s, level: 'Intermediate', verified: false })) : [],
        projects: [],
        certifications: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      users.push(userRecord);
      saveStoredUsers(users);

      const sProfiles = getStoredStudentProfiles();
      sProfiles[uid] = studentData;
      saveStoredStudentProfiles(sProfiles);

      addAuditLog('Student Registered', `Student ${formData.fullName} registered. Status: PENDING approval.`, uid);
      setLoading(false);
      return { success: true, uid };
    } catch (err: any) {
      setLoading(false);
      return { success: false, error: err?.message || 'Registration failed.' };
    }
  };

  // Logout
  const logout = async () => {
    if (isFirebaseConfigured && auth) {
      try {
        await fbSignOut(auth);
      } catch (e) {
        console.error('Firebase signout error', e);
      }
    }
    localStorage.removeItem(DEV_STORAGE_KEY_CURRENT);
    setCurrentUser(null);
    setStudentProfile(null);
    setFacultyProfile(null);
  };

  // Update readiness score on trusted student profile
  const updateStudentReadiness = async (updates: Partial<StudentProfileData>) => {
    if (!studentProfile) return;
    const updated = { ...studentProfile, ...updates, updatedAt: new Date().toISOString() };
    
    // Recalculate score with trusted formula
    const calculated = calculateReadinessScore(updated);
    updated.readinessScore = calculated.score;
    updated.scoreBreakdown = calculated.breakdown;

    if (isFirebaseConfigured && db && auth?.currentUser) {
      try {
        await updateDoc(doc(db, 'studentProfiles', studentProfile.uid), updated);
      } catch (e: any) {
        console.warn('Firestore updateDoc skipped or failed, updated locally:', e?.code || e?.message);
      }
    }

    const sProfiles = getStoredStudentProfiles();
    sProfiles[studentProfile.uid] = updated;
    saveStoredStudentProfiles(sProfiles);
    setStudentProfile(updated);
  };

  // Admin creates faculty
  const createFacultyAccount = async (facultyData: Omit<FacultyProfileData, 'uid' | 'createdAt'>, temporaryPassword: string): Promise<{ success: boolean; error?: string; uid?: string }> => {
    if (currentUser?.role !== 'admin') {
      return { success: false, error: 'Unauthorized: Only Admin can create Faculty accounts.' };
    }

    const uid = 'faculty_' + Date.now();
    const email = facultyData.email.trim();

    const userRecord: UserAccount = {
      uid,
      email,
      role: 'faculty',
      fullName: facultyData.fullName.trim(),
      department: facultyData.department,
      active: true,
      createdAt: new Date().toISOString()
    };

    const newFaculty: FacultyProfileData = {
      ...facultyData,
      uid,
      active: true,
      assignedStudentCount: 0,
      createdAt: new Date().toISOString()
    };

    if (isFirebaseConfigured && db && auth?.currentUser) {
      try {
        await setDoc(doc(db, 'users', uid), userRecord);
        await setDoc(doc(db, 'facultyProfiles', uid), newFaculty);
      } catch (e: any) {
        console.warn('Firestore createFacultyAccount skipped or failed, stored locally:', e?.code || e?.message);
      }
    }

    const users = getStoredUsers();
    users.push(userRecord);
    saveStoredUsers(users);

    const fProfiles = getStoredFacultyProfiles();
    fProfiles[uid] = newFaculty;
    saveStoredFacultyProfiles(fProfiles);

    addAuditLog('Faculty Created', `Admin created Faculty: ${facultyData.fullName} (${email}), Dept: ${facultyData.department}`, uid);

    return { success: true, uid };
  };

  // Admin activates/deactivates faculty
  const toggleFacultyStatus = async (facultyUid: string, active: boolean): Promise<{ success: boolean; error?: string }> => {
    if (currentUser?.role !== 'admin') {
      return { success: false, error: 'Unauthorized' };
    }

    if (isFirebaseConfigured && db && auth?.currentUser) {
      try {
        await updateDoc(doc(db, 'users', facultyUid), { active });
        await updateDoc(doc(db, 'facultyProfiles', facultyUid), { active });
      } catch (e: any) {
        console.warn('Firestore toggleFacultyStatus skipped or failed, updated locally:', e?.code || e?.message);
      }
    }

    const users = getStoredUsers().map(u => u.uid === facultyUid ? { ...u, active } : u);
    saveStoredUsers(users);

    const fProfiles = getStoredFacultyProfiles();
    if (fProfiles[facultyUid]) {
      fProfiles[facultyUid].active = active;
      saveStoredFacultyProfiles(fProfiles);
    }

    addAuditLog(active ? 'Faculty Activated' : 'Faculty Deactivated', `Faculty ${facultyUid} status set to active=${active}`, facultyUid);

    return { success: true };
  };

  // Faculty approves student
  const approveStudentRequest = async (studentUid: string, facultyUid: string, facultyName: string): Promise<{ success: boolean; error?: string }> => {
    if (currentUser?.role !== 'faculty' && currentUser?.role !== 'admin') {
      return { success: false, error: 'Unauthorized: Only authorized Faculty or Admin can approve students.' };
    }

    const updates = {
      status: 'approved' as StudentApprovalStatus,
      approved: true,
      approvedBy: facultyUid,
      approvedAt: new Date().toISOString(),
      assignedFacultyUid: facultyUid,
      assignedFacultyName: facultyName,
      updatedAt: new Date().toISOString()
    };

    if (isFirebaseConfigured && db && auth?.currentUser) {
      try {
        await updateDoc(doc(db, 'studentProfiles', studentUid), updates);
      } catch (e: any) {
        console.warn('Firestore approveStudentRequest skipped or failed, updated locally:', e?.code || e?.message);
      }
    }

    const sProfiles = getStoredStudentProfiles();
    if (sProfiles[studentUid]) {
      sProfiles[studentUid] = { ...sProfiles[studentUid], ...updates };
      saveStoredStudentProfiles(sProfiles);
    }

    addAuditLog('Student Approved', `Student ${studentUid} approved by Faculty ${facultyName} (${facultyUid})`, studentUid);

    return { success: true };
  };

  // Faculty rejects student
  const rejectStudentRequest = async (studentUid: string, facultyUid: string, reason: string): Promise<{ success: boolean; error?: string }> => {
    if (currentUser?.role !== 'faculty' && currentUser?.role !== 'admin') {
      return { success: false, error: 'Unauthorized: Only authorized Faculty or Admin can reject students.' };
    }

    const updates = {
      status: 'rejected' as StudentApprovalStatus,
      approved: false,
      rejectionReason: reason || 'Academic credentials or verification incomplete.',
      updatedAt: new Date().toISOString()
    };

    if (isFirebaseConfigured && db && auth?.currentUser) {
      try {
        await updateDoc(doc(db, 'studentProfiles', studentUid), updates);
      } catch (e: any) {
        console.warn('Firestore rejectStudentRequest skipped or failed, updated locally:', e?.code || e?.message);
      }
    }

    const sProfiles = getStoredStudentProfiles();
    if (sProfiles[studentUid]) {
      sProfiles[studentUid] = { ...sProfiles[studentUid], ...updates };
      saveStoredStudentProfiles(sProfiles);
    }

    addAuditLog('Student Rejected', `Student ${studentUid} rejected by Faculty (${facultyUid}). Reason: ${reason}`, studentUid);

    return { success: true };
  };

  // Admin assigns student to faculty
  const assignStudentToFaculty = async (studentUid: string, facultyUid: string, facultyName: string): Promise<{ success: boolean; error?: string }> => {
    if (currentUser?.role !== 'admin') {
      return { success: false, error: 'Unauthorized: Only Admin can assign students to Faculty.' };
    }

    const updates = {
      assignedFacultyUid: facultyUid,
      assignedFacultyName: facultyName,
      updatedAt: new Date().toISOString()
    };

    if (isFirebaseConfigured && db && auth?.currentUser) {
      try {
        await updateDoc(doc(db, 'studentProfiles', studentUid), updates);
      } catch (e: any) {
        console.warn('Firestore assignStudentToFaculty skipped or failed, updated locally:', e?.code || e?.message);
      }
    }

    const sProfiles = getStoredStudentProfiles();
    if (sProfiles[studentUid]) {
      sProfiles[studentUid] = { ...sProfiles[studentUid], ...updates };
      saveStoredStudentProfiles(sProfiles);
    }

    addAuditLog('Student Assigned', `Student ${studentUid} assigned to Faculty ${facultyName} (${facultyUid})`, studentUid);

    return { success: true };
  };

  const getAllUsers = () => getStoredUsers();
  const getAllStudents = () => Object.values(getStoredStudentProfiles());
  const getAllFaculty = () => Object.values(getStoredFacultyProfiles());

  const allStudents = Object.values(getStoredStudentProfiles());
  const allFaculty = Object.values(getStoredFacultyProfiles());
  const pendingStudentsCount = allStudents.filter((s) => s.status === 'pending').length;
  const auditLogs = getAuditLogs();
  const firebaseConfig = getEffectiveFirebaseConfig() || { projectId: 'student-twin-prod', authDomain: '', storageBucket: '' };
  const isConfigCustom = Boolean(getSavedFirebaseConfig());

  const approveStudent = async (studentUid: string, reason?: string) => {
    return approveStudentRequest(
      studentUid, 
      currentUser?.uid || 'admin', 
      currentUser?.fullName || 'Faculty/Admin'
    );
  };

  const rejectStudent = async (studentUid: string, reason: string = 'Criteria not satisfied') => {
    return rejectStudentRequest(
      studentUid, 
      currentUser?.uid || 'admin', 
      reason
    );
  };

  const createFaculty = async (facultyData: any, temporaryPassword?: string) => {
    return createFacultyAccount(facultyData, temporaryPassword || 'Faculty@123');
  };

  const updateFacultyStatus = async (facultyUid: string, active: boolean) => {
    return toggleFacultyStatus(facultyUid, active);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        studentProfile,
        facultyProfile,
        loading,
        isFirebaseActive,
        allStudents,
        allFaculty,
        pendingStudentsCount,
        auditLogs,
        firebaseConfig,
        isConfigCustom,
        loginUser,
        registerStudent,
        logout,
        reloadUserData,
        updateStudentReadiness,
        createFacultyAccount,
        toggleFacultyStatus,
        approveStudentRequest,
        rejectStudentRequest,
        assignStudentToFaculty,
        approveStudent,
        rejectStudent,
        createFaculty,
        updateFacultyStatus,
        saveCustomFirebaseConfig: saveFirebaseConfig,
        clearCustomFirebaseConfig,
        getAllUsers,
        getAllStudents,
        getAllFaculty,
        getAuditLogs,
        addAuditLog
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
