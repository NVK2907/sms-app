import React, { useState, useEffect, useCallback } from 'react';
import {
  AcademicCapIcon,
  BookOpenIcon,
  CalendarIcon,
  UserGroupIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { studentFeaturesService } from '../../services/studentFeaturesService';
import { useAuth } from '../../contexts/AuthContext';

const StudentClasses = () => {
  const { user } = useAuth();
  const studentId = user?.studentId ?? user?.id;
  const [loading, setLoading] = useState(true);
  const [registeredClasses, setRegisteredClasses] = useState([]);
  const [availableClasses, setAvailableClasses] = useState([]);
  const [activeTab, setActiveTab] = useState('registered');
  const [searchTerm, setSearchTerm] = useState('');
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState(null);
  const [detailTargetId, setDetailTargetId] = useState(null);

  const loadClassesData = useCallback(async () => {
    if (!studentId) {
      return;
    }
    setLoading(true);
    try {
      const [registeredRes, availableRes] = await Promise.all([
        studentFeaturesService.getRegisteredClasses(studentId),
        studentFeaturesService.getAvailableClasses(studentId)
      ]);

      // Handle different possible data structures from backend
      const registeredData = registeredRes?.data?.classes || 
                           registeredRes?.data?.content || 
                           registeredRes?.data || 
                           registeredRes || 
                           [];
      
      const availableData = availableRes?.data?.classes || 
                           availableRes?.data?.content || 
                           availableRes?.data || 
                           availableRes || 
                           [];

      setRegisteredClasses(Array.isArray(registeredData) ? registeredData : []);
      setAvailableClasses(Array.isArray(availableData) ? availableData : []);

    } catch (error) {
      console.error('Lỗi khi tải dữ liệu lớp học:', error);
      
      // Set empty arrays on error
      setRegisteredClasses([]);
      setAvailableClasses([]);
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  useEffect(() => {
    loadClassesData();
  }, [loadClassesData]);

  const handleRegisterClass = async (classId) => {
    try {
      if (!studentId) return;
      const registrationData = {
        studentId,
        classId: classId
      };
      await studentFeaturesService.registerClass(registrationData);
      loadClassesData(); // Reload data
    } catch (error) {
      console.error('Lỗi khi đăng ký lớp:', error);
    }
  };

  const handleUnregisterClass = async (classId) => {
    try {
      if (!studentId) return;
      await studentFeaturesService.unregisterClass(studentId, classId);
      loadClassesData(); // Reload data
    } catch (error) {
      console.error('Lỗi khi hủy đăng ký lớp:', error);
    }
  };

  const handleViewClassDetails = async (classId) => {
    if (!studentId) return;
    setDetailTargetId(classId);
    setDetailLoading(true);
    setDetailError(null);
    try {
      const response = await studentFeaturesService.getClassDetails(studentId, classId);
      const detailData = response?.data || response || null;
      setSelectedClass(detailData);
      setDetailModalOpen(true);
    } catch (error) {
      console.error('Lỗi khi lấy chi tiết lớp:', error);
      setDetailError(error?.message || 'Không thể tải chi tiết lớp học');
    } finally {
      setDetailLoading(false);
      setDetailTargetId(null);
    }
  };

  const closeDetailModal = () => {
    setDetailModalOpen(false);
    setSelectedClass(null);
    setDetailError(null);
  };

  const formatSchedule = (schedules = []) => {
    if (!Array.isArray(schedules) || schedules.length === 0) {
      return 'Chưa cập nhật';
    }
    return schedules
      .map((schedule) => {
        const timeRange = schedule.startTime && schedule.endTime
          ? `${schedule.startTime} - ${schedule.endTime}`
          : 'Không xác định';
        return `${schedule.dayOfWeek || 'N/A'} (${timeRange})${schedule.room ? ` - ${schedule.room}` : ''}`;
      })
      .join('; ');
  };

  const filteredRegisteredClasses = registeredClasses.filter(cls =>
    cls.className?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.subjectName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAvailableClasses = availableClasses.filter(cls =>
    cls.className?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.subjectName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          Quản lý các lớp học đã đăng ký và tìm kiếm lớp học mới
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('registered')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'registered'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <AcademicCapIcon className="h-5 w-5 inline mr-2" />
            Lớp đã đăng ký ({registeredClasses.length})
          </button>
          <button
            onClick={() => setActiveTab('available')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'available'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <PlusIcon className="h-5 w-5 inline mr-2" />
            Lớp có thể đăng ký ({availableClasses.length})
          </button>
        </nav>
      </div>

      {/* Search */}
      <div className="flex justify-between items-center">
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
      </div>

      {detailError && (
        <p className="text-sm text-red-600">{detailError}</p>
      )}

      {/* Content */}
      {activeTab === 'registered' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRegisteredClasses.length > 0 ? (
            filteredRegisteredClasses.map((cls) => (
              <div key={cls.id} className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <AcademicCapIcon className="h-8 w-8 text-indigo-600" />
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-gray-900">{cls.classCode}</h3>
                      <p className="text-sm text-gray-500">{cls.subjectName}</p>
                    </div>
                  </div>
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    Đã đăng ký
                  </span>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <BookOpenIcon className="h-4 w-4 mr-2" />
                    <span>Mã lớp: {cls.classCode}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <UserGroupIcon className="h-4 w-4 mr-2" />
                    <span>Giáo viên: {cls.teacherName}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    <span>Học kỳ: {cls.semesterName}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <ClockIcon className="h-4 w-4 mr-2" />
                    <span>Lịch: {formatSchedule(cls.schedules)}</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleUnregisterClass(cls.id)}
                    className="flex-1 bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-red-700"
                  >
                    Hủy đăng ký
                  </button>
                  <button
                    onClick={() => handleViewClassDetails(cls.id)}
                    disabled={detailLoading && detailTargetId === cls.id}
                    className={`flex-1 px-3 py-2 rounded-md text-sm font-medium text-white ${
                      detailLoading && detailTargetId === cls.id
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gray-600 hover:bg-gray-700'
                    }`}
                  >
                    Chi tiết
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <AcademicCapIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Không có lớp học</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? 'Không tìm thấy lớp học phù hợp' : 'Bạn chưa đăng ký lớp học nào'}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAvailableClasses.length > 0 ? (
            filteredAvailableClasses.map((cls) => (
              <div key={cls.id} className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <AcademicCapIcon className="h-8 w-8 text-blue-600" />
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-gray-900">{cls.classCode}</h3>
                      <p className="text-sm text-gray-500">{cls.subjectName}</p>
                    </div>
                  </div>
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    Có thể đăng ký
                  </span>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <BookOpenIcon className="h-4 w-4 mr-2" />
                    <span>Mã lớp: {cls.classCode}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <UserGroupIcon className="h-4 w-4 mr-2" />
                    <span>Giáo viên: {cls.teacherName}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    <span>Học kỳ: {cls.semesterName}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <ClockIcon className="h-4 w-4 mr-2" />
                    <span>Lịch: {formatSchedule(cls.schedules)}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <UserGroupIcon className="h-4 w-4 mr-2" />
                    <span>Số chỗ: {cls.currentStudentCount || 0}/{cls.maxStudent || 0}</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleRegisterClass(cls.id)}
                    className="flex-1 bg-indigo-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
                  >
                    Đăng ký
                  </button>
                  <button
                    onClick={() => handleViewClassDetails(cls.id)}
                    disabled={detailLoading && detailTargetId === cls.id}
                    className={`flex-1 px-3 py-2 rounded-md text-sm font-medium text-white ${
                      detailLoading && detailTargetId === cls.id
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gray-600 hover:bg-gray-700'
                    }`}
                  >
                    Chi tiết
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <AcademicCapIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Không có lớp học</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? 'Không tìm thấy lớp học phù hợp' : 'Không có lớp học nào có thể đăng ký'}
              </p>
            </div>
          )}
        </div>
      )}

      {detailModalOpen && selectedClass && (
        <div className="fixed inset-0 bg-gray-800/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <AcademicCapIcon className="h-5 w-5 text-indigo-600 mr-2" />
                Chi tiết lớp {selectedClass.classCode}
              </h3>
              <button
                onClick={closeDetailModal}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Đóng"
              >
                ×
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs uppercase text-gray-500">Môn học</p>
                  <p className="text-sm font-medium text-gray-900">{selectedClass.subjectName}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-500">Học kỳ</p>
                  <p className="text-sm font-medium text-gray-900">{selectedClass.semesterName}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-500">Giáo viên</p>
                  <p className="text-sm font-medium text-gray-900">{selectedClass.teacherName || 'Đang cập nhật'}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-500">Số lượng</p>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedClass.currentStudentCount || 0}/{selectedClass.maxStudent || 0}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm font-semibold text-gray-900 mb-2">Lịch học</p>
                {selectedClass.schedules && selectedClass.schedules.length > 0 ? (
                  <ul className="space-y-2">
                    {selectedClass.schedules.map((schedule, index) => (
                      <li key={`${schedule.dayOfWeek}-${index}`} className="flex items-center text-sm text-gray-600">
                        <ClockIcon className="h-4 w-4 mr-2 text-gray-500" />
                        <span>
                          {schedule.dayOfWeek || 'N/A'} · {schedule.startTime || '??'} - {schedule.endTime || '??'}
                          {schedule.room ? ` (${schedule.room})` : ''}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">Chưa cập nhật lịch học</p>
                )}
              </div>

              <div
                className={`rounded-md p-4 ${
                  selectedClass.isRegistered ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'
                }`}
              >
                {selectedClass.isRegistered
                  ? 'Bạn đã đăng ký lớp học này. Nếu muốn hủy, vui lòng sử dụng nút "Hủy đăng ký" trong danh sách lớp.'
                  : 'Bạn chưa đăng ký lớp học này. Dùng nút "Đăng ký" để tham gia lớp.'}
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button onClick={closeDetailModal} className="btn-secondary">
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {detailLoading && detailTargetId && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-25">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white"></div>
        </div>
      )}
    </div>
  );
};

export default StudentClasses;
