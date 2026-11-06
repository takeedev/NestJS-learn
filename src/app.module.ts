import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { envFilePath } from './config/app-environment.js';
import { DatabaseModule } from './database/database.module.js';
import { NotesModule } from './notes/notes.module.js';
import { TodosModule } from './todos/todos.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath }),
    DatabaseModule,
    TodosModule,
    NotesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
