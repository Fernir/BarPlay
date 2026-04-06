import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Difficulty } from '@prisma/client';

export class CreateSongDto {
  @ApiProperty({ example: 'Hotel California', description: 'Название песни' })
  title: string;

  @ApiProperty({ example: 'Eagles', description: 'Исполнитель' })
  artist: string;

  @ApiProperty({
    example: '[Am]On a dark desert highway\n[Em]Cool wind in my hair',
    description: 'Текст песни с аккордами в формате [Аккорд]текст',
  })
  lyrics: string;

  @ApiProperty({ example: 'Am', description: 'Тональность песни' })
  key: string;

  @ApiPropertyOptional({ example: 'MEDIUM', description: 'Сложность: BEGINNER, MEDIUM, ADVANCED' })
  difficulty?: Difficulty;
}

export class UpdateSongDto {
  @ApiPropertyOptional({ example: 'Hotel California', description: 'Название песни' })
  title?: string;

  @ApiPropertyOptional({ example: 'Eagles', description: 'Исполнитель' })
  artist?: string;

  @ApiPropertyOptional({ description: 'Текст песни с аккордами' })
  lyrics?: string;

  @ApiPropertyOptional({ example: 'Am', description: 'Тональность песни' })
  key?: string;

  @ApiPropertyOptional({ example: 'MEDIUM', description: 'Сложность' })
  difficulty?: Difficulty;
}
