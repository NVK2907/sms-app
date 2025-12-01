import api from './api';

export const teacherService = {
  // Lấy danh sách giáo viên với phân trang
  getAllTeachers: async (page = 0, size = 10, sortBy = 'id', sortDir = 'asc', isActive = null) => {
    try {
      const params = { page, size, sortBy, sortDir };
      if (isActive !== null) {
        params.isActive = isActive;
      }
      const response = await api.get('/teachers', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Tìm kiếm giáo viên
  searchTeachers: async (keyword, page = 0, size = 10, sortBy = 'id', sortDir = 'asc', isActive = null) => {
    try {
      const params = { keyword, page, size, sortBy, sortDir };
      if (isActive !== null) {
        params.isActive = isActive;
      }
      const response = await api.get('/teachers/search', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Lấy thông tin giáo viên theo ID
  getTeacherById: async (teacherId) => {
    try {
      const response = await api.get(`/teachers/${teacherId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Lấy thông tin giáo viên theo mã giáo viên
  getTeacherByCode: async (teacherCode) => {
    try {
      const response = await api.get(`/teachers/code/${teacherCode}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Tạo giáo viên mới
  createTeacher: async (teacherData) => {
    try {
      const response = await api.post('/teachers', teacherData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Cập nhật thông tin giáo viên
  updateTeacher: async (teacherId, teacherData) => {
    try {
      const response = await api.put(`/teachers/${teacherId}`, teacherData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Xóa giáo viên
  deleteTeacher: async (teacherId) => {
    try {
      const response = await api.delete(`/teachers/${teacherId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Lấy danh sách giáo viên theo khoa/bộ môn
  getTeachersByDepartment: async (department) => {
    try {
      const response = await api.get(`/teachers/department/${department}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Lấy danh sách giáo viên theo chức danh
  getTeachersByTitle: async (title) => {
    try {
      const response = await api.get(`/teachers/title/${title}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Gán môn học cho giáo viên
  assignSubjectsToTeacher: async (teacherId, subjectIds) => {
    try {
      const response = await api.post(`/teachers/${teacherId}/subjects`, subjectIds);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Hủy gán môn học của giáo viên
  removeSubjectsFromTeacher: async (teacherId, subjectIds) => {
    try {
      const response = await api.delete(`/teachers/${teacherId}/subjects`, { data: subjectIds });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Lấy danh sách môn học của giáo viên
  getTeacherSubjects: async (teacherId) => {
    try {
      const response = await api.get(`/teachers/${teacherId}/subjects`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};
