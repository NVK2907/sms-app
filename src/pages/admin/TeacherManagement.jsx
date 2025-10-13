import React, { useState } from 'react';
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

const TeacherManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  // Mock data
  const teachers = [
    {
      id: 1,
      teacherCode: 'GV001',
      fullName: 'Nguyễn Thị Minh',
      email: 'minh.nguyen@sms.com',
      phone: '0123456789',
      dateOfBirth: '1985-05-15',
      gender: 'female',
      address: '123 Đường ABC, Quận 1, TP.HCM',
      subjects: ['Toán học', 'Vật lý'],
      classes: ['10A1', '10A2'],
      status: 'active',
      hireDate: '2020-09-01',
      qualification: 'Thạc sĩ Toán học',
      experience: '5 năm'
    },
    {
      id: 2,
      teacherCode: 'GV002',
      fullName: 'Trần Văn Hùng',
      email: 'hung.tran@sms.com',
      phone: '0987654321',
      dateOfBirth: '1980-08-22',
      gender: 'male',
      address: '456 Đường XYZ, Quận 2, TP.HCM',
      subjects: ['Hóa học', 'Sinh học'],
      classes: ['11A1', '11A2'],
      status: 'active',
      hireDate: '2018-09-01',
      qualification: 'Tiến sĩ Hóa học',
      experience: '7 năm'
    },
    {
      id: 3,
      teacherCode: 'GV003',
      fullName: 'Lê Thị Lan',
      email: 'lan.le@sms.com',
      phone: '0369852147',
      dateOfBirth: '1988-12-08',
      gender: 'female',
      address: '789 Đường DEF, Quận 3, TP.HCM',
      subjects: ['Ngữ văn', 'Lịch sử'],
      classes: ['12A1', '12A2'],
      status: 'active',
      hireDate: '2021-09-01',
      qualification: 'Thạc sĩ Ngữ văn',
      experience: '3 năm'
    },
    {
      id: 4,
      teacherCode: 'GV004',
      fullName: 'Phạm Văn Đức',
      email: 'duc.pham@sms.com',
      phone: '0741852963',
      dateOfBirth: '1975-03-30',
      gender: 'male',
      address: '321 Đường GHI, Quận 4, TP.HCM',
      subjects: ['Tiếng Anh'],
      classes: ['10A1', '11A1', '12A1'],
      status: 'inactive',
      hireDate: '2015-09-01',
      qualification: 'Cử nhân Tiếng Anh',
      experience: '9 năm'
    }
  ];

  const subjects = ['Toán học', 'Vật lý', 'Hóa học', 'Sinh học', 'Ngữ văn', 'Lịch sử', 'Địa lý', 'Tiếng Anh', 'Tin học'];

  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = teacher.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.teacherCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === 'all' || teacher.subjects.includes(selectedSubject);
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
              {subjects.map(subject => (
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
              {filteredTeachers.map((teacher) => (
                <tr key={teacher.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {teacher.fullName.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {teacher.fullName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {teacher.teacherCode}
                        </div>
                        <div className="text-xs text-gray-400">
                          {getGenderText(teacher.gender)} • {new Date(teacher.dateOfBirth).toLocaleDateString('vi-VN')}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{teacher.email}</div>
                    <div className="text-sm text-gray-500">{teacher.phone}</div>
                    <div className="text-xs text-gray-400 truncate max-w-xs">{teacher.address}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1">
                        <BookOpenIcon className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-900">
                          {teacher.subjects.join(', ')}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <AcademicCapIcon className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-500">
                          {teacher.classes.join(', ')}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{teacher.qualification}</div>
                    <div className="text-sm text-gray-500">{teacher.experience}</div>
                    <div className="text-xs text-gray-400">
                      Tuyển dụng: {new Date(teacher.hireDate).toLocaleDateString('vi-VN')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(teacher.status)}`}>
                      {teacher.status === 'active' ? 'Đang dạy' : 'Nghỉ việc'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button 
                        onClick={() => handleEditTeacher(teacher)}
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
              ))}
            </tbody>
          </table>
        </div>

        {filteredTeachers.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">Không tìm thấy giáo viên nào</p>
          </div>
        )}
      </div>

      {/* Add Teacher Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
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
                      {subjects.map(subject => (
                        <option key={subject} value={subject}>{subject}</option>
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
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
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
                      {subjects.map(subject => (
                        <option 
                          key={subject} 
                          value={subject}
                          selected={selectedTeacher.subjects.includes(subject)}
                        >
                          {subject}
                        </option>
                      ))}
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
    </div>
  );
};

export default TeacherManagement;
