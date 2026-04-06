export interface Like {
  id: string;
  userId: string;
  songId: string;
}

export interface Comment {
  id: string;
  content: string;
  userId: string;
  songId: string;
  createdAt: string;
  user?: {
    username: string;
  };
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  lyrics: string;
  difficulty: 'BEGINNER' | 'MEDIUM' | 'ADVANCED';
  key: string;
  viewCount: number;
  likes: Like[];
  authorId: string;
  author?: { username: string };
  createdAt: string;
  updatedAt: string;
  comments: Comment[];
  _count?: {
    likes: number;
    comments: number;
  };
}

export interface Artist {
  name: string;
  normalizedName: string;
  songCount: number;
  totalLikes: number;
  songs: Song[];
}
