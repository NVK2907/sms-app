import React, { useState, useEffect, useCallback } from 'react';
import {
  AcademicCapIcon,
  BookOpenIcon,
  CalendarIcon,
  ChartBarIcon,
  ClockIcon,
  UserGroupIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { teacherFeaturesService } from '../../services/teacherFeaturesService';
import { useAuth } from '../../contexts/AuthContext';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const teacherId = user?.teacherId ?? user?.id;
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalClasses: 0,
    totalSubjects: 0,
    totalStudents: 0,
    upcomingClasses: 0,
    pendingGrades: 0,
    attendanceRate: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [upcomingSchedule, setUpcomingSchedule] = useState([]);

  const loadDashboardData = useCallback(async () => {
    if (!teacherId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      // Load stats
      const [classesRes, scheduleRes, gradesRes] = await Promise.all([
        teacherFeaturesService.getTeacherClasses(teacherId),
        teacherFeaturesService.getTeacherSchedule(teacherId),
        teacherFeaturesService.getTeacherGrades(teacherId)
      ]);

      // Handle different possible data structures
      const classesData = classesRes?.data?.classes || classesRes?.data?.content || classesRes?.data || classesRes || [];
      const scheduleData = scheduleRes?.data?.schedule || scheduleRes?.data?.content || scheduleRes?.data || scheduleRes || [];
      const gradesData = gradesRes?.data?.grades || gradesRes?.data?.content || gradesRes?.data || gradesRes || [];

      // Process stats
      setStats({
        totalClasses: Array.isArray(classesData) ? classesData.length : 0,
        totalSubjects: Array.isArray(classesData) ? new Set(classesData.map(c => c.subjectName)).size : 0,
        totalStudents: Array.isArray(classesData) ? classesData.reduce((sum, c) => sum + (c.studentCount || 0), 0) : 0,
        upcomingClasses: Array.isArray(scheduleData) ? scheduleData.filter(s => new Date(s.date) >= new Date()).length : 0,
        pendingGrades: Array.isArray(gradesData) ? gradesData.filter(g => !g.graded).length : 0,
        attendanceRate: 0 // TODO: Implement real attendance rate API
      });

      // Process recent activities
      const activities = [];
      if (Array.isArray(classesData) && classesData.length > 0) {
        activities.push(...classesData.slice(0, 3).map(cls => ({
          type: 'class',
          title: `Lớp ${cls.className}`,
          time: new Date().toLocaleDateString('vi-VN'),
          icon: AcademicCapIcon
        })));
      }
      setRecentActivities(activities);

      // Process upcoming schedule
      if (Array.isArray(scheduleData) && scheduleData.length > 0) {
        setUpcomingSchedule(scheduleData.slice(0, 5));
      }

    } catch (error) {
      console.error('Lỗi khi tải dữ liệu dashboard:', error);
    } finally {
      setLoading(false);
    }
  }, [teacherId]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Giáo viên</h1>
        <p className="mt-1 text-sm text-gray-500">
          Chào mừng {user?.fullName || 'Giáo viên'}! Đây là tổng quan về công việc giảng dạy của bạn.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AcademicCapIcon className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Lớp học</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.totalClasses}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BookOpenIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Môn học</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.totalSubjects}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserGroupIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Sinh viên</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.totalStudents}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CalendarIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Lớp sắp tới</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.upcomingClasses}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DocumentTextIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Chưa chấm điểm</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.pendingGrades}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ChartBarIcon className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Tỷ lệ điểm danh</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.attendanceRate}%</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Schedule */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Lịch dạy sắp tới
            </h3>
            {upcomingSchedule.length > 0 ? (
              <div className="space-y-3">
                {upcomingSchedule.map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <ClockIcon className="h-5 w-5 text-gray-400" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{item.subject}</p>
                      <p className="text-sm text-gray-500">{item.time} - {item.room}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Không có lịch dạy sắp tới</p>
            )}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Hoạt động gần đây
            </h3>
            {recentActivities.length > 0 ? (
              <div className="space-y-3">
                {recentActivities.map((activity, index) => {
                  const Icon = activity.icon;
                  return (
                    <div key={index} className="flex items-center space-x-3">
                      <Icon className="h-5 w-5 text-gray-400" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                        <p className="text-sm text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Không có hoạt động gần đây</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Thao tác nhanh
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <a
              href="/teacher/classes"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <AcademicCapIcon className="h-4 w-4 mr-2" />
              Lớp học
            </a>
            <a
              href="/teacher/schedule"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
            >
              <CalendarIcon className="h-4 w-4 mr-2" />
              Lịch dạy
            </a>
            <a
              href="/teacher/grades"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700"
            >
              <ChartBarIcon className="h-4 w-4 mr-2" />
              Chấm điểm
            </a>
            <a
              href="/teacher/attendance"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
            >
              <UserGroupIcon className="h-4 w-4 mr-2" />
              Điểm danh
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
