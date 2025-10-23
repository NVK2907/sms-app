import React, { useState, useEffect } from 'react';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { userService } from '../../services/userService';

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0
  });

  // Load users data
  const loadUsers = async (page = 0, size = 10) => {
    setLoading(true);
    try {
      const response = await userService.getAllUsers(page, size);
      console.log('API Response:', response); // Debug log
      if (response.success) {
        setUsers(response.data.users || []);
        setPagination({
          page: response.data.currentPage || 0,
          size: response.data.pageSize || 10,
          totalElements: response.data.totalElements || 0,
          totalPages: response.data.totalPages || 0
        });
      } else {
        console.error('API returned success: false', response.message);
      }
    } catch (error) {
      console.error('Lỗi khi tải danh sách người dùng:', error);
      // Set empty state on error
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Search users
  const searchUsers = async (keyword, page = 0, size = 10) => {
    setLoading(true);
    try {
      const response = await userService.searchUsers(keyword, page, size);
      if (response.success) {
        setUsers(response.data.users || []);
        setPagination({
          page: response.data.currentPage || 0,
          size: response.data.pageSize || 10,
          totalElements: response.data.totalElements || 0,
          totalPages: response.data.totalPages || 0
        });
      }
    } catch (error) {
      console.error('Lỗi khi tìm kiếm người dùng:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Filter users based on search term and role
  const filteredUsers = users.filter(user => {
    const matchesSearch = !searchTerm || 
                         user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.username?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || 
                       user.roles?.some(role => role.roleName?.toLowerCase() === selectedRole);
    return matchesSearch && matchesRole;
  });

  // Debug log to check users data
  console.log('Users data:', users);
  console.log('Filtered users:', filteredUsers);

  const getRoleBadgeColor = (roleName) => {
    switch (roleName?.toLowerCase()) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'teacher': return 'bg-blue-100 text-blue-800';
      case 'student': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadgeColor = (isActive) => {
    return isActive 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-800';
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleResetPassword = (user) => {
    setSelectedUser(user);
    setNewPassword('');
    setShowResetPasswordModal(true);
  };

  const handleToggleUserStatus = async (user) => {
    try {
      await userService.changeUserStatus(user.id, { isActive: !user.isActive });
      loadUsers(pagination.page, pagination.size);
    } catch (error) {
      console.error('Lỗi khi thay đổi trạng thái người dùng:', error);
    }
  };

  const handleDeleteUser = async (user) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa người dùng ${user.fullName}?`)) {
      try {
        await userService.deleteUser(user.id);
        loadUsers(pagination.page, pagination.size);
      } catch (error) {
        console.error('Lỗi khi xóa người dùng:', error);
      }
    }
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      searchUsers(searchTerm.trim());
    } else {
      loadUsers();
    }
  };

  const handleCreateUser = async (userData) => {
    try {
      await userService.createUser(userData);
      setShowAddModal(false);
      loadUsers();
    } catch (error) {
      console.error('Lỗi khi tạo người dùng:', error);
    }
  };

  const handleUpdateUser = async (userId, userData) => {
    try {
      await userService.updateUser(userId, userData);
      setShowEditModal(false);
      loadUsers();
    } catch (error) {
      console.error('Lỗi khi cập nhật người dùng:', error);
    }
  };

  const handleResetPasswordSubmit = async () => {
    try {
      await userService.resetPassword(selectedUser.id, { newPassword });
      setShowResetPasswordModal(false);
      setNewPassword('');
    } catch (error) {
      console.error('Lỗi khi đặt lại mật khẩu:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý người dùng</h1>
          <p className="mt-1 text-sm text-gray-500">
            Quản lý tài khoản học sinh, giáo viên và quản trị viên
          </p>
          {users.length > 0 && (
            <p className="mt-1 text-xs text-blue-600">
              Tổng: {users.length} người dùng | Hiển thị: {filteredUsers.length} người dùng
            </p>
          )}
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <UserIcon className="h-5 w-5" />
          <span>Thêm người dùng</span>
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
                placeholder="Tìm kiếm theo tên, email hoặc username..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="input-field"
            >
              <option value="all">Tất cả vai trò</option>
              <option value="admin">Quản trị viên</option>
              <option value="teacher">Giáo viên</option>
              <option value="student">Học sinh</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Người dùng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vai trò
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày tạo
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
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">
                              {user.fullName?.split(' ').map(n => n[0]).join('') || 'U'}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.fullName || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email || 'N/A'}
                          </div>
                          <div className="text-xs text-gray-400">
                            @{user.username || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.roles && user.roles.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {user.roles.map((role, index) => (
                            <span 
                              key={index}
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(role.roleName)}`}
                            >
                              {role.roleName === 'ADMIN' ? 'Quản trị viên' : 
                               role.roleName === 'TEACHER' ? 'Giáo viên' : 
                               role.roleName === 'STUDENT' ? 'Học sinh' : 
                               role.roleName === 'admin' ? 'Quản trị viên' :
                               role.roleName === 'teacher' ? 'Giáo viên' :
                               role.roleName === 'student' ? 'Học sinh' : role.roleName}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">Chưa có vai trò</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(user.isActive)}`}>
                        {user.isActive ? 'Hoạt động' : 'Không hoạt động'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button 
                          onClick={() => handleViewUser(user)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Xem chi tiết"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleEditUser(user)}
                          className="text-yellow-600 hover:text-yellow-900"
                          title="Chỉnh sửa"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleResetPassword(user)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Đặt lại mật khẩu"
                        >
                          🔑
                        </button>
                        <button 
                          onClick={() => handleToggleUserStatus(user)}
                          className={`${user.isActive ? 'text-orange-600 hover:text-orange-900' : 'text-green-600 hover:text-green-900'}`}
                          title={user.isActive ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                        >
                          {user.isActive ? '🔒' : '🔓'}
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(user)}
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
                    {users.length === 0 ? 'Không có dữ liệu người dùng' : 'Không tìm thấy người dùng nào phù hợp với bộ lọc'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Thêm người dùng mới</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Họ và tên</label>
                  <input type="text" className="input-field" placeholder="Nhập họ và tên" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Username</label>
                  <input type="text" className="input-field" placeholder="Nhập username" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input type="email" className="input-field" placeholder="Nhập email" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Vai trò</label>
                  <select className="input-field">
                    <option value="student">Học sinh</option>
                    <option value="teacher">Giáo viên</option>
                    <option value="admin">Quản trị viên</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
                  <input type="password" className="input-field" placeholder="Nhập mật khẩu" />
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
                    Thêm
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Chỉnh sửa người dùng</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Họ và tên</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    defaultValue={selectedUser.fullName}
                    placeholder="Nhập họ và tên" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Username</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    defaultValue={selectedUser.username}
                    placeholder="Nhập username" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input 
                    type="email" 
                    className="input-field" 
                    defaultValue={selectedUser.email}
                    placeholder="Nhập email" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Vai trò</label>
                  <select className="input-field" defaultValue={selectedUser.role}>
                    <option value="student">Học sinh</option>
                    <option value="teacher">Giáo viên</option>
                    <option value="admin">Quản trị viên</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                  <select className="input-field" defaultValue={selectedUser.status}>
                    <option value="active">Hoạt động</option>
                    <option value="inactive">Không hoạt động</option>
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

      {/* Reset Password Modal */}
      {showResetPasswordModal && selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Đặt lại mật khẩu</h3>
              <p className="text-sm text-gray-600 mb-4">
                Đặt lại mật khẩu cho: <strong>{selectedUser.fullName}</strong>
              </p>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Mật khẩu mới</label>
                  <input 
                    type="password" 
                    className="input-field" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Nhập mật khẩu mới" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Xác nhận mật khẩu</label>
                  <input 
                    type="password" 
                    className="input-field" 
                    placeholder="Nhập lại mật khẩu mới" 
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowResetPasswordModal(false)}
                    className="btn-secondary"
                  >
                    Hủy
                  </button>
                  <button type="submit" className="btn-primary">
                    Đặt lại mật khẩu
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

       {/* View User Details Popup */}
       {showViewModal && selectedUser && (
         <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
           <div 
             className="absolute inset-0" 
             onClick={() => setShowViewModal(false)}
           ></div>
           <div className="relative p-6 border w-96 shadow-lg rounded-md bg-white z-10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Chi tiết người dùng</h3>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Avatar và thông tin cơ bản */}
            <div className="text-center mb-6">
              <div className="flex justify-center mb-3">
                <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-xl font-bold text-indigo-600">
                    {selectedUser.fullName?.split(' ').map(n => n[0]).join('') || 'U'}
                  </span>
                </div>
              </div>
              <h4 className="text-lg font-medium text-gray-900">{selectedUser.fullName || 'N/A'}</h4>
              <p className="text-sm text-gray-500">@{selectedUser.username || 'N/A'}</p>
              <div className="mt-2">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(selectedUser.isActive)}`}>
                  {selectedUser.isActive ? 'Hoạt động' : 'Không hoạt động'}
                </span>
              </div>
            </div>

            {/* Thông tin chi tiết */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-500">Email:</span>
                <span className="text-sm text-gray-900">{selectedUser.email || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-500">Số điện thoại:</span>
                <span className="text-sm text-gray-900">{selectedUser.phone || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-500">Ngày tạo:</span>
                <span className="text-sm text-gray-900">
                  {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm font-medium text-gray-500">Vai trò:</span>
                <div className="flex flex-wrap gap-1">
                  {selectedUser.roles && selectedUser.roles.length > 0 ? (
                    selectedUser.roles.map((role, index) => (
                      <span 
                        key={index}
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(role.roleName)}`}
                      >
                        {role.roleName === 'ADMIN' ? 'Admin' : 
                         role.roleName === 'TEACHER' ? 'Teacher' : 
                         role.roleName === 'STUDENT' ? 'Student' : 
                         role.roleName === 'admin' ? 'Admin' :
                         role.roleName === 'teacher' ? 'Teacher' :
                         role.roleName === 'student' ? 'Student' : role.roleName}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-400 text-xs">Chưa có vai trò</span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Đóng
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowViewModal(false);
                  handleEditUser(selectedUser);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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

export default UserManagement;
