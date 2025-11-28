import React, { useState, useEffect, useCallback } from 'react';
import {
  AcademicCapIcon,
  BookOpenIcon,
  CalendarIcon,
  UserGroupIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { teacherFeaturesService } from '../../services/teacherFeaturesService';
import { useAuth } from '../../contexts/AuthContext';
import { showComingSoon } from '../../utils/comingSoon';

const TeacherClasses = () => {
  const { user } = useAuth();
  const teacherId = user?.teacherId ?? user?.id;
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('all');
  const [semesters, setSemesters] = useState([]);

  const loadClassesData = useCallback(async () => {
    if (!teacherId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const response = await teacherFeaturesService.getTeacherClasses(teacherId);

      // Handle different possible data structures
      const classesData = response?.data?.classes || 
                         response?.data?.content || 
                         response?.data || 
                         response || 
                         [];

      setClasses(Array.isArray(classesData) ? classesData : []);

      // Extract unique semesters for filter
      const uniqueSemesters = Array.isArray(classesData) 
        ? [...new Set(classesData.map(cls => cls.semesterName || cls.semester).filter(Boolean))]
        : [];
      setSemesters(uniqueSemesters);

    } catch (error) {
      console.error('Lỗi khi tải dữ liệu lớp học:', error);
      setClasses([]);
    } finally {
      setLoading(false);
    }
  }, [teacherId]);

  useEffect(() => {
    loadClassesData();
  }, [loadClassesData, selectedSemester]);

  const filteredClasses = classes.filter(cls => {
    const matchesSearch = cls.className?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cls.subjectName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSemester = selectedSemester === 'all' || cls.semesterName === selectedSemester;
    return matchesSearch && matchesSemester;
  });

  const getClassStats = () => {
    const totalClasses = filteredClasses.length;
    const totalStudents = filteredClasses.reduce((sum, cls) => sum + (cls.studentCount || 0), 0);
    const activeClasses = filteredClasses.filter(cls => cls.status === 'active').length;
    const completedClasses = filteredClasses.filter(cls => cls.status === 'completed').length;
    
    return { totalClasses, totalStudents, activeClasses, completedClasses };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Đang dạy';
      case 'completed': return 'Đã hoàn thành';
      case 'inactive': return 'Tạm dừng';
      default: return 'Không xác định';
    }
  };

  const stats = getClassStats();
  const completionPercent = stats.totalClasses
    ? Math.round((stats.completedClasses / stats.totalClasses) * 100)
    : 0;

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
        <h1 className="text-2xl font-bold text-gray-900">Lớp học của tôi</h1>
        <p className="mt-1 text-sm text-gray-500">
          Quản lý các lớp học mà bạn đang dạy
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AcademicCapIcon className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Tổng lớp học</dt>
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
                <UserGroupIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Tổng sinh viên</dt>
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
                <ClockIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Đang dạy</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.activeClasses}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ChartBarIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Đã hoàn thành</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.completedClasses}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex-1 max-w-lg">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm lớp học..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
        </div>
        <div className="sm:w-48">
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="input-field"
          >
            <option value="all">Tất cả học kỳ</option>
            {semesters.map((semester, index) => (
              <option key={index} value={semester}>{semester}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClasses.length > 0 ? (
          filteredClasses.map((cls, index) => (
            <div key={index} className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <AcademicCapIcon className="h-8 w-8 text-indigo-600" />
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900">{cls.classCode}</h3>
                    <p className="text-sm text-gray-500">{cls.subjectName}</p>
                  </div>
                </div>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(cls.status)}`}>
                  {getStatusText(cls.status)}
                </span>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <BookOpenIcon className="h-4 w-4 mr-2" />
                  <span>Mã lớp: {cls.classCode}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <UserGroupIcon className="h-4 w-4 mr-2" />
                  <span>Sinh viên: {cls.currentStudentCount || 0}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  <span>Học kỳ: {cls.semesterName}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <ClockIcon className="h-4 w-4 mr-2" />
                  <span>Lịch: {cls.schedule}</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={showComingSoon}
                  className="flex-1 bg-indigo-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 flex items-center justify-center"
                >
                  <EyeIcon className="h-4 w-4 mr-1" />
                  Chi tiết
                </button>
                <button
                  onClick={showComingSoon}
                  className="flex-1 bg-gray-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
                >
                  Sinh viên
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <AcademicCapIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Không có lớp học</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || selectedSemester !== 'all' 
                ? 'Không tìm thấy lớp học nào phù hợp' 
                : 'Bạn chưa được phân công lớp học nào'
              }
            </p>
          </div>
        )}
      </div>

      {/* Progress Overview */}
      {filteredClasses.length > 0 && (
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Tổng quan tiến độ</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                <span>Tiến độ hoàn thành</span>
                <span>{completionPercent}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${completionPercent}%` }}
                ></div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">{stats.activeClasses}</div>
                <div className="text-sm text-gray-500">Đang dạy</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{stats.completedClasses}</div>
                <div className="text-sm text-gray-500">Đã hoàn thành</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-indigo-600">{stats.totalStudents}</div>
                <div className="text-sm text-gray-500">Tổng sinh viên</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherClasses;
