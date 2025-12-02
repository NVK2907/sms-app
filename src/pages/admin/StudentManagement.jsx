import React, { useState, useEffect, useRef } from 'react';
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
import { classService } from '../../services/classService';
import Pagination from '../../components/Pagination';

const StudentManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
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
  const [notification, setNotification] = useState(null);
  const notificationTimeoutRef = useRef(null);
  const [classOptions, setClassOptions] = useState([]);
  const [classOptionsLoading, setClassOptionsLoading] = useState(false);
  const [courseOptions, setCourseOptions] = useState([]);
  const [courseOptionsLoading, setCourseOptionsLoading] = useState(false);
  const [editStudentForm, setEditStudentForm] = useState({
    fullName: '',
    studentCode: '',
    email: '',
    phone: '',
    dob: '',
    gender: 'male',
    className: '',
    courseYear: '',
    address: '',
    isActive: true
  });
  const [editStudentErrors, setEditStudentErrors] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);
  const [editSubmitError, setEditSubmitError] = useState(null);
  const showNotification = (type, message) => {
    if (notificationTimeoutRef.current) {
      clearTimeout(notificationTimeoutRef.current);
    }
    setNotification({ type, message });
    notificationTimeoutRef.current = setTimeout(() => setNotification(null), 4000);
  };

  useEffect(() => {
    return () => {
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current);
      }
    };
  }, []);

  const formatDateForInput = (value) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return '';
    }
    return date.toISOString().split('T')[0];
  };


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

    const loadClassOptions = async () => {
      setClassOptionsLoading(true);
      try {
        const response = await classService.getAllClasses(0, 1000);
        if (response.success) {
          setClassOptions(response.data.classes || []);
        } else {
          console.error('Class API returned success: false', response.message);
          setClassOptions([]);
        }
      } catch (error) {
        console.error('Lỗi khi tải danh sách lớp học cho dropdown sinh viên:', error);
        setClassOptions([]);
      } finally {
        setClassOptionsLoading(false);
      }
    };

    const loadCourseOptions = async () => {
      setCourseOptionsLoading(true);
      try {
        // Tạm thời suy ra danh sách khóa từ dữ liệu sinh viên đã tải,
        // sau này có API riêng (vd: /courses hoặc /students/course-years) thì chỉ cần thay logic tại đây.
        const response = await studentService.getAllStudents(0, 1000);
        if (response.success) {
          const studentsData = response.data.students || [];
          const uniqueCourses = Array.from(
            new Set(studentsData.map((s) => s.courseYear).filter(Boolean))
          );
          setCourseOptions(uniqueCourses);
        } else {
          console.error('Student API returned success: false khi load khóa học', response.message);
          setCourseOptions([]);
        }
      } catch (error) {
        console.error('Lỗi khi tải danh sách khóa học cho dropdown sinh viên:', error);
        setCourseOptions([]);
      } finally {
        setCourseOptionsLoading(false);
      }
    };

    loadClassOptions();
    loadCourseOptions();
  }, []);

  // Filter students based on class and course only (search is handled by API)
  const filteredStudents = students.filter((student) => {
    const matchesClass = selectedClass === 'all' || student.className === selectedClass;
    const matchesCourse = selectedCourse === 'all' || student.courseYear === selectedCourse;
    const matchesStatus =
      selectedStatus === 'all' ||
      (selectedStatus === 'active' ? student.isActive : !student.isActive);
    return matchesClass && matchesCourse && matchesStatus;
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
    setEditStudentForm({
      fullName: student.fullName || '',
      studentCode: student.studentCode || '',
      email: student.email || '',
      phone: student.phone || '',
      dob: formatDateForInput(student.dob || student.dateOfBirth),
      gender: student.gender?.toLowerCase() === 'female' ? 'female' : 'male',
      className: student.className || '',
      courseYear: student.courseYear ? String(student.courseYear) : '',
      address: student.address || '',
      isActive: student.isActive ?? true
    });
    setEditStudentErrors({});
    setEditSubmitError(null);
    setShowEditModal(true);
  };

  const handleDeleteStudent = async (student) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa sinh viên ${student.fullName}?`)) {
      try {
        await studentService.deleteStudent(student.id);
        showNotification('success', 'Xóa sinh viên thành công.');
        loadStudents(pagination.page, pagination.size);
      } catch (error) {
        console.error('Lỗi khi xóa sinh viên:', error);
        const message = error?.message || error?.error || error?.details || error?.response?.message;
        const fallback = 'Không thể xóa sinh viên. Vui lòng thử lại.';
        showNotification(
          'error',
          typeof message === 'string' && message.trim().length > 0 ? message : fallback
        );
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
      setIsUpdating(true);
      setEditSubmitError(null);
      await studentService.updateStudent(studentId, studentData);
      showNotification('success', 'Cập nhật sinh viên thành công.');
      setShowEditModal(false);
      setSelectedStudent(null);
      loadStudents(pagination.page, pagination.size);
    } catch (error) {
      console.error('Lỗi khi cập nhật sinh viên:', error);
      const message = error?.message || error?.error || error?.details || error?.response?.message;
      const fallback = 'Không thể cập nhật sinh viên. Vui lòng thử lại.';
      const resolvedMessage =
        typeof message === 'string' && message.trim().length > 0 ? message : fallback;
      setEditSubmitError(resolvedMessage);
      showNotification('error', resolvedMessage);
    } finally {
      setIsUpdating(false);
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
    setEditStudentErrors({});
    setEditSubmitError(null);
  };

  const handleEditStudentInputChange = (field, value) => {
    setEditStudentForm((prev) => ({
      ...prev,
      [field]: value
    }));
    setEditStudentErrors((prev) => ({
      ...prev,
      [field]: undefined
    }));
  };

  const validateEditStudentForm = () => {
    const errors = {};
    if (!editStudentForm.className.trim()) {
      errors.className = 'Vui lòng chọn lớp.';
    }
    if (!editStudentForm.courseYear.trim()) {
      errors.courseYear = 'Vui lòng chọn khóa học.';
    }
    return errors;
  };

  const handleEditStudentSubmit = async (event) => {
    event.preventDefault();
    if (!selectedStudent) {
      return;
    }
    const errors = validateEditStudentForm();
    if (Object.keys(errors).length > 0) {
      setEditStudentErrors(errors);
      return;
    }

    const payload = {
      fullName: editStudentForm.fullName.trim(),
      studentCode: editStudentForm.studentCode.trim(),
      email: editStudentForm.email.trim(),
      phone: editStudentForm.phone.trim() || null,
      dob: editStudentForm.dob || null,
      gender: editStudentForm.gender,
      className: editStudentForm.className.trim(),
      courseYear: editStudentForm.courseYear.trim(),
      address: editStudentForm.address.trim() || null,
      isActive: editStudentForm.isActive
    };

    await handleUpdateStudent(selectedStudent.id, payload);
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
      {/* Notification */}
      {notification && (
        <div
          className={`rounded-md p-4 ${
            notification.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {notification.message}
        </div>
      )}

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
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, mã SV hoặc email..."
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
          <div>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="input-field"
              disabled={classOptionsLoading}
            >
              <option value="all">Tất cả lớp</option>
              {classOptions.map((cls) => (
                <option
                  key={cls.id}
                  value={cls.classCode || cls.className}
                >
                  {cls.classCode || cls.className}
                </option>
              ))}
            </select>
          </div>
          <div>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="input-field"
              disabled={courseOptionsLoading}
            >
              <option value="all">Tất cả khóa</option>
              {courseOptions.map((course) => (
                <option key={course} value={course}>
                  Khóa {course}
                </option>
              ))}
            </select>
          </div>
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="input-field"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang học</option>
              <option value="inactive">Nghỉ học</option>
            </select>
          </div>
          <div>
            <button
              onClick={handleSearch}
              className="btn-primary flex items-center space-x-2 w-full"
            >
              <MagnifyingGlassIcon className="h-4 w-4" />
              <span>Tìm kiếm</span>
            </button>
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
                    <select className="input-field" disabled={classOptionsLoading}>
                      <option value="">Chọn lớp</option>
                      {classOptions.map((cls) => (
                        <option
                          key={cls.id}
                          value={cls.classCode || cls.className}
                        >
                          {cls.classCode || cls.className}
                        </option>
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
              <form className="space-y-4" onSubmit={handleEditStudentSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Họ và tên</label>
                    <input 
                      type="text" 
                      className="input-field input-field-disabled" 
                      value={editStudentForm.fullName}
                      onChange={(e) => handleEditStudentInputChange('fullName', e.target.value)}
                      placeholder="Nhập họ và tên"
                      disabled
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Mã sinh viên</label>
                    <input 
                      type="text" 
                      className="input-field input-field-disabled" 
                      value={editStudentForm.studentCode}
                      onChange={(e) => handleEditStudentInputChange('studentCode', e.target.value)}
                      placeholder="Nhập mã sinh viên"
                      disabled
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input 
                      type="email" 
                      className="input-field input-field-disabled" 
                      value={editStudentForm.email}
                      onChange={(e) => handleEditStudentInputChange('email', e.target.value)}
                      placeholder="Nhập email"
                      disabled
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                    <input 
                      type="tel" 
                      className="input-field input-field-disabled" 
                      value={editStudentForm.phone}
                      onChange={(e) => handleEditStudentInputChange('phone', e.target.value)}
                      placeholder="Nhập số điện thoại"
                      disabled
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Ngày sinh</label>
                    <input 
                      type="date" 
                      className="input-field input-field-disabled" 
                      value={editStudentForm.dob}
                      onChange={(e) => handleEditStudentInputChange('dob', e.target.value)}
                      disabled
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Giới tính</label>
                    <select
                      className="input-field input-field-disabled"
                      value={editStudentForm.gender}
                      onChange={(e) => handleEditStudentInputChange('gender', e.target.value)}
                      disabled
                    >
                      <option value="male">Nam</option>
                      <option value="female">Nữ</option>
                      <option value="other">Khác</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Lớp</label>
                    <select
                      className="input-field input-field-editable"
                      value={editStudentForm.className}
                      onChange={(e) => handleEditStudentInputChange('className', e.target.value)}
                      disabled={classOptionsLoading}
                    >
                      <option value="">Chọn lớp</option>
                      {classOptions.map((cls) => (
                        <option
                          key={cls.id}
                          value={cls.classCode || cls.className}
                        >
                          {cls.classCode || cls.className}
                        </option>
                      ))}
                    </select>
                    {editStudentErrors.className && (
                      <p className="mt-1 text-sm text-red-600">{editStudentErrors.className}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Khóa học</label>
                    <select
                      className="input-field input-field-editable"
                      value={editStudentForm.courseYear}
                      onChange={(e) => handleEditStudentInputChange('courseYear', e.target.value)}
                      disabled={courseOptionsLoading}
                    >
                      <option value="">Chọn khóa</option>
                      {courseOptions.map((course) => (
                        <option key={course} value={course}>
                          {`Khóa ${course}`}
                        </option>
                      ))}
                    </select>
                    {editStudentErrors.courseYear && (
                      <p className="mt-1 text-sm text-red-600">{editStudentErrors.courseYear}</p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Địa chỉ</label>
                  <textarea 
                    className="input-field input-field-editable" 
                    rows="3" 
                    value={editStudentForm.address}
                    onChange={(e) => handleEditStudentInputChange('address', e.target.value)}
                    placeholder="Nhập địa chỉ"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                  <select
                    className="input-field input-field-disabled"
                    value={editStudentForm.isActive ? 'active' : 'inactive'}
                    onChange={(e) => handleEditStudentInputChange('isActive', e.target.value === 'active')}
                    disabled
                  >
                    <option value="active">Đang học</option>
                    <option value="inactive">Nghỉ học</option>
                  </select>
                </div>
                {editSubmitError && (
                  <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
                    {editSubmitError}
                  </div>
                )}
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={closeAllModals}
                    className="btn-secondary"
                  >
                    Hủy
                  </button>
                  <button type="submit" className="btn-primary" disabled={isUpdating}>
                    {isUpdating ? 'Đang cập nhật...' : 'Cập nhật'}
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
