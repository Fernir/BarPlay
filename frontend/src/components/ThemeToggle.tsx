import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={() => {
        toggleTheme();
      }}
      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      aria-label="Переключить тему"
    >
      {theme === 'light' ? (
        <Moon size={20} className="text-gray-600 dark:text-gray-400" />
      ) : (
        <Sun size={20} className="text-gray-600 dark:text-gray-400" />
      )}
    </button>
  );
};
