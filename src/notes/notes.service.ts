import { Injectable } from '@nestjs/common';
import type { Note } from './note.entity.js';
import { NotesRepository } from './notes.repository.js';

@Injectable()
export class NotesService {
  constructor(private readonly notesRepository: NotesRepository) {}

  findAll(): Promise<Note[]> {
    return this.notesRepository.findAll();
  }

  create(content: string): Promise<Note> {
    return this.notesRepository.create(content);
  }
}
