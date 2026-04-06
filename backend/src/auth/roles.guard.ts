import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Не авторизован');
    }

    // Получаем пользователя из базы с его ролью
    const dbUser = await this.prisma.user.findUnique({
      where: { id: user.userId },
    });

    if (!dbUser) {
      throw new ForbiddenException('Пользователь не найден');
    }

    return requiredRoles.includes(dbUser.role);
  }
}
