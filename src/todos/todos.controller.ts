import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { TodosService } from './todos.service.js';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Get()
  findAll() {
    return this.todosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.todosService.findOne(id);
  }

  @Post()
  create(@Body('title') title: unknown) {
    return this.todosService.create(this.validateTitle(title));
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body('title') title: unknown,
    @Body('completed') completed: unknown,
  ) {
    if (typeof completed !== 'boolean') {
      throw new BadRequestException('completed must be a boolean');
    }

    return this.todosService.update(id, this.validateTitle(title), completed);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.todosService.remove(id);
  }

  private validateTitle(title: unknown): string {
    if (typeof title !== 'string' || !title.trim()) {
      throw new BadRequestException('title must be a non-empty string');
    }
    if (title.includes('\0')) {
      throw new BadRequestException('title cannot contain a null character');
    }
    return title.trim();
  }
}
