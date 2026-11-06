import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.module.js';

export interface Note {
  id: number;
  content: string;
}

@Injectable()
export class NotesService {
  constructor(private readonly database: DatabaseService) {}

  async findAll(): Promise<Note[]> {
    const { rows } = await this.database.pool.query<Note>(
      'SELECT id, content FROM notes ORDER BY id',
    );
    return rows;
  }

  async create(content: string): Promise<Note> {
    const { rows } = await this.database.pool.query<Note>(
      'INSERT INTO notes (content) VALUES ($1) RETURNING id, content',
      [content],
    );
    return rows[0];
  }
}
