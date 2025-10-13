import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/admin/UserManagement';
import StudentManagement from './pages/admin/StudentManagement';
import TeacherManagement from './pages/admin/TeacherManagement';
import SubjectClassManagement from './pages/admin/SubjectClassManagement';
import SemesterManagement from './pages/admin/SemesterManagement';

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
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            {/* Admin routes */}
            <Route path="admin/*" element={
              <ProtectedRoute requiredRole="admin">
                <Routes>
                  <Route path="users" element={<UserManagement />} />
                  <Route path="students" element={<StudentManagement />} />
                  <Route path="teachers" element={<TeacherManagement />} />
                  <Route path="subjects-classes" element={<SubjectClassManagement />} />
                  <Route path="semesters" element={<SemesterManagement />} />
                  <Route path="reports" element={
                    <div className="p-6">
                      <h1 className="text-2xl font-bold text-gray-900">Báo cáo</h1>
                      <p className="mt-2 text-gray-600">Các báo cáo thống kê sẽ được phát triển ở đây</p>
                    </div>
                  } />
                  <Route path="settings" element={
                    <div className="p-6">
                      <h1 className="text-2xl font-bold text-gray-900">Cài đặt hệ thống</h1>
                      <p className="mt-2 text-gray-600">Cài đặt hệ thống sẽ được phát triển ở đây</p>
                    </div>
                  } />
                </Routes>
              </ProtectedRoute>
            } />
            
            {/* Teacher routes */}
            <Route path="teacher/*" element={
              <ProtectedRoute requiredRole="teacher">
                <div className="p-6">
                  <h1 className="text-2xl font-bold text-gray-900">Trang giáo viên</h1>
                  <p className="mt-2 text-gray-600">Các tính năng dành cho giáo viên sẽ được phát triển ở đây</p>
                </div>
              </ProtectedRoute>
            } />
            
            {/* Student routes */}
            <Route path="student/*" element={
              <ProtectedRoute requiredRole="student">
                <div className="p-6">
                  <h1 className="text-2xl font-bold text-gray-900">Trang học sinh</h1>
                  <p className="mt-2 text-gray-600">Các tính năng dành cho học sinh sẽ được phát triển ở đây</p>
                </div>
              </ProtectedRoute>
            } />
          </Route>
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
