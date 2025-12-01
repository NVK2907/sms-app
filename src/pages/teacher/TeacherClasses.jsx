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
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon
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
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [selectedClassForAttendance, setSelectedClassForAttendance] = useState(null);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceStatuses, setAttendanceStatuses] = useState({});
  const [savingAttendance, setSavingAttendance] = useState(false);
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [selectedClassForGrade, setSelectedClassForGrade] = useState(null);
  const [gradeLoading, setGradeLoading] = useState(false);
  const [gradesData, setGradesData] = useState({});
  const [savingGrade, setSavingGrade] = useState(false);

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

  const handleOpenAttendance = async (classId, classCode, subjectName) => {
    setAttendanceLoading(true);
    setShowAttendanceModal(true);
    setSelectedClassForAttendance({ id: classId, classCode, subjectName });
    setAttendanceStatuses({});
    try {
      const response = await teacherFeaturesService.getClassStudents(classId);
      const studentsData = response?.students || response?.data?.students || [];
      setStudentsList(Array.isArray(studentsData) ? studentsData : []);
      
      // Khởi tạo trạng thái điểm danh mặc định là "present" cho tất cả sinh viên
      const initialStatuses = {};
      studentsData.forEach(student => {
        if (student.studentId) {
          initialStatuses[student.studentId] = 'present';
        }
      });
      setAttendanceStatuses(initialStatuses);
      
      // Cập nhật thông tin lớp học từ response nếu có
      if (response && (response.classCode || response.subjectName)) {
        setSelectedClassForAttendance({
          id: classId,
          classCode: response.classCode || classCode,
          subjectName: response.subjectName || subjectName,
          semesterName: response.semesterName,
          currentStudentCount: response.currentStudentCount
        });
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách sinh viên cho điểm danh:', error);
      setStudentsList([]);
    } finally {
      setAttendanceLoading(false);
    }
  };

  const closeAttendanceModal = () => {
    setShowAttendanceModal(false);
    setSelectedClassForAttendance(null);
    setStudentsList([]);
    setAttendanceStatuses({});
    setAttendanceDate(new Date().toISOString().split('T')[0]);
  };

  const handleStatusChange = (studentId, status) => {
    setAttendanceStatuses(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleSaveAttendance = async () => {
    if (!selectedClassForAttendance?.id || !attendanceDate) {
      alert('Vui lòng chọn ngày điểm danh');
      return;
    }

    if (studentsList.length === 0) {
      alert('Không có sinh viên để điểm danh');
      return;
    }

    setSavingAttendance(true);
    try {
      const studentAttendances = studentsList
        .filter(student => student.studentId)
        .map(student => ({
          studentId: student.studentId,
          status: attendanceStatuses[student.studentId] || 'present'
        }));

      const attendanceData = {
        classId: selectedClassForAttendance.id,
        attendanceDate: attendanceDate,
        studentAttendances: studentAttendances
      };

      await teacherFeaturesService.recordAttendance(attendanceData);
      alert('Điểm danh thành công!');
      closeAttendanceModal();
    } catch (error) {
      console.error('Lỗi khi lưu điểm danh:', error);
      alert('Lỗi khi lưu điểm danh: ' + (error.message || 'Vui lòng thử lại sau'));
    } finally {
      setSavingAttendance(false);
    }
  };

  const getAttendanceStatusIcon = (status) => {
    switch (status) {
      case 'present': return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'absent': return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case 'late': return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
      default: return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getAttendanceStatusText = (status) => {
    switch (status) {
      case 'present': return 'Có mặt';
      case 'absent': return 'Vắng mặt';
      case 'late': return 'Đi muộn';
      default: return 'Chưa chọn';
    }
  };

  const handleOpenGrade = async (classId, classCode, subjectName) => {
    setGradeLoading(true);
    setShowGradeModal(true);
    setSelectedClassForGrade({ id: classId, classCode, subjectName });
    setGradesData({});
    try {
      // Lấy danh sách sinh viên
      const studentsResponse = await teacherFeaturesService.getClassStudents(classId);
      const studentsData = studentsResponse?.students || studentsResponse?.data?.students || [];
      setStudentsList(Array.isArray(studentsData) ? studentsData : []);

      // Lấy danh sách điểm hiện có
      const gradesResponse = await teacherFeaturesService.getGradesByClass(classId);
      const gradesList = Array.isArray(gradesResponse) ? gradesResponse : 
                        Array.isArray(gradesResponse?.data) ? gradesResponse.data : [];
      
      // Tạo object gradesData với key là studentId
      const gradesMap = {};
      studentsData.forEach(student => {
        if (student.studentId) {
          const existingGrade = gradesList.find(g => g.studentId === student.studentId);
          gradesMap[student.studentId] = {
            midterm: existingGrade?.midterm || '',
            finalGrade: existingGrade?.finalGrade || '',
            other: existingGrade?.other || ''
          };
        }
      });
      setGradesData(gradesMap);

      // Cập nhật thông tin lớp học từ response nếu có
      if (studentsResponse && (studentsResponse.classCode || studentsResponse.subjectName)) {
        setSelectedClassForGrade({
          id: classId,
          classCode: studentsResponse.classCode || classCode,
          subjectName: studentsResponse.subjectName || subjectName,
          semesterName: studentsResponse.semesterName,
          currentStudentCount: studentsResponse.currentStudentCount
        });
      }
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu chấm điểm:', error);
      setStudentsList([]);
      setGradesData({});
    } finally {
      setGradeLoading(false);
    }
  };

  const closeGradeModal = () => {
    setShowGradeModal(false);
    setSelectedClassForGrade(null);
    setStudentsList([]);
    setGradesData({});
  };

  const handleGradeChange = (studentId, field, value) => {
    setGradesData(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value === '' ? '' : parseFloat(value) || 0
      }
    }));
  };

  const handleSaveGrades = async () => {
    if (!selectedClassForGrade?.id) {
      alert('Không tìm thấy thông tin lớp học');
      return;
    }

    if (studentsList.length === 0) {
      alert('Không có sinh viên để chấm điểm');
      return;
    }

    setSavingGrade(true);
    try {
      const savePromises = studentsList
        .filter(student => student.studentId)
        .map(student => {
          const gradeInfo = gradesData[student.studentId] || {};
          const gradeData = {
            classId: selectedClassForGrade.id,
            studentId: student.studentId,
            midterm: gradeInfo.midterm || null,
            finalGrade: gradeInfo.finalGrade || null,
            other: gradeInfo.other || null
          };
          return teacherFeaturesService.createOrUpdateGrade(gradeData);
        });

      await Promise.all(savePromises);
      alert('Lưu điểm thành công!');
      closeGradeModal();
    } catch (error) {
      console.error('Lỗi khi lưu điểm:', error);
      alert('Lỗi khi lưu điểm: ' + (error.message || 'Vui lòng thử lại sau'));
    } finally {
      setSavingGrade(false);
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
                onClick={() => {
                  if (selectedClass?.id) {
                    closeDetailModal();
                    handleOpenAttendance(selectedClass.id, selectedClass.classCode, selectedClass.subjectName);
                  }
                }}
                className="btn-secondary"
              >
                Điểm danh
              </button>
              <button
                type="button"
                onClick={() => {
                  if (selectedClass?.id) {
                    closeDetailModal();
                    handleOpenGrade(selectedClass.id, selectedClass.classCode, selectedClass.subjectName);
                  }
                }}
                className="btn-primary"
              >
                Chấm điểm
              </button>
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
        <div className={`fixed inset-0 bg-gray-800/10 backdrop-blur-[2px] flex items-center justify-center z-50 transition-opacity duration-300 ${showStudentsModal ? 'opacity-100' : 'opacity-0'}`}>
          <div className="relative p-6 border w-full max-w-4xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Danh sách sinh viên - {selectedClassForStudents?.classCode || 'N/A'}
              </h3>
              <button
                onClick={closeStudentsModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {studentsLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            ) : studentsList.length > 0 ? (
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Mã lớp</label>
                      <p className="mt-1 text-sm text-gray-900 font-mono">{selectedClassForStudents?.classCode || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Môn học</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedClassForStudents?.subjectName || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Tổng số sinh viên</label>
                      <p className="mt-1 text-sm text-gray-900 font-semibold">{studentsList.length} sinh viên</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <UserGroupIcon className="h-5 w-5 mr-2" />
                    Danh sách sinh viên
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-white">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STT</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã SV</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Họ tên</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lớp</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chuyên ngành</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {studentsList.map((student, index) => (
                          <tr key={student.studentId || index} className="hover:bg-gray-50">
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{student.studentCode || 'N/A'}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{student.studentName || 'N/A'}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{student.email || 'N/A'}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{student.className || 'N/A'}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{student.major || 'N/A'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Không có sinh viên</h3>
                <p className="mt-1 text-sm text-gray-500">Lớp học này chưa có sinh viên đăng ký</p>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 mt-6">
              <button
                type="button"
                onClick={() => {
                  if (selectedClassForStudents?.id) {
                    closeStudentsModal();
                    handleOpenAttendance(
                      selectedClassForStudents.id,
                      selectedClassForStudents.classCode,
                      selectedClassForStudents.subjectName
                    );
                  }
                }}
                className="btn-secondary"
              >
                Điểm danh
              </button>
              <button
                type="button"
                onClick={() => {
                  if (selectedClassForStudents?.id) {
                    closeStudentsModal();
                    handleOpenGrade(
                      selectedClassForStudents.id,
                      selectedClassForStudents.classCode,
                      selectedClassForStudents.subjectName
                    );
                  }
                }}
                className="btn-primary"
              >
                Chấm điểm
              </button>
              <button
                type="button"
                onClick={closeStudentsModal}
                className="btn-secondary"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grade Modal */}
      {showGradeModal && (
        <div className={`fixed inset-0 bg-gray-800/10 backdrop-blur-[2px] flex items-center justify-center z-50 transition-opacity duration-300 ${showGradeModal ? 'opacity-100' : 'opacity-0'}`}>
          <div className="relative p-6 border w-full max-w-5xl shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Chấm điểm - {selectedClassForGrade?.classCode || 'N/A'}
              </h3>
              <button
                onClick={closeGradeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {gradeLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Thông tin lớp học */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Mã lớp</label>
                      <p className="mt-1 text-sm text-gray-900 font-mono">{selectedClassForGrade?.classCode || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Môn học</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedClassForGrade?.subjectName || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Danh sách sinh viên và form chấm điểm */}
                {studentsList.length > 0 ? (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                      <UserGroupIcon className="h-5 w-5 mr-2" />
                      Chấm điểm sinh viên ({studentsList.length})
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-white">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STT</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã SV</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Họ tên</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Điểm quá trình</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Điểm thi</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Điểm khác</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {studentsList.map((student, index) => {
                            const studentId = student.studentId;
                            const gradeInfo = gradesData[studentId] || { midterm: '', finalGrade: '', other: '' };
                            return (
                              <tr key={studentId || index} className="hover:bg-gray-50">
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{student.studentCode || 'N/A'}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{student.studentName || 'N/A'}</td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <input
                                    type="number"
                                    min="0"
                                    max="10"
                                    step="0.1"
                                    value={gradeInfo.midterm || ''}
                                    onChange={(e) => handleGradeChange(studentId, 'midterm', e.target.value)}
                                    placeholder="0.0"
                                    className="w-20 px-2 py-1 text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                  />
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <input
                                    type="number"
                                    min="0"
                                    max="10"
                                    step="0.1"
                                    value={gradeInfo.finalGrade || ''}
                                    onChange={(e) => handleGradeChange(studentId, 'finalGrade', e.target.value)}
                                    placeholder="0.0"
                                    className="w-20 px-2 py-1 text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                  />
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <input
                                    type="number"
                                    min="0"
                                    max="10"
                                    step="0.1"
                                    value={gradeInfo.other || ''}
                                    onChange={(e) => handleGradeChange(studentId, 'other', e.target.value)}
                                    placeholder="0.0"
                                    className="w-20 px-2 py-1 text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                  />
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    <div className="mt-4 text-sm text-gray-500">
                      <p>* Điểm quá trình: điểm giữa kỳ (midterm)</p>
                      <p>* Điểm thi: điểm cuối kỳ (finalGrade)</p>
                      <p>* Điểm khác: điểm bổ sung (other)</p>
                      <p>* Điểm tổng kết sẽ được tính tự động bởi hệ thống</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Không có sinh viên</h3>
                    <p className="mt-1 text-sm text-gray-500">Lớp học này chưa có sinh viên đăng ký</p>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 mt-6">
              <button
                type="button"
                onClick={closeGradeModal}
                className="btn-secondary"
                disabled={savingGrade}
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSaveGrades}
                className="btn-primary"
                disabled={savingGrade || studentsList.length === 0}
              >
                {savingGrade ? 'Đang lưu...' : 'Lưu điểm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Attendance Modal */}
      {showAttendanceModal && (
        <div className={`fixed inset-0 bg-gray-800/10 backdrop-blur-[2px] flex items-center justify-center z-50 transition-opacity duration-300 ${showAttendanceModal ? 'opacity-100' : 'opacity-0'}`}>
          <div className="relative p-6 border w-full max-w-4xl shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Điểm danh - {selectedClassForAttendance?.classCode || 'N/A'}
              </h3>
              <button
                onClick={closeAttendanceModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {attendanceLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Thông tin lớp học và ngày điểm danh */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Mã lớp</label>
                      <p className="mt-1 text-sm text-gray-900 font-mono">{selectedClassForAttendance?.classCode || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Môn học</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedClassForAttendance?.subjectName || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-2">Ngày điểm danh</label>
                      <input
                        type="date"
                        value={attendanceDate}
                        onChange={(e) => setAttendanceDate(e.target.value)}
                        className="input-field"
                        max={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>
                </div>

                {/* Danh sách sinh viên điểm danh */}
                {studentsList.length > 0 ? (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                      <UserGroupIcon className="h-5 w-5 mr-2" />
                      Danh sách sinh viên ({studentsList.length})
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-white">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STT</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã SV</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Họ tên</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {studentsList.map((student, index) => {
                            const studentId = student.studentId;
                            const currentStatus = attendanceStatuses[studentId] || 'present';
                            return (
                              <tr key={studentId || index} className="hover:bg-gray-50">
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{student.studentCode || 'N/A'}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{student.studentName || 'N/A'}</td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <div className="flex items-center space-x-2">
                                    <select
                                      value={currentStatus}
                                      onChange={(e) => handleStatusChange(studentId, e.target.value)}
                                      className="text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                    >
                                      <option value="present">Có mặt</option>
                                      <option value="absent">Vắng mặt</option>
                                      <option value="late">Đi muộn</option>
                                    </select>
                                    <div className="flex items-center">
                                      {getAttendanceStatusIcon(currentStatus)}
                                      <span className="ml-1 text-xs text-gray-500">{getAttendanceStatusText(currentStatus)}</span>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Không có sinh viên</h3>
                    <p className="mt-1 text-sm text-gray-500">Lớp học này chưa có sinh viên đăng ký</p>
                  </div>
                )}

                {/* Thống kê nhanh */}
                {studentsList.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-green-600">
                          {Object.values(attendanceStatuses).filter(s => s === 'present').length}
                        </div>
                        <div className="text-sm text-gray-500">Có mặt</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-red-600">
                          {Object.values(attendanceStatuses).filter(s => s === 'absent').length}
                        </div>
                        <div className="text-sm text-gray-500">Vắng mặt</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-yellow-600">
                          {Object.values(attendanceStatuses).filter(s => s === 'late').length}
                        </div>
                        <div className="text-sm text-gray-500">Đi muộn</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 mt-6">
              <button
                type="button"
                onClick={closeAttendanceModal}
                className="btn-secondary"
                disabled={savingAttendance}
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSaveAttendance}
                className="btn-primary"
                disabled={savingAttendance || studentsList.length === 0}
              >
                {savingAttendance ? 'Đang lưu...' : 'Lưu điểm danh'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherClasses;
