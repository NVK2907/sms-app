import api from './api';

export const classService = {
  // Lấy danh sách lớp học với phân trang
  getAllClasses: async (page = 0, size = 10, sortBy = 'id', sortDir = 'asc') => {
    try {
      const response = await api.get('/classes/search', {
        params: { page, size, sortBy, sortDir }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Tìm kiếm lớp học với phân trang
  searchClasses: async (keyword, page = 0, size = 10, sortBy = 'id', sortDir = 'asc') => {
    try {
      const response = await api.get('/classes/search', {
        params: { keyword, page, size, sortBy, sortDir }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Lấy thông tin lớp học theo ID
  getClassById: async (classId) => {
    try {
      const response = await api.get(`/classes/${classId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Lấy thông tin lớp học theo mã lớp
  getClassByCode: async (classCode) => {
    try {
      const response = await api.get(`/classes/code/${classCode}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Tạo lớp học mới
  createClass: async (classData) => {
    try {
      const response = await api.post('/classes', classData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Cập nhật thông tin lớp học
  updateClass: async (classId, classData) => {
    try {
      const response = await api.put(`/classes/${classId}`, classData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Xóa lớp học
  deleteClass: async (classId) => {
    try {
      const response = await api.delete(`/classes/${classId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Lấy danh sách lớp học theo môn học
  getClassesBySubject: async (subjectId) => {
    try {
      const response = await api.get(`/classes/subject/${subjectId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Lấy danh sách lớp học theo học kỳ
  getClassesBySemester: async (semesterId) => {
    try {
      const response = await api.get(`/classes/semester/${semesterId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Lấy danh sách lớp học theo giáo viên
  getClassesByTeacher: async (teacherId) => {
    try {
      const response = await api.get(`/classes/teacher/${teacherId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Lấy danh sách lớp học theo môn học và học kỳ
  getClassesBySubjectAndSemester: async (subjectId, semesterId) => {
    try {
      const response = await api.get(`/classes/subject/${subjectId}/semester/${semesterId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Lấy danh sách lớp học theo giáo viên và học kỳ
  getClassesByTeacherAndSemester: async (teacherId, semesterId) => {
    try {
      const response = await api.get(`/classes/teacher/${teacherId}/semester/${semesterId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Phân công giáo viên giảng dạy
  assignTeacherToClass: async (classId, teacherId) => {
    try {
      const response = await api.put(`/classes/${classId}/assign-teacher/${teacherId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Hủy phân công giáo viên
  removeTeacherFromClass: async (classId) => {
    try {
      const response = await api.put(`/classes/${classId}/remove-teacher`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Lấy danh sách sinh viên trong lớp
  getClassStudents: async (classId) => {
    try {
      const response = await api.get(`/classes/${classId}/students`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};
