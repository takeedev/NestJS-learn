import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.module.js';

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

@Injectable()
export class TodosService {
  constructor(private readonly database: DatabaseService) {}

  async findAll(): Promise<Todo[]> {
    const { rows } = await this.database.pool.query<Todo>(
      'SELECT id, title, completed FROM todos ORDER BY id',
    );
    return rows;
  }

  async findOne(id: number): Promise<Todo> {
    this.validateId(id);
    const { rows } = await this.database.pool.query<Todo>(
      'SELECT id, title, completed FROM todos WHERE id = $1',
      [id],
    );
    return this.requireTodo(rows[0], id);
  }

  async create(title: string): Promise<Todo> {
    const { rows } = await this.database.pool.query<Todo>(
      'INSERT INTO todos (title) VALUES ($1) RETURNING id, title, completed',
      [title],
    );
    return rows[0];
  }

  async update(id: number, title: string, completed: boolean): Promise<Todo> {
    this.validateId(id);
    const { rows } = await this.database.pool.query<Todo>(
      'UPDATE todos SET title = $1, completed = $2 WHERE id = $3 RETURNING id, title, completed',
      [title, completed, id],
    );
    return this.requireTodo(rows[0], id);
  }

  async updateCompleted(id: number, completed: boolean): Promise<Todo> {
    this.validateId(id);
    const { rows } = await this.database.pool.query<Todo>(
      'UPDATE todos SET completed = $1 WHERE id = $2 RETURNING id, title, completed',
      [completed, id],
    );
    return this.requireTodo(rows[0], id);
  }

  async remove(id: number): Promise<void> {
    this.validateId(id);
    const { rowCount } = await this.database.pool.query(
      'DELETE FROM todos WHERE id = $1',
      [id],
    );
    if (rowCount === 0) {
      throw new NotFoundException(`Todo ${id} not found`);
    }
  }

  private validateId(id: number): void {
    // Match the range of the positive PostgreSQL integer IDs.
    if (!Number.isInteger(id) || id < 1 || id > 2_147_483_647) {
      throw new NotFoundException(`Todo ${id} not found`);
    }
  }

  private requireTodo(todo: Todo | undefined, id: number): Todo {
    if (!todo) {
      throw new NotFoundException(`Todo ${id} not found`);
    }
    return todo;
  }
}
