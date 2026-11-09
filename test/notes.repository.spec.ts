import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Note } from '../src/notes/note.entity.js';
import { NotesRepository } from '../src/notes/notes.repository.js';

describe('NotesRepository', () => {
  const typeOrmRepository = {
    find: vi.fn(),
    create: vi.fn(),
    save: vi.fn(),
  };
  let notesRepository: NotesRepository;

  beforeEach(async () => {
    vi.resetAllMocks();
    const module = await Test.createTestingModule({
      providers: [
        NotesRepository,
        { provide: getRepositoryToken(Note), useValue: typeOrmRepository },
      ],
    }).compile();
    notesRepository = module.get(NotesRepository);
  });

  it('reads notes in ID order', async () => {
    const notes = [{ id: 1, content: 'Learn NestJS' }];
    typeOrmRepository.find.mockResolvedValue(notes);

    await expect(notesRepository.findAll()).resolves.toEqual(notes);
    expect(typeOrmRepository.find).toHaveBeenCalledWith({
      order: { id: 'ASC' },
    });
  });

  it('creates a Note entity and returns the saved result', async () => {
    const note = { content: "Today's note" };
    const saved = { id: 1, ...note };
    typeOrmRepository.create.mockReturnValue(note);
    typeOrmRepository.save.mockResolvedValue(saved);

    await expect(notesRepository.create(note.content)).resolves.toEqual(saved);
    expect(typeOrmRepository.create).toHaveBeenCalledWith(note);
    expect(typeOrmRepository.save).toHaveBeenCalledWith(note);
  });
});
