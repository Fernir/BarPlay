import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { SongsService } from './songs.service';
import { CreateSongDto, UpdateSongDto } from './dto/song.dto';

@ApiTags('songs')
@Controller('api/songs')
export class SongsController {
  constructor(private readonly songsService: SongsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Создать новую песню',
    description: 'Добавляет песню с аккордами в базу',
  })
  @ApiResponse({ status: 201, description: 'Песня успешно создана' })
  @ApiResponse({ status: 400, description: 'Некорректные данные' })
  @ApiBody({ type: CreateSongDto })
  async create(@Body() createSongDto: CreateSongDto, @Req() req: any) {
    const userId = req.user.userId;
    return this.songsService.create(userId, createSongDto);
  }

  @Get('artists/grouped')
  @ApiOperation({
    summary: 'Получить группированных исполнителей',
    description: 'Возвращает список исполнителей с группировкой похожих имен',
  })
  @ApiResponse({ status: 200, description: 'Список исполнителей получен' })
  async getGroupedArtists() {
    return this.songsService.getGroupedArtists();
  }

  @Get()
  @ApiOperation({ summary: 'Получить все песни', description: 'Возвращает список всех песен' })
  @ApiResponse({ status: 200, description: 'Список песен получен' })
  @ApiQuery({ name: 'search', required: false, description: 'Поиск по названию или исполнителю' })
  async findAll(@Query('search') search?: string) {
    return this.songsService.findAll(1, 20, search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить песню по ID' })
  @ApiParam({ name: 'id', description: 'ID песни' })
  @ApiResponse({ status: 200, description: 'Песня найдена' })
  @ApiResponse({ status: 404, description: 'Песня не найдена' })
  async findOne(@Param('id') id: string, @Req() req: any) {
    const song = await this.songsService.findOne(id, req);
    if (!song) {
      return { message: 'Song not found', statusCode: 404 };
    }
    return song;
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновить песню' })
  @ApiParam({ name: 'id', description: 'ID песни' })
  @ApiResponse({ status: 200, description: 'Песня обновлена' })
  @ApiResponse({ status: 404, description: 'Песня не найдена' })
  async update(@Param('id') id: string, @Body() updateSongDto: UpdateSongDto, @Req() req: any) {
    const userId = req.user.userId;
    const userRole = req.user.role;
    const song = await this.songsService.update(id, userId, updateSongDto, userRole);
    if (!song) {
      return { message: 'Song not found', statusCode: 404 };
    }
    return song;
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Удалить песню' })
  @ApiParam({ name: 'id', description: 'ID песни' })
  @ApiResponse({ status: 200, description: 'Песня удалена' })
  @ApiResponse({ status: 404, description: 'Песня не найдена' })
  async remove(@Param('id') id: string, @Req() req: any) {
    const userId = req.user.userId;
    const userRole = req.user.role;
    const song = await this.songsService.delete(id, userId, userRole);
    if (!song) {
      return { message: 'Song not found', statusCode: 404 };
    }
    return { message: 'Song deleted successfully' };
  }

  @Post(':id/like')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Лайкнуть песню' })
  @ApiParam({ name: 'id', description: 'ID песни' })
  async toggleLike(@Param('id') id: string, @Req() req: any) {
    const userId = req.user.userId;
    return this.songsService.toggleLike(id, userId);
  }
}
