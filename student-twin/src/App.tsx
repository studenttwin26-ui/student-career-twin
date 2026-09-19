/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './firebase/authContext';
import { Navbar } from './components/Navbar';
import { RoleProtectedRoute } from './components/RoleProtectedRoute';
import { StudentLayout } from './components/StudentLayout';
import { FacultyLayout } from './components/FacultyLayout';
import { AdminLayout } from './components/AdminLayout';

// Public & Auth Pages
import { LandingPage } from './pages/LandingPage';
import { StudentLoginPage } from './pages/auth/StudentLoginPage';
import { FacultyLoginPage } from './pages/auth/FacultyLoginPage';
import { AdminLoginPage } from './pages/auth/AdminLoginPage';
import { StudentRegisterPage } from './pages/auth/StudentRegisterPage';
import { StudentPendingPage } from './pages/auth/StudentPendingPage';

// Student Portal Pages
import { StudentDashboardPage } from './pages/student/StudentDashboardPage';
import { CareerTwinPage } from './pages/student/CareerTwinPage';
import { AssessmentsPage } from './pages/student/AssessmentsPage';
import { ResumeAnalyzerPage } from './pages/student/ResumeAnalyzerPage';
import { MockInterviewPage } from './pages/student/MockInterviewPage';
import { LearningRoadmapPage } from './pages/student/LearningRoadmapPage';
import { CompanyEligibilityPage } from './pages/student/CompanyEligibilityPage';
import { PlacementSimulatorPage } from './pages/student/PlacementSimulatorPage';
import { StudentProfilePage } from './pages/student/StudentProfilePage';

// Faculty Portal Pages
import { FacultyDashboardPage } from './pages/faculty/FacultyDashboardPage';
import { RegistrationRequestsPage } from './pages/faculty/RegistrationRequestsPage';
import { MyStudentsPage } from './pages/faculty/MyStudentsPage';
import { CohortProgressPage } from './pages/faculty/CohortProgressPage';
import { MentoringNotesPage } from './pages/faculty/MentoringNotesPage';

// Admin Portal Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { FacultyManagementPage } from './pages/admin/FacultyManagementPage';
import { StudentManagementPage } from './pages/admin/StudentManagementPage';
import { FacultyStudentAssignmentsPage } from './pages/admin/FacultyStudentAssignmentsPage';
import { CompanyManagementPage } from './pages/admin/CompanyManagementPage';
import { AuditLogsPage } from './pages/admin/AuditLogsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500 selection:text-white antialiased">
          <Navbar />

          <div className="flex-1 flex flex-col">
            <Routes>
              {/* Public Gateway & Auth Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/student-login" element={<StudentLoginPage />} />
              <Route path="/faculty-login" element={<FacultyLoginPage />} />
              <Route path="/admin-login" element={<AdminLoginPage />} />
              <Route path="/student-register" element={<StudentRegisterPage />} />
              <Route path="/register" element={<StudentRegisterPage />} />
              <Route path="/student-pending" element={<StudentPendingPage />} />
              <Route path="/pending" element={<StudentPendingPage />} />
              <Route path="/login" element={<Navigate to="/student-login" replace />} />

              {/* Student Portal - Protected & Approved */}
              <Route
                path="/student"
                element={
                  <RoleProtectedRoute allowedRoles={['student']} requireApprovedStudent={true}>
                    <StudentLayout />
                  </RoleProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/student/dashboard" replace />} />
                <Route path="dashboard" element={<StudentDashboardPage />} />
                <Route path="twin" element={<CareerTwinPage />} />
                <Route path="career-twin" element={<CareerTwinPage />} />
                <Route path="assessments" element={<AssessmentsPage />} />
                <Route path="resume" element={<ResumeAnalyzerPage />} />
                <Route path="resume-analyzer" element={<ResumeAnalyzerPage />} />
                <Route path="mock-interview" element={<MockInterviewPage />} />
                <Route path="roadmap" element={<LearningRoadmapPage />} />
                <Route path="companies" element={<CompanyEligibilityPage />} />
                <Route path="placement-simulator" element={<PlacementSimulatorPage />} />
                <Route path="profile" element={<StudentProfilePage />} />
              </Route>

              {/* Faculty Portal - Protected (Faculty or Admin) */}
              <Route
                path="/faculty"
                element={
                  <RoleProtectedRoute allowedRoles={['faculty', 'admin']}>
                    <FacultyLayout />
                  </RoleProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/faculty/dashboard" replace />} />
                <Route path="dashboard" element={<FacultyDashboardPage />} />
                <Route path="requests" element={<RegistrationRequestsPage />} />
                <Route path="students" element={<MyStudentsPage />} />
                <Route path="progress" element={<CohortProgressPage />} />
                <Route path="mentoring" element={<MentoringNotesPage />} />
              </Route>

              {/* Admin Portal - Protected (Admin only) */}
              <Route
                path="/admin"
                element={
                  <RoleProtectedRoute allowedRoles={['admin']}>
                    <AdminLayout />
                  </RoleProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboardPage />} />
                <Route path="faculty" element={<FacultyManagementPage />} />
                <Route path="students" element={<StudentManagementPage />} />
                <Route path="assignments" element={<FacultyStudentAssignmentsPage />} />
                <Route path="companies" element={<CompanyManagementPage />} />
                <Route path="audit-logs" element={<AuditLogsPage />} />
                <Route path="settings" element={<AdminSettingsPage />} />
              </Route>

              {/* Fallback Catch-All */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
