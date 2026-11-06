import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { databaseConfig } from '../config/database.config.js';
import { TodosController } from './todos.controller.js';
import { TodosService } from './todos.service.js';

@Module({
  imports: [ConfigModule.forFeature(databaseConfig)],
  controllers: [TodosController],
  providers: [TodosService],
})
export class TodosModule {}
