import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import RoleBasedRedirect from './components/RoleBasedRedirect';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import StudentManagement from './pages/admin/StudentManagement';
import TeacherManagement from './pages/admin/TeacherManagement';
import SubjectClassManagement from './pages/admin/SubjectClassManagement';
import SemesterManagement from './pages/admin/SemesterManagement';
import StudentDashboard from './pages/student/StudentDashboard';
import StudentClasses from './pages/student/StudentClasses';
import StudentSubjects from './pages/student/StudentSubjects';
import StudentSchedule from './pages/student/StudentSchedule';
import StudentGrades from './pages/student/StudentGrades';
import StudentAttendance from './pages/student/StudentAttendance';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import TeacherClasses from './pages/teacher/TeacherClasses';
import TeacherSubjects from './pages/teacher/TeacherSubjects';
import TeacherSchedule from './pages/teacher/TeacherSchedule';
import TeacherAttendance from './pages/teacher/TeacherAttendance';
import TeacherGrades from './pages/teacher/TeacherGrades';


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <RoleBasedRedirect />
            </ProtectedRoute>
          } />
          
          {/* Dashboard route for general access */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } />
          
          {/* Profile route for all users */}
          <Route path="/profile" element={
            <ProtectedRoute>
              <Layout>
                <div className="p-6">
                  <h1 className="text-2xl font-bold text-gray-900">Hồ sơ cá nhân</h1>
                  <p className="mt-2 text-gray-600">Quản lý thông tin cá nhân của bạn</p>
                </div>
              </Layout>
            </ProtectedRoute>
          } />
          
          {/* Admin routes */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute requiredRole="admin">
              <Layout>
                <AdminDashboard />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute requiredRole="admin">
              <Layout>
                <UserManagement />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/admin/students" element={
            <ProtectedRoute requiredRole="admin">
              <Layout>
                <StudentManagement />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/admin/teachers" element={
            <ProtectedRoute requiredRole="admin">
              <Layout>
                <TeacherManagement />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/admin/subjects-classes" element={
            <ProtectedRoute requiredRole="admin">
              <Layout>
                <SubjectClassManagement />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/admin/semesters" element={
            <ProtectedRoute requiredRole="admin">
              <Layout>
                <SemesterManagement />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/admin/reports" element={
            <ProtectedRoute requiredRole="admin">
              <Layout>
                <div className="p-6">
                  <h1 className="text-2xl font-bold text-gray-900">Báo cáo</h1>
                  <p className="mt-2 text-gray-600">Các báo cáo thống kê sẽ được phát triển ở đây</p>
                </div>
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/admin/settings" element={
            <ProtectedRoute requiredRole="admin">
              <Layout>
                <div className="p-6">
                  <h1 className="text-2xl font-bold text-gray-900">Cài đặt hệ thống</h1>
                  <p className="mt-2 text-gray-600">Cài đặt hệ thống sẽ được phát triển ở đây</p>
                </div>
              </Layout>
            </ProtectedRoute>
          } />
          
          {/* Teacher routes */}
          <Route path="/teacher/dashboard" element={
            <ProtectedRoute requiredRole="teacher">
              <Layout>
                <TeacherDashboard />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/teacher/classes" element={
            <ProtectedRoute requiredRole="teacher">
              <Layout>
                <TeacherClasses />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/teacher/subjects" element={
            <ProtectedRoute requiredRole="teacher">
              <Layout>
                <TeacherSubjects />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/teacher/schedule" element={
            <ProtectedRoute requiredRole="teacher">
              <Layout>
                <TeacherSchedule />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/teacher/attendance" element={
            <ProtectedRoute requiredRole="teacher">
              <Layout>
                <TeacherAttendance />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/teacher/grades" element={
            <ProtectedRoute requiredRole="teacher">
              <Layout>
                <TeacherGrades />
              </Layout>
            </ProtectedRoute>
          } />
          
          {/* Student routes */}
          <Route path="/student/dashboard" element={
            <ProtectedRoute requiredRole="student">
              <Layout>
                <StudentDashboard />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/student/classes" element={
            <ProtectedRoute requiredRole="student">
              <Layout>
                <StudentClasses />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/student/subjects" element={
            <ProtectedRoute requiredRole="student">
              <Layout>
                <StudentSubjects />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/student/schedule" element={
            <ProtectedRoute requiredRole="student">
              <Layout>
                <StudentSchedule />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/student/grades" element={
            <ProtectedRoute requiredRole="student">
              <Layout>
                <StudentGrades />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/student/attendance" element={
            <ProtectedRoute requiredRole="student">
              <Layout>
                <StudentAttendance />
              </Layout>
            </ProtectedRoute>
          } />
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
