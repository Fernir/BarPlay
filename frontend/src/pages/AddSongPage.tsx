import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { api } from '../services/api';
import { Layout } from '../components/Layout';
import { SongForm } from '../components/SongForm';

export const AddSongPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    setLoading(true);
    try {
      await api.createSong(data);
      navigate('/');
    } catch (error) {
      alert('Ошибка при сохранении');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout showAddButton={false}>
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-6"
      >
        <ArrowLeft size={20} /> Назад
      </button>
      <SongForm
        onSubmit={handleSubmit}
        isLoading={loading}
        buttonText="Сохранить песню"
        title="Добавить песню"
      />
    </Layout>
  );
};
