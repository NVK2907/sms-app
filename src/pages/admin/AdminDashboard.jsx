import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { userService } from '../../services/userService';
import { studentService } from '../../services/studentService';
import { teacherService } from '../../services/teacherService';
import { classService } from '../../services/classService';
import { semesterService } from '../../services/semesterService';
import { subjectService } from '../../services/subjectService';
import {
  UserGroupIcon,
  AcademicCapIcon,
  BookOpenIcon,
  CalendarIcon,
  ChartBarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);

  const loadStats = async () => {
    setLoading(true);
    try {
      const [usersResponse, studentsResponse, teachersResponse, classesResponse, semestersResponse, subjectsResponse] = await Promise.all([
        userService.getAllUsers(0, 1),
        studentService.getAllStudents(0, 1),
        teacherService.getAllTeachers(0, 1),
        classService.getAllClasses(0, 1),
        semesterService.getAllSemesters(0, 1),
        subjectService.getAllSubjects(0, 1)
      ]);

      setStats([
        { 
          name: 'Tổng số người dùng', 
          value: usersResponse.data?.totalElements || '0', 
          icon: UserGroupIcon, 
          color: 'bg-blue-500',
          change: '+12%',
          changeType: 'positive'
        },
        { 
          name: 'Tổng số sinh viên', 
          value: studentsResponse.data?.totalElements || '0', 
          icon: UserGroupIcon, 
          color: 'bg-green-500',
          change: '+8%',
          changeType: 'positive'
        },
        { 
          name: 'Tổng số giáo viên', 
          value: teachersResponse.data?.totalElements || '0', 
          icon: AcademicCapIcon, 
          color: 'bg-purple-500',
          change: '+5%',
          changeType: 'positive'
        },
        { 
          name: 'Tổng số lớp học', 
          value: classesResponse.data?.totalElements || '0', 
          icon: BookOpenIcon, 
          color: 'bg-orange-500',
          change: '+15%',
          changeType: 'positive'
        },
        { 
          name: 'Tổng số học kỳ', 
          value: semestersResponse.data?.totalElements || '0', 
          icon: CalendarIcon, 
          color: 'bg-indigo-500',
          change: '+3%',
          changeType: 'positive'
        },
        { 
          name: 'Tổng số môn học', 
          value: subjectsResponse.data?.totalElements || '0', 
          icon: BookOpenIcon, 
          color: 'bg-pink-500',
          change: '+7%',
          changeType: 'positive'
        }
      ]);

      // Recent activity will be implemented with real data later
      setRecentActivity([]);
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
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Quản trị</h1>
        <p className="mt-1 text-sm text-gray-500">
          Tổng quan hệ thống quản lý trường học
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="card animate-pulse">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 bg-gray-300 rounded"></div>
                </div>
                <div className="ml-4 flex-1">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))
        ) : (
          stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="card">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`h-8 w-8 rounded-md flex items-center justify-center ${stat.color}`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                    <div className="flex items-baseline">
                      <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                      {stat.change && (
                        <span className={`ml-2 text-sm font-medium ${
                          stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {stat.change}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Hoạt động gần đây</h3>
          <div className="space-y-4">
            {recentActivity.map((activity) => {
              const Icon = activity.icon;
              return (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`flex-shrink-0 ${activity.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Hệ thống</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Trạng thái hệ thống</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Hoạt động
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Phiên bản</span>
              <span className="text-sm text-gray-900">v1.0.0</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Thời gian hoạt động</span>
              <span className="text-sm text-gray-900">24/7</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Cập nhật cuối</span>
              <span className="text-sm text-gray-900">Hôm nay</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Thao tác nhanh</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <UserGroupIcon className="h-6 w-6 text-blue-500 mr-3" />
            <div className="text-left">
              <p className="text-sm font-medium text-gray-900">Thêm người dùng</p>
              <p className="text-xs text-gray-500">Tạo tài khoản mới</p>
            </div>
          </button>
          
          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <AcademicCapIcon className="h-6 w-6 text-green-500 mr-3" />
            <div className="text-left">
              <p className="text-sm font-medium text-gray-900">Thêm sinh viên</p>
              <p className="text-xs text-gray-500">Đăng ký sinh viên mới</p>
            </div>
          </button>
          
          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <BookOpenIcon className="h-6 w-6 text-purple-500 mr-3" />
            <div className="text-left">
              <p className="text-sm font-medium text-gray-900">Tạo lớp học</p>
              <p className="text-xs text-gray-500">Thêm lớp học mới</p>
            </div>
          </button>
          
          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <CalendarIcon className="h-6 w-6 text-orange-500 mr-3" />
            <div className="text-left">
              <p className="text-sm font-medium text-gray-900">Quản lý học kỳ</p>
              <p className="text-xs text-gray-500">Cài đặt học kỳ</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
