import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module.js';
import { NotesController } from './notes.controller.js';
import { NotesService } from './notes.service.js';

@Module({
  imports: [DatabaseModule],
  controllers: [NotesController],
  providers: [NotesService],
})
export class NotesModule {}
