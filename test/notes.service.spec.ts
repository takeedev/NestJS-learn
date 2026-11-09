import { Test } from '@nestjs/testing';
import { DatabaseService } from '../src/database/database.module.js';
import { NotesService } from '../src/notes/notes.service.js';

describe('NotesService', () => {
  const query = vi.fn();
  let service: NotesService;

  beforeEach(async () => {
    query.mockReset();
    const module = await Test.createTestingModule({
      providers: [
        NotesService,
        { provide: DatabaseService, useValue: { pool: { query } } },
      ],
    }).compile();
    service = module.get(NotesService);
  });

  it('returns the notes read from PostgreSQL', async () => {
    const notes = [{ id: 1, content: 'Learn NestJS' }];
    query.mockResolvedValue({ rows: notes });

    await expect(service.findAll()).resolves.toEqual(notes);
  });

  it('passes the note content as a SQL parameter and returns the saved row', async () => {
    const note = { id: 1, content: "Today's note" };
    query.mockResolvedValue({ rows: [note] });

    await expect(service.create(note.content)).resolves.toEqual(note);
    expect(query).toHaveBeenCalledWith(expect.stringContaining('VALUES ($1)'), [
      note.content,
    ]);
  });
});
