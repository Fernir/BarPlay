import { Song, Artist } from '../types';
import { api } from './api';

export const artistService = {
  // Получить всех исполнителей (уже сгруппированных)
  async getArtists(): Promise<Artist[]> {
    const response = await api.getGroupedArtists();
    return response;
  },

  // Получить песни исполнителя
  getArtistSongs(artists: Artist[], artistName: string): Song[] {
    const artist = artists.find((a) => a.name === artistName);
    if (!artist) return [];

    // Сортируем по лайкам
    return [...artist.songs].sort((a, b) => {
      const likesA = a._count?.likes ?? 0;
      const likesB = b._count?.likes ?? 0;
      return likesB - likesA;
    });
  },

  // Получить последние 10 песен
  async getRecentSongs(limit: number = 10): Promise<Song[]> {
    const songs = await api.getSongs();

    return songs
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  },
};
