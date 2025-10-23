import React, { useState, useEffect } from 'react';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  CalendarIcon,
  AcademicCapIcon,
  LockClosedIcon,
  LockOpenIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { semesterService } from '../../services/semesterService';

const SemesterManagement = () => {
  const [activeTab, setActiveTab] = useState('semesters');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddSemesterModal, setShowAddSemesterModal] = useState(false);
  const [showAddAcademicYearModal, setShowAddAcademicYearModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [semesters, setSemesters] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load data from API
  const loadSemesters = async () => {
    setLoading(true);
    try {
      const response = await semesterService.getAllSemesters();
      console.log('Semester API Response:', response); // Debug log
      if (response.success) {
        setSemesters(response.data.semesters || []);
      } else {
        console.error('Semester API returned success: false', response.message);
      }
    } catch (error) {
      console.error('Lỗi khi tải danh sách học kỳ:', error);
      setSemesters([]);
    } finally {
      setLoading(false);
    }
  };

  const loadAcademicYears = async () => {
    setLoading(true);
    try {
      const response = await semesterService.getAllAcademicYears();
      console.log('Academic Year API Response:', response); // Debug log
      if (response.success) {
        setAcademicYears(response.data.academicYears || []);
      } else {
        console.error('Academic Year API returned success: false', response.message);
      }
    } catch (error) {
      console.error('Lỗi khi tải danh sách năm học:', error);
      setAcademicYears([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'semesters') {
      loadSemesters();
    } else {
      loadAcademicYears();
    }
  }, [activeTab]);

  const filteredSemesters = semesters.filter(semester =>
    semester.semesterName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    semester.academicYear?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAcademicYears = academicYears.filter(year =>
    year.academicYear?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditItem = (item) => {
    setSelectedItem(item);
    setShowEditModal(true);
  };

  const handleDeleteItem = (item) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa ${activeTab === 'semesters' ? 'học kỳ' : 'năm học'} này?`)) {
      console.log('Delete item:', item.id);
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'Đang hoạt động';
      case 'inactive':
        return 'Không hoạt động';
      case 'upcoming':
        return 'Sắp tới';
      default:
        return 'Không xác định';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý học kỳ & năm học</h1>
          <p className="mt-1 text-sm text-gray-500">
            Quản lý thông tin học kỳ và năm học trong hệ thống
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('semesters')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'semesters'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <CalendarIcon className="h-5 w-5 inline mr-2" />
            Học kỳ
          </button>
          <button
            onClick={() => setActiveTab('academic-years')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'academic-years'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <AcademicCapIcon className="h-5 w-5 inline mr-2" />
            Năm học
          </button>
        </nav>
      </div>

      {/* Search and Add Button */}
      <div className="flex justify-between items-center">
        <div className="flex-1 max-w-lg">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder={`Tìm kiếm ${activeTab === 'semesters' ? 'học kỳ' : 'năm học'}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
        </div>
        <button
          onClick={() => activeTab === 'semesters' ? setShowAddSemesterModal(true) : setShowAddAcademicYearModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Thêm {activeTab === 'semesters' ? 'học kỳ' : 'năm học'}</span>
        </button>
      </div>

      {/* Content */}
      {activeTab === 'semesters' ? (
        <div className="card">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Học kỳ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Năm học
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thời gian
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center">
                      <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                        <span className="ml-2 text-gray-500">Đang tải...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredSemesters.length > 0 ? (
                  filteredSemesters.map((semester) => (
                    <tr key={semester.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {semester.semesterName || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {semester.semesterCode || 'N/A'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {semester.academicYear || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {semester.startDate ? new Date(semester.startDate).toLocaleDateString('vi-VN') : 'N/A'} - {semester.endDate ? new Date(semester.endDate).toLocaleDateString('vi-VN') : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(semester.status)}`}>
                          {getStatusText(semester.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleEditItem(semester)}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Xem chi tiết"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleEditItem(semester)}
                            className="text-yellow-600 hover:text-yellow-900"
                            title="Chỉnh sửa"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(semester)}
                            className="text-red-600 hover:text-red-900"
                            title="Xóa"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                      {semesters.length === 0 ? 'Không có dữ liệu học kỳ' : 'Không tìm thấy học kỳ nào phù hợp với bộ lọc'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Năm học
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thời gian
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center">
                      <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                        <span className="ml-2 text-gray-500">Đang tải...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredAcademicYears.length > 0 ? (
                  filteredAcademicYears.map((year) => (
                    <tr key={year.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {year.academicYear || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {year.description || 'N/A'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {year.startDate ? new Date(year.startDate).toLocaleDateString('vi-VN') : 'N/A'} - {year.endDate ? new Date(year.endDate).toLocaleDateString('vi-VN') : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(year.status)}`}>
                          {getStatusText(year.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleEditItem(year)}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Xem chi tiết"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleEditItem(year)}
                            className="text-yellow-600 hover:text-yellow-900"
                            title="Chỉnh sửa"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(year)}
                            className="text-red-600 hover:text-red-900"
                            title="Xóa"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                      {academicYears.length === 0 ? 'Không có dữ liệu năm học' : 'Không tìm thấy năm học nào phù hợp với bộ lọc'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals will be implemented later */}
    </div>
  );
};

export default SemesterManagement;