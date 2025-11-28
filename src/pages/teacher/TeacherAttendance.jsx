import React, { useState, useEffect, useCallback } from 'react';
import {
  UserGroupIcon,
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  MagnifyingGlassIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import { teacherFeaturesService } from '../../services/teacherFeaturesService';
import { useAuth } from '../../contexts/AuthContext';
import { showComingSoon } from '../../utils/comingSoon';

const TeacherAttendance = () => {
  const { user } = useAuth();
  const teacherId = user?.teacherId ?? user?.id;
  const [loading, setLoading] = useState(true);
  const [attendance, setAttendance] = useState([]);
  const [stats, setStats] = useState({
    totalClasses: 0,
    totalStudents: 0,
    presentStudents: 0,
    absentStudents: 0,
    lateStudents: 0,
    attendanceRate: 0
  });
  const [selectedClass, setSelectedClass] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [classes, setClasses] = useState([]);

  const loadAttendanceData = useCallback(async () => {
    if (!teacherId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      // Set empty data - attendance API not implemented yet
      setAttendance([]);
      setStats({
        totalClasses: 0,
        totalStudents: 0,
        presentStudents: 0,
        absentStudents: 0,
        lateStudents: 0,
        attendanceRate: 0
      });
      setClasses([]);

    } catch (error) {
      console.error('Lỗi khi tải dữ liệu điểm danh:', error);
    } finally {
      setLoading(false);
    }
  }, [teacherId]);

  useEffect(() => {
    loadAttendanceData();
  }, [loadAttendanceData, selectedClass]);

  const filteredAttendance = attendance.filter(item =>
    item.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.className?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present': return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'absent': return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case 'late': return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
      default: return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'present': return 'Có mặt';
      case 'absent': return 'Vắng mặt';
      case 'late': return 'Đi muộn';
      default: return 'Không xác định';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800';
      case 'absent': return 'bg-red-100 text-red-800';
      case 'late': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
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
        <h1 className="text-2xl font-bold text-gray-900">Điểm danh</h1>
        <p className="mt-1 text-sm text-gray-500">
          Quản lý điểm danh sinh viên trong các lớp học
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
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
                <UserGroupIcon className="h-6 w-6 text-blue-600" />
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
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Có mặt</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.presentStudents}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <XCircleIcon className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Vắng mặt</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.absentStudents}</dd>
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
                  <dt className="text-sm font-medium text-gray-500 truncate">Tỷ lệ tham gia</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.attendanceRate}%</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Rate Progress */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Tỷ lệ tham gia</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
              <span>Tỷ lệ điểm danh tổng thể</span>
              <span>{stats.attendanceRate}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className={`h-3 rounded-full ${
                  stats.attendanceRate >= 80 ? 'bg-green-600' : 
                  stats.attendanceRate >= 60 ? 'bg-yellow-600' : 'bg-red-600'
                }`}
                style={{ width: `${stats.attendanceRate}%` }}
              ></div>
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">{stats.presentStudents}</div>
              <div className="text-sm text-gray-500">Có mặt</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">{stats.absentStudents}</div>
              <div className="text-sm text-gray-500">Vắng mặt</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">{stats.lateStudents}</div>
              <div className="text-sm text-gray-500">Đi muộn</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{stats.totalStudents}</div>
              <div className="text-sm text-gray-500">Tổng sinh viên</div>
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
              placeholder="Tìm kiếm sinh viên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
        </div>
        <div className="sm:w-48">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="input-field"
          >
            <option value="all">Tất cả lớp</option>
            {classes.map((className, index) => (
              <option key={index} value={className}>{className}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sinh viên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lớp học
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thời gian
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAttendance.length > 0 ? (
                filteredAttendance.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <UserGroupIcon className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{item.studentName}</div>
                          <div className="text-sm text-gray-500">{item.studentCode}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.className}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(item.date).toLocaleDateString('vi-VN')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.time}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(item.status)}
                        <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                          {getStatusText(item.status)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button onClick={showComingSoon} className="text-indigo-600 hover:text-indigo-900">
                        Cập nhật
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    {attendance.length === 0 ? 'Không có dữ liệu điểm danh' : 'Không tìm thấy sinh viên nào phù hợp'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TeacherAttendance;
