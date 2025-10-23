import api from './api';

export const userService = {
  // Lấy danh sách người dùng với phân trang
  getAllUsers: async (page = 0, size = 10, sortBy = 'id', sortDir = 'asc') => {
    try {
      const response = await api.get('/users', {
        params: { page, size, sortBy, sortDir }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Tìm kiếm người dùng
  searchUsers: async (keyword, page = 0, size = 10, sortBy = 'id', sortDir = 'asc') => {
    try {
      const response = await api.get('/users/search', {
        params: { keyword, page, size, sortBy, sortDir }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Lấy thông tin người dùng theo ID
  getUserById: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Tạo người dùng mới
  createUser: async (userData) => {
    try {
      const response = await api.post('/users', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Cập nhật thông tin người dùng
  updateUser: async (userId, userData) => {
    try {
      const response = await api.put(`/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Xóa người dùng
  deleteUser: async (userId) => {
    try {
      const response = await api.delete(`/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Đặt lại mật khẩu
  resetPassword: async (userId, passwordData) => {
    try {
      const response = await api.put(`/users/${userId}/reset-password`, passwordData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Thay đổi trạng thái người dùng
  changeUserStatus: async (userId, statusData) => {
    try {
      const response = await api.put(`/users/${userId}/status`, statusData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Gán vai trò cho người dùng
  assignRoles: async (roleData) => {
    try {
      const response = await api.post('/users/assign-roles', roleData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Thu hồi vai trò của người dùng
  revokeRoles: async (userId, roleIds) => {
    try {
      const response = await api.delete(`/users/${userId}/roles`, { data: roleIds });
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
