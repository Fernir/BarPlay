import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SongsService } from './songs.service';
import { CreateSongDto, UpdateSongDto } from './dto/song.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';

// Мокаем PrismaService
const mockPrismaService = {
  song: {
    create: vi.fn(),
    findMany: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    count: vi.fn(),
  },
  like: {
    findUnique: vi.fn(),
    create: vi.fn(),
    delete: vi.fn(),
    count: vi.fn(),
  },
  comment: {
    findMany: vi.fn(),
    count: vi.fn(),
  },
  view: {
    findFirst: vi.fn(),
    create: vi.fn(),
  },
};

describe('SongsService', () => {
  let service: SongsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SongsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<SongsService>(SongsService);
    prisma = module.get<PrismaService>(PrismaService);

    vi.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new song', async () => {
      const userId = 'user-1';
      const createSongDto: CreateSongDto = {
        title: 'Test Song',
        artist: 'Test Artist',
        lyrics: '[C]Test lyrics',
        key: 'C',
        difficulty: 'MEDIUM',
      };

      const expectedSong = {
        id: 'song-1',
        ...createSongDto,
        authorId: userId,
        viewCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.song.create.mockResolvedValue(expectedSong);

      const result = await service.create(userId, createSongDto);

      expect(result).toEqual(expectedSong);
      expect(mockPrismaService.song.create).toHaveBeenCalledWith({
        data: {
          ...createSongDto,
          authorId: userId,
        },
        include: { author: { select: { username: true, id: true } } },
      });
    });

    it('should set default difficulty to MEDIUM', async () => {
      const userId = 'user-1';
      const createSongDto: CreateSongDto = {
        title: 'Test Song',
        artist: 'Test Artist',
        lyrics: '[C]Test lyrics',
        key: 'C',
      };

      const expectedSong = {
        id: 'song-1',
        ...createSongDto,
        difficulty: 'MEDIUM',
        authorId: userId,
        viewCount: 0,
      };

      mockPrismaService.song.create.mockResolvedValue(expectedSong);

      const result = await service.create(userId, createSongDto);

      expect(result.difficulty).toBe('MEDIUM');
    });
  });

  describe('findAll', () => {
    it('should return an array of songs with pagination', async () => {
      const mockSongs = [
        { id: '1', title: 'Song 1', artist: 'Artist 1', _count: { likes: 5, comments: 2 } },
        { id: '2', title: 'Song 2', artist: 'Artist 2', _count: { likes: 3, comments: 1 } },
      ];

      mockPrismaService.song.findMany.mockResolvedValue(mockSongs);
      mockPrismaService.song.count.mockResolvedValue(2);
      mockPrismaService.like.count.mockResolvedValue(0);
      mockPrismaService.comment.count.mockResolvedValue(0);

      const result = await service.findAll(1, 10);

      expect(result.songs).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
      expect(result.totalPages).toBe(1);
    });

    it('should filter by search term', async () => {
      mockPrismaService.song.findMany.mockResolvedValue([]);
      mockPrismaService.song.count.mockResolvedValue(0);

      await service.findAll(1, 10, 'test');

      expect(mockPrismaService.song.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            OR: [
              { title: { contains: 'test', mode: 'insensitive' } },
              { artist: { contains: 'test', mode: 'insensitive' } },
            ],
          },
        })
      );
    });
  });

  describe('findOne', () => {
    it('should return a song by id', async () => {
      const songId = 'song-1';
      const expectedSong = {
        id: songId,
        title: 'Test Song',
        artist: 'Test Artist',
        viewCount: 0,
        author: { username: 'author', id: 'user-1' },
        comments: [],
      };

      mockPrismaService.song.findUnique.mockResolvedValue(expectedSong);
      mockPrismaService.like.count.mockResolvedValue(5);
      mockPrismaService.comment.count.mockResolvedValue(2);
      mockPrismaService.comment.findMany.mockResolvedValue([]);
      mockPrismaService.view.findFirst.mockResolvedValue(null);
      mockPrismaService.view.create.mockResolvedValue({});
      mockPrismaService.song.update.mockResolvedValue({ ...expectedSong, viewCount: 1 });

      const result = await service.findOne(songId);

      expect(result.id).toBe(songId);
      expect(mockPrismaService.song.update).toHaveBeenCalled();
    });

    it('should throw NotFoundException for non-existent song', async () => {
      mockPrismaService.song.findUnique.mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow('Песня не найдена');
    });
  });

  describe('update', () => {
    it('should update a song', async () => {
      const songId = 'song-1';
      const userId = 'user-1';
      const userRole = 'USER';
      const updateDto: UpdateSongDto = { title: 'Updated Title' };

      const existingSong = {
        id: songId,
        title: 'Original Title',
        authorId: userId,
      };

      const updatedSong = { ...existingSong, ...updateDto };

      mockPrismaService.song.findUnique.mockResolvedValue(existingSong);
      mockPrismaService.song.update.mockResolvedValue(updatedSong);

      const result = await service.update(songId, userId, updateDto, userRole);

      expect(result.title).toBe('Updated Title');
    });

    it('should throw ForbiddenException when user is not author and not admin', async () => {
      const songId = 'song-1';
      const userId = 'user-2';
      const userRole = 'USER';
      const existingSong = {
        id: songId,
        authorId: 'user-1',
      };

      mockPrismaService.song.findUnique.mockResolvedValue(existingSong);

      await expect(service.update(songId, userId, {}, userRole)).rejects.toThrow(
        'Нет прав для редактирования'
      );
    });

    it('should allow admin to update any song', async () => {
      const songId = 'song-1';
      const userId = 'admin-1';
      const userRole = 'ADMIN';
      const updateDto: UpdateSongDto = { title: 'Updated by Admin' };

      const existingSong = {
        id: songId,
        title: 'Original Title',
        authorId: 'user-1',
      };

      const updatedSong = { ...existingSong, ...updateDto };

      mockPrismaService.song.findUnique.mockResolvedValue(existingSong);
      mockPrismaService.song.update.mockResolvedValue(updatedSong);

      const result = await service.update(songId, userId, updateDto, userRole);

      expect(result.title).toBe('Updated by Admin');
    });
  });

  describe('delete', () => {
    it('should delete a song', async () => {
      const songId = 'song-1';
      const userId = 'user-1';
      const userRole = 'USER';

      const existingSong = {
        id: songId,
        authorId: userId,
      };

      mockPrismaService.song.findUnique.mockResolvedValue(existingSong);
      mockPrismaService.song.delete.mockResolvedValue(existingSong);

      const result = await service.delete(songId, userId, userRole);

      expect(result).toEqual(existingSong);
    });

    it('should allow admin to delete any song', async () => {
      const songId = 'song-1';
      const userId = 'admin-1';
      const userRole = 'ADMIN';

      const existingSong = {
        id: songId,
        authorId: 'user-1',
      };

      mockPrismaService.song.findUnique.mockResolvedValue(existingSong);
      mockPrismaService.song.delete.mockResolvedValue(existingSong);

      const result = await service.delete(songId, userId, userRole);

      expect(result).toEqual(existingSong);
    });

    it('should throw ForbiddenException when user is not author and not admin', async () => {
      const songId = 'song-1';
      const userId = 'user-2';
      const userRole = 'USER';

      const existingSong = {
        id: songId,
        authorId: 'user-1',
      };

      mockPrismaService.song.findUnique.mockResolvedValue(existingSong);

      await expect(service.delete(songId, userId, userRole)).rejects.toThrow(
        'Нет прав для удаления'
      );
    });
  });

  describe('toggleLike', () => {
    it('should add like if not exists', async () => {
      const songId = 'song-1';
      const userId = 'user-1';

      mockPrismaService.like.findUnique.mockResolvedValue(null);
      mockPrismaService.like.create.mockResolvedValue({ id: 'like-1', userId, songId });

      const result = await service.toggleLike(songId, userId);

      expect(result.liked).toBe(true);
      expect(mockPrismaService.like.create).toHaveBeenCalled();
    });

    it('should remove like if exists', async () => {
      const songId = 'song-1';
      const userId = 'user-1';
      const existingLike = { id: 'like-1', userId, songId };

      mockPrismaService.like.findUnique.mockResolvedValue(existingLike);
      mockPrismaService.like.delete.mockResolvedValue(existingLike);

      const result = await service.toggleLike(songId, userId);

      expect(result.liked).toBe(false);
      expect(mockPrismaService.like.delete).toHaveBeenCalled();
    });
  });
});
