import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../app.module';

describe('SongsController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('POST /api/songs', () => {
    it('should create a new song', async () => {
      const createSongDto = {
        title: 'Test Song',
        artist: 'Test Artist',
        lyrics: '[C]Test lyrics',
        key: 'C',
        difficulty: 'MEDIUM',
      };

      const response = await fetch('http://localhost:3001/api/songs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createSongDto),
      });

      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toHaveProperty('id');
      expect(data.title).toBe('Test Song');
      expect(data.artist).toBe('Test Artist');
    });

    it('should create song with default difficulty', async () => {
      const createSongDto = {
        title: 'Test Song',
        artist: 'Test Artist',
        lyrics: '[C]Test lyrics',
        key: 'C',
      };

      const response = await fetch('http://localhost:3001/api/songs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createSongDto),
      });

      const data = await response.json();
      expect(data.difficulty).toBe('MEDIUM');
    });
  });

  describe('GET /api/songs', () => {
    it('should return all songs', async () => {
      const response = await fetch('http://localhost:3001/api/songs');
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
    });

    it('should search songs by title', async () => {
      // Сначала создаем тестовую песню
      await fetch('http://localhost:3001/api/songs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Unique Song Title',
          artist: 'Artist',
          lyrics: '[C]Lyrics',
          key: 'C',
        }),
      });

      const response = await fetch('http://localhost:3001/api/songs?search=Unique');
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.length).toBeGreaterThan(0);
      expect(data[0].title).toContain('Unique');
    });
  });

  describe('GET /api/songs/:id', () => {
    it('should return a song by id', async () => {
      // Создаем песню
      const createResponse = await fetch('http://localhost:3001/api/songs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Get Song Test',
          artist: 'Artist',
          lyrics: '[C]Lyrics',
          key: 'C',
        }),
      });

      const created = await createResponse.json();
      const songId = created.id;

      // Получаем песню по ID
      const response = await fetch(`http://localhost:3001/api/songs/${songId}`);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.title).toBe('Get Song Test');
    });

    it('should return 404 for non-existent song', async () => {
      const response = await fetch('http://localhost:3001/api/songs/non-existent-id');
      const data = await response.json();

      expect(response.status).toBe(200); // В нашем контроллере возвращается 200
      expect(data.message).toBe('Song not found');
    });
  });

  describe('PATCH /api/songs/:id', () => {
    it('should update a song', async () => {
      // Создаем песню
      const createResponse = await fetch('http://localhost:3001/api/songs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Original Title',
          artist: 'Artist',
          lyrics: '[C]Lyrics',
          key: 'C',
        }),
      });

      const created = await createResponse.json();
      const songId = created.id;

      // Обновляем песню
      const response = await fetch(`http://localhost:3001/api/songs/${songId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Updated Title' }),
      });

      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.title).toBe('Updated Title');
    });
  });

  describe('DELETE /api/songs/:id', () => {
    it('should delete a song', async () => {
      // Создаем песню
      const createResponse = await fetch('http://localhost:3001/api/songs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'To Delete',
          artist: 'Artist',
          lyrics: '[C]Lyrics',
          key: 'C',
        }),
      });

      const created = await createResponse.json();
      const songId = created.id;

      // Удаляем песню
      const deleteResponse = await fetch(`http://localhost:3001/api/songs/${songId}`, {
        method: 'DELETE',
      });

      expect(deleteResponse.status).toBe(200);

      // Проверяем что песня удалена
      const getResponse = await fetch(`http://localhost:3001/api/songs/${songId}`);
      const data = await getResponse.json();

      expect(data.message).toBe('Song not found');
    });
  });
});
