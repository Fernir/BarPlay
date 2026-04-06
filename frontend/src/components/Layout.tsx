import React from 'react';
import { Link } from 'react-router-dom';
import { Music, Shield, LogOut, Plus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { ThemeToggle } from './ThemeToggle';

interface LayoutProps {
  children: React.ReactNode;
  showAddButton?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, showAddButton = true }) => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10 transition-colors">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex justify-between items-center">
            {/* Логотип */}
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <Music size={24} className="sm:w-8 sm:h-8 text-indigo-600 dark:text-indigo-400" />
              <h1 className="text-lg sm:text-2xl font-bold text-gray-800 dark:text-white">
                <span className="inline xs:hidden">Chordplay</span>
              </h1>
            </Link>

            {/* Правая часть */}
            <div className="flex gap-1 sm:gap-2 items-center">
              <ThemeToggle />

              {user?.role === 'ADMIN' && (
                <Link
                  to="/admin"
                  className="p-1.5 sm:p-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                  title="Админ-панель"
                >
                  <Shield size={18} className="sm:w-5 sm:h-5" />
                </Link>
              )}

              {user ? (
                <>
                  {showAddButton && (
                    <Link
                      to="/add"
                      className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 
                               text-xs sm:text-sm bg-indigo-600 hover:bg-indigo-700 
                               text-white rounded-lg transition"
                      title="Добавить песню"
                    >
                      <Plus size={14} className="sm:w-4 sm:h-4" />
                      <span className="hidden xs:inline">Добавить</span>
                    </Link>
                  )}

                  <button
                    onClick={logout}
                    className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 
                             text-xs sm:text-sm text-red-600 dark:text-red-400 
                             hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition"
                    title="Выйти"
                  >
                    <LogOut size={14} className="sm:w-4 sm:h-4" />
                    <span className="hidden md:inline">{user.username}</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base 
                           bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition"
                >
                  Войти
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Основной контент */}
      <main className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-8">{children}</main>
    </div>
  );
};
