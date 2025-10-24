import React, { useState, useEffect } from 'react';
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
import { studentFeaturesService } from '../../services/studentFeaturesService';
import { useAuth } from '../../contexts/AuthContext';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalClasses: 0,
    totalSubjects: 0,
    upcomingExams: 0,
    pendingAssignments: 0,
    gpa: 0,
    attendanceRate: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [upcomingSchedule, setUpcomingSchedule] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const studentId = user?.id;
      if (!studentId) return;

      // Load stats
      const [classesRes, gradesRes, scheduleRes, assignmentsRes] = await Promise.all([
        studentFeaturesService.getRegisteredClasses(studentId),
        studentFeaturesService.getStudentGPA(studentId),
        studentFeaturesService.getWeeklySchedule(studentId),
        studentFeaturesService.getStudentAssignments(studentId)
      ]);

      // Handle different possible data structures
      const classesData = classesRes?.data?.classes || classesRes?.data?.content || classesRes?.data || classesRes || [];
      const scheduleData = scheduleRes?.data?.schedule || scheduleRes?.data?.content || scheduleRes?.data || scheduleRes || [];
      const assignmentsData = assignmentsRes?.data?.assignments || assignmentsRes?.data?.content || assignmentsRes?.data || assignmentsRes || [];

      // Process stats
      setStats({
        totalClasses: Array.isArray(classesData) ? classesData.length : 0,
        totalSubjects: Array.isArray(classesData) ? new Set(classesData.map(c => c.subjectName)).size : 0,
        upcomingExams: Array.isArray(scheduleData) ? scheduleData.filter(s => s.type === 'exam').length : 0,
        pendingAssignments: Array.isArray(assignmentsData) ? assignmentsData.filter(a => !a.submitted).length : 0,
        gpa: gradesRes?.data?.gpa || gradesRes?.gpa || 0,
        attendanceRate: 0
      });

      // Process recent activities
      const activities = [];
      if (Array.isArray(classesData) && classesData.length > 0) {
        activities.push(...classesData.slice(0, 3).map(cls => ({
          type: 'class',
          title: `Đăng ký lớp ${cls.className || cls.name}`,
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
  };

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
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Học sinh</h1>
        <p className="mt-1 text-sm text-gray-500">
          Chào mừng {user?.fullName || 'Học sinh'}! Đây là tổng quan về tình hình học tập của bạn.
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
                <ChartBarIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">GPA</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.gpa.toFixed(2)}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CalendarIcon className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Kỳ thi sắp tới</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.upcomingExams}</dd>
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
                  <dt className="text-sm font-medium text-gray-500 truncate">Bài tập chưa nộp</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.pendingAssignments}</dd>
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
              Lịch học sắp tới
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
              <p className="text-sm text-gray-500">Không có lịch học sắp tới</p>
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
              href="/student/classes"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <AcademicCapIcon className="h-4 w-4 mr-2" />
              Lớp học
            </a>
            <a
              href="/student/schedule"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
            >
              <CalendarIcon className="h-4 w-4 mr-2" />
              Lịch học
            </a>
            <a
              href="/student/grades"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700"
            >
              <ChartBarIcon className="h-4 w-4 mr-2" />
              Điểm số
            </a>
            <a
              href="/student/attendance"
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

export default StudentDashboard;
