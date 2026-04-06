import { api } from '../services/api';
import { Eye, Guitar, Music2, User, Heart, HeartIcon } from 'lucide-react';
import { Song } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

const difficultyLabels: Record<string, string> = {
  BEGINNER: 'Начинающий',
  MEDIUM: 'Средний',
  ADVANCED: 'Продвинутый',
};

export const SongInfo = ({ song }: { song: Song }) => {
  const { user } = useAuth();

  const [isLiked, setLiked] = useState(
    song?.likes?.some?.((like) => like.userId === user?.id) ?? false
  );

  const [likedCount, setLikedCount] = useState(song._count?.likes ?? song.likes?.length ?? 0);

  const handleLike = async (e: unknown) => {
    (e as MouseEvent).preventDefault();
    await api.likeSong(song.id!);
    setLiked((o) => !o);
    setLikedCount((o) => Math.max(0, isLiked ? --o : ++o));
  };

  if (!song?.key) return null;

  return (
    <div className="flex flex-wrap gap-3 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
      <span className="inline-flex items-center gap-1">
        <Guitar size={14} className="sm:w-[18px] sm:h-[18px]" />
        <span className="truncate">
          {difficultyLabels[song.difficulty] || song.difficulty || 'Средний'}
        </span>
      </span>

      <span className="inline-flex items-center gap-1">
        <Music2 size={14} className="sm:w-[18px] sm:h-[18px]" />
        <span>{song.key}</span>
      </span>

      <span className="inline-flex items-center gap-1">
        <Eye size={14} className="sm:w-[18px] sm:h-[18px]" />
        <span>{song.viewCount}</span>
      </span>

      <span
        className="inline-flex items-center gap-1 select-none cursor-pointer font-mono"
        onClick={handleLike}
      >
        {isLiked ? (
          <Heart
            size={14}
            className="sm:w-[18px] sm:h-[18px] fill-red-500 stroke-red-500 transition-all"
          />
        ) : (
          <Heart size={14} className="sm:w-[18px] sm:h-[18px] stroke-red-500  transition-all" />
        )}
        <span>{likedCount}</span>
      </span>

      {song.author && (
        <span className="inline-flex items-center gap-1">
          <User size={14} className="sm:w-[18px] sm:h-[18px]" />
          <span className="truncate max-w-[100px] sm:max-w-none">{song.author.username}</span>
        </span>
      )}
    </div>
  );
};
