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

const SubjectClassManagement = () => {
  const [activeTab, setActiveTab] = useState('subjects');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddSubjectModal, setShowAddSubjectModal] = useState(false);
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load data from API
  const loadSubjects = async () => {
    setLoading(true);
    try {
      const response = await subjectService.getAllSubjects();
      console.log('Subject API Response:', response); // Debug log
      if (response.success) {
        setSubjects(response.data.subjects || []);
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

  const loadClasses = async () => {
    setLoading(true);
    try {
      const response = await classService.getAllClasses();
      console.log('Class API Response:', response); // Debug log
      if (response.success) {
        setClasses(response.data.classes || []);
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

  const filteredSubjects = subjects.filter(subject =>
    subject.subjectName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.subjectCode?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredClasses = classes.filter(cls =>
    cls.className?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.classCode?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              className="input-field pl-10"
            />
          </div>
        </div>
        <button
          onClick={() => activeTab === 'subjects' ? setShowAddSubjectModal(true) : setShowAddClassModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Thêm {activeTab === 'subjects' ? 'môn học' : 'lớp học'}</span>
        </button>
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
                            onClick={() => handleEditItem(subject)}
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
                            {cls.className || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {cls.classCode || 'N/A'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {cls.grade || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {cls.academicYear || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {cls.studentCount || 0}/{cls.maxStudents || 0}
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
                            onClick={() => handleEditItem(cls)}
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

      {/* Modals will be implemented later */}
    </div>
  );
};

export default SubjectClassManagement;