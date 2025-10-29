import api from './api';

export const subjectService = {
  // Lấy danh sách môn học với phân trang
  getAllSubjects: async (page = 0, size = 10, sortBy = 'id', sortDir = 'asc', keyword = null) => {
    try {
      const response = await api.get('/subjects/search', {
        params: { page, size, sortBy, sortDir, keyword }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Lấy thông tin môn học theo ID
  getSubjectById: async (subjectId) => {
    try {
      const response = await api.get(`/subjects/${subjectId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Lấy thông tin môn học theo mã môn học
  getSubjectByCode: async (subjectCode) => {
    try {
      const response = await api.get(`/subjects/code/${subjectCode}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Tạo môn học mới
  createSubject: async (subjectData) => {
    try {
      const response = await api.post('/subjects', subjectData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Cập nhật thông tin môn học
  updateSubject: async (subjectId, subjectData) => {
    try {
      const response = await api.put(`/subjects/${subjectId}`, subjectData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Xóa môn học
  deleteSubject: async (subjectId) => {
    try {
      const response = await api.delete(`/subjects/${subjectId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Tìm kiếm môn học với phân trang
  searchSubjects: async (keyword, page = 0, size = 10, sortBy = 'id', sortDir = 'asc') => {
    try {
      const response = await api.get('/subjects/search', {
        params: { keyword, page, size, sortBy, sortDir }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Lấy danh sách môn học theo số tín chỉ
  getSubjectsByCredit: async (credit) => {
    try {
      const response = await api.get(`/subjects/credit/${credit}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Lấy danh sách môn học theo khoảng tín chỉ
  getSubjectsByCreditRange: async (minCredit, maxCredit) => {
    try {
      const response = await api.get('/subjects/credit-range', {
        params: { minCredit, maxCredit }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};
