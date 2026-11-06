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
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { TodosService } from './todos.service.js';

@ApiTags('Todos')
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
  @ApiBody({
    schema: {
      type: 'object',
      required: ['title'],
      properties: {
        title: { type: 'string', example: 'ฝึก NestJS' },
      },
    },
  })
  create(@Body('title') title: unknown) {
    return this.todosService.create(this.validateTitle(title));
  }

  @Put(':id')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['title', 'completed'],
      properties: {
        title: { type: 'string', example: 'ฝึก NestJS' },
        completed: { type: 'boolean', example: true },
      },
    },
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body('title') title: unknown,
    @Body('completed') completed: unknown,
  ) {
    const status = this.validateCompleted(completed);
    return this.todosService.update(id, this.validateTitle(title), status);
  }

  @Patch(':id/completed')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['completed'],
      properties: {
        completed: { type: 'boolean', example: true },
      },
    },
  })
  updateCompleted(
    @Param('id', ParseIntPipe) id: number,
    @Body('completed') completed: unknown,
  ) {
    return this.todosService.updateCompleted(
      id,
      this.validateCompleted(completed),
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.todosService.remove(id);
  }

  private validateCompleted(completed: unknown): boolean {
    if (typeof completed !== 'boolean') {
      throw new BadRequestException('completed must be a boolean');
    }
    return completed;
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
