import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Music, Mail, Lock, User, LogIn, UserPlus } from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';

export const LoginPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, username, password);
      }
      navigate('/');
    } catch (err) {
      setError('Ошибка авторизации. Проверьте данные.');
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-700 via-slate-600 to-slate-500 
                    dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 
                    flex items-center justify-center p-4 transition-colors"
    >
      <div className="relative w-full max-w-md">
        {/* Кнопка переключения темы */}
        <div className="absolute top-2 right-2 z-10">
          <ThemeToggle />
        </div>

        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 transition-colors">
          {/* Логотип */}
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-br from-slate-600 to-slate-500 dark:from-slate-600 dark:to-slate-500 p-4 rounded-full shadow-lg">
              <Music size={48} className="text-white" />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-2">
            {isLogin ? 'Добро пожаловать!' : 'Создать аккаунт'}
          </h2>

          <p className="text-center text-gray-500 dark:text-gray-400 mb-8">
            {isLogin ? 'Войдите чтобы продолжить' : 'Зарегистрируйтесь чтобы добавлять песни'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Имя пользователя
                </label>
                <div className="relative">
                  <User
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
                    size={20}
                  />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                             rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 
                             transition-colors"
                    placeholder="Введите имя пользователя"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
                  size={20}
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                           rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 
                           transition-colors"
                  placeholder="example@mail.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Пароль
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
                  size={20}
                />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                           rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 
                           transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm text-center p-3 rounded-xl">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-slate-600 to-slate-500 
                       hover:from-slate-700 hover:to-slate-600 dark:from-slate-500 dark:to-slate-400 
                       dark:hover:from-slate-600 dark:hover:to-slate-500
                       text-white py-3 rounded-xl transition-all transform hover:scale-[1.02] font-medium text-lg"
            >
              {isLogin ? <LogIn size={20} /> : <UserPlus size={20} />}
              {isLogin ? 'Войти' : 'Зарегистрироваться'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              {isLogin ? 'Нет аккаунта? ' : 'Уже есть аккаунт? '}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-slate-600 dark:text-slate-400 hover:underline font-medium ml-1"
              >
                {isLogin ? 'Создать аккаунт' : 'Войти'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
