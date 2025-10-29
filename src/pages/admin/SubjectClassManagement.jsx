import React, { useState, useEffect } from 'react';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  BookOpenIcon,
  AcademicCapIcon,
  UserGroupIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { subjectService } from '../../services/subjectService';
import { classService } from '../../services/classService';
import Pagination from '../../components/Pagination';

const SubjectClassManagement = () => {
  const [activeTab, setActiveTab] = useState('subjects');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddSubjectModal, setShowAddSubjectModal] = useState(false);
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentSearchTerm, setCurrentSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0
  });

  // Load data from API
  const loadSubjects = async (page = 0, size = 10, keyword = null) => {
    setLoading(true);
    try {
      const response = await subjectService.getAllSubjects(page, size, 'id', 'asc', keyword);
      console.log('Subject API Response:', response); // Debug log
      if (response.success) {
        setSubjects(response.data.subjects || []);
        setPagination({
          page: response.data.currentPage || 0,
          size: response.data.pageSize || 10,
          totalElements: response.data.totalElements || 0,
          totalPages: response.data.totalPages || 0
        });
      } else {
        console.error('Subject API returned success: false', response.message);
      }
    } catch (error) {
      console.error('Lỗi khi tải danh sách môn học:', error);
      setSubjects([]);
    } finally {
      setLoading(false);
    }
  };

  const loadClasses = async (page = 0, size = 10, keyword = null) => {
    setLoading(true);
    try {
      const response = keyword 
        ? await classService.searchClasses(keyword, page, size)
        : await classService.getAllClasses(page, size);
      console.log('Class API Response:', response); // Debug log
      if (response.success) {
        setClasses(response.data.classes || []);
        setPagination({
          page: response.data.currentPage || 0,
          size: response.data.pageSize || 10,
          totalElements: response.data.totalElements || 0,
          totalPages: response.data.totalPages || 0
        });
      } else {
        console.error('Class API returned success: false', response.message);
      }
    } catch (error) {
      console.error('Lỗi khi tải danh sách lớp học:', error);
      setClasses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'subjects') {
      loadSubjects();
    } else {
      loadClasses();
    }
  }, [activeTab]);

  // Search subjects
  const searchSubjects = async (keyword, page = 0, size = 10) => {
    setLoading(true);
    try {
      const response = await subjectService.searchSubjects(keyword, page, size);
      if (response.success) {
        setSubjects(response.data.subjects || []);
        setPagination({
          page: response.data.currentPage || 0,
          size: response.data.pageSize || 10,
          totalElements: response.data.totalElements || 0,
          totalPages: response.data.totalPages || 0
        });
      }
    } catch (error) {
      console.error('Lỗi khi tìm kiếm môn học:', error);
    } finally {
      setLoading(false);
    }
  };

  // Search classes using API
  const searchClasses = async (keyword, page = 0, size = 10) => {
    setLoading(true);
    try {
      const response = await classService.searchClasses(keyword, page, size);
      if (response.success) {
        setClasses(response.data.classes || []);
        setPagination({
          page: response.data.currentPage || 0,
          size: response.data.pageSize || 10,
          totalElements: response.data.totalElements || 0,
          totalPages: response.data.totalPages || 0
        });
      }
    } catch (error) {
      console.error('Lỗi khi tìm kiếm lớp học:', error);
    } finally {
      setLoading(false);
    }
  };

  // For classes, use API search results directly
  const filteredClasses = activeTab === 'classes' ? classes : [];

  // Handle search
  const handleSearch = () => {
    if (activeTab === 'subjects') {
      if (searchTerm.trim()) {
        setCurrentSearchTerm(searchTerm.trim());
        searchSubjects(searchTerm.trim(), 0, pagination.size);
      } else {
        setCurrentSearchTerm('');
        loadSubjects();
      }
    } else {
      if (searchTerm.trim()) {
        setCurrentSearchTerm(searchTerm.trim());
        searchClasses(searchTerm.trim(), 0, pagination.size);
      } else {
        setCurrentSearchTerm('');
        loadClasses();
      }
    }
  };

  // For subjects, use API search results directly
  const filteredSubjects = activeTab === 'subjects' ? subjects : [];

  const handleViewItem = (item) => {
    setSelectedItem(item);
    setShowViewModal(true);
  };

  const handleEditItem = (item) => {
    setSelectedItem(item);
    setShowEditModal(true);
  };

  const handleDeleteItem = (item) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa ${activeTab === 'subjects' ? 'môn học' : 'lớp học'} này?`)) {
      console.log('Delete item:', item.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý môn học & lớp học</h1>
          <p className="mt-1 text-sm text-gray-500">
            Quản lý thông tin môn học và lớp học trong hệ thống
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('subjects')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'subjects'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <BookOpenIcon className="h-5 w-5 inline mr-2" />
            Môn học
          </button>
          <button
            onClick={() => setActiveTab('classes')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'classes'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <AcademicCapIcon className="h-5 w-5 inline mr-2" />
            Lớp học
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
              placeholder={`Tìm kiếm ${activeTab === 'subjects' ? 'môn học' : 'lớp học'}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
              className="input-field pl-10"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSearch}
            className="btn-secondary flex items-center space-x-2"
          >
            <MagnifyingGlassIcon className="h-4 w-4" />
            <span>Tìm kiếm</span>
          </button>
          <button
            onClick={() => activeTab === 'subjects' ? setShowAddSubjectModal(true) : setShowAddClassModal(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Thêm {activeTab === 'subjects' ? 'môn học' : 'lớp học'}</span>
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'subjects' ? (
        <div className="card">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Môn học
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thông tin
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
                ) : filteredSubjects.length > 0 ? (
                  filteredSubjects.map((subject) => (
                    <tr key={subject.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {subject.subjectName || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {subject.subjectCode || 'N/A'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {subject.description || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {subject.credits || 0} tín chỉ
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          subject.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {subject.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleViewItem(subject)}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Xem chi tiết"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleEditItem(subject)}
                            className="text-yellow-600 hover:text-yellow-900"
                            title="Chỉnh sửa"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(subject)}
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
                      {subjects.length === 0 ? 'Không có dữ liệu môn học' : 'Không tìm thấy môn học nào phù hợp với bộ lọc'}
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
                    Lớp học
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thông tin
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sinh viên
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
                ) : filteredClasses.length > 0 ? (
                  filteredClasses.map((cls) => (
                    <tr key={cls.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {cls.classCode || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {cls.subjectName || 'N/A'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {cls.semesterName || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {cls.teacherName || 'Chưa phân công'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {cls.currentStudentCount || 0}/{cls.maxStudent || 0}
                        </div>
                        <div className="text-sm text-gray-500">
                          sinh viên
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          cls.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {cls.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleViewItem(cls)}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Xem chi tiết"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleEditItem(cls)}
                            className="text-yellow-600 hover:text-yellow-900"
                            title="Chỉnh sửa"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(cls)}
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
                      {classes.length === 0 ? 'Không có dữ liệu lớp học' : 'Không tìm thấy lớp học nào phù hợp với bộ lọc'}
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
        onPageChange={(page) => {
          if (activeTab === 'subjects') {
            if (currentSearchTerm) {
              searchSubjects(currentSearchTerm, page, pagination.size);
            } else {
              loadSubjects(page, pagination.size);
            }
          } else {
            if (currentSearchTerm) {
              searchClasses(currentSearchTerm, page, pagination.size);
            } else {
              loadClasses(page, pagination.size);
            }
          }
        }}
        itemName={activeTab === 'subjects' ? 'môn học' : 'lớp học'}
      />

      {/* Add Subject Modal */}
      {showAddSubjectModal && (
        <div className={`fixed inset-0 bg-gray-800/10 backdrop-blur-[2px] flex items-center justify-center z-50 transition-opacity duration-300 ${showAddSubjectModal ? 'opacity-100' : 'opacity-0'}`}>
          <div className="relative p-6 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Thêm môn học mới</h3>
              <button
                onClick={() => setShowAddSubjectModal(false)}
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
                  <label className="block text-sm font-medium text-gray-700">Tên môn học</label>
                  <input type="text" className="input-field" placeholder="Nhập tên môn học" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Mã môn học</label>
                  <input type="text" className="input-field" placeholder="Nhập mã môn học" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Số tín chỉ</label>
                  <input type="number" className="input-field" placeholder="Nhập số tín chỉ" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                  <select className="input-field">
                    <option value="active">Hoạt động</option>
                    <option value="inactive">Không hoạt động</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Mô tả</label>
                <textarea className="input-field" rows="3" placeholder="Nhập mô tả môn học"></textarea>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddSubjectModal(false)}
                  className="btn-secondary"
                >
                  Hủy
                </button>
                <button type="submit" className="btn-primary">
                  Thêm môn học
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Class Modal */}
      {showAddClassModal && (
        <div className={`fixed inset-0 bg-gray-800/10 backdrop-blur-[2px] flex items-center justify-center z-50 transition-opacity duration-300 ${showAddClassModal ? 'opacity-100' : 'opacity-0'}`}>
          <div className="relative p-6 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Thêm lớp học mới</h3>
              <button
                onClick={() => setShowAddClassModal(false)}
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
                  <label className="block text-sm font-medium text-gray-700">Mã lớp học</label>
                  <input type="text" className="input-field" placeholder="Nhập mã lớp học" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Môn học</label>
                  <select className="input-field">
                    <option value="">Chọn môn học</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Học kỳ</label>
                  <select className="input-field">
                    <option value="">Chọn học kỳ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Giáo viên</label>
                  <select className="input-field">
                    <option value="">Chọn giáo viên</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Số sinh viên tối đa</label>
                  <input type="number" className="input-field" placeholder="Nhập số sinh viên tối đa" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                  <select className="input-field">
                    <option value="active">Hoạt động</option>
                    <option value="inactive">Không hoạt động</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddClassModal(false)}
                  className="btn-secondary"
                >
                  Hủy
                </button>
                <button type="submit" className="btn-primary">
                  Thêm lớp học
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
                Chỉnh sửa {activeTab === 'subjects' ? 'môn học' : 'lớp học'}
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
              {activeTab === 'subjects' ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Tên môn học</label>
                      <input 
                        type="text" 
                        className="input-field" 
                        defaultValue={selectedItem.subjectName}
                        placeholder="Nhập tên môn học" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Mã môn học</label>
                      <input 
                        type="text" 
                        className="input-field" 
                        defaultValue={selectedItem.subjectCode}
                        placeholder="Nhập mã môn học" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Số tín chỉ</label>
                      <input 
                        type="number" 
                        className="input-field" 
                        defaultValue={selectedItem.credits}
                        placeholder="Nhập số tín chỉ" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                      <select className="input-field" defaultValue={selectedItem.status}>
                        <option value="active">Hoạt động</option>
                        <option value="inactive">Không hoạt động</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Mô tả</label>
                    <textarea 
                      className="input-field" 
                      rows="3" 
                      defaultValue={selectedItem.description}
                      placeholder="Nhập mô tả môn học"
                    ></textarea>
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Mã lớp học</label>
                      <input 
                        type="text" 
                        className="input-field" 
                        defaultValue={selectedItem.classCode}
                        placeholder="Nhập mã lớp học" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Môn học</label>
                      <select className="input-field" defaultValue={selectedItem.subjectId}>
                        <option value="">Chọn môn học</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Học kỳ</label>
                      <select className="input-field" defaultValue={selectedItem.semesterId}>
                        <option value="">Chọn học kỳ</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Giáo viên</label>
                      <select className="input-field" defaultValue={selectedItem.teacherId}>
                        <option value="">Chọn giáo viên</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Số sinh viên tối đa</label>
                      <input 
                        type="number" 
                        className="input-field" 
                        defaultValue={selectedItem.maxStudent}
                        placeholder="Nhập số sinh viên tối đa" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                      <select className="input-field" defaultValue={selectedItem.status}>
                        <option value="active">Hoạt động</option>
                        <option value="inactive">Không hoạt động</option>
                      </select>
                    </div>
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
                Chi tiết {activeTab === 'subjects' ? 'môn học' : 'lớp học'}
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
                    {activeTab === 'subjects' ? (
                      <BookOpenIcon className="h-5 w-5 mr-2" />
                    ) : (
                      <AcademicCapIcon className="h-5 w-5 mr-2" />
                    )}
                    Thông tin {activeTab === 'subjects' ? 'môn học' : 'lớp học'}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">
                        {activeTab === 'subjects' ? 'Tên môn học' : 'Mã lớp học'}
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {activeTab === 'subjects' ? selectedItem.subjectName : selectedItem.classCode}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">
                        {activeTab === 'subjects' ? 'Mã môn học' : 'Môn học'}
                      </label>
                      <p className="mt-1 text-sm text-gray-900 font-mono">
                        {activeTab === 'subjects' ? selectedItem.subjectCode : selectedItem.subjectName}
                      </p>
                    </div>
                    {activeTab === 'subjects' ? (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-500">Số tín chỉ</label>
                          <p className="mt-1 text-sm text-gray-900">{selectedItem.credits || 0} tín chỉ</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-500">Trạng thái</label>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            selectedItem.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {selectedItem.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-500">Học kỳ</label>
                          <p className="mt-1 text-sm text-gray-900">{selectedItem.semesterName || 'N/A'}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-500">Giáo viên</label>
                          <p className="mt-1 text-sm text-gray-900">{selectedItem.teacherName || 'Chưa phân công'}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-500">Số sinh viên</label>
                          <p className="mt-1 text-sm text-gray-900">
                            {selectedItem.currentStudentCount || 0}/{selectedItem.maxStudent || 0} sinh viên
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-500">Trạng thái</label>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            selectedItem.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {selectedItem.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {activeTab === 'subjects' && (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Mô tả</h4>
                    <p className="text-sm text-gray-900">{selectedItem.description || 'Chưa có mô tả'}</p>
                  </div>
                )}
              </div>

              {/* Avatar và thông tin tóm tắt */}
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="h-24 w-24 rounded-full bg-indigo-100 flex items-center justify-center">
                      {activeTab === 'subjects' ? (
                        <BookOpenIcon className="h-12 w-12 text-indigo-600" />
                      ) : (
                        <AcademicCapIcon className="h-12 w-12 text-indigo-600" />
                      )}
                    </div>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {activeTab === 'subjects' ? selectedItem.subjectName : selectedItem.classCode}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {activeTab === 'subjects' ? selectedItem.subjectCode : selectedItem.subjectName}
                  </p>
                  <div className="mt-4">
                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                      selectedItem.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedItem.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Thống kê</h4>
                  <div className="space-y-3">
                    {activeTab === 'subjects' ? (
                      <>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Số tín chỉ:</span>
                          <span className="text-sm font-medium text-gray-900">{selectedItem.credits || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Trạng thái:</span>
                          <span className="text-sm font-medium text-gray-900">
                            {selectedItem.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Số sinh viên:</span>
                          <span className="text-sm font-medium text-gray-900">
                            {selectedItem.currentStudentCount || 0}/{selectedItem.maxStudent || 0}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Học kỳ:</span>
                          <span className="text-sm font-medium text-gray-900">{selectedItem.semesterName || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Giáo viên:</span>
                          <span className="text-sm font-medium text-gray-900">{selectedItem.teacherName || 'Chưa phân công'}</span>
                        </div>
                      </>
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

export default SubjectClassManagement;