import {
  Injectable,
  Logger,
  NotFoundException,
  type OnModuleDestroy,
} from '@nestjs/common';
import { Pool } from 'pg';
import { getDatabaseConfig } from '../config/database.config.js';

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

@Injectable()
export class TodosService implements OnModuleDestroy {
  private readonly logger = new Logger(TodosService.name);
  private readonly pool = new Pool(getDatabaseConfig());

  constructor() {
    this.pool.on('error', (error) => {
      this.logger.error('Idle PostgreSQL connection failed', error.stack);
    });
  }

  async onModuleDestroy(): Promise<void> {
    await this.pool.end();
  }

  async findAll(): Promise<Todo[]> {
    const { rows } = await this.pool.query<Todo>(
      'SELECT id, title, completed FROM todos ORDER BY id',
    );
    return rows;
  }

  async findOne(id: number): Promise<Todo> {
    this.validateId(id);
    const { rows } = await this.pool.query<Todo>(
      'SELECT id, title, completed FROM todos WHERE id = $1',
      [id],
    );
    return this.requireTodo(rows[0], id);
  }

  async create(title: string): Promise<Todo> {
    const { rows } = await this.pool.query<Todo>(
      'INSERT INTO todos (title) VALUES ($1) RETURNING id, title, completed',
      [title],
    );
    return rows[0];
  }

  async update(id: number, title: string, completed: boolean): Promise<Todo> {
    this.validateId(id);
    const { rows } = await this.pool.query<Todo>(
      'UPDATE todos SET title = $1, completed = $2 WHERE id = $3 RETURNING id, title, completed',
      [title, completed, id],
    );
    return this.requireTodo(rows[0], id);
  }

  async remove(id: number): Promise<void> {
    this.validateId(id);
    const { rowCount } = await this.pool.query(
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
