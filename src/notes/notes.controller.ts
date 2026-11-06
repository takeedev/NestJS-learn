import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { NotesService } from './notes.service.js';

@ApiTags('Notes')
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get()
  findAll() {
    return this.notesService.findAll();
  }

  @Post()
  @ApiBody({
    schema: {
      type: 'object',
      required: ['content'],
      properties: {
        content: { type: 'string', example: 'ฝึกทำ API ด้วย NestJS' },
      },
    },
  })
  create(@Body('content') content: unknown) {
    if (
      typeof content !== 'string' ||
      !content.trim() ||
      content.includes('\0')
    ) {
      throw new BadRequestException(
        'content must be a non-empty string without null characters',
      );
    }
    return this.notesService.create(content.trim());
  }
}
