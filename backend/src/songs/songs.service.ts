import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSongDto, UpdateSongDto } from './dto/song.dto';
import { Difficulty, Prisma } from '@prisma/client';

@Injectable()
export class SongsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateSongDto) {
    return this.prisma.song.create({
      data: {
        title: dto.title,
        artist: dto.artist,
        lyrics: dto.lyrics,
        key: dto.key,
        difficulty: dto.difficulty || Difficulty.MEDIUM,
        authorId: userId,
      },
      include: { author: { select: { username: true, id: true } } },
    });
  }

  async findAll(page: number = 1, limit: number = 20, search?: string) {
    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { artist: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [songs, total] = await Promise.all([
      this.prisma.song.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          author: { select: { username: true, id: true } },
          likes: true,
          _count: {
            select: {
              likes: true, // Считаем лайки
              comments: true, // Считаем комментарии
            },
          },
        },
      }),
      this.prisma.song.count({ where }),
    ]);

    return { songs, total, page, totalPages: Math.ceil(total / limit) };
  }

  // Вспомогательная функция для получения IP
  private getClientIp(req: Request): string {
    // Пробуем получить IP из разных заголовков (для работы за прокси)
    const forwarded = req.headers['x-forwarded-for'];
    const realIp = req.headers['x-real-ip'];

    if (forwarded && typeof forwarded === 'string') {
      return forwarded.split(',')[0].trim();
    }

    if (realIp && typeof realIp === 'string') {
      return realIp;
    }

    // Для Express, connection встроен в Request
    const connection = (req as any).connection;
    const socket = (req as any).socket;

    if (connection && connection.remoteAddress) {
      return connection.remoteAddress;
    }

    if (socket && socket.remoteAddress) {
      return socket.remoteAddress;
    }

    return 'unknown';
  }

  async findOne(id: string, req?: Request) {
    const song = await this.prisma.song.findUnique({
      where: { id },
      include: {
        author: { select: { username: true, id: true } },
        comments: {
          include: { user: { select: { username: true } } },
          orderBy: { createdAt: 'desc' },
        },
        likes: true,
        _count: {
          select: {
            likes: true, // Добавляем счетчик лайков
            comments: true, // Добавляем счетчик комментариев
          },
        },
      },
    });

    if (!song) throw new NotFoundException('Песня не найдена');

    // Проверяем, нужно ли увеличивать счетчик просмотров
    let shouldIncrement = true;

    if (req) {
      const clientIp = this.getClientIp(req);

      // Проверяем, был ли просмотр с этого IP за последние 24 часа
      const existingView = await this.prisma.view.findFirst({
        where: {
          songId: id,
          ip: clientIp,
          createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        },
      });

      if (existingView) {
        shouldIncrement = false;
      } else if (clientIp !== 'unknown') {
        // Создаем запись о просмотре только если IP не unknown
        await this.prisma.view.create({
          data: {
            songId: id,
            ip: clientIp,
          },
        });
      }
    }

    if (shouldIncrement) {
      await this.prisma.song.update({
        where: { id },
        data: { viewCount: { increment: 1 } },
      });
      song.viewCount++;
    }

    return song;
  }

  async update(id: string, userId: string, dto: UpdateSongDto, userRole: string) {
    const song = await this.prisma.song.findUnique({ where: { id } });

    if (!song) throw new NotFoundException('Песня не найдена');

    if (song.authorId !== userId && userRole !== 'ADMIN' && userRole !== 'MODERATOR') {
      throw new ForbiddenException('Нет прав для редактирования');
    }

    return this.prisma.song.update({
      where: { id },
      data: {
        title: dto.title,
        artist: dto.artist,
        lyrics: dto.lyrics,
        key: dto.key,
        difficulty: dto.difficulty,
      },
      include: { author: { select: { username: true } } },
    });
  }

  async delete(id: string, userId: string, userRole: string) {
    const song = await this.prisma.song.findUnique({ where: { id } });

    if (!song) throw new NotFoundException('Песня не найдена');

    if (song.authorId !== userId && userRole !== 'ADMIN') {
      throw new ForbiddenException('Нет прав для удаления');
    }

    return this.prisma.song.delete({ where: { id } });
  }

  async toggleLike(songId: string, userId: string) {
    const existing = await this.prisma.like.findUnique({
      where: {
        userId_songId: { userId, songId },
      },
    });

    if (existing) {
      await this.prisma.like.delete({ where: { id: existing.id } });
      return { liked: false };
    } else {
      await this.prisma.like.create({ data: { userId, songId } });
      return { liked: true };
    }
  }

  async getGroupedArtists() {
    // Получаем всех уникальных исполнителей
    const artists = await this.prisma.song.findMany({
      select: { artist: true },
      distinct: ['artist'],
      orderBy: { artist: 'asc' },
    });

    const artistNames = artists.map((a) => a.artist);
    const groups: Map<string, { names: string[]; songs: any[]; totalLikes: number }> = new Map();

    // Для каждого исполнителя ищем похожих
    for (const artist of artistNames) {
      // Ищем все песни этого исполнителя и похожих
      const similarArtists = artistNames.filter((name) => {
        const nameLower = name.toLowerCase();
        const artistLower = artist.toLowerCase();

        // Проверяем совпадение по фамилии (последнему слову)
        const artistLastName = artistLower.split(/\s+/).pop();
        const nameLastName = nameLower.split(/\s+/).pop();

        // Проверяем вхождение одного имени в другое
        const isContained = nameLower.includes(artistLower) || artistLower.includes(nameLower);

        // Проверяем совпадение фамилий
        const sameLastName =
          artistLastName &&
          nameLastName &&
          (artistLastName === nameLastName ||
            artistLastName.includes(nameLastName) ||
            nameLastName.includes(artistLastName));

        return isContained || sameLastName;
      });

      // Берем ключ группы (самое длинное имя)
      const groupKey = similarArtists.sort((a, b) => b.length - a.length)[0];

      if (!groups.has(groupKey)) {
        // Получаем все песни этой группы
        const songs = await this.prisma.song.findMany({
          where: {
            artist: { in: similarArtists },
          },
          include: {
            likes: true,
            _count: { select: { likes: true, comments: true } },
            author: { select: { username: true } },
          },
        });

        const totalLikes = songs.reduce((sum, s) => sum + (s._count?.likes || 0), 0);

        groups.set(groupKey, {
          names: [...new Set(similarArtists)],
          songs,
          totalLikes,
        });
      }
    }

    // Преобразуем в массив и сортируем по количеству песен
    return Array.from(groups.entries())
      .map(([name, data]) => ({
        name,
        names: data.names,
        songCount: data.songs.length,
        totalLikes: data.totalLikes,
        songs: data.songs,
      }))
      .sort((a, b) => b.songCount - a.songCount);
  }
}
