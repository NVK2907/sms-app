import React, { useState, useEffect } from 'react';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  UserIcon,
  DocumentArrowDownIcon,
  AcademicCapIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { studentService } from '../../services/studentService';
import Pagination from '../../components/Pagination';

const StudentManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0
  });

  // Load students data
  const loadStudents = async (page = 0, size = 10) => {
    setLoading(true);
    try {
      const response = await studentService.getAllStudents(page, size);
      console.log('Student API Response:', response); // Debug log
      if (response.success) {
        setStudents(response.data.students || []);
        setPagination({
          page: response.data.currentPage || 0,
          size: response.data.pageSize || 10,
          totalElements: response.data.totalElements || 0,
          totalPages: response.data.totalPages || 0
        });
      } else {
        console.error('Student API returned success: false', response.message);
      }
    } catch (error) {
      console.error('Lỗi khi tải danh sách sinh viên:', error);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  // Search students
  const searchStudents = async (searchRequest, page = 0, size = 10) => {
    setLoading(true);
    try {
      const response = await studentService.searchStudents(searchRequest, page, size);
      if (response.success) {
        setStudents(response.data.students || []);
        setPagination({
          page: response.data.currentPage || 0,
          size: response.data.pageSize || 10,
          totalElements: response.data.totalElements || 0,
          totalPages: response.data.totalPages || 0
        });
      }
    } catch (error) {
      console.error('Lỗi khi tìm kiếm sinh viên:', error);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  // Filter students based on search term, class, and course
  const filteredStudents = students.filter(student => {
    const matchesSearch = !searchTerm || 
                         student.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.studentCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClass === 'all' || student.className === selectedClass;
    const matchesCourse = selectedCourse === 'all' || student.courseYear === selectedCourse;
    return matchesSearch && matchesClass && matchesCourse;
  });

  const getStatusBadgeColor = (isActive) => {
    return isActive 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-800';
  };

  const getGenderText = (gender) => {
    switch (gender?.toLowerCase()) {
      case 'male':
      case 'nam':
        return 'Nam';
      case 'female':
      case 'nữ':
        return 'Nữ';
      default:
        return 'Khác';
    }
  };

  const handleViewStudent = (student) => {
    // Đóng tất cả modal khác trước khi mở modal xem chi tiết
    setShowAddModal(false);
    setShowEditModal(false);
    setSelectedStudent(student);
    setShowViewModal(true);
  };

  const handleEditStudent = (student) => {
    // Đóng tất cả modal khác trước khi mở modal chỉnh sửa
    setShowAddModal(false);
    setShowViewModal(false);
    setSelectedStudent(student);
    setShowEditModal(true);
  };

  const handleDeleteStudent = async (student) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa sinh viên ${student.fullName}?`)) {
      try {
        await studentService.deleteStudent(student.id);
        loadStudents(pagination.page, pagination.size);
      } catch (error) {
        console.error('Lỗi khi xóa sinh viên:', error);
      }
    }
  };

  const handleCreateStudent = async (studentData) => {
    try {
      await studentService.createStudent(studentData);
      setShowAddModal(false);
      loadStudents();
    } catch (error) {
      console.error('Lỗi khi tạo sinh viên:', error);
    }
  };

  const handleUpdateStudent = async (studentId, studentData) => {
    try {
      await studentService.updateStudent(studentId, studentData);
      setShowEditModal(false);
      loadStudents();
    } catch (error) {
      console.error('Lỗi khi cập nhật sinh viên:', error);
    }
  };

  const handleSearch = () => {
    const searchRequest = {
      keyword: searchTerm.trim(),
      className: selectedClass !== 'all' ? selectedClass : null,
      courseYear: selectedCourse !== 'all' ? selectedCourse : null
    };
    
    if (searchTerm.trim() || selectedClass !== 'all' || selectedCourse !== 'all') {
      searchStudents(searchRequest);
    } else {
      loadStudents();
    }
  };


  const closeAllModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowViewModal(false);
    setSelectedStudent(null);
  };

  const handleAddStudent = () => {
    // Đóng tất cả modal khác trước khi mở modal thêm sinh viên
    setShowEditModal(false);
    setShowViewModal(false);
    setSelectedStudent(null);
    setShowAddModal(true);
  };

  const handleExportStudents = () => {
    console.log('Export students to Excel/PDF');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý sinh viên</h1>
          <p className="mt-1 text-sm text-gray-500">
            Quản lý thông tin sinh viên, gán lớp và khóa học
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleExportStudents}
            className="btn-secondary flex items-center space-x-2"
          >
            <DocumentArrowDownIcon className="h-5 w-5" />
            <span>Xuất Excel/PDF</span>
          </button>
          <button
            onClick={handleAddStudent}
            className="btn-primary flex items-center space-x-2"
          >
            <UserIcon className="h-5 w-5" />
            <span>Thêm sinh viên</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, mã SV hoặc email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>
          <div>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="input-field"
            >
              <option value="all">Tất cả lớp</option>
              {Array.from(new Set(students.map(s => s.className).filter(Boolean))).map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>
          <div>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="input-field"
            >
              <option value="all">Tất cả khóa</option>
              {Array.from(new Set(students.map(s => s.courseYear).filter(Boolean))).map(course => (
                <option key={course} value={course}>Khóa {course}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sinh viên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thông tin liên hệ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lớp & Khóa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày nhập học
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                      <span className="ml-2 text-gray-500">Đang tải...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">
                              {student.fullName?.split(' ').map(n => n[0]).join('') || 'S'}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {student.fullName || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {student.studentCode || 'N/A'}
                          </div>
                          <div className="text-xs text-gray-400">
                            {getGenderText(student.gender)} • {student.dob ? new Date(student.dob).toLocaleDateString('vi-VN') : 'N/A'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{student.email || 'N/A'}</div>
                      <div className="text-sm text-gray-500">{student.phone || 'N/A'}</div>
                      <div className="text-xs text-gray-400 truncate max-w-xs">{student.address || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <AcademicCapIcon className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">{student.className || 'N/A'}</span>
                      </div>
                      <div className="text-sm text-gray-500">Khóa {student.courseYear || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(student.isActive)}`}>
                        {student.isActive ? 'Đang học' : 'Nghỉ học'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <CalendarIcon className="h-4 w-4" />
                        <span>{student.createdAt ? new Date(student.createdAt).toLocaleDateString('vi-VN') : 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button 
                          onClick={() => handleViewStudent(student)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Xem chi tiết"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleEditStudent(student)}
                          className="text-yellow-600 hover:text-yellow-900"
                          title="Chỉnh sửa"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteStudent(student)}
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
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    {students.length === 0 ? 'Không có dữ liệu sinh viên' : 'Không tìm thấy sinh viên nào phù hợp với bộ lọc'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* Pagination */}
      <Pagination
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        totalElements={pagination.totalElements}
        pageSize={pagination.size}
        onPageChange={(page) => loadStudents(page, pagination.size)}
        itemName="sinh viên"
      />

      {/* Add Student Modal */}
      {showAddModal && (
        <div 
          className={`fixed inset-0 bg-gray-800/10 backdrop-blur-[2px] flex items-center justify-center z-50 transition-opacity duration-300 ${showAddModal ? 'opacity-100' : 'opacity-0'}`}
          onClick={closeAllModals}
        >
          <div 
            className="relative p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Thêm sinh viên mới</h3>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Họ và tên</label>
                    <input type="text" className="input-field" placeholder="Nhập họ và tên" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Mã sinh viên</label>
                    <input type="text" className="input-field" placeholder="Nhập mã sinh viên" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input type="email" className="input-field" placeholder="Nhập email" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                    <input type="tel" className="input-field" placeholder="Nhập số điện thoại" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Ngày sinh</label>
                    <input type="date" className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Giới tính</label>
                    <select className="input-field">
                      <option value="male">Nam</option>
                      <option value="female">Nữ</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Lớp</label>
                    <select className="input-field">
                      <option value="">Chọn lớp</option>
                      {Array.from(new Set(students.map(s => s.className).filter(Boolean))).map(cls => (
                        <option key={cls} value={cls}>{cls}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Khóa học</label>
                    <select className="input-field">
                      <option value="">Chọn khóa</option>
                      {Array.from(new Set(students.map(s => s.courseYear).filter(Boolean))).map(course => (
                        <option key={course} value={course}>Khóa {course}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Địa chỉ</label>
                  <textarea className="input-field" rows="3" placeholder="Nhập địa chỉ"></textarea>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={closeAllModals}
                    className="btn-secondary"
                  >
                    Hủy
                  </button>
                  <button type="submit" className="btn-primary">
                    Thêm sinh viên
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {showEditModal && selectedStudent && (
        <div 
          className={`fixed inset-0 bg-gray-800/10 backdrop-blur-[2px] flex items-center justify-center z-50 transition-opacity duration-300 ${showEditModal ? 'opacity-100' : 'opacity-0'}`}
          onClick={closeAllModals}
        >
          <div 
            className="relative p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Chỉnh sửa thông tin sinh viên</h3>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Họ và tên</label>
                    <input 
                      type="text" 
                      className="input-field" 
                      defaultValue={selectedStudent.fullName}
                      placeholder="Nhập họ và tên" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Mã sinh viên</label>
                    <input 
                      type="text" 
                      className="input-field" 
                      defaultValue={selectedStudent.studentCode}
                      placeholder="Nhập mã sinh viên" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input 
                      type="email" 
                      className="input-field" 
                      defaultValue={selectedStudent.email}
                      placeholder="Nhập email" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                    <input 
                      type="tel" 
                      className="input-field" 
                      defaultValue={selectedStudent.phone}
                      placeholder="Nhập số điện thoại" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Ngày sinh</label>
                    <input 
                      type="date" 
                      className="input-field" 
                      defaultValue={selectedStudent.dateOfBirth}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Giới tính</label>
                    <select className="input-field" defaultValue={selectedStudent.gender}>
                      <option value="male">Nam</option>
                      <option value="female">Nữ</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Lớp</label>
                    <select className="input-field" defaultValue={selectedStudent.className}>
                      <option value="">Chọn lớp</option>
                      {Array.from(new Set(students.map(s => s.className).filter(Boolean))).map(cls => (
                        <option key={cls} value={cls}>{cls}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Khóa học</label>
                    <select className="input-field" defaultValue={selectedStudent.courseYear}>
                      <option value="">Chọn khóa</option>
                      {Array.from(new Set(students.map(s => s.courseYear).filter(Boolean))).map(course => (
                        <option key={course} value={course}>Khóa {course}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Địa chỉ</label>
                  <textarea 
                    className="input-field" 
                    rows="3" 
                    defaultValue={selectedStudent.address}
                    placeholder="Nhập địa chỉ"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                  <select className="input-field" defaultValue={selectedStudent.status}>
                    <option value="active">Đang học</option>
                    <option value="inactive">Nghỉ học</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={closeAllModals}
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
        </div>
      )}

      {/* View Student Details Modal */}
      {showViewModal && selectedStudent && (
        <div 
          className={`fixed inset-0 bg-gray-800/10 backdrop-blur-[2px] flex items-center justify-center z-50 transition-opacity duration-300 ${showViewModal ? 'opacity-100' : 'opacity-0'}`}
          onClick={closeAllModals}
        >
          <div 
            className="relative p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mt-3">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Chi tiết sinh viên</h3>
                <button
                  onClick={closeAllModals}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Thông tin cá nhân */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                      <UserIcon className="h-5 w-5 mr-2" />
                      Thông tin cá nhân
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Họ và tên</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedStudent.fullName}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Mã sinh viên</label>
                        <p className="mt-1 text-sm text-gray-900 font-mono">{selectedStudent.studentCode}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Ngày sinh</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedStudent.dob ? new Date(selectedStudent.dob).toLocaleDateString('vi-VN') : 'N/A'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Giới tính</label>
                        <p className="mt-1 text-sm text-gray-900">{getGenderText(selectedStudent.gender)}</p>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-500">Địa chỉ</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedStudent.address}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                      <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Thông tin liên hệ
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Email</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedStudent.email}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Số điện thoại</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedStudent.phone}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                      <AcademicCapIcon className="h-5 w-5 mr-2" />
                      Thông tin học tập
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Lớp</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedStudent.className}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Khóa học</label>
                        <p className="mt-1 text-sm text-gray-900">Khóa {selectedStudent.courseYear || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Ngày nhập học</label>
                        <p className="mt-1 text-sm text-gray-900 flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          {selectedStudent.createdAt ? new Date(selectedStudent.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Trạng thái</label>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(selectedStudent.isActive)}`}>
                          {selectedStudent.isActive ? 'Đang học' : 'Nghỉ học'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Avatar và thông tin tóm tắt */}
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-6 text-center">
                    <div className="flex justify-center mb-4">
                      <div className="h-24 w-24 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="text-2xl font-bold text-indigo-600">
                          {selectedStudent.fullName.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">{selectedStudent.fullName}</h3>
                    <p className="text-sm text-gray-500">{selectedStudent.studentCode}</p>
                    <div className="mt-4">
                      <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusBadgeColor(selectedStudent.isActive)}`}>
                        {selectedStudent.isActive ? 'Đang học' : 'Nghỉ học'}
                      </span>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Thống kê</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Thời gian học:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {selectedStudent.createdAt ? Math.floor((new Date() - new Date(selectedStudent.createdAt)) / (1000 * 60 * 60 * 24 * 30)) : 0} tháng
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Tuổi:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {selectedStudent.dob ? new Date().getFullYear() - new Date(selectedStudent.dob).getFullYear() : 'N/A'} tuổi
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeAllModals}
                  className="btn-secondary"
                >
                  Đóng
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowViewModal(false);
                    handleEditStudent(selectedStudent);
                  }}
                  className="btn-primary"
                >
                  Chỉnh sửa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentManagement;
