import api from './api';

export const studentFeaturesService = {
  // === PROFILE MANAGEMENT ===
  
  // Lấy thông tin cá nhân
  getStudentProfile: async (studentId) => {
    try {
      const response = await api.get(`/student/profile/${studentId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Cập nhật thông tin cá nhân
  updateStudentProfile: async (studentId, profileData) => {
    try {
      const response = await api.put(`/student/profile/${studentId}`, profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Đổi mật khẩu
  changePassword: async (studentId, passwordData) => {
    try {
      const response = await api.post(`/student/change-password/${studentId}`, passwordData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // === CLASS REGISTRATION ===

  // Lấy danh sách lớp có thể đăng ký
  getAvailableClasses: async (studentId) => {
    try {
      const response = await api.get(`/student/${studentId}/classes/available`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Lấy danh sách lớp đã đăng ký
  getRegisteredClasses: async (studentId) => {
    try {
      const response = await api.get(`/student/${studentId}/classes/registered`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Lấy danh sách lớp đã đăng ký theo học kỳ
  getRegisteredClassesBySemester: async (studentId, semesterId) => {
    try {
      const response = await api.get(`/student/${studentId}/classes/registered/semester/${semesterId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Lấy chi tiết lớp học
  getClassDetails: async (studentId, classId) => {
    try {
      const response = await api.get(`/student/${studentId}/classes/${classId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Đăng ký lớp học
  registerClass: async (registrationData) => {
    try {
      const response = await api.post('/student/register-class', registrationData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Hủy đăng ký lớp học
  unregisterClass: async (studentId, classId) => {
    try {
      const response = await api.delete(`/student/${studentId}/unregister-class/${classId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // === SCHEDULE MANAGEMENT ===

  // Lấy lịch học theo tuần
  getWeeklySchedule: async (studentId) => {
    try {
      const response = await api.get(`/student/${studentId}/schedule/weekly`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Lấy lịch học theo ngày
  getDailySchedule: async (studentId, date) => {
    try {
      const response = await api.get(`/student/${studentId}/schedule/daily`, {
        params: { date }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Lấy lịch thi theo học kỳ
  getExamSchedule: async (studentId, semesterId) => {
    try {
      const response = await api.get(`/student/${studentId}/schedule/exams/semester/${semesterId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // === GRADES MANAGEMENT ===

  // Lấy điểm số của sinh viên
  getStudentGrades: async (studentId) => {
    try {
      const response = await api.get(`/student/${studentId}/grades`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Lấy điểm số theo học kỳ
  getGradesBySemester: async (studentId, semesterId) => {
    try {
      const response = await api.get(`/student/${studentId}/grades/semester/${semesterId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Lấy điểm số theo lớp
  getGradesByClass: async (studentId, classId) => {
    try {
      const response = await api.get(`/student/${studentId}/grades/class/${classId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Lấy tổng kết GPA
  getStudentGPA: async (studentId) => {
    try {
      const response = await api.get(`/student/${studentId}/gpa`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // === MATERIALS MANAGEMENT ===

  // Lấy tài liệu của sinh viên
  getStudentMaterials: async (studentId) => {
    try {
      const response = await api.get(`/student/${studentId}/materials`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Lấy tài liệu theo lớp
  getMaterialsByClass: async (studentId, classId) => {
    try {
      const response = await api.get(`/student/${studentId}/materials/class/${classId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // === ASSIGNMENTS MANAGEMENT ===

  // Lấy danh sách bài tập
  getStudentAssignments: async (studentId) => {
    try {
      const response = await api.get(`/student/${studentId}/assignments`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Lấy bài tập theo lớp
  getAssignmentsByClass: async (studentId, classId) => {
    try {
      const response = await api.get(`/student/${studentId}/assignments/class/${classId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Lấy chi tiết bài tập
  getAssignmentDetails: async (studentId, assignmentId) => {
    try {
      const response = await api.get(`/student/${studentId}/assignments/${assignmentId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Nộp bài tập
  submitAssignment: async (submissionData) => {
    try {
      const response = await api.post('/student/submit-assignment', submissionData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Cập nhật bài nộp
  updateSubmission: async (studentId, submissionId, submissionData) => {
    try {
      const response = await api.put(`/student/${studentId}/update-submission/${submissionId}`, submissionData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};
