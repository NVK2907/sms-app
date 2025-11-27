import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { userService } from '../../services/userService';
import Pagination from '../../components/Pagination';

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0
  });
  const [newUserForm, setNewUserForm] = useState({
    fullName: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    roleKey: 'student'
  });
  const [newUserErrors, setNewUserErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editUserForm, setEditUserForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    roleKey: 'student',
    isActive: true
  });
  const [editUserErrors, setEditUserErrors] = useState({});
  const [editSubmitError, setEditSubmitError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [resetPasswordForm, setResetPasswordForm] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [resetPasswordErrors, setResetPasswordErrors] = useState({});
  const [resetSubmitError, setResetSubmitError] = useState(null);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [notification, setNotification] = useState(null);
  const notificationTimeoutRef = useRef(null);

  const showNotification = (type, message) => {
    if (notificationTimeoutRef.current) {
      clearTimeout(notificationTimeoutRef.current);
    }
    setNotification({ type, message });
    notificationTimeoutRef.current = setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  useEffect(() => {
    return () => {
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current);
      }
    };
  }, []);

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

  const roleOptions = useMemo(() => {
    const baseOptions = {
      admin: { key: 'admin', label: 'Quản trị viên', id: null },
      teacher: { key: 'teacher', label: 'Giáo viên', id: null },
      student: { key: 'student', label: 'Học sinh', id: null }
    };

    users.forEach(user => {
      user.roles?.forEach(role => {
        if (!role?.roleName) {
          return;
        }
        const normalizedRole = role.roleName.toLowerCase();
        if (baseOptions[normalizedRole] && role.id) {
          baseOptions[normalizedRole] = {
            ...baseOptions[normalizedRole],
            id: role.id,
            roleName: role.roleName
          };
        }
      });
    });

    return baseOptions;
  }, [users]);

  // Filter users based on role only (search is handled by API)
  const filteredUsers = users.filter(user => {
    const matchesRole = selectedRole === 'all' || 
                       user.roles?.some(role => role.roleName?.toLowerCase() === selectedRole);
    return matchesRole;
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
    setEditUserForm({
      fullName: user.fullName || '',
      email: user.email || '',
      phone: user.phone || '',
      roleKey:
        user.roles?.find((role) => ['admin', 'teacher', 'student'].includes(role.roleName?.toLowerCase()))
          ?.roleName?.toLowerCase() || 'student',
      isActive: user.isActive ?? true
    });
    setEditUserErrors({});
    setEditSubmitError(null);
    setShowEditModal(true);
  };

  const handleResetPassword = (user) => {
    setSelectedUser(user);
    setResetPasswordForm({ newPassword: '', confirmPassword: '' });
    setResetPasswordErrors({});
    setResetSubmitError(null);
    setShowResetPasswordModal(true);
  };

  const handleToggleUserStatus = async (user) => {
    try {
      await userService.changeUserStatus(user.id, { isActive: !user.isActive });
      showNotification(
        'success',
        user.isActive ? 'Đã khóa tài khoản người dùng.' : 'Đã mở khóa tài khoản người dùng.'
      );
      loadUsers(pagination.page, pagination.size);
    } catch (error) {
      console.error('Lỗi khi thay đổi trạng thái người dùng:', error);
      const message = error?.message || error?.error || error?.details || error?.response?.message;
      const fallback = 'Không thể thay đổi trạng thái người dùng. Vui lòng thử lại.';
      const resolvedMessage =
        typeof message === 'string' && message.trim().length > 0 ? message : fallback;
      showNotification('error', resolvedMessage);
    }
  };

  const handleDeleteUser = async (user) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa người dùng ${user.fullName}?`)) {
      try {
        await userService.deleteUser(user.id);
        showNotification('success', 'Xóa người dùng thành công.');
        loadUsers(pagination.page, pagination.size);
      } catch (error) {
        console.error('Lỗi khi xóa người dùng:', error);
        const message = error?.message || error?.error || error?.details || error?.response?.message;
        const fallback = 'Không thể xóa người dùng. Vui lòng thử lại.';
        const resolvedMessage =
          typeof message === 'string' && message.trim().length > 0 ? message : fallback;
        showNotification('error', resolvedMessage);
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

  const resetNewUserForm = () => {
    setNewUserForm({
      fullName: '',
      username: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      roleKey: 'student'
    });
    setNewUserErrors({});
    setSubmitError(null);
  };

  const handleOpenAddModal = () => {
    resetNewUserForm();
    setShowAddModal(true);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    resetNewUserForm();
  };

  const handleCreateUser = async (userData) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      await userService.createUser(userData);
      showNotification('success', 'Tạo người dùng thành công.');
      setShowAddModal(false);
      resetNewUserForm();
      loadUsers();
    } catch (error) {
      console.error('Lỗi khi tạo người dùng:', error);
      const message = error?.message || error?.error || error?.details || error?.response?.message;
      setSubmitError(
        typeof message === 'string' && message.trim().length > 0
          ? message
          : 'Không thể tạo người dùng. Vui lòng thử lại.'
      );
      showNotification(
        'error',
        typeof message === 'string' && message.trim().length > 0
          ? message
          : 'Không thể tạo người dùng. Vui lòng thử lại.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewUserInputChange = (field, value) => {
    setNewUserForm(prev => ({
      ...prev,
      [field]: value
    }));
    setNewUserErrors(prev => ({
      ...prev,
      [field]: undefined
    }));
  };

  const validateNewUserForm = () => {
    const errors = {};
    if (!newUserForm.fullName.trim()) {
      errors.fullName = 'Vui lòng nhập họ và tên.';
    }
    if (!newUserForm.username.trim()) {
      errors.username = 'Vui lòng nhập username.';
    }
    if (!newUserForm.password) {
      errors.password = 'Vui lòng nhập mật khẩu.';
    }
    if (!newUserForm.confirmPassword) {
      errors.confirmPassword = 'Vui lòng xác nhận mật khẩu.';
    }
    if (
      newUserForm.password &&
      newUserForm.confirmPassword &&
      newUserForm.password !== newUserForm.confirmPassword
    ) {
      errors.confirmPassword = 'Mật khẩu xác nhận không khớp.';
    }
    return errors;
  };

  const handleAddUserSubmit = async (event) => {
    event.preventDefault();
    setSubmitError(null);
    const errors = validateNewUserForm();
    if (Object.keys(errors).length > 0) {
      setNewUserErrors(errors);
      return;
    }

    const selectedRole = roleOptions[newUserForm.roleKey];
    const roleIds = selectedRole?.id ? [selectedRole.id] : [];

    const payload = {
      username: newUserForm.username.trim(),
      password: newUserForm.password,
      email: newUserForm.email.trim() || null,
      fullName: newUserForm.fullName.trim(),
      phone: newUserForm.phone.trim() || null,
      roleIds
    };

    await handleCreateUser(payload);
  };

  const handleUpdateUser = async (userId, userData) => {
    try {
      setIsUpdating(true);
      setEditSubmitError(null);
      await userService.updateUser(userId, userData);
      showNotification('success', 'Cập nhật người dùng thành công.');
      setShowEditModal(false);
      setSelectedUser(null);
      loadUsers(pagination.page, pagination.size);
    } catch (error) {
      console.error('Lỗi khi cập nhật người dùng:', error);
      const message = error?.message || error?.error || error?.details || error?.response?.message;
      const fallback = 'Không thể cập nhật người dùng. Vui lòng thử lại.';
      const resolvedMessage =
        typeof message === 'string' && message.trim().length > 0 ? message : fallback;
      setEditSubmitError(resolvedMessage);
      showNotification('error', resolvedMessage);
    } finally {
      setIsUpdating(false);
    }
  };
  const handleEditUserInputChange = (field, value) => {
    setEditUserForm((prev) => ({
      ...prev,
      [field]: value
    }));
    setEditUserErrors((prev) => ({
      ...prev,
      [field]: undefined
    }));
  };

  const validateEditUserForm = () => {
    const errors = {};
    if (!editUserForm.fullName.trim()) {
      errors.fullName = 'Vui lòng nhập họ và tên.';
    }
    if (!editUserForm.email.trim()) {
      errors.email = 'Vui lòng nhập email.';
    }
    return errors;
  };

  const handleEditUserSubmit = async (event) => {
    event.preventDefault();
    if (!selectedUser) {
      return;
    }
    setEditSubmitError(null);
    const errors = validateEditUserForm();
    if (Object.keys(errors).length > 0) {
      setEditUserErrors(errors);
      return;
    }

    const selectedRole = roleOptions[editUserForm.roleKey];
    const roleIds = selectedRole?.id ? [selectedRole.id] : [];

    const payload = {
      email: editUserForm.email.trim(),
      fullName: editUserForm.fullName.trim(),
      phone: editUserForm.phone.trim() || null,
      isActive: editUserForm.isActive,
      roleIds
    };

    await handleUpdateUser(selectedUser.id, payload);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedUser(null);
    setEditUserErrors({});
    setEditSubmitError(null);
  };


  const handleResetPasswordInputChange = (field, value) => {
    setResetPasswordForm((prev) => ({
      ...prev,
      [field]: value
    }));
    setResetPasswordErrors((prev) => ({
      ...prev,
      [field]: undefined
    }));
  };

  const validateResetPasswordForm = () => {
    const errors = {};
    if (!resetPasswordForm.newPassword.trim()) {
      errors.newPassword = 'Vui lòng nhập mật khẩu mới.';
    }
    if (!resetPasswordForm.confirmPassword.trim()) {
      errors.confirmPassword = 'Vui lòng xác nhận mật khẩu.';
    }
    if (
      resetPasswordForm.newPassword.trim() &&
      resetPasswordForm.confirmPassword.trim() &&
      resetPasswordForm.newPassword !== resetPasswordForm.confirmPassword
    ) {
      errors.confirmPassword = 'Mật khẩu xác nhận không khớp.';
    }
    return errors;
  };

  const handleResetPasswordSubmit = async (event) => {
    event.preventDefault();
    if (!selectedUser) {
      return;
    }

    setResetSubmitError(null);
    const errors = validateResetPasswordForm();
    if (Object.keys(errors).length > 0) {
      setResetPasswordErrors(errors);
      return;
    }

    try {
      setIsResettingPassword(true);
      await userService.resetPassword(selectedUser.id, {
        newPassword: resetPasswordForm.newPassword.trim()
      });
      showNotification('success', 'Đặt lại mật khẩu thành công.');
      setShowResetPasswordModal(false);
      setSelectedUser(null);
      setResetPasswordForm({ newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error('Lỗi khi đặt lại mật khẩu:', error);
      const message = error?.message || error?.error || error?.details || error?.response?.message;
      const fallback = 'Không thể đặt lại mật khẩu. Vui lòng thử lại.';
      const resolvedMessage =
        typeof message === 'string' && message.trim().length > 0 ? message : fallback;
      setResetSubmitError(resolvedMessage);
      showNotification('error', resolvedMessage);
    } finally {
      setIsResettingPassword(false);
    }
  };

  const handleCloseResetPasswordModal = () => {
    setShowResetPasswordModal(false);
    setSelectedUser(null);
    setResetPasswordForm({ newPassword: '', confirmPassword: '' });
    setResetPasswordErrors({});
    setResetSubmitError(null);
  };

  return (
    <div className="space-y-6">
      {/* Notification */}
      {notification && (
        <div
          className={`rounded-md p-4 mb-4 ${
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
          <h1 className="text-2xl font-bold text-gray-900">Quản lý người dùng</h1>
          <p className="mt-1 text-sm text-gray-500">
            Quản lý tài khoản học sinh, giáo viên và quản trị viên
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
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
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
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
          <div className="flex gap-2">
            <button
              onClick={handleSearch}
              className="btn-primary flex items-center space-x-2"
            >
              <MagnifyingGlassIcon className="h-4 w-4" />
              <span>Tìm kiếm</span>
            </button>
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

      {/* Pagination */}
      <Pagination
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        totalElements={pagination.totalElements}
        pageSize={pagination.size}
        onPageChange={(page) => loadUsers(page, pagination.size)}
        itemName="người dùng"
      />

      {/* Add User Modal */}
      {showAddModal && (
        <div className={`fixed inset-0 bg-gray-800/10 backdrop-blur-[2px] flex items-center justify-center z-50 transition-opacity duration-300 ${showAddModal ? 'opacity-100' : 'opacity-0'}`}>
          <div className="relative p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Thêm người dùng mới</h3>
              <form className="space-y-4" onSubmit={handleAddUserSubmit}>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Họ và tên</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Nhập họ và tên"
                    value={newUserForm.fullName}
                    onChange={(e) => handleNewUserInputChange('fullName', e.target.value)}
                  />
                  {newUserErrors.fullName && (
                    <p className="mt-1 text-sm text-red-600">{newUserErrors.fullName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Username</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Nhập username"
                    value={newUserForm.username}
                    onChange={(e) => handleNewUserInputChange('username', e.target.value)}
                  />
                  {newUserErrors.username && (
                    <p className="mt-1 text-sm text-red-600">{newUserErrors.username}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    className="input-field"
                    placeholder="Nhập email"
                    value={newUserForm.email}
                    onChange={(e) => handleNewUserInputChange('email', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Nhập số điện thoại"
                    value={newUserForm.phone}
                    onChange={(e) => handleNewUserInputChange('phone', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Vai trò</label>
                  <select
                    className="input-field"
                    value={newUserForm.roleKey}
                    onChange={(e) => handleNewUserInputChange('roleKey', e.target.value)}
                  >
                    <option value="student">Học sinh</option>
                    <option value="teacher">Giáo viên</option>
                    <option value="admin">Quản trị viên</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
                  <input
                    type="password"
                    className="input-field"
                    placeholder="Nhập mật khẩu"
                    value={newUserForm.password}
                    onChange={(e) => handleNewUserInputChange('password', e.target.value)}
                  />
                  {newUserErrors.password && (
                    <p className="mt-1 text-sm text-red-600">{newUserErrors.password}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Xác nhận mật khẩu</label>
                  <input
                    type="password"
                    className="input-field"
                    placeholder="Nhập lại mật khẩu"
                    value={newUserForm.confirmPassword}
                    onChange={(e) => handleNewUserInputChange('confirmPassword', e.target.value)}
                  />
                  {newUserErrors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{newUserErrors.confirmPassword}</p>
                  )}
                </div>
                {submitError && (
                  <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
                    {submitError}
                  </div>
                )}
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseAddModal}
                    className="btn-secondary"
                  >
                    Hủy
                  </button>
                  <button type="submit" className="btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? 'Đang thêm...' : 'Thêm'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className={`fixed inset-0 bg-gray-800/10 backdrop-blur-[2px] flex items-center justify-center z-50 transition-opacity duration-300 ${showEditModal ? 'opacity-100' : 'opacity-0'}`}>
          <div className="relative p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Chỉnh sửa người dùng</h3>
              <form className="space-y-4" onSubmit={handleEditUserSubmit}>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Họ và tên</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    value={editUserForm.fullName}
                    onChange={(e) => handleEditUserInputChange('fullName', e.target.value)}
                    placeholder="Nhập họ và tên" 
                  />
                  {editUserErrors.fullName && (
                    <p className="mt-1 text-sm text-red-600">{editUserErrors.fullName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input 
                    type="email" 
                    className="input-field" 
                    value={editUserForm.email}
                    onChange={(e) => handleEditUserInputChange('email', e.target.value)}
                    placeholder="Nhập email" 
                  />
                  {editUserErrors.email && (
                    <p className="mt-1 text-sm text-red-600">{editUserErrors.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                  <input
                    type="text"
                    className="input-field"
                    value={editUserForm.phone}
                    onChange={(e) => handleEditUserInputChange('phone', e.target.value)}
                    placeholder="Nhập số điện thoại"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Vai trò</label>
                  <select
                    className="input-field"
                    value={editUserForm.roleKey}
                    onChange={(e) => handleEditUserInputChange('roleKey', e.target.value)}
                  >
                    <option value="student">Học sinh</option>
                    <option value="teacher">Giáo viên</option>
                    <option value="admin">Quản trị viên</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                  <select
                    className="input-field"
                    value={editUserForm.isActive ? 'active' : 'inactive'}
                    onChange={(e) => handleEditUserInputChange('isActive', e.target.value === 'active')}
                  >
                    <option value="active">Hoạt động</option>
                    <option value="inactive">Không hoạt động</option>
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
                    onClick={handleCloseEditModal}
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

      {/* Reset Password Modal */}
      {showResetPasswordModal && selectedUser && (
        <div className={`fixed inset-0 bg-gray-800/10 backdrop-blur-[2px] flex items-center justify-center z-50 transition-opacity duration-300 ${showResetPasswordModal ? 'opacity-100' : 'opacity-0'}`}>
          <div className="relative p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Đặt lại mật khẩu</h3>
              <p className="text-sm text-gray-600 mb-4">
                Đặt lại mật khẩu cho: <strong>{selectedUser.fullName}</strong>
              </p>
              <form className="space-y-4" onSubmit={handleResetPasswordSubmit}>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Mật khẩu mới</label>
                  <input 
                    type="password" 
                    className="input-field" 
                    value={resetPasswordForm.newPassword}
                    onChange={(e) => handleResetPasswordInputChange('newPassword', e.target.value)}
                    placeholder="Nhập mật khẩu mới" 
                  />
                  {resetPasswordErrors.newPassword && (
                    <p className="mt-1 text-sm text-red-600">{resetPasswordErrors.newPassword}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Xác nhận mật khẩu</label>
                  <input 
                    type="password" 
                    className="input-field" 
                    value={resetPasswordForm.confirmPassword}
                    onChange={(e) => handleResetPasswordInputChange('confirmPassword', e.target.value)}
                    placeholder="Nhập lại mật khẩu mới" 
                  />
                  {resetPasswordErrors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{resetPasswordErrors.confirmPassword}</p>
                  )}
                </div>
                {resetSubmitError && (
                  <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
                    {resetSubmitError}
                  </div>
                )}
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseResetPasswordModal}
                    className="btn-secondary"
                  >
                    Hủy
                  </button>
                  <button type="submit" className="btn-primary" disabled={isResettingPassword}>
                    {isResettingPassword ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

       {/* View User Details Popup */}
       {showViewModal && selectedUser && (
         <div className={`fixed inset-0 bg-gray-800/10 backdrop-blur-[2px] flex items-center justify-center z-50 transition-opacity duration-300 ${showViewModal ? 'opacity-100' : 'opacity-0'}`}>

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
