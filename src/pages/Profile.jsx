import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { profileService } from '../services/profileService';
import {
  UserIcon,
  PencilIcon,
  KeyIcon,
  AcademicCapIcon,
  CalendarIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  IdentificationIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [formData, setFormData] = useState({});
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const userRole = user?.roles?.[0]?.roleName?.toLowerCase();
      const response = await profileService.getProfile(user.id, userRole);
      
      // Xử lý response khác nhau từ các API
      let profileData;
      if (userRole === 'student') {
        profileData = response;
      } else {
        profileData = response.data || response;
      }
      
      setProfile(profileData);
      
      // Xử lý dữ liệu cho student
      if (userRole === 'student') {
        setFormData({
          firstName: profileData.fullName?.split(' ').slice(0, -1).join(' ') || '',
          lastName: profileData.fullName?.split(' ').slice(-1)[0] || '',
          email: profileData.email || '',
          phone: profileData.phone || '',
          address: profileData.address || '',
          dateOfBirth: profileData.dob || '',
          gender: profileData.gender || '',
          studentId: profileData.studentCode || '',
          className: profileData.className || '',
          major: profileData.major || '',
          academicYear: profileData.courseYear || ''
        });
      } else {
        // Xử lý dữ liệu cho teacher và admin
        setFormData({
          firstName: profileData.fullName?.split(' ').slice(0, -1).join(' ') || '',
          lastName: profileData.fullName?.split(' ').slice(-1)[0] || '',
          email: profileData.email || '',
          phone: profileData.phone || '',
          address: '', // UserResponse không có address
          dateOfBirth: '', // UserResponse không có dateOfBirth
          gender: '', // UserResponse không có gender
          teacherId: profileData.username || '', // Sử dụng username làm teacherId
          department: '', // UserResponse không có department
          specialization: '' // UserResponse không có specialization
        });
      }
    } catch (error) {
      console.error('Lỗi khi tải hồ sơ:', error);
      setError('Không thể tải thông tin hồ sơ');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      setError('');
      const userRole = user?.roles?.[0]?.roleName?.toLowerCase();
      await profileService.updateProfile(user.id, userRole, formData);
      setSuccess('Cập nhật thông tin thành công');
      setEditing(false);
      loadProfile();
    } catch (error) {
      setError('Cập nhật thông tin thất bại: ' + (error.message || 'Lỗi không xác định'));
    }
  };

  const handleChangePassword = async () => {
    try {
      setError('');
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setError('Mật khẩu mới và xác nhận mật khẩu không khớp');
        return;
      }
      
      const userRole = user?.roles?.[0]?.roleName?.toLowerCase();
      await profileService.changePassword(user.id, userRole, passwordData);
      setSuccess('Đổi mật khẩu thành công');
      setChangingPassword(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      setError('Đổi mật khẩu thất bại: ' + (error.message || 'Lỗi không xác định'));
    }
  };

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'admin': return 'Quản trị viên';
      case 'teacher': return 'Giáo viên';
      case 'student': return 'Sinh viên';
      default: return role;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'teacher': return 'bg-blue-100 text-blue-800';
      case 'student': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <UserIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy hồ sơ</h2>
          <p className="text-gray-600">Không thể tải thông tin hồ sơ cá nhân</p>
        </div>
      </div>
    );
  }

  const userRole = user?.roles?.[0]?.roleName?.toLowerCase();

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hồ sơ cá nhân</h1>
          <p className="mt-1 text-sm text-gray-500">Quản lý thông tin cá nhân của bạn</p>
        </div>
        <div className="flex space-x-3">
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <PencilIcon className="h-4 w-4" />
              <span>Chỉnh sửa</span>
            </button>
          )}
          <button
            onClick={() => setChangingPassword(true)}
            className="btn-secondary flex items-center space-x-2"
          >
            <KeyIcon className="h-4 w-4" />
            <span>Đổi mật khẩu</span>
          </button>
        </div>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
          {success}
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <div className="h-20 w-20 rounded-full bg-indigo-100 flex items-center justify-center">
                <UserIcon className="h-10 w-10 text-indigo-600" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-semibold text-gray-900">
                {profile.fullName || (profile.firstName + ' ' + profile.lastName)}
              </h2>
              <p className="text-sm text-gray-500">{profile.email}</p>
              <div className="mt-2">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(userRole)}`}>
                  {getRoleDisplayName(userRole)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Thông tin cơ bản */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <IdentificationIcon className="h-5 w-5 mr-2" />
                Thông tin cơ bản
              </h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Họ và tên</label>
                  {editing ? (
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="Họ"
                      />
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="Tên"
                      />
                    </div>
                  ) : (
                    <p className="text-sm text-gray-900">
                      {profile.fullName || (profile.firstName + ' ' + profile.lastName)}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  {editing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  ) : (
                    <p className="text-sm text-gray-900 flex items-center">
                      <EnvelopeIcon className="h-4 w-4 mr-2" />
                      {profile.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                  {editing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  ) : (
                    <p className="text-sm text-gray-900 flex items-center">
                      <PhoneIcon className="h-4 w-4 mr-2" />
                      {profile.phone || 'Chưa cập nhật'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Địa chỉ</label>
                  {editing ? (
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="input-field"
                      rows="2"
                    />
                  ) : (
                    <p className="text-sm text-gray-900 flex items-center">
                      <MapPinIcon className="h-4 w-4 mr-2" />
                      {profile.address || 'Chưa cập nhật'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Ngày sinh</label>
                  {editing ? (
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  ) : (
                    <p className="text-sm text-gray-900 flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      {profile.dob ? new Date(profile.dob).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Giới tính</label>
                  {editing ? (
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="input-field"
                    >
                      <option value="">Chọn giới tính</option>
                      <option value="male">Nam</option>
                      <option value="female">Nữ</option>
                      <option value="other">Khác</option>
                    </select>
                  ) : (
                    <p className="text-sm text-gray-900">
                      {profile.gender === 'male' ? 'Nam' : profile.gender === 'female' ? 'Nữ' : profile.gender || 'Chưa cập nhật'}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Thông tin chuyên môn */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <AcademicCapIcon className="h-5 w-5 mr-2" />
                Thông tin chuyên môn
              </h3>
              
              <div className="space-y-3">
                {userRole === 'student' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Mã sinh viên</label>
                      <p className="text-sm text-gray-900 font-mono">
                        {profile.studentCode || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Lớp học</label>
                      <p className="text-sm text-gray-900">
                        {profile.className || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Chuyên ngành</label>
                      <p className="text-sm text-gray-900">
                        {profile.major || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Năm học</label>
                      <p className="text-sm text-gray-900">
                        {profile.courseYear || 'N/A'}
                      </p>
                    </div>
                  </>
                )}

                {(userRole === 'teacher' || userRole === 'admin') && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Tên đăng nhập</label>
                      <p className="text-sm text-gray-900 font-mono">
                        {profile.username || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Khoa/Bộ môn</label>
                      <p className="text-sm text-gray-900">
                        {profile.department || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Chuyên môn</label>
                      <p className="text-sm text-gray-900">
                        {profile.specialization || 'N/A'}
                      </p>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700">Vai trò</label>
                  <div className="flex flex-wrap gap-2">
                    {user?.roles?.map((role, index) => (
                      <span
                        key={index}
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(role.roleName.toLowerCase())}`}
                      >
                        {getRoleDisplayName(role.roleName.toLowerCase())}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {editing && (
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setEditing(false);
                  // Reset form data based on user role
                  const userRole = user?.roles?.[0]?.roleName?.toLowerCase();
                  if (userRole === 'student') {
                    setFormData({
                      firstName: profile.fullName?.split(' ').slice(0, -1).join(' ') || '',
                      lastName: profile.fullName?.split(' ').slice(-1)[0] || '',
                      email: profile.email || '',
                      phone: profile.phone || '',
                      address: profile.address || '',
                      dateOfBirth: profile.dob || '',
                      gender: profile.gender || '',
                      studentId: profile.studentCode || '',
                      className: profile.className || '',
                      major: profile.major || '',
                      academicYear: profile.courseYear || ''
                    });
                  } else {
                    setFormData({
                      firstName: profile.fullName?.split(' ').slice(0, -1).join(' ') || '',
                      lastName: profile.fullName?.split(' ').slice(-1)[0] || '',
                      email: profile.email || '',
                      phone: profile.phone || '',
                      address: '',
                      dateOfBirth: '',
                      gender: '',
                      teacherId: profile.username || '',
                      department: '',
                      specialization: ''
                    });
                  }
                }}
                className="btn-secondary"
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                className="btn-primary"
              >
                Lưu thay đổi
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Change Password Modal */}
      {changingPassword && (
        <div className="fixed inset-0 bg-gray-800/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <KeyIcon className="h-5 w-5 mr-2" />
                Đổi mật khẩu
              </h3>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Mật khẩu hiện tại</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="input-field"
                  placeholder="Nhập mật khẩu hiện tại"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Mật khẩu mới</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="input-field"
                  placeholder="Nhập mật khẩu mới"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Xác nhận mật khẩu mới</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="input-field"
                  placeholder="Nhập lại mật khẩu mới"
                />
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setChangingPassword(false);
                  setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                  });
                }}
                className="btn-secondary"
              >
                Hủy
              </button>
              <button
                onClick={handleChangePassword}
                className="btn-primary"
              >
                Đổi mật khẩu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
