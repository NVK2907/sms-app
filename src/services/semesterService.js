import api from './api';

export const semesterService = {
  // === ACADEMIC YEAR MANAGEMENT ===
  
  // Lấy danh sách năm học với phân trang
  getAllAcademicYears: async (page = 0, size = 10, sortBy = 'id', sortDir = 'asc') => {
    try {
      const response = await api.get('/semesters/academic-years', {
        params: { page, size, sortBy, sortDir }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Lấy thông tin năm học theo ID
  getAcademicYearById: async (academicYearId) => {
    try {
      const response = await api.get(`/semesters/academic-years/${academicYearId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Lấy năm học hiện tại
  getCurrentAcademicYear: async () => {
    try {
      const response = await api.get('/semesters/academic-years/current');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Tạo năm học mới
  createAcademicYear: async (academicYearData) => {
    try {
      const response = await api.post('/semesters/academic-years', academicYearData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Cập nhật thông tin năm học
  updateAcademicYear: async (academicYearId, academicYearData) => {
    try {
      const response = await api.put(`/semesters/academic-years/${academicYearId}`, academicYearData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Xóa năm học
  deleteAcademicYear: async (academicYearId) => {
    try {
      const response = await api.delete(`/semesters/academic-years/${academicYearId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // === SEMESTER MANAGEMENT ===

  // Lấy danh sách học kỳ với phân trang
  getAllSemesters: async (page = 0, size = 10, sortBy = 'id', sortDir = 'asc') => {
    try {
      const response = await api.get('/semesters', {
        params: { page, size, sortBy, sortDir }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Lấy thông tin học kỳ theo ID
  getSemesterById: async (semesterId) => {
    try {
      const response = await api.get(`/semesters/${semesterId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Lấy danh sách học kỳ theo năm học
  getSemestersByAcademicYear: async (academicYearId) => {
    try {
      const response = await api.get(`/semesters/academic-years/${academicYearId}/semesters`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Lấy học kỳ hiện tại
  getCurrentSemester: async () => {
    try {
      const response = await api.get('/semesters/current');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Lấy danh sách học kỳ đang mở đăng ký
  getOpenSemesters: async () => {
    try {
      const response = await api.get('/semesters/open');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Tạo học kỳ mới
  createSemester: async (semesterData) => {
    try {
      const response = await api.post('/semesters', semesterData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Cập nhật thông tin học kỳ
  updateSemester: async (semesterId, semesterData) => {
    try {
      const response = await api.put(`/semesters/${semesterId}`, semesterData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Xóa học kỳ
  deleteSemester: async (semesterId) => {
    try {
      const response = await api.delete(`/semesters/${semesterId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // === REGISTRATION MANAGEMENT ===

  // Đóng/mở đăng ký học phần cho học kỳ
  updateSemesterRegistrationStatus: async (semesterId, statusData) => {
    try {
      const response = await api.put(`/semesters/${semesterId}/registration-status`, statusData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Đóng tất cả đăng ký học phần
  closeAllRegistrations: async () => {
    try {
      const response = await api.put('/semesters/close-all-registrations');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Mở tất cả đăng ký học phần
  openAllRegistrations: async () => {
    try {
      const response = await api.put('/semesters/open-all-registrations');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};
