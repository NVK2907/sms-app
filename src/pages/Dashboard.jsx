import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import {
  AcademicCapIcon,
  UserGroupIcon,
  BookOpenIcon,
  CalendarIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { userService } from '../services/userService';
import { studentService } from '../services/studentService';
import { teacherService } from '../services/teacherService';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load dashboard statistics
  const loadStats = async () => {
    setLoading(true);
    try {
      const role = user?.roles?.[0]?.roleName?.toLowerCase();
      
      if (role === 'admin') {
        // Load admin stats
        const [usersResponse, studentsResponse, teachersResponse] = await Promise.all([
          userService.getAllUsers(0, 1),
          studentService.getAllStudents(0, 1),
          teacherService.getAllTeachers(0, 1)
        ]);

        setStats([
          { 
            name: 'Tổng số người dùng', 
            value: usersResponse.data?.totalElements || '0', 
            icon: UserGroupIcon, 
            color: 'bg-blue-500' 
          },
          { 
            name: 'Tổng số sinh viên', 
            value: studentsResponse.data?.totalElements || '0', 
            icon: UserGroupIcon, 
            color: 'bg-green-500' 
          },
          { 
            name: 'Tổng số giáo viên', 
            value: teachersResponse.data?.totalElements || '0', 
            icon: AcademicCapIcon, 
            color: 'bg-purple-500' 
          },
          { 
            name: 'Hệ thống', 
            value: 'Hoạt động', 
            icon: CalendarIcon, 
            color: 'bg-orange-500' 
          },
        ]);
      } else {
        // Default stats for other roles
        setStats([
          { name: 'Chào mừng', value: user?.fullName || 'User', icon: UserGroupIcon, color: 'bg-blue-500' },
          { name: 'Vai trò', value: user?.roles?.[0]?.roleName || 'User', icon: AcademicCapIcon, color: 'bg-green-500' },
          { name: 'Trạng thái', value: 'Hoạt động', icon: BookOpenIcon, color: 'bg-purple-500' },
          { name: 'Hệ thống', value: 'SMS', icon: CalendarIcon, color: 'bg-orange-500' },
        ]);
      }
    } catch (error) {
      console.error('Lỗi khi tải thống kê:', error);
      setStats([
        { name: 'Lỗi', value: 'Không thể tải dữ liệu', icon: UserGroupIcon, color: 'bg-red-500' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, [user]);

  const getTitle = () => {
    const role = user?.roles?.[0]?.roleName?.toLowerCase();
    switch (role) {
      case 'admin': return 'Bảng điều khiển Quản trị viên';
      case 'teacher': return 'Bảng điều khiển Giáo viên';
      case 'student': return 'Bảng điều khiển Học sinh';
      default: return 'Bảng điều khiển';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{getTitle()}</h1>
        <p className="mt-1 text-sm text-gray-500">
          Chào mừng {user?.fullName || user?.username} đến với hệ thống SMS
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          <div className="col-span-full flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <span className="ml-2 text-gray-500">Đang tải thống kê...</span>
          </div>
        ) : (
          stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.name} className="card">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 p-3 rounded-md ${stat.color}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                    <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Recent Activity - Will be implemented with real data later */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Hoạt động gần đây</h3>
        <div className="text-center py-8">
          <p className="text-gray-500">Tính năng hoạt động gần đây sẽ được phát triển trong phiên bản tiếp theo</p>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
