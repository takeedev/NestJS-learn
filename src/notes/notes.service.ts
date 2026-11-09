import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Note } from './note.entity.js';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private readonly notesRepository: Repository<Note>,
  ) {}

  findAll(): Promise<Note[]> {
    return this.notesRepository.find({ order: { id: 'ASC' } });
  }

  create(content: string): Promise<Note> {
    const note = this.notesRepository.create({ content });
    return this.notesRepository.save(note);
  }
}
