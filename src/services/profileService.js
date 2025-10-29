import api from './api';

export const profileService = {
  // Lấy thông tin hồ sơ cá nhân theo role
  getProfile: async (userId, userRole) => {
    try {
      let response;
      switch (userRole) {
        case 'student':
          response = await api.get(`/student/profile/${userId}`);
          break;
        case 'teacher':
          response = await api.get(`/users/${userId}`);
          break;
        case 'admin':
          response = await api.get(`/users/${userId}`);
          break;
        default:
          response = await api.get(`/users/${userId}`);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Cập nhật thông tin hồ sơ cá nhân
  updateProfile: async (userId, userRole, profileData) => {
    try {
      let response;
      let requestData;
      
      switch (userRole) {
        case 'student':
          // Chuyển đổi dữ liệu cho StudentUpdateRequest
          requestData = {
            fullName: `${profileData.firstName} ${profileData.lastName}`.trim(),
            email: profileData.email,
            phone: profileData.phone,
            gender: profileData.gender,
            dob: profileData.dateOfBirth,
            address: profileData.address,
            className: profileData.className,
            major: profileData.major,
            courseYear: profileData.academicYear
          };
          response = await api.put(`/student/profile/${userId}`, requestData);
          break;
        case 'teacher':
        case 'admin':
          // Chuyển đổi dữ liệu cho UserUpdateRequest
          requestData = {
            fullName: `${profileData.firstName} ${profileData.lastName}`.trim(),
            email: profileData.email,
            phone: profileData.phone
          };
          response = await api.put(`/users/${userId}`, requestData);
          break;
        default:
          requestData = {
            fullName: `${profileData.firstName} ${profileData.lastName}`.trim(),
            email: profileData.email,
            phone: profileData.phone
          };
          response = await api.put(`/users/${userId}`, requestData);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Đổi mật khẩu
  changePassword: async (userId, userRole, passwordData) => {
    try {
      let response;
      let requestData;
      
      switch (userRole) {
        case 'student':
          // API cho student sử dụng ChangePasswordRequest
          requestData = {
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword
          };
          response = await api.post(`/student/change-password/${userId}`, requestData);
          break;
        case 'teacher':
        case 'admin':
          // API cho teacher và admin sử dụng PasswordResetRequest
          requestData = {
            newPassword: passwordData.newPassword
          };
          response = await api.put(`/users/${userId}/reset-password`, requestData);
          break;
        default:
          requestData = {
            newPassword: passwordData.newPassword
          };
          response = await api.put(`/users/${userId}/reset-password`, requestData);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Lấy danh sách vai trò của người dùng
  getUserRoles: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}/roles`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};
