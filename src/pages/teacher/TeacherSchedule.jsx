import React, { useState, useEffect, useCallback } from 'react';
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  UserIcon,
  BookOpenIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import { teacherFeaturesService } from '../../services/teacherFeaturesService';
import { useAuth } from '../../contexts/AuthContext';

const TeacherSchedule = () => {
  const { user } = useAuth();
  const teacherId = user?.teacherId ?? user?.id;
  const [loading, setLoading] = useState(true);
  const [schedule, setSchedule] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('week'); // 'week' or 'day'

  const loadScheduleData = useCallback(async () => {
    if (!teacherId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      let response;
      if (viewMode === 'week') {
        response = await teacherFeaturesService.getTeacherSchedule(teacherId);
      } else {
        response = await teacherFeaturesService.getTeacherDailySchedule(teacherId, selectedDate.toISOString().split('T')[0]);
      }

      // Handle different possible data structures
      const scheduleData = response?.data?.schedule || 
                          response?.data?.content || 
                          response?.data || 
                          response || 
                          [];

      setSchedule(Array.isArray(scheduleData) ? scheduleData : []);

    } catch (error) {
      console.error('Lỗi khi tải lịch dạy:', error);
    } finally {
      setLoading(false);
    }
  }, [teacherId, selectedDate, viewMode]);

  useEffect(() => {
    loadScheduleData();
  }, [loadScheduleData]);

  const getWeekDays = () => {
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const getDayName = (date) => {
    const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    return days[date.getDay()];
  };

  const getScheduleForDay = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return schedule.filter(item => item.date === dateStr);
  };

  const getTimeSlotColor = (time) => {
    if (!time) return 'bg-gray-100 text-gray-800';
    const hour = parseInt(time.split(':')[0]);
    if (isNaN(hour)) return 'bg-gray-100 text-gray-800';
    if (hour < 8) return 'bg-red-100 text-red-800';
    if (hour < 12) return 'bg-green-100 text-green-800';
    if (hour < 17) return 'bg-yellow-100 text-yellow-800';
    return 'bg-blue-100 text-blue-800';
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
        <h1 className="text-2xl font-bold text-gray-900">Lịch dạy</h1>
        <p className="mt-1 text-sm text-gray-500">
          Xem lịch dạy hàng tuần và theo ngày của bạn
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <div className="flex rounded-md shadow-sm">
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-2 text-sm font-medium rounded-l-md border ${
                viewMode === 'week'
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              Tuần
            </button>
            <button
              onClick={() => setViewMode('day')}
              className={`px-3 py-2 text-sm font-medium rounded-r-md border ${
                viewMode === 'day'
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              Ngày
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              const newDate = new Date(selectedDate);
              newDate.setDate(selectedDate.getDate() - (viewMode === 'week' ? 7 : 1));
              setSelectedDate(newDate);
            }}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-sm font-medium text-gray-700">
            {viewMode === 'week' 
              ? `Tuần ${Math.ceil(selectedDate.getDate() / 7)}`
              : selectedDate.toLocaleDateString('vi-VN')
            }
          </span>
          <button
            onClick={() => {
              const newDate = new Date(selectedDate);
              newDate.setDate(selectedDate.getDate() + (viewMode === 'week' ? 7 : 1));
              setSelectedDate(newDate);
            }}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Schedule Content */}
      {viewMode === 'week' ? (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="grid grid-cols-8 border-b border-gray-200">
            <div className="p-4 text-sm font-medium text-gray-500">Thời gian</div>
            {getWeekDays().map((day, index) => (
              <div key={index} className="p-4 text-center">
                <div className="text-sm font-medium text-gray-900">{getDayName(day)}</div>
                <div className="text-xs text-gray-500">{day.getDate()}</div>
              </div>
            ))}
          </div>
          
          {/* Time slots */}
          {Array.from({ length: 12 }, (_, i) => i + 7).map(hour => (
            <div key={hour} className="grid grid-cols-8 border-b border-gray-100">
              <div className="p-4 text-sm text-gray-500 border-r border-gray-200">
                {hour}:00
              </div>
              {getWeekDays().map((day, dayIndex) => {
                const daySchedule = getScheduleForDay(day);
                
                const classAtTime = daySchedule.find(item => {
                  if (!item.startTime) return false;
                  const startHour = parseInt(item.startTime.split(':')[0]);
                  return startHour === hour;
                });
                
                return (
                  <div key={dayIndex} className="p-2 border-r border-gray-100">
                    {classAtTime ? (
                      <div className={`p-2 rounded text-xs ${getTimeSlotColor(classAtTime.startTime)}`}>
                        <div className="font-medium">{classAtTime.subjectName || 'N/A'}</div>
                        <div className="text-xs opacity-75">{classAtTime.className || 'N/A'}</div>
                        <div className="text-xs opacity-75">{classAtTime.room || 'N/A'}</div>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {getScheduleForDay(selectedDate).length > 0 ? (
            getScheduleForDay(selectedDate).map((item, index) => (
              <div key={index} className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <BookOpenIcon className="h-8 w-8 text-indigo-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">{item.subjectName || 'N/A'}</h3>
                      <p className="text-sm text-gray-500">{item.className || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      <span>{item.startTime || 'N/A'} - {item.endTime || 'N/A'}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPinIcon className="h-4 w-4 mr-1" />
                      <span>{item.room || 'N/A'}</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-600">
                    <UserIcon className="h-4 w-4 mr-1" />
                    <span>Sinh viên: {item.studentCount || 0}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <AcademicCapIcon className="h-4 w-4 mr-1" />
                    <span>Lớp: {item.classCode || 'N/A'}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Không có lịch dạy</h3>
              <p className="mt-1 text-sm text-gray-500">
                Không có lịch dạy nào vào ngày {selectedDate.toLocaleDateString('vi-VN')}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <BookOpenIcon className="h-8 w-8 text-indigo-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Tổng số môn</p>
              <p className="text-2xl font-semibold text-gray-900">
                {new Set(schedule.map(item => item.subjectName)).size}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ClockIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Giờ dạy/tuần</p>
              <p className="text-2xl font-semibold text-gray-900">
                {schedule.length * 2}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AcademicCapIcon className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Lớp học</p>
              <p className="text-2xl font-semibold text-gray-900">
                {new Set(schedule.map(item => item.className)).size}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherSchedule;
