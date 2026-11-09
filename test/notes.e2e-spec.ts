import { randomUUID } from 'node:crypto';
import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import type { App } from 'supertest/types.js';
import { AppModule } from '../src/app.module.js';
import { appEnvironment } from '../src/config/app.config.js';
import { DatabaseService } from '../src/database/database.module.js';

describe.skipIf(process.env.RUN_DB_E2E !== '1')('Notes API (e2e)', () => {
  const content = `Notes E2E ${randomUUID()}`;
  let app: INestApplication<App>;

  beforeAll(async () => {
    if (appEnvironment !== 'local') {
      throw new Error('Run Notes E2E with APP_ENV=local');
    }

    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  it('creates a note and reads it back over HTTP', async () => {
    const api = request(app.getHttpServer());
    try {
      const created = await api.post('/notes').send({ content }).expect(201);
      expect(created.body).toEqual({ id: expect.any(Number), content });

      const list = await api.get('/notes').expect(200);
      expect(list.body).toContainEqual(created.body);
    } finally {
      await app
        .get(DatabaseService)
        .pool.query('DELETE FROM notes WHERE content = $1', [content]);
    }
  });

  it('rejects blank content', async () => {
    await request(app.getHttpServer())
      .post('/notes')
      .send({ content: '   ' })
      .expect(400);
  });
});
