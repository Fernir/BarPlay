import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            songs: true,
            comments: true,
            likes: true,
          },
        },
      },
    });
  }

  async getStats() {
    const [totalUsers, totalSongs, totalComments, totalLikes] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.song.count(),
      this.prisma.comment.count(),
      this.prisma.like.count(),
    ]);

    const topUsers = await this.prisma.user.findMany({
      take: 5,
      orderBy: {
        songs: {
          _count: 'desc',
        },
      },
      select: {
        username: true,
        _count: {
          select: { songs: true },
        },
      },
    });

    return {
      totalUsers,
      totalSongs,
      totalComments,
      totalLikes,
      topUsers,
    };
  }

  async updateRole(id: string, role: string, currentUserRole: string) {
    if (currentUserRole !== 'ADMIN') {
      throw new ForbiddenException('Нет прав для изменения роли');
    }

    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return this.prisma.user.update({
      where: { id },
      data: { role: role as any },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
      },
    });
  }

  async banUser(id: string, currentUserRole: string) {
    if (currentUserRole !== 'ADMIN') {
      throw new ForbiddenException('Нет прав для бана пользователя');
    }

    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    if (user.role === 'ADMIN') {
      throw new ForbiddenException('Нельзя удалить администратора');
    }

    // Удаляем все связанные данные
    await this.prisma.song.deleteMany({ where: { authorId: id } });
    await this.prisma.comment.deleteMany({ where: { userId: id } });
    await this.prisma.like.deleteMany({ where: { userId: id } });
    await this.prisma.user.delete({ where: { id } });

    return { message: 'Пользователь удален' };
  }
}
