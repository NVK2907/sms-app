import React, { useState, useEffect } from 'react';
import {
  BookOpenIcon,
  AcademicCapIcon,
  UserIcon,
  ClockIcon,
  ChartBarIcon,
  MagnifyingGlassIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { studentFeaturesService } from '../../services/studentFeaturesService';
import { useAuth } from '../../contexts/AuthContext';

const StudentSubjects = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('all');
  const [semesters, setSemesters] = useState([]);

  useEffect(() => {
    loadSubjectsData();
  }, [selectedSemester]);

  const loadSubjectsData = async () => {
    setLoading(true);
    try {
      const studentId = user?.id;
      if (!studentId) return;

      const response = await studentFeaturesService.getRegisteredClasses(studentId);

      // Handle different possible data structures
      const subjectsData = response?.data?.classes || 
                          response?.data?.content || 
                          response?.data || 
                          response || 
                          [];

      setSubjects(Array.isArray(subjectsData) ? subjectsData : []);

      // Extract unique semesters for filter
      const uniqueSemesters = Array.isArray(subjectsData) 
        ? [...new Set(subjectsData.map(subject => subject.semesterName || subject.semester).filter(Boolean))]
        : [];
      setSemesters(uniqueSemesters);

    } catch (error) {
      console.error('Lỗi khi tải dữ liệu môn học:', error);
      setSubjects([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredSubjects = subjects.filter(subject => {
    const matchesSearch = subject.subjectName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         subject.className?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSemester = selectedSemester === 'all' || subject.semesterName === selectedSemester;
    return matchesSearch && matchesSemester;
  });

  const getSubjectStats = () => {
    const totalSubjects = filteredSubjects.length;
    const completedSubjects = filteredSubjects.filter(subject => subject.status === 'completed').length;
    const inProgressSubjects = filteredSubjects.filter(subject => subject.status === 'in_progress').length;
    const upcomingSubjects = filteredSubjects.filter(subject => subject.status === 'upcoming').length;
    
    return { totalSubjects, completedSubjects, inProgressSubjects, upcomingSubjects };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'upcoming': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Đã hoàn thành';
      case 'in_progress': return 'Đang học';
      case 'upcoming': return 'Sắp bắt đầu';
      default: return 'Không xác định';
    }
  };

  const stats = getSubjectStats();

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
        <h1 className="text-2xl font-bold text-gray-900">Môn học</h1>
        <p className="mt-1 text-sm text-gray-500">
          Danh sách các môn học bạn đã đăng ký
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BookOpenIcon className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Tổng môn học</dt>
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
                <ChartBarIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Đã hoàn thành</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.completedSubjects}</dd>
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
                  <dt className="text-sm font-medium text-gray-500 truncate">Đang học</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.inProgressSubjects}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AcademicCapIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Sắp bắt đầu</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.upcomingSubjects}</dd>
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
              placeholder="Tìm kiếm môn học..."
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

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSubjects.length > 0 ? (
          filteredSubjects.map((subject, index) => (
            <div key={index} className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <BookOpenIcon className="h-8 w-8 text-indigo-600" />
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900">{subject.subjectName}</h3>
                    <p className="text-sm text-gray-500">{subject.subjectCode}</p>
                  </div>
                </div>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(subject.status)}`}>
                  {getStatusText(subject.status)}
                </span>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <AcademicCapIcon className="h-4 w-4 mr-2" />
                  <span>Lớp: {subject.className}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <UserIcon className="h-4 w-4 mr-2" />
                  <span>GV: {subject.teacherName}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <ClockIcon className="h-4 w-4 mr-2" />
                  <span>Học kỳ: {subject.semesterName}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <ChartBarIcon className="h-4 w-4 mr-2" />
                  <span>Tín chỉ: {subject.credits}</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <button className="flex-1 bg-indigo-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 flex items-center justify-center">
                  <EyeIcon className="h-4 w-4 mr-1" />
                  Chi tiết
                </button>
                <button className="flex-1 bg-gray-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
                  Tài liệu
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Không có môn học</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || selectedSemester !== 'all' 
                ? 'Không tìm thấy môn học nào phù hợp' 
                : 'Bạn chưa đăng ký môn học nào'
              }
            </p>
          </div>
        )}
      </div>

      {/* Progress Overview */}
      {filteredSubjects.length > 0 && (
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Tổng quan tiến độ</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                <span>Tiến độ hoàn thành</span>
                <span>{Math.round((stats.completedSubjects / stats.totalSubjects) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${(stats.completedSubjects / stats.totalSubjects) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">{stats.completedSubjects}</div>
                <div className="text-sm text-gray-500">Hoàn thành</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{stats.inProgressSubjects}</div>
                <div className="text-sm text-gray-500">Đang học</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">{stats.upcomingSubjects}</div>
                <div className="text-sm text-gray-500">Sắp bắt đầu</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentSubjects;
