import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { 
  BellIcon, 
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const Header = () => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    // Dispatch custom event for sidebar to listen
    window.dispatchEvent(new CustomEvent('mobileMenuToggle'));
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Mobile menu button */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden p-2 text-gray-400 hover:text-gray-500"
          >
            {isMobileMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>

          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-lg lg:text-xl font-bold text-primary-600">
              <span className="hidden sm:inline">SMS - School Management System</span>
              <span className="sm:hidden">SMS</span>
            </h1>
          </div>

          {/* User menu */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="p-2 text-gray-400 hover:text-gray-500">
              <BellIcon className="h-6 w-6" />
            </button>

            {/* User info */}
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user?.fullName || user?.username}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.role?.name}
                </p>
              </div>
              <UserCircleIcon className="h-8 w-8 text-gray-400" />
            </div>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-500 hover:text-gray-700"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
              <span className="text-sm">Đăng xuất</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
