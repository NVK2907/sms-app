import React, { useState } from 'react';
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

const SubjectClassManagement = () => {
  const [activeTab, setActiveTab] = useState('subjects');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddSubjectModal, setShowAddSubjectModal] = useState(false);
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Mock data for subjects
  const subjects = [
    {
      id: 1,
      subjectCode: 'MATH001',
      subjectName: 'Toán học',
      description: 'Môn học cơ bản về toán học',
      credits: 3,
      semester: 'Học kỳ 1',
      status: 'active',
      teacher: 'Nguyễn Thị Minh',
      classes: ['10A1', '10A2', '11A1']
    },
    {
      id: 2,
      subjectCode: 'PHYS001',
      subjectName: 'Vật lý',
      description: 'Môn học về các hiện tượng vật lý',
      credits: 2,
      semester: 'Học kỳ 1',
      status: 'active',
      teacher: 'Trần Văn Hùng',
      classes: ['10A1', '10A2']
    },
    {
      id: 3,
      subjectCode: 'CHEM001',
      subjectName: 'Hóa học',
      description: 'Môn học về các phản ứng hóa học',
      credits: 2,
      semester: 'Học kỳ 2',
      status: 'active',
      teacher: 'Lê Thị Lan',
      classes: ['11A1', '11A2']
    }
  ];

  // Mock data for classes
  const classes = [
    {
      id: 1,
      className: '10A1',
      grade: '10',
      academicYear: '2023-2024',
      homeroomTeacher: 'Nguyễn Thị Minh',
      studentCount: 35,
      maxStudents: 40,
      status: 'active',
      subjects: ['Toán học', 'Vật lý', 'Hóa học', 'Ngữ văn'],
      schedule: 'Thứ 2-6, 7:00-11:30'
    },
    {
      id: 2,
      className: '10A2',
      grade: '10',
      academicYear: '2023-2024',
      homeroomTeacher: 'Trần Văn Hùng',
      studentCount: 32,
      maxStudents: 40,
      status: 'active',
      subjects: ['Toán học', 'Vật lý', 'Sinh học', 'Ngữ văn'],
      schedule: 'Thứ 2-6, 7:00-11:30'
    },
    {
      id: 3,
      className: '11A1',
      grade: '11',
      academicYear: '2023-2024',
      homeroomTeacher: 'Lê Thị Lan',
      studentCount: 38,
      maxStudents: 40,
      status: 'active',
      subjects: ['Toán học', 'Hóa học', 'Sinh học', 'Ngữ văn'],
      schedule: 'Thứ 2-6, 7:00-11:30'
    }
  ];

  const teachers = ['Nguyễn Thị Minh', 'Trần Văn Hùng', 'Lê Thị Lan', 'Phạm Văn Đức'];
  const semesters = ['Học kỳ 1', 'Học kỳ 2', 'Học kỳ hè'];
  const grades = ['10', '11', '12'];

  const filteredSubjects = subjects.filter(subject =>
    subject.subjectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.subjectCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredClasses = classes.filter(cls =>
    cls.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.homeroomTeacher.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadgeColor = (status) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-800';
  };

  const handleEditItem = (item) => {
    setSelectedItem(item);
    setShowEditModal(true);
  };

  const handleDeleteItem = (item, type) => {
    const itemName = type === 'subject' ? item.subjectName : item.className;
    if (window.confirm(`Bạn có chắc chắn muốn xóa ${type === 'subject' ? 'môn học' : 'lớp học'} ${itemName}?`)) {
      console.log(`Delete ${type}:`, item.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý môn học & lớp học</h1>
          <p className="mt-1 text-sm text-gray-500">
            Quản lý môn học, lớp học và phân công giảng dạy
          </p>
        </div>
        <div className="flex space-x-3">
          {activeTab === 'subjects' ? (
            <button
              onClick={() => setShowAddSubjectModal(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <BookOpenIcon className="h-5 w-5" />
              <span>Thêm môn học</span>
            </button>
          ) : (
            <button
              onClick={() => setShowAddClassModal(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <AcademicCapIcon className="h-5 w-5" />
              <span>Thêm lớp học</span>
            </button>
          )}
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

      {/* Search */}
      <div className="card">
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

      {/* Subjects Tab */}
      {activeTab === 'subjects' && (
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
                    Giáo viên & Lớp
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
                {filteredSubjects.map((subject) => (
                  <tr key={subject.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <BookOpenIcon className="h-8 w-8 text-primary-500 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {subject.subjectName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {subject.subjectCode}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{subject.description}</div>
                      <div className="text-sm text-gray-500">
                        {subject.credits} tín chỉ • {subject.semester}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{subject.teacher}</div>
                      <div className="text-sm text-gray-500">
                        {subject.classes.join(', ')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(subject.status)}`}>
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
                          onClick={() => handleDeleteItem(subject, 'subject')}
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

      {/* Classes Tab */}
      {activeTab === 'classes' && (
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
                    Giáo viên chủ nhiệm
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sĩ số
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
                {filteredClasses.map((cls) => (
                  <tr key={cls.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <AcademicCapIcon className="h-8 w-8 text-primary-500 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {cls.className}
                          </div>
                          <div className="text-sm text-gray-500">
                            Khối {cls.grade} • {cls.academicYear}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {cls.subjects.join(', ')}
                      </div>
                      <div className="text-sm text-gray-500">
                        {cls.schedule}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <UserGroupIcon className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{cls.homeroomTeacher}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {cls.studentCount}/{cls.maxStudents}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary-600 h-2 rounded-full" 
                          style={{ width: `${(cls.studentCount / cls.maxStudents) * 100}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(cls.status)}`}>
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
                          onClick={() => handleDeleteItem(cls, 'class')}
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

      {/* Add Subject Modal */}
      {showAddSubjectModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Thêm môn học mới</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tên môn học</label>
                  <input type="text" className="input-field" placeholder="Nhập tên môn học" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Mã môn học</label>
                  <input type="text" className="input-field" placeholder="Nhập mã môn học" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Mô tả</label>
                  <textarea className="input-field" rows="3" placeholder="Nhập mô tả môn học"></textarea>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Số tín chỉ</label>
                    <input type="number" className="input-field" placeholder="3" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Học kỳ</label>
                    <select className="input-field">
                      {semesters.map(semester => (
                        <option key={semester} value={semester}>{semester}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Giáo viên phụ trách</label>
                  <select className="input-field">
                    {teachers.map(teacher => (
                      <option key={teacher} value={teacher}>{teacher}</option>
                    ))}
                  </select>
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
        </div>
      )}

      {/* Add Class Modal */}
      {showAddClassModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Thêm lớp học mới</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tên lớp</label>
                  <input type="text" className="input-field" placeholder="Ví dụ: 10A1" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Khối</label>
                    <select className="input-field">
                      {grades.map(grade => (
                        <option key={grade} value={grade}>{grade}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Năm học</label>
                    <input type="text" className="input-field" placeholder="2023-2024" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Giáo viên chủ nhiệm</label>
                  <select className="input-field">
                    {teachers.map(teacher => (
                      <option key={teacher} value={teacher}>{teacher}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Sĩ số tối đa</label>
                  <input type="number" className="input-field" placeholder="40" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Lịch học</label>
                  <input type="text" className="input-field" placeholder="Thứ 2-6, 7:00-11:30" />
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
        </div>
      )}
    </div>
  );
};

export default SubjectClassManagement;
