import api from './api';

export const teacherFeaturesService = {
  // === CLASS & STUDENT MANAGEMENT ===

  // Lấy danh sách lớp của giáo viên
  getTeacherClasses: async (teacherId) => {
    try {
      const response = await api.get(`/teacher/classes/${teacherId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Lấy danh sách lớp theo học kỳ
  getTeacherClassesBySemester: async (teacherId, semesterId) => {
    try {
      const response = await api.get(`/teacher/classes/${teacherId}/semester/${semesterId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Lấy danh sách sinh viên trong lớp
  getClassStudents: async (classId) => {
    try {
      const response = await api.get(`/teacher/classes/${classId}/students`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // === GRADES MANAGEMENT ===

  // Tạo/cập nhật điểm
  createOrUpdateGrade: async (gradeData) => {
    try {
      const response = await api.post('/teacher/grades', gradeData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Lấy điểm theo lớp
  getGradesByClass: async (classId) => {
    try {
      const response = await api.get(`/teacher/classes/${classId}/grades`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Lấy điểm theo sinh viên
  getGradesByStudent: async (studentId) => {
    try {
      const response = await api.get(`/teacher/students/${studentId}/grades`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Xuất điểm theo lớp
  exportGradesByClass: async (classId) => {
    try {
      const response = await api.get(`/teacher/classes/${classId}/grades/export`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Xóa điểm
  deleteGrade: async (gradeId) => {
    try {
      const response = await api.delete(`/teacher/grades/${gradeId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // === ASSIGNMENTS MANAGEMENT ===

  // Tạo bài tập
  createAssignment: async (assignmentData) => {
    try {
      const response = await api.post('/teacher/assignments', assignmentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Cập nhật bài tập
  updateAssignment: async (assignmentId, assignmentData) => {
    try {
      const response = await api.put(`/teacher/assignments/${assignmentId}`, assignmentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Xóa bài tập
  deleteAssignment: async (assignmentId) => {
    try {
      const response = await api.delete(`/teacher/assignments/${assignmentId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Lấy bài tập theo lớp
  getAssignmentsByClass: async (classId) => {
    try {
      const response = await api.get(`/teacher/classes/${classId}/assignments`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Lấy bài tập theo giáo viên
  getAssignmentsByTeacher: async (teacherId) => {
    try {
      const response = await api.get(`/teacher/teachers/${teacherId}/assignments`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Lấy chi tiết bài tập
  getAssignmentDetails: async (assignmentId) => {
    try {
      const response = await api.get(`/teacher/assignments/${assignmentId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // === MATERIALS MANAGEMENT ===

  // Upload tài liệu
  uploadMaterial: async (materialData) => {
    try {
      const response = await api.post('/teacher/materials', materialData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Cập nhật tài liệu
  updateMaterial: async (materialId, materialData) => {
    try {
      const response = await api.put(`/teacher/materials/${materialId}`, materialData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Xóa tài liệu
  deleteMaterial: async (materialId) => {
    try {
      const response = await api.delete(`/teacher/materials/${materialId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Lấy tài liệu theo lớp
  getMaterialsByClass: async (classId) => {
    try {
      const response = await api.get(`/teacher/classes/${classId}/materials`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Lấy tài liệu theo giáo viên
  getMaterialsByTeacher: async (teacherId) => {
    try {
      const response = await api.get(`/teacher/teachers/${teacherId}/materials`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // === ATTENDANCE MANAGEMENT ===

  // Ghi điểm danh
  recordAttendance: async (attendanceData) => {
    try {
      const response = await api.post('/teacher/attendance', attendanceData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Cập nhật điểm danh
  updateAttendance: async (attendanceId, attendanceData) => {
    try {
      const response = await api.put(`/teacher/attendance/${attendanceId}`, attendanceData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Xóa điểm danh
  deleteAttendance: async (attendanceId) => {
    try {
      const response = await api.delete(`/teacher/attendance/${attendanceId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Lấy điểm danh theo lớp
  getAttendanceByClass: async (classId) => {
    try {
      const response = await api.get(`/teacher/classes/${classId}/attendance`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Lấy điểm danh theo ngày
  getAttendanceByDate: async (classId, date) => {
    try {
      const response = await api.get(`/teacher/classes/${classId}/attendance/${date}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Tạo báo cáo điểm danh
  generateAttendanceReport: async (classId) => {
    try {
      const response = await api.get(`/teacher/classes/${classId}/attendance/report`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // === SUBMISSION MANAGEMENT ===

  // Lấy danh sách bài nộp
  getAssignmentSubmissions: async (assignmentId) => {
    try {
      const response = await api.get(`/teacher/assignments/${assignmentId}/submissions`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Lấy bài nộp chưa chấm
  getUngradedSubmissions: async (assignmentId) => {
    try {
      const response = await api.get(`/teacher/assignments/${assignmentId}/submissions/ungraded`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Chấm điểm bài nộp
  gradeSubmission: async (gradeData) => {
    try {
      const response = await api.post('/teacher/submissions/grade', gradeData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Lấy chi tiết bài nộp
  getSubmissionDetails: async (submissionId) => {
    try {
      const response = await api.get(`/teacher/submissions/${submissionId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // === SCHEDULE MANAGEMENT ===

  // Lấy lịch dạy của giáo viên (tuần)
  getTeacherSchedule: async (teacherId) => {
    try {
      const response = await api.get(`/teacher/schedule/${teacherId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Lấy lịch dạy theo ngày
  getTeacherDailySchedule: async (teacherId, date) => {
    try {
      const response = await api.get(`/teacher/schedule/${teacherId}/daily/${date}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};
