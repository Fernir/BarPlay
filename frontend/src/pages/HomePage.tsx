import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Music, Users, Clock } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Layout } from '../components/Layout';
import { SongInfo } from '../components/SongInfo';
import { Song, Artist } from '../types';
import { artistService } from '../services/artistService';

const difficultyLabels: Record<string, string> = {
  BEGINNER: 'Начинающий',
  MEDIUM: 'Средний',
  ADVANCED: 'Продвинутый',
};

export const HomePage: React.FC = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [recentSongs, setRecentSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'artists' | 'recent'>('artists');
  const { user } = useAuth();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [artistsData, recentData] = await Promise.all([
        artistService.getArtists(),
        artistService.getRecentSongs(10),
      ]);
      setArtists(artistsData);
      setRecentSongs(recentData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        {/* Вкладки */}
        <div className="flex gap-2 mb-6 border-b dark:border-gray-700">
          <button
            onClick={() => setActiveTab('artists')}
            className={`flex items-center gap-2 px-4 py-2 font-medium transition ${
              activeTab === 'artists'
                ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
            }`}
          >
            <Users size={18} />
            Исполнители
          </button>
          <button
            onClick={() => setActiveTab('recent')}
            className={`flex items-center gap-2 px-4 py-2 font-medium transition ${
              activeTab === 'recent'
                ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
            }`}
          >
            <Clock size={18} />
            Новые добавления
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          </div>
        ) : activeTab === 'artists' ? (
          // Список исполнителей
          <div className="grid gap-3 sm:gap-4">
            {artists.map((artist, index) => (
              <Link
                key={artist.normalizedName || index} // <-- Добавлен уникальный key
                to={`/artist/${encodeURIComponent(artist.name)}`}
                className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-sm hover:shadow-md 
                         transition border border-gray-100 dark:border-gray-700
                         hover:border-gray-200 dark:hover:border-gray-600"
              >
                <div className="flex justify-between items-center flex-wrap gap-3">
                  <div>
                    <div className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white">
                      {artist.name}
                    </div>
                    <div className="flex gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
                      <span>{artist.songCount} песен</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}

            {artists.length === 0 && (
              <div className="text-center py-12">
                <Music size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">Пока нет исполнителей</p>
              </div>
            )}
          </div>
        ) : (
          // Список последних песен
          <div className="grid gap-3 sm:gap-4">
            {recentSongs.map((song) => (
              <Link
                key={song.id} // <-- Добавлен уникальный key (id песни)
                to={`/songs/${song.id}`}
                className="card flex justify-between items-center p-4"
              >
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white">
                  {song.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-2">{song.artist}</p>
                <SongInfo song={song} />
              </Link>
            ))}

            {recentSongs.length === 0 && (
              <div className="text-center py-12">
                <Music size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">Пока нет песен</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};
