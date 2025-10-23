import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import {
  HomeIcon,
  AcademicCapIcon,
  UserGroupIcon,
  BookOpenIcon,
  CalendarIcon,
  ChartBarIcon,
  CogIcon
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Listen for mobile menu toggle events
  useEffect(() => {
    const handleMobileMenuToggle = () => {
      setIsMobileMenuOpen(prev => !prev);
    };

    window.addEventListener('mobileMenuToggle', handleMobileMenuToggle);
    return () => {
      window.removeEventListener('mobileMenuToggle', handleMobileMenuToggle);
    };
  }, []);

  // Menu items dựa trên role
  const getMenuItems = () => {
    const role = user?.roles?.[0]?.roleName?.toLowerCase();
    
    const commonItems = [
      { name: 'Trang chủ', path: '/dashboard', icon: HomeIcon },
      { name: 'Hồ sơ', path: '/profile', icon: UserGroupIcon },
    ];

    switch (role) {
      case 'admin':
        return [
          { name: 'Trang chủ', path: '/admin/dashboard', icon: HomeIcon },
          { name: 'Hồ sơ', path: '/profile', icon: UserGroupIcon },
          { name: 'Quản lý người dùng', path: '/admin/users', icon: UserGroupIcon },
          { name: 'Quản lý sinh viên', path: '/admin/students', icon: UserGroupIcon },
          { name: 'Quản lý giáo viên', path: '/admin/teachers', icon: AcademicCapIcon },
          { name: 'Quản lý môn học & lớp học', path: '/admin/subjects-classes', icon: BookOpenIcon },
          { name: 'Quản lý học kỳ & năm học', path: '/admin/semesters', icon: CalendarIcon },
          { name: 'Báo cáo', path: '/admin/reports', icon: ChartBarIcon },
          { name: 'Cài đặt', path: '/admin/settings', icon: CogIcon },
        ];
      
      case 'teacher':
        return [
          { name: 'Trang chủ', path: '/teacher/dashboard', icon: HomeIcon },
          { name: 'Hồ sơ', path: '/profile', icon: UserGroupIcon },
          { name: 'Lớp học của tôi', path: '/teacher/classes', icon: AcademicCapIcon },
          { name: 'Môn học', path: '/teacher/subjects', icon: BookOpenIcon },
          { name: 'Lịch dạy', path: '/teacher/schedule', icon: CalendarIcon },
          { name: 'Điểm danh', path: '/teacher/attendance', icon: UserGroupIcon },
          { name: 'Chấm điểm', path: '/teacher/grades', icon: ChartBarIcon },
        ];
      
      case 'student':
        return [
          { name: 'Trang chủ', path: '/student/dashboard', icon: HomeIcon },
          { name: 'Hồ sơ', path: '/profile', icon: UserGroupIcon },
          { name: 'Lớp học', path: '/student/classes', icon: AcademicCapIcon },
          { name: 'Môn học', path: '/student/subjects', icon: BookOpenIcon },
          { name: 'Lịch học', path: '/student/schedule', icon: CalendarIcon },
          { name: 'Điểm số', path: '/student/grades', icon: ChartBarIcon },
          { name: 'Điểm danh', path: '/student/attendance', icon: UserGroupIcon },
        ];
      
      default:
        return commonItems;
    }
  };

  const menuItems = getMenuItems();

  return (
    <>
      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        w-64 bg-white shadow-sm border-r border-gray-200 h-screen sticky top-16 overflow-y-auto
        ${isMobileMenuOpen ? 'fixed left-0 z-40' : 'hidden lg:block'}
      `}>
      <nav className="mt-6">
        <div className="px-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                    isActive
                      ? 'bg-primary-100 text-primary-700 border-r-2 border-primary-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                {item.name}
              </NavLink>
            );
          })}
        </div>
      </nav>
    </aside>
    </>
  );
};

export default Sidebar;
