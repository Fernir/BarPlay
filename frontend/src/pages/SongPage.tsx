import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { SongViewer } from '../components/SongViewer';
import { SongInfo } from '../components/SongInfo';
import { Layout } from '../components/Layout';
import { useConfirm } from '../hooks/useConfirm';

export const SongPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { confirm, ConfirmModal } = useConfirm();
  const [song, setSong] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [textSize, setTextSize] = useState(() => {
    const saved = localStorage.getItem('songTextSize');
    return saved ? parseInt(saved) : 16;
  });

  const canEdit =
    user?.id === song?.author?.id || user?.role === 'ADMIN' || user?.role === 'MODERATOR';
  const canDelete = user?.id === song?.author?.id || user?.role === 'ADMIN';

  useEffect(() => {
    if (id) loadSong();
  }, [id]);

  useEffect(() => {
    localStorage.setItem('songTextSize', String(textSize));
  }, [textSize]);

  const loadSong = async () => {
    try {
      const data = await api.getSong(id!);
      setSong(data);
    } catch (error) {
      console.error('Error loading song:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = await confirm({
      title: 'Удаление песни',
      message: `Вы уверены, что хотите удалить песню "${song?.title}"? Это действие нельзя отменить.`,
      confirmText: 'Да, удалить',
      cancelText: 'Отмена',
      variant: 'danger',
    });

    if (confirmed) {
      await api.deleteSong(id!);
      navigate('/');
    }
  };

  const increaseTextSize = () => setTextSize((prev) => Math.min(prev + 2, 28));
  const decreaseTextSize = () => setTextSize((prev) => Math.max(prev - 2, 8));
  const resetTextSize = () => setTextSize(16);

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        </div>
      </Layout>
    );
  }

  if (!song) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-gray-500">Песня не найдена</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <ConfirmModal />
      <div className="max-w-4xl mx-auto">
        {/* Навигация */}
        <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)} // Возврат на предыдущую страницу
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              <ArrowLeft size={20} /> Назад
            </button>
          </div>

          <div className="flex gap-2">
            {/* Кнопки изменения размера текста */}
            <div className="flex items-center gap-1 mr-2 border-r border-gray-300 dark:border-gray-600 pr-3">
              <button
                onClick={decreaseTextSize}
                className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                title="Уменьшить текст"
              >
                <ZoomOut size={18} />
              </button>
              <button
                onClick={resetTextSize}
                className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                title="Сбросить размер"
              >
                <RotateCcw size={16} />
              </button>
              <button
                onClick={increaseTextSize}
                className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                title="Увеличить текст"
              >
                <ZoomIn size={18} />
              </button>
            </div>

            {canEdit && (
              <button
                onClick={() => navigate(`/edit/${song.id}`)}
                className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-lg transition"
              >
                <Edit size={20} />
              </button>
            )}
            {canDelete && (
              <button
                onClick={handleDelete}
                className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition"
              >
                <Trash2 size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Информация о песне */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 sm:p-8 transition-colors">
          <div className="flex flex-wrap justify-between items-center">
            <h1 className="text-2xl font-bold mb-2 break-words">{song.title}</h1>
            <span className=" text-gray-400">{song.artist}</span>
            <SongInfo song={song} />
          </div>

          {/* Текст песни с аккордами */}
          <div className="transition-all duration-200" style={{ fontSize: `${textSize}px` }}>
            <SongViewer lyrics={song.lyrics} />
          </div>
        </div>
      </div>
    </Layout>
  );
};
