import React, { useState, useEffect, useCallback } from 'react';
import {
  ChartBarIcon,
  AcademicCapIcon,
  BookOpenIcon,
  CalendarIcon,
  TrophyIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { studentFeaturesService } from '../../services/studentFeaturesService';
import { useAuth } from '../../contexts/AuthContext';

const StudentGrades = () => {
  const { user } = useAuth();
  const studentId = user?.studentId ?? user?.id;
  const [loading, setLoading] = useState(true);
  const [grades, setGrades] = useState([]);
  const [gpa, setGpa] = useState(0);
  const [selectedSemester, setSelectedSemester] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [semesters, setSemesters] = useState([]);

  const loadGradesData = useCallback(async () => {
    if (!studentId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [gradesRes, gpaRes] = await Promise.all([
        selectedSemester === 'all' 
          ? studentFeaturesService.getStudentGrades(studentId)
          : studentFeaturesService.getGradesBySemester(studentId, selectedSemester),
        studentFeaturesService.getStudentGPA(studentId)
      ]);

      // Handle different possible data structures
      const gradesData = gradesRes?.data?.grades || 
                        gradesRes?.data?.content || 
                        gradesRes?.data || 
                        gradesRes || 
                        [];

      setGrades(Array.isArray(gradesData) ? gradesData : []);
      setGpa(gpaRes?.data?.gpa || gpaRes?.gpa || 0);

      // Extract unique semesters for filter
      const uniqueSemesters = Array.isArray(gradesData) 
        ? [...new Set(gradesData.map(grade => grade.semesterName || grade.semester).filter(Boolean))]
        : [];
      setSemesters(uniqueSemesters);

    } catch (error) {
      console.error('Lỗi khi tải dữ liệu điểm số:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedSemester, studentId]);

  useEffect(() => {
    loadGradesData();
  }, [loadGradesData]);

  const filteredGrades = grades.filter(grade =>
    grade.subjectName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    grade.className?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getGradeColor = (grade) => {
    if (grade >= 8.5) return 'text-green-600 bg-green-100';
    if (grade >= 7.0) return 'text-blue-600 bg-blue-100';
    if (grade >= 5.5) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getGradeStatus = (grade) => {
    if (grade >= 8.5) return 'Xuất sắc';
    if (grade >= 7.0) return 'Giỏi';
    if (grade >= 5.5) return 'Khá';
    return 'Trung bình';
  };

  const calculateAverage = (grades) => {
    if (grades.length === 0) return 0;
    const total = grades.reduce((sum, grade) => sum + grade.finalGrade, 0);
    return total / grades.length;
  };

  const getGpaColor = (gpa) => {
    if (gpa >= 3.5) return 'text-green-600';
    if (gpa >= 3.0) return 'text-blue-600';
    if (gpa >= 2.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Điểm số</h1>
        <p className="mt-1 text-sm text-gray-500">
          Xem điểm số các môn học và GPA của bạn
        </p>
      </div>

      {/* GPA Card */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">GPA Tổng kết</h2>
            <p className="text-indigo-100">Điểm trung bình tích lũy</p>
          </div>
          <div className="text-right">
            <div className={`text-4xl font-bold ${getGpaColor(gpa)}`}>
              {gpa.toFixed(2)}
            </div>
            <div className="text-indigo-100 text-sm">
              {gpa >= 3.5 ? 'Xuất sắc' : gpa >= 3.0 ? 'Giỏi' : gpa >= 2.5 ? 'Khá' : 'Trung bình'}
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex-1 max-w-lg">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm môn học..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
        </div>
        <div className="sm:w-48">
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="input-field"
          >
            <option value="all">Tất cả học kỳ</option>
            {semesters.map((semester, index) => (
              <option key={index} value={semester}>{semester}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grades Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Môn học
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lớp học
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Học kỳ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Điểm quá trình
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Điểm thi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Điểm tổng kết
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredGrades.length > 0 ? (
                filteredGrades.map((grade, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <BookOpenIcon className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{grade.subjectName}</div>
                          <div className="text-sm text-gray-500">{grade.subjectCode}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{grade.className}</div>
                      <div className="text-sm text-gray-500">{grade.classCode}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{grade.semesterName}</div>
                      <div className="text-sm text-gray-500">{grade.academicYear}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{grade.processGrade || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{grade.examGrade || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getGradeColor(grade.finalGrade)}`}>
                        {grade.finalGrade}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{getGradeStatus(grade.finalGrade)}</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                    {grades.length === 0 ? 'Không có dữ liệu điểm số' : 'Không tìm thấy môn học nào phù hợp'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrophyIcon className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Điểm trung bình</p>
              <p className="text-2xl font-semibold text-gray-900">
                {calculateAverage(filteredGrades).toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AcademicCapIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Môn đã hoàn thành</p>
              <p className="text-2xl font-semibold text-gray-900">
                {filteredGrades.filter(grade => grade.finalGrade >= 5.0).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ChartBarIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Tổng số môn</p>
              <p className="text-2xl font-semibold text-gray-900">
                {filteredGrades.length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentGrades;
