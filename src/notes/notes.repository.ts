import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Note } from './note.entity.js';

@Injectable()
export class NotesRepository {
  constructor(
    @InjectRepository(Note)
    private readonly repository: Repository<Note>,
  ) {}

  findAll(): Promise<Note[]> {
    return this.repository.find({ order: { id: 'ASC' } });
  }

  create(content: string): Promise<Note> {
    const note = this.repository.create({ content });
    return this.repository.save(note);
  }
}
