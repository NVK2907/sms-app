import api from './api';

export const studentService = {
  // Lấy danh sách sinh viên với phân trang
  getAllStudents: async (page = 0, size = 10, sortBy = 'id', sortDir = 'asc') => {
    try {
      const response = await api.get('/students', {
        params: { page, size, sortBy, sortDir }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Tìm kiếm và lọc sinh viên
  searchStudents: async (searchRequest, page = 0, size = 10, sortBy = 'id', sortDir = 'asc') => {
    try {
      const response = await api.post('/students/search', searchRequest, {
        params: { page, size, sortBy, sortDir }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Lấy thông tin sinh viên theo ID
  getStudentById: async (studentId) => {
    try {
      const response = await api.get(`/students/${studentId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Lấy thông tin sinh viên theo mã sinh viên
  getStudentByCode: async (studentCode) => {
    try {
      const response = await api.get(`/students/code/${studentCode}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Tạo sinh viên mới
  createStudent: async (studentData) => {
    try {
      const response = await api.post('/students', studentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Cập nhật thông tin sinh viên
  updateStudent: async (studentId, studentData) => {
    try {
      const response = await api.put(`/students/${studentId}`, studentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Xóa sinh viên
  deleteStudent: async (studentId) => {
    try {
      const response = await api.delete(`/students/${studentId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Lấy danh sách sinh viên theo lớp
  getStudentsByClass: async (className) => {
    try {
      const response = await api.get(`/students/class/${className}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Lấy danh sách sinh viên theo chuyên ngành
  getStudentsByMajor: async (major) => {
    try {
      const response = await api.get(`/students/major/${major}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Lấy danh sách sinh viên theo khóa học
  getStudentsByCourseYear: async (courseYear) => {
    try {
      const response = await api.get(`/students/course/${courseYear}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Gán sinh viên vào lớp học
  assignStudentToClasses: async (assignmentData) => {
    try {
      const response = await api.post('/students/assign-classes', assignmentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Hủy gán sinh viên khỏi lớp học
  removeStudentFromClasses: async (studentId, classIds) => {
    try {
      const response = await api.delete(`/students/${studentId}/classes`, { data: classIds });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Lấy danh sách lớp học của sinh viên
  getStudentClasses: async (studentId) => {
    try {
      const response = await api.get(`/students/${studentId}/classes`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Xuất danh sách sinh viên ra Excel
  exportStudentsToExcel: async (searchRequest) => {
    try {
      const response = await api.post('/students/export/excel', searchRequest, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Xuất danh sách sinh viên ra PDF
  exportStudentsToPDF: async (searchRequest) => {
    try {
      const response = await api.post('/students/export/pdf', searchRequest, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};
