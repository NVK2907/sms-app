import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

const DevLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleDevLogin = async (role) => {
    setLoading(true);
    try {
      // Set mock user data directly to localStorage
      const mockUsers = {
        admin: {
          id: 1,
          username: 'admin',
          email: 'admin@sms.com',
          fullName: 'Quản trị viên',
          roles: [
            {
              id: 1,
              roleName: 'ADMIN',
              description: 'Quản trị viên hệ thống'
            }
          ]
        },
        teacher: {
          id: 2,
          username: 'teacher',
          email: 'teacher@sms.com',
          fullName: 'Giáo viên',
          roles: [
            {
              id: 2,
              roleName: 'TEACHER',
              description: 'Giáo viên'
            }
          ]
        },
        student: {
          id: 3,
          username: 'student',
          email: 'student@sms.com',
          fullName: 'Học sinh',
          roles: [
            {
              id: 3,
              roleName: 'STUDENT',
              description: 'Học sinh'
            }
          ]
        }
      };

      const mockUser = mockUsers[role];
      
      // Set user data to localStorage
      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('token', `dev-token-${role}`);
      
      // Reload page to trigger AuthContext update
      window.location.reload();
      
    } catch (error) {
      console.error('Dev login error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Only show in development
  if (import.meta.env.DEV) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <div className="bg-white rounded-lg shadow-lg p-4 border max-w-xs">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Dev Login</h3>
          <div className="space-y-2">
            <button
              onClick={() => handleDevLogin('admin')}
              disabled={loading}
              className="w-full px-3 py-2 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Login as Admin'}
            </button>
            <button
              onClick={() => handleDevLogin('teacher')}
              disabled={loading}
              className="w-full px-3 py-2 text-xs bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Login as Teacher'}
            </button>
            <button
              onClick={() => handleDevLogin('student')}
              disabled={loading}
              className="w-full px-3 py-2 text-xs bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Login as Student'}
            </button>
            <button
              onClick={() => {
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                window.location.reload();
              }}
              className="w-full px-3 py-2 text-xs bg-red-600 text-white rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default DevLogin;
