import React, { useState, useEffect, useCallback } from 'react';
import {
  AcademicCapIcon,
  BookOpenIcon,
  CalendarIcon,
  UserGroupIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  ChartBarIcon,
  DocumentArrowDownIcon
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
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [showStudentsModal, setShowStudentsModal] = useState(false);
  const [selectedClassForStudents, setSelectedClassForStudents] = useState(null);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [studentsList, setStudentsList] = useState([]);

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

  const handleViewClassDetails = async (classId) => {
    setDetailLoading(true);
    setShowDetailModal(true);
    try {
      const response = await teacherFeaturesService.getClassDetails(classId);
      const classData = response?.data || response || null;
      setSelectedClass(classData);
    } catch (error) {
      console.error('Lỗi khi lấy chi tiết lớp học:', error);
      setSelectedClass(null);
    } finally {
      setDetailLoading(false);
    }
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedClass(null);
  };

  const handleViewStudents = async (classId, classCode, subjectName) => {
    setStudentsLoading(true);
    setShowStudentsModal(true);
    setSelectedClassForStudents({ id: classId, classCode, subjectName });
    try {
      const response = await teacherFeaturesService.getClassStudents(classId);
      // BE trả về TeacherClassResponse object với field students
      const studentsData = response?.students || response?.data?.students || [];
      setStudentsList(Array.isArray(studentsData) ? studentsData : []);
      // Cập nhật thông tin lớp học từ response nếu có
      if (response && (response.classCode || response.subjectName)) {
        setSelectedClassForStudents({
          id: classId,
          classCode: response.classCode || classCode,
          subjectName: response.subjectName || subjectName,
          semesterName: response.semesterName,
          currentStudentCount: response.currentStudentCount
        });
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách sinh viên:', error);
      setStudentsList([]);
    } finally {
      setStudentsLoading(false);
    }
  };

  const closeStudentsModal = () => {
    setShowStudentsModal(false);
    setSelectedClassForStudents(null);
    setStudentsList([]);
  };

  const handleExportStudents = () => {
    if (studentsList.length === 0) {
      alert('Không có dữ liệu để xuất');
      return;
    }

    const formatDate = (date) => {
      if (!date) return 'N/A';
      try {
        return new Date(date).toLocaleDateString('vi-VN');
      } catch {
        return 'N/A';
      }
    };

    // Tạo header CSV
    const headers = [
      'STT',
      'Mã sinh viên',
      'Họ tên',
      'Email',
      'Ngày sinh',
      'Số điện thoại',
      'Địa chỉ',
      'Lớp',
      'Chuyên ngành'
    ];

    // Tạo dữ liệu CSV
    const csvRows = [
      headers.join(','),
      ...studentsList.map((student, index) => {
        const row = [
          index + 1,
          student.studentCode || 'N/A',
          `"${(student.studentName || 'N/A').replace(/"/g, '""')}"`,
          student.email || 'N/A',
          formatDate(student.dob || student.dateOfBirth),
          student.phone || 'N/A',
          `"${(student.address || 'N/A').replace(/"/g, '""')}"`,
          student.className || 'N/A',
          student.major || 'N/A'
        ];
        return row.join(',');
      })
    ];

    // Tạo file CSV
    const csvContent = csvRows.join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    const fileName = `Danh_sach_sinh_vien_${selectedClassForStudents?.classCode || 'class'}_${new Date().toISOString().split('T')[0]}.csv`;
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
        <h1 className="text-2xl font-bold text-gray-900">Lớp học của tôi</h1>
        <p className="mt-1 text-sm text-gray-500">
          Quản lý các lớp học mà bạn đang dạy
        </p>
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
                  onClick={() => handleViewClassDetails(cls.id)}
                  className="flex-1 bg-indigo-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 flex items-center justify-center"
                >
                  <EyeIcon className="h-4 w-4 mr-1" />
                  Chi tiết
                </button>
                <button
                  onClick={() => handleViewStudents(cls.id, cls.classCode, cls.subjectName)}
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

      {/* View Details Modal */}
      {showDetailModal && (
        <div className={`fixed inset-0 bg-gray-800/10 backdrop-blur-[2px] flex items-center justify-center z-50 transition-opacity duration-300 ${showDetailModal ? 'opacity-100' : 'opacity-0'}`}>
          <div className="relative p-6 border w-full max-w-4xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Chi tiết lớp học</h3>
              <button
                onClick={closeDetailModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {detailLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            ) : selectedClass ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Thông tin chính */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                      <AcademicCapIcon className="h-5 w-5 mr-2" />
                      Thông tin lớp học
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Mã lớp học</label>
                        <p className="mt-1 text-sm text-gray-900 font-mono">{selectedClass.classCode || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Môn học</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedClass.subjectName || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Học kỳ</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedClass.semesterName || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Số sinh viên</label>
                        <p className="mt-1 text-sm text-gray-900">
                          {selectedClass.currentStudentCount || 0}/{selectedClass.maxStudent || 0} sinh viên
                        </p>
                      </div>
                    </div>
                  </div>

                  {selectedClass.students && selectedClass.students.length > 0 && (
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                        <UserGroupIcon className="h-5 w-5 mr-2" />
                        Danh sách sinh viên ({selectedClass.students.length})
                      </h4>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-white">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã SV</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Họ tên</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lớp</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {selectedClass.students.map((student) => (
                              <tr key={student.studentId} className="hover:bg-gray-50">
                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{student.studentCode || 'N/A'}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{student.studentName || 'N/A'}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{student.email || 'N/A'}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{student.className || 'N/A'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>

                {/* Avatar và thông tin tóm tắt */}
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-6 text-center">
                    <div className="flex justify-center mb-4">
                      <div className="h-24 w-24 rounded-full bg-indigo-100 flex items-center justify-center">
                        <AcademicCapIcon className="h-12 w-12 text-indigo-600" />
                      </div>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">{selectedClass.classCode || 'N/A'}</h3>
                    <p className="text-sm text-gray-500">{selectedClass.subjectName || 'N/A'}</p>
                    <div className="mt-4">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">Sinh viên:</span>
                        <span className="font-medium text-gray-900">
                          {selectedClass.currentStudentCount || 0}/{selectedClass.maxStudent || 0}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-sm font-medium text-gray-500 mb-3">Thông tin tóm tắt</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Học kỳ:</span>
                        <span className="text-sm font-medium text-gray-900">{selectedClass.semesterName || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Số sinh viên:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {selectedClass.currentStudentCount || 0}/{selectedClass.maxStudent || 0}
                        </span>
                      </div>
                      {selectedClass.createdAt && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Ngày tạo:</span>
                          <span className="text-sm font-medium text-gray-900">
                            {new Date(selectedClass.createdAt).toLocaleDateString('vi-VN')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <AcademicCapIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Không thể tải chi tiết</h3>
                <p className="mt-1 text-sm text-gray-500">Vui lòng thử lại sau</p>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 mt-6">
              <button
                type="button"
                onClick={closeDetailModal}
                className="btn-secondary"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Students Modal */}
      {showStudentsModal && (
        <div 
          className="fixed inset-0 bg-gray-800/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={closeStudentsModal}
        >
          <div 
            className="relative w-full max-w-7xl max-h-[90vh] bg-white rounded-lg shadow-xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
              <div className="flex items-center space-x-3">
                <UserGroupIcon className="h-6 w-6 text-indigo-600" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Danh sách sinh viên
                  </h3>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {selectedClassForStudents?.classCode || 'N/A'} - {selectedClassForStudents?.subjectName || 'N/A'}
                  </p>
                </div>
              </div>
              <button
                onClick={closeStudentsModal}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-200"
                aria-label="Đóng"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden flex flex-col">
              {studentsLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
              ) : studentsList.length > 0 ? (
                <>
                  {/* Summary Info */}
                  <div className="px-6 py-4 bg-indigo-50 border-b border-indigo-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6">
                        <div>
                          <span className="text-sm text-gray-600">Tổng số sinh viên:</span>
                          <span className="ml-2 text-lg font-semibold text-indigo-700">{studentsList.length}</span>
                        </div>
                        {selectedClassForStudents?.semesterName && (
                          <div>
                            <span className="text-sm text-gray-600">Học kỳ:</span>
                            <span className="ml-2 text-sm font-medium text-gray-900">{selectedClassForStudents.semesterName}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Table Container */}
                  <div className="flex-1 overflow-auto px-6 py-4">
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50 sticky top-0 z-10">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-16">STT</th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[100px]">Mã SV</th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[150px]">Họ tên</th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[180px]">Email</th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[100px]">Ngày sinh</th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[120px]">Số điện thoại</th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[200px]">Địa chỉ</th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[100px]">Lớp</th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[120px]">Chuyên ngành</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {studentsList.map((student, index) => {
                              const formatDate = (date) => {
                                if (!date) return 'N/A';
                                try {
                                  return new Date(date).toLocaleDateString('vi-VN');
                                } catch {
                                  return 'N/A';
                                }
                              };
                              return (
                                <tr key={student.studentId || index} className="hover:bg-indigo-50 transition-colors">
                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-600 font-medium">{index + 1}</td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm font-mono font-medium text-gray-900">{student.studentCode || 'N/A'}</td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{student.studentName || 'N/A'}</td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{student.email || 'N/A'}</td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{formatDate(student.dob || student.dateOfBirth)}</td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{student.phone || 'N/A'}</td>
                                  <td className="px-4 py-3 text-sm text-gray-700 max-w-[200px]">
                                    <div className="truncate" title={student.address || 'N/A'}>
                                      {student.address || 'N/A'}
                                    </div>
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{student.className || 'N/A'}</td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{student.major || 'N/A'}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center py-12">
                  <div className="text-center">
                    <UserGroupIcon className="mx-auto h-16 w-16 text-gray-300" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">Không có sinh viên</h3>
                    <p className="mt-2 text-sm text-gray-500">Lớp học này chưa có sinh viên đăng ký</p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={handleExportStudents}
                  disabled={studentsList.length === 0}
                  className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <DocumentArrowDownIcon className="h-5 w-5" />
                  <span>Xuất Excel/CSV</span>
                </button>
                <button
                  type="button"
                  onClick={closeStudentsModal}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md text-sm font-medium hover:bg-gray-700 transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default TeacherClasses;
