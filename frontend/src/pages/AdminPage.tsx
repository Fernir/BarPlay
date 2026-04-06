import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { Shield, Users, Music, Trash2, ArrowLeft } from 'lucide-react';
import { Layout } from '../components/Layout';
import { useConfirm } from '../hooks/useConfirm';

export const AdminPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const { confirm, ConfirmModal } = useConfirm();

  useEffect(() => {
    if (user?.role !== 'ADMIN') {
      navigate('/');
    } else {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      const [usersData, statsData] = await Promise.all([api.getUsers(), api.getStats()]);
      setUsers(usersData);
      setStats(statsData);
    } catch (error) {
      console.error(error);
    }
  };

  const handleBan = async (userId: string, username: string) => {
    const confirmed = await confirm({
      title: 'Удаление пользователя',
      message: `Вы уверены, что хотите удалить пользователя "${username}"? Все его песни и комментарии будут удалены.`,
      confirmText: 'Да, удалить',
      variant: 'danger',
    });

    if (confirmed) {
      await api.banUser(userId);
      await loadData();
    }
  };

  const handleRoleChange = async (userId: string, role: string) => {
    await api.updateUserRole(userId, role);
    await loadData();
  };

  if (!stats)
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-500 dark:text-gray-400">Загрузка...</div>
      </div>
    );

  return (
    <Layout>
      <ConfirmModal />
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-6 transition-colors"
      >
        <ArrowLeft size={20} /> На главную
      </button>

      <div className="flex items-center gap-3 mb-8">
        <Shield size={32} className="text-indigo-600 dark:text-indigo-400" />
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Админ-панель</h1>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm transition-colors">
          <Users size={32} className="text-blue-500 dark:text-blue-400 mb-2" />
          <div className="text-2xl font-bold text-gray-800 dark:text-white">{stats.totalUsers}</div>
          <div className="text-gray-600 dark:text-gray-400">Пользователей</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm transition-colors">
          <Music size={32} className="text-green-500 dark:text-green-400 mb-2" />
          <div className="text-2xl font-bold text-gray-800 dark:text-white">{stats.totalSongs}</div>
          <div className="text-gray-600 dark:text-gray-400">Песен</div>
        </div>
      </div>

      {/* Пользователи */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden transition-colors">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
            <tr>
              <th className="text-left p-4 text-gray-700 dark:text-gray-300">Username</th>
              <th className="text-left p-4 text-gray-700 dark:text-gray-300">Email</th>
              <th className="text-left p-4 text-gray-700 dark:text-gray-300">Роль</th>
              <th className="text-left p-4 text-gray-700 dark:text-gray-300">Песен</th>
              <th className="text-left p-4 text-gray-700 dark:text-gray-300">Действия</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr
                key={u.id}
                className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <td className="p-4 text-gray-800 dark:text-gray-200">{u.username}</td>
                <td className="p-4 text-gray-600 dark:text-gray-400">{u.email}</td>
                <td className="p-4">
                  <select
                    value={u.role}
                    onChange={(e) => handleRoleChange(u.id, e.target.value)}
                    disabled={u.role === 'ADMIN'}
                    className="px-2 py-1 border border-gray-300 dark:border-gray-600 
                               bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 
                               rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500
                               disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <option value="USER">User</option>
                    <option value="MODERATOR">Moderator</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </td>
                <td className="p-4 text-gray-600 dark:text-gray-400">{u._count?.songs || 0}</td>
                <td className="p-4">
                  <button
                    onClick={() => handleBan(u.id, u.username)}
                    className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors"
                    title="Удалить пользователя"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};
