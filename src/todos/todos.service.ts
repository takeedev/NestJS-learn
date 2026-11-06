import { Injectable, NotFoundException } from '@nestjs/common';

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

@Injectable()
export class TodosService {
  private readonly todos = new Map<number, Todo>();
  private nextId = 1;

  findAll(): Todo[] {
    return [...this.todos.values()];
  }

  findOne(id: number): Todo {
    const todo = this.todos.get(id);
    if (!todo) {
      throw new NotFoundException(`Todo ${id} not found`);
    }
    return todo;
  }

  create(title: string): Todo {
    const todo = { id: this.nextId++, title, completed: false };
    this.todos.set(todo.id, todo);
    return todo;
  }

  update(id: number, title: string, completed: boolean): Todo {
    this.findOne(id);
    const todo = { id, title, completed };
    this.todos.set(id, todo);
    return todo;
  }

  remove(id: number): void {
    if (!this.todos.delete(id)) {
      throw new NotFoundException(`Todo ${id} not found`);
    }
  }
}
