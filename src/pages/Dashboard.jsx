import React from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import {
  AcademicCapIcon,
  UserGroupIcon,
  BookOpenIcon,
  CalendarIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { user } = useAuth();

  const getDashboardContent = () => {
    const role = user?.role?.name?.toLowerCase();
    
    switch (role) {
      case 'admin':
        return {
          title: 'Bảng điều khiển Quản trị viên',
          stats: [
            { name: 'Tổng số học sinh', value: '1,234', icon: UserGroupIcon, color: 'bg-blue-500' },
            { name: 'Tổng số giáo viên', value: '56', icon: AcademicCapIcon, color: 'bg-green-500' },
            { name: 'Lớp học', value: '45', icon: BookOpenIcon, color: 'bg-purple-500' },
            { name: 'Môn học', value: '12', icon: CalendarIcon, color: 'bg-orange-500' },
          ]
        };
      
      case 'teacher':
        return {
          title: 'Bảng điều khiển Giáo viên',
          stats: [
            { name: 'Lớp đang dạy', value: '8', icon: AcademicCapIcon, color: 'bg-blue-500' },
            { name: 'Học sinh', value: '240', icon: UserGroupIcon, color: 'bg-green-500' },
            { name: 'Môn dạy', value: '3', icon: BookOpenIcon, color: 'bg-purple-500' },
            { name: 'Tiết dạy/tuần', value: '24', icon: CalendarIcon, color: 'bg-orange-500' },
          ]
        };
      
      case 'student':
        return {
          title: 'Bảng điều khiển Học sinh',
          stats: [
            { name: 'Lớp học', value: '10A1', icon: AcademicCapIcon, color: 'bg-blue-500' },
            { name: 'Môn học', value: '8', icon: BookOpenIcon, color: 'bg-green-500' },
            { name: 'Điểm TB', value: '8.5', icon: ChartBarIcon, color: 'bg-purple-500' },
            { name: 'Tỷ lệ có mặt', value: '95%', icon: CalendarIcon, color: 'bg-orange-500' },
          ]
        };
      
      default:
        return {
          title: 'Bảng điều khiển',
          stats: []
        };
    }
  };

  const { title, stats } = getDashboardContent();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <p className="mt-1 text-sm text-gray-500">
          Chào mừng {user?.fullName || user?.username} đến với hệ thống SMS
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
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
        })}
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Hoạt động gần đây</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="h-2 w-2 bg-green-400 rounded-full"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900">Đã cập nhật thông tin lớp học</p>
              <p className="text-xs text-gray-500">2 giờ trước</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900">Thêm học sinh mới</p>
              <p className="text-xs text-gray-500">4 giờ trước</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="h-2 w-2 bg-yellow-400 rounded-full"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900">Cập nhật lịch học</p>
              <p className="text-xs text-gray-500">1 ngày trước</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
