import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Note } from '../src/notes/note.entity.js';
import { NotesService } from '../src/notes/notes.service.js';

describe('NotesService', () => {
  const repository = {
    find: vi.fn(),
    create: vi.fn(),
    save: vi.fn(),
  };
  let service: NotesService;

  beforeEach(async () => {
    vi.resetAllMocks();
    const module = await Test.createTestingModule({
      providers: [
        NotesService,
        { provide: getRepositoryToken(Note), useValue: repository },
      ],
    }).compile();
    service = module.get(NotesService);
  });

  it('reads notes in ID order', async () => {
    const notes = [{ id: 1, content: 'Learn NestJS' }];
    repository.find.mockResolvedValue(notes);

    await expect(service.findAll()).resolves.toEqual(notes);
    expect(repository.find).toHaveBeenCalledWith({ order: { id: 'ASC' } });
  });

  it('creates a Note entity and returns the saved result', async () => {
    const note = { content: "Today's note" };
    const saved = { id: 1, ...note };
    repository.create.mockReturnValue(note);
    repository.save.mockResolvedValue(saved);

    await expect(service.create(note.content)).resolves.toEqual(saved);
    expect(repository.create).toHaveBeenCalledWith(note);
    expect(repository.save).toHaveBeenCalledWith(note);
  });
});
