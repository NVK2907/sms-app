import api from './api';

export const authService = {
  // Đăng nhập
  login: async (credentials) => {
    try {
      console.log('🔐 AuthService: Making login request to backend');
      const response = await api.post('/auth/login', credentials);
      console.log('🔐 AuthService: Backend response:', response.data);
      
      const { data } = response.data;
      
      if (data && data.accessToken) {
        // Transform userInfo to match expected format
        const userInfo = {
          id: data.userInfo.id,
          username: data.userInfo.username,
          email: data.userInfo.email,
          fullName: data.userInfo.fullName,
          phone: data.userInfo.phone,
          roles: data.userInfo.roles.map((role, index) => ({
            id: index + 1,
            roleName: role,
            description: role
          })),
          permissions: data.userInfo.permissions
        };
        
        console.log('🔐 AuthService: Transformed user info:', userInfo);
        
        // Lưu token và thông tin user vào localStorage
        localStorage.setItem('token', data.accessToken);
        localStorage.setItem('user', JSON.stringify(userInfo));
        
        return { 
          token: data.accessToken, 
          user: userInfo,
          refreshToken: data.refreshToken,
          expiresIn: data.expiresIn
        };
      }
      
      throw new Error('Đăng nhập thất bại');
    } catch (error) {
      console.error('❌ AuthService: Login error:', error);
      throw error.response?.data || error;
    }
  },

  // Đăng ký
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Lấy thông tin user hiện tại từ localStorage
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Kiểm tra token có hợp lệ không
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    return !!token;
  },

  // Lấy token
  getToken: () => {
    return localStorage.getItem('token');
  },

  // Làm mới token
  refreshToken: async (refreshToken) => {
    try {
      const response = await api.post('/auth/refresh', { refreshToken });
      const { data } = response.data;
      
      if (data && data.accessToken) {
        localStorage.setItem('token', data.accessToken);
        return data;
      }
      
      throw new Error('Làm mới token thất bại');
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Kiểm tra token có hợp lệ không
  validateToken: async () => {
    try {
      const response = await api.get('/auth/validate');
      return response.data.data;
    } catch (error) {
      return false;
    }
  },

  // Lấy thông tin user hiện tại từ server
  getCurrentUserFromServer: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Đăng xuất
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Lỗi khi đăng xuất:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }
};
