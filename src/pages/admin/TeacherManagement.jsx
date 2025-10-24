import React, { useState, useEffect } from 'react';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  UserIcon,
  AcademicCapIcon,
  BookOpenIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { teacherService } from '../../services/teacherService';
import Pagination from '../../components/Pagination';

const TeacherManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0
  });

  // Load teachers data
  const loadTeachers = async (page = 0, size = 10) => {
    setLoading(true);
    try {
      const response = await teacherService.getAllTeachers(page, size);
      console.log('Teacher API Response:', response); // Debug log
      if (response.success) {
        setTeachers(response.data.teachers || []);
        setPagination({
          page: response.data.currentPage || 0,
          size: response.data.pageSize || 10,
          totalElements: response.data.totalElements || 0,
          totalPages: response.data.totalPages || 0
        });
      } else {
        console.error('Teacher API returned success: false', response.message);
      }
    } catch (error) {
      console.error('Lỗi khi tải danh sách giáo viên:', error);
      setTeachers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeachers();
  }, []);

  // Filter teachers based on search term and subject
  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = !searchTerm || 
                         teacher.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.teacherCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === 'all' || 
                          teacher.subjects?.some(subject => subject.subjectName === selectedSubject);
    return matchesSearch && matchesSubject;
  });

  const getStatusBadgeColor = (status) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-800';
  };

  const getGenderText = (gender) => {
    return gender === 'male' ? 'Nam' : 'Nữ';
  };

  const handleViewTeacher = (teacher) => {
    setSelectedTeacher(teacher);
    setShowViewModal(true);
  };

  const handleEditTeacher = (teacher) => {
    setSelectedTeacher(teacher);
    setShowEditModal(true);
  };

  const handleDeleteTeacher = (teacher) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa giáo viên ${teacher.fullName}?`)) {
      console.log('Delete teacher:', teacher.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý giáo viên</h1>
          <p className="mt-1 text-sm text-gray-500">
            Quản lý thông tin giáo viên và phân công môn học
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <UserIcon className="h-5 w-5" />
          <span>Thêm giáo viên</span>
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, mã GV hoặc email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="input-field"
            >
              <option value="all">Tất cả môn học</option>
              {Array.from(new Set(teachers.flatMap(t => t.subjects?.map(s => s.subjectName) || []))).map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Teachers Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Giáo viên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thông tin liên hệ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Môn dạy & Lớp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trình độ & Kinh nghiệm
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
                  <td colSpan="6" className="px-6 py-4 text-center">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                      <span className="ml-2 text-gray-500">Đang tải...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredTeachers.length > 0 ? (
                filteredTeachers.map((teacher) => (
                  <tr key={teacher.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">
                              {teacher.fullName?.split(' ').map(n => n[0]).join('') || 'T'}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {teacher.fullName || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {teacher.teacherCode || 'N/A'}
                          </div>
                          <div className="text-xs text-gray-400">
                            {getGenderText(teacher.gender)} • {teacher.dob ? new Date(teacher.dob).toLocaleDateString('vi-VN') : 'N/A'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{teacher.email || 'N/A'}</div>
                      <div className="text-sm text-gray-500">{teacher.phone || 'N/A'}</div>
                      <div className="text-xs text-gray-400 truncate max-w-xs">{teacher.address || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-1">
                          <BookOpenIcon className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-900">
                            {teacher.subjects?.map(s => s.subjectName).join(', ') || 'Chưa có môn'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <AcademicCapIcon className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-500">
                            {teacher.classes?.join(', ') || 'Chưa có lớp'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{teacher.qualification || 'N/A'}</div>
                      <div className="text-sm text-gray-500">{teacher.experience || 'N/A'}</div>
                      <div className="text-xs text-gray-400">
                        Tuyển dụng: {teacher.hireDate ? new Date(teacher.hireDate).toLocaleDateString('vi-VN') : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(teacher.isActive)}`}>
                        {teacher.isActive ? 'Đang dạy' : 'Nghỉ việc'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button 
                          onClick={() => handleViewTeacher(teacher)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Xem chi tiết"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleEditTeacher(teacher)}
                          className="text-yellow-600 hover:text-yellow-900"
                          title="Chỉnh sửa"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteTeacher(teacher)}
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
                    {teachers.length === 0 ? 'Không có dữ liệu giáo viên' : 'Không tìm thấy giáo viên nào phù hợp với bộ lọc'}
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
        onPageChange={(page) => loadTeachers(page, pagination.size)}
        itemName="giáo viên"
      />

      {/* Add Teacher Modal */}
      {showAddModal && (
        <div className={`fixed inset-0 bg-gray-800/10 backdrop-blur-[2px] flex items-center justify-center z-50 transition-opacity duration-300 ${showAddModal ? 'opacity-100' : 'opacity-0'}`}>
          <div className="relative p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Thêm giáo viên mới</h3>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Họ và tên</label>
                    <input type="text" className="input-field" placeholder="Nhập họ và tên" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Mã giáo viên</label>
                    <input type="text" className="input-field" placeholder="Nhập mã giáo viên" />
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
                    <label className="block text-sm font-medium text-gray-700">Trình độ</label>
                    <input type="text" className="input-field" placeholder="Nhập trình độ học vấn" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Kinh nghiệm</label>
                    <input type="text" className="input-field" placeholder="Ví dụ: 5 năm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Ngày tuyển dụng</label>
                    <input type="date" className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Môn dạy</label>
                    <select multiple className="input-field">
                      <option value="Toán">Toán</option>
                      <option value="Lý">Lý</option>
                      <option value="Hóa">Hóa</option>
                      <option value="Sinh">Sinh</option>
                      <option value="Văn">Văn</option>
                      <option value="Sử">Sử</option>
                      <option value="Địa">Địa</option>
                      <option value="Anh">Anh</option>
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
                    onClick={() => setShowAddModal(false)}
                    className="btn-secondary"
                  >
                    Hủy
                  </button>
                  <button type="submit" className="btn-primary">
                    Thêm giáo viên
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Teacher Modal */}
      {showEditModal && selectedTeacher && (
        <div className={`fixed inset-0 bg-gray-800/10 backdrop-blur-[2px] flex items-center justify-center z-50 transition-opacity duration-300 ${showEditModal ? 'opacity-100' : 'opacity-0'}`}>
          <div className="relative p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Chỉnh sửa thông tin giáo viên</h3>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Họ và tên</label>
                    <input 
                      type="text" 
                      className="input-field" 
                      defaultValue={selectedTeacher.fullName}
                      placeholder="Nhập họ và tên" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Mã giáo viên</label>
                    <input 
                      type="text" 
                      className="input-field" 
                      defaultValue={selectedTeacher.teacherCode}
                      placeholder="Nhập mã giáo viên" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input 
                      type="email" 
                      className="input-field" 
                      defaultValue={selectedTeacher.email}
                      placeholder="Nhập email" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                    <input 
                      type="tel" 
                      className="input-field" 
                      defaultValue={selectedTeacher.phone}
                      placeholder="Nhập số điện thoại" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Ngày sinh</label>
                    <input 
                      type="date" 
                      className="input-field" 
                      defaultValue={selectedTeacher.dateOfBirth}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Giới tính</label>
                    <select className="input-field" defaultValue={selectedTeacher.gender}>
                      <option value="male">Nam</option>
                      <option value="female">Nữ</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Trình độ</label>
                    <input 
                      type="text" 
                      className="input-field" 
                      defaultValue={selectedTeacher.qualification}
                      placeholder="Nhập trình độ học vấn" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Kinh nghiệm</label>
                    <input 
                      type="text" 
                      className="input-field" 
                      defaultValue={selectedTeacher.experience}
                      placeholder="Ví dụ: 5 năm" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Ngày tuyển dụng</label>
                    <input 
                      type="date" 
                      className="input-field" 
                      defaultValue={selectedTeacher.hireDate}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Môn dạy</label>
                    <select multiple className="input-field">
                      <option value="Toán">Toán</option>
                      <option value="Lý">Lý</option>
                      <option value="Hóa">Hóa</option>
                      <option value="Sinh">Sinh</option>
                      <option value="Văn">Văn</option>
                      <option value="Sử">Sử</option>
                      <option value="Địa">Địa</option>
                      <option value="Anh">Anh</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Địa chỉ</label>
                  <textarea 
                    className="input-field" 
                    rows="3" 
                    defaultValue={selectedTeacher.address}
                    placeholder="Nhập địa chỉ"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                  <select className="input-field" defaultValue={selectedTeacher.status}>
                    <option value="active">Đang dạy</option>
                    <option value="inactive">Nghỉ việc</option>
                  </select>
                </div>
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
        </div>
      )}

      {/* View Teacher Details Modal */}
      {showViewModal && selectedTeacher && (
        <div className={`fixed inset-0 bg-gray-800/10 backdrop-blur-[2px] flex items-center justify-center z-50 transition-opacity duration-300 ${showViewModal ? 'opacity-100' : 'opacity-0'}`}>
          <div className="relative p-6 border w-full max-w-4xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Chi tiết giáo viên</h3>
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
                      <p className="mt-1 text-sm text-gray-900">{selectedTeacher.fullName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Mã giáo viên</label>
                      <p className="mt-1 text-sm text-gray-900 font-mono">{selectedTeacher.teacherCode}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Ngày sinh</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedTeacher.dob ? new Date(selectedTeacher.dob).toLocaleDateString('vi-VN') : 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Giới tính</label>
                      <p className="mt-1 text-sm text-gray-900">{getGenderText(selectedTeacher.gender)}</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-500">Địa chỉ</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedTeacher.address}</p>
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
                      <p className="mt-1 text-sm text-gray-900">{selectedTeacher.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Số điện thoại</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedTeacher.phone}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <AcademicCapIcon className="h-5 w-5 mr-2" />
                    Thông tin nghề nghiệp
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Trình độ</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedTeacher.qualification}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Kinh nghiệm</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedTeacher.experience}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Ngày tuyển dụng</label>
                      <p className="mt-1 text-sm text-gray-900 flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        {selectedTeacher.hireDate ? new Date(selectedTeacher.hireDate).toLocaleDateString('vi-VN') : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Trạng thái</label>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(selectedTeacher.isActive)}`}>
                        {selectedTeacher.isActive ? 'Đang dạy' : 'Nghỉ việc'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <BookOpenIcon className="h-5 w-5 mr-2" />
                    Môn dạy & Lớp
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Môn dạy</label>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {selectedTeacher.subjects?.map((subject, index) => (
                          <span key={index} className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                            {subject.subjectName || subject}
                          </span>
                        )) || <span className="text-gray-400 text-sm">Chưa có môn</span>}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Lớp dạy</label>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {selectedTeacher.classes?.map((cls, index) => (
                          <span key={index} className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                            {cls}
                          </span>
                        )) || <span className="text-gray-400 text-sm">Chưa có lớp</span>}
                      </div>
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
                        {selectedTeacher.fullName?.split(' ').map(n => n[0]).join('') || 'T'}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">{selectedTeacher.fullName}</h3>
                  <p className="text-sm text-gray-500">{selectedTeacher.teacherCode}</p>
                  <div className="mt-4">
                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusBadgeColor(selectedTeacher.isActive)}`}>
                      {selectedTeacher.isActive ? 'Đang dạy' : 'Nghỉ việc'}
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Thống kê</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Thời gian làm việc:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {selectedTeacher.hireDate ? Math.floor((new Date() - new Date(selectedTeacher.hireDate)) / (1000 * 60 * 60 * 24 * 30)) : 0} tháng
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Tuổi:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {selectedTeacher.dob ? new Date().getFullYear() - new Date(selectedTeacher.dob).getFullYear() : 'N/A'} tuổi
                      </span>
                    </div>
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
                  handleEditTeacher(selectedTeacher);
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

export default TeacherManagement;
