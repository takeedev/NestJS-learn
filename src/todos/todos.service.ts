import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './todo.entity.js';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo)
    private readonly todosRepository: Repository<Todo>,
  ) {}

  findAll(): Promise<Todo[]> {
    return this.todosRepository.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number): Promise<Todo> {
    this.validateId(id);
    return this.requireTodo(await this.todosRepository.findOneBy({ id }), id);
  }

  create(title: string): Promise<Todo> {
    const todo = this.todosRepository.create({ title, completed: false });
    return this.todosRepository.save(todo);
  }

  update(id: number, title: string, completed: boolean): Promise<Todo> {
    return this.updateFields(id, { title, completed });
  }

  updateCompleted(id: number, completed: boolean): Promise<Todo> {
    return this.updateFields(id, { completed });
  }

  async remove(id: number): Promise<void> {
    this.validateId(id);
    const { affected } = await this.todosRepository.delete(id);
    if (affected === 0) {
      throw new NotFoundException(`Todo ${id} not found`);
    }
  }

  private async updateFields(
    id: number,
    fields: Partial<Pick<Todo, 'title' | 'completed'>>,
  ): Promise<Todo> {
    this.validateId(id);
    const result = await this.todosRepository.update(id, fields, {
      returning: ['id', 'title', 'completed'],
    });
    const [todo] = result.raw as Todo[];
    return this.requireTodo(todo, id);
  }

  private validateId(id: number): void {
    // Match the range of the positive PostgreSQL integer IDs.
    if (!Number.isInteger(id) || id < 1 || id > 2_147_483_647) {
      throw new NotFoundException(`Todo ${id} not found`);
    }
  }

  private requireTodo(todo: Todo | null | undefined, id: number): Todo {
    if (!todo) {
      throw new NotFoundException(`Todo ${id} not found`);
    }
    return todo;
  }
}
