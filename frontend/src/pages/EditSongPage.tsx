import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { api } from '../services/api';
import { Layout } from '../components/Layout';
import { SongForm } from '../components/SongForm';
import { Song } from '../types';

export const EditSongPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [initialData, setInitialData] = useState<Song>();

  useEffect(() => {
    api.getSong(id!).then((song) => {
      setInitialData(song);
      setLoading(false);
    });
  }, [id]);

  const handleSubmit = async (data: any) => {
    setSaving(true);
    try {
      await api.updateSong(id!, data);
      navigate(`/songs/${id}`);
    } catch (error) {
      alert('Ошибка при сохранении');
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return <div className="min-h-screen flex items-center justify-center">Загрузка...</div>;

  return (
    <Layout showAddButton={false}>
      <button
        onClick={() => navigate(`/songs/${id}`)}
        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-6"
      >
        <ArrowLeft size={20} /> Назад к песне
      </button>
      <SongForm
        initialData={initialData}
        onSubmit={handleSubmit}
        isLoading={saving}
        buttonText="Сохранить изменения"
        title="Редактировать песню"
      />
    </Layout>
  );
};
