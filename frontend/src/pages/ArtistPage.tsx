import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Music, Heart } from 'lucide-react';
import { Layout } from '../components/Layout';
import { SongInfo } from '../components/SongInfo';
import { Song } from '../types';
import { artistService } from '../services/artistService';

export const ArtistPage: React.FC = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const [artist, setArtist] = useState<any>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArtist();
  }, [name]);

  const loadArtist = async () => {
    setLoading(true);
    try {
      const artists = await artistService.getArtists();
      const foundArtist = artists.find((a) => a.name === decodeURIComponent(name!));
      if (foundArtist) {
        setArtist(foundArtist);
        // Сортируем песни по лайкам
        const sortedSongs = [...foundArtist.songs].sort(
          (a, b) => (b?.likes?.length ?? 0) - (a?.likes?.length ?? 0)
        );
        setSongs(sortedSongs);
      }
    } catch (error) {
      console.error('Error loading artist:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        </div>
      </Layout>
    );
  }

  if (!artist) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-gray-500">Исполнитель не найден</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-6"
      >
        <ArrowLeft size={20} /> Назад
      </button>

      {/* Информация об исполнителе */}
      <h1 className="text-2xl font-bold mb-6">{artist.name}</h1>

      <div className="grid gap-3">
        {songs.map((song) => (
          <Link
            key={song.id}
            to={`/songs/${song.id}`}
            className="card p-3 flex justify-between items-center"
          >
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{song.title}</h3>
            <SongInfo song={song} />
          </Link>
        ))}
      </div>
    </Layout>
  );
};
