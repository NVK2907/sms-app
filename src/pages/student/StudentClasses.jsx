import React, { useState, useEffect } from 'react';
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
  const [loading, setLoading] = useState(true);
  const [registeredClasses, setRegisteredClasses] = useState([]);
  const [availableClasses, setAvailableClasses] = useState([]);
  const [activeTab, setActiveTab] = useState('registered');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadClassesData();
  }, []);

  const loadClassesData = async () => {
    setLoading(true);
    try {
      const studentId = user?.id;
      if (!studentId) return;

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
  };

  const handleRegisterClass = async (classId) => {
    try {
      const registrationData = {
        studentId: user?.id,
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
      await studentFeaturesService.unregisterClass(user?.id, classId);
      loadClassesData(); // Reload data
    } catch (error) {
      console.error('Lỗi khi hủy đăng ký lớp:', error);
    }
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
                      <h3 className="text-lg font-medium text-gray-900">{cls.className}</h3>
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
                    <span>Lịch: {cls.schedule}</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleUnregisterClass(cls.id)}
                    className="flex-1 bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-red-700"
                  >
                    Hủy đăng ký
                  </button>
                  <button className="flex-1 bg-gray-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
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
                      <h3 className="text-lg font-medium text-gray-900">{cls.className}</h3>
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
                    <span>Lịch: {cls.schedule}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <UserGroupIcon className="h-4 w-4 mr-2" />
                    <span>Số chỗ: {cls.currentStudents}/{cls.maxStudents}</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleRegisterClass(cls.id)}
                    className="flex-1 bg-indigo-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
                  >
                    Đăng ký
                  </button>
                  <button className="flex-1 bg-gray-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
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
    </div>
  );
};

export default StudentClasses;
