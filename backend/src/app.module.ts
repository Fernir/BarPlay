import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { SongsModule } from './songs/songs.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [PrismaModule, SongsModule, AuthModule, UsersModule],
})
export class AppModule {}
