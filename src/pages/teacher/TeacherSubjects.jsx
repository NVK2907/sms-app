import React, { useState, useEffect, useCallback } from 'react';
import {
  BookOpenIcon,
  AcademicCapIcon,
  UserGroupIcon,
  ClockIcon,
  ChartBarIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { teacherFeaturesService } from '../../services/teacherFeaturesService';
import { useAuth } from '../../contexts/AuthContext';
import { showComingSoon } from '../../utils/comingSoon';

const TeacherSubjects = () => {
  const { user } = useAuth();
  const teacherId = user?.teacherId ?? user?.id;
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('all');
  const [semesters, setSemesters] = useState([]);
  
  // Modal states for classes
  const [showClassesModal, setShowClassesModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [classesList, setClassesList] = useState([]);
  const [classesLoading, setClassesLoading] = useState(false);
  
  // Modal states for attendance
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [selectedClassForAttendance, setSelectedClassForAttendance] = useState(null);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceStatuses, setAttendanceStatuses] = useState({});
  const [savingAttendance, setSavingAttendance] = useState(false);
  const [studentsList, setStudentsList] = useState([]);
  
  // Modal states for grades
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [selectedClassForGrade, setSelectedClassForGrade] = useState(null);
  const [gradeLoading, setGradeLoading] = useState(false);
  const [gradesData, setGradesData] = useState({});
  const [savingGrade, setSavingGrade] = useState(false);

  const loadSubjectsData = useCallback(async () => {
    if (!teacherId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const response = await teacherFeaturesService.getTeacherSubjects(teacherId);

      // Handle different possible data structures
      // API returns: { success: true, message: "...", data: [subjects] }
      const subjectsData = response?.data || 
                          response?.data?.subjects || 
                          response?.data?.content || 
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
  }, [teacherId]);

  useEffect(() => {
    loadSubjectsData();
  }, [loadSubjectsData, selectedSemester]);

  const filteredSubjects = subjects.filter(subject => {
    const matchesSearch = subject.subjectName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         subject.subjectCode?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSemester = selectedSemester === 'all' || subject.semesterName === selectedSemester;
    return matchesSearch && matchesSemester;
  });


  // Load classes for a subject
  const handleViewClasses = async (subject) => {
    setClassesLoading(true);
    setShowClassesModal(true);
    setSelectedSubject(subject);
    try {
      // Get classes for this teacher and filter by subject
      const response = await teacherFeaturesService.getTeacherClasses(teacherId);
      const classesData = response?.data?.classes || 
                         response?.data?.content || 
                         response?.data || 
                         response || 
                         [];
      
      // Filter classes by subjectId or subjectName
      const filteredClasses = Array.isArray(classesData) 
        ? classesData.filter(cls => 
            cls.subjectId === subject.subjectId || 
            cls.subjectName === subject.subjectName ||
            cls.subjectCode === subject.subjectCode
          )
        : [];
      
      setClassesList(filteredClasses);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách lớp học:', error);
      setClassesList([]);
    } finally {
      setClassesLoading(false);
    }
  };

  const closeClassesModal = () => {
    setShowClassesModal(false);
    setSelectedSubject(null);
    setClassesList([]);
  };

  // Attendance handlers
  const handleOpenAttendance = async (classId, classCode, subjectName) => {
    setAttendanceLoading(true);
    setShowAttendanceModal(true);
    setSelectedClassForAttendance({ id: classId, classCode, subjectName });
    setAttendanceStatuses({});
    try {
      const response = await teacherFeaturesService.getClassStudents(classId);
      const studentsData = response?.students || response?.data?.students || [];
      setStudentsList(Array.isArray(studentsData) ? studentsData : []);
      
      // Initialize attendance statuses
      const initialStatuses = {};
      studentsData.forEach(student => {
        if (student.studentId) {
          initialStatuses[student.studentId] = 'present';
        }
      });
      setAttendanceStatuses(initialStatuses);
      
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

  // Grade handlers
  const handleOpenGrade = async (classId, classCode, subjectName) => {
    setGradeLoading(true);
    setShowGradeModal(true);
    setSelectedClassForGrade({ id: classId, classCode, subjectName });
    setGradesData({});
    try {
      const studentsResponse = await teacherFeaturesService.getClassStudents(classId);
      const studentsData = studentsResponse?.students || studentsResponse?.data?.students || [];
      setStudentsList(Array.isArray(studentsData) ? studentsData : []);

      const gradesResponse = await teacherFeaturesService.getGradesByClass(classId);
      const gradesList = Array.isArray(gradesResponse) ? gradesResponse : 
                        Array.isArray(gradesResponse?.data) ? gradesResponse.data : [];
      
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
        <h1 className="text-2xl font-bold text-gray-900">Môn học</h1>
        <p className="mt-1 text-sm text-gray-500">
          Danh sách các môn học mà bạn đang dạy
        </p>
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
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                  {subject.credit} tín chỉ
                </span>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <AcademicCapIcon className="h-4 w-4 mr-2" />
                  <span>Lớp học: {subject.classCount || 0}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <UserGroupIcon className="h-4 w-4 mr-2" />
                  <span>Sinh viên: {subject.studentCount || 0}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <ClockIcon className="h-4 w-4 mr-2" />
                  <span>Học kỳ: {subject.semesterName}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <ChartBarIcon className="h-4 w-4 mr-2" />
                  <span>Mô tả: {subject.description || 'Không có'}</span>
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
                  onClick={() => handleViewClasses(subject)}
                  className="flex-1 bg-gray-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
                >
                  Lớp học
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
                : 'Bạn chưa được phân công môn học nào'
              }
            </p>
          </div>
        )}
      </div>

      {/* Classes Modal */}
      {showClassesModal && (
        <div className={`fixed inset-0 bg-gray-800/10 backdrop-blur-[2px] flex items-center justify-center z-50 transition-opacity duration-300 ${showClassesModal ? 'opacity-100' : 'opacity-0'}`}>
          <div className="relative p-6 border w-full max-w-4xl shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Lớp học - {selectedSubject?.subjectName || 'N/A'}
              </h3>
              <button
                onClick={closeClassesModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {classesLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            ) : classesList.length > 0 ? (
              <div className="space-y-4">
                {classesList.map((cls, index) => (
                  <div key={cls.id || index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">{cls.classCode || 'N/A'}</h4>
                        <p className="text-sm text-gray-500">{cls.semesterName || 'N/A'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Sinh viên: {cls.currentStudentCount || 0}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          closeClassesModal();
                          handleOpenAttendance(cls.id, cls.classCode, cls.subjectName);
                        }}
                        className="flex-1 bg-green-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-green-700"
                      >
                        Điểm danh
                      </button>
                      <button
                        onClick={() => {
                          closeClassesModal();
                          handleOpenGrade(cls.id, cls.classCode, cls.subjectName);
                        }}
                        className="flex-1 bg-indigo-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
                      >
                        Chấm điểm
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <AcademicCapIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Không có lớp học</h3>
                <p className="mt-1 text-sm text-gray-500">Môn học này chưa có lớp học nào</p>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 mt-6">
              <button
                type="button"
                onClick={closeClassesModal}
                className="btn-secondary"
              >
                Đóng
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
    </div>
  );
};

export default TeacherSubjects;
