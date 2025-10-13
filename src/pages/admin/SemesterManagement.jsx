import React, { useState } from 'react';
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

const SemesterManagement = () => {
  const [activeTab, setActiveTab] = useState('semesters');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddSemesterModal, setShowAddSemesterModal] = useState(false);
  const [showAddAcademicYearModal, setShowAddAcademicYearModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Mock data for semesters
  const semesters = [
    {
      id: 1,
      semesterName: 'Học kỳ 1',
      academicYear: '2023-2024',
      startDate: '2023-09-01',
      endDate: '2024-01-15',
      status: 'active',
      registrationStatus: 'closed',
      studentCount: 1200,
      classCount: 30,
      subjectCount: 12
    },
    {
      id: 2,
      semesterName: 'Học kỳ 2',
      academicYear: '2023-2024',
      startDate: '2024-01-16',
      endDate: '2024-05-31',
      status: 'upcoming',
      registrationStatus: 'open',
      studentCount: 1200,
      classCount: 30,
      subjectCount: 12
    },
    {
      id: 3,
      semesterName: 'Học kỳ hè',
      academicYear: '2023-2024',
      startDate: '2024-06-01',
      endDate: '2024-08-15',
      status: 'upcoming',
      registrationStatus: 'closed',
      studentCount: 0,
      classCount: 0,
      subjectCount: 0
    }
  ];

  // Mock data for academic years
  const academicYears = [
    {
      id: 1,
      yearName: '2023-2024',
      startDate: '2023-09-01',
      endDate: '2024-08-31',
      status: 'active',
      semesterCount: 3,
      totalStudents: 1200,
      totalClasses: 30,
      totalTeachers: 45
    },
    {
      id: 2,
      yearName: '2022-2023',
      startDate: '2022-09-01',
      endDate: '2023-08-31',
      status: 'completed',
      semesterCount: 3,
      totalStudents: 1150,
      totalClasses: 28,
      totalTeachers: 42
    },
    {
      id: 3,
      yearName: '2024-2025',
      startDate: '2024-09-01',
      endDate: '2025-08-31',
      status: 'upcoming',
      semesterCount: 0,
      totalStudents: 0,
      totalClasses: 0,
      totalTeachers: 0
    }
  ];

  const filteredSemesters = semesters.filter(semester =>
    semester.semesterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    semester.academicYear.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAcademicYears = academicYears.filter(year =>
    year.yearName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRegistrationStatusBadgeColor = (status) => {
    return status === 'open' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Đang diễn ra';
      case 'upcoming': return 'Sắp tới';
      case 'completed': return 'Đã kết thúc';
      default: return 'Không xác định';
    }
  };

  const handleEditItem = (item) => {
    setSelectedItem(item);
    setShowEditModal(true);
  };

  const handleDeleteItem = (item, type) => {
    const itemName = type === 'semester' ? item.semesterName : item.yearName;
    if (window.confirm(`Bạn có chắc chắn muốn xóa ${type === 'semester' ? 'học kỳ' : 'năm học'} ${itemName}?`)) {
      console.log(`Delete ${type}:`, item.id);
    }
  };

  const handleToggleRegistration = (semester) => {
    const newStatus = semester.registrationStatus === 'open' ? 'closed' : 'open';
    console.log(`Toggle registration for ${semester.semesterName}: ${newStatus}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý học kỳ & năm học</h1>
          <p className="mt-1 text-sm text-gray-500">
            Quản lý học kỳ, năm học và trạng thái đăng ký
          </p>
        </div>
        <div className="flex space-x-3">
          {activeTab === 'semesters' ? (
            <button
              onClick={() => setShowAddSemesterModal(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <CalendarIcon className="h-5 w-5" />
              <span>Thêm học kỳ</span>
            </button>
          ) : (
            <button
              onClick={() => setShowAddAcademicYearModal(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <AcademicCapIcon className="h-5 w-5" />
              <span>Thêm năm học</span>
            </button>
          )}
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

      {/* Search */}
      <div className="card">
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

      {/* Semesters Tab */}
      {activeTab === 'semesters' && (
        <div className="card">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Học kỳ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thời gian
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thống kê
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Đăng ký
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSemesters.map((semester) => (
                  <tr key={semester.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <CalendarIcon className="h-8 w-8 text-primary-500 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {semester.semesterName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {semester.academicYear}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(semester.startDate).toLocaleDateString('vi-VN')}
                      </div>
                      <div className="text-sm text-gray-500">
                        đến {new Date(semester.endDate).toLocaleDateString('vi-VN')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {semester.studentCount} học sinh
                      </div>
                      <div className="text-sm text-gray-500">
                        {semester.classCount} lớp • {semester.subjectCount} môn
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(semester.status)}`}>
                        {getStatusText(semester.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRegistrationStatusBadgeColor(semester.registrationStatus)}`}>
                          {semester.registrationStatus === 'open' ? 'Mở' : 'Đóng'}
                        </span>
                        <button
                          onClick={() => handleToggleRegistration(semester)}
                          className={`p-1 rounded ${
                            semester.registrationStatus === 'open' 
                              ? 'text-red-600 hover:text-red-800' 
                              : 'text-green-600 hover:text-green-800'
                          }`}
                          title={semester.registrationStatus === 'open' ? 'Đóng đăng ký' : 'Mở đăng ký'}
                        >
                          {semester.registrationStatus === 'open' ? (
                            <LockClosedIcon className="h-4 w-4" />
                          ) : (
                            <LockOpenIcon className="h-4 w-4" />
                          )}
                        </button>
                      </div>
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
                          onClick={() => handleDeleteItem(semester, 'semester')}
                          className="text-red-600 hover:text-red-900"
                          title="Xóa"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Academic Years Tab */}
      {activeTab === 'academic-years' && (
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
                    Thống kê
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
                {filteredAcademicYears.map((year) => (
                  <tr key={year.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <AcademicCapIcon className="h-8 w-8 text-primary-500 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {year.yearName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(year.startDate).toLocaleDateString('vi-VN')}
                      </div>
                      <div className="text-sm text-gray-500">
                        đến {new Date(year.endDate).toLocaleDateString('vi-VN')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {year.totalStudents} học sinh
                      </div>
                      <div className="text-sm text-gray-500">
                        {year.totalClasses} lớp • {year.totalTeachers} giáo viên
                      </div>
                      <div className="text-xs text-gray-400">
                        {year.semesterCount} học kỳ
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
                          onClick={() => handleDeleteItem(year, 'academic-year')}
                          className="text-red-600 hover:text-red-900"
                          title="Xóa"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Semester Modal */}
      {showAddSemesterModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Thêm học kỳ mới</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tên học kỳ</label>
                  <input type="text" className="input-field" placeholder="Ví dụ: Học kỳ 1" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Năm học</label>
                  <select className="input-field">
                    {academicYears.map(year => (
                      <option key={year.id} value={year.yearName}>{year.yearName}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
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
                  <label className="block text-sm font-medium text-gray-700">Trạng thái đăng ký</label>
                  <select className="input-field">
                    <option value="closed">Đóng</option>
                    <option value="open">Mở</option>
                  </select>
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
        </div>
      )}

      {/* Add Academic Year Modal */}
      {showAddAcademicYearModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Thêm năm học mới</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tên năm học</label>
                  <input type="text" className="input-field" placeholder="Ví dụ: 2024-2025" />
                </div>
                <div className="grid grid-cols-2 gap-4">
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
        </div>
      )}
    </div>
  );
};

export default SemesterManagement;
