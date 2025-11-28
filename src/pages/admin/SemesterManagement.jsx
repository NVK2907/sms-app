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
import Pagination from '../../components/Pagination';

const SemesterManagement = () => {
  const [activeTab, setActiveTab] = useState('semesters');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddSemesterModal, setShowAddSemesterModal] = useState(false);
  const [showAddAcademicYearModal, setShowAddAcademicYearModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [semesters, setSemesters] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0
  });
  const [semesterStatusFilter, setSemesterStatusFilter] = useState('all');
  const [academicYearStatusFilter, setAcademicYearStatusFilter] = useState('all');

  // Load data from API
  const loadSemesters = async (page = 0, size = 10) => {
    setLoading(true);
    try {
      const response = await semesterService.getAllSemesters(page, size);
      console.log('Semester API Response:', response); // Debug log
      console.log('Semester data structure:', response.data); // Debug log
      if (response.success) {
        // Try different possible data structures
        const semestersData = response.data.semesters || response.data.content || response.data || [];
        console.log('Processed semesters data:', semestersData);
        setSemesters(semestersData);
        setPagination({
          page: response.data.currentPage || 0,
          size: response.data.pageSize || 10,
          totalElements: response.data.totalElements || 0,
          totalPages: response.data.totalPages || 0
        });
      } else {
        console.error('Semester API returned success: false', response.message);
        setSemesters([]);
      }
    } catch (error) {
      console.error('Lỗi khi tải danh sách học kỳ:', error);
      setSemesters([]);
    } finally {
      setLoading(false);
    }
  };

  const loadAcademicYears = async (page = 0, size = 10) => {
    setLoading(true);
    try {
      const response = await semesterService.getAllAcademicYears(page, size);
      console.log('Academic Year API Response:', response); // Debug log
      console.log('Academic Year data structure:', response.data); // Debug log
      if (response.success) {
        // Try different possible data structures
        const academicYearsData = response.data.academicYears || response.data.content || response.data || [];
        console.log('Processed academic years data:', academicYearsData);
        setAcademicYears(academicYearsData);
        setPagination({
          page: response.data.currentPage || 0,
          size: response.data.pageSize || 10,
          totalElements: response.data.totalElements || 0,
          totalPages: response.data.totalPages || 0
        });
      } else {
        console.error('Academic Year API returned success: false', response.message);
        setAcademicYears([]);
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

  const getSemesterStatusValue = (semester) => (semester.isOpen ? 'open' : 'closed');
  const getSemesterStatusLabel = (value) => (value === 'open' ? 'Đang mở' : 'Đã đóng');

  const getAcademicYearStatusValue = (year) => {
    const now = new Date();
    const start = year.startDate ? new Date(year.startDate) : null;
    const end = year.endDate ? new Date(year.endDate) : null;

    if (start && end) {
      if (now < start) return 'upcoming';
      if (now > end) return 'completed';
      return 'ongoing';
    }

    if (start) {
      return now >= start ? 'ongoing' : 'upcoming';
    }

    if (end) {
      return now > end ? 'completed' : 'ongoing';
    }

    return 'unknown';
  };

  const getAcademicYearStatusLabel = (value) => {
    switch (value) {
      case 'upcoming':
        return 'Sắp diễn ra';
      case 'ongoing':
        return 'Đang diễn ra';
      case 'completed':
        return 'Đã kết thúc';
      default:
        return 'Chưa xác định';
    }
  };

  const getAcademicYearStatusColor = (value) => {
    switch (value) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'ongoing':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const filteredSemesters = semesters.filter((semester) => {
    const matchesSearch =
      semester.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      semester.academicYearName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      semesterStatusFilter === 'all' ||
      getSemesterStatusValue(semester) === semesterStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredAcademicYears = academicYears.filter((year) => {
    const matchesSearch = year.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const yearStatus = getAcademicYearStatusValue(year);
    const matchesStatus =
      academicYearStatusFilter === 'all' || yearStatus === academicYearStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewItem = (item) => {
    setSelectedItem(item);
    setShowViewModal(true);
  };

  const handleEditItem = (item) => {
    setSelectedItem(item);
    setShowEditModal(true);
  };

  const handleDeleteItem = (item) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa ${activeTab === 'semesters' ? 'học kỳ' : 'năm học'} này?`)) {
      console.log('Delete item:', item.id);
    }
  };

  const getStatusBadgeColor = (isOpen) => {
    return isOpen 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (isOpen) => {
    return isOpen ? 'Đang mở' : 'Đã đóng';
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

      {/* Search and Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
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
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="w-full sm:w-48">
            {activeTab === 'semesters' ? (
              <select
                value={semesterStatusFilter}
                onChange={(e) => setSemesterStatusFilter(e.target.value)}
                className="input-field"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="open">Đang mở</option>
                <option value="closed">Đã đóng</option>
              </select>
            ) : (
              <select
                value={academicYearStatusFilter}
                onChange={(e) => setAcademicYearStatusFilter(e.target.value)}
                className="input-field"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="upcoming">Sắp diễn ra</option>
                <option value="ongoing">Đang diễn ra</option>
                <option value="completed">Đã kết thúc</option>
              </select>
            )}
          </div>
          <button
            onClick={() =>
              activeTab === 'semesters'
                ? setShowAddSemesterModal(true)
                : setShowAddAcademicYearModal(true)
            }
            className="btn-primary flex items-center space-x-2"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Thêm {activeTab === 'semesters' ? 'học kỳ' : 'năm học'}</span>
          </button>
        </div>
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
                            {semester.name || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {semester.id}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {semester.academicYearName || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {semester.startDate ? new Date(semester.startDate).toLocaleDateString('vi-VN') : 'N/A'} - {semester.endDate ? new Date(semester.endDate).toLocaleDateString('vi-VN') : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(semester.isOpen)}`}>
                          {getStatusText(semester.isOpen)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleViewItem(semester)}
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
                  filteredAcademicYears.map((year) => {
                    const yearStatus = getAcademicYearStatusValue(year);
                    return (
                      <tr key={year.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {year.name || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {year.id}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {year.startDate ? new Date(year.startDate).toLocaleDateString('vi-VN') : 'N/A'} - {year.endDate ? new Date(year.endDate).toLocaleDateString('vi-VN') : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col space-y-1">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getAcademicYearStatusColor(yearStatus)}`}>
                            {getAcademicYearStatusLabel(yearStatus)}
                          </span>
                          <span className="text-xs text-gray-500">
                            {year.semesters?.length || 0} học kỳ
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleViewItem(year)}
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
                    );
                  })
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

      {/* Pagination */}
      <Pagination
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        totalElements={pagination.totalElements}
        pageSize={pagination.size}
        onPageChange={(page) => activeTab === 'semesters' ? loadSemesters(page, pagination.size) : loadAcademicYears(page, pagination.size)}
        itemName={activeTab === 'semesters' ? 'học kỳ' : 'năm học'}
      />

      {/* Add Semester Modal */}
      {showAddSemesterModal && (
        <div className={`fixed inset-0 bg-gray-800/10 backdrop-blur-[2px] flex items-center justify-center z-50 transition-opacity duration-300 ${showAddSemesterModal ? 'opacity-100' : 'opacity-0'}`}>
          <div className="relative p-6 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Thêm học kỳ mới</h3>
              <button
                onClick={() => setShowAddSemesterModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tên học kỳ</label>
                  <input type="text" className="input-field" placeholder="Nhập tên học kỳ" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Mã học kỳ</label>
                  <input type="text" className="input-field" placeholder="Nhập mã học kỳ" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Năm học</label>
                  <select className="input-field">
                    <option value="">Chọn năm học</option>
                    {academicYears.map(year => (
                      <option key={year.id} value={year.name}>{year.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                  <select className="input-field">
                    <option value="active">Đang hoạt động</option>
                    <option value="inactive">Không hoạt động</option>
                    <option value="upcoming">Sắp tới</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Ngày bắt đầu</label>
                  <input type="date" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Ngày kết thúc</label>
                  <input type="date" className="input-field" />
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddSemesterModal(false)}
                  className="btn-secondary"
                >
                  Hủy
                </button>
                <button type="submit" className="btn-primary">
                  Thêm học kỳ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Academic Year Modal */}
      {showAddAcademicYearModal && (
        <div className={`fixed inset-0 bg-gray-800/10 backdrop-blur-[2px] flex items-center justify-center z-50 transition-opacity duration-300 ${showAddAcademicYearModal ? 'opacity-100' : 'opacity-0'}`}>
          <div className="relative p-6 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Thêm năm học mới</h3>
              <button
                onClick={() => setShowAddAcademicYearModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Năm học</label>
                  <input type="text" className="input-field" placeholder="Nhập năm học (VD: 2024-2025)" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                  <select className="input-field">
                    <option value="active">Đang hoạt động</option>
                    <option value="inactive">Không hoạt động</option>
                    <option value="upcoming">Sắp tới</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Ngày bắt đầu</label>
                  <input type="date" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Ngày kết thúc</label>
                  <input type="date" className="input-field" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Mô tả</label>
                <textarea className="input-field" rows="3" placeholder="Nhập mô tả năm học"></textarea>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddAcademicYearModal(false)}
                  className="btn-secondary"
                >
                  Hủy
                </button>
                <button type="submit" className="btn-primary">
                  Thêm năm học
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedItem && (
        <div className={`fixed inset-0 bg-gray-800/10 backdrop-blur-[2px] flex items-center justify-center z-50 transition-opacity duration-300 ${showEditModal ? 'opacity-100' : 'opacity-0'}`}>
          <div className="relative p-6 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Chỉnh sửa {activeTab === 'semesters' ? 'học kỳ' : 'năm học'}
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form className="space-y-4">
              {activeTab === 'semesters' ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Tên học kỳ</label>
                      <input 
                        type="text" 
                        className="input-field" 
                        defaultValue={selectedItem.name}
                        placeholder="Nhập tên học kỳ" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">ID học kỳ</label>
                      <input 
                        type="text" 
                        className="input-field" 
                        defaultValue={selectedItem.id}
                        placeholder="ID học kỳ" 
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Năm học</label>
                      <select className="input-field" defaultValue={selectedItem.academicYearName}>
                        <option value="">Chọn năm học</option>
                        {academicYears.map(year => (
                          <option key={year.id} value={year.name}>{year.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                      <select className="input-field" defaultValue={selectedItem.isOpen ? 'true' : 'false'}>
                        <option value="true">Đang mở</option>
                        <option value="false">Đã đóng</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Ngày bắt đầu</label>
                      <input 
                        type="date" 
                        className="input-field" 
                        defaultValue={selectedItem.startDate ? selectedItem.startDate.split('T')[0] : ''}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Ngày kết thúc</label>
                      <input 
                        type="date" 
                        className="input-field" 
                        defaultValue={selectedItem.endDate ? selectedItem.endDate.split('T')[0] : ''}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Năm học</label>
                      <input 
                        type="text" 
                        className="input-field" 
                        defaultValue={selectedItem.name}
                        placeholder="Nhập năm học" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Số học kỳ</label>
                      <input 
                        type="number" 
                        className="input-field" 
                        defaultValue={selectedItem.semesters?.length || 0}
                        placeholder="Số học kỳ" 
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getAcademicYearStatusColor(getAcademicYearStatusValue(selectedItem))}`}>
                        {getAcademicYearStatusLabel(getAcademicYearStatusValue(selectedItem))}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Ngày bắt đầu</label>
                      <input 
                        type="date" 
                        className="input-field" 
                        defaultValue={selectedItem.startDate ? selectedItem.startDate.split('T')[0] : ''}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Ngày kết thúc</label>
                      <input 
                        type="date" 
                        className="input-field" 
                        defaultValue={selectedItem.endDate ? selectedItem.endDate.split('T')[0] : ''}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Mô tả</label>
                    <textarea 
                      className="input-field" 
                      rows="3" 
                      defaultValue={selectedItem.description || ''}
                      placeholder="Nhập mô tả năm học"
                    ></textarea>
                  </div>
                </>
              )}
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="btn-secondary"
                >
                  Hủy
                </button>
                <button type="submit" className="btn-primary">
                  Cập nhật
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {showViewModal && selectedItem && (
        <div className={`fixed inset-0 bg-gray-800/10 backdrop-blur-[2px] flex items-center justify-center z-50 transition-opacity duration-300 ${showViewModal ? 'opacity-100' : 'opacity-0'}`}>
          <div className="relative p-6 border w-full max-w-4xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Chi tiết {activeTab === 'semesters' ? 'học kỳ' : 'năm học'}
              </h3>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Thông tin chính */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    {activeTab === 'semesters' ? (
                      <CalendarIcon className="h-5 w-5 mr-2" />
                    ) : (
                      <AcademicCapIcon className="h-5 w-5 mr-2" />
                    )}
                    Thông tin {activeTab === 'semesters' ? 'học kỳ' : 'năm học'}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">
                        {activeTab === 'semesters' ? 'Tên học kỳ' : 'Năm học'}
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {activeTab === 'semesters' ? selectedItem.name : selectedItem.name}
                      </p>
                    </div>
                    {activeTab === 'semesters' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-500">ID học kỳ</label>
                        <p className="mt-1 text-sm text-gray-900 font-mono">{selectedItem.id}</p>
                      </div>
                    )}
                    {activeTab === 'semesters' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Năm học</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedItem.academicYearName}</p>
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Số học kỳ</label>
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {selectedItem.semesters?.length || 0} học kỳ
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Ngày bắt đầu</label>
                      <p className="mt-1 text-sm text-gray-900 flex items-center">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        {selectedItem.startDate ? new Date(selectedItem.startDate).toLocaleDateString('vi-VN') : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Ngày kết thúc</label>
                      <p className="mt-1 text-sm text-gray-900 flex items-center">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        {selectedItem.endDate ? new Date(selectedItem.endDate).toLocaleDateString('vi-VN') : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                {activeTab === 'academic-years' && selectedItem.semesters && selectedItem.semesters.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Danh sách học kỳ</h4>
                    <div className="space-y-3">
                      {selectedItem.semesters.map((semester, index) => (
                        <div key={semester.id || index} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{semester.name}</div>
                            <div className="text-sm text-gray-500">
                              {semester.startDate ? new Date(semester.startDate).toLocaleDateString('vi-VN') : 'N/A'} - {semester.endDate ? new Date(semester.endDate).toLocaleDateString('vi-VN') : 'N/A'}
                            </div>
                          </div>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(semester.isOpen)}`}>
                            {getStatusText(semester.isOpen)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Avatar và thông tin tóm tắt */}
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="h-24 w-24 rounded-full bg-indigo-100 flex items-center justify-center">
                      {activeTab === 'semesters' ? (
                        <CalendarIcon className="h-12 w-12 text-indigo-600" />
                      ) : (
                        <AcademicCapIcon className="h-12 w-12 text-indigo-600" />
                      )}
                    </div>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {activeTab === 'semesters' ? selectedItem.name : selectedItem.name}
                  </h3>
                  {activeTab === 'semesters' && (
                    <p className="text-sm text-gray-500">ID: {selectedItem.id}</p>
                  )}
                  <div className="mt-4">
                    {activeTab === 'semesters' ? (
                      <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800">
                        {selectedItem.semesters?.length || 0} học kỳ
                      </span>
                    ) : (
                      <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getAcademicYearStatusColor(getAcademicYearStatusValue(selectedItem))}`}>
                        {getAcademicYearStatusLabel(getAcademicYearStatusValue(selectedItem))}
                      </span>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Thống kê</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Số học kỳ:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {selectedItem.semesters?.length || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Thời gian:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {selectedItem.startDate && selectedItem.endDate 
                          ? `${Math.ceil((new Date(selectedItem.endDate) - new Date(selectedItem.startDate)) / (1000 * 60 * 60 * 24))} ngày`
                          : 'N/A'
                        }
                      </span>
                    </div>
                    {activeTab === 'semesters' && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Năm học:</span>
                        <span className="text-sm font-medium text-gray-900">{selectedItem.academicYearName}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setShowViewModal(false)}
                className="btn-secondary"
              >
                Đóng
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowViewModal(false);
                  handleEditItem(selectedItem);
                }}
                className="btn-primary"
              >
                Chỉnh sửa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SemesterManagement;